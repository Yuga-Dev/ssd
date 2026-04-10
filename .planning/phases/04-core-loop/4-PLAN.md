---
wave: 1
depends_on: []
files_modified:
  - server/src/gameEngine.ts
  - server/index.ts
  - src/store/gameStore.ts
  - src/App.tsx
autonomous: true
---

# Phase 4: Core Loop - execution plan

## Goal: Implement gameplay phases (word distribution, discussion, reveal)

<tasks>

<task id="async_start_game">
<action>
Modify `server/src/gameEngine.ts`. Import `databases`, `DATABASE_ID`, and `WORDS_COLLECTION_ID` from the `appwrite.ts` abstraction. Change `startGame(code, hostId)` to be `async`. Inside it, run a query to fetch `1` available document where `used` equates to false. Capture the `realWord` and `imposterWord` explicitly, and immediately execute an `updateDocument` applying `used: true`. Attach this `wordPair` object to the returned `GameRoom` payload. Add a new `endGame(code)` function transitioning status to `'reveal'`.
</action>
<read_first>
- server/src/gameEngine.ts
</read_first>
<acceptance_criteria>
- Game engine effectively draws unique words directly out of the Appwrite ecosystem avoiding duplication globally.
</acceptance_criteria>
</task>

<task id="dispatch_targeted_words">
<action>
Update `server/index.ts` to `await startGame()`. Inside the player `.forEach` loop dispensing the `role_assigned` events, extend the response mapping. Compute whether their internally mapped role equates to `'Imposter'`. Dispatch their relative `word` along with the `endTime` UNIX timestamp corresponding to 5 minutes into the future securely inside their isolated payload. Bind an `end_game` event executing the Engine's wrap-up logic, triggering a broad `'game_ended'` emission holding the Imposter Socket ID and both words for public visualization.
</action>
<read_first>
- server/index.ts
</read_first>
<acceptance_criteria>
- Network traces confirm the Host receives no payload regarding other player words.
</acceptance_criteria>
</task>

<task id="store_integration">
<action>
Modify `src/store/gameStore.ts`. Extend the initial parameters accommodating the `endTime` tracker internally. Include `revealState` handling (`imposterSocketId`, `trueRealWord`, `trueImposterWord`). Attach relative `setEndTime()` and `setRevealState()` reducers.
</action>
<read_first>
- src/store/gameStore.ts
</read_first>
<acceptance_criteria>
- The global Zustand state accurately reflects impending reveal structures cleanly.
</acceptance_criteria>
</task>

<task id="interactive_game_client">
<action>
Overhaul the Active game conditions within `src/App.tsx`. 
For the **Host**: Show a localized real-time structural countdown timer executing against the global end timestamp. Render an explicit "Force End Game" button dispatching the `end_game` socket intent. 
For **Players**: Utilize `onMouseDown/onTouchStart` states bounding conditional Tailwind classes rendering the word exclusively when held down.
For **Reveal**: Add conditional rendering intersecting the `'reveal'` store state, broadcasting the Imposter structurally alongside the Word definitions across all devices universally.
</action>
<read_first>
- src/App.tsx
</read_first>
<acceptance_criteria>
- Application is playable completely seamlessly without needing to ever cross-check physical screens representing native deduction mechanics perfectly.
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- The UI properly hides the word upon release enforcing anti-shoulder surfing logic natively.
</must_haves>

<requirements>
- GAME-02
- GAME-03
- GAME-04
- GAME-05
</requirements>
