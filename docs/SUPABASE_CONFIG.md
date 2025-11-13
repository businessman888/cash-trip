# Configuração do Supabase para Cash Trip

## 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://iqcjzgfghozcplndpmoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Configurar Google OAuth no Supabase Dashboard

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto: `iqcjzgfghozcplndpmoo`
3. Vá em **Authentication** → **Providers**
4. Ative o **Google** provider
5. Configure as credenciais OAuth do Google:
   - Acesse o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou use um existente
   - Ative a Google+ API
   - Crie credenciais OAuth 2.0
   - Adicione as URIs de redirecionamento:
     - `https://iqcjzgfghozcplndpmoo.supabase.co/auth/v1/callback`
   - Copie o Client ID e Client Secret para o Supabase

## 3. Configurar URLs de Redirecionamento

No painel do Supabase, vá em **Authentication** → **URL Configuration**:

1. **Site URL**: `http://localhost:3000`
2. **Redirect URLs**: Adicione as seguintes URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`

Para produção, adicione também:
   - `https://seu-dominio.com/auth/callback`
   - `https://seu-dominio.com/reset-password`

## 4. Configurar Email Templates (Opcional)

Personalize os templates de email em **Authentication** → **Email Templates**:

- **Confirm signup**: Email de confirmação de cadastro
- **Magic Link**: Email com link mágico para login
- **Change Email Address**: Email de confirmação de mudança de email
- **Reset Password**: Email de recuperação de senha

## 5. Testar a Configuração

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:3000/login`

4. Teste os fluxos:
   - Login com Google (requer OAuth configurado)
   - Login com Email (Magic Link)
   - Recuperação de senha

## 6. Estrutura de Autenticação

O projeto usa Supabase Auth com:
- **Google OAuth**: Login social com conta Google
- **Magic Link**: Login passwordless por email
- **Password Reset**: Recuperação de senha por email

### Arquivos Principais:
- `src/lib/supabase/server.ts`: Cliente Supabase para Server Components
- `src/lib/supabase/client.ts`: Cliente Supabase para Client Components
- `src/app/auth/callback/route.ts`: Handler de callback OAuth
- `src/app/login/page.tsx`: Página de login
- `src/app/forgot-password/page.tsx`: Recuperação de senha
- `src/app/reset-password/page.tsx`: Definir nova senha

## 7. Próximos Passos

Após configurar a autenticação:
1. Criar página de boas-vindas (`/welcome`)
2. Implementar quiz de 25 perguntas
3. Integrar com o agente Claude para perfil do usuário
4. Construir fluxo de planejamento de viagem

## Troubleshooting

### Erro: "Invalid redirect URL"
- Verifique se as URLs de redirecionamento estão configuradas corretamente no painel do Supabase
- Certifique-se de que `NEXT_PUBLIC_SITE_URL` está correto no `.env.local`

### Erro: "OAuth provider not enabled"
- Ative o provider Google no painel do Supabase
- Configure as credenciais OAuth corretamente

### Magic Link não chega no email
- Verifique a caixa de spam
- Confirme que o email provider está configurado no Supabase (por padrão usa o servidor do Supabase)
- Para produção, configure um provedor SMTP customizado

## Recursos

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js SSR Authentication](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)







