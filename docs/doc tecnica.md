Documentação Técnica: Implementação Google Places Autocomplete 

(Custom UI) 

1. Pré -requisitos e Instalação 

A implementação depende do carregamento assíncrono da API para evitar 

race conditions no Next.js e tipagem correta. 

Comando de Instalação: 

Bash 

npm install @googlemaps/js -api -loader 

npm install -D @types/google.maps 

2. Configuração de Variáveis de Ambiente 

Crie ou edite o arquivo .env.local na raiz do projeto. 

Arquivo: .env.local 

Snippet de código 

# Chave de API com Permissões para: Places API, Maps J avaScript API 

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui_sem_aspas 

Nota de Segurança: No Google Cloud Console, restrinja esta chave por 

HTTP Referrer para aceitar apenas requisições do seu domínio (ex: 

localhost:3000 e seusite.com). 

3. Lógica de Back end (Custom Hook) 

Este hook gerencia a conexão com a API, mantém o estado das sugestões 

e gerencia o Session Token para garantir que você pague apenas por 

sessão de busca , e não por caractere digitado .

Arquivo: src/hooks/useGoogleAutocomplete.ts (ou pasta equivalente) 

TypeScript 

import { useState, useEffect, useCallback, useRef } from "react"; 

import { Loader } from "@googlemaps/js -api -loader"; 

interface PlacePrediction { 

description: string; 

place_id: string; main_text: string; 

secondary_text: str ing; 

}

interface PlaceDetails { 

lat: number; 

lng: number; 

address: string; 

}

export const useGoogleAutocomplete = () => { 

const [predictions, setPredictions] = useState<PlacePrediction[]>([]); 

const [autocompleteService, setAutocompleteService ] = 

useState<google.maps.places.AutocompleteService | null>(null); 

const [placesService, setPlacesService] = 

useState<google.maps.places.PlacesService | null>(null); 

const sessionToken = 

useRef<google.maps.places.AutocompleteSessionToken | null>(null); 

// 1. Inicialização da API 

useEffect(() => { 

const loader = new Loader({ 

apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as 

string, 

libraries: ["places"], 

}); 

loader.importLibrary("places").then(() => { 

setAutocompleteService(new 

google.maps.places.AutocompleteService()); sessionToken.current = new 

google.maps.places.AutocompleteSessionToken(); 

// PlacesService necessita de um elemento HTML (mesmo que dummy) 

ou mapa. 

// Criamos um div virtual para instanciar o serviço de detalhes. 

const virtualDiv = document.createElement('div'); 

setPlacesService(new google.maps.places.PlacesService(virtualDiv)); 

}); 

}, []); 

// 2. Busca de Sugestões (Autocomplete) 

const fetchPredictions = useCallback((inputValue: string) => { 

if (!inputValue || !autocompleteService || !sessionToken.current) { 

setPredictions([]); 

return; 

}

const request = { 

input: inputValue, 

sessionToken: sessionToken. current, 

// Opcional: Restringir busca ao Brasil 

// componentRestrictions: { country: "br" }, 

}; 

autocompleteService.getPlacePredictions(request, (results, status) => { 

if (status === google.maps.places.PlacesServiceStatus.OK && results) 

{

setPredictions(results.map(place => ({ 

description: place.description, place_id: place.place_id, 

main_text: place.structured_formatting.main_text, 

secondary_text: place.structured_formatting.secon dary_text, 

}))); 

} else { 

setPredictions([]); 

}

}); 

}, [autocompleteService]); 

// 3. Obter Coordenadas (Commit da Transação) 

// Esta função consome o Session Token e gera a cobrança final 

const getPlaceDetails = useCallback((placeId: string): 

Promise<PlaceDetails> => { 

return new Promise((resolve, reject) => { 

if (!placesService || !sessionToken.current) { 

reject("Google Maps Service not initialized"); 

return; 

}

const request : google.maps.places.PlaceDetailsRequest = { 

placeId: placeId, 

fields: ["geometry", "formatted_address"], // Apenas o necessário 

para economizar custos 

sessionToken: sessionToken.current, 

}; 

placesService.getDetails(re quest, (place, status) => { 

if (status === google.maps.places.PlacesServiceStatus.OK && place 

&& place.geometry && place.geometry.location) { // Resetar Token após uso (iniciar nova sessão) 

sessionToken.current = new 

google.maps.places.AutocompleteSessionToken(); 

resolve({ 

lat: place.geometry.location.lat(), 

lng: place.geometry.location.lng(), 

address: place.formatted_address || "", 

}); 

} else { 

reject("Could not fetch place details"); 

}

}); 

}); 

}, [placesService]); 

return { predictions, fetchPredictions, getPlaceDetails }; 

}; 

4. Integração na Interface (UI) 

Adaptação do componente visual existente para consumir o hook . Inclui 

lógica de Debounce (atraso na digitação) para evitar chamadas 

excessivas à API. 

Arquivo: Componente da Modal (Ex: SearchLocationModal.tsx) 

TypeScript 

"use client"; 

import { useState, useEffect } from "react"; 

import { useGoogleAutocomplete } from 

"@/hooks/useGoogleAutocomplete"; // Ajustar caminho export default function SearchLocationModal({ onClose, onLocationSelect 

}: { onClose: () => void, onLocationSelect: (lat: number, lng: number) => 

void }) { 

const [inputValue, setInputValue] = useState( ""); 

const { predictions, fetchPredictions, getPlaceDetails } = 

useGoogleAutocomplete(); 

// Lógica de Debounce (300ms) 

useEffect(() => { 

const timer = setTimeout(() => { 

if (inputValue.length > 2) { // Só busca se tiver mais de 2 letras 

fetchPredictions(inputValue); 

}

}, 300); 

return () => clearTimeout(timer); 

}, [inputValue, fetchPredictions]); 

// Handler de Seleção 

const handleSelectPlace = async (placeId: string) => { 

try { 

const details = await getPlaceDetails(placeId); 

console.log("Coordenadas obtidas:", details); 

// Passa os dados para o componente pai ou estado global 

onLocationSelect(details.lat, details.lng); 

// Fecha a modal ou limpa o input 

// on Close(); } catch (error) { 

console.error("Erro ao buscar detalhes:", error); 

}

}; 

return ( 

<div className="bg -white p -4 rounded -lg shadow -lg w -full max -w-

md"> 

{/* INPUT */} 

<div className="relative mb -4"> 

<input 

type="text" 

value={inputValue} 

onChange={(e) => setInputValue(e.target.value)} 

placeholder="Digite o local..." 

className="w -full p -3 border border -gray -300 rounded -full 

focus:outline -none focus:ring -2 focus :ring -orange -500" 

/> 

</div> 

{/* LISTA DE RESULTADOS */} 

{predictions.length > 0 && ( 

<div className="space -y-2 max -h-60 overflow -y-auto"> 

{predictions.map((item) => ( 

<div 

key={ item.place_id} 

onClick={() => handleSelectPlace(item.place_id)} 

className="flex items -center p -3 border rounded -xl hover:bg -

orange -50 cursor -pointer transition -colors" 

><div className="bg -gray -100 p -2 rounded -full mr -3 text -gray -

500"> 

{/* Ícone de Pin/Mapa */} 

<svg className="h -5 w -5" fill="none" viewBox="0 0 24 24" 

stroke="currentColor"> 

<path strokeLinecap="round" strokeLinejoin="round" 

strokeWidth ={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01 -2.827 0l -

4.244 -4.243a8 8 0 1111.314 0z" /> 

<path strokeLinecap="round" strokeLinejoin="round" 

strokeWidth={2} d="M15 11a3 3 0 11 -6 0 3 3 0 016 0z" /> 

</svg> 

</div> 

<div className="flex -1"> 

<p className="font -bold text -gray -800 text -

sm">{item.main_text}</p> 

<p className="text -xs text -gray -

500">{item.secondary_text}</p> 

</div> 

</div> 

))} 

</div> 

)} 

</div> 

); 

}

5. Resumo da Lógica Financeira (Importante) 

A implementação acima segue estritamente a diretriz "Autocomplete with 

Session Tokens": 

1.  Usuário digita: Várias chamadas de fetchPredictions (Gratuito ou 

custo ínfimo dentro da sessão). 

2.  Usuário seleciona: Uma chamada de getPlaceDetails. 3.  Fatura: O Google agrupa tudo e cobra apenas 1 SKU: Autocomplete 

(included with Place Details). 

Se remover o sessionToken do código, cada letra digitada será co brada 

individualmente.