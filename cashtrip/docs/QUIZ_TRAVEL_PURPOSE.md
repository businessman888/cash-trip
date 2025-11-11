# 🎯 Página: Propósito da Viagem

## ✅ Implementado

Criada a primeira página do quiz onde o usuário escolhe entre **Férias** ou **Negócios**.

---

## 📍 Rota

```
/quiz/travel-purpose
```

---

## 🎨 Design

Implementado pixel-perfect do Figma:
- **Background**: #FF5F38 (laranja vibrante)
- **Título**: "Bem-vindo(a) a CashTrip" (40px, font-black)
- **Subtítulo**: "Qual o propósito das suas viagens?" (24px, font-normal)
- **Cards**: 156x228px com borda branca (3px)
- **Botão**: "Continuar" (232x61px, bg-[#1E293B])

---

## 🎯 Funcionalidades

### **1. Seleção de Opção**
- ✅ Clique em "Férias" ou "Negócios"
- ✅ Feedback visual (scale-105, bg-white/10)
- ✅ Apenas uma opção selecionável por vez

### **2. Navegação**
- ✅ Botão "Continuar" desabilitado até seleção
- ✅ Salva escolha em localStorage
- ✅ Redireciona para `/quiz/gender`

### **3. Estados Visuais**
```tsx
// Não selecionado
border-white/80 hover:border-white hover:bg-white/5

// Selecionado
border-white bg-white/10 scale-105
```

---

## 🔗 Integração

### **Link de Cadastro Atualizado**

Na página de login (`/login`):
```tsx
<Link href="/quiz/travel-purpose">
  Cadastrar-se
</Link>
```

Agora o usuário vai direto para o quiz ao clicar em "Cadastrar-se".

---

## 🖼️ Ícones

### **Ícones Criados:**

1. **Icon-férias.svg** 
   - Pessoa com mochila/praia
   - Cores: #1E293B, #F5C876, #F2A159
   
2. **Icon-negócios.svg**
   - Maleta profissional
   - Cores: #1E293B, #F5C876, #4EA4B0

**Localização:** `/public/icons/`

---

## 💾 Armazenamento

### **LocalStorage (Temporário)**

```tsx
localStorage.setItem("travelPurpose", selected);
// Valores: "vacation" | "business"
```

### **Próximo Passo: Supabase**

Será migrado para tabela `user_preferences`:
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  travel_purpose TEXT, -- 'vacation' ou 'business'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎭 Componente

```tsx
"use client";

export default function TravelPurposePage() {
  const [selected, setSelected] = useState<TravelPurpose>(null);
  
  const handleContinue = () => {
    localStorage.setItem("travelPurpose", selected);
    router.push("/quiz/gender");
  };

  return (
    <main className="bg-[#FF5F38]">
      {/* Textos */}
      <h1>Bem-vindo(a) a CashTrip</h1>
      <h2>Qual o propósito das suas viagens?</h2>
      
      {/* Opções */}
      <button onClick={() => setSelected("vacation")}>
        <Image src="/icons/Icon-férias.svg" />
        <span>Férias</span>
      </button>
      
      <button onClick={() => setSelected("business")}>
        <Image src="/icons/Icon-negócios.svg" />
        <span>Negócios</span>
      </button>
      
      {/* Continuar */}
      <button onClick={handleContinue} disabled={!selected}>
        Continuar
      </button>
    </main>
  );
}
```

---

## 🧪 Como Testar

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse a página de login:**
   ```
   http://localhost:3000/login
   ```

3. **Clique em "Cadastrar-se"**
   - Será redirecionado para `/quiz/travel-purpose`

4. **Teste as interações:**
   - ✅ Clique em "Férias" → visual muda
   - ✅ Clique em "Negócios" → visual muda
   - ✅ Botão fica habilitado após seleção
   - ✅ Clique em "Continuar" → vai para `/quiz/gender`

---

## 📱 Responsividade

- ✅ Mobile-first (max-w-[375px])
- ✅ Cards lado a lado em mobile
- ✅ Textos adaptados
- ✅ Botões touch-friendly (min 44px height)

---

## 🎨 Cores do Brand

```css
--primary-orange: #FF5F38
--dark-blue: #1E293B
--accent-red: #E6502C
--white: #FFFFFF
--gold: #F5C876
```

---

## 🚀 Próxima Página

Após clicar em "Continuar", o usuário vai para:

**`/quiz/gender`** - Pergunta sobre gênero
- Opções: Homem, Mulher, Não-binário
- Ícones já disponíveis em `/public/icons/`

---

## 📊 Fluxo Completo

```
/login (Cadastrar-se)
    ↓
/quiz/travel-purpose (Férias ou Negócios)
    ↓
/quiz/gender (Gênero)
    ↓
/quiz/... (25 perguntas)
    ↓
/quiz/result (Perfil gerado)
```

---

## ✨ Melhorias Futuras

- [ ] Animações de transição entre páginas
- [ ] Barra de progresso (1/26 perguntas)
- [ ] Salvar automaticamente no Supabase
- [ ] Permitir voltar para pergunta anterior
- [ ] Modo offline com sync posterior

---

## 🎉 Status

✅ **Página Completa e Funcional**

- Design pixel-perfect do Figma
- Interatividade total
- Navegação fluída
- Ícones customizados
- Código limpo e type-safe

**Pronto para a próxima etapa!** 🚀


