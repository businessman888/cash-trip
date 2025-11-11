# Implementação da Página de Login Cash Trip

## 1. Configurar Supabase Auth

### 1.1. Instalar dependências

- Adicionar `@supabase/ssr` para autenticação no Next.js App Router
- Confirmar que `@supabase/supabase-js` já está instalado

### 1.2. Configurar variáveis de ambiente

- Verificar se `.env.local` existe com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Adicionar URL de callback: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

### 1.3. Criar cliente Supabase para Server Components

- Arquivo `src/lib/supabase/server.ts` com `createServerClient` para uso em Server Components/Actions
- Arquivo `src/lib/supabase/client.ts` com `createBrowserClient` para Client Components

### 1.4. Configurar Supabase Auth no painel

- Documentar necessidade de ativar Google OAuth no dashboard Supabase
- Documentar configuração de redirect URLs (`http://localhost:3000/auth/callback`)

## 2. Estruturar pastas e componentes

### 2.1. Criar estrutura de diretórios

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx (página de login)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts (handler OAuth)
│   └── forgot-password/
│       └── page.tsx (recuperação senha)
├── components/
│   └── auth/
│       ├── LoginForm.tsx (formulário principal)
│       └── GoogleButton.tsx (botão Google)
│       └── EmailButton.tsx (botão Email)
└── lib/
    └── supabase/ (já criado)
```

### 2.2. Ajustar fontes no layout

- Trocar Geist por Roboto Condensed (conforme Figma)
- Configurar no `layout.tsx` usando `next/font/google`

## 3. Implementar página de login

### 3.1. Criar `src/app/login/page.tsx`

- Background gradient ou cor sólida conforme Figma
- Container centralizado com logo, texto e botões
- Texto: "Sua próxima aventura começa aqui" (fonte Roboto Condensed 900, 48px)
- Layout responsivo mobile-first

### 3.2. Criar componente `GoogleButton.tsx`

- Botão com fundo `#1E293B`, border-radius 40px, sombra
- Ícone do Google usando `react-icons` (FcGoogle)
- Texto "Entrar com Google" (Roboto Condensed 900, 20px, branco)
- Ao clicar: chamar `supabase.auth.signInWithOAuth({ provider: 'google' })`

### 3.3. Criar componente `EmailButton.tsx`

- Botão com fundo `rgba(255, 95, 56, 0.6)`, borda `#FF5F38` 3px, border-radius 40px
- Ícone de email usando `react-icons` (MdEmail)
- Texto "Entrar com email" (Roboto Condensed 900, 20px, branco)
- Ao clicar: abrir modal/form para input de email + enviar magic link

### 3.4. Implementar Magic Link por email

- Input de email com validação
- Chamar `supabase.auth.signInWithOtp({ email })`
- Mostrar mensagem de sucesso: "Verifique seu email"
- Tratamento de erros

### 3.5. Links "Esqueci a senha" e "Cadastrar-se"

- "Esqueci a senha" (Roboto Condensed 400, 16px, branco) → link para `/forgot-password`
- "Cadastrar-se" (Roboto Condensed 900, 16px, `#E6502C`) → mesma página (Supabase cria conta automaticamente)

## 4. Implementar callback OAuth

### 4.1. Criar `src/app/auth/callback/route.ts`

- Route Handler para processar retorno do Google OAuth
- Trocar código por sessão usando `supabase.auth.exchangeCodeForSession(code)`
- Redirecionar para home (`/`) após sucesso
- Tratar erros de autenticação

## 5. Implementar página "Esqueci a senha"

### 5.1. Criar `src/app/forgot-password/page.tsx`

- Layout similar à página de login
- Input de email
- Botão "Enviar link de recuperação"
- Chamar `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/reset-password' })`
- Mensagem de confirmação

### 5.2. Criar página de reset (placeholder)

- Criar `src/app/reset-password/page.tsx` com form para nova senha
- Implementar `supabase.auth.updateUser({ password: newPassword })`

## 6. Ajustes finais

### 6.1. Atualizar `src/app/page.tsx`

- Remover conteúdo de teste do Supabase
- Verificar se usuário está logado
- Se sim: mostrar "Bem-vindo, [nome]" + botão logout
- Se não: redirecionar para `/login`

### 6.2. Criar componente de Logout

- Botão que chama `supabase.auth.signOut()`
- Redirecionar para `/login` após logout

### 6.3. Metadata e SEO

- Atualizar `layout.tsx` com metadata do Cash Trip
- Título: "Cash Trip - Sua próxima aventura"
- Descrição conforme projeto

### 6.4. Estilização Tailwind

- Garantir cores do tema (#1E293B, #FF5F38, #E6502C)
- Responsividade mobile/desktop
- Hover states nos botões

## 7. Testes e validações

- Testar login com Google (mock se OAuth não configurado)
- Testar magic link por email
- Testar fluxo de recuperação de senha
- Validar redirecionamentos
- Verificar tratamento de erros

## Checklist de Implementação

- [ ] Configurar Supabase Auth (cliente SSR, variáveis ambiente, callbacks)
- [ ] Criar estrutura de pastas (login, auth/callback, forgot-password, components/auth)
- [ ] Implementar página de login com design do Figma (Google + Email buttons)
- [ ] Implementar fluxos de autenticação (OAuth callback, Magic Link, recuperação senha)
- [ ] Atualizar página inicial para verificar sessão e redirecionar conforme estado


