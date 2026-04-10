---
wave: 1
depends_on: []
files_modified:
  - server/package.json
  - server/src/services/gemini.ts
  - server/src/services/appwrite.ts
  - server/src/services/wordEngine.ts
  - server/index.ts
autonomous: true
---

# Phase 2: Word Engine - execution plan

## Goal: Integrate Gemini API and manage word batching

<tasks>

<task id="deps">
<action>
Install `@google/generative-ai` and `node-appwrite` in the `server` directory.
</action>
<read_first>
- server/package.json
</read_first>
<acceptance_criteria>
- `server/package.json` contains `@google/generative-ai` and `node-appwrite`
</acceptance_criteria>
</task>

<task id="appwrite_server">
<action>
Create `server/src/services/appwrite.ts`. Initialize a server-side Appwrite `Client` and `Databases` class instance using `node-appwrite` library (requires Endpoint, Project, and API key). Define dummy constants for `DATABASE_ID` and `WORDS_COLLECTION_ID` fetched from `process.env`.
</action>
<read_first>
- server/src/services/appwrite.ts
</read_first>
<acceptance_criteria>
- `server/src/services/appwrite.ts` exposes an initialized `Databases` object from `node-appwrite` using admin `setKey`
</acceptance_criteria>
</task>

<task id="gemini_service">
<action>
Create `server/src/services/gemini.ts`. Initialize `GoogleGenerativeAI` using `process.env.GEMINI_API_KEY`. Implement `generateWordPairs(count: number)` function which prompts the `gemini-1.5-flash` model to return an exact JSON array containing `count` objects with `realWord` and `imposterWord` properties. Parse and return the JSON array.
</action>
<read_first>
- server/src/services/gemini.ts
</read_first>
<acceptance_criteria>
- `generateWordPairs` function invokes the model and returns parsed JSON array
</acceptance_criteria>
</task>

<task id="engine_logic" depends_on="appwrite_server, gemini_service">
<action>
Create `server/src/services/wordEngine.ts`. Implement `checkAndRefillWords()`. It should use the Appwrite SDK to count documents in the Words collection where `used == false`. If count `< 20`, it calls `generateWordPairs(100)`, iterates the array, and creates documents in Appwrite with { realWord, imposterWord, used: false }.
</action>
<read_first>
- server/src/services/wordEngine.ts
</read_first>
<acceptance_criteria>
- `checkAndRefillWords` queries database, compares to 20, generates, and writes back
</acceptance_criteria>
</task>

<task id="daemon_hook" depends_on="engine_logic">
<action>
Update `server/index.ts` to import `checkAndRefillWords` and run it securely in a `setInterval` loop every 5 minutes (`300000` ms). Execute it once synchronously right before `server.listen()`.
</action>
<read_first>
- server/index.ts
</read_first>
<acceptance_criteria>
- `server/index.ts` calls `setInterval(checkAndRefillWords, 300000)`
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- Gemini integrates smoothly to provide identical JSON schemas.
- Express server reliably queries and updates Appwrite storage.
- Safe thresholds triggers `< 20`.
</must_haves>

<requirements>
- GAME-01
- ARCH-04
- ARCH-05
</requirements>
