# Bug Report: Trip Creation Flow - "Criar Roteiro" Hang

**Data:** 29/11/2025  
**Problema:** O fluxo de criação de viagem trava após clicar em "Criar roteiro"  
**Severidade:** CRÍTICA  
**Status:** EM INVESTIGAÇÃO

---

## 📋 Resumo do Problema

Após o usuário selecionar o destino, datas, orçamento, voo e hotel, ao clicar no botão "Criar roteiro", a aplicação exibe a animação de carregamento "Aurora está pensando..." por 45-50 segundos e depois para completamente sem retornar resposta ou abrir a janela modal do roteiro.

## 🔍 Sintomas Observados

1. **Interface:**
   - Carregamento por 45-50 segundos
   - Animação de loading desaparece sem retorno
   - Nenhuma janela modal é exibida
   - Nenhuma mensagem de erro aparece para o usuário

2. **Console do Navegador:**
   - Nenhum erro JavaScript visível
   - Nenhum log de rede (indicando possível timeout silencioso)
   - Erro de parsing ECMAScript detectado anteriormente (código corrompido em cache)

3. **Terminal (Backend):**
   - Logs vazios durante o teste
   - Nenhum erro do servidor Node.js
   - Nenhuma indicação de requisição chegando ao backend

## 🛠️ Estado Atual dos Arquivos

### Frontend: `src/components/trips/new/NewTripChat.tsx`

**Última modificação:** Adição de timeout, logs detalhados e alert de debugging

**Função crítica:** `handleCreateItinerary` (linhas 453-492)

```typescript
const handleCreateItinerary = async () => {
    const userMessage = "Criar roteiro"
    console.log('[handleCreateItinerary] Starting itinerary creation...')
    console.log('[handleCreateItinerary] Trip Details:', tripDetails)
    console.log('[handleCreateItinerary] Flight Options:', flightOptions)
    console.log('[handleCreateItinerary] Hotel Options:', hotelOptions)
    
    // TEMPORARY: Alert to confirm function is called
    alert('DEBUG: handleCreateItinerary foi chamado! Verifique o console do navegador.')
    
    setMessages(prev => [
        ...prev,
        {
            id: Date.now().toString(),
            sender: 'user',
            text: userMessage,
            type: 'text'
        }
    ])

    setIsLoading(true)

    // Reconstruct the FULL message history to send to backend
    const agentMessages = [
        { role: 'assistant', content: 'Olá! Para onde vamos na próxima aventura?' },
        { role: 'user', content: tripDetails.location },
        { role: 'assistant', content: 'Ótima escolha! E quais são as datas?' },
        { role: 'user', content: `De ${tripDetails.startDate} até ${tripDetails.endDate}` },
        { role: 'user', content: `Somos ${tripDetails.travelers} adultos com orçamento total de ${tripDetails.budget}` },
        { role: 'assistant', content: 'Perfeito! Encontrei essas opções de voo...' },
        { role: 'user', content: `Selecionei a opção de voo` },
        { role: 'assistant', content: 'Ótimo! Agora veja essas opções de hotel...' },
        { role: 'user', content: `Selecionei a opção de hotel` },
        { role: 'assistant', content: 'Perfeito! Voo e hotel selecionados com sucesso!' },
        { role: 'user', content: userMessage }
    ]

    console.log('[handleCreateItinerary] Sending messages:', agentMessages)
    await sendMessageToAgent(agentMessages)
}
```

**Função de comunicação:** `sendMessageToAgent` (linhas 248-375)

**Melhorias aplicadas:**
- ✅ AbortController com timeout de 60 segundos
- ✅ Verificação de HTTP status
- ✅ Logs detalhados de request/response
- ✅ Tratamento de erro com `try/catch`
- ✅ Alert de debugging

### Backend: `src/app/api/chat/route.ts`

**Modelo AI:** `claude-sonnet-4-5-20250929` (conforme solicitação do usuário)

**System Prompt (linhas 42-72):**
```typescript
const systemPrompt = `Você é o Agente Cash Trip, um estrategista de viagens focado em 'Smart Luxury' e eficiência.

[[PERFIL DO USUÁRIO]]
${JSON.stringify(userProfile, null, 2)}

[[FLUXO OBRIGATÓRIO - SIGA A ORDEM EXATA]]

1. **BUSCA DE VOOS (Passo Atual: Voos)**
   - O usuário informou destino e datas.
   - CHAME \`search_flights\` para buscar opções reais.
   - NÃO busque hotéis ainda.
   - PARE e aguarde o usuário selecionar uma opção de voo.

2. **BUSCA DE HOTÉIS (Passo Atual: Hotéis)**
   - O usuário JÁ selecionou o voo (você verá na mensagem "Selecionei a opção X de voo").
   - CHAME \`search_hotels\` para buscar opções reais na cidade de destino.
   - PARE e aguarde o usuário selecionar uma opção de hotel.

3. **CRIAÇÃO DE ROTEIRO (Passo Atual: Roteiro)**
   - O usuário JÁ selecionou voo E hotel.
   - O usuário enviou o comando "Criar roteiro".
   - CHAME \`propose_itinerary\` com um plano detalhado dia-a-dia.
   - O frontend mostrará isso em um modal para aprovação.
   - **IMPORTANTE:** NÃO faça buscas (search_places) para cada item do roteiro. Use seu conhecimento interno para preencher as atividades e chame a ferramenta IMEDIATAMENTE. O usuário quer ver o roteiro rápido.

4. **FINALIZAÇÃO (Passo Atual: Salvar)**
   - O usuário aprovou o roteiro ("Aprovado").
   - CHAME \`submit_final_itinerary\` para salvar no banco.

[[REGRAS CRÍTICAS]]
- NUNCA pule etapas. Não busque hotéis antes de ter o voo definido.
- Sempre retorne pelo menos 2 opções de voo e 2 opções de hotel quando solicitado.
- Para o roteiro, priorize velocidade: gere o JSON completo de uma vez só.
```

**Configurações:**
- `MAX_LOOPS`: 8
- `max_tokens`: 20000
- `model`: claude-sonnet-4-5-20250929

**Logs adicionados:**
- ✅ Log de request recebido com contagem de mensagens
- ✅ Log de cada iteração do agent loop
- ✅ Log de ferramentas chamadas
- ✅ Log detalhado do input ao chamar `propose_itinerary`

### Componentes Relacionados

1. **`ItineraryModal.tsx`** - Modal para exibir o roteiro gerado (CRIADO)
2. **`NewTripChatInput.tsx`** - Input de chat (EXISTENTE)
3. **`NewTripChatBubble.tsx`** - Bolhas de mensagem (EXISTENTE)

## 🔄 Tentativas de Correção Realizadas

### 1️⃣ Diagnóstico Inicial
- ❌ Verificado ambiente variables (TODAS presentes)
- ❌ Modelo AI inválido (corrigido para versão funcional)

### 2️⃣ Correção de Mensagem Incompleta
- ✅ `handleCreateItinerary` enviava histórico simplificado SEM contexto completo
- ✅ CORRIGIDO: Agora envia TODAS as informações (localização, datas, orçamento, seleções)

### 3️⃣ Otimização do System Prompt
- ✅ Adicionado instrução explícita para NÃO fazer buscas durante criação de roteiro
- ✅ Reduzido `MAX_LOOPS` de 20 para 8

### 4️⃣ Correção do Loop Backend
- ✅ Backend agora retorna IMEDIATAMENTE ao detectar `propose_itinerary`
- ✅ Não mais consome a tool call internamente

### 5️⃣ Timeout e Error Handling
- ✅ Implementado AbortController com 60s timeout
- ✅ HTTP status check
- ✅ Logs detalhados em frontend e backend

### 6️⃣ Debugging Aids
- ✅ Alert visual para confirmar execução da função
- ✅ Logs de console em todos os pontos críticos

## ❗ Problemas Identificados Mas Não Resolvidos

### 1. Cache do Navegador
**Sintoma:** Erro de parsing ECMAScript mostrado no console  
**Causa:** Código JavaScript antigo em cache  
**Status:** Instruído user a fazer hard refresh (Ctrl+Shift+R)  
**Próximo passo:** Confirmar se alert aparece após limpeza de cache

### 2. Timeout Silencioso (HIPÓTESE)
**Sintoma:** Loading para após ~50segundos sem erro  
**Possível causa:** Anthropic API timeout ou MAX_LOOPS atingido sem log  
**Status:** Logs adicionados, aguardando confirmação se aparecem  
**Próximo passo:** Verificar se logs aparecem no console E terminal

### 3. Botão Não Conectado (HIPÓTESE)
**Sintoma:** Alert de debugging não aparece  
**Possível causa:** `handleCreateItinerary` não está sendo chamado  
**Status:** Alert adicionado para diagnosticar  
**Próximo passo:** Confirmar se alert aparece

## 🔬 Hipóteses Atuais (Prioridade)

### HIPÓTESE 1: Cache do Navegador (90% confiança)
O código está correto no servidor, mas o navegador está usando versão antiga corrompida em cache.

**Evidência:**
- Screenshot mostra erro de parsing nas linhas 453-457
- Código atual no servidor está correto nessas linhas
- User reportou que erro apareceu "quando voltou" mas não ao testar

**Próximo passo:** Hard refresh completo

### HIPÓTESE 2: MAX_LOOPS Atingido Silenciosamente (60% confiança)
O agente está fazendo muitas chamadas de `search_places` e atingindo o limite de 8 loops sem gerar erro visível.

**Evidência:**
- Tempo de carregamento (~45-50s) é consistente com múltiplas chamadas API
- System prompt tem instrução para NÃO fazer searches, mas pode não estar sendo seguida

**Próximo passo:** Verificar logs do terminal durante teste

### HIPÓTESE 3: Anthropic API Timeout (40% confiança)
A API do Anthropic está demorando muito ou retornando timeout sem erro explícito.

**Evidência:**
- ~50 segundos é um tempo típico de timeout de API
- Nenhum erro aparece no console

**Próximo passo:** Verificar se AbortController está funcionando

## 📊 Fluxo Esperado vs. Atual

### Fluxo Esperado
```
User clica "Criar roteiro"
    ↓
handleCreateItinerary() é chamado
    ↓
Alert "DEBUG: handleCreateItinerary foi chamado!" aparece
    ↓
Console log: "[handleCreateItinerary] Starting..."
    ↓
Console log: "[sendMessageToAgent] Calling API with..."
    ↓
Request POST para /api/chat
    ↓
Backend log: "[API] Received request"
    ↓
Backend log: "[Agent Loop 1] Starting iteration..."
    ↓
Backend log: "[Agent Loop 1] Tools called: propose_itinerary"
    ↓
Backend retorna response
    ↓
Console log: "[sendMessageToAgent] Received response:"
    ↓
Modal abre com roteiro
```

### Fluxo Atual (Reportado)
```
User clica "Criar roteiro"
    ↓
Loading animation aparece
    ↓
(45-50 segundos de espera)
    ↓
Loading animation desaparece
    ↓
NADA acontece
    ↓
Nenhum erro no console
    ↓
Nenhum log no terminal
```

## 🚨 Ações Imediatas Necessárias

1. **User deve fazer HARD REFRESH:**
   - Fechar a aba completamente
   - Abrir nova aba em `localhost:3000/trips/new`
   - Apertar Ctrl + Shift + R
   - OU usar DevTools com "Disable cache" marcado

2. **Confirmar se alert aparece:**
   - Se NÃO aparecer → Problema no botão ou cache
   - Se aparecer → Problema na comunicação backend

3. **Verificar console logs:**
   - Abrir DevTools (F12) → Console
   - Testar o fluxo
   - Tirar screenshot dos logs

4. **Verificar terminal logs:**
   - Observar terminal onde `npm run dev` está rodando
   - Devem aparecer logs `[API] Received request` etc.

## 📝 Informações para Debugging

### Variáveis de Ambiente Necessárias
```
ANTHROPIC_API_KEY=sk-ant-api03...
AMADEUS_API_KEY=...
AMADEUS_API_SECRET=...
GOOGLE_PLACES_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Comandos Úteis
```bash
# Restart servidor
npm run dev

# Limpar cache Next.js
rm -rf .next

# Ver logs em tempo real
# (já está rodando com npm run dev)
```

### Browser DevTools
```
# Console
F12 → Console tab

# Network
F12 → Network tab
    → Filter: Fetch/XHR
    → Look for POST to /api/chat
    
# Disable cache
F12 → Network tab → ✅ Disable cache
```

## 🎯 Próximos Passos Planejados

### Se alert NÃO aparecer:
1. Verificar se `handleCreateItinerary` está conectado ao botão
2. Inspecionar elemento do botão para confirmar onClick
3. Adicionar log direto no onClick do botão

### Se alert aparecer MAS nenhum log de API:
1. Verificar se fetch está sendo bloqueado (CORS, etc)
2. Verificar Network tab por request falhado
3. Testar chamada direta à API com Postman/curl

### Se logs de API aparecerem MAS travarem:
1. Aumentar timeout do AbortController
2. Adicionar mais logs durante o agent loop
3. Verificar se modelo AI está acessível
4. Considerar mockar resposta do agente temporariamente

## 📚 Arquivos Modificados Nesta Sessão

1. `src/components/trips/new/NewTripChat.tsx` (PRINCIPAL)
   - handleCreateItinerary: Enviando contexto completo
   - sendMessageToAgent: Timeout + logs
   
2. `src/app/api/chat/route.ts` (BACKEND)
   - System prompt: Otimizado
   - MAX_LOOPS: 8
   - Logs detalhados

3. `src/components/trips/new/ItineraryModal.tsx` (NOVO)
   - Modal do roteiro (pixel-perfect com Figma)

## 🔗 Referências

- **Figma Design:** `node-id=1147-996` (ItineraryModal)
- **Anthropic Docs:** https://docs.anthropic.com/claude/docs
- **Previous Implementation:** `docs/resumo_implementacao_27-11-2025.md`

---

**Última atualização:** 29/11/2025 18:31  
**Responsável:** Debugging Agent (Claude 4.5 Sonnet Thinking)  
**Status:** AGUARDANDO teste após hard refresh do user
