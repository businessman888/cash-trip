import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, getAffiliateLink } from '@/lib/travelpayout';
import { searchHotels } from '@/lib/amadeus';
import { searchPlaces } from '@/lib/google-places';
import { createClient } from '@/lib/supabase/server';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_init',
});

export async function POST(req: NextRequest) {
    try {
        // 1. Validate Environment Variables
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error("CRITICAL: ANTHROPIC_API_KEY is missing");
            return NextResponse.json({ error: "Configuração de API ausente: ANTHROPIC_API_KEY" }, { status: 500 });
        }

        const amadeusKey = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
        const amadeusSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

        if (!amadeusKey || !amadeusSecret) {
            console.warn("WARNING: Amadeus keys are missing - will use mock data");
        }

        if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
            console.warn("WARNING: GOOGLE_PLACES_API_KEY is missing - will use mock data");
        }

        // 2. Parse Request Body
        const body = await req.json();
        const { messages, userProfile, totalBudget } = body;

        console.log('[API] Received request');
        console.log('[API] Messages count:', messages?.length);
        console.log('[API] Last message:', messages?.[messages.length - 1]);
        console.log('[API] Total Budget:', totalBudget);

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Formato de mensagem inválido" }, { status: 400 });
        }

        // 3. System Prompt
        const systemPrompt = `Você é o Agente Cash Trip, um estrategista de viagens focado em 'Smart Luxury' e eficiência.

[[PERFIL DO USUÁRIO]]
${JSON.stringify(userProfile, null, 2)}

[[FLUXO OBRIGATÓRIO - SIGA A ORDEM EXATA]]

1. **BUSCA DE VOOS (Passo Atual: Voos)**
   - O usuário informou destino e datas.
   - **ORIGEM PADRÃO:** Use "São Paulo" como cidade de origem para todos os voos.
   - CHAME \`search_flights\` com origin="São Paulo", destination=[cidade informada], departureDate=[data], adults=[número de pessoas].
   - **IMPORTANTE:** Os resultados incluirão metadados (searchId, resultsUrl, proposalId).
   - Apresente as opções ao usuário.
   - **QUANDO O USUÁRIO SELECIONAR UM VOO:**
     - CHAME \`get_flight_link\` usando os metadados do voo escolhido.
     - Apresente o LINK FINAL retornado pela tool para o usuário completar a compra.
   - NÃO busque hotéis ainda.
   - PARE e aguarde o usuário selecionar uma opção de voo.

2. **BUSCA DE HOTÉIS (Passo Atual: Hotéis)**
   - O usuário JÁ selecionou o voo (você verá na mensagem "Selecionei a opção X de voo").
   - CHAME \`search_hotels\` para buscar opções reais na cidade de destino.
   - **OBRIGATÓRIO:** Ao apresentar as opções, inclua o LINK de reserva (campo \`link\` do JSON) para cada hotel.
   - PARE e aguarde o usuário selecionar uma opção de hotel.

3. **CRIAÇÃO DE ROTEIRO (Passo Atual: Roteiro)**
   - O usuário JÁ selecionou voo E hotel.
   - O usuário enviou EXATAMENTE o comando "Criar roteiro".
   - IMEDIATAMENTE CHAME \`propose_itinerary\` com um plano detalhado dia-a-dia.
   - O frontend mostrará isso em um modal para aprovação.
   - **CRÍTICO:** Quando você vir "Criar roteiro", sua ÚNICA ação deve ser chamar \`propose_itinerary\`.
   - **NÃO** faça buscas (search_places) antes de propor o roteiro.
   - **NÃO** envie mensagens de texto antes de chamar a ferramenta.
   - Use seu conhecimento interno para criar atividades interessantes baseadas no perfil do usuário.
   - O roteiro DEVE incluir: trip_title, destination, start_date, end_date, budget, travelers, flight_summary, hotel_summary, e days (array com atividades).

4. **FINALIZAÇÃO (Passo Atual: Salvar)**
   - O usuário aprovou o roteiro ("Aprovado").
   - CHAME \`submit_final_itinerary\` para salvar no banco.

[[REGRAS CRÍTICAS]]
- NUNCA pule etapas. Não busque hotéis antes de ter o voo definido.
- Sempre retorne pelo menos 2 opções de voo e 2 opções de hotel quando solicitado.
- Para o roteiro, priorize velocidade: gere o JSON completo de uma vez só.
- Quando o usuário disser "Criar roteiro", chame \`propose_itinerary\` IMEDIATAMENTE sem fazer outras buscas.`;

        let currentMessages = [...messages];
        let loopCount = 0;
        const MAX_LOOPS = 8; // Reduced to prevent timeouts

        // 4. Tool Execution Loop
        while (loopCount < MAX_LOOPS) {
            loopCount++;
            console.log(`[Agent Loop ${loopCount}/${MAX_LOOPS}] Starting iteration...`);
            console.log(`[Agent Loop ${loopCount}] Last user message:`, currentMessages[currentMessages.length - 1]);

            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-5-20250929",
                max_tokens: 20000,
                system: systemPrompt,
                messages: currentMessages,
                tools: [
                    {
                        name: "search_flights",
                        description: "Busca voos reais via Travelpayout. Retorna lista de opções.",
                        input_schema: {
                            type: "object",
                            properties: {
                                origin: { type: "string" },
                                destination: { type: "string" },
                                departureDate: { type: "string" },
                                adults: { type: "integer" }
                            },
                            required: ["origin", "destination", "departureDate"]
                        }
                    },
                    {
                        name: "get_flight_link",
                        description: "Gera o link final de compra para um voo selecionado. Use APÓS o usuário escolher um voo.",
                        input_schema: {
                            type: "object",
                            properties: {
                                searchId: { type: "string" },
                                resultsUrl: { type: "string" },
                                proposalId: { type: "string" }
                            },
                            required: ["searchId", "resultsUrl", "proposalId"]
                        }
                    },
                    {
                        name: "search_hotels",
                        description: "Busca hotéis disponíveis via Amadeus. Retorna lista de opções.",
                        input_schema: {
                            type: "object",
                            properties: {
                                cityCode: { type: "string" },
                                checkInDate: { type: "string" },
                                checkOutDate: { type: "string" },
                                budget_max: { type: "number" }
                            },
                            required: ["cityCode", "checkInDate", "checkOutDate"]
                        }
                    },
                    {
                        name: "search_places",
                        description: "Busca restaurantes e atrações via Google Places.",
                        input_schema: {
                            type: "object",
                            properties: {
                                query: { type: "string" },
                                location: { type: "string" },
                                category: { type: "string", enum: ["food", "attraction", "nightlife", "shopping"] }
                            },
                            required: ["query", "location"]
                        }
                    },
                    {
                        name: "propose_itinerary",
                        description: "Gera um roteiro detalhado para aprovação do usuário. Chame isso quando o usuário pedir para 'Criar roteiro'.",
                        input_schema: {
                            type: "object",
                            properties: {
                                trip_title: { type: "string" },
                                destination: { type: "string" },
                                start_date: { type: "string" },
                                end_date: { type: "string" },
                                budget: { type: "string" },
                                travelers: { type: "integer" },
                                flight_summary: {
                                    type: "object",
                                    properties: {
                                        airline: { type: "string" },
                                        price: { type: "number" }
                                    }
                                },
                                hotel_summary: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        price: { type: "number" }
                                    }
                                },
                                days: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            date: { type: "string" },
                                            title: { type: "string", description: "Título do dia (ex: Chegada e Exploração)" },
                                            activities: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        time: { type: "string" },
                                                        title: { type: "string" },
                                                        description: { type: "string" },
                                                        icon: { type: "string", enum: ["plane", "hotel", "food", "camera"] },
                                                        cost: { type: "number" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            required: ["trip_title", "destination", "start_date", "end_date", "days"]
                        }
                    },
                    {
                        name: "submit_final_itinerary",
                        description: "Salva o roteiro APROVADO no banco de dados.",
                        input_schema: {
                            type: "object",
                            properties: {
                                trip_title: { type: "string" },
                                destination: { type: "string" },
                                start_date: { type: "string" },
                                end_date: { type: "string" },
                                budget: { type: "string" },
                                travelers: { type: "integer" },
                                days: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            date: { type: "string" },
                                            activities: { type: "array", items: { type: "object" } }
                                        }
                                    }
                                }
                            },
                            required: ["trip_title", "destination", "start_date", "end_date", "days"]
                        }
                    }
                ]
            });

            console.log(`[Agent Loop ${loopCount}] Stop reason: ${response.stop_reason}`);

            if (response.stop_reason === 'tool_use') {
                const toolUses = response.content.filter(block => block.type === 'tool_use');

                if (toolUses.length === 0) {
                    console.log(`[Agent Loop ${loopCount}] No tool uses found, breaking...`);
                    break;
                }

                console.log(`[Agent Loop ${loopCount}] Tools called: ${toolUses.map(t => t.name).join(', ')}`);

                // Check if there's text content along with tool calls
                const textContent = response.content.find(c => c.type === 'text');
                if (textContent) {
                    console.log(`[Agent Loop ${loopCount}] Agent message preview: ${textContent.text.substring(0, 150)}...`);
                }

                currentMessages.push({
                    role: "assistant",
                    content: response.content
                });

                // Check for final submission FIRST
                const submitTool = toolUses.find(t => t.name === 'submit_final_itinerary');
                if (submitTool) {
                    console.log("[SUBMIT] Submitting final itinerary to DB...");
                    console.log("[SUBMIT] Tool input:", JSON.stringify(submitTool.input, null, 2));

                    try {
                        const supabase = await createClient();
                        const { data: { user }, error: authError } = await supabase.auth.getUser();

                        if (authError || !user) {
                            console.error("[SUBMIT] Auth error:", authError);
                            throw new Error("Usuário não autenticado");
                        }

                        console.log("[SUBMIT] User authenticated:", user.id);

                        const input = submitTool.input as any;

                        // 1. Insert Trip
                        const { data: trip, error: tripError } = await supabase
                            .from('trips')
                            .insert({
                                user_id: user.id,
                                title: input.trip_title,
                                destination: input.destination,
                                start_date: input.start_date,
                                end_date: input.end_date,
                                budget: input.budget,
                                travelers: input.travelers
                            })
                            .select()
                            .single();

                        if (tripError) {
                            console.error("[SUBMIT] Trip insert error:", tripError);
                            throw new Error("Erro ao criar viagem: " + tripError.message);
                        }

                        console.log("[SUBMIT] Trip inserted:", trip.id);

                        // 2. Insert Itinerary Items
                        const itineraryItems = [];
                        for (const day of input.days) {
                            if (day.morning_activity) {
                                itineraryItems.push({
                                    trip_id: trip.id,
                                    date: day.date,
                                    period: 'morning',
                                    title: day.morning_activity.title,
                                    location: day.morning_activity.location,
                                    details: day.morning_activity
                                });
                            }
                            if (day.lunch_spot) {
                                itineraryItems.push({
                                    trip_id: trip.id,
                                    date: day.date,
                                    period: 'lunch',
                                    title: day.lunch_spot.name,
                                    location: day.lunch_spot.name,
                                    details: day.lunch_spot
                                });
                            }
                            if (day.afternoon_activity) {
                                itineraryItems.push({
                                    trip_id: trip.id,
                                    date: day.date,
                                    period: 'afternoon',
                                    title: day.afternoon_activity.title,
                                    location: day.afternoon_activity.location,
                                    details: day.afternoon_activity
                                });
                            }
                            if (day.dinner_spot) {
                                itineraryItems.push({
                                    trip_id: trip.id,
                                    date: day.date,
                                    period: 'dinner',
                                    title: day.dinner_spot.name,
                                    location: day.dinner_spot.name,
                                    details: day.dinner_spot
                                });
                            }
                        }

                        if (itineraryItems.length > 0) {
                            const { error: itemsError } = await supabase.from('itinerary_items').insert(itineraryItems);
                            if (itemsError) {
                                console.error("[SUBMIT] Items insert error:", itemsError);
                                throw new Error("Erro ao salvar itens do roteiro: " + itemsError.message);
                            }
                        }

                        console.log("[SUBMIT] Success! Trip saved with", itineraryItems.length, "items");

                        return NextResponse.json({
                            success: true,
                            itinerary: input,
                            message: 'Roteiro salvo com sucesso!',
                            tool_use: submitTool
                        });

                    } catch (dbError: any) {
                        console.error("[SUBMIT] FATAL ERROR:", dbError);
                        return NextResponse.json({ error: "Erro ao salvar roteiro: " + dbError.message }, { status: 500 });
                    }
                }

                // Execute ALL tools in parallel with individual error handling
                const executedActions: any[] = [];
                const toolResults = await Promise.all(toolUses.map(async (toolUse) => {
                    try {
                        const result = await executeToolCall(toolUse);

                        // Collect flight and hotel data for frontend
                        if (toolUse.name === 'search_flights' && typeof result === 'object' && result !== null && 'results' in result && (result as any).results) {
                            executedActions.push({ type: 'flight_data', data: result });
                        } else if (toolUse.name === 'search_hotels' && typeof result === 'object' && result !== null && 'results' in result && (result as any).results) {
                            executedActions.push({ type: 'hotel_data', data: result });
                        }

                        return {
                            type: "tool_result",
                            tool_use_id: toolUse.id,
                            content: JSON.stringify(result)
                        };
                    } catch (toolError: any) {
                        console.error(`[Agent Loop ${loopCount}] Error executing ${toolUse.name}:`, toolError);
                        return {
                            type: "tool_result",
                            tool_use_id: toolUse.id,
                            content: JSON.stringify({ error: `Failed to execute tool: ${toolError.message}` }),
                            is_error: true
                        };
                    }
                }));

                currentMessages.push({
                    role: "user",
                    content: toolResults
                });

                // If propose_itinerary or request_logistics_approval was called, return to frontend
                const interactiveTool = toolUses.find(t => t.name === 'propose_itinerary' || t.name === 'request_logistics_approval');
                if (interactiveTool) {
                    console.log(`[Agent Loop ${loopCount}] ===== INTERACTIVE TOOL DETECTED =====`);
                    console.log(`[Agent Loop ${loopCount}] Tool name: ${interactiveTool.name}`);
                    console.log(`[Agent Loop ${loopCount}] Tool input structure:`, Object.keys(interactiveTool.input || {}));
                    console.log(`[Agent Loop ${loopCount}] Full tool input:`, JSON.stringify(interactiveTool.input, null, 2));
                    console.log(`[Agent Loop ${loopCount}] Response content blocks:`, response.content.map(c => c.type));
                    console.log(`[Agent Loop ${loopCount}] ===== RETURNING TO FRONTEND =====`);
                    return NextResponse.json({
                        content: response.content,
                        stop_reason: 'tool_use',
                        tool_use: interactiveTool,
                        executed_actions: executedActions
                    });
                }

                continue;

            } else {
                console.log(`[Agent Loop ${loopCount}] Agent finished with: ${response.stop_reason}`);
                return NextResponse.json({
                    content: response.content,
                    stop_reason: response.stop_reason
                });
            }
        }

        console.error(`[Agent Loop] MAX_LOOPS (${MAX_LOOPS}) exceeded!`);
        return NextResponse.json({ error: "Limite de interações excedido" }, { status: 500 });

    } catch (error: any) {
        console.error('ERRO FATAL NA API:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor: ' + (error.message || 'Desconhecido') },
            { status: 500 }
        );
    }
}

async function executeToolCall(toolUse: any) {
    console.log(`[Tool] Executing: ${toolUse.name}`);

    switch (toolUse.name) {
        case 'search_flights':
            return await searchFlights(
                toolUse.input.origin,
                toolUse.input.destination,
                toolUse.input.departureDate,
                toolUse.input.adults
            );
        case 'get_flight_link':
            const url = await getAffiliateLink(
                toolUse.input.searchId,
                toolUse.input.resultsUrl,
                toolUse.input.proposalId
            );
            return { url };
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
        case 'propose_itinerary':
            // Just return the input so the frontend can render it
            return {
                status: "itinerary_proposed",
                itinerary: toolUse.input
            };
        case 'request_logistics_approval':
            return { status: "waiting_for_user_approval", message: "User will see approval button." };
        default:
            return { error: 'Tool não implementada' };
    }
}
