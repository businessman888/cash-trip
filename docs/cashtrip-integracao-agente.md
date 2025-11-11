# 🔌 Cash Trip - Como Integrar o Agente no App

---

## 🎯 AS 3 FORMAS DE CONSTRUIR (Comparação Direta)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  OPÇÃO 1: Claude.ai Projects                           │
│  ├─ O que é: Site/interface visual                     │
│  ├─ Para que serve: TESTAR o agente                    │
│  ├─ Onde vive: No site claude.ai                       │
│  └─ Como integrar no app: NÃO DÁ!                      │
│      (é só pra teste)                                   │
│                                                         │
│  OPÇÃO 2: SDK via Código (Cursor/VSCode)               │
│  ├─ O que é: Código que SEU backend roda               │
│  ├─ Para que serve: PRODUÇÃO (app real)                │
│  ├─ Onde vive: No SEU servidor                         │
│  └─ Como integrar: Backend → API → App                 │
│      (É ASSIM que funciona de verdade!)                 │
│                                                         │
│  OPÇÃO 3: Gemini API                                   │
│  ├─ O que é: Mesma coisa que SDK, mas do Google        │
│  ├─ Para que serve: PRODUÇÃO (alternativa ao Claude)   │
│  ├─ Onde vive: No SEU servidor                         │
│  └─ Como integrar: Backend → API → App                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 ENTENDENDO A CONFUSÃO

### Analogia Simples: Restaurante

**Claude.ai Projects = Cozinha experimental**
- É onde o CHEF testa receitas novas
- Você vai lá, prova, ajusta temperos
- MAS: Clientes do restaurante NUNCA vão lá
- Serve só pra desenvolvimento

**SDK no Backend = Cozinha do restaurante de verdade**
- É onde a comida é REALMENTE feita
- Cliente pede pelo app (frontend)
- Pedido vai pra cozinha (backend com SDK)
- Cozinha prepara (agente processa)
- Garçom entrega (API retorna pro app)

---

## 📊 COMPARAÇÃO DETALHADA

### OPÇÃO 1: Claude.ai Projects

#### O que É:
```
Site: https://claude.ai
Você cria um "projeto"
Cola o prompt
Conversa com o agente
```

#### Para que Serve:
```
✅ Testar se o prompt funciona
✅ Fazer ajustes rápidos
✅ Validar lógica antes de programar
✅ Prototipar conversas
```

#### Limitações:
```
❌ App não consegue "falar" com ele
❌ Não tem API própria
❌ Não roda function calling (buscar voos/hotéis)
❌ É manual (você que conversa)
```

#### Como "Integrar" no App:
```
RESPOSTA: NÃO DÁ!

Claude.ai Projects é só pra VOCÊ testar.
Para o app funcionar de verdade, precisa do SDK.
```

---

### OPÇÃO 2: SDK via Código (PRODUÇÃO REAL) ✅

#### O que É:
```
Um "pacote" que você instala no seu backend
Como instalar um app no celular, mas é código
```

#### Como Funciona:
```
1. Seu backend (Node.js/Python) tem o SDK instalado
2. Quando app pede algo, backend usa SDK
3. SDK "conversa" com servidores da Anthropic
4. Anthropic retorna resposta
5. Seu backend manda pro app
```

#### Arquitetura:
```
[App Mobile]
     ↓ (HTTP/REST)
[Seu Backend] ← SDK da Anthropic instalado aqui
     ↓ (API da Anthropic)
[Servidores da Anthropic/Claude]
```

#### Vantagens:
```
✅ Controle total
✅ Function calling (buscar voos, hotéis)
✅ Seu backend gerencia tudo
✅ Pode cachear respostas
✅ Pode logar dados
✅ Segurança (API key no backend, não no app)
```

---

### OPÇÃO 3: Gemini API (Alternativa ao Claude)

#### O que É:
```
Mesma ideia do SDK do Claude, mas da Google
```

#### Como Funciona:
```
Exatamente igual ao SDK do Claude:

[App Mobile]
     ↓
[Seu Backend] ← SDK do Gemini instalado aqui
     ↓
[Servidores da Google/Gemini]
```

#### Diferença Principal:
```
Marca diferente, funcionamento igual:

Claude SDK: const anthropic = new Anthropic()
Gemini SDK:  const genai = new GoogleGenerativeAI()

É como:
- Coca-Cola vs Pepsi (mesma coisa, marcas diferentes)
- iPhone vs Samsung (celular, fabricantes diferentes)
```

---

## 💻 COMO CONSTRUIR NO CURSOR (Passo a Passo)

### O que é Cursor?
```
Cursor = VSCode com IA integrada
É um EDITOR DE CÓDIGO com assistente
Você escreve código lá (como Word é pra texto)
```

### Passo a Passo no Cursor:

#### 1. Criar Projeto no Cursor

```bash
# No Cursor, abrir terminal e digitar:

mkdir cashtrip-backend
cd cashtrip-backend
npm init -y
```

#### 2. Instalar SDK (Escolher Claude OU Gemini)

**Se escolher Claude:**
```bash
npm install @anthropic-ai/sdk
npm install express dotenv
```

**Se escolher Gemini:**
```bash
npm install @google/generative-ai
npm install express dotenv
```

#### 3. Criar Arquivo de Configuração

No Cursor, criar arquivo `.env`:
```
# .env
ANTHROPIC_API_KEY=sk-ant-api03-xxx... (sua chave)
# OU
GEMINI_API_KEY=AIzaSyxxx... (sua chave)
```

#### 4. Criar o Código do Agente

**Arquivo: `agent.js` (Claude SDK)**

```javascript
// agent.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Função que o app vai chamar
export async function processarQuiz(respostas) {
  
  // Formata respostas do quiz
  const quizTexto = formatarQuiz(respostas);
  
  // Chama o Claude
  const resposta = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    system: PROMPT_PROFILE_BUILDER, // seu prompt aqui
    messages: [{
      role: 'user',
      content: quizTexto
    }]
  });
  
  // Extrai JSON do perfil
  const perfil = extrairJSON(resposta.content);
  
  return perfil;
}

// Função para planejar viagem
export async function planejarViagem(perfil, destino, orcamento) {
  
  const tools = [
    {
      name: 'buscar_voos',
      description: 'Busca voos reais',
      input_schema: { /* ... */ }
    },
    // ... outras ferramentas
  ];
  
  let messages = [{
    role: 'user',
    content: `Perfil: ${JSON.stringify(perfil)}
              Destino: ${destino}
              Orçamento: R$ ${orcamento}`
  }];
  
  let resposta = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16384,
    system: PROMPT_TRIP_PLANNER,
    tools: tools,
    messages: messages
  });
  
  // Loop de function calling
  while (resposta.stop_reason === 'tool_use') {
    // Executar ferramentas (buscar voos, hotéis, etc)
    // ...
  }
  
  return planoDaViagem;
}
```

**OU Arquivo: `agent.js` (Gemini SDK)**

```javascript
// agent.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function processarQuiz(respostas) {
  
  const model = genai.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    systemInstruction: PROMPT_PROFILE_BUILDER
  });
  
  const quizTexto = formatarQuiz(respostas);
  
  const resultado = await model.generateContent(quizTexto);
  const perfil = extrairJSON(resultado.response.text());
  
  return perfil;
}

// Resto similar ao Claude
```

#### 5. Criar API (Backend)

**Arquivo: `server.js`**

```javascript
import express from 'express';
import { processarQuiz, planejarViagem } from './agent.js';

const app = express();
app.use(express.json());

// Endpoint 1: Processar Quiz
app.post('/api/user/profile', async (req, res) => {
  const { respostas } = req.body;
  
  try {
    const perfil = await processarQuiz(respostas);
    
    // Salvar perfil no banco de dados
    // await db.salvarPerfil(perfil);
    
    res.json({ success: true, perfil });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

// Endpoint 2: Planejar Viagem
app.post('/api/trip/plan', async (req, res) => {
  const { perfil, destino, orcamento } = req.body;
  
  try {
    const plano = await planejarViagem(perfil, destino, orcamento);
    
    res.json({ success: true, plano });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Backend rodando em http://localhost:3000');
});
```

#### 6. Rodar no Cursor

No terminal do Cursor:
```bash
node server.js
```

Agora seu backend está RODANDO! 🎉

---

## 📱 COMO INTEGRAR NO APP (As 3 Formas)

### INTEGRAÇÃO 1: Claude.ai Projects → App

```
❌ IMPOSSÍVEL!

Claude.ai Projects não tem API pública.
É só pra você testar manualmente.

Para o app funcionar, você PRECISA do SDK.
```

---

### INTEGRAÇÃO 2: SDK (Claude ou Gemini) → App ✅

#### Fluxo Completo:

```
PASSO 1: Usuário termina quiz no app
┌──────────────────────────┐
│ [App Mobile]             │
│ Quiz finalizado!         │
│ Respostas: [P1, P2...]   │
└────────┬─────────────────┘
         │
         │ HTTP POST
         ↓
┌──────────────────────────┐
│ [Backend com SDK]        │
│ Recebe: respostas        │
│ Chama: processarQuiz()   │
│    ↓                     │
│ SDK chama Anthropic      │
│    ↓                     │
│ Recebe: perfil JSON      │
│ Salva no banco           │
└────────┬─────────────────┘
         │
         │ HTTP Response
         ↓
┌──────────────────────────┐
│ [App Mobile]             │
│ Mostra: Perfil criado!   │
│ Navega pra próxima tela  │
└──────────────────────────┘
```

#### Código no App (React Native):

```javascript
// App Mobile - QuizScreen.js

import { useState } from 'react';

export function QuizScreen() {
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(false);
  
  async function finalizarQuiz() {
    setLoading(true);
    
    try {
      // Chama SEU backend (que tem o SDK)
      const resposta = await fetch('https://api.cashtrip.com/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respostas })
      });
      
      const dados = await resposta.json();
      
      if (dados.success) {
        // Perfil criado! Salvar localmente
        await AsyncStorage.setItem('userProfile', JSON.stringify(dados.perfil));
        
        // Navegar pra próxima tela
        navigation.navigate('EscolherDestino');
      }
      
    } catch (erro) {
      alert('Erro ao processar quiz: ' + erro.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View>
      {/* Quiz questions... */}
      
      {loading ? (
        <View>
          <Text>Analisando suas respostas...</Text>
          <ActivityIndicator />
        </View>
      ) : (
        <Button title="Finalizar Quiz" onPress={finalizarQuiz} />
      )}
    </View>
  );
}
```

#### Código no App (Flutter):

```dart
// App Mobile - quiz_screen.dart

Future<void> finalizarQuiz() async {
  setState(() => loading = true);
  
  try {
    // Chama SEU backend
    final response = await http.post(
      Uri.parse('https://api.cashtrip.com/api/user/profile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'respostas': respostas}),
    );
    
    final dados = jsonDecode(response.body);
    
    if (dados['success']) {
      // Salvar perfil localmente
      await storage.write('userProfile', jsonEncode(dados['perfil']));
      
      // Navegar
      Navigator.pushNamed(context, '/escolher-destino');
    }
    
  } catch (e) {
    showDialog(/* erro */);
  } finally {
    setState(() => loading = false);
  }
}
```

---

### INTEGRAÇÃO 3: Gemini SDK → App

**É EXATAMENTE IGUAL ao Claude!**

A única diferença é no BACKEND (SDK diferente).

Do ponto de vista do APP, ele nem sabe se é Claude ou Gemini:

```
App faz:  POST /api/user/profile
Backend:  Usa Claude SDK
App recebe: JSON do perfil

OU

App faz:  POST /api/user/profile
Backend:  Usa Gemini SDK
App recebe: JSON do perfil (mesma estrutura!)
```

---

## 🔑 OBTENDO API KEYS

### Para Claude (Anthropic):

```
1. Acesse: https://console.anthropic.com

2. Crie conta (email + senha)

3. Menu lateral → "API Keys"

4. "Create Key" → Copia: sk-ant-api03-xxxxx

5. Cola no .env do seu backend:
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

6. Adiciona crédito ($):
   Menu "Billing" → Add credits
   Mínimo: $5 (suficiente pra testar)
```

### Para Gemini (Google):

```
1. Acesse: https://aistudio.google.com/apikey

2. Login com conta Google

3. "Create API Key" → Copia: AIzaSyxxxxx

4. Cola no .env:
   GEMINI_API_KEY=AIzaSyxxxxx

5. Crédito:
   Gemini tem free tier generoso
   (60 requests/minuto grátis!)
```

---

## 💰 CUSTOS COMPARADOS

### Claude (Anthropic)

```
Modelo: claude-sonnet-4-20250514

Input:  $0.003 / 1k tokens
Output: $0.015 / 1k tokens

Exemplo: Processar 1 quiz
- Input:  ~3.000 tokens = $0.009
- Output: ~5.000 tokens = $0.075
TOTAL por quiz: $0.084 (R$ 0,42)

Exemplo: Planejar 1 viagem
- Input:  ~8.000 tokens = $0.024
- Output: ~15.000 tokens = $0.225
TOTAL por viagem: $0.249 (R$ 1,25)

TOTAL por usuário (quiz + viagem): R$ 1,67
```

### Gemini (Google)

```
Modelo: gemini-1.5-pro

FREE TIER:
- 60 requests/minuto
- 1.500 requests/dia
- GRÁTIS!

Paid (se ultrapassar):
Input:  $0.00125 / 1k tokens (2.4x mais barato!)
Output: $0.005 / 1k tokens (3x mais barato!)

Exemplo: Processar 1 quiz
TOTAL: $0.029 (R$ 0,15)

Exemplo: Planejar 1 viagem
TOTAL: $0.085 (R$ 0,43)

TOTAL por usuário: R$ 0,58 (3x mais barato!)
```

---

## 🎯 QUAL ESCOLHER?

### Use Claude se:
```
✅ Precisa do MELHOR raciocínio
✅ Smart Luxury complexo
✅ Prompts longos e detalhados
✅ Quer seguir instruções à risca
✅ Orçamento não é problema
```

### Use Gemini se:
```
✅ Quer economizar (3x mais barato!)
✅ Free tier generoso (ótimo pra MVP)
✅ Contexto GIGANTE (1M tokens vs 200K)
✅ Boa integração com Google Maps
✅ Multimodal (imagens, vídeos)
```

### Minha Recomendação:

```
FASE 1 (MVP): Gemini
- Grátis até 1.500 requests/dia
- Suficiente pra validar
- Economiza grana

FASE 2 (Escala): Claude
- Quando tiver usuários pagantes
- Melhor qualidade de resposta
- Vale o custo extra
```

---

## 📋 CHECKLIST DE INTEGRAÇÃO

### Backend (SDK)

```
[ ] Escolher Claude ou Gemini
[ ] Criar conta no console da IA escolhida
[ ] Obter API Key
[ ] Instalar SDK no backend (npm install...)
[ ] Criar arquivo .env com API_KEY
[ ] Criar funções: processarQuiz(), planejarViagem()
[ ] Criar endpoints: /api/user/profile, /api/trip/plan
[ ] Testar endpoints com Postman/Insomnia
[ ] Deploy do backend (Railway, Heroku, AWS)
```

### Frontend (App)

```
[ ] Tela de quiz finalizada
[ ] Função pra chamar API: fetch('/api/user/profile')
[ ] Loading enquanto processa (barra animada)
[ ] Salvar perfil localmente (AsyncStorage/SharedPreferences)
[ ] Tratamento de erros (se API cair)
[ ] Tela de "Escolher Destino" pronta
[ ] Integração com /api/trip/plan
[ ] Exibir plano de viagem recebido
```

---

## 🚀 PRÓXIMOS PASSOS (Ordem Recomendada)

### Semana 1: Setup Básico
```
Dia 1-2: Backend
- [ ] Instalar Node.js
- [ ] Criar projeto no Cursor
- [ ] Instalar SDK (Gemini pra começar)
- [ ] Obter API Key
- [ ] Criar arquivo agent.js básico

Dia 3-4: Testar Localmente
- [ ] Rodar backend local (localhost:3000)
- [ ] Testar com Postman
- [ ] Enviar quiz fake, receber perfil

Dia 5-7: Integrar com App
- [ ] App chama localhost:3000
- [ ] Ver se funciona ponta-a-ponta
- [ ] Ajustar prompt se necessário
```

### Semana 2: Deploy
```
Dia 1-3: Deploy Backend
- [ ] Escolher plataforma (Railway.app é fácil)
- [ ] Deploy do backend
- [ ] Obter URL pública: https://cashtrip.up.railway.app

Dia 4-7: Conectar App ao Backend Real
- [ ] Trocar localhost por URL real
- [ ] Testar em celular real
- [ ] Monitorar logs
- [ ] Ajustar performance
```

---

## 💡 RESUMO FINAL (TL;DR)

### Claude.ai Projects:
```
❌ NÃO dá pra integrar no app
✅ Serve só pra TESTAR o prompt
👉 Use pra prototipar antes de programar
```

### SDK via Cursor (Claude ou Gemini):
```
✅ É A FORMA CERTA para produção
✅ Backend instala SDK
✅ App chama backend via HTTP
✅ Backend usa SDK pra chamar IA
👉 Use isso no app real
```

### Gemini vs Claude:
```
Gemini: Mais barato, free tier, bom
Claude: Melhor qualidade, mais caro
👉 Comece com Gemini, depois migre pra Claude se precisar
```

### Fluxo Real:
```
App → Backend (seu servidor com SDK) → Anthropic/Google → Backend → App

É assim que TODO app com IA funciona!
(ChatGPT, Notion AI, etc fazem exatamente isso)
```

---

Ficou claro agora? Quer que eu crie o código completo do backend no Cursor pra você copiar e colar?