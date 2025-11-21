import { PreferenceScores, HardRequirements, QuizResponses } from './types';

export function generatePersonaSummary(
  scores: PreferenceScores,
  requirements: HardRequirements,
  responses: QuizResponses
): string {
  const traits: string[] = [];
  const behaviors: string[] = [];
  
  // Identificar perfil principal
  if (scores.adventure_level >= 8) {
    traits.push("aventureiro que busca experiências autênticas e contato intenso com a natureza");
  } else if (scores.luxury_preference >= 8) {
    traits.push("que valoriza conforto, sofisticação e experiências premium em suas viagens");
  } else if (scores.cultural_interest >= 8) {
    traits.push("apaixonado por cultura, história e arte, sempre em busca de imersão local");
  } else if (scores.food_sophistication >= 8) {
    traits.push("gourmet que prioriza experiências gastronômicas autênticas e sofisticadas");
  } else {
    traits.push("que busca experiências equilibradas entre aventura, cultura e relaxamento");
  }
  
  // Comportamentos específicos
  if (scores.fitness_priority >= 8) {
    behaviors.push("mantém sua rotina de treinos mesmo durante as viagens");
  }
  
  if (scores.nightlife_interest >= 8) {
    behaviors.push("adora explorar a vida noturna e atmosfera social dos destinos");
  } else if (scores.nightlife_interest <= 3) {
    behaviors.push("prefere noites tranquilas e jantares relaxantes");
  }
  
  if (scores.social_level >= 8) {
    behaviors.push("gosta de conhecer pessoas novas e compartilhar experiências");
  }
  
  if (scores.urban_vs_nature <= 3) {
    behaviors.push("tem forte conexão com a natureza e ambientes ao ar livre");
  } else if (scores.urban_vs_nature >= 8) {
    behaviors.push("se energiza explorando centros urbanos e cidades vibrantes");
  }
  
  if (scores.exploration_desire >= 8) {
    behaviors.push("sempre em busca de lugares únicos fora dos roteiros convencionais");
  }
  
  // Orçamento
  if (scores.luxury_preference <= 3) {
    behaviors.push("tem orçamento moderado e busca o melhor custo-benefício");
  }
  
  // Montar texto final
  let summary = `Você é um viajante ${traits[0]}.`;
  
  if (behaviors.length > 0) {
    summary += ` ${behaviors.join(', ')}.`;
  }
  
  // Adicionar ritmo
  if (responses.travelPace) {
    const paceText: Record<string, string> = {
      'agitado': 'Prefere um ritmo intenso com muitas atividades por dia',
      'equilibrado': 'Gosta de equilibrar momentos de atividade com pausas para relaxar',
      'tranquilo': 'Valoriza um ritmo mais zen com tempo livre e poucas atividades programadas'
    };
    summary += ` ${paceText[responses.travelPace]}.`;
  }
  
  return summary;
}



