import { useState, useEffect, useCallback, useRef } from "react";

interface PlacePrediction {
    description: string;
    place_id: string;
    main_text: string;
    secondary_text: string;
}

interface PlaceDetails {
    lat: number;
    lng: number;
    address: string;
}

export const useGoogleAutocomplete = () => {
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [autocompleteService, setAutocompleteService] =
        useState<google.maps.places.AutocompleteService | null>(null);
    const [placesService, setPlacesService] =
        useState<google.maps.places.PlacesService | null>(null);
    const sessionToken =
        useRef<google.maps.places.AutocompleteSessionToken | null>(null);

    // 1. Initialize API using new functional API
    useEffect(() => {
        const initGoogleMaps = async () => {
            try {
                // Load the Google Maps script
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    // Initialize services after script loads
                    if (window.google && window.google.maps) {
                        setAutocompleteService(new google.maps.places.AutocompleteService());
                        sessionToken.current = new google.maps.places.AutocompleteSessionToken();

                        // PlacesService needs an HTML element (even if dummy) or map.
                        const virtualDiv = document.createElement('div');
                        setPlacesService(new google.maps.places.PlacesService(virtualDiv));
                    }
                };

                document.head.appendChild(script);
            } catch (error) {
                console.error('Error loading Google Maps:', error);
            }
        };

        initGoogleMaps();
    }, []);

    // 2. Fetch Suggestions (Autocomplete)
    const fetchPredictions = useCallback((inputValue: string) => {
        if (!inputValue || !autocompleteService || !sessionToken.current) {
            setPredictions([]);
            return;
        }

        const request = {
            input: inputValue,
            sessionToken: sessionToken.current,
            // Optional: Restrict search to Brazil
            // componentRestrictions: { country: "br" },
        };

        autocompleteService.getPlacePredictions(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPredictions(results.map(place => ({
                    description: place.description,
                    place_id: place.place_id,
                    main_text: place.structured_formatting.main_text,
                    secondary_text: place.structured_formatting.secondary_text,
                })));
            } else {
                setPredictions([]);
            }
        });
    }, [autocompleteService]);

    // 3. Get Coordinates (Commit the Transaction)
    // This function consumes the Session Token and generates the final charge
    const getPlaceDetails = useCallback((placeId: string): Promise<PlaceDetails> => {
        return new Promise((resolve, reject) => {
            if (!placesService || !sessionToken.current) {
                reject("Google Maps Service not initialized");
                return;
            }

            const request: google.maps.places.PlaceDetailsRequest = {
                placeId: placeId,
                fields: ["geometry", "formatted_address"], // Only what we need to save costs
                sessionToken: sessionToken.current,
            };

            placesService.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
                    // Reset Token after use (start new session)
                    sessionToken.current = new google.maps.places.AutocompleteSessionToken();

                    resolve({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        address: place.formatted_address || "",
                    });
                } else {
                    reject("Could not fetch place details");
                }
            });
        });
    }, [placesService]);

    return { predictions, fetchPredictions, getPlaceDetails };
};
