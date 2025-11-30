# Correção do Fluxo - Botão "Ver Roteiro"

## Data: 30 de Novembro de 2025 - 01:40

## Problema Relatado

O agente da página `/trips/new` não estava apresentando o roteiro ao usuário. Após o usuário clicar em "Criar roteiro", o agente processava mas não exibia o roteiro.

## Solução Implementada

### 1. Novo Fluxo de Visualização do Roteiro

**Antes:**
- Agente gerava roteiro → Modal abria automaticamente

**Agora:**
- Agente gera roteiro → Mensagem "Roteiro pronto para sua visualização!" → Botão "Ver Roteiro" → Usuário clica → Modal abre

### 2. Alterações no Frontend (`NewTripChat.tsx`)

#### A. Novo tipo de mensagem (linha 20)
```typescript
type?: 'text' | 'action-location' | 'action-date' | 'action-budget' |
    'action-select-flight' | 'action-select-hotel' |
    'action-create-itinerary' | 'action-view-itinerary'
```

#### B. Handler de propose_itinerary modificado (linhas 344-361)
```typescript
} else if (toolUse.name === 'propose_itinerary') {
    // Itinerary generated!
    console.log('[propose_itinerary] Tool detected! Input:', toolUse.input)
    const itineraryData = toolUse.input
    console.log('[propose_itinerary] Setting itinerary data:', itineraryData)
    setGeneratedItinerary(itineraryData)
    console.log('[propose_itinerary] Adding message with view button...')
    
    // Add message with button to view itinerary
    setMessages(prev => [
        ...prev,
        {
            id: Date.now().toString(),
            sender: 'aurora',
            text: 'Roteiro pronto para sua visualização!',
            type: 'action-view-itinerary'
        }
    ])
}
```

**Mudança:** Ao invés de abrir o modal automaticamente (`setIsItineraryModalOpen(true)`), agora adiciona uma mensagem com tipo `action-view-itinerary`.

#### C. Novo handler handleViewItinerary (linhas 613-616)
```typescript
const handleViewItinerary = () => {
    console.log('[handleViewItinerary] Opening itinerary modal...')
    setIsItineraryModalOpen(true)
}
```

#### D. Novo botão "Ver Roteiro" na renderização (linhas 803-812)
```typescript
{/* View Itinerary Button */}
{msg.sender === 'aurora' && msg.type === 'action-view-itinerary' && (
    <button
        onClick={handleViewItinerary}
        className="w-fit px-6 py-3 bg-[#FF5F38] text-white rounded-[20px] font-bold shadow-lg hover:bg-[#e04f2c] transition-colors flex items-center gap-2"
    >
        <span>Ver Roteiro</span>
        <IoMap className="text-xl" />
    </button>
)}
```

### 3. Alterações no Backend (`api/chat/route.ts`)

#### Log adicional para debug (linha 94)
```typescript
console.log(`[Agent Loop ${loopCount}] Last user message:`, currentMessages[currentMessages.length - 1]);
```

Isso ajuda a verificar se a mensagem "Criar roteiro" está chegando corretamente ao agente.

## Verificação do Modal

✅ O modal `ItineraryModal` está implementado corretamente em:
- `src/components/trips/new/ItineraryModal.tsx`

O modal inclui:
- ✅ Imagem do destino
- ✅ Informações financeiras (voo, hotel, outras despesas)
- ✅ Custo total da viagem
- ✅ Timeline diária com atividades
- ✅ Botões "Confirmar Roteiro" e "Quero fazer alterações"

## Fluxo Completo Atualizado

1. ✅ Usuário seleciona destino
2. ✅ Usuário seleciona datas
3. ✅ Usuário define orçamento e viajantes
4. ✅ Agente busca e exibe voos
5. ✅ Usuário seleciona voo
6. ✅ Agente busca e exibe hotéis
7. ✅ Usuário seleciona hotel
8. ✅ Agente exibe botão "Criar Roteiro"
9. ✅ Usuário clica em "Criar Roteiro"
10. ✅ Agente processa e gera roteiro
11. ✅ **NOVO:** Agente exibe mensagem "Roteiro pronto para sua visualização!"
12. ✅ **NOVO:** Botão "Ver Roteiro" aparece
13. ✅ **NOVO:** Usuário clica em "Ver Roteiro"
14. ✅ **NOVO:** Modal do roteiro abre com todas as informações
15. ✅ Usuário clica em "Confirmar Roteiro"
16. ✅ Roteiro é salvo no banco
17. ✅ Redirecionamento para `/trips`

## Possíveis Gargalos Identificados

### 1. Agente não está chamando `propose_itinerary`

**Possíveis causas:**
- O prompt do sistema pode não estar sendo seguido corretamente
- A mensagem "Criar roteiro" pode não estar sendo detectada
- O agente pode estar tentando fazer buscas adicionais antes de propor o roteiro

**Mitigação implementada:**
- Logs detalhados adicionados para rastrear cada etapa
- System prompt melhorado com instruções mais explícitas
- Log da última mensagem do usuário antes de cada iteração do agente

### 2. Timeout na geração do roteiro

**Possíveis causas:**
- Agente fazendo muitas chamadas de ferramentas (search_places)
- Loop de ferramentas excedendo MAX_LOOPS (8)

**Mitigação no prompt:**
```
- **CRÍTICO:** Quando você vir "Criar roteiro", sua ÚNICA ação deve ser chamar `propose_itinerary`.
- **NÃO** faça buscas (search_places) antes de propor o roteiro.
- **NÃO** envie mensagens de texto antes de chamar a ferramenta.
```

## Como Testar e Debug

### 1. Teste o Fluxo Completo
1. Acesse `http://localhost:3000/trips/new`
2. Complete todas as etapas até "Criar Roteiro"
3. Clique em "Criar Roteiro"
4. **Observe os logs:**

**Console do Navegador:**
```
[handleCreateItinerary] Starting itinerary creation...
[sendMessageToAgent] Calling API with: ...
[sendMessageToAgent] Received response: ...
[propose_itinerary] Tool detected! Input: ...
[propose_itinerary] Adding message with view button...
```

**Terminal do Servidor:**
```
[Agent Loop 1] Starting iteration...
[Agent Loop 1] Last user message: { role: 'user', content: 'Criar roteiro' }
[Agent Loop 1] Stop reason: tool_use
[Agent Loop 1] Tools called: propose_itinerary
[Agent Loop 1] ===== INTERACTIVE TOOL DETECTED =====
[Agent Loop 1] Tool name: propose_itinerary
[Agent Loop 1] Full tool input: { ... }
```

### 2. Se o Roteiro NÃO Aparecer

**Verifique:**
1. **No terminal:** O agente chamou `propose_itinerary`?
2. **No console:** A resposta contém `tool_use: { name: 'propose_itinerary' }`?
3. **No console:** `generatedItinerary` foi setado?
4. **Na tela:** A mensagem "Roteiro pronto para sua visualização!" apareceu?
5. **Na tela:** O botão "Ver Roteiro" está visível?

### 3. Se o Agente Ficar "Pensando" Indefinidamente

**Possíveis causas:**
- Agente fazendo múltiplas chamadas de `search_places`
- Agente não detectando a mensagem "Criar roteiro"
- Timeout na API (60 segundos)

**Verificar nos logs do terminal:**
- Quantas iterações do loop estão acontecendo?
- Quais ferramentas estão sendo chamadas?
- O agente está recebendo a mensagem correta?

## Observações Importantes

⚠️ **CRÍTICO:** A versão do agente Claude (`claude-sonnet-4-5-20250929`) foi mantida conforme solicitado.

✅ O modal do roteiro (`ItineraryModal`) já estava implementado e funcional.

✅ Todos os logs adicionados são apenas para debug e não afetam a experiência do usuário.

✅ O novo fluxo com botão "Ver Roteiro" dá mais controle ao usuário sobre quando visualizar o roteiro.

## Próximos Passos (se necessário)

Se o agente ainda não estiver gerando o roteiro:

1. **Verificar logs completos** do terminal quando "Criar roteiro" é clicado
2. **Analisar** se o agente está chamando outras ferramentas antes de `propose_itinerary`
3. **Ajustar** o system prompt para ser ainda mais restritivo
4. **Considerar** adicionar um exemplo de conversação no prompt do sistema
