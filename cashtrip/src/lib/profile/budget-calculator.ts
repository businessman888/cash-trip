import { PreferenceScores, BudgetAllocation } from './types';

export function calculateBudgetAllocation(scores: PreferenceScores): BudgetAllocation {
  // Perfil Luxo
  if (scores.luxury_preference >= 8) {
    return {
      flights: 0.30,
      accommodation: 0.45,
      food: 0.20,
      activities: 0.05,
      transport: 0.00
    };
  }
  
  // Perfil Aventureiro
  if (scores.adventure_level >= 8) {
    return {
      flights: 0.25,
      accommodation: 0.25,
      food: 0.15,
      activities: 0.30,
      transport: 0.05
    };
  }
  
  // Perfil Gastronômico
  if (scores.food_sophistication >= 8) {
    return {
      flights: 0.25,
      accommodation: 0.30,
      food: 0.35,
      activities: 0.05,
      transport: 0.05
    };
  }
  
  // Perfil Cultural
  if (scores.cultural_interest >= 8) {
    return {
      flights: 0.28,
      accommodation: 0.32,
      food: 0.15,
      activities: 0.20,
      transport: 0.05
    };
  }
  
  // Perfil Econômico
  if (scores.luxury_preference <= 3) {
    return {
      flights: 0.35,
      accommodation: 0.35,
      food: 0.15,
      activities: 0.10,
      transport: 0.05
    };
  }
  
  // Padrão equilibrado
  return {
    flights: 0.30,
    accommodation: 0.35,
    food: 0.15,
    activities: 0.15,
    transport: 0.05
  };
}



