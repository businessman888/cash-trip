# Página de Localização do Quiz (Segunda Pergunta)

## Data: 10 de Novembro de 2025

## Descrição

Segunda pergunta do quiz: onde o usuário mora (estado e cidade).

## Design Figma

[Link do Design](https://www.figma.com/design/ZQa3T8EKAnndQYnTCGkJur/cashtrip?node-id=419-677&t=UAPE6fhcrdI1Pr2d-4)

## Características

### Layout
- **Background**: `#F1F1F1` (cinza claro)
- **Padding**: 30px topo, 16px laterais, 80px fundo
- **Estrutura**: Vertical flex com espaçamento de 10px

### Componentes

#### 1. Barra de Progresso
- Largura: 325px
- Altura: 31px
- Background: Branco
- Preenchimento: Gradiente de `#FF5F38` para `#FF896F`
- Progresso: 8% (pergunta 2 de 25)
- Border-radius: Full (pill shape)
- Transição suave de 300ms

#### 2. Textos
**Título Principal:**
- "Onde você mora?"
- Fonte: Roboto Condensed Bold (700)
- Tamanho: 32px
- Cor: `#FF5F38` (laranja)
- Line-height: 1.17em
- Quebra de linha após "você"

#### 3. Campos de Input
- **2 campos**: Estado e Cidade
- Largura: 344px cada
- Altura total: 86px (label + input)
- Gap entre campos: 40px
- Padding vertical da seção: 60px

**Design dos Campos:**
- **Label flutuante:**
  - Texto: "Estado:" / "Cidade:"
  - Fonte: Roboto Regular (400)
  - Tamanho: 16px
  - Cor: `#E6502C` (laranja escuro)
  - Posição: Sobre a borda do input
  - Background: `#F1F1F1` (para cobrir a borda)

- **Input:**
  - Altura: 61px
  - Border: 1px solid `#E6502C`
  - Border-radius: 30px
  - Background: Branco
  - Padding horizontal: 24px
  - Placeholder: "Digite seu estado" / "Digite sua cidade"
  - Focus: Border muda para 2px `#FF5F38`

#### 4. Botão "Próxima pergunta"
- Largura: 240px
- Altura: 51px
- Background: `#FF896F` (laranja claro)
- Border-radius: 30px
- Texto: Inria Sans Bold, 20px, branco
- Ícone de seta à direita
- Padding vertical: 40px
- Estados:
  - **Desabilitado**: Opacidade 50% quando campos vazios
  - **Habilitado**: Hover com cor mais escura

## Funcionalidades

- ✅ Validação: Ambos os campos obrigatórios
- ✅ Trim automático (remove espaços extras)
- ✅ Feedback visual no focus do input
- ✅ Botão desabilitado até preencher ambos
- ✅ Armazenamento no localStorage
- ✅ Barra de progresso atualizada (8%)

## Fluxo de Navegação

### Entrada
- Vem de: `/quiz/gender` (após selecionar gênero)

### Saída  
- Vai para: `/quiz/complete` (temporário - será próxima pergunta)

## Armazenamento

### localStorage (Temporário)
```json
{
  "location": {
    "state": "São Paulo",
    "city": "São Paulo"
  }
}
```

*Nota: Todo o quiz será salvo no Supabase ao final*

## Arquivos

### Criados
- `cashtrip/src/app/quiz/location/page.tsx`
- `cashtrip/docs/QUIZ_LOCATION_PAGE.md`

### Modificados
- `cashtrip/src/app/quiz/gender/page.tsx`
  - Atualizado redirecionamento para `/quiz/location`
  - Ícones ficam laranjas quando selecionados (filtro CSS)

## Melhorias na Página Anterior (Gênero)

### Ícone Laranja ao Selecionar
Adicionado filtro CSS para que o ícone fique laranja quando a opção é selecionada:
- Filtro: `invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(118%) contrast(119%)`
- Transição suave de 200ms
- Resultado: Ícone muda para `#FF5F38` junto com o card

## Progresso do Quiz

### Perguntas Concluídas
1. ✅ **Gênero** (página 1)
2. ✅ **Localização** (página 2 - atual)
3. ⏳ Próximas 23 perguntas

## Status
✅ Página criada conforme design Figma  
✅ Barra de progresso atualizada (8%)  
✅ Campos de input com labels flutuantes  
✅ Validações funcionando  
✅ Navegação configurada  
✅ Responsividade implementada  
✅ Sem erros de lint  
✅ Melhoria na página anterior (ícones laranjas)  

## Próximos Passos
1. Criar as próximas 23 perguntas do quiz
2. Criar página de conclusão
3. Implementar salvamento completo no Supabase
4. Adicionar autocomplete para estados/cidades brasileiras


