# Página: Ritmo de Viagem - Quiz (Pergunta 6/25)

## 📍 Localização
- **Rota**: `/quiz/travel-pace`
- **Arquivo**: `src/app/quiz/travel-pace/page.tsx`
- **Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=442-386)

---

## 🎯 Objetivo

Capturar a preferência do usuário quanto ao ritmo de suas viagens, identificando se prefere um estilo mais agitado (cheio de atividades), equilibrado ou tranquilo/zen.

---

## 📊 Fluxo de Navegação

```
/quiz/traveler-type  →  /quiz/travel-pace  →  /quiz/[próxima pergunta]
   (Pergunta 5)          (Pergunta 6)          (Pergunta 7 - a criar)
```

---

## 🎨 Design Especificações

### Background
- Cor: `#F1F1F1` (cinza claro)

### Barra de Progresso
- **Tipo**: Horizontal com texto descritivo
- **Dimensões**: 325x41px
- **Texto**: "Conhecimento sobre você"
- **Porcentagem**: 40%
- **Progresso visual**: 90px de 325px (~27.7%)
- **Cores**:
  - Background: `rgba(100,116,139,0.1)`
  - Fill: Gradiente `#FF896F` → `#FF5F38` → `#E6502C`
- **Posicionamento**:
  - Texto: left-0, top-3px, `#64748B`, Roboto 15px
  - Porcentagem: right-0, top-3px, `#E6502C`, Roboto Bold 10px
  - Barra: top-26px, height 4px

### Pergunta Principal
- **Título**: "Qual é o ritmo ideal das suas viagens?"
- **Fonte**: Roboto Condensed Bold
- **Tamanho**: 36px
- **Cor**: `#FF5F38`
- **Linhas**: 3 linhas quebradas
- **Alinhamento**: Centro

### Subtítulo
- **Texto**: "Escolha a que melhor define"
- **Fonte**: Roboto Condensed SemiBold
- **Tamanho**: 24px
- **Cor**: `#64748B`
- **Gap do título**: 30px

---

## 🃏 Cards de Opções

### Dimensões e Layout
- **Tamanho**: 335x172px
- **Border-radius**: 20px
- **Border**: 3px
- **Gap entre cards**: 28px
- **Layout**: Vertical (3 cards)

### Estrutura Interna
```
┌─────────────────────────────────────┐
│  [Badge Check]     (se selecionado) │
│                                     │
│  ┌──────┐  Agitado                 │
│  │      │  (Máximo de atividades...) │
│  │ Icon │                           │
│  │      │                           │
│  └──────┘                           │
└─────────────────────────────────────┘
```

- **Ícone**: 90x90px, posicionado à esquerda (left: 0, top: 0)
- **Textos** (à direita do ícone):
  - Label principal: left-105px, top-15px
  - Descrição: left-105px, top-57px

### Estados Visuais

#### Não Selecionado
```css
background: #FFFFFF
border: 3px solid #1E293B
color: #1E293B
hover: shadow-lg
```

#### Selecionado
```css
background: rgba(230, 80, 44, 0.3)
border: 3px solid #FF5F38
box-shadow: 2px 2px 9px 0px rgba(255, 95, 56, 1)
color: #E6502C
```

**Badge de Check (quando selecionado)**:
- Tamanho: 40x40px
- Background: `#E6502C`
- Border-radius: 50% (círculo)
- Box-shadow: 0.6px 0.6px 4px rgba(230, 80, 44, 1)
- Ícone: Check branco, 24x24px
- Posição: top-7px, right-3px

---

## ✅ 3 Opções de Ritmo

### 1. Agitado
- **ID**: `"agitado"`
- **Label**: "Agitado"
- **Descrição**: "(Máximo de atividades por dia)"
- **Ícone**: `Icon-agitado.svg`
- **Fonte Label**: Roboto Condensed ExtraBold (800), 32px
- **Fonte Descrição**: Roboto Condensed Regular (400), 13px

### 2. Equilibrado
- **ID**: `"equilibrado"`
- **Label**: "Equilibrado"
- **Descrição**: "(Mescla atividades e pausas)"
- **Ícone**: `icon-Equilibrado.svg`
- **Fonte Label**: Roboto Condensed ExtraBold (800), 32px
- **Fonte Descrição**: Roboto Condensed Regular (400), 13px

### 3. Tranquilo/zen
- **ID**: `"tranquilo"`
- **Label**: "Tranquilo/zen"
- **Descrição**: "(Tempo livre, poucas atividades)"
- **Ícone**: `Icon-Tranquilo-Zen.svg`
- **Fonte Label**: Roboto Condensed ExtraBold (800), 32px
- **Fonte Descrição**: Roboto Condensed Regular (400), 13px

---

## 🎯 Botão Flutuante

### Padrão Circular no Canto Direito

```css
position: fixed
bottom: 1rem (16px)
right: 1rem (16px)
width: 80px
height: 80px
border-radius: 9999px (círculo perfeito)
background: linear-gradient(180deg, #FF896F 0%, #FF5F38 50%, #E6502C 100%)
box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25)
z-index: 50
```

**Conteúdo**:
- Apenas ícone de seta (sem texto)
- Tamanho do ícone: 50x28px
- Botão circular: 80x80px
- Alinhamento: flex items-center justify-center
- Hover: scale(1.1)

**SVG da Seta**:
```svg
<svg width="50" height="28" viewBox="0 0 50 28">
  <path 
    d="M9.375 12.438H31.25M31.25 12.438L29.688 1.49M31.25 12.438L14.094 24.949" 
    stroke="white" 
    strokeWidth="3.125" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
</svg>
```

**Comportamento**:
- Aparece apenas quando uma opção é selecionada
- Hover aumenta o tamanho em 10%
- Transição suave

---

## 💾 Armazenamento

### localStorage (Temporário)

```typescript
localStorage.setItem("travelPace", selected);

// Valores possíveis:
// "agitado"
// "equilibrado"  
// "tranquilo"
```

### Supabase (Futuro)

```sql
-- Tabela: user_profiles
travel_pace TEXT CHECK (travel_pace IN ('agitado', 'equilibrado', 'tranquilo'))
```

---

## 🔄 Interatividade

### Seleção Única
```typescript
const [selected, setSelected] = useState<TravelPace | null>(null);

const handleSelect = (pace: TravelPace) => {
  setSelected(pace);
};
```

### Navegação
```typescript
const handleContinue = () => {
  if (!selected) return;
  
  localStorage.setItem("travelPace", selected);
  router.push("/quiz/complete"); // Temporário - próxima pergunta
};
```

---

## 🎨 Filtro CSS para Ícone Laranja

```css
filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%);
```

Aplicado apenas quando o card está selecionado.

---

## 📱 Responsividade

- Layout fixo em 375px (mobile-first)
- Cards centralizados
- Padding lateral: 16px (4)
- Padding vertical: 36px no container principal

---

## 🧩 Componentes Utilizados

### Externos
- `next/navigation` - useRouter
- `next/image` - Image
- `react` - useState

### Internos
- `@/lib/quiz-icons` - QUIZ_ICONS (índice de ícones)

---

## ✨ Diferenciais desta Página

1. **Botão flutuante circular**: Botão circular de 80x80px no canto inferior direito (apenas ícone, sem texto)
2. **Badge de check**: Indicador visual circular no canto do card selecionado
3. **Layout horizontal**: Ícone + textos lado a lado (vs. ícone em cima + texto embaixo)
4. **Descrições**: Cada opção tem um subtexto explicativo entre parênteses
5. **Cards maiores**: 335x172px com layout horizontal diferenciado

---

## 🔗 Integração com Sistema

### Entrada
- Vem de: `/quiz/traveler-type`
- Condição: Usuário selecionou tipo(s) de viajante
- Dados disponíveis: `localStorage.travelerType`

### Saída
- Vai para: `/quiz/complete` (temporário)
- Futuro: `/quiz/accommodation` (próxima pergunta sobre hospedagens)
- Dados salvos: `localStorage.travelPace`

---

## 📊 Progresso no Quiz

- **Pergunta**: 6 de 25
- **Porcentagem**: 24%
- **Nível**: 2 (Perfil de Viajante)
- **Progresso do Nível 2**: 40% (2 de 5 perguntas básicas)

---

## 🐛 Possíveis Melhorias Futuras

1. **Animação de transição** entre cards ao selecionar
2. **Som de feedback** ao clicar (opcional, acessibilidade)
3. **Tooltip** nos ícones explicando cada estilo
4. **Preview** do que significa cada ritmo (exemplos de roteiros)
5. **Botão de voltar** para página anterior
6. **Salvamento automático** no Supabase ao invés de localStorage
7. **Analytics** para tracking de escolhas mais populares

---

## 📝 Notas de Implementação

### Decisões Tomadas
1. **Seleção única** (vs. múltipla escolha da página anterior)
2. **Botão flutuante simplificado** para variar o padrão visual
3. **Layout horizontal** para aproveitar melhor o espaço dos cards
4. **Descrições curtas** para não poluir visualmente

### Padrões Seguidos
- Mesma barra de progresso do tipo 2 (Nível 2)
- Cores consistentes com o design system
- Transições suaves (300ms)
- Estados claros (hover, selected, disabled)
- Acessibilidade (botões semânticos, alt text em imagens)

---

**Criado**: 11 de Novembro de 2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e funcionando

