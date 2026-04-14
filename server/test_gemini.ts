import { generateWordPairs } from './src/services/gemini';

async function testAI() {
  console.log("Generating 2 word pairs...");
  try {
    const pairs = await generateWordPairs(2);
    console.log("AI Output:", JSON.stringify(pairs, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testAI();
