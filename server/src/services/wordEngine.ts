import { WordPair } from '../models/WordPair';
import { AiWordBatch } from '../models/AiWordBatch';
import { generateWordPairs } from './gemini';

export async function checkAndRefillWords() {

  try {
    const unusedCount = await WordPair.countDocuments({ used: false });
    console.log(`[Word Engine] Current unused word pairs: ${unusedCount}`);

    if (unusedCount < 20) {
      console.log(`[Word Engine] Words below threshold (< 20). Initiating batch generation...`);
      const newPairs = await generateWordPairs(100);

      if (newPairs.length === 0) {
         console.warn(`[Word Engine] Generation failed or returned empty.`);
         return;
      }

      console.log(`[Word Engine] Successfully generated ${newPairs.length} new pairs. Inserting into MongoDB...`);
      
      let insertedCount = 0;
      const insertedIds = [];
      for (const pair of newPairs) {
        try {
          const wp = new WordPair({
            realWord: pair.realWord,
            imposterWord: pair.imposterWord,
            category: pair.category,
            difficulty: pair.difficulty,
            relationship: pair.relationship,
            used: false
          });
          await wp.save();
          insertedIds.push(wp._id);
          insertedCount++;
        } catch (err) {
          console.error(`[Word Engine] Failed to insert word pair:`, err);
        }
      }
      
      if (insertedCount > 0) {
          const batch = new AiWordBatch({
              batchSize: insertedCount,
              wordIds: insertedIds
          });
          await batch.save();
      }

      console.log(`[Word Engine] Restock complete. ${insertedCount} words inserted successfully.`);
    }
  } catch (error) {
     console.error(`[Word Engine] Error checking or restocking words:`, error);
  }
}
