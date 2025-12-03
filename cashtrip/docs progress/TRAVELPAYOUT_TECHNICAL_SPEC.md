# Especificação Técnica: Travelpayout API Integration

**Documento Técnico Detalhado**  
**Data:** 2025-12-02  
**Versão:** 1.0

---

## 📐 Arquitetura da Solução

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (NewTripChat.tsx)                   │
│  Usuário informa: "Rio de Janeiro, 15-20 dezembro, R$ 5000"    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AGENT API (/api/chat/route.ts)                 │
│  Claude Sonnet 4.5 decide chamar tool: search_flights          │
│  Input: { origin: "São Paulo", destination: "Rio", ... }       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              TRAVELPAYOUT LIB (lib/travelpayout.ts)             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FASE 1: getCityIataCode("São Paulo") → "GRU"            │  │
│  │         getCityIataCode("Rio de Janeiro") → "RIO"       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FASE 2: calculateMD5Signature(params)                   │  │
│  │         startFlightSearch() → { search_id, results_url }│  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FASE 3: pollFlightResults() [Loop até is_over: true]   │  │
│  │         Retorna: proposals[] (voos encontrados)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ TRANSFORMAÇÃO: proposals → FlightOffer[]                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RETORNO PARA FRONTEND                        │
│  { results: FlightOffer[], error?: string }                    │
│  Frontend exibe SelectionButton para cada voo                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Implementação Completa: `lib/travelpayout.ts`

### Estrutura Completa do Arquivo

```typescript
import { createHash } from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Interface compatível com o formato atual do Amadeus
 * CRÍTICO: Não alterar esta interface para manter compatibilidade com frontend
 */
export interface FlightOffer {
    id: string;
    airline: string;
    flightNumber: string;
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    duration: string;
    price: { currency: string; total: string };
    stops: number;
    link?: string;
}

/**
 * Resposta da API de autocomplete do Travelpayout
 */
interface AutocompletePlace {
    id: string;
    type: string;
    code: string;
    name: string;
    country_code: string;
    country_name: string;
}

/**
 * Parâmetros para iniciar busca de voos
 */
interface SearchParams {
    origin: string;
    destination: string;
    depart_date: string;
    return_date: string | null;
    adults: number;
    children: number;
    infants: number;
    trip_class: 'Y' | 'C' | 'F'; // Y=Economy, C=Business, F=First
    marker: string;
}

/**
 * Resposta do endpoint de início de busca
 */
interface StartSearchResponse {
    search_id: string;
    results_url: string;
}

/**
 * Proposta de voo do Travelpayout
 */
interface TravelpayoutProposal {
    id: string;
    terms: {
        price: {
            total: string;
            currency: string;
        };
    };
    segment: Array<{
        operating_carrier: string;
        marketing_carrier?: string;
        flight_number: string;
        departure: string;
        arrival: string;
        departure_time: string;
        arrival_time: string;
        duration: number; // em minutos
    }>;
    gates_info: Array<{
        label: string;
        url: string;
    }>;
}

/**
 * Resposta do polling de resultados
 */
interface PollResultsResponse {
    is_over: boolean;
    proposals?: TravelpayoutProposal[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AUTOCOMPLETE_URL = 'http://autocomplete.travelpayouts.com/places2';
const START_SEARCH_URL = 'https://tickets-api.travelpayouts.com/search/affiliate/start';
const MAX_POLL_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 2000; // 2 segundos

// Mapeamento de códigos IATA para nomes de companhias aéreas
const AIRLINE_NAMES: Record<string, string> = {
    'LA': 'LATAM Airlines',
    'G3': 'GOL Linhas Aéreas',
    'AD': 'Azul Linhas Aéreas',
    'TP': 'TAP Air Portugal',
    'AA': 'American Airlines',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
    'AF': 'Air France',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'IB': 'Iberia',
    'KL': 'KLM',
    'AV': 'Avianca',
    'CM': 'Copa Airlines',
    'AR': 'Aerolíneas Argentinas',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gera um ID único baseado em hash MD5
 */
function generateId(str: string): string {
    return createHash('md5').update(str).digest('hex').substring(0, 12);
}

/**
 * Converte duração em minutos para formato ISO 8601 (PT)
 * Exemplo: 210 minutos → "PT3H30M"
 */
function minutesToDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
        return `PT${hours}H${mins}M`;
    } else if (hours > 0) {
        return `PT${hours}H`;
    } else {
        return `PT${mins}M`;
    }
}

/**
 * Obtém o nome da companhia aérea a partir do código IATA
 */
function getAirlineName(code: string): string {
    return AIRLINE_NAMES[code] || code;
}

// ============================================================================
// FASE 1: CONVERSÃO DE CÓDIGOS IATA
// ============================================================================

/**
 * Converte nome de cidade para código IATA usando a API de autocomplete
 * 
 * @param cityName - Nome da cidade (ex: "São Paulo", "Rio de Janeiro")
 * @returns Código IATA de 3 letras (ex: "GRU", "RIO") ou null se não encontrado
 */
async function getCityIataCode(cityName: string): Promise<string | null> {
    try {
        const url = `${AUTOCOMPLETE_URL}?term=${encodeURIComponent(cityName)}&locale=pt&types[]=city`;
        
        console.log(`[Travelpayout] Buscando código IATA para: ${cityName}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[Travelpayout] Erro ao buscar IATA: ${response.status}`);
            return null;
        }

        const data: AutocompletePlace[] = await response.json();
        
        if (!data || data.length === 0) {
            console.warn(`[Travelpayout] Nenhum resultado para: ${cityName}`);
            return null;
        }

        // Pegar o primeiro resultado (mais relevante)
        const iataCode = data[0].code;
        console.log(`[Travelpayout] ${cityName} → ${iataCode}`);
        
        return iataCode;

    } catch (error) {
        console.error(`[Travelpayout] Exceção ao buscar IATA:`, error);
        return null;
    }
}

// ============================================================================
// FASE 2: AUTENTICAÇÃO E INÍCIO DE BUSCA
// ============================================================================

/**
 * Calcula a assinatura MD5 para autenticação
 * 
 * Algoritmo:
 * 1. Ordenar parâmetros alfabeticamente por chave
 * 2. Extrair valores na ordem
 * 3. Concatenar: TOKEN + ":" + valores.join("")
 * 4. Calcular MD5
 * 
 * @param params - Parâmetros da busca
 * @returns Hash MD5 em hexadecimal
 */
function calculateMD5Signature(params: SearchParams): string {
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;
    
    if (!token) {
        throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
    }

    // Ordenar alfabeticamente e extrair valores
    const orderedValues = [
        params.adults,
        params.children,
        params.depart_date,
        params.destination,
        params.infants,
        params.marker,
        params.origin,
        params.return_date || '',
        params.trip_class,
    ];

    // Concatenar token + ":" + valores
    const signatureString = `${token}:${orderedValues.join('')}`;
    
    // Calcular MD5
    const signature = createHash('md5').update(signatureString).digest('hex');
    
    console.log('[Travelpayout] MD5 Signature calculado');
    
    return signature;
}

/**
 * Inicia a busca de voos no Travelpayout
 * 
 * @param params - Parâmetros da busca
 * @returns search_id e results_url para polling
 */
async function startFlightSearch(params: SearchParams): Promise<StartSearchResponse> {
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;
    
    if (!token) {
        throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
    }

    const signature = calculateMD5Signature(params);

    const body = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        return_date: params.return_date,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        trip_class: params.trip_class,
        marker: params.marker,
    };

    console.log('[Travelpayout] Iniciando busca de voos...');
    console.log('[Travelpayout] Params:', JSON.stringify(body, null, 2));

    const response = await fetch(START_SEARCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-signature': signature,
            'x-affiliate-user-id': token,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao iniciar busca: ${response.status} - ${errorText}`);
    }

    const data: StartSearchResponse = await response.json();
    
    console.log('[Travelpayout] Busca iniciada:', data.search_id);
    
    return data;
}

// ============================================================================
// FASE 3: POLLING DE RESULTADOS
// ============================================================================

/**
 * Faz polling dos resultados até a busca estar completa
 * 
 * @param searchId - ID da busca retornado pela Fase 2
 * @param resultsUrl - URL base para polling
 * @returns Array de propostas de voo
 */
async function pollFlightResults(
    searchId: string,
    resultsUrl: string
): Promise<TravelpayoutProposal[]> {
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;
    
    if (!token) {
        throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
    }

    const pollUrl = `${resultsUrl}/search/affiliate/results`;
    let attempts = 0;

    console.log('[Travelpayout] Iniciando polling de resultados...');

    while (attempts < MAX_POLL_ATTEMPTS) {
        attempts++;
        
        console.log(`[Travelpayout] Tentativa ${attempts}/${MAX_POLL_ATTEMPTS}`);

        try {
            const response = await fetch(pollUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-affiliate-user-id': token,
                },
                body: JSON.stringify({ search_id: searchId }),
            });

            if (!response.ok) {
                console.warn(`[Travelpayout] Erro no polling: ${response.status}`);
                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
                continue;
            }

            const data: PollResultsResponse = await response.json();

            if (data.is_over === true) {
                console.log('[Travelpayout] Busca completa!');
                console.log(`[Travelpayout] Encontrados ${data.proposals?.length || 0} voos`);
                return data.proposals || [];
            }

            // Aguardar antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

        } catch (error) {
            console.error(`[Travelpayout] Erro na tentativa ${attempts}:`, error);
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
        }
    }

    throw new Error('Tempo limite excedido ao buscar voos. Tente novamente.');
}

// ============================================================================
// TRANSFORMAÇÃO DE DADOS
// ============================================================================

/**
 * Transforma proposta do Travelpayout para formato FlightOffer
 * 
 * @param proposal - Proposta do Travelpayout
 * @returns FlightOffer compatível com frontend
 */
function transformTravelpayoutToFlightOffer(proposal: TravelpayoutProposal): FlightOffer {
    const firstSegment = proposal.segment[0];
    const lastSegment = proposal.segment[proposal.segment.length - 1];
    
    // Calcular duração total
    const totalDuration = proposal.segment.reduce((sum, seg) => sum + seg.duration, 0);
    
    // Número de paradas (segmentos - 1)
    const stops = proposal.segment.length - 1;
    
    // Obter link de reserva (primeira opção)
    const bookingLink = proposal.gates_info?.[0]?.url || undefined;
    
    // Código da companhia aérea
    const carrierCode = firstSegment.operating_carrier || firstSegment.marketing_carrier || 'XX';
    
    return {
        id: proposal.id,
        airline: getAirlineName(carrierCode),
        flightNumber: `${carrierCode}${firstSegment.flight_number}`,
        departure: {
            iataCode: firstSegment.departure,
            at: firstSegment.departure_time,
        },
        arrival: {
            iataCode: lastSegment.arrival,
            at: lastSegment.arrival_time,
        },
        duration: minutesToDuration(totalDuration),
        price: {
            currency: proposal.terms.price.currency,
            total: proposal.terms.price.total,
        },
        stops,
        link: bookingLink,
    };
}

// ============================================================================
// FUNÇÃO PRINCIPAL (COMPATÍVEL COM AMADEUS)
// ============================================================================

/**
 * Busca voos usando a API Travelpayout
 * 
 * IMPORTANTE: Esta função mantém a mesma assinatura da função searchFlights
 * do Amadeus para garantir compatibilidade com o código existente.
 * 
 * @param origin - Nome da cidade de origem (ex: "São Paulo")
 * @param destination - Nome da cidade de destino (ex: "Rio de Janeiro")
 * @param departureDate - Data de partida no formato YYYY-MM-DD
 * @param adults - Número de adultos (padrão: 1)
 * @param preferences - Preferências adicionais (budget_max, etc.)
 * @returns Objeto com array de resultados e possível erro
 */
export async function searchFlights(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number = 1,
    preferences?: any
): Promise<{ results: FlightOffer[], error?: string }> {
    
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;
    const marker = process.env.TRAVELPAYOUTS_MARKER || '688645';

    // ========================================================================
    // MODO DE DESENVOLVIMENTO (MOCK DATA)
    // ========================================================================
    
    if (isDevMode || !token) {
        console.log('[Travelpayout] Usando dados MOCK (Dev Mode)');
        
        const mockFlights: FlightOffer[] = [
            {
                id: generateId(`LATAM-${destination}-1`),
                airline: 'LATAM Airlines',
                flightNumber: 'LA3456',
                departure: { iataCode: 'GRU', at: `${departureDate}T08:00:00` },
                arrival: { iataCode: 'GIG', at: `${departureDate}T11:30:00` },
                duration: 'PT3H30M',
                price: { currency: 'BRL', total: '1250.00' },
                stops: 0,
                link: 'https://www.latamairlines.com/br/pt/ofertas-voos'
            },
            {
                id: generateId(`GOL-${destination}-1`),
                airline: 'GOL Linhas Aéreas',
                flightNumber: 'G31234',
                departure: { iataCode: 'GRU', at: `${departureDate}T14:00:00` },
                arrival: { iataCode: 'GIG', at: `${departureDate}T17:45:00` },
                duration: 'PT3H45M',
                price: { currency: 'BRL', total: '1100.00' },
                stops: 0,
                link: 'https://www.voegol.com.br/ofertas'
            },
            {
                id: generateId(`AZUL-${destination}-1`),
                airline: 'Azul Linhas Aéreas',
                flightNumber: 'AD5678',
                departure: { iataCode: 'GRU', at: `${departureDate}T09:30:00` },
                arrival: { iataCode: 'GIG', at: `${departureDate}T14:00:00` },
                duration: 'PT4H30M',
                price: { currency: 'BRL', total: '1450.00' },
                stops: 1,
                link: 'https://www.voeazul.com.br/passagens-aereas'
            }
        ];

        // Filtrar por orçamento se fornecido
        let filtered = mockFlights;
        if (preferences?.budget_max) {
            filtered = filtered.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
        }

        return { results: filtered };
    }

    // ========================================================================
    // CHAMADA REAL À API TRAVELPAYOUT
    // ========================================================================

    try {
        console.log('[Travelpayout] ===== INICIANDO BUSCA REAL =====');
        console.log(`[Travelpayout] Origem: ${origin}`);
        console.log(`[Travelpayout] Destino: ${destination}`);
        console.log(`[Travelpayout] Data: ${departureDate}`);
        console.log(`[Travelpayout] Adultos: ${adults}`);

        // FASE 1: Converter nomes de cidades para códigos IATA
        const originIata = await getCityIataCode(origin);
        const destinationIata = await getCityIataCode(destination);

        if (!originIata) {
            return {
                results: [],
                error: `Não foi possível encontrar o aeroporto para: ${origin}`
            };
        }

        if (!destinationIata) {
            return {
                results: [],
                error: `Não foi possível encontrar o aeroporto para: ${destination}`
            };
        }

        // FASE 2: Iniciar busca
        const searchParams: SearchParams = {
            origin: originIata,
            destination: destinationIata,
            depart_date: departureDate,
            return_date: null, // Apenas ida
            adults: adults,
            children: 0,
            infants: 0,
            trip_class: 'Y', // Economy
            marker: marker,
        };

        const { search_id, results_url } = await startFlightSearch(searchParams);

        // FASE 3: Polling de resultados
        const proposals = await pollFlightResults(search_id, results_url);

        if (!proposals || proposals.length === 0) {
            return {
                results: [],
                error: 'Nenhum voo encontrado para esta rota e data.'
            };
        }

        // TRANSFORMAÇÃO: Converter para FlightOffer[]
        let offers: FlightOffer[] = proposals.map(transformTravelpayoutToFlightOffer);

        // Filtrar por orçamento se fornecido
        if (preferences?.budget_max) {
            offers = offers.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
        }

        // Ordenar por preço (mais barato primeiro)
        offers.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

        // Retornar top 5
        const topOffers = offers.slice(0, 5);

        console.log(`[Travelpayout] ===== BUSCA CONCLUÍDA =====`);
        console.log(`[Travelpayout] Retornando ${topOffers.length} voos`);

        return { results: topOffers };

    } catch (error: any) {
        console.error('[Travelpayout] ERRO:', error);
        return {
            results: [],
            error: error.message || 'Erro ao buscar voos. Tente novamente.'
        };
    }
}
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Busca Simples

```typescript
import { searchFlights } from '@/lib/travelpayout';

const result = await searchFlights(
    'São Paulo',
    'Rio de Janeiro',
    '2025-12-15',
    1
);

if (result.error) {
    console.error('Erro:', result.error);
} else {
    console.log(`Encontrados ${result.results.length} voos`);
    result.results.forEach(flight => {
        console.log(`${flight.airline} - R$ ${flight.price.total}`);
    });
}
```

### Exemplo 2: Com Filtro de Orçamento

```typescript
const result = await searchFlights(
    'São Paulo',
    'Salvador',
    '2025-12-20',
    2,
    { budget_max: 2000 } // Máximo R$ 2000 por pessoa
);
```

### Exemplo 3: Tratamento de Erros

```typescript
try {
    const result = await searchFlights('Cidade Inexistente', 'Rio', '2025-12-15', 1);
    
    if (result.error) {
        // Exibir mensagem amigável ao usuário
        alert(result.error);
    } else {
        // Processar resultados
        displayFlights(result.results);
    }
} catch (error) {
    console.error('Erro fatal:', error);
    alert('Erro ao buscar voos. Tente novamente mais tarde.');
}
```

---

## 🔧 Configuração de Variáveis de Ambiente

### Arquivo: `.env.local`

```env
# ============================================================================
# TRAVELPAYOUT API CONFIGURATION
# ============================================================================

# Token secreto para assinatura MD5 e autenticação
# IMPORTANTE: Nunca commitar este arquivo no Git
TRAVELPAYOUTS_API_TOKEN=3f87cccd98047d6192675ac6756c7a40

# ID de afiliado (marker)
TRAVELPAYOUTS_MARKER=688645

# ============================================================================
# DEVELOPMENT MODE
# ============================================================================

# Se true, usa dados mock sem chamar APIs reais
# Útil para desenvolvimento local sem gastar créditos de API
NEXT_PUBLIC_DEV_MODE=false

# ============================================================================
# AMADEUS API (MANTIDO PARA HOTÉIS)
# ============================================================================

AMADEUS_API_KEY=your_amadeus_key_here
AMADEUS_API_SECRET=your_amadeus_secret_here
```

---

## 🧪 Cenários de Teste

### Teste 1: Rotas Domésticas Brasileiras

```typescript
// São Paulo → Rio de Janeiro
await searchFlights('São Paulo', 'Rio de Janeiro', '2025-12-15', 1);
// Esperado: GRU → GIG, múltiplas opções (LATAM, GOL, Azul)

// São Paulo → Salvador
await searchFlights('São Paulo', 'Salvador', '2025-12-20', 2);
// Esperado: GRU → SSA

// Rio → Brasília
await searchFlights('Rio de Janeiro', 'Brasília', '2025-12-25', 1);
// Esperado: GIG → BSB
```

### Teste 2: Cidades com Múltiplos Aeroportos

```typescript
// São Paulo pode retornar GRU (Guarulhos) ou CGH (Congonhas)
await searchFlights('São Paulo', 'Porto Alegre', '2026-01-10', 1);
// Verificar qual aeroporto foi selecionado
```

### Teste 3: Tratamento de Erros

```typescript
// Cidade inexistente
await searchFlights('Cidade Falsa', 'Rio', '2025-12-15', 1);
// Esperado: { results: [], error: "Não foi possível encontrar..." }

// Data inválida
await searchFlights('São Paulo', 'Rio', '2020-01-01', 1);
// Esperado: Erro ou nenhum resultado
```

### Teste 4: Modo de Desenvolvimento

```env
NEXT_PUBLIC_DEV_MODE=true
```

```typescript
await searchFlights('Qualquer', 'Cidade', '2025-12-15', 1);
// Esperado: Retorna dados mock sem chamar API
```

---

## 📊 Monitoramento e Logs

### Logs Esperados (Sucesso)

```
[Travelpayout] ===== INICIANDO BUSCA REAL =====
[Travelpayout] Origem: São Paulo
[Travelpayout] Destino: Rio de Janeiro
[Travelpayout] Data: 2025-12-15
[Travelpayout] Adultos: 1
[Travelpayout] Buscando código IATA para: São Paulo
[Travelpayout] São Paulo → GRU
[Travelpayout] Buscando código IATA para: Rio de Janeiro
[Travelpayout] Rio de Janeiro → GIG
[Travelpayout] Iniciando busca de voos...
[Travelpayout] MD5 Signature calculado
[Travelpayout] Busca iniciada: abc123xyz
[Travelpayout] Iniciando polling de resultados...
[Travelpayout] Tentativa 1/20
[Travelpayout] Tentativa 2/20
[Travelpayout] Tentativa 3/20
[Travelpayout] Busca completa!
[Travelpayout] Encontrados 15 voos
[Travelpayout] ===== BUSCA CONCLUÍDA =====
[Travelpayout] Retornando 5 voos
```

### Logs Esperados (Erro)

```
[Travelpayout] Buscando código IATA para: Cidade Inexistente
[Travelpayout] Nenhum resultado para: Cidade Inexistente
[Travelpayout] ERRO: Error: Não foi possível encontrar o aeroporto para: Cidade Inexistente
```

---

## ⚡ Otimizações Futuras

### 1. Cache de Códigos IATA

```typescript
const iataCache = new Map<string, string>();

async function getCityIataCodeCached(cityName: string): Promise<string | null> {
    if (iataCache.has(cityName)) {
        console.log(`[Cache] ${cityName} → ${iataCache.get(cityName)}`);
        return iataCache.get(cityName)!;
    }
    
    const code = await getCityIataCode(cityName);
    if (code) {
        iataCache.set(cityName, code);
    }
    return code;
}
```

### 2. Retry com Backoff Exponencial

```typescript
async function pollWithBackoff(searchId: string, resultsUrl: string) {
    let delay = 1000; // Começar com 1 segundo
    
    for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
        // ... fazer request
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 1.5, 10000); // Aumentar até máximo de 10s
    }
}
```

### 3. Paralelização de Buscas IATA

```typescript
const [originIata, destinationIata] = await Promise.all([
    getCityIataCode(origin),
    getCityIataCode(destination)
]);
```

---

## 🔒 Segurança

### Validação de Entrada

```typescript
function validateSearchInput(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number
): { valid: boolean; error?: string } {
    
    if (!origin || origin.trim().length === 0) {
        return { valid: false, error: 'Origem é obrigatória' };
    }
    
    if (!destination || destination.trim().length === 0) {
        return { valid: false, error: 'Destino é obrigatório' };
    }
    
    if (origin === destination) {
        return { valid: false, error: 'Origem e destino não podem ser iguais' };
    }
    
    // Validar formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
        return { valid: false, error: 'Data inválida. Use formato YYYY-MM-DD' };
    }
    
    // Validar que a data não é no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const depDate = new Date(departureDate);
    
    if (depDate < today) {
        return { valid: false, error: 'Data de partida não pode ser no passado' };
    }
    
    if (adults < 1 || adults > 9) {
        return { valid: false, error: 'Número de adultos deve ser entre 1 e 9' };
    }
    
    return { valid: true };
}
```

### Proteção de Credenciais

```typescript
// NUNCA expor credenciais no frontend
// Sempre usar variáveis de ambiente do servidor

if (typeof window !== 'undefined') {
    throw new Error('Esta função só pode ser executada no servidor');
}
```

---

**Documento criado em:** 2025-12-02  
**Versão:** 1.0  
**Status:** Especificação Técnica Completa
