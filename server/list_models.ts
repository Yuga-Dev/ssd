import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  const models = data.models.filter((m: any) => m.supportedGenerationMethods.includes('generateContent')).map((m: any) => m.name);
  console.log(models);
}

listModels().catch(console.error);
