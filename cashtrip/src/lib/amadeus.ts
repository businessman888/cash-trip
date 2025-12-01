import { createHash } from 'crypto';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com'; // Use 'https://api.amadeus.com' for production

let accessToken = '';
let tokenExpiresAt = 0;

// Types for our internal use
export interface FlightOffer {
    id: string;
    airline: string;
    flightNumber: string;
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    duration: string;
    price: { currency: string; total: string };
    stops: number;
    link?: string; // Deep link to booking (simulated)
}

export interface HotelOffer {
    id: string;
    name: string;
    address?: string;
    rating?: number;
    price: { currency: string; total: string };
    description?: string;
    amenities?: string[];
    image?: string;
    link?: string; // Deep link to booking (simulated)
}

async function getAccessToken() {
    const now = Date.now();
    if (accessToken && now < tokenExpiresAt) {
        return accessToken;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    // Support both naming conventions
    const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        // If we are in Dev Mode, we might not have keys, and that's fine for mocks.
        // But if we try to get a token, it means we wanted real data.
        throw new Error("Amadeus API credentials missing");
    }

    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
        const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new Error(`Failed to get Amadeus token: ${response.statusText}`);
        }

        const data = await response.json();
        accessToken = data.access_token;
        // Set expiration slightly before actual expiry (expires_in is in seconds)
        tokenExpiresAt = now + (data.expires_in * 1000) - 60000;
        return accessToken;
    } catch (error) {
        console.error('Error fetching Amadeus token:', error);
        throw error;
    }
}

function generateId(str: string): string {
    return createHash('md5').update(str).digest('hex').substring(0, 12);
}

export async function searchFlights(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number = 1,
    preferences?: any // { budget_max, style, etc }
): Promise<{ results: FlightOffer[], error?: string }> {

    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;

    // --- MOCK DATA / DEV MODE ---
    if (isDevMode || !clientId) {
        console.log('[Amadeus] Using Mock/Dev Data for Flights');

        // Generate deterministic mock data based on destination
        const mockFlights: FlightOffer[] = [
            {
                id: generateId(`LATAM-${destination}-1`),
                airline: 'LATAM Airlines',
                flightNumber: 'LA3456',
                departure: { iataCode: origin, at: `${departureDate}T08:00:00` },
                arrival: { iataCode: destination, at: `${departureDate}T11:30:00` },
                duration: 'PT3H30M',
                price: { currency: 'BRL', total: '1250.00' },
                stops: 0,
                link: `https://www.latamairlines.com/br/pt/ofertas-voos?origin=${origin}&destination=${destination}&date=${departureDate}`
            },
            {
                id: generateId(`GOL-${destination}-1`),
                airline: 'GOL Linhas Aéreas',
                flightNumber: 'G31234',
                departure: { iataCode: origin, at: `${departureDate}T14:00:00` },
                arrival: { iataCode: destination, at: `${departureDate}T17:45:00` },
                duration: 'PT3H45M',
                price: { currency: 'BRL', total: '1100.00' },
                stops: 0,
                link: `https://www.voegol.com.br/ofertas?origin=${origin}&destination=${destination}&date=${departureDate}`
            },
            {
                id: generateId(`AZUL-${destination}-1`),
                airline: 'Azul Linhas Aéreas',
                flightNumber: 'AD5678',
                departure: { iataCode: origin, at: `${departureDate}T09:30:00` },
                arrival: { iataCode: destination, at: `${departureDate}T14:00:00` },
                duration: 'PT4H30M',
                price: { currency: 'BRL', total: '1450.00' },
                stops: 1,
                link: `https://www.voeazul.com.br/passagens-aereas?origin=${origin}&destination=${destination}&date=${departureDate}`
            }
        ];

        // Filter by budget if provided
        let filtered = mockFlights;
        if (preferences?.budget_max) {
            filtered = filtered.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
        }

        return { results: filtered };
    }

    // --- REAL API CALL ---
    try {
        const token = await getAccessToken();
        const url = `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&max=10&currencyCode=BRL`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Amadeus Flight Search Error:', errorText);
            return { results: [], error: `API Error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            return { results: [] };
        }

        // Transform and Filter
        let offers: FlightOffer[] = data.data.map((offer: any) => {
            const segment = offer.itineraries[0].segments[0];
            const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

            return {
                id: offer.id, // Amadeus provides an ID
                airline: segment.carrierCode, // In real app, map code to name
                flightNumber: `${segment.carrierCode}${segment.number}`,
                departure: { iata: segment.departure.iataCode, at: segment.departure.at },
                arrival: { iata: lastSegment.arrival.iataCode, at: lastSegment.arrival.at },
                duration: offer.itineraries[0].duration,
                price: { currency: offer.price.currency, total: offer.price.total },
                stops: offer.itineraries[0].segments.length - 1,
                link: `https://www.google.com/travel/flights?q=Flights%20to%20${destination}%20from%20${origin}%20on%20${departureDate}` // Fallback link
            };
        });

        // Apply Backend Filtering
        if (preferences?.budget_max) {
            offers = offers.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
        }

        // Sort by price (cheapest first) by default
        offers.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

        return { results: offers.slice(0, 5) }; // Return top 5

    } catch (error) {
        console.error('searchFlights exception:', error);
        return { results: [], error: 'Failed to search flights' };
    }
}

export async function searchHotels(
    cityCode: string,
    checkInDate: string,
    checkOutDate: string,
    preferences?: any // { budget_max, amenities: ['pool', 'wifi'], style: 'luxury' }
): Promise<{ results: HotelOffer[], error?: string }> {

    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;

    // --- MOCK DATA / DEV MODE ---
    if (isDevMode || !clientId) {
        console.log('[Amadeus] Using Mock/Dev Data for Hotels');

        const mockHotels: HotelOffer[] = [
            {
                id: generateId(`HOTEL-LUX-${cityCode}`),
                name: 'Grand Luxury Palace',
                address: 'Av. Central, 1000',
                rating: 5,
                price: { currency: 'BRL', total: '2500.00' },
                description: 'Experiência de luxo completa com spa e alta gastronomia.',
                amenities: ['POOL', 'SPA', 'WIFI', 'RESTAURANT'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                link: 'https://booking.com/hotel/example-luxury'
            },
            {
                id: generateId(`HOTEL-BOUTIQUE-${cityCode}`),
                name: 'Boutique Charm Hotel',
                address: 'Rua das Flores, 45',
                rating: 4,
                price: { currency: 'BRL', total: '1200.00' },
                description: 'Charme e conforto no coração da cidade.',
                amenities: ['WIFI', 'BREAKFAST', 'BAR'],
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
                link: 'https://booking.com/hotel/example-boutique'
            },
            {
                id: generateId(`HOTEL-BUDGET-${cityCode}`),
                name: 'City Center Inn',
                address: 'Travessa do Mercado, 12',
                rating: 3,
                price: { currency: 'BRL', total: '600.00' },
                description: 'Prático e econômico, perto de tudo.',
                amenities: ['WIFI', 'AC'],
                image: 'https://images.unsplash.com/photo-1568495248636-6432b916d438?auto=format&fit=crop&w=800&q=80',
                link: 'https://booking.com/hotel/example-budget'
            }
        ];

        let filtered = mockHotels;
        if (preferences?.budget_max) {
            filtered = filtered.filter(h => parseFloat(h.price.total) <= preferences.budget_max);
        }

        return { results: filtered };
    }

    // --- REAL API CALL ---
    try {
        const token = await getAccessToken();

        // 1. Find hotels in the city
        const listUrl = `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=10&radiusUnit=KM&hotelSource=ALL`;

        const listResponse = await fetch(listUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!listResponse.ok) {
            return { results: [], error: 'Could not find hotels in this city' };
        }

        const listData = await listResponse.json();
        // Limit to 10 hotels to check availability for
        const hotelIds = listData.data.slice(0, 10).map((h: any) => h.hotelId).join(',');

        if (!hotelIds) return { results: [] };

        // 2. Get offers for these hotels
        const offersUrl = `${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1&currency=BRL`;

        const offersResponse = await fetch(offersUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!offersResponse.ok) {
            return { results: [], error: 'Could not fetch hotel offers' };
        }

        const offersData = await offersResponse.json();

        let offers: HotelOffer[] = offersData.data.map((offer: any) => ({
            id: offer.hotel.hotelId,
            name: offer.hotel.name,
            address: offer.hotel.address?.lines?.join(', '),
            rating: offer.hotel.rating ? parseInt(offer.hotel.rating) : undefined,
            price: {
                currency: offer.offers[0]?.price?.currency,
                total: offer.offers[0]?.price?.total
            },
            description: offer.hotel.description?.text,
            amenities: offer.hotel.amenities, // Amadeus might return this
            image: offer.hotel.media?.[0]?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // Fallback image
            link: `https://www.google.com/travel/hotels?q=${encodeURIComponent(offer.hotel.name)}`
        }));

        // Apply Backend Filtering
        if (preferences?.budget_max) {
            offers = offers.filter(h => parseFloat(h.price.total) <= preferences.budget_max);
        }

        // Sort by rating (highest first)
        offers.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return { results: offers.slice(0, 5) };

    } catch (error) {
        console.error('searchHotels exception:', error);
        return { results: [], error: 'Failed to search hotels' };
    }
}
