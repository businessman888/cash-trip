/**
 * Validação de variáveis de ambiente relacionadas ao Gemini
 */

export function validateGeminiEnv(): { valid: boolean; error?: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      error: 'GEMINI_API_KEY não está configurada no .env.local',
    };
  }
  
  if (apiKey.trim().length === 0) {
    return {
      valid: false,
      error: 'GEMINI_API_KEY está vazia',
    };
  }
  
  // Verificar formato básico da chave (geralmente começa com letras)
  if (!/^[A-Za-z0-9_-]+$/.test(apiKey)) {
    return {
      valid: false,
      error: 'GEMINI_API_KEY tem formato inválido',
    };
  }
  
  return { valid: true };
}

export function getGeminiApiKey(): string {
  const validation = validateGeminiEnv();
  if (!validation.valid) {
    throw new Error(validation.error || 'GEMINI_API_KEY inválida');
  }
  return process.env.GEMINI_API_KEY!;
}

