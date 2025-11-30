const AMADEUS_BASE_URL = 'https://test.api.amadeus.com'; // Use 'https://api.amadeus.com' for production

let accessToken = '';
let tokenExpiresAt = 0;

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

export async function searchFlights(origin: string, destination: string, departureDate: string, adults: number = 1) {
    // Check if credentials are available
    const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn('[Amadeus] No credentials - returning mock flight data');
        return {
            results: [
                {
                    airline: 'LATAM',
                    price: 'BRL 4500.00',
                    duration: 'PT8H30M',
                    stops: 0
                },
                {
                    airline: 'GOL',
                    price: 'BRL 4200.00',
                    duration: 'PT9H15M',
                    stops: 1
                },
                {
                    airline: 'Azul',
                    price: 'BRL 3950.00',
                    duration: 'PT10H30M',
                    stops: 1
                }
            ]
        };
    }

    try {
        const token = await getAccessToken();
        const url = `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&max=5`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Amadeus Flight Search Error:', errorText);
            return { error: `API Error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();

        // Simplify response for the agent
        return {
            results: data.data.map((offer: any) => ({
                airline: offer.itineraries[0].segments[0].carrierCode, // Simplified
                price: `${offer.price.currency} ${offer.price.total}`,
                duration: offer.itineraries[0].duration,
                stops: offer.itineraries[0].segments.length - 1
            }))
        };
    } catch (error) {
        console.error('searchFlights exception:', error);
        return { error: 'Failed to search flights' };
    }
}

export async function searchHotels(cityCode: string, checkInDate: string, checkOutDate: string) {
    // Check if credentials are available
    const clientId = process.env.AMADEUS_API_KEY || process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_API_SECRET || process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn('[Amadeus] No credentials - returning mock hotel data');
        return {
            results: [
                {
                    name: 'Hotel Boutique Premium',
                    price_total: '850.00',
                    currency: 'BRL',
                    rating: 5
                },
                {
                    name: 'Hotel Confort Centro',
                    price_total: '450.00',
                    currency: 'BRL',
                    rating: 4
                },
                {
                    name: 'Hotel Executivo',
                    price_total: '350.00',
                    currency: 'BRL',
                    rating: 3
                }
            ]
        };
    }

    try {
        const token = await getAccessToken();

        // 1. Find hotels in the city (simplified approach)
        // Note: In a real app, we might want to search by geocode or use a specific hotel search endpoint.
        // For simplicity, let's use the hotel-list endpoint to get some hotel IDs, then check availability?
        // Or use the v1/reference-data/locations/hotels/by-city

        const listUrl = `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=5&radiusUnit=KM&hotelSource=ALL`;

        const listResponse = await fetch(listUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!listResponse.ok) {
            // If city search fails, return error
            return { error: 'Could not find hotels in this city' };
        }

        const listData = await listResponse.json();
        const hotelIds = listData.data.slice(0, 5).map((h: any) => h.hotelId).join(',');

        if (!hotelIds) return { results: [] };

        // 2. Get offers for these hotels
        const offersUrl = `${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1`;

        const offersResponse = await fetch(offersUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!offersResponse.ok) {
            return { error: 'Could not fetch hotel offers' };
        }

        const offersData = await offersResponse.json();

        return {
            results: offersData.data.map((offer: any) => ({
                name: offer.hotel.name,
                price_total: offer.offers[0]?.price?.total,
                currency: offer.offers[0]?.price?.currency,
                rating: offer.hotel.rating
            }))
        };

    } catch (error) {
        console.error('searchHotels exception:', error);
        return { error: 'Failed to search hotels' };
    }
}
