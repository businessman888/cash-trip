# 🖼️ Setup do Sistema de Imagens - Cash Trip

## ✅ O Que Já Foi Implementado

### 1. Configuração
- ✅ Credenciais Unsplash adicionadas ao `.env.local`
- ✅ Service Role Key configurada
- ✅ Dependência `unsplash-js` instalada

### 2. Código
- ✅ Migrations SQL criadas (`places` e `images`)
- ✅ Cliente Unsplash (`src/lib/unsplash/client.ts`)
- ✅ API Route (`/api/places/[placeId]/images`)
- ✅ Componente `CTImage`
- ✅ Hook `usePlaceImages`

---

## 📋 Próximos Passos (Você Precisa Fazer)

### Passo 1: Executar as Migrations no Supabase

Você tem **2 opções**:

#### Opção A: Via Supabase Dashboard (Mais Fácil)

1. Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/editor

2. Vá em **SQL Editor** → **New Query**

3. **Copie e cole o conteúdo completo** do arquivo:
   `supabase/migrations/001_create_places_table.sql`

4. Clique em **Run** (ou pressione Ctrl+Enter)

5. Repita com o arquivo:
   `supabase/migrations/002_create_images_table.sql`

6. ✅ Pronto! Tabelas criadas.

#### Opção B: Via Supabase CLI (Se tiver instalado)

```bash
cd cashtrip
supabase db push
```

---

### Passo 2: Criar os Buckets no Supabase Storage

1. Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/storage/buckets

2. Clique em **New Bucket**

3. Criar bucket `places`:
   - Name: `places`
   - Public: ✅ **Yes** (marcar como público)
   - File size limit: 50 MB (padrão)
   - Clique em **Create bucket**

4. Criar bucket `users`:
   - Name: `users`
   - Public: ✅ **Yes** (marcar como público)
   - Clique em **Create bucket**

---

### Passo 3: Configurar Policies do Storage

1. No bucket `places`, clique nos **3 pontinhos** → **Policies**

2. Adicione policy de **SELECT** (leitura pública):
   ```sql
   create policy "public_read_places"
   on storage.objects for select
   to public
   using (bucket_id = 'places');
   ```

3. Adicione policy de **INSERT** (apenas service role):
   ```sql
   create policy "service_role_insert_places"
   on storage.objects for insert
   to service_role
   with check (bucket_id = 'places');
   ```

4. Repita para o bucket `users` (substituindo 'places' por 'users')

---

### Passo 4: Habilitar Image Transformations

1. Acesse: https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/storage/settings

2. Procure por **Image Transformations**

3. Clique em **Enable** ou **Configure**

4. ✅ Confirme que está ativado

---

### Passo 5: Criar um Destino de Teste

1. Vá em **SQL Editor** → **New Query**

2. Execute este SQL para criar Cape Town como teste:

```sql
INSERT INTO public.places (name, city, country, country_code, is_popular)
VALUES 
  ('Cape Town', 'Cape Town', 'South Africa', 'ZA', true)
RETURNING *;
```

3. **Copie o `id` retornado** (algo como: `123e4567-e89b-12d3-a456-426614174000`)

---

## 🧪 Como Testar

### Teste 1: API Route Direta

Abra no navegador ou Postman:

```
http://localhost:3000/api/places/SEU_PLACE_ID_AQUI/images
```

**Resultado esperado:**
- Primeira vez: Busca no Unsplash, faz upload, retorna URLs
- Próximas vezes: Retorna do cache (muito rápido)

### Teste 2: Componente React

Crie uma página de teste em `src/app/test-images/page.tsx`:

```typescript
'use client'

import { usePlaceImages } from '@/hooks/usePlaceImages'
import { CTImage } from '@/components/ui/CTImage'

export default function TestImagesPage() {
  const placeId = 'SEU_PLACE_ID_AQUI' // Cole o ID do Cape Town
  const { heroImage, galleryImages, loading, error, cached } = usePlaceImages(placeId)

  if (loading) return <div className="p-10">Carregando imagens...</div>
  if (error) return <div className="p-10 text-red-500">Erro: {error}</div>

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <h1 className="text-4xl font-bold text-white mb-4">
        Teste de Imagens - Cape Town
      </h1>
      
      <p className="text-white mb-8">
        {cached ? '✅ Cache hit (rápido!)' : '⏳ Buscando do Unsplash...'}
      </p>

      {/* Hero Image */}
      {heroImage && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Hero Image</h2>
          <CTImage
            src={heroImage.urls.large_1080}
            alt="Cape Town Hero"
            width={1080}
            height={600}
            dominantColor={heroImage.dominant_hex}
            className="rounded-xl"
          />
          {heroImage.author && (
            <p className="text-sm text-gray-400 mt-2">
              Foto por{' '}
              <a 
                href={heroImage.author_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                {heroImage.author}
              </a>
              {' '}no Unsplash
            </p>
          )}
        </div>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Galeria ({galleryImages.length} imagens)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.map((img) => (
              <CTImage
                key={img.id}
                src={img.urls.medium_720}
                alt={`Cape Town ${img.id}`}
                width={720}
                height={480}
                dominantColor={img.dominant_hex}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

Acesse: `http://localhost:3000/test-images`

---

## 📊 Verificar no Dashboard

### Ver imagens no Storage:
https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/storage/buckets/places

### Ver registros na tabela images:
https://supabase.com/dashboard/project/iqcjzgfghozcplndpmoo/editor

```sql
SELECT * FROM public.images ORDER BY created_at DESC LIMIT 10;
```

---

## 🐛 Troubleshooting

### Erro: "relation public.places does not exist"
- Você esqueceu de rodar a migration 001. Execute o SQL no dashboard.

### Erro: "bucket does not exist"
- Você esqueceu de criar os buckets. Vá em Storage e crie.

### Erro: "Failed to download image"
- Verifique se as credenciais Unsplash estão corretas no `.env.local`
- Reinicie o servidor: `npm run dev`

### Imagens não aparecem
- Verifique se habilitou Image Transformations
- Verifique se os buckets são públicos
- Verifique as policies do Storage

---

## 📈 Próximos Passos (Após Funcionar)

1. ✅ Testar com outros destinos (Paris, Londres, Tokyo)
2. ✅ Implementar Edge Functions para warming
3. ✅ Criar script de seed para top 1000 destinos
4. ✅ Integrar nas telas reais do app
5. ✅ Adicionar analytics de imagens mais vistas

---

## 🎉 Deu tudo certo?

Se as imagens estão aparecendo, parabéns! Você tem um sistema de imagens completo com:
- ✅ Cache progressivo (lazy loading)
- ✅ Deduplicação automática
- ✅ CDN global do Supabase
- ✅ Transformações on-the-fly (WebP)
- ✅ Atribuição correta aos fotógrafos
- ✅ Custos otimizados

**Pronto para escalar!** 🚀




