# Página de Gênero do Quiz (Primeira Pergunta)

## Data: 10 de Novembro de 2025

## Descrição

Primeira pergunta real do quiz após o cadastro (email, senha, username). Pergunta sobre identidade de gênero.

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=419-628&t=UAPE6fhcrdI1Pr2d-4)

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
- Progresso: 4% (pergunta 1 de 25)
- Border-radius: Full (pill shape)
- Transição suave de 300ms

#### 2. Textos
**Título Principal:**
- "Como você se identifica?"
- Fonte: Roboto Condensed Bold (700)
- Tamanho: 32px
- Cor: `#FF5F38` (laranja)
- Line-height: 1.17em
- Quebra de linha após "se"

**Subtítulo:**
- "Escolha uma opção que melhor te representa"
- Fonte: Inria Sans Bold (700)
- Tamanho: 16px
- Cor: `#64748B` (cinza azulado)
- Line-height: 1.2em

#### 3. Opções de Gênero
- **3 botões** dispostos verticalmente
- Largura: 212px cada
- Altura: 116px cada
- Gap entre eles: 19px
- Border-radius: 15px

**Estados dos Botões:**
- **Não selecionado:**
  - Background: `#FBFDFF` (branco azulado)
  - Sombra: 0.9px 0.9px 4px rgba(0,0,0,0.25)
  
- **Selecionado:**
  - Background: `rgba(255, 95, 56, 0.25)` (laranja com 25% opacidade)
  - Border: 2px solid `#FF5F38`
  - Sombra: 2px 2px 9px `#FF5F38` (glow effect)

**Ícones:**
- Homem: `/icons/icon-homem.svg`
- Mulher: `/icons/icon-mulher.svg`
- Não-binário: `/icons/icon-não-binário.svg`
- Tamanho: 80x80px

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
- ✅ Barra de progresso dinâmica

## Fontes Adicionadas

### Inria Sans
- Adicionada ao projeto para os subtítulos e botões
- Weights: 400 (Regular), 700 (Bold)
- Fonte do Google Fonts

### Configuração
- `layout.tsx`: Importação e variável CSS
- `globals.css`: Registro no @theme inline do Tailwind

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/username` (após informar nome)

### Saída  
- Vai para: `/quiz/complete` (temporário - será próxima pergunta)

## Armazenamento

### localStorage (Temporário)
- `gender`: "male" | "female" | "non-binary"

*Nota: Todo o quiz será salvo no Supabase ao final*

## Arquivos

### Criados
- `cashtrip/src/app/quiz/gender/page.tsx`
- `cashtrip/docs/QUIZ_GENDER_PAGE.md`

### Modificados
- `cashtrip/src/app/layout.tsx` - Adicionada fonte Inria Sans
- `cashtrip/src/app/globals.css` - Registrada fonte no theme

## Progresso do Quiz

### Cadastro Completo ✅
1. Propósito da viagem
2. Email
3. Senha
4. Username

### Perguntas do Quiz
1. ✅ **Gênero** (página atual)
2. ⏳ Próximas 24 perguntas

## Status
✅ Página criada conforme design Figma  
✅ Barra de progresso implementada  
✅ Validações funcionando  
✅ Fonte Inria Sans configurada  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar as próximas 24 perguntas do quiz
2. Criar página de conclusão
3. Implementar salvamento completo no Supabase
4. Criar sistema de resumo das respostas




