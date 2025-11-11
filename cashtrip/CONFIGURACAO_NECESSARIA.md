# ⚙️ Configuração Necessária - Cash Trip

## ✅ Correções Aplicadas

### Dependências Instaladas
- ✅ `@supabase/ssr@^0.7.0` - Cliente Supabase para SSR no Next.js
- ✅ `react-icons@^5.5.0` - Biblioteca de ícones

### Páginas Criadas/Corrigidas
- ✅ `/forgot-password` - Página de recuperação de senha
- ✅ `/reset-password` - Página para redefinir senha
- ✅ `/login` - Página de login com Google e Email
- ✅ `/auth/callback` - Callback OAuth
- ✅ `/` - Página inicial com proteção de rota

## 🔧 Configuração Manual Necessária

### 1. Configurar Variáveis de Ambiente

Você precisa criar o arquivo `.env.local` na raiz do projeto `cashtrip/` com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://iqcjzgfghozcplndpmoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Como obter a chave ANON:**
1. Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/settings/api
2. Copie a chave `anon` `public`
3. Cole no arquivo `.env.local`

### 2. Configurar Google OAuth (Opcional)

Para habilitar login com Google:

1. **No Google Cloud Console:**
   - Acesse: https://console.cloud.google.com/
   - Crie ou selecione um projeto
   - Vá em "APIs e Serviços" → "Credenciais"
   - Crie uma credencial OAuth 2.0
   - Configure as URLs de redirecionamento:
     - `https://iqcjzgfghozcplndpmoo.supabase.co/auth/v1/callback`

2. **No Supabase Dashboard:**
   - Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/auth/providers
   - Vá em Authentication → Providers → Google
   - Ative o provedor Google
   - Cole o Client ID e Client Secret do Google Cloud Console

### 3. Configurar URLs de Redirecionamento no Supabase

No Supabase Dashboard:
1. Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/auth/url-configuration
2. Em "Redirect URLs", adicione:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - `http://localhost:3000` (opcional)

## 🚀 Como Testar

### 1. Iniciar o servidor
```bash
cd cashtrip
npm run dev
```

### 2. Acessar a aplicação
Abra o navegador em: http://localhost:3000

### 3. Testar funcionalidades

**Login com Email (Magic Link):**
- Clique em "Entrar com email"
- Digite um email válido
- Verifique sua caixa de entrada
- Clique no link mágico recebido
- Você será redirecionado para a home logado

**Login com Google (requer configuração):**
- Clique em "Entrar com Google"
- Faça login com sua conta Google
- Você será redirecionado para a home logado

**Recuperação de Senha:**
- Clique em "Esqueci a senha"
- Digite seu email
- Verifique sua caixa de entrada
- Clique no link de recuperação
- Defina uma nova senha
- Você será redirecionado para a home logado

**Logout:**
- Na home, clique em "Sair"
- Você será redirecionado para `/login`

## 📋 Checklist de Configuração

- [ ] Criar arquivo `.env.local` com as 3 variáveis
- [ ] Obter e configurar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configurar Google OAuth (opcional)
- [ ] Adicionar Redirect URLs no Supabase
- [ ] Testar login com email
- [ ] Testar recuperação de senha
- [ ] Testar logout

## ❓ Problemas Comuns

### Erro: "Invalid API key"
- Verifique se o `.env.local` está na raiz do projeto `cashtrip/`
- Verifique se a chave ANON está correta
- Reinicie o servidor após criar/modificar `.env.local`

### Login com Google não funciona
- Verifique se configurou as credenciais OAuth no Google Cloud Console
- Verifique se ativou o provedor Google no Supabase Dashboard
- Verifique se as URLs de redirecionamento estão corretas

### Magic Link não chega
- Verifique sua caixa de spam
- Verifique se o email está configurado corretamente no Supabase
- Em desenvolvimento, os emails podem demorar alguns minutos

### Erro 500 ao acessar páginas
- Verifique se todas as dependências foram instaladas: `npm install`
- Verifique se o arquivo `.env.local` existe e está configurado
- Verifique os logs do console para mais detalhes

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12)
2. Logs do servidor Next.js
3. Dashboard do Supabase em: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo

## 🎯 Próximos Passos

Após configurar tudo:
- [ ] Adicionar logo real do Cash Trip
- [ ] Implementar página de welcome (`/welcome`)
- [ ] Implementar quiz de 25 perguntas
- [ ] Integrar com agente Claude
- [ ] Adicionar middleware para proteção de rotas

