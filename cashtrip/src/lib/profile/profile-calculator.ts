import { QuizResponses, ProfileData } from './types';
import { calculatePreferenceScores } from './score-calculator';
import { calculateHardRequirements } from './requirements-calculator';
import { calculateBudgetAllocation } from './budget-calculator';
import { generatePersonaSummary } from './persona-generator';

export function calculateUserProfile(responses: QuizResponses): ProfileData {
  // 1. Calcular scores
  const scores = calculatePreferenceScores(responses);
  
  // 2. Calcular requirements
  const requirements = calculateHardRequirements(responses);
  
  // 3. Calcular budget allocation
  const budget = calculateBudgetAllocation(scores);
  
  // 4. Gerar persona summary
  const persona = generatePersonaSummary(scores, requirements, responses);
  
  // 5. Extrair demografia
  const demographics = {
    gender: responses.gender || 'other',
    age: responses.age || 30,
    city: responses.location?.city || 'São Paulo',
    state: responses.location?.state || 'SP',
    income_range: getIncomeRange(responses.income || 3000),
  };
  
  // 6. Gerar profile ID
  const profileId = `usr_${demographics.age}yo_${demographics.city.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
  
  // 7. Montar estrutura completa
  return {
    profile_id: profileId,
    profile_version: '1.0',
    created_at: new Date().toISOString().split('T')[0],
    travel_type: 'leisure',
    demographics,
    preference_scores: scores,
    hard_requirements: requirements,
    budget_allocation_preference: budget,
    persona_summary: persona,
    music_preferences: responses.musicStyles || [],
    favorite_activities: extractFavoriteActivities(responses),
    travel_rhythm: responses.travelPace || 'equilibrado',
  };
}

function getIncomeRange(income: number): string {
  if (income >= 20000) return '20k+';
  if (income >= 10000) return '10k-20k';
  if (income >= 6000) return '6k-10k';
  if (income >= 3000) return '3k-6k';
  return 'até 3k';
}

function extractFavoriteActivities(responses: QuizResponses): string[] {
  const activities: string[] = [];
  
  if (responses.daytimePlaces) {
    const mapping: Record<string, string> = {
      'adventureSports': 'esportes',
      'parksNature': 'natureza',
      'touristSpots': 'turismo',
      'urbanCenters': 'exploração urbana',
      'restaurantsCafe': 'gastronomia',
      'quietPlaces': 'lugares tranquilos'
    };
    
    responses.daytimePlaces.forEach(place => {
      if (mapping[place]) {
        activities.push(mapping[place]);
      }
    });
  }
  
  return activities.slice(0, 5); // máximo 5
}



