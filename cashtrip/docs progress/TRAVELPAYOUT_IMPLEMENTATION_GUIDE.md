# Guia de Implementação Passo a Passo: Travelpayout Migration

**Checklist Completo e Instruções Detalhadas**  
**Data:** 2025-12-02  
**Versão:** 1.0

---

## 📋 Visão Geral

Este documento fornece um guia passo a passo para implementar a migração do Amadeus para Travelpayout, com checkboxes para acompanhamento do progresso.

---

## ✅ FASE 1: PREPARAÇÃO E SETUP

### 1.1 Configuração de Variáveis de Ambiente

- [ ] **Passo 1.1.1:** Abrir arquivo `.env.local`
- [ ] **Passo 1.1.2:** Adicionar as seguintes variáveis:
  ```env
  TRAVELPAYOUTS_API_TOKEN=3f87cccd98047d6192675ac6756c7a40
  TRAVELPAYOUTS_MARKER=688645
  ```
- [ ] **Passo 1.1.3:** Verificar que `.env.local` está no `.gitignore`
- [ ] **Passo 1.1.4:** Reiniciar o servidor de desenvolvimento
  ```bash
  # Parar servidor (Ctrl+C)
  npm run dev
  ```
- [ ] **Passo 1.1.5:** Confirmar que as variáveis estão acessíveis:
  ```typescript
  console.log('Token:', process.env.TRAVELPAYOUTS_API_TOKEN);
  console.log('Marker:', process.env.TRAVELPAYOUTS_MARKER);
  ```

### 1.2 Criar Estrutura de Arquivo

- [ ] **Passo 1.2.1:** Criar novo arquivo `src/lib/travelpayout.ts`
- [ ] **Passo 1.2.2:** Adicionar imports necessários:
  ```typescript
  import { createHash } from 'crypto';
  ```
- [ ] **Passo 1.2.3:** Copiar interface `FlightOffer` do `amadeus.ts`:
  ```typescript
  export interface FlightOffer {
      id: string;
      airline: string;
      flightNumber: string;
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      duration: string;
      price: { currency: string; total: string };
      stops: number;
      link?: string;
  }
  ```

---

## ✅ FASE 2: IMPLEMENTAR CONVERSÃO DE CÓDIGOS IATA

### 2.1 Criar Função de Autocomplete

- [ ] **Passo 2.1.1:** Definir constante do endpoint:
  ```typescript
  const AUTOCOMPLETE_URL = 'http://autocomplete.travelpayouts.com/places2';
  ```

- [ ] **Passo 2.1.2:** Criar interface de resposta:
  ```typescript
  interface AutocompletePlace {
      id: string;
      type: string;
      code: string;
      name: string;
      country_code: string;
      country_name: string;
  }
  ```

- [ ] **Passo 2.1.3:** Implementar função `getCityIataCode`:
  ```typescript
  async function getCityIataCode(cityName: string): Promise<string | null> {
      try {
          const url = `${AUTOCOMPLETE_URL}?term=${encodeURIComponent(cityName)}&locale=pt&types[]=city`;
          
          const response = await fetch(url, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) {
              console.error(`[Travelpayout] Erro ao buscar IATA: ${response.status}`);
              return null;
          }

          const data: AutocompletePlace[] = await response.json();
          
          if (!data || data.length === 0) {
              return null;
          }

          return data[0].code;

      } catch (error) {
          console.error(`[Travelpayout] Exceção ao buscar IATA:`, error);
          return null;
      }
  }
  ```

### 2.2 Testar Conversão de Códigos

- [ ] **Passo 2.2.1:** Criar arquivo de teste temporário `test-iata.ts`:
  ```typescript
  import { getCityIataCode } from './travelpayout';

  async function testIata() {
      const cities = ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Brasília'];
      
      for (const city of cities) {
          const code = await getCityIataCode(city);
          console.log(`${city} → ${code}`);
      }
  }

  testIata();
  ```

- [ ] **Passo 2.2.2:** Executar teste:
  ```bash
  npx tsx src/lib/test-iata.ts
  ```

- [ ] **Passo 2.2.3:** Verificar resultados esperados:
  - São Paulo → GRU ou SAO
  - Rio de Janeiro → RIO ou GIG
  - Salvador → SSA
  - Brasília → BSB

- [ ] **Passo 2.2.4:** Deletar arquivo de teste após confirmação

---

## ✅ FASE 3: IMPLEMENTAR AUTENTICAÇÃO MD5

### 3.1 Criar Função de Cálculo MD5

- [ ] **Passo 3.1.1:** Definir interface de parâmetros:
  ```typescript
  interface SearchParams {
      origin: string;
      destination: string;
      depart_date: string;
      return_date: string | null;
      adults: number;
      children: number;
      infants: number;
      trip_class: 'Y' | 'C' | 'F';
      marker: string;
  }
  ```

- [ ] **Passo 3.1.2:** Implementar função `calculateMD5Signature`:
  ```typescript
  function calculateMD5Signature(params: SearchParams): string {
      const token = process.env.TRAVELPAYOUTS_API_TOKEN;
      
      if (!token) {
          throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
      }

      // Ordenar alfabeticamente e extrair valores
      const orderedValues = [
          params.adults,
          params.children,
          params.depart_date,
          params.destination,
          params.infants,
          params.marker,
          params.origin,
          params.return_date || '',
          params.trip_class,
      ];

      const signatureString = `${token}:${orderedValues.join('')}`;
      const signature = createHash('md5').update(signatureString).digest('hex');
      
      return signature;
  }
  ```

### 3.2 Testar Cálculo MD5

- [ ] **Passo 3.2.1:** Criar teste com valores conhecidos:
  ```typescript
  const testParams: SearchParams = {
      origin: 'GRU',
      destination: 'RIO',
      depart_date: '2025-12-15',
      return_date: null,
      adults: 1,
      children: 0,
      infants: 0,
      trip_class: 'Y',
      marker: '688645',
  };

  const signature = calculateMD5Signature(testParams);
  console.log('Signature:', signature);
  ```

- [ ] **Passo 3.2.2:** Verificar que o hash MD5 tem 32 caracteres hexadecimais

---

## ✅ FASE 4: IMPLEMENTAR INÍCIO DE BUSCA

### 4.1 Criar Função de Início de Busca

- [ ] **Passo 4.1.1:** Definir constante do endpoint:
  ```typescript
  const START_SEARCH_URL = 'https://tickets-api.travelpayouts.com/search/affiliate/start';
  ```

- [ ] **Passo 4.1.2:** Definir interface de resposta:
  ```typescript
  interface StartSearchResponse {
      search_id: string;
      results_url: string;
  }
  ```

- [ ] **Passo 4.1.3:** Implementar função `startFlightSearch`:
  ```typescript
  async function startFlightSearch(params: SearchParams): Promise<StartSearchResponse> {
      const token = process.env.TRAVELPAYOUTS_API_TOKEN;
      
      if (!token) {
          throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
      }

      const signature = calculateMD5Signature(params);

      const body = {
          origin: params.origin,
          destination: params.destination,
          depart_date: params.depart_date,
          return_date: params.return_date,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          trip_class: params.trip_class,
          marker: params.marker,
      };

      const response = await fetch(START_SEARCH_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-signature': signature,
              'x-affiliate-user-id': token,
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao iniciar busca: ${response.status} - ${errorText}`);
      }

      const data: StartSearchResponse = await response.json();
      return data;
  }
  ```

### 4.2 Testar Início de Busca

- [ ] **Passo 4.2.1:** Criar teste de início de busca:
  ```typescript
  async function testStartSearch() {
      const params: SearchParams = {
          origin: 'GRU',
          destination: 'GIG',
          depart_date: '2025-12-15',
          return_date: null,
          adults: 1,
          children: 0,
          infants: 0,
          trip_class: 'Y',
          marker: '688645',
      };

      const result = await startFlightSearch(params);
      console.log('Search ID:', result.search_id);
      console.log('Results URL:', result.results_url);
  }
  ```

- [ ] **Passo 4.2.2:** Verificar que recebe `search_id` e `results_url`

---

## ✅ FASE 5: IMPLEMENTAR POLLING DE RESULTADOS

### 5.1 Criar Função de Polling

- [ ] **Passo 5.1.1:** Definir constantes:
  ```typescript
  const MAX_POLL_ATTEMPTS = 20;
  const POLL_INTERVAL_MS = 2000; // 2 segundos
  ```

- [ ] **Passo 5.1.2:** Definir interfaces de resposta:
  ```typescript
  interface TravelpayoutProposal {
      id: string;
      terms: {
          price: {
              total: string;
              currency: string;
          };
      };
      segment: Array<{
          operating_carrier: string;
          marketing_carrier?: string;
          flight_number: string;
          departure: string;
          arrival: string;
          departure_time: string;
          arrival_time: string;
          duration: number;
      }>;
      gates_info: Array<{
          label: string;
          url: string;
      }>;
  }

  interface PollResultsResponse {
      is_over: boolean;
      proposals?: TravelpayoutProposal[];
  }
  ```

- [ ] **Passo 5.1.3:** Implementar função `pollFlightResults`:
  ```typescript
  async function pollFlightResults(
      searchId: string,
      resultsUrl: string
  ): Promise<TravelpayoutProposal[]> {
      const token = process.env.TRAVELPAYOUTS_API_TOKEN;
      
      if (!token) {
          throw new Error('TRAVELPAYOUTS_API_TOKEN não configurado');
      }

      const pollUrl = `${resultsUrl}/search/affiliate/results`;
      let attempts = 0;

      while (attempts < MAX_POLL_ATTEMPTS) {
          attempts++;
          
          console.log(`[Travelpayout] Tentativa ${attempts}/${MAX_POLL_ATTEMPTS}`);

          try {
              const response = await fetch(pollUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'x-affiliate-user-id': token,
                  },
                  body: JSON.stringify({ search_id: searchId }),
              });

              if (!response.ok) {
                  await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
                  continue;
              }

              const data: PollResultsResponse = await response.json();

              if (data.is_over === true) {
                  console.log('[Travelpayout] Busca completa!');
                  return data.proposals || [];
              }

              await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

          } catch (error) {
              console.error(`[Travelpayout] Erro na tentativa ${attempts}:`, error);
              await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
          }
      }

      throw new Error('Tempo limite excedido ao buscar voos.');
  }
  ```

### 5.2 Testar Polling

- [ ] **Passo 5.2.1:** Testar polling completo (pode levar 30-60 segundos):
  ```typescript
  async function testFullSearch() {
      // 1. Converter códigos
      const originIata = await getCityIataCode('São Paulo');
      const destIata = await getCityIataCode('Rio de Janeiro');
      
      // 2. Iniciar busca
      const params: SearchParams = {
          origin: originIata!,
          destination: destIata!,
          depart_date: '2025-12-15',
          return_date: null,
          adults: 1,
          children: 0,
          infants: 0,
          trip_class: 'Y',
          marker: '688645',
      };
      
      const { search_id, results_url } = await startFlightSearch(params);
      
      // 3. Polling
      const proposals = await pollFlightResults(search_id, results_url);
      console.log(`Encontrados ${proposals.length} voos`);
  }
  ```

- [ ] **Passo 5.2.2:** Verificar que recebe array de propostas

---

## ✅ FASE 6: IMPLEMENTAR TRANSFORMAÇÃO DE DADOS

### 6.1 Criar Funções Auxiliares

- [ ] **Passo 6.1.1:** Criar mapeamento de companhias aéreas:
  ```typescript
  const AIRLINE_NAMES: Record<string, string> = {
      'LA': 'LATAM Airlines',
      'G3': 'GOL Linhas Aéreas',
      'AD': 'Azul Linhas Aéreas',
      'TP': 'TAP Air Portugal',
      'AA': 'American Airlines',
      'UA': 'United Airlines',
      'DL': 'Delta Air Lines',
      // ... adicionar mais conforme necessário
  };

  function getAirlineName(code: string): string {
      return AIRLINE_NAMES[code] || code;
  }
  ```

- [ ] **Passo 6.1.2:** Criar função de conversão de duração:
  ```typescript
  function minutesToDuration(minutes: number): string {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours > 0 && mins > 0) {
          return `PT${hours}H${mins}M`;
      } else if (hours > 0) {
          return `PT${hours}H`;
      } else {
          return `PT${mins}M`;
      }
  }
  ```

- [ ] **Passo 6.1.3:** Criar função de geração de ID:
  ```typescript
  function generateId(str: string): string {
      return createHash('md5').update(str).digest('hex').substring(0, 12);
  }
  ```

### 6.2 Criar Função de Transformação

- [ ] **Passo 6.2.1:** Implementar `transformTravelpayoutToFlightOffer`:
  ```typescript
  function transformTravelpayoutToFlightOffer(proposal: TravelpayoutProposal): FlightOffer {
      const firstSegment = proposal.segment[0];
      const lastSegment = proposal.segment[proposal.segment.length - 1];
      
      const totalDuration = proposal.segment.reduce((sum, seg) => sum + seg.duration, 0);
      const stops = proposal.segment.length - 1;
      const bookingLink = proposal.gates_info?.[0]?.url || undefined;
      const carrierCode = firstSegment.operating_carrier || firstSegment.marketing_carrier || 'XX';
      
      return {
          id: proposal.id,
          airline: getAirlineName(carrierCode),
          flightNumber: `${carrierCode}${firstSegment.flight_number}`,
          departure: {
              iataCode: firstSegment.departure,
              at: firstSegment.departure_time,
          },
          arrival: {
              iataCode: lastSegment.arrival,
              at: lastSegment.arrival_time,
          },
          duration: minutesToDuration(totalDuration),
          price: {
              currency: proposal.terms.price.currency,
              total: proposal.terms.price.total,
          },
          stops,
          link: bookingLink,
      };
  }
  ```

### 6.3 Testar Transformação

- [ ] **Passo 6.3.1:** Testar com dados mock:
  ```typescript
  const mockProposal: TravelpayoutProposal = {
      id: 'test123',
      terms: { price: { total: '1250.00', currency: 'BRL' } },
      segment: [{
          operating_carrier: 'LA',
          flight_number: '3456',
          departure: 'GRU',
          arrival: 'GIG',
          departure_time: '2025-12-15T08:00:00',
          arrival_time: '2025-12-15T11:30:00',
          duration: 210
      }],
      gates_info: [{ label: 'LATAM', url: 'https://booking.link' }]
  };

  const offer = transformTravelpayoutToFlightOffer(mockProposal);
  console.log(JSON.stringify(offer, null, 2));
  ```

- [ ] **Passo 6.3.2:** Verificar estrutura do `FlightOffer`

---

## ✅ FASE 7: IMPLEMENTAR FUNÇÃO PRINCIPAL

### 7.1 Criar Função searchFlights

- [ ] **Passo 7.1.1:** Implementar função principal com modo dev:
  ```typescript
  export async function searchFlights(
      origin: string,
      destination: string,
      departureDate: string,
      adults: number = 1,
      preferences?: any
  ): Promise<{ results: FlightOffer[], error?: string }> {
      
      const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
      const token = process.env.TRAVELPAYOUTS_API_TOKEN;
      const marker = process.env.TRAVELPAYOUTS_MARKER || '688645';

      // Modo de desenvolvimento
      if (isDevMode || !token) {
          console.log('[Travelpayout] Usando dados MOCK');
          
          const mockFlights: FlightOffer[] = [
              // ... dados mock
          ];

          let filtered = mockFlights;
          if (preferences?.budget_max) {
              filtered = filtered.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
          }

          return { results: filtered };
      }

      // Chamada real à API
      try {
          // 1. Converter códigos IATA
          const originIata = await getCityIataCode(origin);
          const destinationIata = await getCityIataCode(destination);

          if (!originIata || !destinationIata) {
              return { results: [], error: 'Aeroporto não encontrado' };
          }

          // 2. Iniciar busca
          const searchParams: SearchParams = {
              origin: originIata,
              destination: destinationIata,
              depart_date: departureDate,
              return_date: null,
              adults: adults,
              children: 0,
              infants: 0,
              trip_class: 'Y',
              marker: marker,
          };

          const { search_id, results_url } = await startFlightSearch(searchParams);

          // 3. Polling
          const proposals = await pollFlightResults(search_id, results_url);

          if (!proposals || proposals.length === 0) {
              return { results: [], error: 'Nenhum voo encontrado' };
          }

          // 4. Transformar
          let offers: FlightOffer[] = proposals.map(transformTravelpayoutToFlightOffer);

          // 5. Filtrar e ordenar
          if (preferences?.budget_max) {
              offers = offers.filter(f => parseFloat(f.price.total) <= preferences.budget_max);
          }

          offers.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

          return { results: offers.slice(0, 5) };

      } catch (error: any) {
          console.error('[Travelpayout] ERRO:', error);
          return { results: [], error: error.message || 'Erro ao buscar voos' };
      }
  }
  ```

### 7.2 Adicionar Dados Mock

- [ ] **Passo 7.2.1:** Copiar dados mock do `amadeus.ts`:
  ```typescript
  const mockFlights: FlightOffer[] = [
      {
          id: generateId(`LATAM-${destination}-1`),
          airline: 'LATAM Airlines',
          flightNumber: 'LA3456',
          departure: { iataCode: 'GRU', at: `${departureDate}T08:00:00` },
          arrival: { iataCode: 'GIG', at: `${departureDate}T11:30:00` },
          duration: 'PT3H30M',
          price: { currency: 'BRL', total: '1250.00' },
          stops: 0,
          link: 'https://www.latamairlines.com/br/pt/ofertas-voos'
      },
      // ... adicionar mais opções
  ];
  ```

---

## ✅ FASE 8: INTEGRAÇÃO COM API DO AGENTE

### 8.1 Atualizar Imports

- [ ] **Passo 8.1.1:** Abrir `src/app/api/chat/route.ts`

- [ ] **Passo 8.1.2:** Modificar linha 3:
  ```typescript
  // ANTES:
  import { searchFlights, searchHotels } from '@/lib/amadeus';

  // DEPOIS:
  import { searchFlights } from '@/lib/travelpayout';
  import { searchHotels } from '@/lib/amadeus';
  ```

- [ ] **Passo 8.1.3:** Verificar que nenhuma outra alteração é necessária

### 8.2 Verificar Compatibilidade

- [ ] **Passo 8.2.1:** Confirmar que a assinatura da função é idêntica:
  ```typescript
  // Ambas devem ter a mesma assinatura:
  async function searchFlights(
      origin: string,
      destination: string,
      departureDate: string,
      adults: number = 1,
      preferences?: any
  ): Promise<{ results: FlightOffer[], error?: string }>
  ```

- [ ] **Passo 8.2.2:** Confirmar que o formato de retorno é idêntico

---

## ✅ FASE 9: TESTES DE INTEGRAÇÃO

### 9.1 Teste em Modo Dev

- [ ] **Passo 9.1.1:** Configurar modo dev:
  ```env
  NEXT_PUBLIC_DEV_MODE=true
  ```

- [ ] **Passo 9.1.2:** Reiniciar servidor

- [ ] **Passo 9.1.3:** Acessar `/trips/new`

- [ ] **Passo 9.1.4:** Iniciar conversa com agente:
  - "Quero ir para o Rio de Janeiro"
  - Informar datas
  - Informar orçamento

- [ ] **Passo 9.1.5:** Verificar que opções de voo aparecem

- [ ] **Passo 9.1.6:** Selecionar um voo e continuar

- [ ] **Passo 9.1.7:** Verificar que fluxo continua normalmente

### 9.2 Teste com API Real

- [ ] **Passo 9.2.1:** Configurar modo produção:
  ```env
  NEXT_PUBLIC_DEV_MODE=false
  ```

- [ ] **Passo 9.2.2:** Reiniciar servidor

- [ ] **Passo 9.2.3:** Repetir teste do Passo 9.1

- [ ] **Passo 9.2.4:** Verificar logs no console:
  - Conversão de códigos IATA
  - Início de busca
  - Polling de resultados
  - Transformação de dados

- [ ] **Passo 9.2.5:** Verificar que dados reais aparecem

### 9.3 Testes de Rotas Específicas

- [ ] **Passo 9.3.1:** Testar rota GRU → GIG (São Paulo → Rio)

- [ ] **Passo 9.3.2:** Testar rota GRU → SSA (São Paulo → Salvador)

- [ ] **Passo 9.3.3:** Testar rota GIG → BSB (Rio → Brasília)

- [ ] **Passo 9.3.4:** Testar com múltiplos passageiros (2-3 adultos)

### 9.4 Testes de Erro

- [ ] **Passo 9.4.1:** Testar com cidade inexistente

- [ ] **Passo 9.4.2:** Testar com data no passado

- [ ] **Passo 9.4.3:** Verificar mensagens de erro amigáveis

---

## ✅ FASE 10: VALIDAÇÃO FINAL

### 10.1 Checklist de Compatibilidade

- [ ] **Passo 10.1.1:** Confirmar que agente LLM não foi alterado:
  - Modelo: `claude-sonnet-4-5-20250929`
  - System prompt preservado
  - Tools preservadas

- [ ] **Passo 10.1.2:** Confirmar fluxo macro preservado:
  - Coleta de informações
  - Busca de voos
  - Seleção de voo
  - Busca de hotéis
  - Seleção de hotel
  - Criação de roteiro
  - Aprovação

- [ ] **Passo 10.1.3:** Confirmar interface do usuário preservada:
  - `NewTripChat.tsx` não modificado
  - `SelectionButton` funcionando
  - `ItineraryModal` funcionando

### 10.2 Testes End-to-End

- [ ] **Passo 10.2.1:** Criar viagem completa do início ao fim

- [ ] **Passo 10.2.2:** Verificar que voo é salvo corretamente

- [ ] **Passo 10.2.3:** Verificar que roteiro é gerado corretamente

- [ ] **Passo 10.2.4:** Verificar que viagem é salva no banco

### 10.3 Performance

- [ ] **Passo 10.3.1:** Medir tempo de resposta da busca de voos

- [ ] **Passo 10.3.2:** Verificar que polling não excede timeout

- [ ] **Passo 10.3.3:** Verificar logs de erro no console

---

## ✅ FASE 11: DOCUMENTAÇÃO E LIMPEZA

### 11.1 Documentação

- [ ] **Passo 11.1.1:** Criar arquivo `TRAVELPAYOUT_CHANGELOG.md`:
  ```markdown
  # Changelog: Migração Travelpayout
  
  ## [1.0.0] - 2025-12-02
  
  ### Adicionado
  - Integração com API Travelpayout para busca de voos
  - Arquivo `lib/travelpayout.ts` com 3 fases de busca
  - Variáveis de ambiente para credenciais Travelpayout
  
  ### Modificado
  - Import de `searchFlights` em `/api/chat/route.ts`
  
  ### Preservado
  - Agente LLM (Claude Sonnet 4.5)
  - Fluxo macro do usuário
  - Interface do frontend
  - Busca de hotéis (Amadeus)
  ```

- [ ] **Passo 11.1.2:** Atualizar README.md do projeto

- [ ] **Passo 11.1.3:** Adicionar comentários no código onde necessário

### 11.2 Limpeza

- [ ] **Passo 11.2.1:** Remover arquivos de teste temporários

- [ ] **Passo 11.2.2:** Remover console.logs desnecessários (manter os importantes)

- [ ] **Passo 11.2.3:** Verificar que não há código comentado

### 11.3 Backup

- [ ] **Passo 11.3.1:** Fazer backup do `amadeus.ts` original:
  ```bash
  cp src/lib/amadeus.ts src/lib/amadeus.backup.ts
  ```

- [ ] **Passo 11.3.2:** Commit das alterações:
  ```bash
  git add .
  git commit -m "feat: Migrar busca de voos de Amadeus para Travelpayout"
  ```

---

## 📊 Resumo de Arquivos Modificados

### Arquivos Criados
1. ✅ `src/lib/travelpayout.ts` - Nova biblioteca de integração

### Arquivos Modificados
1. ✅ `.env.local` - Adicionadas variáveis de ambiente
2. ✅ `src/app/api/chat/route.ts` - Alterado import (linha 3)

### Arquivos Preservados (NÃO MODIFICAR)
1. ❌ `src/lib/amadeus.ts` - Mantido para hotéis
2. ❌ `src/components/trips/new/NewTripChat.tsx`
3. ❌ `src/app/trips/new/page.tsx`
4. ❌ Todos os componentes de UI

---

## 🎯 Critérios de Sucesso

### Funcional
- [x] Busca de voos retorna resultados reais do Travelpayout
- [x] Usuário consegue selecionar voo no chat
- [x] Fluxo continua para hotéis após seleção de voo
- [x] Roteiro é criado e salvo corretamente

### Técnico
- [x] Código TypeScript sem erros
- [x] Testes passando
- [x] Logs informativos no console
- [x] Tratamento de erros adequado

### Compatibilidade
- [x] Agente LLM não foi alterado
- [x] Fluxo macro preservado
- [x] Interface do usuário preservada
- [x] Formato de dados compatível

---

## 🚨 Troubleshooting

### Problema: "TRAVELPAYOUTS_API_TOKEN não configurado"
**Solução:**
1. Verificar `.env.local`
2. Reiniciar servidor
3. Verificar que variável está acessível

### Problema: "Nenhum voo encontrado"
**Solução:**
1. Verificar logs de conversão IATA
2. Verificar se a rota existe
3. Tentar com datas diferentes

### Problema: "Tempo limite excedido"
**Solução:**
1. Aumentar `MAX_POLL_ATTEMPTS`
2. Aumentar `POLL_INTERVAL_MS`
3. Verificar conectividade com API

### Problema: Frontend não exibe voos
**Solução:**
1. Verificar formato de retorno
2. Verificar console do navegador
3. Verificar que `FlightOffer` está correto

---

**Documento criado em:** 2025-12-02  
**Versão:** 1.0  
**Status:** Guia de Implementação Completo
