# Documentação Completa - Cash Trip App

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Fluxo de Navegação Completo](#fluxo-de-navegação-completo)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Páginas Implementadas](#páginas-implementadas)
6. [Padrões de Design](#padrões-de-design)
7. [Sistema de Ícones](#sistema-de-ícones)
8. [Próximos Passos](#próximos-passos)

---

## Visão Geral

O Cash Trip é uma aplicação web de planejamento de viagens que utiliza inteligência artificial para criar experiências personalizadas baseadas no perfil do usuário. A aplicação coleta informações através de um quiz gamificado dividido em níveis.

### Status Atual
- ✅ Sistema de autenticação completo
- ✅ Fluxo de cadastro (4 etapas)
- ✅ Nível 1 do quiz completo (4 perguntas demográficas)
- ✅ Transição entre níveis
- ✅ Nível 2 iniciado (2 perguntas implementadas)
- ⏳ 19 perguntas restantes do quiz
- ⏳ Integração com Supabase para persistência

### Progresso Geral
- **Total de páginas**: 12 páginas completas
- **Progresso do quiz**: 6 de 25 perguntas (24%)
- **Sistema de níveis**: 1 nível completo, Nível 2 em andamento

---

## Estrutura do Projeto

```
cashtrip/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx                    # Página de login
│   │   ├── quiz/
│   │   │   ├── travel-purpose/
│   │   │   │   └── page.tsx                # Escolha: Férias ou Negócios
│   │   │   ├── email/
│   │   │   │   └── page.tsx                # Captura de email
│   │   │   ├── password/
│   │   │   │   └── page.tsx                # Criação de senha
│   │   │   ├── username/
│   │   │   │   └── page.tsx                # Nome/username do usuário
│   │   │   ├── gender/
│   │   │   │   └── page.tsx                # Pergunta 1: Gênero
│   │   │   ├── location/
│   │   │   │   └── page.tsx                # Pergunta 2: Estado e Cidade
│   │   │   ├── age/
│   │   │   │   └── page.tsx                # Pergunta 3: Faixa etária
│   │   │   ├── income/
│   │   │   │   └── page.tsx                # Pergunta 4: Renda mensal
│   │   │   ├── transition/
│   │   │   │   └── page.tsx                # Transição entre níveis
│   │   │   ├── traveler-type/
│   │   │   │   └── page.tsx                # Pergunta 5: Tipo de viajante
│   │   │   └── travel-pace/
│   │   │       └── page.tsx                # Pergunta 6: Ritmo de viagem
│   │   ├── layout.tsx                       # Layout principal
│   │   └── globals.css                      # Estilos globais
│   ├── components/
│   │   ├── auth/
│   │   │   ├── GoogleButton.tsx            # Botão de login Google
│   │   │   └── EmailButton.tsx             # Botão de login Email
│   │   └── ui/
│   │       └── QuizIcon.tsx                # Componente de ícones do quiz
│   ├── lib/
│   │   ├── quiz-icons.ts                   # Índice de ícones (127 ícones)
│   │   └── supabase/
│   │       ├── client.ts                   # Cliente Supabase
│   │       └── server.ts                   # Servidor Supabase
│   └── hooks/
│       └── usePlaceImages.ts               # Hook para imagens
├── public/
│   ├── logo.svg                            # Logo da Cash Trip
│   ├── login-background.webp               # Background da página de login
│   ├── icons/                              # 127 ícones do quiz
│   │   ├── icon-homem.svg
│   │   ├── icon-mulher.svg
│   │   ├── icon-não-binário.svg
│   │   ├── Icon-férias.svg
│   │   ├── Icon-negócios.svg
│   │   └── ... (122 outros ícones)
│   └── illustrations/                      # Ilustrações
│       ├── hospedagem-hotel.svg
│       └── ... (outras ilustrações)
└── docs/
    ├── COMPLETE_IMPLEMENTATION_GUIDE.md    # Este documento
    ├── LOGIN_PAGE_FIXES.md
    ├── QUIZ_GENDER_PAGE.md
    ├── QUIZ_LOCATION_PAGE.md
    ├── QUIZ_AGE_PAGE.md
    ├── QUIZ_EMAIL_PAGE.md
    ├── QUIZ_PASSWORD_PAGE.md
    ├── QUIZ_USERNAME_PAGE.md
    ├── QUIZ_TRANSITION_PAGE.md
    └── STATIC_IMAGES_GUIDE.md
```

---

## Fluxo de Navegação Completo

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTENTICAÇÃO / LOGIN                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
                      /login (página inicial)
              "Sua próxima aventura começa aqui"
        - Login com Google
        - Login com Email
        - Link "Cadastrar-se" → /quiz/travel-purpose
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE CADASTRO                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
            /quiz/travel-purpose (Etapa 1)
        "Bem-vindo(a) a CashTrip"
        Escolha: Férias ou Negócios
                              ↓
              /quiz/email (Etapa 2)
            "Vamos começar"
          "Qual seu email?"
                              ↓
            /quiz/password (Etapa 3)
              "Etapa 2"
          "Crie uma senha"
        2 campos: Senha + Confirmação
                              ↓
            /quiz/username (Etapa 4)
              "Etapa 3"
    "Como deseja ser chamado?"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               NÍVEL 1 - PERGUNTAS DEMOGRÁFICAS              │
└─────────────────────────────────────────────────────────────┘
                              ↓
            /quiz/gender (Pergunta 1/25)
      "Como você se identifica?"
        3 opções: Homem, Mulher, Não-binário
        Barra de progresso: 4%
                              ↓
          /quiz/location (Pergunta 2/25)
            "Onde você mora?"
        2 campos: Estado + Cidade
        Barra de progresso: 8%
                              ↓
            /quiz/age (Pergunta 3/25)
          "Qual a sua idade?"
        5 faixas etárias em grid 2-2-1
        Barra de progresso: 12%
                              ↓
          /quiz/income (Pergunta 4/25)
        "Renda mensal média"
        5 faixas de renda em grid 2-2-1
        Barra de progresso: 16%
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    TRANSIÇÃO DE NÍVEIS                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
          /quiz/transition (Milestone)
        Indicador de 5 níveis visual
        "Vamos descobrir o seu perfil de viajante"
        "Preparado(a)?"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            NÍVEL 2 - PERFIL DE VIAJANTE                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
       /quiz/traveler-type (Pergunta 5/25)
    "Qual tipo de viajante você se considera?"
        Múltipla escolha (até 2 opções)
        6 opções de estilo de viagem
        Nova barra: "Conhecimento sobre você - 10%"
        Botão flutuante laranja
                              ↓
        /quiz/travel-pace (Pergunta 6/25)
      "Qual é o ritmo ideal das suas viagens?"
        3 opções: Agitado, Equilibrado, Tranquilo/zen
        Barra: "Conhecimento sobre você - 40%"
        Cards verticais com ícones grandes
        Botão flutuante com seta (canto direito)
                              ↓
          [19 PERGUNTAS RESTANTES]
```

---

## Tecnologias Utilizadas

### Core
- **Next.js 16.0.1** (App Router)
- **React 19.2.0**
- **TypeScript**
- **Tailwind CSS v4** (inline @theme)

### Fontes
- **Roboto Condensed** (400, 700, 900)
  - Títulos principais
  - Labels e textos do quiz
- **Inria Sans** (400, 700)
  - Subtítulos
  - Botões de ação
  - Textos secundários

### Backend & Autenticação
- **Supabase**
  - Autenticação (Google OAuth, Magic Link)
  - Database (PostgreSQL)
  - Storage (para imagens futuras)

### Otimização de Imagens
- **Next.js Image Component**
- **Unsplash API** (para imagens de destinos)

### Armazenamento Temporário
- **localStorage** (até integração completa com Supabase)

---

## Páginas Implementadas

### 1. Página de Login (`/login`)

**Arquivo**: `src/app/login/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=562-1196)

**Características**:
- Background: Imagem de fundo (`/login-background.webp`)
- Overlay: Gradiente `#1E293B` com opacidade 60-70%
- Logo: `/logo.svg` (308x158px)
- Título: "Sua próxima **aventura** começa aqui"
  - Fonte: Roboto Condensed Regular (400)
  - Tamanho: 48px
  - "aventura" em laranja `#FF5F38`
- Botões:
  - Entrar com Google
  - Entrar com Email
- Links: "Esqueci a senha" | "Cadastrar-se"

**Navegação**:
- Entrada: URL raiz ou redirect de páginas protegidas
- Saída: 
  - Login bem-sucedido → `/` (home)
  - Cadastrar-se → `/quiz/travel-purpose`

---

### 2. Escolha de Propósito (`/quiz/travel-purpose`)

**Arquivo**: `src/app/quiz/travel-purpose/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=572-1169)

**Características**:
- Background: `#FF5F38` (laranja vibrante)
- Título: "Bem-vindo(a) a CashTrip"
- Pergunta: "Qual o propósito das suas viagens?"
- 2 opções em cards verticais:
  - Férias (ícone: `/icons/Icon-férias.svg`)
  - Negócios (ícone: `/icons/Icon-negócios.svg`)
- Cards: 156x228px
- Botão: "Continuar" (desabilitado até selecionar)

**Estado**:
- Seleção única (radio button)
- Visual feedback: border + background + scale
- Armazenamento: `localStorage.travelPurpose`

**Navegação**:
- Entrada: Click em "Cadastrar-se" na página de login
- Saída: `/quiz/email`

---

### 3. Captura de Email (`/quiz/email`)

**Arquivo**: `src/app/quiz/email/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=577-1264)

**Características**:
- Background: `#FF5F38`
- Título: "Vamos começar"
- Pergunta: "Qual seu email?"
- Campo de input:
  - Ícone de email laranja
  - Placeholder: "seu@email.com"
  - Largura: 263px
  - Background branco com opacidade 20%
- Botão: "Continuar" azul escuro `#1E293B`

**Validação**:
- Campo obrigatório
- Formato de email (implícito pelo tipo)

**Armazenamento**:
- `localStorage.userEmail`

**Navegação**:
- Entrada: `/quiz/travel-purpose`
- Saída: `/quiz/password`

---

### 4. Criação de Senha (`/quiz/password`)

**Arquivo**: `src/app/quiz/password/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=580-1278)

**Características**:
- Background: `#FF5F38`
- Título: "Etapa 2"
- Pergunta: "Crie uma senha"
- 2 campos de senha:
  - Senha
  - Confirmar senha
  - Ícone de cadeado laranja
  - Ícone de olho para mostrar/esconder
  - Largura: 263px cada
- Botão: "Continuar" (desabilitado até senhas coincidirem)

**Validação**:
- Ambos os campos obrigatórios
- Senhas devem coincidir
- Alert se não coincidirem

**Funcionalidades**:
- Toggle de visibilidade de senha
- Feedback visual no botão

**Armazenamento**:
- `localStorage.userPassword`

**Navegação**:
- Entrada: `/quiz/email`
- Saída: `/quiz/username`

---

### 5. Nome de Usuário (`/quiz/username`)

**Arquivo**: `src/app/quiz/username/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=583-1307)

**Características**:
- Background: `#FF5F38`
- Título: "Etapa 3"
- Pergunta: "Como deseja ser chamado?"
- Campo de input:
  - Ícone de pessoa laranja
  - Placeholder: "Seu nome"
  - Largura: 263px
- Espaçamento: gap de 78px entre seções
- Botão: "Continuar"

**Validação**:
- Campo obrigatório
- Trim automático (remove espaços)
- Suporte para Enter key

**Armazenamento**:
- `localStorage.username`

**Navegação**:
- Entrada: `/quiz/password`
- Saída: `/quiz/gender` (primeira pergunta do quiz)

---

### 6. Pergunta 1 - Gênero (`/quiz/gender`)

**Arquivo**: `src/app/quiz/gender/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=419-628)

**Características**:
- Background: `#F1F1F1` (cinza claro)
- Barra de progresso: 4% (1 de 25 perguntas)
  - Gradiente de `#FF5F38` para `#FF896F`
  - 325x31px, rounded full
- Título: "Como você se identifica?"
  - Roboto Condensed Bold, 32px, `#FF5F38`
- Subtítulo: "Escolha uma opção que melhor te representa"
  - Inria Sans Bold, 16px, `#64748B`
- 3 opções verticais (212px largura):
  - Homem (`/icons/icon-homem.svg`)
  - Mulher (`/icons/icon-mulher.svg`)
  - Não-binário (`/icons/icon-não-binário.svg`)
- Cards: 116px altura, gap 19px
- Botão: "Próxima pergunta" com seta

**Estados dos Cards**:
- Não selecionado: Branco, shadow suave
- Selecionado:
  - Background: `#FF5F38` 25% opacidade
  - Border: 2px `#FF5F38`
  - Shadow: glow laranja
  - **Ícone fica laranja** (filtro CSS)

**Armazenamento**:
- `localStorage.gender`: "male" | "female" | "non-binary"

**Navegação**:
- Entrada: `/quiz/username`
- Saída: `/quiz/location`

---

### 7. Pergunta 2 - Localização (`/quiz/location`)

**Arquivo**: `src/app/quiz/location/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=419-677)

**Características**:
- Background: `#F1F1F1`
- Barra de progresso: 8% (2 de 25)
- Título: "Onde você mora?"
- 2 campos de input com labels flutuantes:
  - Estado (344px largura, 86px altura total)
  - Cidade (344px largura, 86px altura total)
- Gap entre campos: 40px

**Design dos Campos**:
- Label flutuante sobre a borda:
  - Texto: "Estado:" / "Cidade:"
  - Roboto Regular, 16px, `#E6502C`
  - Background: `#F1F1F1` para cobrir border
- Input:
  - 61px altura
  - Border: 1px `#E6502C`
  - Border-radius: 30px
  - Focus: border 2px `#FF5F38`

**Validação**:
- Ambos os campos obrigatórios
- Trim automático

**Armazenamento**:
```json
{
  "location": {
    "state": "São Paulo",
    "city": "São Paulo"
  }
}
```

**Navegação**:
- Entrada: `/quiz/gender`
- Saída: `/quiz/age`

---

### 8. Pergunta 3 - Idade (`/quiz/age`)

**Arquivo**: `src/app/quiz/age/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=424-366)

**Características**:
- Background: `#F1F1F1`
- Barra de progresso: 12% (3 de 25)
- Título: "Qual a sua idade?"
- Subtítulo: "Escolha uma opção que melhor te representa"
- Layout em grid 3 linhas:
  - Linha 1: 2 cards (156px cada)
  - Linha 2: 2 cards (156px cada)
  - Linha 3: 1 card maior (316px)
- Altura dos cards: 124px
- Gap vertical: 10px

**5 Faixas Etárias**:
1. 18 a 25 anos
2. 26 a 35 anos
3. 36 a 45 anos
4. 46 a 55 anos
5. Acima de 56 anos

**Estados dos Botões**:
- Não selecionado: Branco, border `#1E293B`
- Selecionado: Background laranja, border `#E6502C`, shadow glow, texto laranja

**Armazenamento**:
- `localStorage.age`: "18-25" | "26-35" | "36-45" | "46-55" | "56+"

**Navegação**:
- Entrada: `/quiz/location`
- Saída: `/quiz/income`

---

### 9. Pergunta 4 - Renda Mensal (`/quiz/income`)

**Arquivo**: `src/app/quiz/income/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=424-440)

**Características**:
- Background: `#F1F1F1`
- Barra de progresso: 16% (4 de 25)
- Título: "Renda mensal média"
- Mesmo layout grid da página de idade (2-2-1)

**5 Faixas de Renda**:
1. Até R$ 2.000
2. R$ 2.000 a R$ 5.000
3. R$ 5.000 a R$ 10.000
4. R$ 10.000 a R$ 20.000
5. Acima de R$ 20.000

**Design Idêntico à Idade**:
- Mesmos tamanhos de cards
- Mesmos estados visuais
- Mesmo padrão de interação

**Armazenamento**:
- `localStorage.income`: "0-2000" | "2000-5000" | "5000-10000" | "10000-20000" | "20000+"

**Navegação**:
- Entrada: `/quiz/age`
- Saída: `/quiz/transition`

---

### 10. Transição de Níveis (`/quiz/transition`)

**Arquivo**: `src/app/quiz/transition/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=424-485)

**Características**:
- Background: `#FF5F38` full-screen
- Indicador visual de 5 níveis (307x31px):
  - Barra de progresso cinza `rgba(100,116,139,0.1)`
  - 5 círculos brancos com labels:
    1. Nível 1 (15px)
    2. Nível 2 (15px)
    3. Nível 3 (15px)
    4. Nível 4 (15px)
    5. Bônus (10px)
  - Labels: Roboto Condensed Black, 12px
  - Shadow: 1px 1px 4px rgba(0,0,0,0.25)

**Mensagem Motivacional** (11 linhas):
```
Agora,
Para entendermos
melhor sobre você
e te entregarmos
as melhores
experiências

Vamos descobrir
o seu perfil de
viajante

Preparado(a)?
```
- Fonte: Roboto Bold, 36px, branco
- Centralizado

**Botão**: "Sim estou"
- 232x61px
- Background: `#1E293B`
- Border-radius: 40px
- Shadow: 2px 2px 9px rgba(0,0,0,0.25)

**Objetivo**:
- Marca a conclusão do Nível 1 (demográfico)
- Prepara o usuário para o Nível 2 (perfil)
- Fornece contexto sobre o sistema de níveis

**Navegação**:
- Entrada: `/quiz/income`
- Saída: `/quiz/traveler-type` (início do Nível 2)

---

### 11. Pergunta 5 - Tipo de Viajante (`/quiz/traveler-type`)

**Arquivo**: `src/app/quiz/traveler-type/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=428-373)

**Características**:
- Background: `#F1F1F1`
- **Nova barra de progresso**:
  - Horizontal com gradiente laranja
  - Texto: "Conhecimento sobre você"
  - Porcentagem: "10%"
  - Design: 325x41px
  - Texto descritivo à esquerda
  - Porcentagem laranja à direita
- Título: "Qual tipo de viajante você se considera?"
  - Roboto Condensed Bold, 36px, `#FF5F38`
- Subtítulo: "Escolha até 2:"
  - Roboto Condensed SemiBold, 24px, `#64748B`

**6 Opções de Estilo** (múltipla seleção - até 2):
1. Aventureiro (`/icons/icon-aventureiro.svg`)
2. Cultural (`/icons/icon-cultural.svg`)
3. Relax (`/icons/icon-relax.svg`)
4. Luxo (`/icons/icon-luxo.svg`)
5. Econômico (`/icons/icon-econômico.svg`)
6. Equilibrado (`/icons/icon-Equilibrado.svg`)

**Design dos Cards**:
- Tamanho: 334x172px
- Gap: 12px
- Ícone: Centralizado embaixo (63px do topo)
- Label: Centralizado em cima (6px do topo)
- Roboto Condensed Bold, 24px

**Funcionalidade Única - Múltipla Seleção**:
- Permite selecionar até 2 opções
- Se já tem 2 e clica em outra: substitui a primeira
- Toggle: clica novamente para desmarcar
- Array de selecionados

**Botão Flutuante** (PADRÃO CIRCULAR):
- Aparece apenas quando tem seleção
- Fixed no canto inferior direito
- Tamanho: 80x80px (w-20 h-20)
- Formato: Círculo (rounded-full)
- Background: Gradiente laranja vertical
  - `from-[#FF896F] via-[#FF5F38] to-[#E6502C]`
- Shadow: 2px 2px 4px rgba(0,0,0,0.25)
- Conteúdo: Apenas ícone de seta (sem texto)
- Posição: bottom-4 right-4 (16px das bordas)
- Hover: scale 110%
- Z-index: 50

**Armazenamento**:
```json
{
  "travelerType": ["adventurer", "cultural"]
}
```

**Navegação**:
- Entrada: `/quiz/transition`
- Saída: `/quiz/travel-pace`

---

### 12. Pergunta 6 - Ritmo de Viagem (`/quiz/travel-pace`)

**Arquivo**: `src/app/quiz/travel-pace/page.tsx`

**Design Figma**: [Link](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=442-386)

**Características**:
- Background: `#F1F1F1`
- Barra de progresso: 40% (6 de 25)
  - Mesmo estilo da página anterior
  - "Conhecimento sobre você"
  - Progresso: 27.7% da barra (90px de 325px)
- Título: "Qual é o ritmo ideal das suas viagens?"
  - Roboto Condensed Bold, 36px, `#FF5F38`
  - 3 linhas
- Subtítulo: "Escolha a que melhor define"
  - Roboto Condensed SemiBold, 24px, `#64748B`

**3 Opções de Ritmo** (seleção única):
1. **Agitado**
   - Descrição: "(Máximo de atividades por dia)"
   - Ícone: `/icons/Icon-agitado.svg`
2. **Equilibrado**
   - Descrição: "(Mescla atividades e pausas)"
   - Ícone: `/icons/icon-Equilibrado.svg`
3. **Tranquilo/zen**
   - Descrição: "(Tempo livre, poucas atividades)"
   - Ícone: `/icons/Icon-Tranquilo-Zen.svg`

**Design dos Cards**:
- Tamanho: 335x172px
- Gap: 28px
- Border-radius: 20px
- Border: 3px
- Layout interno:
  - Ícone à esquerda: 90x90px
  - Textos à direita:
    - Label: Roboto Condensed ExtraBold, 32px
    - Descrição: Roboto Condensed Regular, 13px

**Estados dos Cards**:
- Não selecionado:
  - Background: Branco
  - Border: `#1E293B`
  - Texto: `#1E293B`
- Selecionado:
  - Background: `rgba(230, 80, 44, 0.3)`
  - Border: `#FF5F38`
  - Shadow: 2px 2px 9px rgba(255,95,56,1)
  - Texto: `#E6502C`
  - Ícone: Filtro laranja
  - Badge de check no canto superior direito:
    - 40x40px
    - Background: `#E6502C`
    - Check branco

**Botão Flutuante** (PADRÃO CIRCULAR):
- Aparece no canto inferior direito
- Tamanho: 80x80px (w-20 h-20)
- Formato: Círculo (rounded-full)
- Apenas ícone de seta (sem texto)
- Posição: bottom-4 right-4 (16px das bordas)
- Hover: scale 110%
- Z-index: 50

**Armazenamento**:
```json
{
  "travelPace": "agitado" | "equilibrado" | "tranquilo"
}
```

**Navegação**:
- Entrada: `/quiz/traveler-type`
- Saída: `/quiz/complete` (temporário - próximas 19 perguntas)

---

## Padrões de Design

### 1. Cores Principais

```css
/* Laranja Primário */
#FF5F38  /* Títulos, highlights */

/* Laranja Gradientes */
#FF896F  /* Laranja claro (início gradiente) */
#FF5F38  /* Laranja médio */
#E6502C  /* Laranja escuro (fim gradiente) */

/* Azul Escuro */
#1E293B  /* Botões primários, borders não selecionados */

/* Cinzas */
#F1F1F1  /* Background das páginas de quiz */
#64748B  /* Textos secundários, subtítulos */

/* Estados */
rgba(255, 95, 56, 0.25)  /* Background selecionado (laranja 25%) */
rgba(230, 80, 44, 0.3)   /* Background selecionado alternativo */
```

### 2. Tipografia

**Roboto Condensed**:
- Weight 400 (Regular): Texto corrido, labels de input
- Weight 700 (Bold): Títulos de seção, headers
- Weight 900 (Black): Títulos principais, ênfase máxima

**Inria Sans**:
- Weight 400 (Regular): Corpo de texto
- Weight 700 (Bold): Botões, subtítulos, instruções

**Tamanhos Comuns**:
- 48px: Título login (Roboto Condensed)
- 40px: Boas-vindas (Roboto Condensed)
- 36px: Títulos de pergunta (Roboto Condensed)
- 32px: Subtítulos importantes (Roboto Condensed)
- 24px: Labels de cards, instruções (Roboto Condensed)
- 20px: Botões principais (Inria Sans / Roboto)
- 16px: Subtítulos secundários, labels (Inria Sans)
- 12px: Labels pequenos, badges (Roboto Condensed)
- 10px: Porcentagens, informações micro (Roboto)

### 3. Espaçamentos

**Padding de Páginas**:
- Topo: 25-36px
- Laterais: 16-25px
- Fundo: 80px (espaço para botão flutuante)

**Gaps Entre Elementos**:
- Seções principais: 30-40px
- Entre cards: 10-19px
- Entre inputs: 40px
- Entre título e subtítulo: 10-30px

### 4. Tamanhos de Cards

**Cards de Opção Pequenos** (Idade, Renda):
- 2 colunas: 156px largura
- 1 coluna larga: 316px largura
- Altura: 124px
- Border-radius: 20px
- Border: 2-3px

**Cards de Opção Grandes** (Tipo de Viajante):
- Largura: 334px
- Altura: 172px
- Border-radius: 20px
- Border: 3px

**Cards de Escolha** (Férias/Negócios):
- Largura: 156px
- Altura: 228px
- Border-radius: 16px (2xl)
- Border: 3px

### 5. Botões

**Botão Primário** (Continuar/Próxima):
- Tamanho padrão: 232-240px x 51-61px
- Border-radius: 30-40px
- Shadow: 2px 2px 9px rgba(0,0,0,0.25)
- Font: Bold, 20px
- Estados:
  - Ativo: Background sólido, cursor pointer, hover scale
  - Desabilitado: Opacidade 50%, cursor not-allowed

**Botão Flutuante Circular**:
- Tamanho: 80x80px (w-20 h-20)
- Formato: Círculo perfeito (rounded-full)
- Position: Fixed bottom-4 right-4
- Background: Gradiente vertical laranja (`from-[#FF896F] via-[#FF5F38] to-[#E6502C]`)
- Conteúdo: Apenas ícone de seta (sem texto)
- Shadow: 2px 2px 4px rgba(0,0,0,0.25)
- Animação: Scale 110% no hover
- Z-index: 50 (acima de outros elementos)

### 6. Barra de Progresso

**Tipo 1 - Circular/Pill** (Nível 1):
- Largura: 325px
- Altura: 31px
- Background: Branco
- Fill: Gradiente `#FF5F38` → `#FF896F`
- Border-radius: Full
- Transição: 300ms

**Tipo 2 - Horizontal com Texto** (Nível 2):
- Largura: 325px
- Altura: 41px (incluindo texto)
- Barra: 4px altura, top 26px
- Background barra: `rgba(100,116,139,0.1)`
- Fill: Gradiente `#FF896F` → `#FF5F38` → `#E6502C`
- Texto descritivo à esquerda
- Porcentagem laranja à direita

### 7. Estados de Seleção

**Não Selecionado**:
- Background: Branco (`#FBFDFF` ou `#FFFFFF`)
- Border: 2-3px `#1E293B` (azul escuro)
- Shadow: Suave 0.9px 0.9px 4px rgba(0,0,0,0.25)
- Texto: `#1E293B`
- Ícone: Cores originais

**Selecionado**:
- Background: `rgba(255, 95, 56, 0.25)` ou `rgba(230, 80, 44, 0.3)`
- Border: 2-3px `#E6502C` (laranja escuro)
- Shadow: Glow laranja 2px 2px 9px rgba(255,95,56,0.6-1.0)
- Texto: `#E6502C`
- Ícone: Filtro CSS para laranja

**Filtro CSS para Ícones Laranjas**:
```css
filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%);
```

### 8. Inputs

**Design Padrão**:
- Border: 1px `#E6502C`
- Border-radius: 30px
- Padding: 24px horizontal
- Background: Branco
- Focus: Border 2px `#FF5F38`
- Transição: Suave

**Com Label Flutuante**:
- Label posicionado sobre a borda superior
- Background do label igual à página (`#F1F1F1` ou `#FF5F38`)
- Padding do label: 1px horizontal

**Com Ícone**:
- Ícone à esquerda: Laranja (`#FF5F38` ou `#E6502C`)
- Gap: 12px entre ícone e input
- Ícone de ação à direita (olho, etc.)

---

## Sistema de Ícones

### Organização

Total de **127 ícones** organizados em `/public/icons/`

### Índice (`src/lib/quiz-icons.ts`)

```typescript
export const QUIZ_ICONS = {
  genero: {
    homem: "icon-homem",
    mulher: "icon-mulher",
    naoBinario: "icon-não-binário",
  },
  
  travelPurpose: {
    ferias: "Icon-férias",
    negocios: "Icon-negócios",
  },
  
  estiloViagem: {
    aventureiro: "icon-aventureiro",
    cultural: "icon-cultural",
    relax: "icon-relax",
    luxo: "icon-luxo",
    economico: "icon-econômico",
    equilibrado: "icon-Equilibrado",
    gastronomico: "icon-gastronômico",
  },
  
  hospedagens: {
    hotel: "hospedagem-hotel",
    resortBoutique: "hospedagem-Resort-boutique",
    airbnbCasa: "imagem-hospedagens-airbnb-casa",
    hostel: "imagem-hospedagens-hostel",
    ficarNaHospedagem: "icon-Ficar-na-Hospedagem",
  },
  
  localizacao: {
    beiraMarPraia: "Icon-beira-mar-praia",
    centroUrbano: "Icon-centro-urbano",
    naturezaMontanhas: "Icon-natureza-montanhas",
    pertoPontosTuristicos: "Icon-Perto-de-pontos-turísticos",
    pertoTransportePublico: "Icon-perto-de-transporte-público",
  },
  
  // ... e muitos outros organizados por categoria
};
```

### Uso dos Ícones

```tsx
import { QUIZ_ICONS } from "@/lib/quiz-icons";

// Exemplo
const icon = `/icons/${QUIZ_ICONS.estiloViagem.aventureiro}.svg`;

<Image
  src={icon}
  alt="Aventureiro"
  width={80}
  height={80}
/>
```

### Componente Helper

```tsx
// src/components/ui/QuizIcon.tsx
export function QuizIcon({ icon, alt, size = 48 }) {
  return (
    <Image
      src={icon}
      alt={alt}
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
```

---

## Próximos Passos

### Curto Prazo (Imediato)

1. **Completar Nível 2 do Quiz** (19 perguntas restantes)
   - ✅ Tipo de viajante
   - ✅ Ritmo de viagem
   - Hospedagens preferidas
   - Localização ideal da hospedagem
   - Essenciais na hospedagem
   - Preferências de alimentação
   - Restrições alimentares
   - Você treina com frequência?
   - Você viaja com pets?
   - Transporte preferido
   - Preferências de voos
   - Conexões em voos
   - Você tem veículo próprio?
   - Locomoção no destino
   - Atividades e lifestyle
   - Durante o dia, quais lugares prefere?
   - Durante a noite, o que prefere?
   - Que tipo de atrações te interessam?
   - Quais estilos musicais você mais gosta?
   - O que mais gosta de comer?
   - O que é indispensável na sua viagem?
   - Orçamento para regalias especiais

2. **Criar Página de Conclusão**
   - Animação de conclusão
   - Resumo das respostas
   - Criação da conta no Supabase
   - Redirect para dashboard

### Médio Prazo

3. **Integração Completa com Supabase**
   - Criar tabela `users` com todas as informações
   - Criar tabela `quiz_responses` para respostas
   - Implementar autenticação real (Google, Email Magic Link)
   - Migrar de localStorage para Supabase
   - Implementar recuperação de senha

4. **Dashboard do Usuário**
   - Visualização do perfil
   - Edição de respostas do quiz
   - Histórico de viagens planejadas
   - Configurações da conta

5. **Sistema de Recomendações**
   - IA para processar respostas do quiz
   - Geração de roteiros personalizados
   - Integração com APIs de viagem
   - Sugestões de destinos

### Longo Prazo

6. **Funcionalidades Avançadas**
   - Sistema de favoritos
   - Compartilhamento de roteiros
   - Planejamento colaborativo
   - Orçamento de viagens
   - Integração com calendários
   - Notificações push
   - Modo offline

7. **Otimizações**
   - Componentização do quiz (criar componentes reutilizáveis)
   - Sistema de cache para perguntas
   - Progressive Web App (PWA)
   - Otimização de imagens
   - Lazy loading de rotas
   - Analytics e tracking

8. **Testes**
   - Testes unitários (Jest, React Testing Library)
   - Testes E2E (Playwright, Cypress)
   - Testes de acessibilidade
   - Testes de performance

---

## Armazenamento de Dados

### Estrutura Atual (localStorage)

```typescript
// Cadastro
localStorage.travelPurpose: "vacation" | "business"
localStorage.userEmail: string
localStorage.userPassword: string (será hasheado no Supabase)
localStorage.username: string

// Nível 1 - Demográfico
localStorage.gender: "male" | "female" | "non-binary"
localStorage.location: { state: string, city: string }
localStorage.age: "18-25" | "26-35" | "36-45" | "46-55" | "56+"
localStorage.income: "0-2000" | "2000-5000" | "5000-10000" | "10000-20000" | "20000+"

// Nível 2 - Perfil de Viajante
localStorage.travelerType: ["adventurer", "cultural"] // array de até 2
localStorage.travelPace: "agitado" | "equilibrado" | "tranquilo"
// ... mais 19 perguntas
```

### Estrutura Futura (Supabase)

**Tabela: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Tabela: user_profiles**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  travel_purpose TEXT,
  gender TEXT,
  state TEXT,
  city TEXT,
  age_range TEXT,
  income_range TEXT,
  traveler_types TEXT[], -- array de até 2
  -- ... outros campos do quiz
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint

# Type checking
npm run type-check

# Limpar cache
rm -rf .next
npm run dev
```

---

## Estrutura de Componentes Reutilizáveis (Futuro)

```tsx
// components/quiz/QuizLayout.tsx
// Layout padrão para páginas de quiz

// components/quiz/ProgressBar.tsx
// Barra de progresso reutilizável (tipo 1 e tipo 2)

// components/quiz/QuizCard.tsx
// Card de opção reutilizável

// components/quiz/QuizButton.tsx
// Botão de navegação reutilizável

// components/quiz/FloatingButton.tsx
// Botão flutuante reutilizável

// components/quiz/QuizInput.tsx
// Input com label flutuante

// components/quiz/MultipleChoice.tsx
// Sistema de múltipla escolha
```

---

## Resumo Executivo

### O que foi construído:
- ✅ Sistema completo de autenticação e cadastro
- ✅ 4 páginas de onboarding
- ✅ 6 perguntas do quiz com diferentes padrões
- ✅ Sistema de transição entre níveis
- ✅ 127 ícones organizados e indexados
- ✅ 2 fontes customizadas configuradas
- ✅ Sistema de armazenamento temporário
- ✅ Múltiplos padrões de UI (cards, inputs, botões, barras)
- ✅ Botão flutuante circular (80x80px, canto inferior direito)

### Tecnologia:
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS v4
- Supabase (preparado)

### Próximos marcos:
1. Completar 19 perguntas restantes
2. Integrar Supabase completamente
3. Criar dashboard
4. Implementar IA de recomendações

---

**Última atualização**: 11 de Novembro de 2025
**Versão**: 1.1.0
**Status**: Em desenvolvimento ativo


