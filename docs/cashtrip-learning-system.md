# 🧠 Cash Trip - Sistema de Aprendizado Contínuo

---

## 🎯 OBJETIVO

Fazer o agente aprender com cada viagem para melhorar recomendações futuras, alcançando **99%+ de match** após 3-5 viagens.

---

## 📊 ARQUITETURA DO SISTEMA DE APRENDIZADO

```
┌─────────────────────────────────────────────────────┐
│              PERFIL INICIAL (Quiz)                  │
│  - Scores base: adventure_level, luxury, etc        │
│  - Hard requirements                                │
│  - Budget allocation                                │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│           VIAGEM 1 PLANEJADA                        │
│  → Agente usa perfil inicial                        │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│        FEEDBACK PÓS-VIAGEM (Crítico!)               │
│  - O que você AMOU? ⭐⭐⭐⭐⭐                        │
│  - O que foi OK? ⭐⭐⭐                               │
│  - O que NÃO gostou? ⭐                              │
│  - O que mudaria?                                   │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│       SISTEMA DE LEARNING (IA Analisa)              │
│  → Ajusta scores                                    │
│  → Descobre preferências ocultas                   │
│  → Atualiza hard requirements                      │
└────────────┬────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────┐
│           PERFIL EVOLUÍDO v1.1                      │
│  → Scores ajustados                                │
│  → Novas descobertas adicionadas                   │
└────────────┬────────────────────────────────────────┘
             │
             ↓
        [VIAGEM 2, 3, 4...]
        (Cada vez mais preciso!)
```

---

## 🗄️ ESTRUTURA DE DADOS (Banco)

### Tabela: `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  version INTEGER DEFAULT 1, -- v1.0, v1.1, v1.2...
  
  -- Scores iniciais (do quiz)
  initial_scores JSONB,
  
  -- Scores atuais (ajustados com aprendizado)
  current_scores JSONB,
  
  -- Histórico de ajustes
  score_history JSONB[], -- [{version, date, changes, reason}]
  
  -- Descobertas ao longo do tempo
  learned_preferences JSONB, -- {loves, likes, dislikes, hidden_gems}
  
  -- Hard requirements (podem evoluir)
  hard_requirements JSONB,
  
  -- Metadados
  total_trips INTEGER DEFAULT 0,
  learning_confidence FLOAT DEFAULT 0.5, -- 0.5 → 1.0 (mais viagens = mais confiança)
  last_updated TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: `trips`
```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID,
  profile_version INTEGER, -- qual versão do perfil foi usada
  
  -- Dados da viagem
  destination JSONB,
  dates JSONB,
  budget FLOAT,
  trip_plan JSONB, -- roteiro completo gerado
  
  -- Execução
  status VARCHAR, -- planned, booked, completed, cancelled
  bookings JSONB[], -- reservas executadas
  
  -- FEEDBACK (crucial para aprendizado!)
  feedback JSONB, -- estrutura abaixo
  feedback_at TIMESTAMP,
  
  created_at TIMESTAMP
);
```

### Estrutura do `feedback`:
```json
{
  "overall_rating": 5, // 1-5 estrelas
  "would_recommend": true,
  
  "ratings": {
    "flights": {
      "rating": 5,
      "loved": ["Voo direto", "Horário perfeito"],
      "disliked": [],
      "would_change": null
    },
    "accommodation": {
      "rating": 4,
      "loved": ["Localização incrível", "Academia ótima"],
      "disliked": ["Quarto pequeno"],
      "would_change": "Preferia uma casa/airbnb"
    },
    "restaurants": {
      "rating": 5,
      "loved": ["Restaurante X foi perfeito", "Opções vegetarianas excelentes"],
      "disliked": [],
      "favorites": ["Restaurante X", "Restaurante Y"]
    },
    "activities": {
      "rating": 5,
      "loved": ["Trilha do Vale do Pati", "Cachoeira da Fumaça"],
      "disliked": ["Museu foi chato"],
      "would_add": "Mais tempo livre para relaxar"
    },
    "budget": {
      "rating": 5,
      "spent_vs_planned": 0.95, // gastou 95% do planejado
      "felt_expensive": false,
      "would_spend_more_on": "Experiências gastronômicas",
      "could_save_on": "Transporte"
    },
    "pace": {
      "rating": 4,
      "felt": "Um pouco intenso", // options: muito relaxado, bom, um pouco intenso, muito intenso
      "ideal_activities_per_day": 3 // vs 5 que foram planejadas
    }
  },
  
  "discoveries": {
    "new_interests": ["Fotografia de natureza", "Observação de pássaros"],
    "surprises": ["Adorei os fervedouros, não esperava"],
    "next_time": ["Quero tentar escalada", "Mais dias na natureza"]
  },
  
  "text_feedback": "A viagem foi incrível! A Chapada superou expectativas. Amei as trilhas e a comida baiana vegetariana. Única coisa: preferia ter ficado num Airbnb com cozinha ao invés de hotel. E o ritmo foi um pouco intenso, prefiro 3 atividades/dia ao invés de 5."
}
```

### Tabela: `learning_events`
```sql
CREATE TABLE learning_events (
  id UUID PRIMARY KEY,
  user_id UUID,
  trip_id UUID,
  
  event_type VARCHAR, -- 'feedback_received', 'score_adjusted', 'preference_discovered', 'requirement_changed'
  
  -- O que foi aprendido
  learning JSONB, -- {from, to, reason, confidence}
  
  -- Impacto
  impact_on_profile JSONB, -- quais scores/requirements mudaram
  
  created_at TIMESTAMP
);
```

---

## 🧠 ALGORITMO DE APRENDIZADO

### 1. **Coleta de Feedback Estruturado**

Após cada viagem, app mostra:

```
┌────────────────────────────────────────┐
│  Como foi sua viagem? 🌟               │
│                                        │
│  [⭐⭐⭐⭐⭐] Avaliação Geral            │
│                                        │
│  ✈️ Voos                               │
│  [⭐⭐⭐⭐⭐] Como foi?                  │
│  O que você amou: ___________          │
│  O que não curtiu: ___________         │
│                                        │
│  🏨 Hospedagem                         │
│  [⭐⭐⭐⭐☆] Como foi?                  │
│  Preferia outro tipo? [Hotel ▼]       │
│                                        │
│  🍽️ Restaurantes                      │
│  Quais foram seus TOP 3?               │
│  1. _______                            │
│  2. _______                            │
│  3. _______                            │
│                                        │
│  🎯 Atividades                         │
│  Qual você mais amou? _______          │
│  Qual foi dispensável? _______         │
│  Faltou algo? _______                  │
│                                        │
│  ⚡ Ritmo da viagem                    │
│  Como sentiu?                          │
│  ◯ Muito relaxado (queria mais ação)  │
│  ◉ Perfeito                            │
│  ◯ Um pouco intenso                    │
│  ◯ Muito intenso (cansativo)          │
│                                        │
│  📝 Comentários livres:                │
│  [text area]                           │
│                                        │
│  [Enviar Feedback]                     │
└────────────────────────────────────────┘
```

---

### 2. **Análise e Ajuste de Scores (IA)**

Quando feedback é recebido, o agente analisa e atualiza:

#### Função: `analyzeAndLearn()`

```javascript
// backend/services/learningEngine.js

export async function analyzeAndLearn(userId, tripId, feedback) {
  // 1. Buscar perfil atual e viagem
  const user = await db.users.findById(userId);
  const trip = await db.trips.findById(tripId);
  
  const currentProfile = user.profile;
  const tripPlan = trip.trip_plan;
  
  // 2. Chamar agente para analisar feedback
  const analysis = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: LEARNING_SYSTEM_PROMPT, // prompt específico para aprendizado
    messages: [{
      role: 'user',
      content: `
PERFIL ATUAL:
${JSON.stringify(currentProfile.current_scores)}

VIAGEM REALIZADA:
${JSON.stringify(tripPlan)}

FEEDBACK DO USUÁRIO:
${JSON.stringify(feedback)}

ANALISE:
1. Quais scores devem ser ajustados? (ex: se achou ritmo intenso, diminuir activity_intensity)
2. Quais preferências ocultas foram descobertas? (ex: adora fervedouros)
3. Quais hard_requirements devem mudar? (ex: prefere airbnb a hotel)
4. Qual a confiança em cada ajuste? (0-1)

Retorne JSON estruturado com as mudanças propostas.
      `
    }]
  });
  
  const learningResult = extractLearningJSON(analysis.content);
  
  // 3. Aplicar ajustes no perfil
  const updatedProfile = applyLearning(currentProfile, learningResult);
  
  // 4. Salvar nova versão do perfil
  await db.profiles.create({
    user_id: userId,
    version: currentProfile.version + 1,
    initial_scores: currentProfile.initial_scores, // mantém original
    current_scores: updatedProfile.scores,
    learned_preferences: updatedProfile.learned_preferences,
    score_history: [
      ...currentProfile.score_history,
      {
        version: currentProfile.version + 1,
        date: new Date(),
        changes: learningResult.changes,
        reason: learningResult.reason,
        confidence: learningResult.confidence
      }
    ],
    learning_confidence: calculateConfidence(user.total_trips + 1),
    total_trips: user.total_trips + 1
  });
  
  // 5. Registrar evento de aprendizado
  await db.learning_events.create({
    user_id: userId,
    trip_id: tripId,
    event_type: 'profile_updated',
    learning: learningResult,
    impact_on_profile: learningResult.changes
  });
  
  return updatedProfile;
}
```

---

### 3. **Prompt de Aprendizado (Sistema)**

```markdown
# SISTEMA DE APRENDIZADO CONTÍNUO

Você é o Learning Engine da Cash Trip. Sua função é analisar o feedback de viagens e propor ajustes no perfil do usuário para melhorar futuras recomendações.

## INPUT
1. Perfil atual do usuário (scores, preferences, requirements)
2. Viagem que foi realizada (destino, roteiro, escolhas feitas)
3. Feedback detalhado do usuário

## MISSÃO
Identificar:
1. **Score Adjustments:** Quais scores devem mudar e por quê
2. **Hidden Preferences:** Preferências que não eram óbvias no quiz
3. **Requirement Changes:** Hard requirements que devem ser atualizados
4. **Patterns:** Padrões que emergem ao longo das viagens

## REGRAS DE AJUSTE

### Ajuste de Scores (incremental)
- Cada ajuste: máximo ±0.1 por viagem
- Confiança: baseada em consistência do feedback
- Nunca ultrapassar 0.0-1.0

### Exemplos de Aprendizado:

**Feedback:** "Achei o ritmo muito intenso, estava cansativo"
**Ação:** activity_intensity: 0.9 → 0.7 (-0.2)
**Razão:** Usuário preferiu ritmo mais moderado
**Confiança:** 0.9 (feedback claro e direto)

**Feedback:** "Adorei ficar no Airbnb com cozinha, hotel foi bom mas prefiro casa"
**Ação:** 
- accommodation_type: adicionar forte preferência por "airbnb"
- Novo learned_preference: "Valoriza poder cozinhar ocasionalmente"
**Confiança:** 0.85

**Feedback:** "Museu foi chato, preferia mais trilhas"
**Ação:**
- cultural_interest: 0.7 → 0.5 (-0.2)
- adventure_level: 0.8 → 0.9 (+0.1)
**Confiança:** 0.8

**Feedback:** "Restaurante X foi INCRÍVEL, melhor experiência da viagem"
**Ação:**
- Adicionar em learned_preferences.loved_experiences: "Fine dining vegetariano"
- food_sophistication: 0.7 → 0.8 (+0.1)
- Adicionar em favorites.restaurants: "Restaurante X"
**Confiança:** 0.95

**Feedback:** "Adorei os fervedouros, não esperava"
**Ação:**
- Adicionar em discoveries.new_interests: "Fenômenos naturais raros"
- exploration_desire: 0.8 → 0.9 (+0.1)
**Confiança:** 0.7 (descoberta nova)

## PADRÕES A DETECTAR

### Preferências Consistentes (3+ viagens)
Se em 3 viagens seguidas o usuário:
- Sempre dá 5⭐ para trilhas → adventure_level deve estar 0.9+
- Sempre escolhe restaurantes vegetarianos premium → food_sophistication alto + dietary strong
- Sempre prefere Airbnb → mudar hard_requirement

### Mudanças de Perfil (Evolução)
Detectar se usuário está:
- Ficando mais aventureiro (scores sobem ao longo do tempo)
- Ficando mais luxuoso (scores de luxury aumentam)
- Descobrindo novos interesses (novos learned_preferences)

### Inconsistências (Alertas)
Se usuário dá feedback contraditório:
- Viagem 1: "Muito intenso" → diminui activity_intensity
- Viagem 2: "Muito relaxado" → ???
- Ação: Não ajustar, manter score atual, adicionar nota: "Preferência varia conforme destino/contexto"

## OUTPUT ESTRUTURADO

```json
{
  "learning_summary": "Usuário prefere ritmo mais moderado do que indicava perfil inicial. Descobriu amor por Airbnbs com cozinha e experiências gastronômicas premium vegetarianas. Interesse cultural menor que esperado.",
  
  "score_adjustments": [
    {
      "score": "activity_intensity",
      "from": 0.9,
      "to": 0.7,
      "change": -0.2,
      "reason": "Feedback consistente: 'ritmo intenso demais'",
      "confidence": 0.9,
      "impact": "Futuras viagens terão 3-4 atividades/dia ao invés de 5-6"
    },
    {
      "score": "cultural_interest",
      "from": 0.7,
      "to": 0.5,
      "change": -0.2,
      "reason": "Feedback: 'museu foi chato', preferiu trilhas",
      "confidence": 0.8,
      "impact": "Menos museus, mais atividades ao ar livre"
    },
    {
      "score": "food_sophistication",
      "from": 0.7,
      "to": 0.8,
      "change": +0.1,
      "reason": "Adorou experiência gastronômica premium vegetariana",
      "confidence": 0.95,
      "impact": "Priorizar mais 1-2 experiências gastronômicas especiais"
    }
  ],
  
  "requirement_changes": [
    {
      "requirement": "accommodation_type",
      "action": "add_strong_preference",
      "value": "airbnb",
      "reason": "Preferiu Airbnb com cozinha ao hotel",
      "confidence": 0.85,
      "impact": "Futuras viagens priorizarão Airbnb/casas"
    }
  ],
  
  "learned_preferences": {
    "loves": [
      {
        "category": "accommodation_features",
        "item": "Airbnb com cozinha",
        "discovered_in": "trip_1",
        "confidence": 0.85
      },
      {
        "category": "gastronomy",
        "item": "Fine dining vegetariano premium",
        "discovered_in": "trip_1",
        "confidence": 0.95
      },
      {
        "category": "nature",
        "item": "Fervedouros e fenômenos naturais raros",
        "discovered_in": "trip_1",
        "confidence": 0.75
      }
    ],
    "dislikes": [
      {
        "category": "activities",
        "item": "Museus tradicionais",
        "confidence": 0.7
      }
    ],
    "hidden_gems": [
      "Valoriza poder cozinhar ocasionalmente em viagens",
      "Prefere descobrir lugares únicos a pontos turísticos famosos"
    ]
  },
  
  "favorites": {
    "restaurants": ["Restaurante X (Chapada)"],
    "activities": ["Trilha Vale do Pati", "Fervedouro do Ceiça"],
    "destinations": ["Chapada Diamantina"]
  },
  
  "patterns_detected": [
    {
      "pattern": "activity_preference_shift",
      "description": "Usuário prefere natureza/aventura sobre cultura/museus",
      "confidence": 0.8,
      "trips_analyzed": 1,
      "needs_confirmation": true // precisa de mais viagens
    }
  ],
  
  "next_trip_recommendations": [
    "Priorizar destinos com Airbnb/casas com cozinha",
    "Planejar 3-4 atividades/dia (não 5-6)",
    "Focar em trilhas e natureza, reduzir museus",
    "Incluir 1-2 experiências gastronômicas premium vegetarianas",
    "Buscar destinos com fenômenos naturais únicos"
  ],
  
  "learning_confidence": 0.65, // aumenta com mais viagens
  "needs_more_data_on": ["social_level", "nightlife_interest"] // scores sem feedback ainda
}
```

## CÁLCULO DE CONFIANÇA

```
learning_confidence = base_confidence + (trips_completed * 0.1)

base_confidence = 0.5 (do quiz inicial)
Após 1 viagem = 0.6
Após 2 viagens = 0.7
Após 3 viagens = 0.8
Após 5+ viagens = 1.0 (máximo)
```

## QUANDO NÃO AJUSTAR

❌ Se feedback for muito vago: "Foi legal"
❌ Se for primeira viagem (exceto mudanças muito claras)
❌ Se houver conflito entre feedback e ações (diz que não gostou mas deu 5⭐)
❌ Se usuário estiver em contexto atípico (ex: viagem de negócios quando perfil é lazer)
```

---

### 4. **Uso do Perfil Evoluído em Novas Viagens**

Quando planejar viagem 2, 3, 4...:

```javascript
// backend/services/aiAgent.js

export async function planTripWithLearning(userId, destination, budget, dates) {
  // 1. Buscar perfil mais recente
  const profile = await db.profiles.findLatest(userId);
  
  // 2. Buscar histórico de viagens e aprendizados
  const pastTrips = await db.trips.findByUser(userId, { include_feedback: true });
  const learnings = await db.learning_events.findByUser(userId);
  
  // 3. Construir contexto enriquecido para o agente
  const enrichedContext = {
    profile: profile.current_scores, // scores atualizados
    learned_preferences: profile.learned_preferences,
    learning_confidence: profile.learning_confidence,
    
    // Histórico relevante
    past_destinations: pastTrips.map(t => t.destination),
    loved_experiences: learnings.filter(l => l.learning.loves),
    patterns: learnings.filter(l => l.learning.patterns_detected),
    
    // Favoritos
    favorite_restaurants: profile.learned_preferences.favorites?.restaurants || [],
    favorite_activities: profile.learned_preferences.favorites?.activities || []
  };
  
  // 4. Chamar agente com contexto completo
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16384,
    system: AGENT_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `
PERFIL EVOLUÍDO (v${profile.version}):
${JSON.stringify(profile.current_scores)}

APRENDIZADOS DAS ÚLTIMAS ${pastTrips.length} VIAGENS:
${JSON.stringify(enrichedContext.learned_preferences)}

CONFIANÇA NO PERFIL: ${profile.learning_confidence} (${profile.learning_confidence >= 0.8 ? 'Alta' : 'Média'})

PREFERÊNCIAS DESCOBERTAS:
- Adora: ${enrichedContext.learned_preferences.loves.map(l => l.item).join(', ')}
- Não curte: ${enrichedContext.learned_preferences.dislikes.map(l => l.item).join(', ')}

FAVORITOS:
- Restaurantes amados: ${enrichedContext.favorite_restaurants.join(', ')}
- Atividades favoritas: ${enrichedContext.favorite_activities.join(', ')}

PADRÕES IDENTIFICADOS:
${JSON.stringify(enrichedContext.patterns)}

PLANEJAR NOVA VIAGEM:
Destino: ${destination}
Orçamento: R$ ${budget}
Datas: ${dates}

IMPORTANTE:
- Use o perfil EVOLUÍDO (não o inicial)
- Aplique os aprendizados (ex: se descobriu que adora Airbnb, priorize isso)
- Repita experiências que foram amadas
- Evite o que não funcionou
- Busque similares aos favoritos (ex: se adorou Trilha X, sugira outras trilhas épicas)
- Confiança ${profile.learning_confidence}: quanto maior, mais agressivo nos ajustes
      `
    }]
  });
  
  // 5. Plano gerado considera todo o histórico!
  const tripPlan = extractTripPlanJSON(response.content);
  
  return tripPlan;
}
```

---

## 📈 EVOLUÇÃO AO LONGO DO TEMPO

### Viagem 1 (Perfil Inicial)
```
Match Score: 85%
Acertos: 8/10
Erro: Hotel quando preferia Airbnb, ritmo muito intenso
```

### Viagem 2 (Perfil v1.1 - Aprendizado aplicado)
```
Match Score: 92%
Acertos: 9/10
Erro: Sugeriu 1 museu que usuário pulou
Descoberta: Adora fazer compras em mercados locais
```

### Viagem 3 (Perfil v1.2)
```
Match Score: 96%
Acertos: 9.5/10
Erro: Restaurante não tinha opção vegana (pequeno miss)
Descoberta: Prefere jantares longos (2h+) a jantares rápidos
```

### Viagem 4+ (Perfil v1.3+)
```
Match Score: 98-99%
Acertos: 10/10
Usuário aprova sem editar!
```

---

## 🎯 FEATURES DE APRENDIZADO NO APP

### 1. Tela "Meu Perfil Evoluído"
```
┌────────────────────────────────────────┐
│  Seu Perfil 🧠                         │
│                                        │
│  Versão: 1.3 (4 viagens completas)    │
│  Confiança: 80% ⭐⭐⭐⭐               │
│                                        │
│  📊 Como você evoluiu:                 │
│                                        │
│  Aventura    [████████░░] 0.8         │
│              ↗️ +0.1 desde início      │
│                                        │
│  Gastronomia [█████████░] 0.9         │
│              ↗️ +0.2 (adorou!)         │
│                                        │
│  Cultural    [█████░░░░░] 0.5         │
│              ↘️ -0.2 (menos interesse) │
│                                        │
│  💡 Descobrimos sobre você:            │
│  ✅ Adora Airbnb com cozinha           │
│  ✅ Fine dining vegetariano é must     │
│  ✅ Fenômenos naturais únicos          │
│  ❌ Museus tradicionais não te pegam   │
│                                        │
│  ⭐ Seus Favoritos:                    │
│  🍽️ Restaurante X (Chapada)           │
│  🥾 Trilha Vale do Pati               │
│  🏡 Airbnb Varanda (Bonito)           │
│                                        │
│  [Ver Histórico Completo]              │
└────────────────────────────────────────┘
```

### 2. Feedback Gamificado
```
┌────────────────────────────────────────┐
│  Ajude-nos a te conhecer melhor! 🎯    │
│                                        │
│  Completando feedback você:            │
│  ✅ Desbloqueia perfil mais preciso    │
│  ✅ Ganha desconto na próxima viagem   │
│  ✅ Acumula pontos CashTrip            │
│                                        │
│  Progresso: ████████░░ 80%            │
│  Falta: Avaliar restaurantes (2min)   │
│                                        │
│  [Completar Agora]                     │
└────────────────────────────────────────┘
```

### 3. Comparação Antes/Depois
```
┌────────────────────────────────────────┐
│  Como melhoramos? 📈                   │
│                                        │
│  Viagem 1 → Viagem 4                   │
│                                        │
│  Match Score:  85% → 98% 🎉           │
│  Aprovação:    Editou 3x → Aprovou!   │
│  Satisfação:   ⭐⭐⭐⭐ → ⭐⭐⭐⭐⭐    │
│                                        │
│  Seu agente está 98% assertivo!        │
│  Continue dando feedback para 99%+     │
└────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Passo 1: Adicionar Feedback no App
```javascript
// frontend/screens/TripFeedbackScreen.js

export function TripFeedbackScreen({ trip }) {
  const [feedback, setFeedback] = useState({
    overall_rating: 0,
    ratings: {},
    discoveries: {},
    text_feedback: ''
  });
  
  async function submitFeedback() {
    // Envia feedback para backend
    await fetch(`/api/trips/${trip.id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback)
    });
    
    // Backend processa e atualiza perfil automaticamente
    navigation.navigate('ProfileEvolved');
  }
  
  return (
    // UI do formulário de feedback
  );
}
```

### Passo 2: Endpoint de Feedback
```javascript
// backend/routes/tripRoutes.js

router.post('/api/trips/:id/feedback', async (req, res) => {
  const { id } = req.params;
  const feedback = req.body;
  
  // 1. Salva feedback na viagem
  await db.trips.update(id, {
    feedback,
    feedback_at: new Date(),
    status: 'completed'
  });
  
  // 2. Trigger sistema de aprendizado (async)
  const trip = await db.trips.findById(id);
  learningEngine.analyzeAndLearn(trip.user_i