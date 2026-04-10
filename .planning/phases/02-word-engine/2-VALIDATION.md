# Phase 2 Validation Strategy

**Verification Goals:**
- Gemini SDK connects and authenticates `process.env.GEMINI_API_KEY`.
- Background task queries Appwrite 'Words' collection.
- Words successfully batch-insert into Appwrite.
- Condition `< 20` correctly triggers the restock flow.
