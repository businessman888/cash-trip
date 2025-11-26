# Implementação da Página Rascunhos

## Resumo da Implementação

A página **Rascunhos** foi implementada com sucesso seguindo fielmente o design do Figma. A página permite aos usuários visualizar locais salvos e roteiros pendentes através de um sistema de abas.

## Arquivos Criados

### 1. Página Principal
- **Arquivo**: `src/app/rascunhos/page.tsx`
- **Descrição**: Página principal com header, navegação por abas e lista de cards de localização
- **Funcionalidades**:
  - Header com botão de voltar e título "Rascunhos"
  - Sistema de abas (Locais Salvos / Roteiros pendentes)
  - Grid de cards de localização
  - Estado vazio quando não há locais/roteiros
  - Suporte completo a dark mode

### 2. Componente TabSelector
- **Arquivo**: `src/components/rascunhos/TabSelector.tsx`
- **Descrição**: Componente de seleção de abas reutilizável
- **Funcionalidades**:
  - Duas abas: "Locais Salvos" e "Roteiros pendentes"
  - Estilo ativo com cor primária (#FF5F38)
  - Transições suaves
  - Sombra no botão ativo
  - Suporte a dark mode usando variáveis CSS

### 3. Componente LocationCard
- **Arquivo**: `src/components/rascunhos/LocationCard.tsx`
- **Descrição**: Card de localização com imagem, informações e botão de ação
- **Funcionalidades**:
  - **Imagem do Unsplash**:
    - Integração com API do Unsplash
    - Cache automático usando localStorage
    - Estados de loading e erro
    - Imagens de 80x80px com cantos arredondados
  - **Informações**:
    - Nome do local (negrito)
    - Cidade/país (texto secundário)
    - Temperatura com ícone de sol
  - **Botão "Ver Local"**:
    - Cor coral (#FFB4A3)
    - Largura total
    - Hover effect
  - Suporte completo a dark mode

### 4. Atualização do Sidebar
- **Arquivo**: `src/components/dashboard/Sidebar.tsx`
- **Modificação**: Atualizado o href do item "Rascunhos" de `#` para `/rascunhos`

## Dados Mock

A página utiliza dados mock para demonstração:

```typescript
const mockLocations = [
    {
        id: '1',
        name: 'Museu do Louvre',
        location: 'Paris, França',
        temperature: 25,
        imageQuery: 'louvre museum paris',
        type: 'saved'
    },
    {
        id: '2',
        name: 'Torre de Belém',
        location: 'Lisboa, Portugal',
        temperature: 15,
        imageQuery: 'belem tower lisbon',
        type: 'saved'
    },
    {
        id: '3',
        name: 'Café Majestic',
        location: 'Porto, Portugal',
        temperature: 12,
        imageQuery: 'majestic cafe porto',
        type: 'saved'
    }
]
```

## Integração com Unsplash

### Cache de Imagens

O sistema utiliza o serviço existente `src/services/unsplash.ts` que implementa:

1. **Função `getRandomPhoto(query: string)`**:
   - Busca uma foto aleatória baseada na query
   - Armazena no localStorage com chave `cashtrip_unsplash_single_{query}`
   - Retorna imagem do cache se já existir
   - Evita chamadas repetidas à API

2. **Benefícios**:
   - ✅ Redução de chamadas à API
   - ✅ Carregamento mais rápido em visitas subsequentes
   - ✅ Economia de cota da API do Unsplash
   - ✅ Melhor experiência do usuário

### Exemplo de Cache

Primeira visita:
```
GET https://api.unsplash.com/photos/random?query=louvre+museum+paris
→ Imagem salva em localStorage
```

Visitas subsequentes:
```
localStorage.getItem('cashtrip_unsplash_single_louvre museum paris')
→ Imagem carregada do cache (sem chamada à API)
```

## Dark Mode

A página possui suporte completo a dark mode usando variáveis CSS:

- `--surface-main`: Fundo da página
- `--surface-card`: Fundo dos cards
- `--text-primary`: Texto principal
- `--text-secondary`: Texto secundário
- `--color-primary`: Cor primária da marca

## Responsividade

A página é totalmente responsiva:

- **Mobile**: Cards em coluna única com largura máxima de 448px
- **Tablet/Desktop**: Centralizado com `max-w-md mx-auto`
- **Espaçamento**: Padding consistente de 16px (px-4)
- **Gap entre cards**: 12px (space-y-3)

## Como Testar

1. **Acesse a aplicação**: http://localhost:3000
2. **Navegue para Rascunhos**:
   - Clique no menu hambúrguer (sidebar)
   - Clique em "Rascunhos"
3. **Teste as funcionalidades**:
   - ✅ Verifique se as imagens do Unsplash carregam
   - ✅ Alterne entre as abas "Locais Salvos" e "Roteiros pendentes"
   - ✅ Teste o dark mode (toggle no perfil)
   - ✅ Teste a responsividade (redimensione a janela)
   - ✅ Clique no botão "Ver Local" (console.log por enquanto)
   - ✅ Recarregue a página e verifique se as imagens vêm do cache

## Próximos Passos (Opcional)

1. **Integração com Backend**:
   - Substituir dados mock por dados reais do Supabase
   - Implementar CRUD de locais salvos
   - Implementar CRUD de roteiros pendentes

2. **Funcionalidade "Ver Local"**:
   - Criar página de detalhes do local
   - Implementar navegação para a página de detalhes

3. **Melhorias**:
   - Adicionar animações de transição entre abas
   - Implementar skeleton loading para os cards
   - Adicionar funcionalidade de busca/filtro
   - Implementar paginação se houver muitos itens

## Verificação de Conformidade com Figma

✅ Header com botão voltar e título centralizado
✅ Tabs com estilo correto (ativo em laranja, inativo transparente)
✅ Cards com imagem quadrada arredondada (80x80px)
✅ Nome do local em negrito
✅ Localização em texto secundário
✅ Temperatura com ícone de sol
✅ Botão "Ver Local" em coral (#FFB4A3)
✅ Espaçamento e padding conforme design
✅ Dark mode funcionando perfeitamente
✅ Responsividade total
