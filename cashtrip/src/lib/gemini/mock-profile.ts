/**
 * Perfil mock/fallback para quando a API do Gemini falhar
 */

export function createMockProfile(responses: Record<string, any>): any {
  const age = responses.age || 30;
  const city = responses.location?.city || 'São Paulo';
  const gender = responses.gender || 'other';
  const income = responses.income || 5000;
  
  // Determinar income_range baseado no valor
  let incomeRange = '3k-6k';
  if (income >= 20000) incomeRange = '20k+';
  else if (income >= 10000) incomeRange = '10k-20k';
  else if (income >= 6000) incomeRange = '6k-10k';
  
  return {
    user_profile: {
      profile_id: `usr_${age}yo_${city.toLowerCase().replace(/\s+/g, '_')}_default`,
      profile_version: '1.0',
      created_at: new Date().toISOString().split('T')[0],
      travel_type: responses.travelPurpose === 'business' ? 'business' : 'leisure',
      
      demographics: {
        gender: gender,
        age: age,
        city: city,
        state: responses.location?.state || 'SP',
        income_range: incomeRange,
      },
      
      preference_scores: {
        adventure_level: 0.5,
        luxury_preference: 0.5,
        social_level: 0.5,
        urban_vs_nature: 0.5,
        activity_intensity: 0.5,
        food_sophistication: 0.5,
        fitness_priority: 0.5,
        nightlife_interest: 0.5,
        cultural_interest: 0.5,
        exploration_desire: 0.5,
      },
      
      hard_requirements: {
        accommodation_type: responses.accommodationType ? [responses.accommodationType] : ['hotel'],
        location_preference: ['flexible'],
        dietary_restrictions: responses.dietaryRestrictions ? [responses.dietaryRestrictions] : [],
        essential_amenities: ['wifi', 'breakfast'],
        transport_preference: responses.destinationTransportation ? [responses.destinationTransportation] : ['uber'],
        flight_class_preference: 'economy',
        must_have_experiences: [],
        has_pet: responses.travelWithPets === true,
        has_own_vehicle: responses.ownVehicle === true,
      },
      
      budget_allocation_preference: {
        flights: 0.30,
        accommodation: 0.40,
        food: 0.15,
        activities: 0.10,
        transport: 0.05,
      },
      
      persona_summary: `Você é um viajante que busca experiências equilibradas entre conforto e autenticidade. Valoriza boa localização e amenidades essenciais, mantendo um orçamento moderado.`,
      
      music_preferences: responses.musicStyles ? [responses.musicStyles] : [],
      favorite_activities: [],
      travel_rhythm: responses.travelPace || 'equilibrado',
    },
  };
}

