# Plano de Migração: Amadeus → Travelpayout API

**Data:** 2025-12-02  
**Objetivo:** Substituir a integração de busca de voos do Amadeus pela API Travelpayout, preservando o fluxo macro do usuário e a versão atual do agente LLM.

---

## 🎯 Escopo da Migração

### O Que Será Alterado
- ✅ Backend de busca de voos (substituição da fonte de dados)
- ✅ Lógica de autenticação e assinatura MD5 para Travelpayout
- ✅ Transformação de dados para manter compatibilidade com frontend
- ✅ Variáveis de ambiente para credenciais Travelpayout

### O Que Será Preservado
- ❌ **NÃO ALTERAR:** Versão do agente LLM (Claude Sonnet 4.5)
- ❌ **NÃO ALTERAR:** Fluxo macro do usuário (Coleta → Voos → Hotéis → Roteiro)
- ❌ **NÃO ALTERAR:** Interface do usuário e componentes React
- ❌ **NÃO ALTERAR:** Estrutura de mensagens do agente
- ❌ **NÃO ALTERAR:** Busca de hotéis (permanece com Amadeus/Mock)

---

## 📋 Análise do Fluxo Atual

### Arquitetura Atual de Voos

#### 1. Frontend (`NewTripChat.tsx`)
```
Usuário → Seleciona destino/datas → Agente chama search_flights
         ↓
Frontend recebe opções de voo → Exibe SelectionButton
         ↓
Usuário seleciona voo → Continua para hotéis
```

#### 2. Backend (`/api/chat/route.ts`)
```typescript
// Linha 435-441: Execução da ferramenta search_flights
case 'search_flights':
    return await searchFlights(
        toolUse.input.origin,
        toolUse.input.destination,
        toolUse.input.departureDate,
        toolUse.input.adults
    );
```

#### 3. Biblioteca Amadeus (`lib/amadeus.ts`)
```typescript
// Linha 83-198: Função searchFlights
export async function searchFlights(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number = 1,
    preferences?: any
): Promise<{ results: FlightOffer[], error?: string }>
```

**Estrutura de Retorno Atual:**
```typescript
interface FlightOffer {
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
```

---

## 🔄 Fluxo Travelpayout (3 Fases)

### Fase 1: Conversão de Códigos IATA
**Endpoint:** `GET http://autocomplete.travelpayouts.com/places2`

**Parâmetros:**
- `term`: Nome da cidade (ex: "São Paulo")
- `locale`: "pt" (português)
- `types[]`: "city"

**Exemplo de Request:**
```
GET http://autocomplete.travelpayouts.com/places2?term=São Paulo&locale=pt&types[]=city
```

**Exemplo de Response:**
```json
[
  {
    "id": "SAO",
    "type": "city",
    "code": "SAO",
    "name": "São Paulo",
    "country_code": "BR",
    "country_name": "Brasil"
  }
]
```

**Ação:** Extrair `code` para origem e destino.

---

### Fase 2: Iniciar Busca de Voos (Com Assinatura MD5)
**Endpoint:** `POST https://tickets-api.travelpayouts.com/search/affiliate/start`

**Headers Obrigatórios:**
- `Content-Type`: `application/json`
- `x-signature`: Hash MD5 calculado
- `x-affiliate-user-id`: Token secreto (TRAVELPAYOUTS_API_TOKEN)

**Body (JSON):**
```json
{
  "origin": "GRU",
  "destination": "RIO",
  "depart_date": "2025-12-15",
  "return_date": null,
  "adults": 1,
  "children": 0,
  "infants": 0,
  "trip_class": "Y",
  "marker": "688645"
}
```

**Cálculo da Assinatura MD5:**
```typescript
// 1. Coletar valores dos parâmetros
const values = [
  adults,          // 1
  children,        // 0
  depart_date,     // "2025-12-15"
  destination,     // "RIO"
  infants,         // 0
  marker,          // "688645"
  origin,          // "GRU"
  return_date,     // null ou ""
  trip_class       // "Y"
];

// 2. Ordenar alfabeticamente (já está ordenado acima)
// 3. Concatenar: TOKEN + ":" + valores.join("")
const signatureString = `${TRAVELPAYOUTS_API_TOKEN}:${values.join("")}`;

// 4. Calcular MD5
const signature = crypto.createHash('md5').update(signatureString).digest('hex');
```

**Exemplo de Response:**
```json
{
  "search_id": "abc123xyz",
  "results_url": "https://results.travelpayouts.com/abc123xyz"
}
```

**Ação:** Armazenar `search_id` e `results_url`.

---

### Fase 3: Polling de Resultados
**Endpoint:** `POST <results_url>/search/affiliate/results`

**Headers:**
- `Content-Type`: `application/json`
- `x-signature`: Mesmo MD5 da Fase 2
- `x-affiliate-user-id`: Token secreto

**Body:**
```json
{
  "search_id": "abc123xyz"
}
```

**Lógica de Polling:**
```typescript
let isOver = false;
let attempts = 0;
const MAX_ATTEMPTS = 20;
const POLL_INTERVAL = 2000; // 2 segundos

while (!isOver && attempts < MAX_ATTEMPTS) {
  const response = await fetch(`${results_url}/search/affiliate/results`, {
    method: 'POST',
    headers: { ... },
    body: JSON.stringify({ search_id })
  });
  
  const data = await response.json();
  
  if (data.is_over === true) {
    isOver = true;
    return data.proposals; // Array de voos
  }
  
  attempts++;
  await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
}
```

**Exemplo de Response Final:**
```json
{
  "is_over": true,
  "proposals": [
    {
      "id": "flight_001",
      "terms": {
        "price": {
          "total": "1250.00",
          "currency": "BRL"
        }
      },
      "segment": [
        {
          "operating_carrier": "LA",
          "flight_number": "3456",
          "departure": "GRU",
          "arrival": "RIO",
          "departure_time": "2025-12-15T08:00:00",
          "arrival_time": "2025-12-15T11:30:00",
          "duration": 210
        }
      ],
      "gates_info": [
        {
          "label": "LATAM",
          "url": "https://booking.link/..."
        }
      ]
    }
  ]
}
```

---

## 🛠️ Implementação Técnica

### Arquivo 1: Criar `lib/travelpayout.ts`

**Responsabilidades:**
1. Converter nomes de cidades para códigos IATA
2. Calcular assinatura MD5
3. Iniciar busca de voos
4. Fazer polling de resultados
5. Transformar dados para formato `FlightOffer`

**Estrutura:**
```typescript
import { createHash } from 'crypto';

// Tipos
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

// Fase 1: Obter código IATA
async function getCityIataCode(cityName: string): Promise<string | null>

// Fase 2: Calcular MD5
function calculateMD5Signature(params: any): string

// Fase 2: Iniciar busca
async function startFlightSearch(params: any): Promise<{ search_id: string; results_url: string }>

// Fase 3: Polling
async function pollFlightResults(search_id: string, results_url: string): Promise<any[]>

// Transformação de dados
function transformTravelpayoutToFlightOffer(proposal: any): FlightOffer

// Função principal (compatível com Amadeus)
export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  adults: number = 1,
  preferences?: any
): Promise<{ results: FlightOffer[], error?: string }>
```

---

### Arquivo 2: Modificar `/api/chat/route.ts`

**Mudanças Mínimas:**
```typescript
// ANTES (Linha 3):
import { searchFlights, searchHotels } from '@/lib/amadeus';

// DEPOIS:
import { searchFlights } from '@/lib/travelpayout';
import { searchHotels } from '@/lib/amadeus';
```

**Nenhuma outra alteração necessária** - a assinatura da função `searchFlights` permanece idêntica.

---

### Arquivo 3: Variáveis de Ambiente

**Adicionar ao `.env.local`:**
```env
# Travelpayout API Configuration
TRAVELPAYOUTS_API_TOKEN=3f87cccd98047d6192675ac6756c7a40
TRAVELPAYOUTS_MARKER=688645

# Modo de desenvolvimento (usar mock se true)
NEXT_PUBLIC_DEV_MODE=false
```

---

## 📊 Mapeamento de Dados

### Travelpayout → FlightOffer

| Campo Travelpayout | Campo FlightOffer | Transformação |
|-------------------|-------------------|---------------|
| `proposal.id` | `id` | Direto |
| `segment[0].operating_carrier` | `airline` | Mapear código para nome (LA → LATAM) |
| `segment[0].flight_number` | `flightNumber` | Concatenar: `${operating_carrier}${flight_number}` |
| `segment[0].departure` | `departure.iataCode` | Direto |
| `segment[0].departure_time` | `departure.at` | Direto (ISO 8601) |
| `segment[0].arrival` | `arrival.iataCode` | Direto |
| `segment[0].arrival_time` | `arrival.at` | Direto (ISO 8601) |
| `segment[0].duration` | `duration` | Converter minutos → formato PT (ex: 210 → "PT3H30M") |
| `terms.price.total` | `price.total` | Direto |
| `terms.price.currency` | `price.currency` | Direto |
| `segment.length - 1` | `stops` | Calcular (0 = direto, 1 = 1 parada) |
| `gates_info[0].url` | `link` | Direto |

### Exemplo de Transformação:

**Input (Travelpayout):**
```json
{
  "id": "flight_001",
  "terms": { "price": { "total": "1250.00", "currency": "BRL" } },
  "segment": [
    {
      "operating_carrier": "LA",
      "flight_number": "3456",
      "departure": "GRU",
      "arrival": "RIO",
      "departure_time": "2025-12-15T08:00:00",
      "arrival_time": "2025-12-15T11:30:00",
      "duration": 210
    }
  ],
  "gates_info": [{ "url": "https://booking.link/..." }]
}
```

**Output (FlightOffer):**
```json
{
  "id": "flight_001",
  "airline": "LATAM Airlines",
  "flightNumber": "LA3456",
  "departure": { "iataCode": "GRU", "at": "2025-12-15T08:00:00" },
  "arrival": { "iataCode": "RIO", "at": "2025-12-15T11:30:00" },
  "duration": "PT3H30M",
  "price": { "currency": "BRL", "total": "1250.00" },
  "stops": 0,
  "link": "https://booking.link/..."
}
```

---

## 🔐 Segurança e Autenticação

### Cálculo MD5 Detalhado

**Parâmetros da Busca:**
```typescript
const searchParams = {
  adults: 1,
  children: 0,
  depart_date: "2025-12-15",
  destination: "RIO",
  infants: 0,
  marker: "688645",
  origin: "GRU",
  return_date: "",
  trip_class: "Y"
};
```

**Passo a Passo:**
1. **Ordenar alfabeticamente por chave:**
   - adults, children, depart_date, destination, infants, marker, origin, return_date, trip_class

2. **Extrair valores na ordem:**
   ```
   [1, 0, "2025-12-15", "RIO", 0, "688645", "GRU", "", "Y"]
   ```

3. **Concatenar com token:**
   ```
   "3f87cccd98047d6192675ac6756c7a40:1020251215RIO0688645GRUY"
   ```

4. **Calcular MD5:**
   ```typescript
   const signature = crypto.createHash('md5')
     .update(signatureString)
     .digest('hex');
   ```

5. **Adicionar aos headers:**
   ```typescript
   headers: {
     'x-signature': signature,
     'x-affiliate-user-id': '3f87cccd98047d6192675ac6756c7a40'
   }
   ```

---

## 🧪 Modo de Desenvolvimento

### Mock Data para Travelpayout

Quando `NEXT_PUBLIC_DEV_MODE=true`, retornar dados mock sem chamar a API:

```typescript
if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
  console.log('[Travelpayout] Using Mock Data');
  
  return {
    results: [
      {
        id: generateId(`LATAM-${destination}-1`),
        airline: 'LATAM Airlines',
        flightNumber: 'LA3456',
        departure: { iataCode: origin, at: `${departureDate}T08:00:00` },
        arrival: { iataCode: destination, at: `${departureDate}T11:30:00` },
        duration: 'PT3H30M',
        price: { currency: 'BRL', total: '1250.00' },
        stops: 0,
        link: `https://www.latamairlines.com/br/pt/ofertas-voos`
      },
      // ... mais opções mock
    ]
  };
}
```

---

## ⚠️ Tratamento de Erros

### Cenários de Erro

1. **Cidade não encontrada (Fase 1):**
   ```typescript
   if (!iataCode) {
     return { 
       results: [], 
       error: `Não foi possível encontrar o código IATA para: ${cityName}` 
     };
   }
   ```

2. **Falha ao iniciar busca (Fase 2):**
   ```typescript
   if (!response.ok) {
     return { 
       results: [], 
       error: `Erro ao iniciar busca: ${response.status}` 
     };
   }
   ```

3. **Timeout no polling (Fase 3):**
   ```typescript
   if (attempts >= MAX_ATTEMPTS) {
     return { 
       results: [], 
       error: 'Tempo limite excedido. Tente novamente.' 
     };
   }
   ```

4. **Nenhum voo encontrado:**
   ```typescript
   if (!proposals || proposals.length === 0) {
     return { 
       results: [], 
       error: 'Nenhum voo encontrado para esta rota.' 
     };
   }
   ```

---

## 📝 Checklist de Implementação

### Fase 1: Preparação
- [ ] Criar arquivo `lib/travelpayout.ts`
- [ ] Adicionar variáveis de ambiente ao `.env.local`
- [ ] Implementar função `getCityIataCode()`
- [ ] Testar conversão de cidades brasileiras comuns

### Fase 2: Autenticação
- [ ] Implementar função `calculateMD5Signature()`
- [ ] Validar assinatura com exemplos da documentação
- [ ] Implementar função `startFlightSearch()`
- [ ] Testar início de busca com dados reais

### Fase 3: Polling
- [ ] Implementar função `pollFlightResults()`
- [ ] Adicionar lógica de retry e timeout
- [ ] Testar polling até receber `is_over: true`

### Fase 4: Transformação
- [ ] Implementar `transformTravelpayoutToFlightOffer()`
- [ ] Criar mapeamento de códigos de companhias aéreas
- [ ] Converter duração de minutos para formato PT
- [ ] Validar estrutura de dados final

### Fase 5: Integração
- [ ] Implementar função principal `searchFlights()`
- [ ] Adicionar modo de desenvolvimento (mock)
- [ ] Atualizar import em `/api/chat/route.ts`
- [ ] Preservar import de `searchHotels` do Amadeus

### Fase 6: Testes
- [ ] Testar busca com cidades brasileiras (GRU, RIO, SSA)
- [ ] Validar formato de dados no frontend
- [ ] Testar seleção de voos no chat
- [ ] Verificar links de reserva funcionando
- [ ] Testar modo de desenvolvimento

### Fase 7: Validação Final
- [ ] Confirmar que o agente LLM não foi alterado
- [ ] Verificar fluxo macro (Voos → Hotéis → Roteiro)
- [ ] Testar integração completa end-to-end
- [ ] Documentar quaisquer limitações conhecidas

---

## 🚨 Alertas Críticos

> [!CAUTION]
> **NÃO ALTERAR O AGENTE LLM**
> - Manter modelo: `claude-sonnet-4-5-20250929`
> - Manter system prompt em `/api/chat/route.ts`
> - Manter estrutura de ferramentas (tools)
> - Manter lógica de loop do agente

> [!WARNING]
> **PRESERVAR FLUXO MACRO**
> - Ordem: Coleta → Voos → Hotéis → Roteiro
> - Não alterar componentes React do frontend
> - Não modificar estrutura de mensagens
> - Manter interface `FlightOffer` idêntica

> [!IMPORTANT]
> **COMPATIBILIDADE DE DADOS**
> - A função `searchFlights()` deve retornar o mesmo formato
> - Frontend espera array de `FlightOffer`
> - Cada voo deve ter campo `link` para reserva
> - Manter tratamento de erros consistente

---

## 📚 Referências

### Endpoints Travelpayout
- **Autocomplete:** `http://autocomplete.travelpayouts.com/places2`
- **Start Search:** `https://tickets-api.travelpayouts.com/search/affiliate/start`
- **Results:** `<results_url>/search/affiliate/results`

### Credenciais
- **Token:** `3f87cccd98047d6192675ac6756c7a40`
- **Marker:** `688645`

### Arquivos Afetados
1. `lib/travelpayout.ts` (NOVO)
2. `app/api/chat/route.ts` (MODIFICAR import)
3. `.env.local` (ADICIONAR variáveis)

### Arquivos Preservados
- `lib/amadeus.ts` (manter para hotéis)
- `components/trips/new/NewTripChat.tsx`
- `app/trips/new/page.tsx`
- Todos os componentes de UI

---

## 🎯 Resultado Esperado

Após a implementação, o fluxo do usuário permanecerá idêntico:

1. **Usuário:** "Quero ir para o Rio de Janeiro de 15 a 20 de dezembro"
2. **Agente:** Chama `search_flights` (agora usando Travelpayout)
3. **Backend:** Retorna opções de voo no formato `FlightOffer[]`
4. **Frontend:** Exibe botões de seleção de voo
5. **Usuário:** Seleciona um voo
6. **Agente:** Continua para busca de hotéis (Amadeus/Mock)
7. **Fluxo:** Prossegue normalmente até criação do roteiro

**Diferença invisível para o usuário:** A fonte de dados de voos mudou de Amadeus para Travelpayout, mas a experiência permanece a mesma.

---

**Documento criado em:** 2025-12-02  
**Versão:** 1.0  
**Status:** Planejamento Completo - Pronto para Implementação
