# Página de Username do Quiz

## Data: 10 de Novembro de 2025

## Descrição

Página de captura de nome/username (Etapa 3) que é exibida após o usuário criar sua senha.

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=583-1307&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#FF5F38` (laranja vibrante)
- **Padding**: 20px vertical, responsivo horizontal
- **Estrutura**: Vertical flex com espaçamento de 78px entre seções
- **Dimensões**: 375px largura, 812px altura (mobile)

### Textos
1. **"Etapa 3"**
   - Fonte: Roboto Condensed Bold (700)
   - Tamanho: 40px
   - Cor: Branco
   - Line-height: 1.17em

2. **"Como deseja ser chamado?"**
   - Fonte: Roboto Condensed Medium (500)
   - Tamanho: 32px
   - Cor: Branco
   - Line-height: 1.17em
   - Alinhamento: Centro
   - Quebra de linha após "ser"

### Campo de Username
- Container com fundo branco/20% de opacidade
- Input branco com ícone de usuário laranja
- Largura: 263px
- Altura: 62px
- Padding: 22px 25px
- Border-radius: 2xl (16px)
- Placeholder: "Seu nome"

### Funcionalidades
- ✅ Validação: Campo não pode estar vazio
- ✅ Botão desabilitado até haver texto
- ✅ Suporte para Enter key (submeter ao pressionar Enter)
- ✅ Trim automático (remove espaços extras)
- ✅ Armazenamento temporário no localStorage

### Botão Continuar
- Largura: 232px
- Altura: 61px
- Background: `#1E293B` (azul escuro)
- Border-radius: 40px
- Sombra: 2px 4px 4px rgba(0,0,0,0.25)
- Texto: Roboto Condensed Bold, 20px, branco
- Estados:
  - **Desabilitado**: Opacidade 50% quando campo vazio
  - **Habilitado**: Hover com cor mais clara

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/password` (após criar senha)

### Saída
- Vai para: `/quiz/gender` (primeira pergunta do quiz)

## Validações

1. **Campo obrigatório**: Campo não pode estar vazio
2. **Trim**: Remove espaços em branco no início e fim
3. **Feedback visual**: Botão desabilitado quando inválido
4. **Enter key**: Permite submeter pressionando Enter

## Armazenamento

### localStorage (Temporário)
- `username`: Nome/apelido do usuário

*Nota: Será migrado para Supabase na implementação final*

## Arquivos

### Criados
- `cashtrip/src/app/quiz/username/page.tsx`

### Modificados
- `cashtrip/src/app/quiz/password/page.tsx`
  - Atualizado redirecionamento de `/quiz/gender` → `/quiz/username`

## Fluxo Completo Até Agora

```
/quiz/travel-purpose (Férias/Negócios)
           ↓
    /quiz/email (Email)
           ↓
    /quiz/password (Senha)
           ↓
    /quiz/username (Nome/Username) ← Novo!
           ↓
    /quiz/gender (Primeira pergunta - próxima)
```

## Status
✅ Página criada conforme design Figma  
✅ Validações implementadas  
✅ Suporte para Enter key  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar página `/quiz/gender` (primeira pergunta do quiz)
2. Implementar cadastro completo no Supabase (email + senha + username)
3. Criar sistema de autenticação completo
4. Continuar com as demais perguntas do quiz


