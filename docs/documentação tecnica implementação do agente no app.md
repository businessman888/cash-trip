Documentação Técnica: Cash Trip Agent (Hybrid Onboarding & Core 

Flow) 

Versão: 1.1 Data: 25/11/2025 Engine: Anthropic Claude 3.5 Sonnet 

Arquitetura: Híbrida (UI Nativa Hardcoded + AI Reasoning) 

1. Visão Geral da Arquitetura Híbrida 

O fluxo de planejamento não é 100% conversacional desde o início. Ele segue 

um modelo de Onboarding Híbrido para reduzir a fricção e estruturar dados 

críticos. 

1.  Fase 1 (UI Nativa): O App controla a experiência. O usuário preenche 

Destino, Datas, Orçamento e Pax via Modais/Pop -ups nativos. O Agente 

(AI) está "dormindo" nesta fase. 

2.  Fase 2 (Handover/Injeção): Ao confirmar o último modal, o Frontend 

constrói um histórico de chat artificial contendo esses dados e envia 

para a API. 

3.  Fase 3 (AI Reasoning): O Agente "acorda", lê o histórico injetado, 

entende que o planejamento já começou e parte direto para a execução 

(Busca de Voos/Hotéis) sem fazer perguntas repetitivas. 

2. Protocolo de Handover (Injeção de Contexto) 

Este é o mecanismo crítico para o Agente "ver" o que o usuário fez nos modais. 

Ao invés de iniciar o chat vazio, a primeira requisição para a API da Anthropic 

deve conter o seguinte payload estruturado. 

Exemplo de Payload da 1ª Requisição (Backend -> Anthropic): 

JSON 

{

"system": "... (System Prompt d efinido na seção 4) ...", 

"messages": [ 

{

"role": "assistant", 

"content": "Olá! Para onde vamos na próxima aventura?" // Texto do balão 

fixo da UI 

}, {

"role": "user", 

"content": "Paris, França" // Valor capturado do M odal de Destino 

}, 

{

"role": "assistant", 

"content": "Ótima escolha! E quais são as datas?" // Texto do balão fixo da 

UI 

}, 

{

"role": "user", 

"content": "De 11/06/2025 até 20/06/2025" // Valor capturado do Modal de 

Data 

}, 

{

"role": "user", 

"content": "Somos 2 adultos com orçamento total de R$ 15.000,00" // Valor 

capturado do Modal de Orçamento 

}

// A partir daqui, a AI gera a próxima resposta baseada nesse histórico. 

]

}

3. Modelagem de Dados: O Perfil do Viajante (Quiz Mapping) 

Este JSON é derivado das 25 perguntas do Quiz e deve ser injetado no System 

Prompt. 

3.1 Schema JSON: Perfil de Lazer (leisure_profile) 

JSON 

{

"user_type": "leisure", "basic_info": { 

"gender": "string (P 1)", 

"location_origin": { "city": "string", "state": "string" }, // P2 

"age": "integer (P3)" 

}, 

"psychographics": { 

"travel_styles": ["string", "string"], // P5 (Max 2) 

"pace": "Agitado | Equilibrado | Relax", // P6 

"day_vibe": ["st ring"], // P7 

"night_vibe": ["string"] // P8 

}, 

"accommodation_prefs": { 

"types": ["string"], // P10 

"amenities_required": ["string"], // P12 

"budget_tier": "derived_from_income" // Lógica interna 

}, 

"gastronomy": { 

"cuisines": ["string"], // P13 

"restrictions": ["string"] // P14 

}, 

"logistics": { 

"flight_class": "string (P18)", 

"connections": "string (P19)" 

}

}

4. Engenharia de Prompt (System Context Atualizado) 

Você é o Agente Cash Trip, um estrategista de viagens focado em 'Smart Luxury' e eficiência.
Sua missão não é apenas reservar, mas arquitetar uma experiência completa (logística + roteiro dia-a-dia) maximizando o valor do dinheiro do usuário.

[[PERFIL DO USUÁRIO - JSON]]
${JSON_PROFILE}

[[ESTADO ATUAL DA CONVERSA]]
O usuário JÁ INFORMOU o destino, as datas e o orçamento através da interface visual.
NÃO pergunte "Para onde vamos?" ou "Qual a data?".
O fluxo deve ser:
1. Reconhecer/Validar os dados iniciais.
2. Resolver Logística (Voos/Hospedagem).
3. Resolver Experiência (Roteiro dia-a-dia e Gastronomia).

[[DIRETRIZES DE ROTEIRO E EXPERIÊNCIA]]
Ao criar o roteiro diário, você deve obedecer estritamente às variáveis do JSON:

1. Ritmo (Pace):
   - Se "Relax": Máximo 1 atividade principal + 1 refeição longa. Deixe manhãs livres.
   - Se "Agitado": Otimize a rota geográfica para caber 3-4 atividades sem deslocamentos longos.
   - Se "Equilibrado": 1 atividade manhã, 1 tarde, noite livre.

2. Gastronomia & Smart Luxury:
   - Use a regra "High-Low": Se sugerir um jantar caro (Splurge) numa noite, sugira um almoço incrível e barato (Street Food/Bistrô local) no dia seguinte para equilibrar o budget.
   - Filtro Absoluto: Se JSON contém 'dietary_restrictions', NUNCA sugira um lugar que não atenda.
   - Valide 'dining_style': Se o usuário marcou "Gourmet", priorize Michelin/Awards. Se "Local", priorize lugares frequentados por residentes, fora da rota turística.

3. Atividades & Interesses:
   - Cruzamento de Dados: Se JSON tem interesse em "História" e "Música", sugira um show de Jazz em um prédio histórico, não apenas um museu genérico.
   - Logística Geográfica: Agrupe atividades por bairro. Não faça o usuário cruzar a cidade duas vezes no mesmo dia.

[[PROTOCOLO DE RESPOSTA]]
Fase 1: Logística (Imediata)
- Busque voos e hotéis usando as tools `search_flights` e `Google Hotels`.
- Apresente as opções focando no custo-benefício.

Fase 2: Roteiro (Após aprovação da logística)
- Gere o roteiro detalhado (Manhã/Tarde/Noite) para TODOS os dias da estadia.
- Para cada sugestão, explique POR QUE ela foi escolhida baseada no perfil (ex: "Sugeri o Restaurante X porque você ama comida asiática e ele é um 'hidden gem' barato").

[[DIRETRIZES GERAIS]]
- Não invente lugares: Use `search_places` para validar se o restaurante/atração existe.
- Personalização Radical: Nunca dê sugestões genéricas de "Top 10 Tripadvisor".
- Orçamento: Mantenha o total (Voo + Hotel + Estimativa de Gastos Diários) dentro do budget informado (${TOTAL_BUDGET}). Se o roteiro estourar, avise e sugira cortes.

Comece agora analisando os dados injetados (Destino/Data/Budget) e inicie a busca logística.

5. Definição de Ferramentas (Tools Schema) 

As ferramentas que o agente utiliza para buscar dados reais (Amadeus/Google) 

e interagir com a UI. 

5.1 Busca de Voos (Amadeus API) 

JSON 

{

"name": "search_flights", "description": "Busca voos reais. Chame isso IM EDIATAMENTE após receber 

destino e datas.", 

"input_schema": { 

"type": "object", 

"properties": { 

"origin": { "type": "string", "description": "Código IATA (ex: GRU)" }, 

"destination": { "type": "string", "description": "Código IATA (ex : CDG)" }, 

"departureDate": { "type": "string", "description": "YYYY -MM -DD" }, 

"adults": { "type": "integer" } 

}, 

"required": ["origin", "destination", "departureDate"] 

}

}

5.2 Busca de Experiências/Restaurantes (Google Places/Yelp)
JSON

{
  "name": "search_places",
  "description": "Busca restaurantes, atrações turísticas, baladas ou parques.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Ex: 'Restaurante Italiano Romântico em Paris'" },
      "location": { "type": "string", "description": "Cidade ou coordenadas" },
      "category": { "type": "string", "enum": ["food", "attraction", "nightlife", "shopping"] }
    },
    "required": ["query", "location"]
  }
}
5.3 Busca de Hospedagem (Amadeus API) 

JSON 

{

"name": " search_hotels", 

"description": "Busca hotéis disponíveis.", 

"input_schema": { 

"type": "object", 

"properties": { 

"cityCode": { "type": "string" }, 

"checkInDate": { "type": "string" }, 

"checkOutDate": { "type": "string" }, 

"budget_max": { "type": "number" } 

}, 

"required": ["cityCode", "checkInDate", "checkOutDate"] 

}

}5.4 Edição de Viagem (UI Control) 

Nota: Como os dados já vieram dos modais iniciais, esta tool serve apenas se 

o usuário quiser MUDAR algo depois. 

JSON 

{

"name": "edit_trip_parameters", 

"description": "Abre novamente o modal de datas ou local se o usuário pedir 

para mudar.", 

"input_schema": { 

"type": "object", 

"properties": { 

"target_modal": { "type": "string", "enum": ["date_pick er", "location_picker", 

"budget_picker"] } 

}

}

}

6. Fluxo de Conversão e Tracking (WebView) 

Como o pagamento não é nativo, monitoramos a navegação para capturar o 

sucesso. 

Monitoramento de URL (Listener) 

O Frontend deve implementar um listener na WebView que verifica padrões de 

sucesso. 

Lógica de Código (Conceitual): 

JavaScript 

const SUCCESS_PATTERNS = [ 

'/confirmation', 

'/receipt', 

'/success', 

'payment_approved' 

]; onUrlChange(currentUrl) { 

if (SUCCESS_PATTERNS.some(pattern => curren tUrl.includes(pattern))) { 

// 1. Fecha WebView 

closeBrowser(); 

// 2. Avisa o Agente (Backend) 

injectSystemMessage("SYSTEM_EVENT: Usuário atingiu URL de sucesso. 

Compra provável."); 

}

}

7. Checklist de Desenvolvimento 

Frontend (App)  

> 

[ ] Fluxo de Onboarding: Implementar modais sequenciais (Local ->

Data -> Orçamento).  

> 

[ ] State Management: Armazenar essas respostas em variáveis locais 

até o final do fluxo.  

> 

[ ] Message Builder: Criar função que transforma as variáveis locais no 

array de men sagens JSON para a 1ª requisição (Handover).  

> 

[ ] WebView: Implementar listener de URL para detecção de compra. 

Backend (Node.js)  

> 

[ ] Quiz Integration: Endpoint que recebe ID do usuário e retorna o 

JSON Profile estruturado.  

> 

[ ] Amadeus Integration: Configurar credenciais e rotas para 

search_flights e Google Hotels.  

> 

[ ] Anthropic Controller: Lógica que recebe o array de mensagens 

injetado e envia para o Claude. 

IA & Prompting  

> 

[ ] Teste de Handover: Verificar se o Agente reconhece "Paris" e "Datas" 

se m perguntar de novo.  

> 

[ ] Teste de Orçamento: Verificar se o Agente respeita o teto de R$ 15k 

informado na injeção.