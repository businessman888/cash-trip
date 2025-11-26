# Atualização do Carrossel de Métricas - Dashboard

## Resumo das Alterações

O carrossel de métricas da dashboard foi atualizado para corresponder exatamente ao design do Figma, com melhorias na interatividade e visual.

## Mudanças Implementadas

### 1. **Setas de Navegação Sempre Visíveis**

**Antes:**
- Setas apareciam/desapareciam condicionalmente
- Seta esquerda só aparecia quando `currentMetricIndex > 0`
- Seta direita só aparecia quando `currentMetricIndex < 2`

**Depois:**
- Ambas as setas estão **sempre visíveis**
- Setas ficam desabilitadas (opacidade 40%) quando não podem ser usadas
- Melhor feedback visual para o usuário

### 2. **Posicionamento das Setas**

**Antes:**
- Setas posicionadas com `position: absolute` sobre o card
- Usavam `left-2` e `right-2` com `top-1/2 -translate-y-1/2`

**Depois:**
- Layout flexbox com `gap-3`
- Setas nas laterais do card (não sobrepostas)
- Melhor alinhamento e espaçamento

### 3. **Estilo dos Cards**

**Antes:**
- Texto centralizado (`text-center`, `items-center`)
- Altura mínima de 180px
- Tamanho de fonte: título `text-lg`, valor `text-3xl`, porcentagem `text-sm`

**Depois:**
- Texto alinhado à esquerda (`justify-center` apenas verticalmente)
- Altura mínima de 160px (mais compacto)
- Tamanhos ajustados:
  - Título: `text-[14px]`
  - Valor: `text-[28px]`
  - Porcentagem: `text-[12px]`
- Espaçamento melhorado com `gap-1` e `mb-3`

### 4. **Texto e Formatação**

**Antes:**
- "Gasto total"
- "Média por Viagem" (V maiúsculo)
- "Viagens Realizadas" (V e R maiúsculos)
- Apenas número para viagens

**Depois:**
- "Gasto total" (minúsculo)
- "Média por viagem" (minúsculo)
- "Viagens realizadas" (minúsculo)
- Número + " viagens" para o terceiro card

### 5. **Tamanho dos Ícones**

**Antes:**
- Ícones das setas: `size={20}`

**Depois:**
- Ícones das setas: `size={16}` (mais proporcionais)

### 6. **Animação de Transição**

**Antes:**
```tsx
transform: `translateX(calc(-${currentMetricIndex} * (100% + 20px)))`
```
- Considerava gap de 20px entre cards

**Depois:**
```tsx
transform: `translateX(-${currentMetricIndex * 100}%)`
```
- Transição mais simples e suave
- Sem gap entre cards (cards ocupam 100% da largura)

## Código Atualizado

### Estrutura do Carrossel

```tsx
<div className="relative w-full max-w-[343px] mx-auto flex items-center gap-3">
  {/* Botão Anterior - Sempre visível */}
  <button
    onClick={prevMetric}
    disabled={currentMetricIndex === 0}
    className="flex-shrink-0 w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#E6502C] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <FaChevronLeft size={16} />
  </button>

  {/* Container do Card */}
  <div className="flex-1 overflow-hidden rounded-[20px]">
    <div
      className="flex transition-transform duration-300 ease-in-out"
      style={{ transform: `translateX(-${currentMetricIndex * 100}%)` }}
    >
      {/* Cards aqui */}
    </div>
  </div>

  {/* Botão Próximo - Sempre visível */}
  <button
    onClick={nextMetric}
    disabled={currentMetricIndex === 2}
    className="flex-shrink-0 w-10 h-10 bg-[#FF5F38] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#E6502C] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <FaChevronRight size={16} />
  </button>
</div>
```

### Estrutura de Cada Card

```tsx
<div 
  className="min-w-full rounded-[20px] p-6 flex flex-col justify-center min-h-[160px]" 
  style={{ background: 'var(--surface-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--color-border)' }}
>
  <h3 className="font-bold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
    Gasto total
  </h3>
  <div className="flex flex-col gap-1">
    <span className="font-bold text-[28px]" style={{ color: 'var(--text-primary)' }}>
      {formatCurrency(metrics.totalSpent)}
    </span>
    <span className="text-[#10B981] font-bold text-[12px]">
      +{metrics.totalSpentChange}%
    </span>
  </div>
</div>
```

## Compatibilidade com Dark Mode

✅ **Totalmente compatível** - Todas as cores usam variáveis CSS:
- `var(--surface-card)` - Fundo dos cards
- `var(--color-border)` - Borda dos cards
- `var(--text-secondary)` - Títulos
- `var(--text-primary)` - Valores principais
- `#10B981` - Verde para porcentagens (fixo)
- `#FF5F38` - Laranja para setas (fixo)

## Responsividade

✅ **Totalmente responsivo**:
- Container com `max-w-[343px]` centralizado
- Cards com `min-w-full` para ocupar 100% do container
- Setas com `flex-shrink-0` para manter tamanho fixo
- Gap de `12px` (gap-3) entre setas e card

## Estados de Interação

### Setas Habilitadas
- Cor de fundo: `#FF5F38`
- Hover: `#E6502C`
- Cursor: `pointer`
- Opacidade: `100%`

### Setas Desabilitadas
- Cor de fundo: `#FF5F38`
- Opacidade: `40%`
- Cursor: `not-allowed`
- Não respondem a hover

## Como Testar

1. **Acesse**: http://localhost:3000/dashboard
2. **Verifique**:
   - ✅ Ambas as setas estão sempre visíveis
   - ✅ Seta esquerda desabilitada no primeiro card
   - ✅ Seta direita desabilitada no terceiro card
   - ✅ Transição suave ao navegar
   - ✅ Cards com texto alinhado à esquerda
   - ✅ Tamanhos de fonte corretos
   - ✅ "viagens" aparece após o número no terceiro card
3. **Teste Dark Mode**:
   - ✅ Toggle dark mode
   - ✅ Verifique se os cards mudam de cor
   - ✅ Verifique se o texto permanece legível
4. **Teste Responsividade**:
   - ✅ Redimensione a janela
   - ✅ Verifique se o carrossel se mantém centralizado
   - ✅ Verifique se as setas não quebram o layout

## Conformidade com Figma

✅ Setas laranjas sempre visíveis
✅ Setas nas laterais (não sobrepostas)
✅ Cards com fundo claro/escuro conforme tema
✅ Texto alinhado à esquerda
✅ Tamanhos de fonte corretos
✅ Espaçamento e padding adequados
✅ Porcentagens em verde
✅ Altura dos cards reduzida
✅ Texto em minúsculas
