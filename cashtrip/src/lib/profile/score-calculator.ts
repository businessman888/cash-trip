import { QuizResponses, PreferenceScores } from './types';

export function calculatePreferenceScores(responses: QuizResponses): PreferenceScores {
  // Inicializar scores base (5 = neutro)
  const scores: PreferenceScores = {
    adventure_level: 5,
    luxury_preference: 5,
    social_level: 5,
    urban_vs_nature: 5,
    activity_intensity: 5,
    food_sophistication: 5,
    fitness_priority: 5,
    nightlife_interest: 5,
    cultural_interest: 5,
    exploration_desire: 5,
  };
  
  // REGRA 1: Tipo de viajante (peso maior)
  if (responses.travelerType) {
    for (const type of responses.travelerType) {
      switch (type) {
        case 'adventurer':
          scores.adventure_level += 3;
          scores.exploration_desire += 3;
          scores.urban_vs_nature -= 2; // mais natureza
          scores.activity_intensity += 2;
          break;
        case 'luxury':
          scores.luxury_preference += 4;
          scores.food_sophistication += 3;
          scores.activity_intensity -= 2;
          scores.social_level -= 1;
          break;
        case 'cultural':
          scores.cultural_interest += 4;
          scores.exploration_desire += 2;
          scores.urban_vs_nature += 2; // mais urbano
          break;
        case 'gastronomic':
          scores.food_sophistication += 4;
          scores.luxury_preference += 2;
          scores.cultural_interest += 1;
          break;
        case 'economic':
          scores.luxury_preference -= 3;
          scores.social_level += 2; // hostels
          break;
        case 'relax':
          scores.activity_intensity -= 3;
          scores.nightlife_interest -= 2;
          break;
        case 'balanced':
          // mantém neutro, não ajusta nada
          break;
      }
    }
  }
  
  // REGRA 2: Ritmo de viagem
  switch (responses.travelPace) {
    case 'agitado':
      scores.activity_intensity += 3;
      scores.exploration_desire += 2;
      break;
    case 'tranquilo':
      scores.activity_intensity -= 3;
      scores.exploration_desire -= 1;
      break;
    case 'equilibrado':
      // neutro
      break;
  }
  
  // REGRA 3: Lugares durante o dia
  if (responses.daytimePlaces) {
    for (const place of responses.daytimePlaces) {
      switch (place) {
        case 'parksNature':
          scores.urban_vs_nature -= 2;
          scores.adventure_level += 1;
          break;
        case 'adventureSports':
          scores.adventure_level += 2;
          scores.activity_intensity += 2;
          scores.urban_vs_nature -= 1;
          break;
        case 'urbanCenters':
          scores.urban_vs_nature += 2;
          scores.cultural_interest += 1;
          break;
        case 'touristSpots':
          scores.cultural_interest += 1;
          scores.exploration_desire += 1;
          break;
        case 'quietPlaces':
          scores.activity_intensity -= 1;
          scores.social_level -= 1;
          break;
        case 'restaurantsCafe':
          scores.food_sophistication += 1;
          scores.social_level += 1;
          break;
      }
    }
  }
  
  // REGRA 4: Preferências noturnas
  if (responses.nighttimePreferences) {
    for (const pref of responses.nighttimePreferences) {
      switch (pref) {
        case 'nightlife':
          scores.nightlife_interest += 3;
          scores.social_level += 2;
          break;
        case 'culturalEvents':
          scores.cultural_interest += 2;
          scores.nightlife_interest += 1;
          break;
        case 'fancyDinner':
          scores.food_sophistication += 2;
          scores.luxury_preference += 1;
          break;
        case 'stayAtHotel':
          scores.nightlife_interest -= 2;
          scores.activity_intensity -= 1;
          break;
        case 'calmDinners':
          scores.food_sophistication += 1;
          scores.nightlife_interest -= 1;
          break;
        case 'natureLuau':
          scores.urban_vs_nature -= 1;
          scores.adventure_level += 1;
          break;
        case 'attractions':
          scores.cultural_interest += 1;
          scores.social_level += 1;
          break;
      }
    }
  }
  
  // REGRA 5: Fitness/Academia
  switch (responses.workoutFrequency) {
    case 'everyday':
      scores.fitness_priority = 10;
      scores.activity_intensity += 1;
      break;
    case 'occasionally':
      scores.fitness_priority = 6;
      break;
    case 'yogaPilates':
      scores.fitness_priority = 7;
      scores.activity_intensity -= 1;
      break;
    case 'noWorkout':
      scores.fitness_priority = 0;
      break;
  }
  
  // REGRA 6: Níveis de alimentação
  if (responses.foodLevels) {
    const avgFood = (
      responses.foodLevels.gourmet * 2 +  // peso maior
      responses.foodLevels.casual * 0.5 +  // peso menor
      responses.foodLevels.healthy +
      responses.foodLevels.local +
      responses.foodLevels.cooking * 0.3
    ) / 5;
    
    scores.food_sophistication += Math.round((avgFood / 5) * 3);
    
    if (responses.foodLevels.gourmet >= 4) {
      scores.luxury_preference += 1;
    }
  }
  
  // REGRA 7: Tipo de hospedagem
  if (responses.accommodationType) {
    for (const acc of responses.accommodationType) {
      switch (acc) {
        case 'resort':
          scores.luxury_preference += 2;
          scores.activity_intensity -= 1;
          break;
        case 'hostel':
          scores.social_level += 2;
          scores.luxury_preference -= 2;
          break;
        case 'hotel':
          scores.luxury_preference += 1;
          break;
        case 'airbnb':
          scores.social_level -= 1;
          break;
      }
    }
  }
  
  // Normalizar: garantir que scores estão entre 0 e 10
  Object.keys(scores).forEach(key => {
    const k = key as keyof PreferenceScores;
    scores[k] = Math.max(0, Math.min(10, scores[k]));
  });
  
  return scores;
}



