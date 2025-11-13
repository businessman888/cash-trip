# Página de Idade do Quiz (Terceira Pergunta)

## Data: 10 de Novembro de 2025

## Descrição

Terceira pergunta do quiz: faixa etária do usuário.

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=424-366&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#F1F1F1` (cinza claro)
- **Padding**: 25px topo, 16px laterais, 80px fundo
- **Estrutura**: Vertical flex com espaçamento de 10px

### Componentes

#### 1. Barra de Progresso
- Largura: 325px
- Altura: 31px
- Background: Branco
- Preenchimento: Gradiente de `#FF5F38` para `#FF896F`
- Progresso: 12% (pergunta 3 de 25)
- Border-radius: Full (pill shape)
- Transição suave de 300ms

#### 2. Textos
**Título Principal:**
- "Qual a sua idade?"
- Fonte: Roboto Condensed Bold (700)
- Tamanho: 32px
- Cor: `#FF5F38` (laranja)
- Line-height: 1.17em
- Quebra de linha após "sua"

**Subtítulo:**
- "Escolha uma opção que melhor te representa"
- Fonte: Inria Sans Bold (700)
- Tamanho: 16px
- Cor: `#64748B` (cinza azulado)
- Line-height: 1.2em

#### 3. Opções de Idade (Grid Layout)
- **Container**: 416px altura, gap 10px entre linhas
- **Layout em 3 linhas**:
  - Linha 1: 2 opções (156px cada)
  - Linha 2: 2 opções (156px cada)
  - Linha 3: 1 opção maior (316px)

**Faixas Etárias:**
1. 18 a 25 anos
2. 26 a 35 anos
3. 36 a 45 anos
4. 46 a 55 anos
5. Acima de 56 anos

**Design dos Botões:**
- Altura: 124px cada
- Border-radius: 20px
- Border: 2px
- Fonte: Inria Sans Bold, 18px
- Alinhamento: Centro

**Estados:**
- **Não selecionado:**
  - Background: Branco
  - Border: `#1E293B` (azul escuro)
  - Texto: `#1E293B`
  
- **Selecionado:**
  - Background: `rgba(255, 95, 56, 0.25)` (laranja 25% opacidade)
  - Border: 2px solid `#E6502C`
  - Texto: `#E6502C` (laranja escuro)
  - Sombra: 0.9px 0.9px 9px rgba(255,95,56,0.6)

#### 4. Botão "Próxima pergunta"
- Largura: 240px
- Altura: 51px
- Background: `#FF896F` (laranja claro)
- Border-radius: 30px
- Texto: Inria Sans Bold, 20px, branco
- Ícone de seta à direita
- Estados:
  - **Desabilitado**: Opacidade 50% quando nada selecionado
  - **Habilitado**: Hover com cor mais escura

## Funcionalidades

- ✅ Seleção única (radio button behavior)
- ✅ Validação: Deve selecionar uma opção para continuar
- ✅ Feedback visual imediato na seleção
- ✅ Botão desabilitado até selecionar
- ✅ Armazenamento no localStorage
- ✅ Barra de progresso dinâmica (12%)
- ✅ Layout em grid responsivo

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/location` (após informar cidade e estado)

### Saída  
- Vai para: `/quiz/complete` (temporário - será próxima pergunta)

## Armazenamento

### localStorage (Temporário)
- `age`: "18-25" | "26-35" | "36-45" | "46-55" | "56+"

*Nota: Todo o quiz será salvo no Supabase ao final*

## Arquivos

### Criados
- `cashtrip/src/app/quiz/age/page.tsx`
- `cashtrip/docs/QUIZ_AGE_PAGE.md`

### Modificados
- `cashtrip/src/app/quiz/location/page.tsx`
  - Atualizado redirecionamento para `/quiz/age`

## Progresso do Quiz

### Perguntas Concluídas
1. ✅ **Gênero** (página 1)
2. ✅ **Localização** (página 2)
3. ✅ **Idade** (página 3 - atual)
4. ⏳ Próximas 22 perguntas

## Design Pattern

Esta página estabelece o padrão de grid para opções múltiplas:
- Grid 2 colunas para opções regulares
- Opção full-width para última alternativa
- Espaçamento consistente
- Estados visuais claros

## Status
✅ Página criada conforme design Figma  
✅ Barra de progresso atualizada (12%)  
✅ Layout em grid implementado  
✅ Validações funcionando  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar as próximas 22 perguntas do quiz
2. Criar página de conclusão
3. Implementar salvamento completo no Supabase
4. Padronizar componentes reutilizáveis para perguntas




