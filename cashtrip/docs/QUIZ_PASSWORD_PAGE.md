# Página de Senha do Quiz

## Data: 10 de Novembro de 2025

## Descrição

Página de criação de senha (Etapa 2) que é exibida após o usuário informar o email.

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=580-1278&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#FF5F38` (laranja vibrante)
- **Padding**: 20px vertical, responsivo horizontal
- **Estrutura**: Vertical flex com espaçamento de 10px

### Textos
1. **"Etapa 2"**
   - Fonte: Roboto Condensed Bold (700)
   - Tamanho: 40px
   - Cor: Branco
   - Line-height: 1.17em

2. **"Crie uma senha"**
   - Fonte: Roboto Condensed Medium (500)
   - Tamanho: 32px
   - Cor: Branco
   - Line-height: 1.17em
   - Alinhamento: Centro

### Campos de Senha
- **2 campos**: Senha e Confirmação de senha
- Container com fundo branco/20% de opacidade
- Input branco com ícones:
  - Ícone de cadeado laranja (lock)
  - Ícone de olho para mostrar/esconder senha
- Largura: 263px cada
- Padding: 22px 25px
- Border-radius: 2xl (16px)

### Funcionalidades
- ✅ Toggle para mostrar/esconder senha
- ✅ Toggle para mostrar/esconder confirmação
- ✅ Validação: senhas devem coincidir
- ✅ Botão desabilitado até senhas coincidirem
- ✅ Armazenamento temporário no localStorage

### Botão Continuar
- Largura: 232px
- Altura: 61px
- Background: `#1E293B` (azul escuro)
- Border-radius: 40px
- Sombra: 2px 4px 4px rgba(0,0,0,0.25)
- Texto: Roboto Condensed Bold, 20px, branco
- Estados:
  - **Desabilitado**: Opacidade 50% quando senhas não coincidem
  - **Habilitado**: Hover com cor mais clara

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/email` (após informar email)

### Saída
- Vai para: `/quiz/gender` (primeira pergunta do quiz)

## Validações

1. **Campos obrigatórios**: Ambos os campos devem estar preenchidos
2. **Senhas coincidentes**: As duas senhas devem ser idênticas
3. **Feedback visual**: Botão desabilitado quando inválido
4. **Alerta**: Exibe mensagem se senhas não coincidirem

## Armazenamento

### localStorage (Temporário)
- `userPassword`: Senha do usuário

*Nota: Será migrado para Supabase na implementação final*

## Arquivos

### Criados
- `cashtrip/src/app/quiz/password/page.tsx`

### Modificados
- `cashtrip/src/app/quiz/email/page.tsx`
  - Atualizado redirecionamento de `/quiz/gender` → `/quiz/password`

## Status
✅ Página criada conforme design Figma  
✅ Validações implementadas  
✅ Toggle de visibilidade de senha  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar página `/quiz/gender` (primeira pergunta do quiz)
2. Implementar cadastro completo no Supabase (email + senha)
3. Adicionar validação de força de senha
4. Implementar autenticação real












