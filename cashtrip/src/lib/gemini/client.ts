import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY não está configurada no .env.local');
}

const genai = new GoogleGenerativeAI(apiKey);

// Modelo principal: Gemini 2.0 Flash Experimental
export const geminiModel = genai.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  },
});

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  timeout?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  timeout: 30000,
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getErrorMessage(error: any): string {
  if (error?.message) {
    const msg = error.message.toLowerCase();
    
    // Erros de quota
    if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('429')) {
      return 'API temporariamente indisponível devido a limite de uso. Tentando novamente...';
    }
    
    // Erros de autenticação
    if (msg.includes('auth') || msg.includes('401') || msg.includes('403') || msg.includes('invalid api key')) {
      return 'Erro de autenticação da API. Verifique a chave de API.';
    }
    
    // Erros de servidor
    if (msg.includes('500') || msg.includes('server error') || msg.includes('internal error')) {
      return 'Serviço temporariamente indisponível. Tentando novamente...';
    }
    
    // Timeout
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return 'Requisição demorou muito. Tentando novamente...';
    }
    
    // Erro 404 (modelo não encontrado)
    if (msg.includes('404') || msg.includes('not found')) {
      return 'Modelo não encontrado. Verifique a configuração da API.';
    }
    
    return error.message;
  }
  
  return 'Erro desconhecido ao processar requisição';
}

export async function processQuizWithGemini(
  prompt: string,
  quizData: string,
  options: RetryOptions = {}
): Promise<any> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any = null;
  
  // Tentar apenas com modelo principal (gemini-2.0-flash-exp)
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`[Gemini Client] Tentativa ${attempt + 1}/${config.maxRetries + 1} com gemini-2.0-flash-exp`);
      
      // Criar timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), config.timeout);
      });
      
      // Fazer requisição com timeout
      const resultPromise = geminiModel.generateContent(
        `${prompt}\n\n${quizData}`
      );
      
      const result = await Promise.race([resultPromise, timeoutPromise]) as any;
      
      if (!result || !result.response) {
        throw new Error('Invalid response from Gemini API');
      }
      
      const response = result.response.text();
      
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }
      
      // Extrair JSON do texto
      let jsonData: any;
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[1]);
      } else {
        // Tentar encontrar JSON mesmo sem markdown
        const jsonOnlyMatch = response.match(/\{[\s\S]*\}/);
        if (jsonOnlyMatch) {
          jsonData = JSON.parse(jsonOnlyMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }
      }
      
      // Validar estrutura básica
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid JSON structure returned');
      }
      
      console.log(`[Gemini Client] Sucesso na tentativa ${attempt + 1}`);
      return jsonData;
      
    } catch (error: any) {
      lastError = error;
      const errorMsg = getErrorMessage(error);
      
      console.error(`[Gemini Client] Tentativa ${attempt + 1}/${config.maxRetries + 1} falhou:`, {
        error: errorMsg,
        errorDetails: error?.message || error,
      });
      
      // Se não é o último attempt, aguardar antes de tentar novamente
      if (attempt < config.maxRetries) {
        const delayMs = Math.min(
          config.initialDelay * Math.pow(2, attempt),
          config.maxDelay
        );
        
        console.log(`[Gemini Client] Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  throw new Error(`Failed after ${config.maxRetries + 1} attempts: ${getErrorMessage(lastError)}`);
}
