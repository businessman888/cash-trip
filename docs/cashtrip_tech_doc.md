# Documentação Técnica: Cash Trip Agent (Hybrid Onboarding & Core Flow)

**Versão:** 1.2  
**Data:** 27/11/2025  
**Engine:** Anthropic Claude Sonnet 4.5  
**Arquitetura:** Híbrida (UI Nativa Hardcoded + AI Reasoning)

---

## 1. Visão Geral da Arquitetura Híbrida

O fluxo de planejamento não é 100% conversacional desde o início. Ele segue um modelo de **Onboarding Híbrido** para reduzir a fricção e estruturar dados críticos.

1. **Fase 1 (UI Nativa)**: O App controla a experiência. O usuário preenche Destino, Datas, Orçamento e Pax via Modais/Pop-ups nativos. O Agente (AI) está "dormindo" nesta fase.

2. **Fase 2 (Handover/Injeção)**: Ao confirmar o último modal, o Frontend constrói um histórico de chat artificial contendo esses dados e envia para a API.

3. **Fase 3 (AI Reasoning)**: O Agente "acorda", lê o histórico injetado, entende que o planejamento já começou e parte direto para a execução (Busca de Voos/Hotéis) sem fazer perguntas repetitivas.

---

## 2. Instalação e Configuração (Next.js + TypeScript)

### 2.1 Instalar o SDK da Anthropic

```bash
npm install @anthropic-ai/sdk
```

### 2.2 Configurar Variáveis de Ambiente

Crie/edite o arquivo `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
GOOGLE_PLACES_API_KEY=your_google_key
```

### 2.3 Criar a API Route (Backend)

**Arquivo:** `app/api/chat/route.ts` (App Router) ou `pages/api/chat.ts` (Pages Router)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile, totalBudget } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // Claude Sonnet 4.5 (mais recente)
      max_tokens: 8192, // Balanceado para respostas detalhadas
      
      system: `Você é o Agente Cash Trip, um estrategista de viagens focado em 'Smart Luxury' e eficiência.
Sua missão não é apenas reservar, mas arquitetar uma experiência completa (logística + roteiro dia-a-dia) maximizando o valor do dinheiro do usuário.

[[PERFIL DO USUÁRIO - JSON]]
${JSON.stringify(userProfile, null, 2)}

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
- Busque voos e hotéis usando as tools \`search_flights\` e \`search_hotels\`.
- Apresente as opções focando no custo-benefício.

Fase 2: Roteiro (Após aprovação da logística)
- Gere o roteiro detalhado (Manhã/Tarde/Noite) para TODOS os dias da estadia.
- Para cada sugestão, explique POR QUE ela foi escolhida baseada no perfil (ex: "Sugeri o Restaurante X porque você ama comida asiática e ele é um 'hidden gem' barato").
- QUANDO O ROTEIRO ESTIVER COMPLETO E APROVADO PELO USUÁRIO, chame OBRIGATORIAMENTE a tool \`submit_final_itinerary\` para salvar no banco de dados.

[[DIRETRIZES GERAIS]]
- Não invente lugares: Use \`search_places\` para validar se o restaurante/atração existe.
- Personalização Radical: Nunca dê sugestões genéricas de "Top 10 Tripadvisor".
- Orçamento: Mantenha o total (Voo + Hotel + Estimativa de Gastos Diários) dentro do budget informado (${totalBudget}). Se o roteiro estourar, avise e sugira cortes.

Comece agora analisando os dados injetados (Destino/Data/Budget) e inicie a busca logística.`,
      
      messages: messages,
      
      tools: [
        {
          name: "search_flights",
          description: "Busca voos reais via Amadeus. Chame isso IMEDIATAMENTE após receber destino e datas.",
          input_schema: {
            type: "object",
            properties: {
              origin: { type: "string", description: "Código IATA (ex: GRU)" },
              destination: { type: "string", description: "Código IATA (ex: CDG)" },
              departureDate: { type: "string", description: "YYYY-MM-DD" },
              adults: { type: "integer" }
            },
            required: ["origin", "destination", "departureDate"]
          }
        },
        {
          name: "search_hotels",
          description: "Busca hotéis disponíveis via Amadeus.",
          input_schema: {
            type: "object",
            properties: {
              cityCode: { type: "string" },
              checkInDate: { type: "string", description: "YYYY-MM-DD" },
              checkOutDate: { type: "string", description: "YYYY-MM-DD" },
              budget_max: { type: "number" }
            },
            required: ["cityCode", "checkInDate", "checkOutDate"]
          }
        },
        {
          name: "search_places",
          description: "Busca restaurantes, atrações turísticas, baladas ou parques via Google Places/Yelp.",
          input_schema: {
            type: "object",
            properties: {
              query: { type: "string", description: "Ex: 'Restaurante Italiano Romântico em Paris'" },
              location: { type: "string", description: "Cidade ou coordenadas" },
              category: { type: "string", enum: ["food", "attraction", "nightlife", "shopping"] }
            },
            required: ["query", "location"]
          }
        },
        {
          name: "edit_trip_parameters",
          description: "Abre novamente o modal de datas ou local se o usuário pedir para mudar.",
          input_schema: {
            type: "object",
            properties: {
              target_modal: { 
                type: "string", 
                enum: ["date_picker", "location_picker", "budget_picker"] 
              }
            }
          }
        },
        {
          name: "submit_final_itinerary",
          description: "Chame esta função APENAS quando o usuário aprovar o roteiro final. Isso salvará o plano no banco de dados e atualizará a UI do App.",
          input_schema: {
            type: "object",
            properties: {
              trip_title: { type: "string", description: "Ex: 'Aventura em Paris'" },
              days: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    date: { type: "string", description: "YYYY-MM-DD (formato obrigatório)" },
                    morning_activity: { 
                      type: "object", 
                      properties: { 
                        title: { type: "string" }, 
                        location: { type: "string" }, 
                        type: { type: "string", description: "Ex: museu, parque, caminhada" } 
                      } 
                    },
                    lunch_spot: { 
                      type: "object", 
                      properties: { 
                        name: { type: "string" }, 
                        cuisine: { type: "string" }, 
                        price_level: { type: "string", enum: ["$", "$$", "$$$", "$$$$"] } 
                      } 
                    },
                    afternoon_activity: { 
                      type: "object",
                      properties: { 
                        title: { type: "string" }, 
                        location: { type: "string" } 
                      } 
                    },
                    dinner_spot: { 
                      type: "object",
                      properties: { 
                        name: { type: "string" }, 
                        cuisine: { type: "string" }, 
                        booking_required: { type: "boolean" } 
                      } 
                    }
                  },
                  required: ["date"]
                }
              }
            },
            required: ["trip_title", "days"]
          }
        }
      ]
    });

    // Processa tool calls
    if (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find(block => block.type === 'tool_use');
      
      if (toolUse && toolUse.name === 'submit_final_itinerary') {
        // Salvar no banco de dados
        await saveItineraryToDatabase(toolUse.input);
        
        // Retornar sucesso para o frontend
        return NextResponse.json({
          success: true,
          itinerary: toolUse.input,
          message: 'Roteiro salvo com sucesso!'
        });
      }
      
      // Processar outras tools (search_flights, search_hotels, etc.)
      const toolResult = await executeToolCall(toolUse);
      
      return NextResponse.json({
        tool_result: toolResult,
        continue_conversation: true
      });
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

// Função auxiliar para salvar no banco
async function saveItineraryToDatabase(itinerary: any) {
  // Implementar lógica de salvamento no seu banco (Prisma/Supabase/etc)
  // Exemplo:
  // await prisma.trip.create({ data: { ... } });
}

// Função auxiliar para executar tool calls
async function executeToolCall(toolUse: any) {
  switch (toolUse.name) {
    case 'search_flights':
      // Chamar Amadeus API
      return await searchFlights(toolUse.input);
    case 'search_hotels':
      return await searchHotels(toolUse.input);
    case 'search_places':
      return await searchPlaces(toolUse.input);
    default:
      return { error: 'Tool não implementada' };
  }
}
```

### 2.4 Chamar a API do Frontend

**Exemplo de componente de Chat:**

```typescript
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userMessage: string) => {
    setLoading(true);
    
    // Adiciona mensagem do usuário
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          userProfile: getUserProfileFromQuiz(), // Função que busca o perfil do quiz
          totalBudget: getTotalBudget() // Orçamento informado nos modais
        })
      });

      const data = await response.json();

      if (data.success && data.itinerary) {
        // Roteiro finalizado! Redirecionar para tela de roteiro
        router.push(`/trip/${data.itinerary.trip_id}`);
      } else {
        // Adiciona resposta do assistente
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: data.content[0].text 
        }]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* UI do chat */}
    </div>
  );
}
```

---

## 3. Protocolo de Handover (Injeção de Contexto)

Este é o mecanismo crítico para o Agente "ver" o que o usuário fez nos modais.

**Exemplo de Payload da 1ª Requisição:**

```json
{
  "system": "... (System Prompt definido na seção 2.3) ...",
  "messages": [
    {
      "role": "assistant",
      "content": "Olá! Para onde vamos na próxima aventura?"
    },
    {
      "role": "user",
      "content": "Paris, França"
    },
    {
      "role": "assistant",
      "content": "Ótima escolha! E quais são as datas?"
    },
    {
      "role": "user",
      "content": "De 11/06/2025 até 20/06/2025"
    },
    {
      "role": "user",
      "content": "Somos 2 adultos com orçamento total de R$ 15.000,00"
    }
  ]
}
```

---

## 4. Modelagem de Dados: O Perfil do Viajante (Quiz Mapping)

### 4.1 Schema JSON: Perfil de Lazer (leisure_profile)

```json
{
  "user_type": "leisure",
  "basic_info": {
    "gender": "string (P1)",
    "location_origin": { "city": "string", "state": "string" },
    "age": "integer (P3)"
  },
  "psychographics": {
    "travel_styles": ["string", "string"],
    "pace": "Agitado | Equilibrado | Relax",
    "day_vibe": ["string"],
    "night_vibe": ["string"]
  },
  "accommodation_prefs": {
    "types": ["string"],
    "amenities_required": ["string"],
    "budget_tier": "derived_from_income"
  },
  "gastronomy": {
    "cuisines": ["string"],
    "restrictions": ["string"]
  },
  "logistics": {
    "flight_class": "string (P18)",
    "connections": "string (P19)"
  }
}
```

---

## 5. Fluxo de Finalização: Da IA para as Telas do App

### 5.1 Lógica de Conexão

O Agente não escreve o roteiro no chat em texto corrido. Ele estrutura os dados e chama a tool `submit_final_itinerary`.

**Fluxo:**

1. **Interceptação**: O Backend recebe o pedido da Anthropic: "O Agente quer usar a tool `submit_final_itinerary` com este JSON..."

2. **Persistência**: O código pega esse JSON e salva no banco de dados (`trips`, `itinerary_items`).

3. **Gatilho de UI**: O Backend responde ao Frontend: "Sucesso. Novos dados disponíveis."

4. **Renderização**: A página de Roteiro faz um `fetch` no banco e renderiza os cards reais baseados no que o Agente salvou.

**Resumo:** O Agente preenche o Banco de Dados via Tool → O App lê o Banco de Dados e mostra na tela.

### 5.2 Exemplo de Salvamento no Banco (Prisma)

```typescript
// lib/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveItineraryToDatabase(itinerary: any) {
  const trip = await prisma.trip.create({
    data: {
      title: itinerary.trip_title,
      userId: getCurrentUserId(), // Implementar autenticação
      days: {
        create: itinerary.days.map((day: any) => ({
          date: new Date(day.date),
          morningActivity: day.morning_activity,
          lunchSpot: day.lunch_spot,
          afternoonActivity: day.afternoon_activity,
          dinnerSpot: day.dinner_spot
        }))
      }
    },
    include: { days: true }
  });

  return trip;
}
```

---

## 6. Iteração e Ajuste Fino do Prompt

**É impossível acertar o prompt de primeira.** Você passará por uma fase de "Prompt Debugging":

### Exemplos de Iterações:

1. **Teste 1**: O Agente gerou um jantar num restaurante que fecha às segundas-feiras.
   - **Ação**: Editar o System Prompt: "Verifique os dias de funcionamento dos restaurantes via Google Places antes de sugerir."

2. **Teste 2**: O Agente gerou atividades muito longe uma da outra.
   - **Ação**: Editar o System Prompt: "Agrupe atividades por geolocalização (bairro) para evitar deslocamento."

3. **Teste 3**: O Agente alucinou um formato de data errado (DD/MM vs MM/DD) que quebrou o app.
   - **Ação**: Reforçar no Tool Schema: "Format must be YYYY-MM-DD strictly."

**Conclusão Prática:** Não tente codificar toda a lógica. Codifique a lógica de "Salvar no Banco". A tela é apenas um reflexo do banco.

---

## 7. Fluxo de Conversão e Tracking (WebView)

Como o pagamento não é nativo, monitoramos a navegação para capturar o sucesso.

### Monitoramento de URL (Listener)

```javascript
const SUCCESS_PATTERNS = [
  '/confirmation',
  '/receipt',
  '/success',
  'payment_approved'
];

onUrlChange(currentUrl) {
  if (SUCCESS_PATTERNS.some(pattern => currentUrl.includes(pattern))) {
    // 1. Fecha WebView
    closeBrowser();
    
    // 2. Avisa o Agente (Backend)
    injectSystemMessage("SYSTEM_EVENT: Usuário atingiu URL de sucesso. Compra provável.");
  }
}
```

---

## 8. Checklist de Desenvolvimento

### Frontend (App)
- [ ] Fluxo de Onboarding: Implementar modais sequenciais (Local → Data → Orçamento)
- [ ] State Management: Armazenar essas respostas em variáveis locais até o final do fluxo
- [ ] Message Builder: Criar função que transforma as variáveis locais no array de mensagens JSON para a 1ª requisição (Handover)
- [ ] WebView: Implementar listener de URL para detecção de compra
- [ ] Tela de Roteiro: Criar página que busca dados do banco e renderiza o itinerário

### Backend (Node.js/Next.js)
- [ ] Instalar SDK: `npm install @anthropic-ai/sdk`
- [ ] Configurar `.env.local` com chaves de API
- [ ] Quiz Integration: Endpoint que recebe ID do usuário e retorna o JSON Profile estruturado
- [ ] Amadeus Integration: Configurar credenciais e rotas para `search_flights` e `search_hotels`
- [ ] Google Places Integration: Configurar `search_places`
- [ ] Anthropic Controller: Criar API Route que recebe mensagens injetadas e envia para o Claude
- [ ] Database Schema: Criar tabelas `trips` e `itinerary_items`
- [ ] Tool Handler: Implementar lógica para processar tool calls do Agente
- [ ] Save Function: Implementar `saveItineraryToDatabase`

### IA & Prompting
- [ ] Teste de Handover: Verificar se o Agente reconhece "Paris" e "Datas" sem perguntar de novo
- [ ] Teste de Orçamento: Verificar se o Agente respeita o teto de R$ 15k informado na injeção
- [ ] Teste de Tool Calling: Verificar se o Agente chama `submit_final_itinerary` ao finalizar
- [ ] Teste de Personalização: Verificar se o Agente usa o JSON do perfil corretamente
- [ ] Iteração de Prompt: Ajustar comportamento baseado em testes reais

---

## 9. Troubleshooting Comum

### Problema: Agente não chama a tool `submit_final_itinerary`
**Solução:** Reforçar no System Prompt: "APÓS O USUÁRIO APROVAR, você DEVE chamar submit_final_itinerary. Não escreva o roteiro final no chat."

### Problema: Formato de data incorreto
**Solução:** Adicionar validação no Tool Schema e no prompt: "YYYY-MM-DD is mandatory. Never use DD/MM/YYYY."

### Problema: Agente alucina preços de voos/hotéis
**Solução:** Sempre retornar erro quando tool não encontra resultados. Adicionar no prompt: "Se a tool retornar vazio, informe ao usuário que não há disponibilidade."

---

**Versão 1.2** - Documentação completa com instruções de implementação técnica