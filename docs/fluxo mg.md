 Arquitetura com buckets + tabela images + Edge Function : ✅

ótima. Mant ém curadoria, metadados (licen ça/autor) e deduplica çã o via 

hash. Use cache -control alto e transformações WebP/AVIF na URL. 

supabaseImgs  

> 

RLS/Policies : ✅ leitura p ública s ó para places , escrita via service role 

nas Edge Functions (sem upload direto do app). 

supabaseImgs  

> 

Transformações (imgproxy do Supabase) : ✅ redimensione/troque 

formato na URL; a CDN cacheia cada varia çã o pedida. 

supabaseImgs  

> 

Componente de imagem no app com prefetch/ placeholder 

(blurhash) : ✅ melhora UX e TTI. 

supabaseImgs 

Conclusão: o desenho base está eficaz . A seguir, eu especifico o fluxo 

dinâmico por destino , estratégia para “todas as cidades do mundo ” sem 

estourar o storage , governança de licenças , custos e como grandes players 

fazem. 

2) Você precisa armazenar imagens de “todas as cidades do mundo ”? 

Não direto . O que funciona (e é como os grandes fazem) é um modelo 

híbrido :

1.  Catálogo base “quente ” (curado)  

> o

Pré -carregue as top ~1.000 –5.000 cidades/destinos (ou po r

país/temporada).  

> o

Para cada destino: 1 hero + 6 –12 gallery em 1080/720/240 via 

transform na URL (sem pré -gerar miniaturas).  

> o

Mantenha metadados (fonte, licença, autor) na sua images. 

supabaseImgs 

2.  Ingestão on -demand (pull -through cache)  

> o

Quando o usuário pe dir “Cape Town ” e não houver imagens 

locais, a Edge Function :

a) busca fonte aprovada (ex.: Google Places Photos, parceiro, 

acervo próprio, Unsplash apenas no backend), 

b) baixa o original, valida, calcula blurhash/cor dominante, c) salva no bucket places/ PLACE_ID/... com cache -control: 

31536000, immutable ,

d) grava linha em public.images, devolvendo as URLs 

transformadas (WebP/AVIF) .

supabaseImgs  

> o

Na tela, o usuário vê placeholder blurhash e, em segundos, a 

imagem otimizada cai via CDN. 

3.  Warming & prefetch inteligente  

> o

Antes de lançar campanhas/feriados (ex.: verão Brasil, ano -novo 

Europa), preaqueça destinos prováveis (job diário).  

> o

No app, ao abrir a tela do destino, faça prefetch de 2–3 imagens 

do próximo card. 

supabaseImgs 

4.  Limpeza & quotas  

> o

Tarefa semanal remove originais órfãos (sem referência) e 

versões muito antigas.  

> o

Deduplicação por hash_sha256 evita cópia do mesmo arquivo 

para vários destinos. 

supabaseImgs 

Resultado: você não precisa subir “o mundo inteiro ”. Armazena o que precisa 

+ o q ue os usuários pedirem , e a CDN entrega rápido como se sempre 

estivesse local. 

3) Fluxo exato quando o usuário define um destino (ex.: “Cape Town ”) 

Backoffice/infra (Supabase):  

> 

Buckets: places (público leitura), users (avatars) e (opcional) private.  

> 

Tabe la public.images com metadados (licença/autor, largura/altura, hash, 

cor dominante, is_primary) e índices por place_id. 

supabaseImgs 

App → Backend (do seu fluxo de produto): 

1.  Usuário passa no quiz → perfil salvo (já definido no seu fluxo). 

cashtrip -fluxo -completo 

cashtrip -roadmap -completo 2.  Tela “Escolher destino ” (ou sugestões do agente). 

cashtrip -fluxo -completo 

3.  Ao abrir “Cape Town ”:  

> o

Consulta images por place_id . Se tiver, retorna as 

transformadas (?width=1080&format=webp, etc.). 

supabaseImgs  

> o

Se não tiver : chama Edge Function de ingestão com sourceUrl 

(só no backend) → baixa, salva no places/..., grava na images, 

retorna URLs. 

supabaseImgs  

> o

App já renderiza placeholder (blurhash) e troca pela imagem 

quando a FastImage finalizar o fetch. 

supabaseImgs 

Impor tante no produto (UX):  

> 

Enquanto o agente monta voos/hotel/restaurantes/roteiro, as imagens 

do destino chegam em paralelo e a tela nunca “fica vazia ”. Isso está 

coerente com o seu fluxo de planejamento e revisão de viagem. 

cashtrip -fluxo -completo 

4) Governança de fonte & licença (evita dor de cabeça)  

> 

Nunca sirva a imagem direto da API externa no app; sempre passe 

pela Edge Function e registre source, source_url, author, license em 

public.images. 

supabaseImgs  

> 

Unsplash : use no backend, atribua autor/li cença (no metadado) e, se 

necessário, exiba crédito no app (ex.: na folha de detalhes do destino).  

> 

Google Places Photos : respeite termos de uso e atribuições; trate 

dimensões máximas via a sua transformação de imagem.  

> 

Parceiros e acervo próprio : preferir p ara hero e campanhas (qualidade 

e direitos mais claros). 

5) Performance & custo (ordem de grandeza + táticas)  Transformação na URL (imgproxy) + CDN global do Supabase : cada 

variação é cacheada; não pré -gere dezenas de tamanhos. Mantenha 2–

3 “ targets ” (10 80/720/240 ) e deixe a CDN aprender. 

supabaseImgs  

> 

cache -control: public, max -age=31536000, immutable : essencial para 

latência baixa e custo de egress controlado. 

supabaseImgs  

> 

Formato : priorize WebP/AVIF (–30% a –60% de peso), caindo para 

JPEG só como fall back. 

supabaseImgs  

> 

Custos típicos : você paga armazenamento (GB) + egress . Para 

dezenas de milhares de imagens e tráfego inicial, tende a ser baixo 

comparado a rodar tudo de API externa a cada request. (Seu .md já 

antecipa isso). 

supabaseImgs  

> 

Estratégia de custo : 

> o

Dedup por hash (mesma foto só 1x). 

supabaseImgs  

> o

Prefetch moderado (evite baixar lote enorme sem demanda).  

> o

Warming sazonal em destinos de campanha (ROI alto).  

> o

“Cold storage ” lógico: manter apenas hero de destinos com baixa 

procura e arquivar gale rias antigas (ou manter ponte para re -

ingestão quando necessário). 

6) Como os grandes players fazem (benchmark)  

> 

Object storage + CDN + transformações (CloudFront/Akamai/Fastly; 

Cloudinary/imgproxy/Thumbor). O padrão é guardar originais curados ,

servir múltiplas variantes na borda e cachear agressivamente . 

> 

Fontes : 

> o

Conteúdo proprietário/contratado (melhor qualidade e direitos).  

> o

Feeds de parceiros (rede hoteleira/turismo envia mídia), tratados 

por pipelines de ingestão .o APIs públicas só como fonte (copiada s para o storage), não 

como servidor de produção.  

> 

Custos : dominados por egress (tráfego) e processo de 

transformação ; armazenamento é barato se você controla duplicatas e 

tamanhos. 

7) Plano executável (checklist técnico) 

Storage & DB  

> 

Buckets: places (pub lic read), users (public read), private (opcional).  

> 

Policies RLS: sem write direto em places; write só via service role da 

Edge Function. 

supabaseImgs  

> 

Tabela public.images com índices por place_id e hash_sha256; campos 

source/author/license/blurhash/domin ant_hex/is_primary. 

supabaseImgs 

Edge Functions  

> 

/ingest -image: recebe place_id + sourceUrl (ou upload), baixa, valida, 

calcula blurhash/cor, upload() com cacheControl: '31536000, immutable', 

grava em images, retorna URLs transformadas (1080/720/240). 

sup abaseImgs  

> 

/warm -places: job que prepara destinos “quentes ” por 

temporada/campanha. 

App (RN/Expo)  

> 

<CTImage> usando FastImage, prefetch e placeholder blurhash. 

supabaseImgs  

> 

Ao abrir destino: tentar images locais → se miss, chama /ingest -image e 

exibe placeh older até chegar.  

> 

Uso coerente com seu fluxo de quiz → destino → planejamento →

revisão → pagamento → dashboard .

cashtrip -fluxo -completo 

cashtrip -roadmap -completo 

overview cash trip Governança & Segurança  

> 

Registrar licença/autor sempre; crédito visível quando exigido.  

> 

Chaves de terceiros só no backend ; app nunca chama 

Unsplash/Places direto. 

supabaseImgs  

> 

Logs/observabilidade (taxa de acerto do cache, latência de ingestão, top 

destinos). 

8) Como isso encaixa no seu roadmap e fl uxo  

> 

O roadmap Supabase + RN + segurança + backend que você já 

definiu continua válido; imagens entram como “infra compartilhada ”

usada por Sugestões de Destino e pelo Planejador (voos, hotéis, 

restaurantes, roteiro), melhorando a primeira dobra da UI com hero 

estável e rápido .

cashtrip -roadmap -completo 

cashtrip -fluxo -completo  

> 

O overview do produto segue intacto; só garantimos que a camada 

visual (imagens) está confiável, legalmente correta e barata .