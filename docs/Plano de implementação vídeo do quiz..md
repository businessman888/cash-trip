Fluxo de Implementação: Vídeo de Quiz (Supabase + Cursor) 

1. Objetivo Principal 

Integrar o vídeo de demonstração (hospedado no Supabase Storage) na tela 

do quiz dentro do Cursor, garantindo carregamento rápido, autoplay imediato e 

loop contínuo para maximizar a conversão. 

2. Ativos Necessários (Pré -requisitos) 

Antes de ir para o Cursor, você precisa ter duas coisas prontas: 

1.  demo -final.mp4 : O seu vídeo único (logo + demo) já editado e 

agressivamente comprimido (como discu tido anteriormente: 720p, áudio 

removido, bitrate baixo, < 5MB). 

2.  poster -frame.jpg : Uma imagem estática (JPG ou WEBP) do primeiro 

frame do seu vídeo. Isso é essencial para o carregamento rápido. 

3. Fase 1: Configuração do Supabase Storage 

O seu código no Cu rsor precisa de um link (URL) para o vídeo. Vamos gerar 

esse link no Supabase. 

1.  Acesse seu Projeto: No painel do Supabase, vá para a seção 

"Storage". 

2.  Crie um "Bucket":  

> o

Clique em "Create a new bucket".  

> o

Dê um nome, por exemplo: demonstracoes.  

> o

MUITO IMPORTANTE : Marque a opção "Public bucket". Isso 

permite que qualquer pessoa com o link veja o arquivo, o que é 

necessário para o seu app. 

3.  Faça o Upload dos Ativos:  

> o

Entre no seu bucket demonstracoes.  

> o

Faça o upload dos seus dois arquivos: demo -final.mp4 e poster -

fram e.jpg. 

4.  Obtenha a URL Pública:  

> o

Clique no arquivo demo -final.mp4 dentro do bucket.  

> o

Clique em "Get URL". O Supabase fornecerá uma URL pública.  

> o

Essa URL é o "coração" da sua implementação. Ela já é 

otimizada pela rede do Supabase.  

> o

Copie e guarde essa URL. o Faça o mesmo para o poster -frame.jpg. 

Exemplo de URLs do Supabase: VIDEO_URL: https://[seu -id -

projeto].supabase.co/storage/v1/object/public/demonstracoes/demo -final.mp4 

POSTER_URL: https://[seu -id -

projeto].supabase.co/storage/v1/object/public/demonstracoes/pos ter -frame.jpg 

4. Fase 2: Implementação no Cursor (Código do Componente) 

Agora, vamos ao seu editor no Cursor. Encontre o arquivo do componente 

React/Web onde essa tela do quiz é renderizada. 

1.  Defina suas Constantes: No topo do seu arquivo ou componente, cole 

as URLs que você copiou do Supabase. 

2.  Insira o Elemento <video>: No local exato onde o vídeo deve aparecer, 

insira o código HTML5 <video>. Este código é universal (funciona em 

React, Vue, HTML puro). 

Exemplo de Có digo (React / Web) 

Este é o código que você deve colar no seu componente, dentro do return (): 

import React from 'react'; 

// --- 1. Cole suas URLs do Supabase aqui ---

// (Certifique -se de substituir pelos seus links reais) 

const VIDEO_URL_FROM_SUPABASE = "https://[seu -id -

projeto].supabase.co/storage/v1/object/public/demonstracoes/demo -final.mp4"; 

const POSTER_URL_FROM_SUPABASE = "https://[seu -id -

projeto].supabase.co/storage/v1/object/public/demonstracoes/poster -frame.jpg"; 

function TelaDoQuizComVideo() { 

return ( 

<div className="quiz -container"> 

{/* ... Outros elementos do quiz (perguntas, etc) ... */} 

{/* --- 2. Inserção do Player de Vídeo --- */} 

<div style={{ 

width: '100%', maxWidth: '400px', // Defina um tamanh o máximo 

margin: '20px auto', // Centralizar 

borderRadius: '16px', // Bordas arredondadas 

overflow: 'hidden', // Para cortar o vídeo nas bordas 

boxShadow: '0 10px 20px rgba(0,0,0,0.1)' // Sombra opcional 

}}> 

<v ideo 

// --- 3. Atributos Essenciais ---

src={VIDEO_URL_FROM_SUPABASE} 

poster={POSTER_URL_FROM_SUPABASE} 

autoPlay // Tocar sozinho 

loop // Repetir 

muted // OBRIGATÓRIO para autoplay funcionar em 99% dos 

navegadores 

playsinline // OBRIGATÓRIO para iOS não abrir em tela cheia 

preload="auto" // Pedir ao navegador para carregar assim que possível 

style={{ 

width: '100%', 

height: '100%' ,

display: 'block' // Remove qualquer espaço extra 

}} 

/> 

</div> 

{/* ... Botão "Continuar" do quiz ... */} 

<button>Continuar</button> 

</div> 

); 

}export default TelaDoQuizComVideo; 

5. Fase 3: O Fluxo d e Carregamento (O que o usuário vê) 

Seguindo este plano, veja o que acontece quando o usuário chega na tela: 

1.  0.00s: A página carrega. O navegador vê a tag <video> e 

instantaneamente exibe o poster -frame.jpg (que é leve). O usuário vê 

uma imagem estática do seu app, nunca uma tela preta .

2.  0.01s: Em segundo plano, o navegador começa a baixar o demo -

final.mp4 da URL do Supabase. 

3.  ~0.5s - 1.5s: (Dependendo da rede) O vídeo tem dados suficientes 

("buffer"). 

4.  Auto -Play: Assim que pode, o navegador troca a imagem pos ter pelo 

vídeo e o autoplay inicia. 

5.  Loop: O vídeo (logo + demo) toca. Ao final, o loop faz ele recomeçar 

imediatamente, criando a experiência contínua