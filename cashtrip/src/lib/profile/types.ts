export interface QuizResponses {
  // Demografia
  gender?: 'male' | 'female' | 'non-binary';
  location?: { state: string; city: string };
  age?: number;
  birthDate?: string;
  income?: number;
  
  // Estilo de viagem
  travelerType?: ('adventurer' | 'cultural' | 'relax' | 'luxury' | 'economic' | 'balanced' | 'gastronomic')[];
  travelPace?: 'agitado' | 'equilibrado' | 'tranquilo';
  
  // Lugares e atividades
  daytimePlaces?: ('touristSpots' | 'quietPlaces' | 'urbanCenters' | 'restaurantsCafe' | 'adventureSports' | 'parksNature')[];
  nighttimePreferences?: ('culturalEvents' | 'nightlife' | 'fancyDinner' | 'attractions' | 'stayAtHotel' | 'calmDinners' | 'natureLuau')[];
  
  // Fitness e lifestyle
  workoutFrequency?: 'everyday' | 'occasionally' | 'yogaPilates' | 'noWorkout';
  
  // Alimentação
  foodLevels?: {
    gourmet: number;      // 0-5
    casual: number;       // 0-5
    healthy: number;      // 0-5
    local: number;        // 0-5
    cooking: number;      // 0-5
  };
  
  // Hospedagem
  accommodationType?: ('airbnb' | 'hotel' | 'resort' | 'hostel')[];
  accommodationLocation?: string;
  accommodationEssentials?: string[];
  
  // Transporte
  destinationTransportation?: string;
  flightPreferences?: string;
  
  // Outros
  musicStyles?: string[];
  dietaryRestrictions?: string;
  travelWithPets?: boolean;
  ownVehicle?: boolean;
  bucketList?: string[];
}

export interface PreferenceScores {
  adventure_level: number;          // 0-10
  luxury_preference: number;        // 0-10
  social_level: number;             // 0-10
  urban_vs_nature: number;          // 0-10 (0=natureza, 10=urbano)
  activity_intensity: number;       // 0-10
  food_sophistication: number;      // 0-10
  fitness_priority: number;         // 0-10
  nightlife_interest: number;       // 0-10
  cultural_interest: number;        // 0-10
  exploration_desire: number;       // 0-10
}

export interface HardRequirements {
  accommodation_type: string[];
  location_preference: string[];
  dietary_restrictions: string[];
  essential_amenities: string[];
  transport_preference: string[];
  flight_class_preference: string;
  must_have_experiences: string[];
  has_pet: boolean;
  has_own_vehicle: boolean;
}

export interface BudgetAllocation {
  flights: number;        // 0.0-1.0 (soma deve ser 1.0)
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
}

export interface ProfileData {
  profile_id: string;
  profile_version: string;
  created_at: string;
  travel_type: 'leisure' | 'business';
  demographics: {
    gender: string;
    age: number;
    city: string;
    state: string;
    income_range: string;
  };
  preference_scores: PreferenceScores;
  hard_requirements: HardRequirements;
  budget_allocation_preference: BudgetAllocation;
  persona_summary: string;
  music_preferences: string[];
  favorite_activities: string[];
  travel_rhythm: string;
}



