# Página de Transição do Quiz

## Data: 10 de Novembro de 2025

## Descrição

Página de transição entre o Nível 1 (perguntas demográficas) e o restante do quiz. Apresenta o sistema de níveis e prepara o usuário para as próximas perguntas sobre perfil de viajante.

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=424-485&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#FF5F38` (laranja vibrante - full screen)
- **Padding**: 52px vertical
- **Estrutura**: Vertical flex com gap 30px
- **Alinhamento**: Centralizado

### Componentes

#### 1. Indicador de Níveis
- **Container**: 307px x 31px
- **Elementos**:
  - Barra de progresso cinza clara (background)
  - 5 círculos brancos representando níveis
  - Labels abaixo de cada círculo

**Níveis:**
1. **Nível 1** (posição: 38px) - 15px círculo
2. **Nível 2** (posição: 104px) - 15px círculo
3. **Nível 3** (posição: 171px) - 15px círculo
4. **Nível 4** (posição: 237px) - 15px círculo
5. **Bônus** (posição: 284px) - 10px círculo

**Estilo dos Labels:**
- Fonte: Roboto Condensed Black (900)
- Tamanho: 12px
- Cor: Branco
- Line-height: 1.17em
- Sombra: 1px 1px 4px rgba(0,0,0,0.25)

#### 2. Texto Principal
**Mensagem Motivacional:**
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

**Estilo:**
- Fonte: Roboto Bold (700)
- Tamanho: 36px
- Cor: Branco
- Line-height: 1.17em
- Alinhamento: Centro
- 11 linhas de texto com espaçamentos estratégicos

#### 3. Botão "Sim estou"
- Largura: 232px
- Altura: 61px
- Background: `#1E293B` (azul escuro)
- Border-radius: 40px
- Sombra: 2px 2px 9px rgba(0,0,0,0.25)
- Texto: Roboto Bold, 20px, branco
- Hover: Cor mais clara `#2d3f5f`

## Funcionalidades

- ✅ Página estática sem estado
- ✅ Mostra progresso por níveis do quiz
- ✅ Mensagem motivacional e preparatória
- ✅ Botão de confirmação para prosseguir
- ✅ Transição visual do quiz demográfico para perfil de viajante

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/income` (após selecionar renda mensal)

### Saída  
- Vai para: `/quiz/complete` (temporário - será próxima pergunta do perfil)

## Sistema de Níveis do Quiz

### Nível 1 (Concluído) ✅
Perguntas demográficas básicas:
1. Gênero
2. Localização (Estado e Cidade)
3. Idade
4. Renda Mensal

### Nível 2 (Próximo)
Perfil de viajante:
- Estilo de viagem
- Preferências de hospedagem
- Atividades favoritas
- etc.

### Nível 3
Preferências específicas de viagem

### Nível 4
Preferências avançadas

### Bônus
Perguntas extras para personalização máxima

## Arquivos

### Criados
- `cashtrip/src/app/quiz/transition/page.tsx`
- `cashtrip/docs/QUIZ_TRANSITION_PAGE.md`

### Modificados
- `cashtrip/src/app/quiz/income/page.tsx`
  - Atualizado redirecionamento para `/quiz/transition`

## Progresso do Quiz

### Nível 1 Completo ✅
1. ✅ **Gênero** (pergunta 1)
2. ✅ **Localização** (pergunta 2)
3. ✅ **Idade** (pergunta 3)
4. ✅ **Renda Mensal** (pergunta 4)
5. ✅ **Transição** (página atual)

### Próximos Passos
- Nível 2: Perfil de viajante (21 perguntas restantes)

## Design Pattern

Esta página estabelece o padrão de transição entre níveis:
- Background laranja full-screen
- Indicador visual de progresso por níveis
- Mensagem motivacional
- Botão de confirmação para prosseguir

## Status
✅ Página criada conforme design Figma  
✅ Indicador de níveis implementado  
✅ Mensagem motivacional formatada  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  

## Próximos Passos
1. Criar perguntas do Nível 2 (perfil de viajante)
2. Implementar lógica para destacar nível atual
3. Criar página de conclusão final
4. Implementar salvamento completo no Supabase




