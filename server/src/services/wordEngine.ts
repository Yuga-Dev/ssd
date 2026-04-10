import { databases, DATABASE_ID, WORDS_COLLECTION_ID, Query, ID } from './appwrite';
import { generateWordPairs } from './gemini';

export async function checkAndRefillWords() {
  if (!DATABASE_ID || !WORDS_COLLECTION_ID) {
    console.warn("[Word Engine] Missing DATABASE_ID or WORDS_COLLECTION_ID.");
    return;
  }

  try {
    // We only care about words that are NOT used yet
    const result = await databases.listDocuments(
      DATABASE_ID,
      WORDS_COLLECTION_ID,
      [
        Query.equal('used', false),
        Query.limit(1) // we just need the count, but we'll fetch at most 1
      ]
    );

    const unusedCount = result.total;
    console.log(`[Word Engine] Current unused word pairs: ${unusedCount}`);

    if (unusedCount < 20) {
      console.log(`[Word Engine] Words below threshold (< 20). Initiating batch generation...`);
      const newPairs = await generateWordPairs(100);

      if (newPairs.length === 0) {
         console.warn(`[Word Engine] Generation failed or returned empty.`);
         return;
      }

      console.log(`[Word Engine] Successfully generated ${newPairs.length} new pairs. Inserting into Appwrite...`);
      
      let insertedCount = 0;
      for (const pair of newPairs) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            WORDS_COLLECTION_ID,
            ID.unique(),
            {
              realWord: pair.realWord,
              imposterWord: pair.imposterWord,
              used: false
            }
          );
          insertedCount++;
        } catch (err) {
          console.error(`[Word Engine] Failed to insert word pair:`, err);
        }
      }

      console.log(`[Word Engine] Restock complete. ${insertedCount} words inserted successfully.`);
    }
  } catch (error) {
     console.error(`[Word Engine] Error checking or restocking words:`, error);
  }
}
