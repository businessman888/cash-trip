# 🚀 Cash Trip - Roadmap Completo de Implementação

---

## 🎯 METODOLOGIA RECOMENDADA

### ❌ Abordagem ERRADA (Não faça assim):
```
1. Importar TODAS as telas do Figma de uma vez
2. Tentar fazer tudo funcionar junto
3. Adicionar banco depois
4. Adicionar segurança no final
```
**Problema:** Vira bagunça, bugs difíceis de achar, inseguro.

### ✅ Abordagem CORRETA (Siga esta):
```
1. Setup inicial (fundação segura)
2. Uma funcionalidade COMPLETA por vez
3. Testar cada funcionalidade antes da próxima
4. Banco de dados desde o DIA 1
5. Segurança em CADA etapa
```
**Vantagem:** Organizado, testável, seguro desde o início.

---

## 🏗️ ARQUITETURA GERAL (Visão Macro)

```
┌─────────────────────────────────────────────────────┐
│                  CASH TRIP                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FRONTEND (React Native)                            │
│  ├─ Telas do Figma                                  │
│  ├─ Componentes reutilizáveis                      │
│  ├─ Navegação                                       │
│  └─ Estado global (Context/Redux)                  │
│                                                     │
│  BACKEND (Node.js + Express)                        │
│  ├─ API REST                                        │
│  ├─ Autenticação (JWT)                             │
│  ├─ Agente IA (Anthropic/Gemini)                   │
│  ├─ Integrações (Booking, Skyscanner)              │
│  └─ Function calling                               │
│                                                     │
│  DATABASE (Supabase) ✅ Recomendado                │
│  ├─ PostgreSQL                                      │
│  ├─ Auth integrada                                  │
│  ├─ Storage (imagens)                              │
│  └─ Realtime (chat)                                │
│                                                     │
│  PAGAMENTOS (Stripe)                                │
│  STORAGE (Cloudinary ou Supabase)                  │
│  DEPLOY (Railway.app ou Vercel)                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 SUPABASE vs GOOGLE CLOUD

### Supabase ✅ RECOMENDO FORTEMENTE

**Vantagens:**
```
✅ PostgreSQL (melhor que Firebase)
✅ Auth pronta (Google, Apple, Email)
✅ Storage integrado (upload de imagens)
✅ Realtime (chat, notificações)
✅ Row Level Security (segurança automática)
✅ Free tier generoso (50k usuários)
✅ Dashboard visual (fácil de gerenciar)
✅ SDK para React Native pronto
✅ Backups automáticos
```

**Custos:**
```
Free: Até 500MB database + 1GB storage
Pro: $25/mês (suficiente até 10k usuários)
```

### Google Cloud (Firebase/Cloud SQL)

**Vantagens:**
```
✅ Escala infinita
✅ Infraestrutura robusta
✅ Analytics integrado
```

**Desvantagens:**
```
❌ Mais complexo de configurar
❌ Mais caro ($50-100/mês começando)
❌ Curva de aprendizado maior
❌ Vendor lock-in forte
```

### 🎯 Decisão: **SUPABASE**

Por quê:
- Mais rápido pra começar (2 dias vs 2 semanas)
- Mais barato inicial
- Easier de gerenciar
- Migrar depois é possível se precisar

---

## 🗓️ ROADMAP COMPLETO (12 Semanas)

### **FASE 1: FUNDAÇÃO (Semanas 1-2)**

#### Semana 1: Setup Inicial

**Dia 1-2: Ambiente de Desenvolvimento**
```
[ ] Instalar Node.js (v18+)
[ ] Instalar Cursor
[ ] Configurar Git
[ ] Criar repositório GitHub privado
[ ] Instalar React Native CLI
[ ] Configurar Android Studio / Xcode
```

**Dia 3-4: Setup Supabase**
```
[ ] Criar conta em supabase.com
[ ] Criar novo projeto: "cashtrip-production"
[ ] Pegar URL e anon key
[ ] Configurar tabelas iniciais:
    - users
    - profiles
    - trips
    - bookings
[ ] Configurar Row Level Security (RLS)
```

**Dia 5-7: Setup Projeto React Native**
```bash
# No Cursor:
npx react-native init CashTrip
cd CashTrip

# Instalar dependências base:
npm install @supabase/supabase-js
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-dotenv
npm install axios
```

**Estrutura de Pastas:**
```
CashTrip/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── screens/         # Telas do Figma
│   ├── navigation/      # Navegação
│   ├── services/        # APIs, Supabase, etc
│   ├── context/         # Estado global
│   ├── utils/           # Funções úteis
│   ├── constants/       # Cores, tamanhos, etc
│   ├── locales/         # Traduções (pt-BR, en-US)
│   └── assets/          # Imagens, fontes
├── backend/
│   ├── src/
│   │   ├── routes/      # Endpoints
│   │   ├── services/    # Lógica de negócio
│   │   ├── middleware/  # Auth, validação
│   │   └── config/      # Configurações
│   └── .env
└── .env
```

---

#### Semana 2: Backend Base + Segurança

**Dia 1-2: Setup Backend**
```bash
mkdir backend
cd backend
npm init -y

# Dependências:
npm install express
npm install @supabase/supabase-js
npm install dotenv
npm install cors
npm install helmet          # Segurança
npm install express-rate-limit  # Rate limiting
npm install bcrypt          # Criptografia
npm install jsonwebtoken    # JWT
npm install joi             # Validação
```

**Dia 3-5: Implementar Segurança Base**

**Arquivo: backend/src/middleware/security.js**
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// 1. HELMET: Protege headers HTTP
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
});

// 2. RATE LIMITING: Previne spam/DDoS
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Muitas requisições, tente novamente mais tarde.',
});

// 3. CORS: Só permite seu app
export const corsOptions = {
  origin: process.env.FRONTEND_URL, // Só seu domínio
  credentials: true,
  optionsSuccessStatus: 200
};

// 4. INPUT SANITIZATION: Previne XSS
export function sanitizeInput(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}

// 5. VALIDAÇÃO DE DADOS
import Joi from 'joi';

export const quizSchema = Joi.object({
  P1: Joi.string().valid('Homem', 'Mulher', 'Não-binário', 'Outro').required(),
  P2: Joi.string().min(2).max(100).required(),
  P3: Joi.number().integer().min(18).max(120).required(),
  // ... validar todas as 25 perguntas
});
```

**Arquivo: backend/src/middleware/auth.js**
```javascript
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service key no backend!
);

// Middleware de autenticação
export async function authenticateUser(req, res, next) {
  try {
    // Pegar token do header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    
    // Verificar token no Supabase
    const { data: user, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    // Adicionar user no request
    req.user = user;
    next();
    
  } catch (error) {
    res.status(500).json({ error: 'Erro de autenticação' });
  }
}
```

**Arquivo: backend/src/index.js**
```javascript
import express from 'express';
import cors from 'cors';
import { securityHeaders, limiter, corsOptions } from './middleware/security.js';
import { authenticateUser } from './middleware/auth.js';

const app = express();

// 1. SEGURANÇA (primeira coisa!)
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(limiter);

// 2. PARSERS
app.use(express.json({ limit: '10mb' })); // Limita tamanho do body

// 3. ROTAS PÚBLICAS (sem auth)
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// 4. ROTAS PRIVADAS (com auth)
app.use('/api', authenticateUser); // Todas rotas /api precisam auth

app.post('/api/user/profile', processQuiz);
app.post('/api/trip/plan', planTrip);
// ...

// 5. ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    // NÃO expor detalhes do erro em produção
  });
});

app.listen(3000, () => {
  console.log('✅ Backend seguro rodando na porta 3000');
});
```

**Dia 6-7: Configurar Variáveis de Ambiente**

**Arquivo: backend/.env**
```env
# NUNCA commitar este arquivo no Git!
# Adicionar no .gitignore

NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi... (chave pública)
SUPABASE_SERVICE_KEY=eyJhbGciOi... (chave privada - NUNCA expor!)

# IA (escolher uma)
ANTHROPIC_API_KEY=sk-ant-api03-...
# OU
GEMINI_API_KEY=AIzaSy...

# APIs Externas
SKYSCANNER_API_KEY=...
BOOKING_API_KEY=...
GOOGLE_PLACES_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JWT
JWT_SECRET=sua-chave-super-secreta-aqui-min-32-chars

# Frontend (CORS)
FRONTEND_URL=http://localhost:8081
```

**Arquivo: backend/.gitignore**
```
node_modules/
.env
.env.local
.env.production
*.log
dist/
build/
```

---

### **FASE 2: AUTENTICAÇÃO (Semana 3)**

#### Funcionalidade 1: Login/Registro

**Dia 1-2: Tela de Onboarding (Figma)**

No Cursor, importar do Figma:
```
1. Tela: Onboarding/Welcome
2. Tela: Login
3. Tela: Registro
```

**Criar: src/screens/AuthScreen.js**
```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { supabase } from '../services/supabase';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleLogin() {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      
      if (error) throw error;
      
      // Login bem-sucedido! Navegar pro app
      navigation.navigate('Quiz');
      
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleRegister() {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });
      
      if (error) throw error;
      
      alert('Cadastro realizado! Verifique seu email.');
      
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cash Trip</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      
      <Button 
        title={loading ? "Carregando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
      
      <Button 
        title="Criar Conta"
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}
```

**Dia 3-4: Configurar Supabase Auth**

No painel do Supabase:
```
1. Authentication → Providers
2. Habilitar:
   - Email/Password ✅
   - Google ✅
   - Apple ✅ (pra iOS)

3. Authentication → Email Templates
   - Customizar email de confirmação
   - Adicionar logo da Cash Trip

4. Authentication → Policies
   - Configurar RLS (Row Level Security)
```

**SQL no Supabase (Migrations):**
```sql
-- 1. Criar tabela de profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  profile_data JSONB, -- Quiz + scores
  learning_confidence FLOAT DEFAULT 0.5,
  total_trips INTEGER DEFAULT 0
);

-- 2. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuário só vê seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Usuário só edita seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 3. Trigger: Criar profile ao registrar
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Dia 5-7: Implementar Social Login**

**Google Sign-In:**
```javascript
// src/services/auth.js
import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'cashtrip://auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'cashtrip://auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
}
```

---

### **FASE 3: QUIZ (Semana 4-5)**

#### Funcionalidade 2: Quiz Completo

**Semana 4: UI do Quiz**

**Dia 1-2: Importar Telas do Figma**
```
No Cursor:
1. Usar MCP do Figma
2. Importar telas do quiz (25 telas)
3. Gerar componentes automaticamente
```

**Estrutura:**
```
src/screens/Quiz/
├── QuizWelcome.js           # Introdução
├── QuizQuestion.js          # Template de pergunta
├── QuizProgress.js          # Barra de progresso
├── QuizComplete.js          # Finalização
└── quizData.js              # As 25 perguntas
```

**Arquivo: src/screens/Quiz/quizData.js**
```javascript
export const QUIZ_QUESTIONS = [
  {
    id: 'P1',
    question: 'Você é:',
    type: 'single',
    options: [
      { value: 'Homem', emoji: '👨' },
      { value: 'Mulher', emoji: '👩' },
      { value: 'Não-binário', emoji: '🌈' },
      { value: 'Outro', emoji: '➕' },
    ],
  },
  {
    id: 'P2',
    question: 'Onde você mora?',
    type: 'location',
    fields: ['city', 'state'],
  },
  {
    id: 'P3',
    question: 'Quantos anos você tem?',
    type: 'number',
    min: 18,
    max: 120,
  },
  // ... todas as 25 perguntas
];
```

**Arquivo: src/screens/Quiz/QuizScreen.js**
```javascript
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { QUIZ_QUESTIONS } from './quizData';

export function QuizScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  
  function handleAnswer(questionId, answer) {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  }
  
  function goNext() {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  }
  
  async function finishQuiz() {
    setLoading(true);
    
    try {
      // Enviar pro backend processar
      const response = await fetch('https://api.cashtrip.com/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ answers }),
      });
      
      const { profile } = await response.json();
      
      // Salvar perfil localmente
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Navegar pra próxima tela
      navigation.navigate('ProfileComplete');
      
    } catch (error) {
      alert('Erro ao processar quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  const question = QUIZ_QUESTIONS[currentQuestion];
  
  return (
    <View style={styles.container}>
      {/* Barra de progresso */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      
      <Text style={styles.progress}>
        {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
      </Text>
      
      <ScrollView>
        <Text style={styles.question}>{question.question}</Text>
        
        {question.type === 'single' && (
          <View>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  answers[question.id] === option.value && styles.selected,
                ]}
                onPress={() => handleAnswer(question.id, option.value)}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text style={styles.optionText}>{option.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {/* Outros tipos de pergunta... */}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.nextButton}
        onPress={goNext}
        disabled={!answers[question.id] || loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? 'Processando...' : 
           currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finalizar' : 
           'Próxima'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Dia 3-5: Validação e UX**
```
[ ] Adicionar validação de cada resposta
[ ] Animações de transição entre perguntas
[ ] Botão "Voltar" para pergunta anterior
[ ] Salvar progresso (se usuário sair)
[ ] Loading screen bonito ao finalizar
```

**Semana 5: Backend do Quiz + Agente**

**Dia 1-3: Implementar Profile Builder**

**Arquivo: backend/src/services/aiAgent.js**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROFILE_BUILDER_PROMPT = `
[Cole aqui o prompt completo que você testou no Claude.ai]
`;

export async function processQuiz(answers) {
  // Formatar respostas
  const quizText = formatQuizAnswers(answers);
  
  // Chamar Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: PROFILE_BUILDER_PROMPT,
    messages: [{
      role: 'user',
      content: quizText,
    }],
  });
  
  // Extrair JSON
  const profileJSON = extractJSON(response.content[0].text);
  
  return profileJSON;
}

function formatQuizAnswers(answers) {
  return `
QUIZ RESPONDIDO:
Tipo: Lazer
P1: ${answers.P1}
P2: ${answers.P2}, ${answers.P3}
...
  `;
}

function extractJSON(text) {
  // Encontrar JSON no texto
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('JSON não encontrado na resposta');
  
  return JSON.parse(jsonMatch[0]);
}
```

**Arquivo: backend/src/routes/profile.js**
```javascript
import express from 'express';
import { processQuiz } from '../services/aiAgent.js';
import { authenticateUser } from '../middleware/auth.js';
import { quizSchema } from '../middleware/security.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.post('/api/user/profile', 
  authenticateUser,  // Verifica auth
  async (req, res) => {
    try {
      // 1. Validar dados
      const { error: validationError } = quizSchema.validate(req.body.answers);
      if (validationError) {
        return res.status(400).json({ error: validationError.details[0].message });
      }
      
      // 2. Processar com IA
      const profile = await processQuiz(req.body.answers);
      
      // 3. Salvar no Supabase
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: req.user.id,
          profile_data: profile,
          learning_confidence: profile.learning_confidence,
        });
      
      if (error) throw error;
      
      // 4. Retornar
      res.json({
        success: true,
        profile: profile,
      });
      
    } catch (error) {
      console.error('Erro ao processar quiz:', error);
      res.status(500).json({ error: 'Erro ao processar quiz' });
    }
  }
);

export default router;
```

**Dia 4-7: Testes e Ajustes**
```
[ ] Testar com 10 perfis diferentes
[ ] Verificar se JSON retorna correto
[ ] Ajustar prompt se necessário
[ ] Adicionar logs para debug
[ ] Testar rate limiting
```

---

### **FASE 4: PLANEJAMENTO DE VIAGEM (Semanas 6-8)**

#### Funcionalidade 3: Escolher Destino + Planejar

**Semana 6: Telas + APIs Externas**

[Continua com o restante do roadmap...]

---

## 🔒 CHECKLIST DE SEGURANÇA (Implementar em CADA etapa)

### Backend Security
```
[ ] Helmet configurado (headers seguros)
[ ] Rate limiting (anti-DDoS)
[ ] CORS restrito (só seu domínio)
[ ] Input sanitization (anti-XSS)
[ ] Joi validation (validar todos inputs)
[ ] JWT com expiração (15min access, 7d refresh)
[ ] HTTPS obrigatório (TLS 1.3)
[ ] API keys em .env (nunca no código)
[ ] .env no .gitignore
[ ] Secrets no GitHub Secrets (CI/CD)
```

### Database Security (Supabase)
```
[ ] Row Level Security (RLS) ativado
[ ] Policies configuradas (usuário só vê seus dados)
[ ] Service key NUNCA exposta no frontend
[ ] Anon key (pública) com permissões limitadas
[ ] Backups automáticos configurados
[ ] SQL injection prevenido (prepared statements)
```

### Frontend Security
```
[ ] Não armazenar senhas (nem temporariamente)
[ ] AsyncStorage com crypto (dados sensíveis)
[ ] Tokens em memória (não AsyncStorage)
[ ] Refresh token strategy
[ ] Logout limpa tudo
[ ] Deep linking seguro
[ ] Code obfuscation (release builds)
```

### API Keys Protection
```
[ ] Anthropic/Gemini key SÓ no backend
[ ] Stripe secret key SÓ no backend
[ ] Skyscanner/Booking keys SÓ no backend
[ ] Frontend NUNCA tem API keys
[ ] Rotate keys periodicamente
```

---

## 📱 ROADMAP VISUAL SIMPLIFICADO

```
MÊS 1: FUNDAÇÃO
├─ Semana 1: Setup (Node, React Native, Supabase)
├─ Semana 2: Backend base + Segurança
├─ Semana 3: Auth (Login/Registro)
└─ Semana 4: Quiz UI

MÊS 2: CORE
├─ Semana 5: Quiz Backend + Agente
├─ Semana 6: Escolher Destino + APIs
├─ Semana 7: Planejar Viagem (Function calling)
└─ Semana 8: Revisão e Aprovação

MÊS 3: FEATURES
├─ Semana 9: Pagamento (Stripe)
├─ Semana 10: Dashboard + Roteiro
├─ Semana 11: Chat + Notificações
└─ Semana 12: i18n + Testes finais

MÊS 4: LANÇAMENTO
├─ Semana 13: Beta testing
├─ Semana 14: Ajustes finais
├─ Semana 15: Deploy (App Store + Google Play)
└─ Semana 16: Marketing + Lançamento oficial
```

---

Quer que eu continue com o restante das semanas em detalhes (semanas 6-16)?