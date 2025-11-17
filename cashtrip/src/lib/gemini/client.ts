import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY não está configurada no .env.local');
}

const genai = new GoogleGenerativeAI(apiKey);

export const geminiModel = genai.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  },
});

export async function processQuizWithGemini(
  prompt: string,
  quizData: string
): Promise<any> {
  const result = await geminiModel.generateContent(
    `${prompt}\n\n${quizData}`
  );
  
  const response = result.response.text();
  
  // Extrair JSON do texto
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  
  // Tentar parsear direto se não tiver markdown
  return JSON.parse(response);
}

