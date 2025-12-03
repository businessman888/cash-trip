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
    meta?: {
        searchId: string;
        resultsUrl: string;
        proposalId: string;
    };
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
    locale: string;
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
function calculateMD5Signature(params: Record<string, any>): string {
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;

    if (!token) {
        throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
    }

    // Obter chaves ordenadas alfabeticamente
    const keys = Object.keys(params).sort();

    // Extrair valores na ordem das chaves
    const values = keys.map(key => params[key]);

    // Concatenar token + ":" + valores
    const signatureString = `${token}:${values.join('')}`;

    // Calcular MD5
    const signature = createHash('md5').update(signatureString).digest('hex');

    console.log('[Travelpayout] MD5 Signature calculado para chaves:', keys.join(', '));

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

    // Criar objeto com parâmetros, removendo nulos/undefined
    const body: Record<string, any> = {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.depart_date,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        trip_class: params.trip_class,
        marker: params.marker,
        locale: params.locale,
        user_ip: '127.0.0.1',
    };

    // Adicionar return_date apenas se existir
    if (params.return_date) {
        body.return_date = params.return_date;
    }

    const signature = calculateMD5Signature(body);

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
        console.log('\n' + '='.repeat(80));
        console.log('🚀 [TRAVELPAYOUT] USANDO TRAVELPAYOUT API - MODO DEV (DADOS MOCK)');
        console.log('⚠️  [TRAVELPAYOUT] NÃO ESTÁ USANDO AMADEUS!');
        console.log(`📍 [TRAVELPAYOUT] Origem: ${origin}`);
        console.log(`📍 [TRAVELPAYOUT] Destino: ${destination}`);
        console.log(`📅 [TRAVELPAYOUT] Data: ${departureDate}`);
        console.log('='.repeat(80) + '\n');

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
            locale: 'pt',
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

        // Adicionar metadados para geração de link posterior
        const offersWithMeta = topOffers.map(offer => ({
            ...offer,
            // Guardar dados necessários para gerar link depois
            meta: {
                searchId: search_id,
                resultsUrl: results_url,
                proposalId: offer.id
            }
        }));

        console.log(`[Travelpayout] ===== BUSCA CONCLUÍDA =====`);
        console.log(`[Travelpayout] Retornando ${offersWithMeta.length} voos`);

        return { results: offersWithMeta };

    } catch (error: any) {
        console.error('[Travelpayout] ERRO:', error);
        return {
            results: [],
            error: error.message || 'Erro ao buscar voos. Tente novamente.'
        };
    }
}

// ============================================================================
// FASE 4: GERAÇÃO DE LINK DE AFILIADO (NOVO)
// ============================================================================

/**
 * Gera o link de afiliado final para um voo específico
 * 
 * @param searchId - ID da busca
 * @param resultsUrl - URL base dos resultados
 * @param proposalId - ID da proposta (voo)
 * @returns URL final com rastreamento
 */
export async function getAffiliateLink(
    searchId: string,
    resultsUrl: string,
    proposalId: string
): Promise<string | null> {
    const token = process.env.TRAVELPAYOUTS_API_TOKEN;
    const marker = process.env.TRAVELPAYOUTS_MARKER || '688645';

    if (!token) {
        throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
    }

    // Construir URL de clique conforme solicitado:
    // https://[results_url]/searches/[search_id]/clicks/[proposal_id]
    // Nota: resultsUrl já vem como "https://api.travelpayouts.com/..." ou similar
    // Precisamos extrair o host ou usar como base.
    // A documentação diz: "O Endpoint completo deve ser: https://[results_url]/searches/[search_id]/clicks/[proposal_id]"
    // Vamos assumir que resultsUrl é a base correta.

    // Remover barra final se existir
    const baseUrl = resultsUrl.endsWith('/') ? resultsUrl.slice(0, -1) : resultsUrl;

    // O endpoint correto geralmente é na API de tickets
    // Vamos tentar seguir estritamente a instrução do usuário
    const clickUrl = `${baseUrl}/searches/${searchId}/clicks/${proposalId}`;

    console.log('[Travelpayout] Gerando link de afiliado...');
    console.log(`[Travelpayout] URL: ${clickUrl}`);

    try {
        const response = await fetch(clickUrl, {
            method: 'POST', // Usuário sugeriu GET ou POST, POST é mais seguro para ações
            headers: {
                'Content-Type': 'application/json',
                'x-affiliate-user-id': token,
            },
            body: JSON.stringify({
                marker: marker
            })
        });

        if (!response.ok) {
            console.error(`[Travelpayout] Erro ao gerar link: ${response.status}`);
            const text = await response.text();
            console.error(`[Travelpayout] Detalhes: ${text}`);
            return null;
        }

        const data = await response.json();

        if (data && data.url) {
            console.log('[Travelpayout] Link gerado com sucesso!');
            return data.url;
        }

        return null;

    } catch (error) {
        console.error('[Travelpayout] Erro ao gerar link:', error);
        return null;
    }
}
