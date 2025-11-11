# Sistema de Consolidação de Dados do Quiz - Cash Trip

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Armazenamento](#arquitetura-de-armazenamento)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Fluxo de Consolidação](#fluxo-de-consolidação)
5. [Implementação](#implementação)
6. [Validação e Integridade](#validação-e-integridade)
7. [Migração para Supabase](#migração-para-supabase)
8. [Tratamento de Erros](#tratamento-de-erros)
9. [Testes e Debug](#testes-e-debug)

---

## Visão Geral

O sistema de consolidação de dados do Cash Trip é responsável por:
- **Coletar** todas as respostas do quiz armazenadas temporariamente no `localStorage`
- **Validar** a completude e integridade dos dados
- **Transformar** os dados para o formato adequado ao backend
- **Enviar** para o Supabase/API
- **Limpar** o armazenamento local após sucesso

### Objetivo Principal
Garantir que todas as 26 perguntas do quiz sejam devidamente salvas, consolidadas e enviadas ao agente de IA para geração de recomendações personalizadas.

---

## Arquitetura de Armazenamento

### Fase 1: Armazenamento Temporário (Atual)
```
┌─────────────┐
│  Usuário    │
│  responde   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   localStorage      │
│  (navegador)        │
│                     │
│  - travelPurpose    │
│  - userEmail        │
│  - gender           │
│  - travelerType     │
│  - ... (26 chaves)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Consolidação       │
│  getAllQuizData()   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Validação          │
│  validateQuizData() │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Envio Supabase     │
│  (futuro)           │
└─────────────────────┘
```

### Fase 2: Persistência Permanente (Futuro)
```
┌─────────────┐
│  Supabase   │
│  Database   │
│             │
│  users      │───┐
│  └─ id      │   │
│             │   │
│  quiz_resp. │◄──┘
│  └─ user_id │
│  └─ data    │
│  └─ created │
└─────────────┘
```

---

## Estrutura de Dados

### Mapeamento Completo das 26 Perguntas

#### 1. Cadastro (4 campos)
```typescript
{
  travelPurpose: "vacation" | "business",
  userEmail: string,                        // ⚠️ Precisa ser implementado
  userPassword: string,                     // Será hasheado
  username: string
}
```

#### 2. Nível 1 - Demográfico (4 perguntas)
```typescript
{
  gender: "male" | "female" | "non-binary",
  location: {
    state: string,
    city: string
  },
  age: "18-25" | "26-35" | "36-45" | "46-55" | "56+",
  income: "0-2000" | "2000-5000" | "5000-10000" | "10000-20000" | "20000+"
}
```

#### 3. Nível 2 - Perfil de Viajante (5 perguntas)
```typescript
{
  travelerType: string[],              // Até 2 seleções
  travelPace: "agitado" | "equilibrado" | "tranquilo",
  daytimePlaces: string[],             // Até 2 seleções
  nighttimePreferences: string[],      // Até 2 seleções
  definingPhrase: string               // Single choice
}
```

#### 4. Nível 3 - Hospedagem (3 perguntas)
```typescript
{
  accommodationTypes: string[],        // Até 2 seleções
  accommodationLocation: string[],     // Até 2 seleções
  accommodationEssentials: string[]    // Múltiplas seleções
}
```

#### 5. Nível 4 - Comida (3 perguntas)
```typescript
{
  foodPreferences: string[],           // Até 3 seleções
  dietaryRestrictions: string[],       // Múltiplas seleções
  foodLevels: {
    gourmet: number,                   // 0-5
    casual: number,                    // 0-5
    healthy: number,                   // 0-5
    localTypical: number,              // 0-5
    preferToCook: number               // 0-5
  }
}
```

#### 6. Nível 5 - Transporte (4 perguntas)
```typescript
{
  ownVehicle: "yes" | "no",
  destinationTransportation: string[], // Até 2 seleções
  flightPreference: "economy" | "business" | "firstClass" | "flexible",
  flightConnections: "direct" | "oneConnection" | "flexible"
}
```

#### 7. Nível Bônus - Lifestyle (3 perguntas)
```typescript
{
  workoutFrequency: "everyday" | "occasionally" | "yogaPilates" | "noWorkout",
  musicStyles: string[],               // Até 3 seleções
  attractions: string[]                // Até 3 seleções
}
```

### Estrutura Consolidada Final
```typescript
interface QuizData {
  // Cadastro
  travelPurpose: string;
  userEmail: string;
  userPassword: string;
  username: string;
  
  // Demográfico
  gender: string;
  location: { state: string; city: string };
  age: string;
  income: string;
  
  // Perfil
  travelerType: string[];
  travelPace: string;
  daytimePlaces: string[];
  nighttimePreferences: string[];
  definingPhrase: string;
  
  // Hospedagem
  accommodationTypes: string[];
  accommodationLocation: string[];
  accommodationEssentials: string[];
  
  // Comida
  foodPreferences: string[];
  dietaryRestrictions: string[];
  foodLevels: {
    gourmet: number;
    casual: number;
    healthy: number;
    localTypical: number;
    preferToCook: number;
  };
  
  // Transporte
  ownVehicle: string;
  destinationTransportation: string[];
  flightPreference: string;
  flightConnections: string;
  
  // Lifestyle
  workoutFrequency: string;
  musicStyles: string[];
  attractions: string[];
  
  // Metadados
  createdAt?: string;
  completedAt?: string;
  quizVersion?: string;
}
```

---

## Fluxo de Consolidação

### 1. Coleta de Dados
```typescript
/**
 * Função: getAllQuizData()
 * Responsabilidade: Ler todos os dados do localStorage
 * Retorno: Objeto Partial<QuizData>
 */
export function getAllQuizData(): Partial<QuizData> {
  const data: Partial<QuizData> = {};
  
  // Para cada campo, tenta ler do localStorage
  // Se for JSON, faz parse; se não, retorna string
  
  // Exemplo:
  data.travelPurpose = localStorage.getItem("travelPurpose") || "";
  
  const travelerTypeStr = localStorage.getItem("travelerType");
  data.travelerType = travelerTypeStr ? JSON.parse(travelerTypeStr) : [];
  
  // ... repete para todos os 26 campos
  
  return data;
}
```

### 2. Validação de Dados
```typescript
/**
 * Função: validateQuizData()
 * Responsabilidade: Verificar se todos os campos obrigatórios estão presentes
 * Retorno: { isValid: boolean, missingFields: string[] }
 */
export function validateQuizData(data: Partial<QuizData>) {
  const requiredFields: (keyof QuizData)[] = [
    "travelPurpose",
    "userEmail",
    "username",
    "gender",
    "location",
    "age",
    "income",
    "travelerType",
    "travelPace",
    // ... lista completa
  ];
  
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    const value = data[field];
    
    // Verifica se está vazio
    if (!value) {
      missingFields.push(field);
      continue;
    }
    
    // Verifica arrays vazios
    if (Array.isArray(value) && value.length === 0) {
      missingFields.push(field);
      continue;
    }
    
    // Verifica objetos vazios
    if (typeof value === "object" && Object.keys(value).length === 0) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
```

### 3. Transformação de Dados
```typescript
/**
 * Função: transformForSupabase()
 * Responsabilidade: Transformar dados do formato localStorage para formato Supabase
 * Retorno: Objeto formatado para inserção no banco
 */
export function transformForSupabase(quizData: Partial<QuizData>) {
  return {
    // Dados básicos
    email: quizData.userEmail,
    password_hash: hashPassword(quizData.userPassword), // ⚠️ Hash no servidor
    username: quizData.username,
    
    // Quiz responses (JSONB no Supabase)
    quiz_responses: {
      demographic: {
        gender: quizData.gender,
        location: quizData.location,
        age: quizData.age,
        income: quizData.income,
      },
      profile: {
        travelPurpose: quizData.travelPurpose,
        travelerType: quizData.travelerType,
        travelPace: quizData.travelPace,
        daytimePlaces: quizData.daytimePlaces,
        nighttimePreferences: quizData.nighttimePreferences,
        definingPhrase: quizData.definingPhrase,
      },
      accommodation: {
        types: quizData.accommodationTypes,
        location: quizData.accommodationLocation,
        essentials: quizData.accommodationEssentials,
      },
      food: {
        preferences: quizData.foodPreferences,
        restrictions: quizData.dietaryRestrictions,
        levels: quizData.foodLevels,
      },
      transportation: {
        ownVehicle: quizData.ownVehicle,
        destination: quizData.destinationTransportation,
        flightPreference: quizData.flightPreference,
        flightConnections: quizData.flightConnections,
      },
      lifestyle: {
        workout: quizData.workoutFrequency,
        music: quizData.musicStyles,
        attractions: quizData.attractions,
      },
    },
    
    // Metadados
    quiz_completed_at: new Date().toISOString(),
    quiz_version: "1.0",
  };
}
```

### 4. Envio para Supabase
```typescript
/**
 * Função: submitQuizToSupabase()
 * Responsabilidade: Enviar dados consolidados para o Supabase
 * Retorno: Promise<{ success: boolean, userId?: string, error?: string }>
 */
export async function submitQuizToSupabase(
  quizData: Partial<QuizData>
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // 1. Transformar dados
    const transformedData = transformForSupabase(quizData);
    
    // 2. Criar conta de usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: transformedData.email,
      password: quizData.userPassword!, // Senha em texto plano (Supabase faz hash)
    });
    
    if (authError) throw authError;
    
    // 3. Salvar respostas do quiz
    const { data: quizResponse, error: quizError } = await supabase
      .from("quiz_responses")
      .insert([
        {
          user_id: authData.user!.id,
          responses: transformedData.quiz_responses,
          completed_at: transformedData.quiz_completed_at,
          version: transformedData.quiz_version,
        },
      ]);
    
    if (quizError) throw quizError;
    
    // 4. Salvar perfil do usuário
    const { error: profileError } = await supabase
      .from("users")
      .update({
        username: transformedData.username,
        quiz_completed: true,
      })
      .eq("id", authData.user!.id);
    
    if (profileError) throw profileError;
    
    return {
      success: true,
      userId: authData.user!.id,
    };
  } catch (error: any) {
    console.error("❌ Erro ao enviar quiz:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido",
    };
  }
}
```

### 5. Limpeza do localStorage
```typescript
/**
 * Função: clearQuizData()
 * Responsabilidade: Limpar todos os dados do quiz após envio bem-sucedido
 */
export function clearQuizData(): void {
  const quizKeys = [
    "travelPurpose", "userEmail", "userPassword", "username",
    "gender", "location", "age", "income",
    "travelerType", "travelPace", "daytimePlaces", "nighttimePreferences", "definingPhrase",
    "accommodationTypes", "accommodationLocation", "accommodationEssentials",
    "foodPreferences", "dietaryRestrictions", "foodLevels",
    "ownVehicle", "destinationTransportation", "flightPreference", "flightConnections",
    "workoutFrequency", "musicStyles", "attractions",
  ];
  
  quizKeys.forEach(key => localStorage.removeItem(key));
  
  console.log("🧹 localStorage limpo com sucesso");
}
```

---

## Validação e Integridade

### Tipos de Validação

#### 1. Validação de Presença
```typescript
// Verifica se o campo existe e não está vazio
function validatePresence(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}
```

#### 2. Validação de Formato
```typescript
// Valida formato de email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Valida estrutura de location
function validateLocation(location: any): boolean {
  return (
    location &&
    typeof location === "object" &&
    typeof location.state === "string" &&
    location.state.length > 0 &&
    typeof location.city === "string" &&
    location.city.length > 0
  );
}
```

#### 3. Validação de Valores
```typescript
// Valida valores de enums
function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

// Exemplo:
validateEnum(data.gender, ["male", "female", "non-binary"]);
validateEnum(data.travelPace, ["agitado", "equilibrado", "tranquilo"]);
```

#### 4. Validação de Limites
```typescript
// Valida número de seleções em arrays
function validateArrayLength(
  arr: any[],
  min: number,
  max: number
): boolean {
  return arr.length >= min && arr.length <= max;
}

// Exemplos:
validateArrayLength(data.travelerType, 1, 2);      // Até 2
validateArrayLength(data.foodPreferences, 1, 3);   // Até 3
```

### Função de Validação Completa
```typescript
export function validateQuizDataComplete(
  data: Partial<QuizData>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  // Email
  if (!validatePresence(data.userEmail)) {
    errors.userEmail = "Email é obrigatório";
  } else if (!validateEmail(data.userEmail!)) {
    errors.userEmail = "Email inválido";
  }
  
  // Location
  if (!validateLocation(data.location)) {
    errors.location = "Estado e cidade são obrigatórios";
  }
  
  // TravelerType
  if (!data.travelerType || !validateArrayLength(data.travelerType, 1, 2)) {
    errors.travelerType = "Selecione 1 ou 2 tipos de viajante";
  }
  
  // FoodLevels
  if (data.foodLevels) {
    const hasAnyLevel = Object.values(data.foodLevels).some(level => level > 0);
    if (!hasAnyLevel) {
      errors.foodLevels = "Defina pelo menos um nível de alimentação";
    }
  } else {
    errors.foodLevels = "Níveis de alimentação são obrigatórios";
  }
  
  // ... validações para todos os campos
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

---

## Migração para Supabase

### Estrutura de Tabelas

#### Tabela: users
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  quiz_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Tabela: quiz_responses
```sql
CREATE TABLE public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_user_response UNIQUE(user_id)
);

-- Índices para performance
CREATE INDEX idx_quiz_responses_user_id ON public.quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_completed_at ON public.quiz_responses(completed_at);
```

#### Políticas RLS (Row Level Security)
```sql
-- Usuários só podem ver suas próprias respostas
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz responses"
  ON public.quiz_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
  ON public.quiz_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## Tratamento de Erros

### Tipos de Erros

#### 1. Erro de Validação
```typescript
// Dados incompletos ou inválidos
{
  type: "validation_error",
  message: "Dados do quiz incompletos",
  missingFields: ["userEmail", "travelerType"],
  action: "Volte e complete todos os campos obrigatórios"
}
```

#### 2. Erro de Rede
```typescript
// Falha na conexão com Supabase
{
  type: "network_error",
  message: "Erro de conexão com o servidor",
  action: "Verifique sua conexão e tente novamente"
}
```

#### 3. Erro de Autenticação
```typescript
// Email já cadastrado
{
  type: "auth_error",
  message: "Email já cadastrado",
  action: "Faça login ou use outro email"
}
```

### Sistema de Retry
```typescript
async function submitWithRetry(
  quizData: Partial<QuizData>,
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await submitQuizToSupabase(quizData);
      
      if (result.success) {
        return result;
      }
      
      // Se não for erro de validação, tenta novamente
      if (!result.error?.includes("validation")) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      return result;
    } catch (error: any) {
      attempt++;
      
      if (attempt >= maxRetries) {
        return {
          success: false,
          error: `Falha após ${maxRetries} tentativas: ${error.message}`,
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return {
    success: false,
    error: "Número máximo de tentativas excedido",
  };
}
```

---

## Testes e Debug

### Função de Debug
```typescript
export function debugQuizData(): void {
  console.group("🔍 Debug - Quiz Data");
  
  const data = getAllQuizData();
  const validation = validateQuizDataComplete(data);
  
  console.log("📊 Dados coletados:", data);
  console.log("✅ Validação:", validation);
  
  // Estatísticas
  const totalFields = 26;
  const filledFields = Object.values(data).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return v !== "" && v !== null && v !== undefined;
  }).length;
  
  console.log(`📈 Progresso: ${filledFields}/${totalFields} campos preenchidos (${Math.round(filledFields/totalFields*100)}%)`);
  
  // Dados por nível
  console.group("📦 Dados por Nível");
  console.log("Cadastro:", {
    travelPurpose: data.travelPurpose,
    userEmail: data.userEmail,
    username: data.username,
  });
  console.log("Demográfico:", {
    gender: data.gender,
    location: data.location,
    age: data.age,
    income: data.income,
  });
  // ... outros níveis
  console.groupEnd();
  
  console.groupEnd();
}

// Usar no console do navegador:
// debugQuizData()
```

### Teste de Integração
```typescript
export async function testQuizSubmission(): Promise<void> {
  console.log("🧪 Iniciando teste de submissão do quiz...");
  
  // 1. Preencher dados de teste
  const mockData: Partial<QuizData> = {
    travelPurpose: "vacation",
    userEmail: "test@cashtrip.com",
    userPassword: "Test@123",
    username: "Test User",
    gender: "male",
    location: { state: "SP", city: "São Paulo" },
    age: "26-35",
    income: "5000-10000",
    travelerType: ["adventurer", "cultural"],
    travelPace: "equilibrado",
    // ... preencher todos os campos
  };
  
  // 2. Validar
  const validation = validateQuizDataComplete(mockData);
  console.log("✅ Validação:", validation);
  
  if (!validation.isValid) {
    console.error("❌ Dados de teste inválidos:", validation.errors);
    return;
  }
  
  // 3. Simular envio
  console.log("📤 Enviando para Supabase...");
  const result = await submitQuizToSupabase(mockData);
  
  if (result.success) {
    console.log("✅ Teste bem-sucedido! User ID:", result.userId);
  } else {
    console.error("❌ Teste falhou:", result.error);
  }
}
```

---

## Checklist de Implementação

### Fase 1: Correções Imediatas
- [ ] Implementar salvamento de email em `/quiz/email/page.tsx`
- [ ] Criar arquivo `/src/lib/quiz-data.ts` com funções helper
- [ ] Testar coleta de dados com `debugQuizData()`

### Fase 2: Página de Conclusão
- [ ] Criar `/src/app/quiz/complete/page.tsx`
- [ ] Implementar loading state e feedback visual
- [ ] Implementar tratamento de erros
- [ ] Atualizar última página do quiz para redirecionar

### Fase 3: Integração Supabase
- [ ] Criar tabelas `users` e `quiz_responses`
- [ ] Configurar políticas RLS
- [ ] Implementar `submitQuizToSupabase()`
- [ ] Testar fluxo completo em ambiente de desenvolvimento

### Fase 4: Produção
- [ ] Implementar sistema de retry
- [ ] Adicionar analytics (abandonamento, tempo de conclusão)
- [ ] Implementar backup de dados antes de limpar localStorage
- [ ] Configurar monitoramento de erros (Sentry/LogRocket)

---

## Próximos Passos

1. **Corrigir página de email** para salvar dados no localStorage
2. **Criar biblioteca de consolidação** (`quiz-data.ts`)
3. **Implementar página de conclusão** (`/quiz/complete`)
4. **Testar fluxo completo** do início ao fim
5. **Configurar Supabase** e migrar do localStorage
6. **Implementar dashboard** para visualizar perfil do usuário

---

## Referências

- [Documentação Supabase - Auth](https://supabase.com/docs/guides/auth)
- [Documentação Supabase - Database](https://supabase.com/docs/guides/database)
- [Next.js - Client-side Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/client-side)
- [localStorage API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Última atualização:** 11/11/2025  
**Versão:** 1.0  
**Autor:** Equipe Cash Trip

