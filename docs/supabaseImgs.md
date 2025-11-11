dá para hospedar todas as imagens da Cash Trip no Supabase Storage com 

alta performance e baixo custo, sem depender de Unsplash em tempo real. 

Abaixo está um blueprint pronto para você seguir. 

Visão geral da arquitetura (Supabase) 

1.  Bucket no Storage (ex.: places + users):  

> o

places/PLACE_ID/hero.jpg  

> o

places/PLACE_ID/gallery/UUID.jpg  

> o

users/USER_ID/avatar.jpg 

2.  Tabela de metadata (Postgres) para cada imagem:  

> o

guarda origem , licença/autor (se for Unsplash/Google), 

dimensões , hash (para deduplicar), blurhash/co r dominante ,

tipo (hero/galeria), url pública , cache -control etc. 

3.  Edge Function (Deno) para ingestão : 

> o

recebe um sourceUrl (Google Places, Unsplash, link do parceiro) 

ou um uploadUrl do app,  

> o

faz download do original , valida, gera blurhash /dominant color, 

sa lva no Storage com cache -control forte,  

> o

grava o registro na tabela images e retorna as variantes (URLs 

transformadas). 

4.  Transformações e CDN : 

> o

Use o Image Transformations do Supabase (imgproxy por trás) 

para resize/crop/format na URL (WebP/AVIF, largura/altu ra, 

qualidade).  

> o

Responda com Cache -Control: public, max -age=31536000, 

immutable para ficar ultrarrápido .

Resultado: você copia (cacheia) imagens externas para o seu bucket, não 

depende das cotas de terceiros em produção, e entrega via CDN global do 

Supabas e. 

1) Buckets e pastas  

> 

Crie os buckets: places (público leitura), users (público leitura para 

avatar) e, se quiser, private (itens só com URL assinada).  Padrão de chaves (paths):  

> 

places/{place_id}/hero.jpg  

> 

places/{place_id}/gallery/{uuid}.jpg  

> 

users/{user _id}/avatar.jpg  

> 

Metadata no objeto (na hora do upload): 

cacheControl: '31536000, immutable', contentType: 'image/jpeg' (ou 

webp/avif). 

2) Tabelas (SQL de exemplo) 

create table public.images ( 

id uuid primary key default gen_random_uuid(), 

place_id uuid references public.places(id) on delete cascade, 

user_id uuid references auth.users(id), 

bucket text not null default 'places', 

path text not null, -- ex: places/{place_id}/gallery/xxxx.webp 

mime text not null, -- image/webp, image/jpeg 

width int, height int, 

size_bytes bigint, 

blurhash text, 

dominant_hex char(7), -- ex: #1F2937 

is_primary boolean default false, -- hero 

source text, -- 'google -places' | 'unsplash' | 'upload' 

source_url text, 

author text, -- se precisar (Unsplash atribuição) 

license text, 

hash_sha256 text, -- dedup binário 

phash text, -- perceptual hash (opcional) 

created_at timestamptz default now() 

); create index on public.images (place_id); 

create index on public.images (hash_sha256); 

Deduplicação : antes de gravar, calcule hash_sha25 6 do arquivo; se já existir 

para o mesmo place_id, reaproveite. 

3) Policies/RLS (Storage & DB)  

> 

Bucket places : leitura pública OK; escrita apenas via service role 

(Edge Function) para manter curadoria.  

> 

Bucket users : leitura pública (para avatar) e escrita apenas pelo próprio 

usuário no path users/{authed_id}/**. 

Exemplo (Storage Policy simplificada): 

-- READ público no bucket 'places' 

create policy "public read places" 

on storage.objects for select 

to public 

using ( bucket_id = 'places'); 

-- WRITE apenas server role (Edge Function usa service key) 

create policy "no direct write places" 

on storage.objects for insert 

to authenticated 

with check (false); 

4) Upload/Ingestão (Edge Function) 

Fluxo :

1.  O app envia: place_id , type (hero/galeria), e ou sourceUrl (externa) ou 

arquivo (upload direto). 

2.  A Function:  

> o

baixa/converte para WebP (ou guarda original + deixa 

transformações na URL),  

> o

calcula blurhash + dominant color ,o faz upload para places/... com cacheControl forte,  

> o

inser e na public.images,  

> o

retorna o publicUrl e variantes via transformações do Supabase. 

Deno (esqueleto): 

import { serve } from "https://deno.land/std/http/server.ts"; 

import { createClient } from "https://esm.sh/@supabase/supabase -js@2"; 

serve(async (req) => {

const { place_id, sourceUrl, is_primary } = await req.json(); 

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, 

Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!); 

// 1) Baixa a imagem externa 

const resp = await fetch(sourceUrl); 

if (!re sp.ok) return new Response("fail download", { status: 400 }); 

const buf = new Uint8Array(await resp.arrayBuffer()); 

// 2) (Opcional) calcula blurhash / dominant color (use libs wasm ou chame 

outra function) 

// const blurhash = ... 

// const dominan t_hex = ... 

// 3) Define o path 

const key = `places/${place_id}/gallery/${crypto.randomUUID()}.webp`; 

// 4) Upload para Storage 

const { error: upErr } = await supabase.storage 

.from('places') 

.upload(key, buf, { contentType: 'image/ webp', 

cacheControl: '31536000, immutable', 

upsert: false 

}); 

if (upErr) return new Response(upErr.message, { status: 400 }); 

// 5) URL pública + Transformações 

const { data: { publicUrl } } = 

supabase.storage.from('places'). getPublicUrl(key); 

const variant_1080 = `${publicUrl}?width=1080&quality=80&format=webp`; 

const variant_720 = `${publicUrl}?width=720&quality=75&format=webp`; 

const thumb_240 =

`${publicUrl}?width=240&height=240&fit=cover&format=webp`; 

// 6) G rava metadata 

const { error: dbErr, data } = await supabase.from('images').insert({ 

place_id, 

bucket: 'places', 

path: key, 

mime: 'image/webp', 

is_primary: !!is_primary, 

// blurhash, dominant_hex, hash_sha256, source, source_url... 

}).select().single(); 

if (dbErr) return new Response(dbErr.message, { status: 400 }); 

return new Response(JSON.stringify({ 

image: data, 

urls: { publicUrl, variant_1080, variant_720, thumb_240 } 

}), { headers: { 'Content -Type': 'applicatio n/json' }}); 

}); Transformações no Supabase : ative Image Transformations no projeto. O 

formato é 

.../object/public/<bucket>/<path>?width=&height=&quality=&format=&fit= (o 

painel mostra o URL correto de render quando habilitado). 

5) Como o app consome (RN /Expo)  

> 

Crie um componente <CTImage> que recebe a URL transformada já no 

tamanho certo:  

> 

import FastImage from 'react -native -fast -image';  

> 
> 

export function CTImage({ uri, width, height, placeholderBlurhash }: 

Props) {  

> 

return (  

> 

<FastImage  

> 

style={{ width, height }}  

> 

source={{ uri, priority: FastImage.priority.normal }}  

> 

resizeMode={FastImage.resizeMode.cover}  

> 

/>  

> 

);  

> 

} 

> 

Placeholders : use blurhash ; exiba borrado até a imagem chegar.  

> 

Prefetch : ao montar a tela, faça prefetch das imagens do próximo 

card/roteiro.  

> 

Paginação e lazy em listas. 

6) Quando a imagem vier de Unsplash/Google  

> 

Nunca ligue o app direto na API externa em produção. 

Em vez disso: 

1.  Busque os links no backend, 

2.  Envie para a Edge Function de ingestão acima, 

3.  Salve no bucket + m etadata, 4.  Entregue para o app a URL otimizada do seu Storage. 

Isso elimina limites de requisição e latências externas para o usuário final 

(fica tudo na sua CDN). 

7) Boas práticas de performance e custo  

> 

Sempre defina cacheControl grande no upload (1 ano + immutable).  

> 

Use WebP/AVIF (ou auto=format via transform) para reduzir 30 –60% do 

peso.  

> 

Gere somente o que precisa: variantes 240/720/1080 

(desktop/tablet/mobile). 

(Com transformações on -the -fly + CDN, nem precisa pré -gerar; a CDN 

vai cachear a variação ped ida.)  

> 

Deduplicação por hash: evita gastar armazenamento repetindo a 

mesma foto.  

> 

Limpeza : scripts de rotina para remover originais não referenciados e 

miniaturas antigas se algum dia pré -gerar. 

8) Custos (ordem de grandeza)  

> 

Supabase Storage + CDN : baratíssimo para dezenas de milhares de 

imagens (paga GB armazenado + egress).  

> 

Transformações : incluídas; você paga principalmente o tráfego.  

> 

Sai muito mais barato que servir direto de APIs externas, e com 

controle total .