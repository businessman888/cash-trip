# 🎯 Cash Trip - Fluxo Completo Explicado (Linguagem Simples)

---

## 🎬 A JORNADA DO USUÁRIO (Passo a Passo Visual)

```
👤 USUÁRIO ABRE O APP
       ↓
📝 FAZ O QUIZ (25 perguntas)
       ↓
⏳ BARRINHA DE LOADING (Agente analisando...)
       ↓
✅ PERFIL CRIADO!
       ↓
🗺️ USUÁRIO ESCOLHE:
   [Digite destino + orçamento]
        OU
   [Ver sugestões do agente]
       ↓
🤖 AGENTE PLANEJA VIAGEM COMPLETA
   (Voos, hotel, restaurantes, passeios)
       ↓
📱 USUÁRIO REVISA NO APP
       ↓
💳 APROVA E PAGA
       ↓
📅 ROTEIRO VAI PARA O DASHBOARD
       ↓
✈️ VIAGEM ACONTECE!
       ↓
💬 CHAT 24/7 durante viagem (se precisar)
```

---

## 🏗️ O QUE PRECISA SER CONSTRUÍDO (6 Partes Principais)

Vou explicar como se fosse construir uma casa:

---

### **PARTE 1: O QUIZ (A Porta de Entrada)** 🚪

**O que é:**
- Como um questionário do BuzzFeed, mas sobre viagens
- 25 perguntas para entender quem é o usuário

**O que precisa construir:**
1. **Telas do quiz no app** (React Native/Flutter)
   - 25 telas, cada uma com uma pergunta
   - Botões bonitos para escolher respostas
   - Barra de progresso (1/25, 2/25... 25/25)

2. **Armazenar as respostas** 
   - Conforme usuário responde, salvar num "caderninho" temporário
   - Exemplo: {"P1": "Homem", "P2": "São Paulo", "P3": 28...}

3. **Botão "Finalizar Quiz"**
   - Quando clicar, envia todas respostas para o "cérebro" (backend)

**Analogia:**
É como fazer uma ficha médica antes de consultar um médico. O médico (agente) precisa dessas informações para te entender.

---

### **PARTE 2: O CÉREBRO DO AGENTE (Profile Builder)** 🧠

**O que é:**
- O "Sherlock Holmes" que lê suas respostas e descobre quem você é

**O que precisa construir:**

#### 2.1. Backend (Servidor) 
**Pense como:** A cozinha de um restaurante (ninguém vê, mas é onde a mágica acontece)

```
Ingredientes (tecnologias):
- Node.js (o fogão)
- Express (as panelas)
- Anthropic Claude (o chef especialista em IA)
- PostgreSQL (a geladeira que guarda tudo)
```

#### 2.2. Endpoint (Portinha de Comunicação)
```
Endereço: /api/user/profile
O que faz: Recebe quiz → manda pro agente → retorna perfil
```

**Funcionamento (em português):**
```
1. App envia: "Aqui estão as 25 respostas do João"
2. Backend fala: "Claude, analisa essas respostas pra mim"
3. Claude pensa: "Hmm... João é aventureiro, gosta de natureza, 
   treina todo dia, vegetariano..."
4. Claude retorna: Um "RG digital" do João (perfil JSON)
5. Backend salva na "geladeira" (banco de dados)
6. Backend avisa o app: "Pronto! Perfil criado!"
```

#### 2.3. Barrinha de Loading
No app, enquanto isso acontece (demora ~3-5 segundos):

```
TELA DO APP:
┌────────────────────────────────┐
│  Analisando suas respostas... │
│                                │
│  ████████░░░░░░░░ 60%         │
│                                │
│  🧠 Entendendo seu estilo      │
│  🎯 Descobrindo preferências   │
│  ✨ Criando perfil perfeito    │
└────────────────────────────────┘
```

**Como fazer:**
- Usar WebSocket ou Server-Sent Events (SSE)
- Backend manda atualizações: "30%... 60%... 100%!"
- App atualiza barrinha em tempo real

---

### **PARTE 3: ESCOLHER DESTINO (Duas Rotas)** 🗺️

Depois que o perfil está pronto, app mostra:

```
TELA DO APP:
┌────────────────────────────────────┐
│  Para onde vamos? ✈️              │
│                                    │
│  🎯 OPÇÃO 1: Eu já sei            │
│  ┌──────────────────────────┐    │
│  │ Destino: [_____________] │    │
│  │ Orçamento: R$ [_______]  │    │
│  │ Datas: [__/__] a [__/__] │    │
│  │                          │    │
│  │ [Planejar Viagem]        │    │
│  └──────────────────────────┘    │
│                                    │
│  💡 OPÇÃO 2: Me sugira!           │
│  ┌──────────────────────────┐    │
│  │ Não sabe pra onde ir?    │    │
│  │                          │    │
│  │ [Ver Sugestões do Agente]│    │
│  └──────────────────────────┘    │
└────────────────────────────────────┘
```

#### 3.1. Se escolher OPÇÃO 1 (Eu já sei)
- Usuário digita: "Chapada Diamantina, R$ 8.000, 7 dias"
- App guarda e pula direto para **PARTE 4**

#### 3.2. Se escolher OPÇÃO 2 (Me sugira)
**O que precisa construir:**

**Endpoint novo:**
```
Endereço: /api/trip/suggest
O que recebe: Perfil do usuário + constraints (orçamento aprox, etc)
O que retorna: 3-5 destinos perfeitos
```

**Funcionamento:**
```
1. App pede: "Claude, sugere destinos pro João"
2. Claude analisa: "João é aventureiro (0.8), gosta de natureza (0.9),
   vegetariano, treina todo dia..."
3. Claude pensa: "Perfeito! Chapada Diamantina, Jalapão, Patagônia..."
4. Claude retorna: Lista de 3-5 destinos com explicação
5. App mostra numa tela bonita
```

**Tela de Sugestões:**
```
┌────────────────────────────────────┐
│  Destinos Perfeitos Pra Você 🎯  │
│                                    │
│  🏆 1. Chapada Diamantina          │
│     Match: 95% ⭐⭐⭐⭐⭐         │
│     R$ 4.500 (7 dias)              │
│     "Trilhas épicas, natureza..."  │
│     [Escolher Este]                │
│                                    │
│  🥈 2. Jalapão                     │
│     Match: 88% ⭐⭐⭐⭐            │
│     R$ 5.500 (7 dias)              │
│     [Escolher Este]                │
│                                    │
│  🥉 3. Bonito - MS                 │
│     Match: 85% ⭐⭐⭐⭐            │
│     [Escolher Este]                │
└────────────────────────────────────┘
```

Usuário clica em um → vai para **PARTE 4**

---

### **PARTE 4: PLANEJAMENTO COMPLETO (A Mágica!)** ✨

**O que é:**
Agora o agente vai planejar TUDO da viagem: voo, hotel, restaurantes, passeios.

**O que precisa construir:**

#### 4.1. Endpoint Principal
```
Endereço: /api/trip/plan
O que recebe: Perfil + Destino + Orçamento + Datas
O que retorna: Viagem completa planejada
```

#### 4.2. Integrações com APIs Externas (As "Ferramentas" do Agente)

**Pense assim:** 
O agente é um arquiteto. Ele precisa de ferramentas:
- 🔨 Skyscanner API = Martelo (buscar voos)
- 🔧 Booking.com API = Chave de fenda (buscar hotéis)
- 📐 Google Places API = Régua (buscar restaurantes)

**Como funciona (passo a passo):**

```
ETAPA 1: BUSCAR VOOS
├─ App pede: "Claude, planeja viagem pro João"
├─ Claude pensa: "Primeiro preciso de voos de São Paulo pra Chapada"
├─ Claude usa ferramenta: search_flights()
├─ Backend chama: Skyscanner API
├─ Skyscanner retorna: 10 opções de voos
├─ Claude analisa: "Voo LATAM é perfeito! Direto, horário bom, R$850"
└─ Claude escolhe: Voo LATAM LA3456

ETAPA 2: BUSCAR HOTÉIS
├─ Claude pensa: "Agora preciso de hospedagem"
├─ Claude usa ferramenta: search_hotels()
├─ Backend chama: Booking.com API
├─ Booking retorna: 15 hotéis/pousadas
├─ Claude analisa: "João treina todo dia (fitness: 1.0), precisa de academia!
│                   João gosta de natureza (urban: 0.3), melhor pousada fora do centro.
│                   Pousada Canto das Águas é perfeita! Tem academia, natureza, R$180/dia"
└─ Claude escolhe: Pousada Canto das Águas

ETAPA 3: BUSCAR RESTAURANTES
├─ Claude pensa: "João é vegetariano, food_sophistication: 0.8"
├─ Claude usa: search_restaurants()
├─ Google Places retorna: 20 restaurantes
├─ Claude analisa e escolhe: 7 restaurantes vegetarianos
└─ Claude destaca: 1 restaurante premium (Smart Luxury!)

ETAPA 4: MONTAR ROTEIRO
├─ Claude pensa: "João quer ritmo intenso (activity_intensity: 0.9)"
├─ Claude monta: 5-6 atividades por dia
├─ Claude considera: Distâncias, horários, clima
└─ Claude cria: Roteiro dia-a-dia completo

ETAPA 5: OTIMIZAR ORÇAMENTO
├─ Claude calcula: Voo + Hotel + Comida + Passeios + Transporte
├─ Claude aplica Smart Luxury: "Economizar no hotel pra investir em 1 jantar especial"
├─ Total: R$ 7.200 (dentro do orçamento de R$ 8.000)
└─ Sobra: R$ 800 de buffer

TEMPO TOTAL: 5-8 segundos
```

#### 4.3. Barrinha de Loading (Enquanto planeja)

```
TELA DO APP (tempo real):
┌────────────────────────────────┐
│  Planejando sua viagem... 🤖  │
│                                │
│  ✅ Buscando voos              │
│  ⏳ Buscando hospedagens...    │
│  ⏹️ Selecionando restaurantes   │
│  ⏹️ Criando roteiro             │
│                                │
│  Isso leva ~8 segundos         │
└────────────────────────────────┘
```

**Como fazer:**
- Backend vai avisando: "Terminei voos!" → App ✅
- "Terminei hotéis!" → App ✅
- Usuário vê progresso em tempo real

---

### **PARTE 5: REVISÃO E APROVAÇÃO** 👀

Quando agente termina, app mostra tudo numa tela linda:

```
TELA: REVISÃO DA VIAGEM
┌────────────────────────────────────┐
│  Sua Viagem Perfeita ✨           │
│  Match: 95% ⭐⭐⭐⭐⭐            │
│                                    │
│  📍 Chapada Diamantina             │
│  📅 10 a 17 de Junho (7 dias)     │
│  💰 R$ 7.200 de R$ 8.000          │
│      (sobra R$ 800 de buffer)     │
│                                    │
│  ─────────────────────────────    │
│                                    │
│  ✈️ VOOS                          │
│  Ida: LATAM LA3456                │
│  10/jun 07:30 → 09:45 (direto)   │
│  R$ 850                            │
│  [Ver Detalhes] [Editar]          │
│                                    │
│  🏨 HOSPEDAGEM                    │
│  Pousada Canto das Águas          │
│  7 noites × R$180 = R$1.260       │
│  ⭐ 4.8 | Academia, Piscina       │
│  [Ver Fotos] [Editar]             │
│                                    │
│  🍽️ RESTAURANTES (7)             │
│  Café da Manhã: Incluso na pousada│
│  Almoço: Restaurante Vegetariano A│
│  Jantar: Restaurante B            │
│  ⭐ Especial: Fine Dining R$300   │
│  [Ver Todos]                       │
│                                    │
│  🎯 ROTEIRO (7 dias)              │
│  Dia 1: Morro do Pai Inácio       │
│  Dia 2: Vale do Pati (início)     │
│  Dia 3: Vale do Pati (meio)       │
│  [Ver Roteiro Completo]           │
│                                    │
│  ─────────────────────────────    │
│                                    │
│  Por que escolhemos isso pra você:│
│  "Priorizamos trilhas épicas      │
│   (adventure: 0.8), pousada com   │
│   academia (fitness: 1.0), e      │
│   restaurantes vegetarianos..."   │
│                                    │
│  [✏️ Editar Algo]                 │
│  [✅ Aprovar e Ir pro Pagamento]  │
└────────────────────────────────────┘
```

**Funcionalidades:**
1. **Ver detalhes:** Cada item expande mostrando mais info
2. **Editar:** Usuário pode trocar hotel, voo, etc (o agente replaneja)
3. **Aprovar:** Vai para pagamento

---

### **PARTE 6: PAGAMENTO E RESERVA** 💳

#### 6.1. Tela de Pagamento

```
┌────────────────────────────────────┐
│  Pagamento Seguro 🔒              │
│                                    │
│  Total: R$ 7.200                   │
│                                    │
│  Forma de pagamento:               │
│  ◉ Cartão de Crédito              │
│  ○ PIX                             │
│                                    │
│  [____-____-____-____] (nº cartão)│
│  [___] CVV  [__/__] Validade      │
│                                    │
│  Parcelas:                         │
│  ○ À vista                         │
│  ◉ 3x de R$ 2.400 sem juros       │
│  ○ 6x de R$ 1.200 sem juros       │
│                                    │
│  [Confirmar e Pagar]               │
└────────────────────────────────────┘
```

#### 6.2. O que acontece ao pagar (Nos Bastidores)

**FASE 2 (MVP): Redirect para sites externos**
```
1. Usuário clica "Confirmar"
2. App cobra assinatura Cash Trip (R$ 27,90)
3. App abre links de afiliado:
   → Skyscanner para comprar voo
   → Booking para reservar hotel
4. Usuário compra fora do app
5. Usuário volta e coloca confirmações no app
```

**FASE 3 (Futuro): Tudo dentro do app**
```
1. Usuário clica "Confirmar"
2. App processa pagamento (Stripe)
3. Backend chama APIs de RESERVA:
   → Amadeus Flight Booking (voo)
   → Booking Reservations (hotel)
4. APIs confirmam reservas
5. Backend gera vouchers (PDF)
6. App mostra: "Viagem confirmada! ✅"
7. Vouchers vão pro e-mail + app
```

**O que precisa construir (Fase 2 - MVP):**
- Integração Stripe (pagamento assinatura)
- Gerar links de afiliado
- Salvar viagem no banco como "confirmada"

**O que precisa construir (Fase 3 - Futuro):**
- Parcerias com Booking/Airlines
- APIs de execução de reserva
- Sistema de vouchers
- Sistema de reembolso/cancelamento

---

### **PARTE 7: DASHBOARD DA VIAGEM** 📅

Após confirmar, o roteiro vai para uma área especial no app:

```
DASHBOARD - MINHA VIAGEM
┌────────────────────────────────────┐
│  Chapada Diamantina 🏔️            │
│  Faltam 45 dias!                   │
│                                    │
│  ▼ DOCUMENTOS                      │
│    📄 Voucher Voo (PDF)            │
│    📄 Voucher Hotel (PDF)          │
│    📄 Roteiro Completo (PDF)       │
│                                    │
│  ▼ CHECKLIST PRÉ-VIAGEM            │
│    ✅ Passagens compradas          │
│    ✅ Hotel reservado              │
│    ⏹️ Fazer mala                   │
│    ⏹️ Conferir documentos          │
│                                    │
│  ▼ ROTEIRO DIA-A-DIA               │
│                                    │
│  📅 DIA 1 - 10/junho (Segunda)    │
│  ┌──────────────────────────┐    │
│  │ 07:30 ✈️ Voo GRU → SSA   │    │
│  │ 11:00 🚗 Pegar carro      │    │
│  │ 14:00 🏨 Check-in pousada │    │
│  │ 16:00 🥾 Morro Pai Inácio │    │
│  │ 20:00 🍽️ Jantar Restaurante│   │
│  └──────────────────────────┘    │
│  [Ver Detalhes do Dia]            │
│                                    │
│  📅 DIA 2 - 11/junho              │
│  ┌──────────────────────────┐    │
│  │ 08:00 🍳 Café da manhã    │    │
│  │ 09:00 🥾 Vale do Pati     │    │
│  │ ... (trilha dia inteiro)  │    │
│  └──────────────────────────┘    │
│                                    │
│  [Ver Próximos 5 Dias]            │
│                                    │
│  ▼ GASTOS                          │
│    Planejado: R$ 7.200             │
│    Gasto até agora: R$ 2.050       │
│    Restante: R$ 5.150              │
│    [Ver Breakdown]                 │
│                                    │
│  ▼ CLIMA                           │
│    🌤️ Ensolarado 28°C             │
│    Previsão próximos 7 dias        │
│                                    │
│  💬 [Falar com Agente]             │
└────────────────────────────────────┘
```

**O que precisa construir:**
1. **Tela de Dashboard** (frontend)
2. **Sistema de notificações**
   - "Faltam 7 dias pra viagem!"
   - "Lembre de fazer check-in do voo"
   - "Hoje: Trilha do Vale do Pati às 9h"
3. **Sincronização**
   - Se usuário comprar voo em outro horário, atualizar roteiro
   - Se hotel cancelar, avisar imediatamente

---

### **PARTE 8: CHAT COM O AGENTE (Assistente 24/7)** 💬

Durante a viagem, usuário pode ter dúvidas:

```
CHAT COM AGENTE
┌────────────────────────────────────┐
│  Cash Trip Assistant 🤖            │
│                                    │
│  👤 Usuário:                       │
│  "O restaurante de hoje tá fechado!│
│   Pode sugerir outro?"             │
│                                    │
│  🤖 Agente:                        │
│  "Claro! Baseado no seu perfil     │
│   vegetariano, aqui estão 3        │
│   opções próximas:                 │
│                                    │
│   1. Sabor da Terra (400m)         │
│      ⭐ 4.7 | Vegetariano          │
│      [Ver no Mapa]                 │
│                                    │
│   2. Veggie House (800m)           │
│      ⭐ 4.5 | Vegano               │
│      [Ver no Mapa]                 │
│                                    │
│   Prefere algum?"                  │
│                                    │
│  👤 Usuário:                       │
│  "O primeiro! Obrigado"            │
│                                    │
│  🤖 Agente:                        │
│  "Perfeito! Atualizei seu roteiro  │
│   de hoje. Bom apetite! 🍽️"       │
│                                    │
│  [Digite sua mensagem...]          │
└────────────────────────────────────┘
```

**Como funciona:**
1. **Usuário manda mensagem**
2. **App envia pro backend**
3. **Backend chama Claude** (com contexto da viagem atual)
4. **Claude responde** (considerando perfil + situação)
5. **App mostra resposta**

**O que precisa construir:**
1. **Chat UI no app** (como WhatsApp)
2. **Endpoint de chat:**
   ```
   POST /api/chat/message
   Recebe: mensagem do usuário + contexto da viagem
   Retorna: resposta do agente
   ```
3. **Histórico de conversas** (salvar no banco)
4. **Notificações push** (quando agente responder)

**Exemplos de uso:**
- "Mudou o clima, pode reajustar roteiro de hoje?"
- "Tô cansado, pode sugerir algo mais leve?"
- "Onde fica o melhor pôr do sol aqui?"
- "Quero adicionar um passeio extra, quanto fica?"

---

## 📋 RESUMO GERAL (O que construir em ordem)

### **MÊS 1: Base do App**
```
Semana 1-2: Quiz
├─ 25 telas de perguntas
├─ Validações
├─ Salvar respostas
└─ Botão "Finalizar"

Semana 3-4: Telas Principais  
├─ Tela "Escolher Destino"
├─ Tela "Revisão da Viagem"
├─ Tela "Dashboard"
└─ Navegação entre telas
```

### **MÊS 2: Backend + Agente**
```
Semana 5-6: Setup Backend
├─ Node.js + Express
├─ PostgreSQL
├─ Anthropic SDK
└─ Endpoints base

Semana 7-8: Integrar Agente
├─ Profile Builder (Fase 1)
├─ Destination Suggester (Fase 2A)
├─ Trip Planner (Fase 2B)
└─ Testar tudo
```

### **MÊS 3: Integrações + Refinamento**
```
Semana 9-10: APIs Externas
├─ Skyscanner (voos)
├─ Booking.com (hotéis)
├─ Google Places (restaurantes)
└─ Function calling

Semana 11-12: Features Finais
├─ Sistema de pagamento (Stripe)
├─ Dashboard da viagem
├─ Chat com agente
├─ Notificações push
└─ Testes com usuários reais
```

---

## 🎯 LISTA DE VERIFICAÇÃO FINAL

### Frontend (App Mobile)
- [ ] Quiz (25 perguntas)
- [ ] Tela escolher destino
- [ ] Tela sugestões
- [ ] Tela revisão viagem
- [ ] Tela pagamento
- [ ] Dashboard da viagem
- [ ] Chat com agente
- [ ] Barrinhas de loading (com updates em tempo real)
- [ ] Notificações push

### Backend (Servidor)
- [ ] Setup Node.js + Express
- [ ] Banco de dados PostgreSQL
- [ ] Integração Anthropic Claude
- [ ] Endpoint: POST /api/user/profile
- [ ] Endpoint: POST /api/trip/suggest
- [ ] Endpoint: POST /api/trip/plan
- [ ] Endpoint: POST /api/chat/message
- [ ] Endpoint: POST /api/booking/execute
- [ ] Integração Skyscanner API
- [ ] Integração Booking.com API
- [ ] Integração Google Places API
- [ ] Integração Stripe (pagamentos)
- [ ] Sistema de notificações
- [ ] Logs e monitoramento

### Agente (Inteligência)
- [ ] Prompt Profile Builder
- [ ] Prompt Destination Suggester
- [ ] Prompt Trip Planner
- [ ] Prompt Chat Assistant
- [ ] Function calling (search_flights, search_hotels, etc)
- [ ] Sistema de aprendizado (feedback pós-viagem)

---

## 💡 ANALOGIA FINAL (Resumo em 1 minuto)

Imagine que você está construindo um **assistente de viagens pessoal robô**:

1. **Quiz = Entrevista inicial** (conhecer o cliente)
2. **Profile Builder = Médico fazendo diagnóstico** (entender quem é)
3. **Destination Suggester = Consultor dando opções** (sugerir destinos)
4. **Trip Planner = Arquiteto desenhando casa** (criar roteiro completo)
5. **APIs = Fornecedores** (Skyscanner vende voos, Booking vende hotéis)
6. **Payment = Caixa registradora** (processar pagamento)
7. **Dashboard = Agenda do cliente** (tudo organizado)
8. **Chat = Telefone 24h** (assistência durante viagem)

**Tudo isso trabalhando junto = Cash Trip completo!** 🚀

---

Ficou claro? Quer que eu detalhe alguma parte específica?