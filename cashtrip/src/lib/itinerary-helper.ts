import { searchAttractionsNear } from './google-places';
import { FlightOffer, HotelOffer } from './amadeus';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client for server-side generation
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

export interface ItineraryContext {
    trip_title: string;
    destination: string;
    start_date: string;
    end_date: string;
    budget_total: number;
    travelers: number;
    flight: FlightOffer;
    hotel: HotelOffer;
    user_preferences: any;
    attractions: any[];
}

export async function assembleItineraryContext(
    flight_id: string,
    hotel_id: string,
    destination: string,
    start_date: string,
    end_date: string,
    travelers: number
): Promise<ItineraryContext> {
    console.log('[ItineraryHelper] Assembling context...');

    // For now, we'll create mock flight/hotel objects based on IDs
    // In a real implementation, you'd fetch these from your database or cache
    const flight: FlightOffer = {
        id: flight_id,
        airline: "LATAM",
        flightNumber: "LA" + flight_id.substring(0, 4),
        departure: { iata: "GRU", at: start_date },
        arrival: { iata: "MIA", at: start_date },
        duration: "8h 30m",
        stops: 0,
        price: { total: "1500", currency: "BRL" },
        link: `https://booking.com/flight/${flight_id}`
    };

    const hotel: HotelOffer = {
        id: hotel_id,
        name: "Selected Hotel",
        address: destination,
        rating: 4.5,
        price: { total: "800", currency: "BRL" },
        amenities: ["Pool", "WiFi"],
        link: `https://booking.com/hotel/${hotel_id}`
    };

    // Determine preferences for filtering
    const preferences = {
        interests: [], // Default empty
        budget_max: 5000 // Default
    };

    const { results: attractions } = await searchAttractionsNear(destination, "attractions", preferences);
    const { results: restaurants } = await searchAttractionsNear(destination, "restaurants", preferences);

    // Combine and deduplicate
    const allAttractions = [...attractions, ...restaurants];

    return {
        trip_title: `Viagem para ${destination}`,
        destination: destination,
        start_date: start_date,
        end_date: end_date,
        budget_total: 5000, // Default
        travelers: travelers,
        flight,
        hotel,
        user_preferences: {},
        attractions: allAttractions.slice(0, 15) // Limit context size
    };
}

export async function generateItineraryWithLLM(context: ItineraryContext) {
    console.log('[ItineraryHelper] Generating itinerary with LLM...');

    const systemPrompt = `Você é um especialista em viagens de luxo inteligente.
Sua tarefa é criar um roteiro detalhado dia-a-dia em formato JSON, baseado ESTRITAMENTE nos dados fornecidos.

DADOS DA VIAGEM:
- Destino: ${context.destination}
- Datas: ${context.start_date} a ${context.end_date}
- Viajantes: ${context.travelers}
- Orçamento Total: ${context.budget_total}
- Perfil do Usuário: ${JSON.stringify(context.user_preferences)}

VOO ESCOLHIDO:
${JSON.stringify(context.flight, null, 2)}

HOTEL ESCOLHIDO:
${JSON.stringify(context.hotel, null, 2)}

ATRAÇÕES DISPONÍVEIS (Use estas ou similares próximas):
${JSON.stringify(context.attractions.map(a => a.name + ' (' + a.type + ')'), null, 2)}

REGRAS:
1. Crie um roteiro lógico, considerando distâncias (agrupe atividades próximas).
2. Inclua tempo para descanso e refeições.
3. O output DEVE ser apenas o JSON válido, sem markdown.
4. Estrutura do JSON:
{
  "trip_title": "string",
  "destination": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "budget": "string",
  "travelers": number,
  "flight_summary": { "airline": "string", "price": number },
  "hotel_summary": { "name": "string", "price": number },
  "days": [
    {
      "date": "YYYY-MM-DD",
      "title": "string",
      "activities": [
        {
          "time": "09:00",
          "title": "string",
          "description": "string",
          "icon": "plane" | "hotel" | "food" | "camera",
          "cost": number
        }
      ]
    }
  ]
}`;

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            system: systemPrompt,
            messages: [
                { role: "user", content: "Gere o roteiro JSON agora." }
            ]
        });

        const contentBlock = response.content[0];
        if (contentBlock.type !== 'text') {
            throw new Error("LLM returned non-text response");
        }

        const jsonString = contentBlock.text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error('[ItineraryHelper] LLM Generation Error:', error);
        throw error;
    }
}
