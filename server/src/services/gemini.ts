import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface WordPair {
  realWord: string;
  imposterWord: string;
  category: string;
  difficulty: string;
  relationship: string;
}

export async function generateWordPairs(count: number): Promise<WordPair[]> {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Word generation skipped.");
    return [];
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Generate exactly ${count} word pairs for a social deduction game.
Each pair must have a 'realWord' intended for crewmates, and an 'imposterWord' that is slightly related but clearly different.
Also provide the 'category' (e.g. Food, Animals, Tech), 'difficulty' (Easy, Medium, Hard), and 'relationship' (a short description of how the two words relate).

Respond ONLY with a JSON array of objects. Do not include markdown blocks or any other explanation, just the raw JSON.
Example format:
[
  { 
    "realWord": "Coffee", 
    "imposterWord": "Tea",
    "category": "Food",
    "difficulty": "Easy",
    "relationship": "Hot beverages"
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Strip markdown formatting if the model still outputs it accidentally
    const cleanJSON = responseText.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    
    const parsed: WordPair[] = JSON.parse(cleanJSON);
    
    if (!Array.isArray(parsed)) {
       throw new Error("Output is not an array");
    }
    
    return parsed;
  } catch (error) {
    console.error('Error in generateWordPairs:', error);
    return [];
  }
}
