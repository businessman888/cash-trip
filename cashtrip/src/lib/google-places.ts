const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

export interface PlaceResult {
    id?: string;
    name: string;
    address: string;
    rating?: number;
    price_level?: string;
    type?: string;
    summary?: string;
    location?: { lat: number; lng: number };
}

export async function searchPlaces(query: string, location: string) {
    // Legacy wrapper for backward compatibility if needed, or redirect to new logic
    return searchAttractionsNear(location, query);
}

export async function searchAttractionsNear(
    location: string, // "Paris, France" or "lat,lng" (though API prefers text query or circle)
    query: string = "attractions",
    preferences?: any // { interests: ['history', 'food'], budget_max: ... }
): Promise<{ results: PlaceResult[], error?: string }> {

    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    // Support both variable names
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // --- MOCK DATA / DEV MODE ---
    if (isDevMode || !apiKey) {
        console.log('[Google Places] Using Mock/Dev Data');

        const mockPlaces: PlaceResult[] = [
            {
                name: 'Museu Histórico Nacional',
                address: `Centro Histórico, ${location}`,
                rating: 4.8,
                price_level: 'PRICE_LEVEL_MODERATE',
                type: 'museum',
                summary: 'Um mergulho na história local com exposições fascinantes.',
                location: { lat: 0, lng: 0 }
            },
            {
                name: 'Parque Central',
                address: `Zona Verde, ${location}`,
                rating: 4.9,
                price_level: 'PRICE_LEVEL_FREE',
                type: 'park',
                summary: 'Perfeito para caminhadas e contato com a natureza.',
                location: { lat: 0, lng: 0 }
            },
            {
                name: 'Bistrô do Chef',
                address: `Bairro Gastronômico, ${location}`,
                rating: 4.7,
                price_level: 'PRICE_LEVEL_EXPENSIVE',
                type: 'restaurant',
                summary: 'Alta gastronomia com ingredientes locais.',
                location: { lat: 0, lng: 0 }
            },
            {
                name: 'Mercado Municipal',
                address: `Centro, ${location}`,
                rating: 4.5,
                price_level: 'PRICE_LEVEL_INEXPENSIVE',
                type: 'shopping',
                summary: 'Artesanato, comidas típicas e cultura vibrante.',
                location: { lat: 0, lng: 0 }
            },
            {
                name: 'Mirante da Cidade',
                address: `Alto da Colina, ${location}`,
                rating: 4.6,
                price_level: 'PRICE_LEVEL_FREE',
                type: 'tourist_attraction',
                summary: 'A melhor vista panorâmica da região.',
                location: { lat: 0, lng: 0 }
            }
        ];

        // Simple filtering based on query/preferences
        let filtered = mockPlaces;
        if (preferences?.interests && Array.isArray(preferences.interests)) {
            // Very basic mock filtering
            if (preferences.interests.includes('gastronomy')) {
                filtered = mockPlaces.filter(p => p.type === 'restaurant' || p.type === 'shopping');
            } else if (preferences.interests.includes('nature')) {
                filtered = mockPlaces.filter(p => p.type === 'park' || p.type === 'tourist_attraction');
            }
        }

        return { results: filtered };
    }

    // --- REAL API CALL ---
    try {
        // Combine query and location for better search
        const textQuery = `${query} in ${location}`;

        const response = await fetch(GOOGLE_PLACES_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount,places.primaryType,places.location,places.editorialSummary'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                maxResultCount: 10,
                languageCode: 'pt-BR'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Places API Error:', errorText);
            return { results: [], error: `API Error: ${response.status}` };
        }

        const data = await response.json();

        if (!data.places) {
            return { results: [] };
        }

        let results: PlaceResult[] = data.places.map((place: any) => ({
            name: place.displayName?.text,
            address: place.formattedAddress,
            rating: place.rating,
            price_level: place.priceLevel, // PRICE_LEVEL_UNSPECIFIED, PRICE_LEVEL_INEXPENSIVE, etc.
            type: place.primaryType,
            summary: place.editorialSummary?.text,
            location: place.location
        }));

        // Filter by rating
        results = results.filter(p => (p.rating || 0) >= 4.0);

        return {
            results: results.slice(0, 8)
        };

    } catch (error) {
        console.error('searchPlaces exception:', error);
        return { results: [], error: 'Failed to search places' };
    }
}

