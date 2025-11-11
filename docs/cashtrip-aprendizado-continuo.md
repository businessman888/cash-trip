# 🧠 Cash Trip - Aprendizado Contínuo Explicado

---

## 🎯 ENTENDENDO A CONFUSÃO: Janela de Contexto ≠ Aprendizado

### ❌ MITO (O que NÃO é verdade):
```
"Gemini tem 1M tokens, então ele APRENDE automaticamente!"
```

### ✅ REALIDADE (Como funciona de verdade):
```
Janela de contexto = Memória TEMPORÁRIA de UMA conversa
Aprendizado contínuo = Você SALVA dados no banco e ENVIA de novo

São coisas DIFERENTES!
```

**Analogia:**
```
Janela de contexto = Memória RAM do computador
  (Apaga quando desliga)

Aprendizado contínuo = HD/SSD do computador
  (Salva permanentemente)
```

---

## 📊 GEMINI 2.0 FLASH vs CLAUDE SONNET 4

### Comparação Atualizada (Dezembro 2024)

| Aspecto | Gemini 2.0 Flash | Claude Sonnet 4 |
|---------|------------------|-----------------|
| **Contexto** | 🏆 1M tokens | 200K tokens |
| **Velocidade** | 🏆 Muito rápido | Rápido |
| **Raciocínio** | Bom | 🏆 Excelente |
| **Seguir instruções** | Bom | 🏆 Excelente |
| **Custo** | 🏆 3x mais barato | Mais caro |
| **Free tier** | 🏆 1.500 req/dia | Não tem |
| **Multimodal** | 🏆 Imagens, vídeos | Só imagens |
| **Disponibilidade** | 🏆 Global | Alguns países |

### 🎯 Recomendação para Cash Trip:

**COMECE com Gemini 2.0 Flash:**
- Free tier generoso (1.500 requests/dia)
- 1M tokens = Chat longo sem problemas
- Mais barato (crucial pro MVP)
- Rápido o suficiente

**MIGRE para Claude se:**
- Precisar de raciocínio mais preciso
- Smart Luxury complexo não funcionar bem
- Tiver usuários pagantes (justifica custo)

---

## 🧠 APRENDIZADO CONTÍNUO (Como Funciona DE VERDADE)

### Conceito Fundamental:

```
APRENDIZADO NÃO VEM DO MODELO!
APRENDIZADO VEM DO SEU SISTEMA!

Você que salva, organiza e envia os dados de volta.
```

---

### Arquitetura do Sistema de Aprendizado

```
┌─────────────────────────────────────────────┐
│          VIAGEM 1 (Primeira vez)            │
├─────────────────────────────────────────────┤
│                                             │
│  Perfil Inicial (do quiz)                   │
│  ├─ adventure_level: 0.8                    │
│  ├─ luxury_preference: 0.5                  │
│  └─ ...                                     │
│                                             │
│  Agente planeja viagem                      │
│  Usuário viaja                              │
│                                             │
│  FEEDBACK pós-viagem:                       │
│  "Hotel foi perfeito! ⭐⭐⭐⭐⭐"          │
│  "Ritmo foi muito intenso 😓"               │
│                                             │
│  SEU SISTEMA ANALISA e ATUALIZA banco:      │
│  ├─ activity_intensity: 0.9 → 0.7 (-0.2)   │
│  ├─ learned: "Adora pousadas com natureza"  │
│  └─ version: 1.0 → 1.1                      │
│                                             │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│          VIAGEM 2 (Mais preciso)            │
├─────────────────────────────────────────────┤
│                                             │
│  Perfil Evoluído v1.1                       │
│  ├─ adventure_level: 0.8                    │
│  ├─ activity_intensity: 0.7 (AJUSTADO!)    │
│  ├─ learned: [preferências descobertas]     │
│  └─ histórico de 1 viagem                   │
│                                             │
│  CONTEXTO ENRIQUECIDO pro agente:           │
│  "Usuário já viajou 1x                      │
│   Na viagem anterior para Chapada:          │
│   - AMOU: Pousada com natureza              │
│   - NÃO GOSTOU: Ritmo muito intenso         │
│   Ajuste: Planejar 3-4 atividades/dia"     │
│                                             │
│  Agente planeja MELHOR (usa histórico)      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 💾 O QUE SALVAR NO BANCO (Estrutura Completa)

### Tabela: user_profiles

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  -- Versão do perfil (evolui com o tempo)
  version INTEGER DEFAULT 1,
  
  -- Scores iniciais (do quiz - NUNCA muda)
  initial_scores JSONB,
  
  -- Scores atuais (ajustados com aprendizado)
  current_scores JSONB,
  
  -- Histórico de mudanças
  score_history JSONB[], -- [{version, date, changes, reason}]
  
  -- Aprendizados ao longo do tempo
  learned_preferences JSONB,
  -- Estrutura:
  -- {
  --   "loves": ["Pousadas com natureza", "Trilhas longas"],
  --   "dislikes": ["Museus fechados", "Ritmo muito intenso"],
  --   "hidden_gems": ["Prefere jantar cedo", "Gosta de acordar cedo"]
  -- }
  
  -- Estatísticas
  total_trips INTEGER DEFAULT 0,
  learning_confidence FLOAT DEFAULT 0.5, -- Aumenta com mais viagens
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tabela: trips

```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID,
  profile_version INTEGER, -- Qual versão do perfil foi usada
  
  -- Dados da viagem
  destination JSONB,
  trip_plan JSONB, -- Roteiro completo gerado
  
  -- Status
  status VARCHAR, -- planned, confirmed, completed
  
  -- FEEDBACK (crucial para aprendizado!)
  feedback JSONB,
  feedback_submitted_at TIMESTAMP,
  
  created_at TIMESTAMP
);
```

### Tabela: learning_events

```sql
CREATE TABLE learning_events (
  id UUID PRIMARY KEY,
  user_id UUID,
  trip_id UUID,
  
  event_type VARCHAR, 
  -- 'feedback_received', 'score_adjusted', 'preference_discovered'
  
  -- O que foi aprendido
  learning JSONB,
  -- Exemplo:
  -- {
  --   "type": "score_adjustment",
  --   "score": "activity_intensity",
  --   "from": 0.9,
  --   "to": 0.7,
  --   "reason": "User felt pace was too intense",
  --   "confidence": 0.9
  -- }
  
  created_at TIMESTAMP
);
```

---

## 🔄 FLUXO COMPLETO DO APRENDIZADO

### Passo 1: Coletar Feedback Pós-Viagem

```javascript
// App Mobile - Tela de Feedback

export function FeedbackScreen({ tripId }) {
  const [feedback, setFeedback] = useState({
    overall_rating: 0,
    hotel_rating: 0,
    pace_feeling: '', // 'too_relaxed', 'perfect', 'too_intense'
    loved: [],
    disliked: [],
    text_feedback: ''
  });
  
  async function submitFeedback() {
    // Enviar pro backend
    await fetch('/api/trips/${tripId}/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback)
    });
    
    // Backend vai processar e atualizar perfil automaticamente
  }
  
  return (
    <View>
      <Text>Como foi sua viagem?</Text>
      
      <StarRating
        value={feedback.overall_rating}
        onChange={(rating) => setFeedback({...feedback, overall_rating: rating})}
      />
      
      <Text>O ritmo da viagem foi:</Text>
      <RadioGroup
        value={feedback.pace_feeling}
        onChange={(pace) => setFeedback({...feedback, pace_feeling: pace})}
      >
        <Radio value="too_relaxed">Muito relaxado (queria mais ação)</Radio>
        <Radio value="perfect">Perfeito</Radio>
        <Radio value="too_intense">Muito intenso (cansativo)</Radio>
      </RadioGroup>
      
      <Text>O que você AMOU?</Text>
      <TextInput
        multiline
        placeholder="Ex: A pousada era incrível, rodeada de natureza..."
        onChangeText={(text) => setFeedback({...feedback, loved: text})}
      />
      
      <Button title="Enviar Feedback" onPress={submitFeedback} />
    </View>
  );
}
```

---

### Passo 2: Backend Processa Feedback

```javascript
// backend/src/routes/feedback.js

router.post('/api/trips/:tripId/feedback', 
  authenticateUser,
  async (req, res) => {
    const { tripId } = req.params;
    const feedback = req.body;
    
    // 1. Salvar feedback
    await supabase
      .from('trips')
      .update({
        feedback: feedback,
        feedback_submitted_at: new Date(),
        status: 'completed'
      })
      .eq('id', tripId);
    
    // 2. Buscar viagem e perfil atual
    const trip = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();
    
    const profile = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();
    
    // 3. CHAMAR AGENTE PARA ANALISAR E APRENDER!
    const learnings = await analyzeAndLearn(profile, trip, feedback);
    
    // 4. Atualizar perfil com aprendizados
    await updateProfile(req.user.id, profile, learnings);
    
    res.json({ success: true, learnings });
  }
);
```

---

### Passo 3: Agente Analisa Feedback (Learning System)

```javascript
// backend/src/services/learningSystem.js

import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LEARNING_SYSTEM_PROMPT = `
Você é o Learning System da Cash Trip.

Analisa feedback de viagens e propõe ajustes no perfil do usuário.

# INPUT
- Perfil atual (scores, preferences)
- Viagem realizada (destino, roteiro)
- Feedback detalhado do usuário

# TAREFA
Identificar:
1. Score Adjustments: Quais scores devem mudar
2. Hidden Preferences: Preferências descobertas
3. Patterns: Padrões que emergem

# REGRAS
- Cada ajuste: máximo ±0.2 por viagem
- Confiança baseada em clareza do feedback
- Scores nunca ultrapassam 0.0-1.0

# OUTPUT
Retorne JSON estruturado:
{
  "score_adjustments": [
    {
      "score": "activity_intensity",
      "from": 0.9,
      "to": 0.7,
      "change": -0.2,
      "reason": "User felt pace was too intense",
      "confidence": 0.9
    }
  ],
  "learned_preferences": {
    "loves": ["Pousadas com natureza"],
    "dislikes": ["Ritmo muito intenso"]
  },
  "patterns": []
}
`;

export async function analyzeAndLearn(profile, trip, feedback) {
  
  const model = genai.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    systemInstruction: LEARNING_SYSTEM_PROMPT
  });
  
  // Criar contexto para o agente
  const context = `
PERFIL ATUAL (v${profile.version}):
${JSON.stringify(profile.current_scores, null, 2)}

VIAGEM REALIZADA:
Destino: ${trip.destination.name}
Duração: ${trip.duration} dias
Roteiro: ${trip.trip_plan.activities.length} atividades

FEEDBACK DO USUÁRIO:
Overall: ${feedback.overall_rating}/5 ⭐
Ritmo: ${feedback.pace_feeling}
Amou: ${feedback.loved}
Não gostou: ${feedback.disliked}
Comentário: ${feedback.text_feedback}

ANALISE e retorne JSON com ajustes propostos.
  `;
  
  const result = await model.generateContent(context);
  const learnings = JSON.parse(result.response.text());
  
  return learnings;
}
```

---

### Passo 4: Aplicar Aprendizados no Perfil

```javascript
// backend/src/services/learningSystem.js

export async function updateProfile(userId, currentProfile, learnings) {
  
  // 1. Aplicar ajustes de scores
  const newScores = { ...currentProfile.current_scores };
  
  for (const adjustment of learnings.score_adjustments) {
    newScores[adjustment.score] = adjustment.to;
  }
  
  // 2. Adicionar preferências aprendidas
  const learnedPrefs = {
    ...currentProfile.learned_preferences,
    loves: [
      ...(currentProfile.learned_preferences?.loves || []),
      ...learnings.learned_preferences.loves
    ],
    dislikes: [
      ...(currentProfile.learned_preferences?.dislikes || []),
      ...learnings.learned_preferences.dislikes
    ]
  };
  
  // 3. Atualizar histórico
  const newHistory = [
    ...(currentProfile.score_history || []),
    {
      version: currentProfile.version + 1,
      date: new Date(),
      changes: learnings.score_adjustments,
      trip_id: currentProfile.last_trip_id
    }
  ];
  
  // 4. Calcular nova confiança
  const newConfidence = Math.min(
    currentProfile.learning_confidence + 0.1,
    1.0
  );
  
  // 5. Salvar nova versão do perfil
  await supabase
    .from('user_profiles')
    .update({
      version: currentProfile.version + 1,
      current_scores: newScores,
      learned_preferences: learnedPrefs,
      score_history: newHistory,
      learning_confidence: newConfidence,
      total_trips: currentProfile.total_trips + 1,
      updated_at: new Date()
    })
    .eq('user_id', userId);
  
  // 6. Registrar evento de aprendizado
  await supabase
    .from('learning_events')
    .insert({
      user_id: userId,
      event_type: 'profile_updated',
      learning: learnings
    });
  
  console.log(`✅ Perfil atualizado para v${currentProfile.version + 1}`);
}
```

---

### Passo 5: Usar Perfil Evoluído em Próxima Viagem

```javascript
// backend/src/services/tripPlanner.js

export async function planTrip(userId, destination, budget, dates) {
  
  // 1. Buscar perfil MAIS RECENTE
  const profile = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('version', { ascending: false })
    .limit(1)
    .single();
  
  // 2. Buscar histórico de viagens
  const pastTrips = await supabase
    .from('trips')
    .select('destination, feedback, trip_plan')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(5); // Últimas 5 viagens
  
  // 3. Criar CONTEXTO ENRIQUECIDO
  const enrichedContext = `
PERFIL DO USUÁRIO (v${profile.version}):

Scores Atuais (evoluídos com ${profile.total_trips} viagens):
${JSON.stringify(profile.current_scores, null, 2)}

APRENDIZADOS DAS VIAGENS ANTERIORES:
${profile.learned_preferences.loves.map(l => `✅ Adora: ${l}`).join('\n')}
${profile.learned_preferences.dislikes.map(d => `❌ Não curte: ${d}`).join('\n')}

HISTÓRICO DE DESTINOS:
${pastTrips.map(t => `- ${t.destination.name}: ${t.feedback.overall_rating}/5⭐`).join('\n')}

CONFIANÇA NO PERFIL: ${(profile.learning_confidence * 100).toFixed(0)}%
(${profile.learning_confidence >= 0.8 ? 'Alta - ajustes mais agressivos' : 'Média - ajustes conservadores'})

NOVA VIAGEM A PLANEJAR:
Destino: ${destination}
Orçamento: R$ ${budget}
Datas: ${dates}

IMPORTANTE:
- Use o perfil EVOLUÍDO (scores atuais, não iniciais)
- Aplique os aprendizados (repita o que funcionou, evite o que não funcionou)
- Se confiança >= 0.8, seja mais assertivo nas escolhas
- Busque experiências similares às que o usuário amou
  `;
  
  // 4. Chamar agente com contexto enriquecido
  const model = genai.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    systemInstruction: TRIP_PLANNER_PROMPT
  });
  
  const result = await model.generateContent(enrichedContext);
  const tripPlan = extractTripPlan(result.response.text());
  
  return tripPlan;
}
```

---

## 📏 JANELA DE CONTEXTO: O QUE IMPORTA NA PRÁTICA

### Gemini 1M tokens vs Claude 200K tokens

**Cenário 1: Planejar Viagem (Sem Chat)**
```
Contexto necessário:
├─ Perfil do usuário: ~2.000 tokens
├─ Histórico de 5 viagens: ~5.000 tokens
├─ Aprendizados: ~1.000 tokens
├─ Prompt do sistema: ~3.000 tokens
└─ TOTAL: ~11.000 tokens

Veredicto:
✅ Gemini 1M: Sobra 989.000 tokens
✅ Claude 200K: Sobra 189.000 tokens
→ AMBOS funcionam perfeitamente!
```

**Cenário 2: Chat Durante Viagem**
```
Contexto necessário:
├─ Perfil: ~2.000 tokens
├─ Roteiro da viagem atual: ~3.000 tokens
├─ Histórico do chat: ???
│   ├─ 10 mensagens: ~2.000 tokens
│   ├─ 50 mensagens: ~10.000 tokens
│   ├─ 100 mensagens: ~20.000 tokens
│   └─ 500 mensagens: ~100.000 tokens ⚠️
└─ Prompt: ~2.000 tokens

Veredicto:
✅ Gemini 1M: Aguenta 500+ mensagens tranquilo
⚠️ Claude 200K: Aguenta ~150 mensagens
→ Gemini ganha AQUI!
```

---

## 💬 CHAT COM O AGENTE (Implementação)

### Frontend - Tela de Chat

```javascript
// App Mobile - ChatScreen.js

export function ChatScreen({ tripId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function sendMessage() {
    if (!inputText.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    setLoading(true);
    
    try {
      // Enviar pro backend
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trip_id: tripId,
          message: inputText,
          chat_history: messages // Últimas mensagens
        })
      });
      
      const { reply } = await response.json();
      
      // Adicionar resposta do agente
      const agentMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
    } catch (error) {
      alert('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.role === 'user' ? styles.userMessage : styles.agentMessage
            ]}
          >
            {msg.role === 'assistant' && (
              <Text style={styles.agentAvatar}>🤖</Text>
            )}
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? '...' : '➤'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

### Backend - Endpoint de Chat

```javascript
// backend/src/routes/chat.js

router.post('/api/chat/message',
  authenticateUser,
  async (req, res) => {
    const { trip_id, message, chat_history } = req.body;
    
    try {
      // 1. Buscar contexto da viagem
      const trip = await supabase
        .from('trips')
        .select('*, user_profiles(*)')
        .eq('id', trip_id)
        .single();
      
      // 2. Montar contexto pro agente
      const context = {
        profile: trip.user_profiles,
        trip_plan: trip.trip_plan,
        current_date: trip.dates.current_day,
        chat_history: chat_history.slice(-20) // Últimas 20 mensagens
      };
      
      // 3. Chamar agente
      const reply = await chatWithAgent(context, message);
      
      // 4. Salvar mensagem no banco (opcional)
      await supabase.from('chat_messages').insert({
        trip_id,
        user_message: message,
        agent_reply: reply,
        created_at: new Date()
      });
      
      res.json({ success: true, reply });
      
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Erro no chat' });
    }
  }
);
```

---

### Serviço de Chat

```javascript
// backend/src/services/chatAgent.js

const CHAT_AGENT_PROMPT = `
Você é o assistente da Cash Trip durante a viagem do usuário.

# CONTEXTO
Você tem acesso a:
- Perfil completo do usuário
- Roteiro da viagem atual
- Histórico do chat

# COMPORTAMENTO
- Seja prestativo e amigável
- Responda em português brasileiro
- Seja conciso (máximo 3 parágrafos)
- Se precisar de mais info, pergunte
- Sugira alternativas quando relevante

# EXEMPLOS
User: "O restaurante de hoje tá fechado"
You: "Que chato! Vou sugerir 3 alternativas próximas baseadas no seu gosto vegetariano..."

User: "Tô cansado, pode ajustar roteiro?"
You: "Claro! Vejo que você tem 4 atividades hoje. Que tal fazer só 2 e descansar à tarde?"
`;

export async function chatWithAgent(context, userMessage) {
  
  const model = genai.getGenerativeModel({
    model: 'gemini-2.0-flash-exp', // Usa 1M contexto!
    systemInstruction: CHAT_AGENT_PROMPT
  });
  
  // Montar histórico de mensagens
  const messages = context.chat_history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
  
  // Adicionar contexto da viagem
  const contextMessage = `
PERFIL DO USUÁRIO:
- Preferências: ${JSON.stringify(context.profile.current_scores)}
- Aprendizados: ${JSON.stringify(context.profile.learned_preferences)}

VIAGEM ATUAL:
- Destino: ${context.trip_plan.destination}
- Dia atual: ${context.current_date}
- Roteiro de hoje: ${JSON.stringify(context.trip_plan.today_activities)}

HISTÓRICO DO CHAT:
${messages.map(m => `${m.role}: ${m.parts[0].text}`).join('\n')}

NOVA MENSAGEM DO USUÁRIO:
${userMessage}

Responda de forma útil e personalizada.
  `;
  
  const result = await model.generateContent(contextMessage);
  const reply = result.response.text();
  
  return reply;
}
```

---

## 💰 CUSTOS DETALHADOS (Gemini vs Claude)

### Gemini 2.0 Flash

**Pricing:**
```
Input:  $0.00010 / 1K tokens ($0.10 / 1M)
Output: $0.00040 / 1K tokens ($0.40 / 1M)

Free Tier:
- 1.500 requests/dia
- 1M tokens/min
- 4M tokens/dia
= ~750 usuários/dia GRÁTIS!
```

**Custos por Funcionalidade:**

```
1. PROCESSAR QUIZ:
Input:  3.000 tokens × $0.0001 = $0.0003
Output: 5.000 tokens × $0.0004 = $0.0020
TOTAL: $0.0023 (R$ 0,012)

2. PLANEJAR VIAGEM:
Input:  15.000 tokens × $0.0001 = $0.0015
Output: 20.000 tokens × $0.0004 = $0.0080
TOTAL: $0.0095 (R$ 0,048)

3. CHAT (por mensagem):
Input:  2.000 tokens × $0.0001 = $0.0002
Output: 500 tokens × $0.0004 = $0.0002
TOTAL: $0.0004 (R$ 0,002)

CUSTO POR USUÁRIO COMPLETO:
Quiz + Viagem + 20 mensagens chat:
$0.0023 + $0.0095 + (20 × $0.0004) = $0.0198
= R$ 0,10 (10 centavos!)
```

---

### Claude Sonnet 4

**Pricing:**
```
Input:  $0.003 / 1K tokens ($3.00 / 1M)
Output: $0.015 / 1K tokens ($15.00 / 1M)

Free Tier:
- Não tem! ❌
```

**Custos por Funcionalidade:**

```
1. PROCESSAR QUIZ:
Input:  3.000 tokens × $0.003 = $0.009
Output: 5.000 tokens × $0.015 = $0.075
TOTAL: $0.084 (R$ 0,42)

2. PLANEJAR VIAGEM:
Input:  15.000 tokens × $0.003 = $0.045
Output: 20.000 tokens × $0.015 = $0.300
TOTAL: $0.345 (R$ 1,73)

3. CHAT (por mensagem):
Input:  2.000 tokens × $0.003 = $0.006
Output: 500 tokens × $0.015 = $0.0075
TOTAL: $0.0135 (R$ 0,07)

CUSTO POR USUÁRIO COMPLETO:
Quiz + Viagem + 20 mensagens chat:
$0.084 + $0.345 + (20 × $0.0135) = $0.699
= R$ 3,50 (35x mais caro!)
```

---

## 📊 COMPARAÇÃO FINAL (