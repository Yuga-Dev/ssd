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

# Phase 3: Game Setup - execution plan

## Goal: Implement player selection and role assignment

<tasks>

<task id="game_memory_engine">
<action>
Create `server/src/gameEngine.ts`. Define a `GameRoom` interface encompassing `status` (lobby/active), `hostId`, `players` (array matching `socketId` to `name`), and an internal `roles` map (`socketId` to `'Imposter' | 'Crewmate'`). Create functions: `createRoom(hostId)`, `joinRoom(code, socketId, name)`, and `startGame(code)` which asserts player counts (3 to 12) AND specifically excludes the `hostId` from playing. It executes a random selection defining one Imposter from players (excluding host).
</action>
<read_first>
- server/index.ts
</read_first>
<acceptance_criteria>
- `gameEngine.ts` exports room manipulation and internal role assignment logic natively.
</acceptance_criteria>
</task>

<task id="socket_events">
<action>
Update `server/index.ts`. Import the engine methods. Bind `create_room`, `join_room`, and `start_game` listeners on standard socket connections. Ensure when a user joins, the host and room get an updated `room_state_update` emission holding public profiles (excluding role secrets).
</action>
<read_first>
- server/index.ts
</read_first>
<acceptance_criteria>
- Backend securely manages the setup socket events and returns necessary state.
</acceptance_criteria>
</task>

<task id="frontend_store">
<action>
Update `src/store/gameStore.ts`. Introduce attributes for `isConnected`, `roomCode`, `isHost`, `players` (names), and setup Zustand modifiers so the UI can represent the local game tree state when the socket receives updates.
</action>
<read_first>
- src/store/gameStore.ts
</read_first>
<acceptance_criteria>
- Frontend store fully supports lobby variables and connection flags.
</acceptance_criteria>
</task>

<task id="lobby_ui">
<action>
Modify `src/App.tsx`. Create a rudimentary structural wireframe rendering standard Tailwind UI buttons for "Create Room" and "Join Room". If a room is active, render the Player Lobby displaying connected participants and a "Start Game" conditional button exclusively visible to the Host if 3+ players are connected.
</action>
<read_first>
- src/App.tsx
</read_first>
<acceptance_criteria>
- The UI exposes functional routes connecting the unified Socket game flow without breaking React.
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- Role logic never dispatches the assigned Imposter over widespread channels.
- Hardcoded minimum count of 3 handles early start attempts cleanly.
</must_haves>

<requirements>
- SETUP-01
- SETUP-02
</requirements>
