import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, searchHotels } from '@/lib/amadeus';
import { searchPlaces } from '@/lib/google-places';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const { messages, userProfile, totalBudget } = await req.json();

        const systemPrompt = `Você é o Agente Cash Trip, um estrategista de viagens focado em 'Smart Luxury' e eficiência.
Sua missão não é apenas reservar, mas arquitetar uma experiência completa (logística + roteiro dia-a-dia) maximizando o valor do dinheiro do usuário.

[[PERFIL DO USUÁRIO - JSON]]
${JSON.stringify(userProfile, null, 2)}

[[ESTADO ATUAL DA CONVERSA]]
O usuário JÁ INFORMOU o destino, as datas e o orçamento através da interface visual.
NÃO pergunte "Para onde vamos?" ou "Qual a data?".
O fluxo deve ser:
1. Reconhecer/Validar os dados iniciais.
2. Resolver Logística (Voos/Hospedagem).
3. Resolver Experiência (Roteiro dia-a-dia e Gastronomia).

[[DIRETRIZES DE ROTEIRO E EXPERIÊNCIA]]
Ao criar o roteiro diário, você deve obedecer estritamente às variáveis do JSON:

1. Ritmo (Pace):
   - Se "Relax": Máximo 1 atividade principal + 1 refeição longa. Deixe manhãs livres.
   - Se "Agitado": Otimize a rota geográfica para caber 3-4 atividades sem deslocamentos longos.
   - Se "Equilibrado": 1 atividade manhã, 1 tarde, noite livre.

2. Gastronomia & Smart Luxury:
   - Use a regra "High-Low": Se sugerir um jantar caro (Splurge) numa noite, sugira um almoço incrível e barato (Street Food/Bistrô local) no dia seguinte para equilibrar o budget.
   - Filtro Absoluto: Se JSON contém 'dietary_restrictions', NUNCA sugira um lugar que não atenda.
   - Valide 'dining_style': Se o usuário marcou "Gourmet", priorize Michelin/Awards. Se "Local", priorize lugares frequentados por residentes, fora da rota turística.

3. Atividades & Interesses:
   - Cruzamento de Dados: Se JSON tem interesse em "História" e "Música", sugira um show de Jazz em um prédio histórico, não apenas um museu genérico.
   - Logística Geográfica: Agrupe atividades por bairro. Não faça o usuário cruzar a cidade duas vezes no mesmo dia.

[[PROTOCOLO DE RESPOSTA]]
Fase 1: Logística (Imediata)
- Busque voos e hotéis usando as tools \`search_flights\` e \`search_hotels\`.
- Apresente as opções focando no custo-benefício.

Fase 2: Roteiro (Após aprovação da logística)
- Gere o roteiro detalhado (Manhã/Tarde/Noite) para TODOS os dias da estadia.
- Para cada sugestão, explique POR QUE ela foi escolhida baseada no perfil (ex: "Sugeri o Restaurante X porque você ama comida asiática e ele é um 'hidden gem' barato").
- QUANDO O ROTEIRO ESTIVER COMPLETO E APROVADO PELO USUÁRIO, chame OBRIGATORIAMENTE a tool \`submit_final_itinerary\` para salvar no banco de dados.

[[DIRETRIZES GERAIS]]
- Não invente lugares: Use \`search_places\` para validar se o restaurante/atração existe.
- Personalização Radical: Nunca dê sugestões genéricas de "Top 10 Tripadvisor".
- Orçamento: Mantenha o total (Voo + Hotel + Estimativa de Gastos Diários) dentro do budget informado (${totalBudget}). Se o roteiro estourar, avise e sugira cortes.

Comece agora analisando os dados injetados (Destino/Data/Budget) e inicie a busca logística.`;

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8192,
            system: systemPrompt,
            messages: messages,
            tools: [
                {
                    name: "search_flights",
                    description: "Busca voos reais via Amadeus. Chame isso IMEDIATAMENTE após receber destino e datas.",
                    input_schema: {
                        type: "object",
                        properties: {
                            origin: { type: "string", description: "Código IATA (ex: GRU)" },
                            destination: { type: "string", description: "Código IATA (ex: CDG)" },
                            departureDate: { type: "string", description: "YYYY-MM-DD" },
                            adults: { type: "integer" }
                        },
                        required: ["origin", "destination", "departureDate"]
                    }
                },
                {
                    name: "search_hotels",
                    description: "Busca hotéis disponíveis via Amadeus.",
                    input_schema: {
                        type: "object",
                        properties: {
                            cityCode: { type: "string" },
                            checkInDate: { type: "string", description: "YYYY-MM-DD" },
                            checkOutDate: { type: "string", description: "YYYY-MM-DD" },
                            budget_max: { type: "number" }
                        },
                        required: ["cityCode", "checkInDate", "checkOutDate"]
                    }
                },
                {
                    name: "search_places",
                    description: "Busca restaurantes, atrações turísticas, baladas ou parques via Google Places/Yelp.",
                    input_schema: {
                        type: "object",
                        properties: {
                            query: { type: "string", description: "Ex: 'Restaurante Italiano Romântico em Paris'" },
                            location: { type: "string", description: "Cidade ou coordenadas" },
                            category: { type: "string", enum: ["food", "attraction", "nightlife", "shopping"] }
                        },
                        required: ["query", "location"]
                    }
                },
                {
                    name: "submit_final_itinerary",
                    description: "Chame esta função APENAS quando o usuário aprovar o roteiro final. Isso salvará o plano no banco de dados e atualizará a UI do App.",
                    input_schema: {
                        type: "object",
                        properties: {
                            trip_title: { type: "string", description: "Ex: 'Aventura em Paris'" },
                            days: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        date: { type: "string", description: "YYYY-MM-DD (formato obrigatório)" },
                                        morning_activity: {
                                            type: "object",
                                            properties: {
                                                title: { type: "string" },
                                                location: { type: "string" },
                                                type: { type: "string", description: "Ex: museu, parque, caminhada" }
                                            }
                                        },
                                        lunch_spot: {
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                cuisine: { type: "string" },
                                                price_level: { type: "string", enum: ["$", "$$", "$$$", "$$$$"] }
                                            }
                                        },
                                        afternoon_activity: {
                                            type: "object",
                                            properties: {
                                                title: { type: "string" },
                                                location: { type: "string" }
                                            }
                                        },
                                        dinner_spot: {
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                cuisine: { type: "string" },
                                                booking_required: { type: "boolean" }
                                            }
                                        }
                                    },
                                    required: ["date"]
                                }
                            }
                        },
                        required: ["trip_title", "days"]
                    }
                }
            ]
        });

        // Process tool calls
        if (response.stop_reason === 'tool_use') {
            const toolUse = response.content.find(block => block.type === 'tool_use');

            if (toolUse && toolUse.name === 'submit_final_itinerary') {
                // In a real app, save to DB here
                // await saveItineraryToDatabase(toolUse.input);

                return NextResponse.json({
                    success: true,
                    itinerary: toolUse.input,
                    message: 'Roteiro salvo com sucesso!'
                });
            }

            // Process other tools
            const toolResult = await executeToolCall(toolUse);

            return NextResponse.json({
                tool_use: toolUse,
                tool_result: toolResult,
                stop_reason: 'tool_use'
            });
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json(
            { error: 'Erro ao processar requisição' },
            { status: 500 }
        );
    }
}

async function executeToolCall(toolUse: any) {
    console.log(`Executing tool: ${toolUse.name}`);

    switch (toolUse.name) {
        case 'search_flights':
            return await searchFlights(
                toolUse.input.origin,
                toolUse.input.destination,
                toolUse.input.departureDate,
                toolUse.input.adults
            );
        case 'search_hotels':
            return await searchHotels(
                toolUse.input.cityCode,
                toolUse.input.checkInDate,
                toolUse.input.checkOutDate
            );
        case 'search_places':
            return await searchPlaces(
                toolUse.input.query,
                toolUse.input.location
            );
        default:
            return { error: 'Tool não implementada' };
    }
}
