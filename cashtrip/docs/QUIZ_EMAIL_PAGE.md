# Página de Email do Quiz

## Data: 10 de Novembro de 2025

## Descrição

Página de captura de email que é exibida após o usuário selecionar o propósito da viagem (Férias ou Negócios).

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=577-1264&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#FF5F38` (laranja vibrante)
- **Padding**: 100px vertical, responsivo horizontal
- **Estrutura**: Vertical flex com espaçamento de 40px

### Textos
1. **"Vamos começar"**
   - Fonte: Roboto Condensed Bold (700)
   - Tamanho: 40px
   - Cor: Branco
   - Line-height: 1.17em

2. **"Qual seu email?"**
   - Fonte: Roboto Condensed Medium (500)
   - Tamanho: 32px
   - Cor: Branco
   - Line-height: 1.17em
   - Alinhamento: Centro

### Campo de Email
- Container com fundo branco/20% de opacidade
- Input branco com ícone de email laranja
- Largura: 263px
- Padding: 22px 25px
- Border-radius: 2xl (16px)

### Botão Continuar
- Largura: 232px
- Altura: 61px
- Background: `#1E293B` (azul escuro)
- Border-radius: 40px
- Sombra: 2px 4px 4px rgba(0,0,0,0.25)
- Texto: Roboto Condensed Bold, 20px, branco

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/travel-purpose` (após selecionar Férias ou Negócios)

### Saída
- Vai para: `/quiz/gender` (primeira pergunta do quiz)

## Arquivo Criado
- `cashtrip/src/app/quiz/email/page.tsx`

## Arquivos Modificados
- `cashtrip/src/app/quiz/travel-purpose/page.tsx`
  - Atualizado redirecionamento de `/quiz/gender` → `/quiz/email`

## Status
✅ Página criada conforme design Figma  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar página `/quiz/gender` (primeira pergunta do quiz)
2. Adicionar validação de email
3. Salvar email no Supabase











