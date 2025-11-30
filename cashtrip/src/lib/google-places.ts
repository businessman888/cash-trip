const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

export async function searchPlaces(query: string, location: string) {
    try {
        // Support both variable names
        const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.warn('[Google Places] No API key - returning mock data');
            return {
                results: [
                    {
                        name: 'Restaurante Tradicional',
                        address: `Centro, ${location}`,
                        rating: 4.5,
                        price_level: 'PRICE_LEVEL_MODERATE',
                        type: 'restaurant'
                    },
                    {
                        name: 'Atração Turística Principal',
                        address: `Zona Turística, ${location}`,
                        rating: 4.8,
                        price_level: 'PRICE_LEVEL_INEXPENSIVE',
                        type: 'tourist_attraction'
                    },
                    {
                        name: 'Café Local',
                        address: `Bairro Histórico, ${location}`,
                        rating: 4.3,
                        price_level: 'PRICE_LEVEL_INEXPENSIVE',
                        type: 'cafe'
                    }
                ]
            };
        }

        // Combine query and location for better search
        const textQuery = `${query} in ${location}`;

        const response = await fetch(GOOGLE_PLACES_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount,places.primaryType'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                maxResultCount: 5
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Places API Error:', errorText);
            return { error: `API Error: ${response.status}` };
        }

        const data = await response.json();

        if (!data.places) {
            return { results: [] };
        }

        return {
            results: data.places.map((place: any) => ({
                name: place.displayName?.text,
                address: place.formattedAddress,
                rating: place.rating,
                price_level: place.priceLevel, // PRICE_LEVEL_UNSPECIFIED, PRICE_LEVEL_INEXPENSIVE, etc.
                type: place.primaryType
            }))
        };

    } catch (error) {
        console.error('searchPlaces exception:', error);
        return { error: 'Failed to search places' };
    }
}
