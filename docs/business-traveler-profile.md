# 💼 Cash Trip - Perfil Viajante Corporativo

## 🎯 ESTRATÉGIA: Pré-definição vs Quiz Rápido

### Opção 1: Perfil Pré-definido "Business Traveler"
**Quando usar:** Onboarding express (1 clique)

### Opção 2: Quiz Corporativo Otimizado
**Quando usar:** Personalização fina (8 perguntas focadas)

---

## 📋 PERFIL PRÉ-DEFINIDO: "VIAJANTE CORPORATIVO"

### Scores Automáticos

```json
{
  "profile_type": "business_traveler",
  "version": "1.0",
  "auto_generated": true,
  "scores": {
    "adventure_level": 0.2,          // Baixo - foco em eficiência
    "luxury_preference": 0.7,        // Alto - conforto é prioridade
    "social_level": 0.4,             // Médio - networking ocasional
    "urban_vs_nature": 0.95,         // Muito urbano
    "activity_intensity": 0.3,       // Baixo - maximizar descanso
    "food_sophistication": 0.6,      // Médio-alto - jantares de negócio
    "fitness_priority": 0.7,         // Alto - manter rotina
    "nightlife_interest": 0.3,       // Baixo - drinks ocasionais
    "family_friendly": 0.0,          // Não aplicável
    "pet_friendly": 0.0,             // Não aplicável
    "time_efficiency": 0.95,         // CRÍTICO - tempo é dinheiro
    "wifi_priority": 1.0,            // ESSENCIAL
    "work_space_need": 0.9           // Muito importante
  },
  "hard_requirements": {
    "accommodation_type": ["hotel"],
    "hotel_category": ["business", "upscale", "luxury"],
    "location_preference": [
      "business_district", 
      "near_airport",
      "city_center",
      "near_convention_center"
    ],
    "essential_amenities": [
      "wifi_high_speed",
      "work_desk",
      "24h_reception",
      "business_center",
      "gym",
      "breakfast_included",
      "express_checkout",
      "laundry_service"
    ],
    "transport_preference": ["uber_black", "airport_transfer", "car_rental_executive"],
    "flight_class_min": "economy_plus",  // Mínimo
    "flight_class_preferred": "business",
    "flight_must_haves": [
      "flexible_ticket",
      "luggage_included",
      "fast_track_security",
      "lounge_access"
    ],
    "dietary_restrictions": [],
    "meal_preferences": [
      "quick_breakfast",
      "business_lunch_venues",
      "quality_dinner_options"
    ]
  },
  "budget_allocation_preference": {
    "flights": 0.35,           // 35% - conforto no voo
    "accommodation": 0.40,     // 40% - hotel de qualidade
    "food": 0.10,              // 10% - refeições práticas
    "transport": 0.10,         // 10% - locomoção eficiente
    "activities": 0.00,        // 0% - sem turismo
    "work_essentials": 0.05    // 5% - coworking, impressões, etc
  },
  "time_preferences": {
    "flight_times": ["morning", "afternoon"],  // Evita red-eye
    "check_in_flexibility": "early",           // Check-in cedo se possível
    "check_out_flexibility": "late",           // Check-out tarde
    "meeting_proximity": "walking_distance"    // Tudo perto
  }
}
```

---

## 🎯 QUIZ RÁPIDO CORPORATIVO (8 perguntas)

### Tela Inicial
```
👔 Viajante Corporativo Detectado!

Vamos otimizar suas viagens de negócio em 2 minutos.

[Usar Perfil Padrão] → Pula quiz, aplica preset
[Personalizar] → 8 perguntas rápidas
```

---

### PERGUNTAS (se escolher personalizar)

#### **P1: Frequência de viagens corporativas**
Por que perguntamos: Define se precisa de programa de fidelidade

- 📅 **1-2 vezes/ano** (Ocasional)
- 📅 **3-6 vezes/ano** (Regular)
- 📅 **7+ vezes/ano** (Frequente)
- ✈️ **Mensal ou mais** (Road warrior)

**Impact no perfil:**
- Frequente → ativa sugestões de programas de milhagem
- Road warrior → prioriza hotéis com pontos, lounges

---

#### **P2: Duração típica das viagens**
Por que perguntamos: Afeta tipo de hospedagem e serviços

- ⚡ **1-2 dias** (Relâmpago)
- 📊 **3-5 dias** (Semana de trabalho)
- 📅 **1 semana** (Projeto longo)
- 🏢 **2+ semanas** (Temporada/expatriado)

**Impact:**
- 1-2 dias → hotel perto aeroporto, check-in express
- 2+ semanas → apart-hotel, lavanderia, cozinha

---

#### **P3: Orçamento por diária (hospedagem)**
Por que perguntamos: Define categoria de hotel

- 💰 **R$ 200-400** (Econômico/Smart)
- 💼 **R$ 400-700** (Business standard)
- ⭐ **R$ 700-1200** (Upscale)
- 💎 **R$ 1200+** (Luxury/5 estrelas)

---

#### **P4: Prioridade em voos**
Por que perguntamos: Define classe e tipo de passagem

Escolha até 2:
- ⏰ **Horário conveniente** (evitar madrugada)
- 🎫 **Flexibilidade de mudança** (ticket alterável)
- 💺 **Conforto** (executiva/espaço)
- ⚡ **Tempo** (voo mais rápido, menos conexões)
- 💰 **Preço** (dentro do budget corporativo)

**Impact:**
- Flexibilidade → busca tarifas flex/reembolsáveis
- Conforto → prioriza classe executiva

---

#### **P5: Trabalho durante a viagem**
Por que perguntamos: Define amenidades essenciais

- 💻 **Sim, intensamente** (preciso infraestrutura completa)
- 📱 **Sim, moderadamente** (alguns calls/emails)
- 🔌 **Mínimo** (só emergências)

**Impact:**
- Intensamente → exige business center, impressora, meeting rooms
- Moderadamente → basta wifi + tomadas

---

#### **P6: Locomoção no destino**
Por que perguntamos: Orça transporte

- 🚗 **Carro alugado** (liberdade/reuniões múltiplas)
- 🚕 **Uber/Taxi** (praticidade)
- 🚙 **Transfer privado** (empresa paga)
- 🚇 **Transporte público** (destino com metrô eficiente)

---

#### **P7: Jantar de negócios**
Por que perguntamos: Orça restaurantes

- 🍽️ **Sim, frequentemente** (preciso sugestões de restaurantes business)
- 🥗 **Ocasional** (1-2 jantares especiais)
- 🏨 **Não** (refeições no hotel/rápidas)

**Impact:**
- Frequentemente → sugere 3-5 restaurantes upscale
- Não → otimiza budget para hotel melhor

---

#### **P8: Pós-trabalho**
Por que perguntamos: Define se planeja atividades de lazer

- 💼 **Só trabalho** (maximizar eficiência)
- 🏃 **Academia/corrida** (manter rotina fitness)
- 🍷 **Drinks/networking** (socializar com clientes)
- 🎭 **Aproveitar destino** (1-2 atrações se der tempo)

**Impact:**
- Academia → hotel DEVE ter gym bom
- Aproveitar → sugere 2-3 atrações express

---

## 🎯 PERFIS RESULTANTES (combinações comuns)

### 1. "Road Warrior Executivo"
```json
{
  "frequency": "monthly",
  "duration": "1-2_days",
  "budget_per_night": "700-1200",
  "priorities": ["flexibility", "comfort"],
  "work_intensity": "intensive",
  "transport": "uber",
  "dinner": "frequent",
  "post_work": "gym"
}
```
**O que o agente faz:**
- Prioriza hotéis 4-5★ em business districts
- Voos executivos/economy plus flexíveis
- Sugere 5 restaurantes business
- Confirma se hotel tem academia top

---

### 2. "Consultor Viajante"
```json
{
  "frequency": "7+_year",
  "duration": "3-5_days",
  "budget_per_night": "400-700",
  "priorities": ["time", "flexibility"],
  "work_intensity": "moderate",
  "transport": "car_rental",
  "dinner": "occasional",
  "post_work": "work_only"
}
```
**O que o agente faz:**
- Hotéis 3-4★ business com workspace
- Voos diretos sempre que possível
- Carro econômico incluso
- Restaurantes delivery nearby

---

### 3. "Executivo VIP"
```json
{
  "frequency": "regular",
  "duration": "week",
  "budget_per_night": "1200+",
  "priorities": ["comfort", "time"],
  "work_intensity": "intensive",
  "transport": "private_transfer",
  "dinner": "frequent",
  "post_work": "drinks_networking"
}
```
**O que o agente faz:**
- Hotéis 5★ luxo com business lounge
- Classe executiva/primeira sempre
- Transfer privado aeroporto
- 7 restaurantes fine dining
- Sugere bares/lounges para networking

---

## 💡 DIFERENCIAL: Smart Business

### Otimizações automáticas que o agente faz:

#### 1. **Proximity Optimization**
Calcula distância hotel ↔ local da reunião
- Se > 30min: sugere hotel mais próximo (mesmo que +caro)
- Justifica: "Economiza 2h/dia em deslocamento"

#### 2. **Time Zone Intelligence**
Se destino tem fuso diferente:
- Sugere voo que chega de manhã (adaptar jet lag)
- Hotel com blackout curtains
- Café da manhã reforçado

#### 3. **Expense Report Ready**
Todos os vouchers/recibos em formato CSV
- Compatível com Concur, SAP, Expensify
- Categorizado automaticamente

#### 4. **Corporate Policy Check**
Se usuário cadastra política da empresa:
- Valida se hotel/voo está dentro das regras
- Alerta se ultrapassar diária permitida
- Sugere downgrades compatíveis

---

## 🚀 FLUXO NO APP

### Onboarding

```
Tela 1: Tipo de viajante
[🏖️ Lazer] [💼 Negócios] [🎒 Mochileiro] [👨‍👩‍👧 Família]

↓ Usuário clica [💼 Negócios]

Tela 2: Quick Setup
┌─────────────────────────────────────┐
│ 👔 Perfil Viajante Corporativo      │
│                                     │
│ Otimizado para:                     │
│ ✅ Hotéis business                  │
│ ✅ Voos flexíveis                   │
│ ✅ Wi-Fi prioritário                │
│ ✅ Proximidade de centros de negócio│
│                                     │
│ [🚀 Usar Perfil Padrão]            │
│                                     │
│ [⚙️ Personalizar (8 perguntas)]    │
└─────────────────────────────────────┘
```

---

## 📊 EXEMPLO: Agente em ação

### Input do usuário:
```
Destino: São Paulo
Datas: 15-17 Março (3 dias)
Reunião: Av. Faria Lima, 3477
Orçamento: R$ 5.000
Perfil: Road Warrior Executivo
```

### Output do agente:

```json
{
  "confidence": 0.96,
  "trip_summary": {
    "optimized_for": "business_efficiency",
    "total_cost": 4850,
    "time_saved": "4h em deslocamentos"
  },
  "selections": {
    "flight": {
      "option": "LATAM LA3010 - GRU 07:00",
      "class": "Economy Plus",
      "price": 1200,
      "reasoning": "Voo matinal chega 8h para reunião 11h. Assento com espaço extra. Milhas creditadas."
    },
    "hotel": {
      "option": "Hotel Unique - Jardins",
      "price": 2400,
      "distance_to_meeting": "1.2km (8min Uber)",
      "reasoning": "5★, business center 24h, gym excelente, a 8min da reunião. Rooftop bar para networking."
    },
    "transport": {
      "option": "Uber Black credits",
      "price": 400,
      "reasoning": "4 viagens estimadas (aeroporto + reuniões)"
    },
    "restaurants": [
      {
        "name": "Fasano",
        "type": "business_dinner",
        "distance": "600m do hotel",
        "price_avg": 250,
        "reasoning": "Ideal para jantar de negócios. Ambiente formal."
      }
    ]
  }
}
```

---

## ✅ CHECKLIST: O que o perfil corporativo garante

### Automático (sem perguntar):
- ✅ Wi-Fi alta velocidade obrigatório
- ✅ Mesa de trabalho no quarto
- ✅ Check-in/out flexível
- ✅ Recepção 24h
- ✅ Perto de centro de negócios/aeroporto
- ✅ Breakfast incluído (ganhar tempo)
- ✅ Lavanderia/pressing (trips longos)

### Otimizado (calcula automaticamente):
- ✅ Voos em horários comerciais (não red-eye)
- ✅ Hotéis com programa de fidelidade
- ✅ Uber/táxi vs aluguel (custo-benefício)
- ✅ Restaurantes com reserva fácil
- ✅ Backup plans (voo alternativo se cancelar)

---

## 🎯 PRÓXIMOS PASSOS

**Me confirme:**
1. Quer o **perfil padrão pré-definido** (1 clique)?
2. Quer o **quiz de 8 perguntas** também?
3. Ou quer **ambos** (usuário escolhe)?

**Depois eu crio:**
- ✅ Prompt completo do agente
- ✅ Lógica de decisão
- ✅ Exemplos de uso

**Pode me dizer qual caminho prefere!** 🚀