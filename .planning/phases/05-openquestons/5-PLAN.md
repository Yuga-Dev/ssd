---
wave: 1
depends_on: []
files_modified:
  - server/src/scripts/setupDatabase.ts
  - server/package.json
  - server/index.ts
  - server/src/gameEngine.ts
  - src/App.tsx
autonomous: true
---

# Phase 5: Openquestons - execution plan

## Goal: Resolve outstanding architectural gaps regarding Data Provisioning and Configuration limits

<tasks>

<task id="data_provisioning">
<action>
Create `server/src/scripts/setupDatabase.ts`. Construct a procedural pipeline that boots `node-appwrite`, evaluates if the `word_game_db` database exists via `databases.get()`. If not, it executes `databases.create()`. It subsequently evaluates the collection, building `createStringAttribute('realWord', 255, true)`, `createStringAttribute('imposterWord', 255, true)`, and `createBooleanAttribute('used', false, false)`. Update `package.json` adding a `"setup"` hook wrapping `tsx src/scripts/setupDatabase.ts`.
</action>
<read_first>
- server/src/services/appwrite.ts
</read_first>
<acceptance_criteria>
- The project allows administrators to generate all dependencies via a single terminal command.
</acceptance_criteria>
</task>

<task id="engine_durations">
<action>
Update `server/src/gameEngine.ts` transitioning `startGame(code, hostId)` to map an optional `durationMinutes: number` argument. Default it to `5` if undefined to prevent breaking flows. Change the mathematical end time execution to apply `Date.now() + durationMinutes * 60 * 1000`. Update `server/index.ts` to properly pipe `.on('start_game', async ({ code, duration }))` variables seamlessly across the bridge mapping.
</action>
<read_first>
- server/src/gameEngine.ts
- server/index.ts
</read_first>
<acceptance_criteria>
- Server properly calculates distinct `endTime` integers per room preferences.
</acceptance_criteria>
</task>

<task id="ui_timers">
<action>
Update `src/App.tsx`. Inside the Host lobby conditional layout, insert a `<select>` drop-down containing options: `3 Minutes`, `5 Minutes`, and `10 Minutes` directly bound to a fresh `timerSelect` reactive Hook. Attach that hook directly into the `handleStartGame` click execution emitting `{ code, duration }` payload properly.
</action>
<read_first>
- src/App.tsx
</read_first>
<acceptance_criteria>
- Hosts control constraints before initializing.
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- The Bootstrapping script avoids crashing if schemas already exist.
</must_haves>

<requirements>
- SETUP-02 Updates
</requirements>
