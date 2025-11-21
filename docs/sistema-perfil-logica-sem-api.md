# 🎯 Sistema de Perfil Baseado em Lógica (Sem API no Quiz)

## 📋 Visão Geral

Este documento descreve a implementação de um sistema de cálculo de perfil de viajante baseado em lógica determinística, eliminando a dependência da API Gemini durante o quiz. A API será usada apenas posteriormente na área de planejamento de viagens, quando o usuário já tiver completado o quiz e tiver acesso ao contexto completo.

---

## 🏗️ Arquitetura Proposta

### Fase 1: Quiz (SEM API) ✅

```
Usuário responde quiz
    ↓
Sistema calcula perfil usando LÓGICA DETERMINÍSTICA
    ↓
Salva no banco:
  - Todas as respostas (quiz_responses)
  - Perfil calculado (user_profiles)
    ↓
Usuário prossegue para área do app
```

**Benefícios:**
- ✅ Quiz nunca trava (sem dependência de API)
- ✅ Mais rápido para o usuário
- ✅ Não consome quota de API no onboarding
- ✅ Escalável e confiável

### Fase 2: Planejamento (COM API) 🚀

```
Usuário acessa área do agente
    ↓
Sistema busca do banco:
  - Respostas completas do quiz
  - Perfil do viajante calculado
    ↓
Usuário especifica:
  - Destino
  - Datas
  - Orçamento
    ↓
AGORA SIM usa Gemini/API para planejar viagem
com contexto completo do usuário
```

**Benefícios:**
- ✅ API usada apenas quando necessário
- ✅ Contexto completo disponível para o agente
- ✅ Planejamento mais preciso e personalizado
- ✅ Melhor uso de recursos da API

---

## 📊 Estrutura de Dados

### Tabela: `quiz_responses` (já existe)

Armazena todas as respostas individuais do quiz:

```sql
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_key VARCHAR(255) NOT NULL,  -- ex: "travelerType", "travelPace"
  answer_value JSONB NOT NULL,         -- valor da resposta
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Exemplos de dados:**
```json
{
  "question_key": "travelerType",
  "answer_value": "aventureiro"
}

{
  "question_key": "travelPace",
  "answer_value": "agitado"
}

{
  "question_key": "accommodationType",
  "answer_value": "hotel"
}
```

### Tabela: `user_profiles` (já existe)

Armazena o perfil calculado do viajante:

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  profile_data JSONB NOT NULL,  -- perfil completo calculado
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Estrutura do `profile_data`:**
```json
{
  "profile_id": "usr_30yo_sao_paulo_aventureiro",
  "profile_version": "1.0",
  "created_at": "2024-01-15",
  "travel_type": "leisure",
  
  "demographics": {
    "gender": "male",
    "age": 30,
    "city": "São Paulo",
    "state": "SP",
    "income_range": "6k-10k"
  },
  
  "preference_scores": {
    "adventure_level": 0.8,
    "luxury_preference": 0.3,
    "social_level": 0.6,
    "urban_vs_nature": 0.4,
    "activity_intensity": 0.9,
    "food_sophistication": 0.5,
    "fitness_priority": 0.7,
    "nightlife_interest": 0.6,
    "cultural_interest": 0.5,
    "exploration_desire": 0.9
  },
  
  "hard_requirements": {
    "accommodation_type": ["hotel", "hostel"],
    "location_preference": ["city_center", "near_transport"],
    "dietary_restrictions": [],
    "essential_amenities": ["wifi", "gym", "breakfast"],
    "transport_preference": ["uber", "public_transport"],
    "flight_class_preference": "economy",
    "must_have_experiences": ["nature", "adventure"],
    "has_pet": false,
    "has_own_vehicle": false
  },
  
  "budget_allocation_preference": {
    "flights": 0.25,
    "accommodation": 0.30,
    "food": 0.15,
    "activities": 0.25,
    "transport": 0.05
  },
  
  "persona_summary": "Você é um viajante aventureiro que busca contato intenso com a natureza e experiências autênticas. Valoriza boa comida local mais que luxo em hospedagem, e gosta de manter seu ritmo de treinos mesmo em viagem.",
  
  "music_preferences": ["rock", "eletrônica"],
  "favorite_activities": ["trilhas", "esportes"],
  "travel_rhythm": "agitado"
}
```

---

## 🔧 Implementação Técnica

### 1. Criar Calculadora de Perfil

**Arquivo:** `cashtrip/src/lib/profile/profile-calculator.ts` (novo)

Função principal que analisa todas as respostas e calcula o perfil:

```typescript
export function calculateUserProfile(responses: Record<string, any>): {
  user_profile: ProfileData
} {
  // 1. Calcular scores baseado em lógica determinística
  const scores = calculatePreferenceScores(responses);
  
  // 2. Definir hard requirements baseado em escolhas
  const requirements = calculateHardRequirements(responses);
  
  // 3. Calcular budget allocation baseado no perfil
  const budget = calculateBudgetAllocation(scores, responses);
  
  // 4. Gerar persona summary baseado no perfil
  const persona = generatePersonaSummary(scores, requirements, responses);
  
  // 5. Montar estrutura completa
  return {
    user_profile: {
      profile_id: generateProfileId(responses),
      profile_version: "1.0",
      created_at: new Date().toISOString().split('T')[0],
      travel_type: responses.travelPurpose || "leisure",
      demographics: extractDemographics(responses),
      preference_scores: scores,
      hard_requirements: requirements,
      budget_allocation_preference: budget,
      persona_summary: persona,
      music_preferences: extractMusicPreferences(responses),
      favorite_activities: extractFavoriteActivities(responses),
      travel_rhythm: responses.travelPace || "equilibrado",
    }
  };
}
```

### 2. Lógica de Cálculo de Scores

**Exemplos de regras:**

```typescript
function calculatePreferenceScores(responses: Record<string, any>) {
  const scores = {
    adventure_level: 0.5,      // base
    luxury_preference: 0.5,    // base
    social_level: 0.5,         // base
    urban_vs_nature: 0.5,      // base
    activity_intensity: 0.5,   // base
    food_sophistication: 0.5,  // base
    fitness_priority: 0.5,     // base
    nightlife_interest: 0.5,   // base
    cultural_interest: 0.5,    // base
    exploration_desire: 0.5,   // base
  };
  
  // Tipo de viajante
  switch (responses.travelerType) {
    case "aventureiro":
      scores.adventure_level = 0.8;
      scores.exploration_desire = 0.9;
      scores.urban_vs_nature = 0.2; // prefere natureza
      break;
    case "luxo":
      scores.luxury_preference = 0.9;
      scores.food_sophistication = 0.8;
      scores.activity_intensity = 0.3; // mais relax
      break;
    case "cultural":
      scores.cultural_interest = 0.9;
      scores.exploration_desire = 0.8;
      scores.urban_vs_nature = 0.6; // prefere cidades
      break;
    case "gastronômico":
      scores.food_sophistication = 0.9;
      scores.luxury_preference = 0.7;
      break;
    case "econômico":
      scores.luxury_preference = 0.2;
      scores.social_level = 0.7; // hostels
      break;
  }
  
  // Ritmo de viagem
  switch (responses.travelPace) {
    case "relax":
      scores.activity_intensity = 0.2;
      scores.exploration_desire = 0.3;
      break;
    case "equilibrado":
      scores.activity_intensity = 0.5;
      break;
    case "agitado":
      scores.activity_intensity = 0.9;
      scores.exploration_desire = 0.9;
      break;
  }
  
  // Tipo de hospedagem
  if (responses.accommodationType === "hostel") {
    scores.social_level += 0.3;
    scores.luxury_preference -= 0.2;
  } else if (responses.accommodationType === "resort") {
    scores.luxury_preference += 0.2;
    scores.activity_intensity -= 0.2;
  }
  
  // Frequência de treino
  switch (responses.workoutFrequency) {
    case "não treino":
      scores.fitness_priority = 0.0;
      break;
    case "ocasionalmente":
      scores.fitness_priority = 0.6;
      break;
    case "todo dia":
      scores.fitness_priority = 1.0;
      break;
  }
  
  // Vida noturna
  switch (responses.nighttimePreferences) {
    case "não curto":
      scores.nightlife_interest = 0.1;
      break;
    case "moderado":
      scores.nightlife_interest = 0.5;
      break;
    case "amo":
      scores.nightlife_interest = 0.9;
      break;
  }
  
  // Lugares durante o dia
  if (responses.daytimePlaces?.includes("natureza")) {
    scores.urban_vs_nature -= 0.3;
    scores.adventure_level += 0.2;
  }
  if (responses.daytimePlaces?.includes("centros urbanos")) {
    scores.urban_vs_nature += 0.3;
    scores.cultural_interest += 0.2;
  }
  
  // Garantir que scores estão entre 0.0 e 1.0
  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(0.0, Math.min(1.0, scores[key]));
  });
  
  return scores;
}
```

### 3. Lógica de Hard Requirements

```typescript
function calculateHardRequirements(responses: Record<string, any>) {
  const requirements = {
    accommodation_type: [],
    location_preference: [],
    dietary_restrictions: [],
    essential_amenities: [],
    transport_preference: [],
    flight_class_preference: "economy",
    must_have_experiences: [],
    has_pet: false,
    has_own_vehicle: false,
  };
  
  // Tipo de hospedagem
  if (responses.accommodationType) {
    requirements.accommodation_type = [responses.accommodationType];
  }
  
  // Localização
  if (responses.accommodationLocation) {
    switch (responses.accommodationLocation) {
      case "centro urbano":
        requirements.location_preference.push("city_center", "near_transport");
        break;
      case "praia":
        requirements.location_preference.push("beachfront", "oceanfront");
        break;
      case "natureza":
        requirements.location_preference.push("nature", "mountains");
        break;
    }
  }
  
  // Amenidades essenciais
  if (responses.accommodationEssentials) {
    requirements.essential_amenities = responses.accommodationEssentials;
  }
  
  // Transporte
  if (responses.destinationTransportation) {
    requirements.transport_preference = [responses.destinationTransportation];
  }
  
  // Restrições dietéticas
  if (responses.dietaryRestrictions && responses.dietaryRestrictions !== "sem restrições") {
    requirements.dietary_restrictions = [responses.dietaryRestrictions];
  }
  
  // Pet
  requirements.has_pet = responses.travelWithPets === true;
  
  // Veículo próprio
  requirements.has_own_vehicle = responses.ownVehicle === true;
  
  return requirements;
}
```

### 4. Lógica de Budget Allocation

```typescript
function calculateBudgetAllocation(scores: any, responses: Record<string, any>) {
  // Baseado no tipo de viajante e scores
  if (scores.luxury_preference > 0.7) {
    return {
      flights: 0.30,
      accommodation: 0.45,
      food: 0.20,
      activities: 0.05,
      transport: 0.00
    };
  }
  
  if (scores.adventure_level > 0.7) {
    return {
      flights: 0.25,
      accommodation: 0.30,
      food: 0.15,
      activities: 0.25,
      transport: 0.05
    };
  }
  
  if (scores.food_sophistication > 0.7) {
    return {
      flights: 0.25,
      accommodation: 0.30,
      food: 0.35,
      activities: 0.05,
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
```

### 5. Geração de Persona Summary

```typescript
function generatePersonaSummary(scores: any, requirements: any, responses: Record<string, any>) {
  const traits: string[] = [];
  
  // Tipo principal
  if (scores.adventure_level > 0.7) {
    traits.push("aventureiro que busca contato intenso com a natureza");
  }
  if (scores.luxury_preference > 0.7) {
    traits.push("valoriza conforto e experiências premium");
  }
  if (scores.cultural_interest > 0.7) {
    traits.push("interessado em cultura e história");
  }
  
  // Comportamentos
  if (scores.fitness_priority > 0.7) {
    traits.push("mantém rotina de treinos mesmo em viagem");
  }
  if (scores.food_sophistication > 0.7) {
    traits.push("valoriza gastronomia local e experiências culinárias");
  }
  if (scores.social_level > 0.7) {
    traits.push("gosta de conhecer pessoas e socializar");
  }
  
  // Orçamento
  if (scores.luxury_preference < 0.3) {
    traits.push("tem orçamento moderado e busca custo-benefício");
  }
  
  return `Você é um viajante ${traits.join(", ")}. ${generateAdditionalContext(scores, requirements)}`;
}
```

---

## 🔄 Modificações Necessárias

### 1. Simplificar Rota da API

**Arquivo:** `cashtrip/src/app/api/agent/process-quiz/route.ts`

**Antes:**
```typescript
try {
  profileData = await processQuizWithGemini(...);
} catch {
  profileData = createMockProfile(...);
}
```

**Depois:**
```typescript
// Calcular perfil diretamente (sem API)
const profileData = calculateUserProfile(responsesObj);

// Salvar no banco
await supabase.from('user_profiles').upsert({
  user_id: user.id,
  profile_data: profileData.user_profile,
  version: 1,
  updated_at: new Date().toISOString(),
});
```

### 2. Verificar QuizContext

**Arquivo:** `cashtrip/src/contexts/QuizContext.tsx`

Garantir que `saveResponse` está salvando todas as respostas no Supabase:

```typescript
const saveResponse = async (questionKey: string, answerValue: any) => {
  // Salvar no contexto local
  setResponses(prev => ({ ...prev, [questionKey]: answerValue }));
  
  // Salvar no Supabase
  await supabase.from('quiz_responses').upsert({
    user_id: user.id,
    question_key: questionKey,
    answer_value: answerValue,
  });
};
```

---

## 🚀 Próximos Passos (Futuro)

### 1. Área do Agente no App

**Novo arquivo:** `cashtrip/src/app/agent/plan-trip/page.tsx`

```typescript
export default function PlanTripPage() {
  const { data: profile } = useProfile(); // Busca do banco
  const { data: responses } = useQuizResponses(); // Busca do banco
  
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [budget, setBudget] = useState(0);
  
  const handlePlanTrip = async () => {
    // AGORA SIM usa Gemini com contexto completo
    const plan = await generateTripPlan({
      profile,
      responses,
      destination,
      dates,
      budget,
    });
    
    // Salvar plano gerado
    await saveTripPlan(plan);
  };
}
```

### 2. Integração com Gemini para Planejamento

**Novo arquivo:** `cashtrip/src/lib/agent/trip-planner.ts`

```typescript
export async function generateTripPlan(context: {
  profile: ProfileData;
  responses: QuizResponses;
  destination: string;
  dates: { start: string; end: string };
  budget: number;
}) {
  const prompt = buildTripPlanningPrompt(context);
  
  // Usar Gemini aqui
  const result = await geminiModel.generateContent(prompt);
  
  return parseTripPlan(result.response.text());
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar `cashtrip/src/lib/profile/profile-calculator.ts`
- [ ] Implementar `calculatePreferenceScores()`
- [ ] Implementar `calculateHardRequirements()`
- [ ] Implementar `calculateBudgetAllocation()`
- [ ] Implementar `generatePersonaSummary()`
- [ ] Simplificar `cashtrip/src/app/api/agent/process-quiz/route.ts`
- [ ] Remover dependência de `processQuizWithGemini` do quiz
- [ ] Verificar que `QuizContext` salva todas as respostas
- [ ] Testar cálculo de perfil com diferentes combinações de respostas
- [ ] Validar que perfil é salvo corretamente no banco
- [ ] Documentar regras de cálculo para futuras manutenções

---

## 📝 Notas Importantes

1. **Lógica Determinística**: Todas as regras devem ser claras e documentadas para facilitar manutenção futura.

2. **Validação**: Garantir que todos os scores estão entre 0.0 e 1.0 e que budget allocation soma 1.0.

3. **Extensibilidade**: A estrutura deve permitir adicionar novas regras facilmente sem quebrar o código existente.

4. **Testes**: Criar testes unitários para cada função de cálculo para garantir consistência.

5. **Performance**: Como não há chamadas de API, o cálculo deve ser instantâneo.

---

## 🎯 Resultado Esperado

Após a implementação:

1. ✅ Quiz funciona instantaneamente sem depender de API
2. ✅ Perfil é calculado com precisão baseado nas respostas
3. ✅ Todos os dados são salvos estruturadamente no banco
4. ✅ Usuário nunca fica travado por problemas de API
5. ✅ API Gemini será usada apenas quando realmente necessário (planejamento)
6. ✅ Sistema é escalável e confiável

---

**Data de Criação:** 2024-01-15  
**Status:** 📋 Planejado  
**Prioridade:** 🔥 Alta










