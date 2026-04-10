---
wave: 1
depends_on: []
files_modified:
  - server/package.json
  - server/src/models/Player.ts
  - server/src/models/Session.ts
  - server/src/database.ts
  - server/index.ts
  - server/src/gameEngine.ts
  - src/store/gameStore.ts
  - src/App.tsx
autonomous: true
---

# Phase 6: Player System and MongoDB Persistence - execution plan

## Goal: Remove Room code mechanics, substituting MongoDB mapped Player profiles natively executing forced connections

<tasks>

<task id="mongodb_bridging">
<action>
Modify `server/package.json` to install `mongoose`. Establish `server/src/database.ts` executing `mongoose.connect(process.env.MONGODB_URI)`. Extract native structural definitions inside `server/src/models/Player.ts` and `server/src/models/Session.ts` mirroring the SRS formatting.
</action>
<read_first>
- server/package.json
</read_first>
<acceptance_criteria>
- Backend securely bonds local execution schemas identically into remote Mongo caches securely avoiding duplicate indices.
</acceptance_criteria>
</task>

<task id="universal_sockets">
<action>
Update `server/index.ts` intercepting root connections globally executing an explicit `'register_device'` command binding a `playerId` identity dynamically overriding connection constraints mapping `isOnline = true` natively in MongoDB upon resolution. Conversely bind `disconnect` to update `isOnline = false` cleanly. 
</action>
<read_first>
- server/index.ts
</read_first>
<acceptance_criteria>
- Sockets execute isolated queries permanently linking connection identities into Mongoose queries reliably.
</acceptance_criteria>
</task>

<task id="engine_overhaul">
<action>
Extract the `createRoom` constraints resolving standard logic hooks locally transitioning arrays into pure `SessionId`. Destroy `joinRoom()`. Update `startGame()` fetching dynamically bound arrays rendering standard logic outputs cleanly alongside tracking Mongo structures via `Session.findOneAndUpdate` maintaining dual representations. Add a route ensuring Hosts can broadcast `'invite_players'` forcing backend logic hooks routing identities seamlessly.
</action>
<read_first>
- server/src/gameEngine.ts
</read_first>
<acceptance_criteria>
- Game engine effectively routes inputs resolving global instances overriding older manual Code inputs flawlessly.
</acceptance_criteria>
</task>

<task id="frontend_lobbies">
<action>
Perform a massive overhaul inside `src/App.tsx`. Generate an initial Identity screen tracking parameters storing localized definitions intercepting initial payload targets securely. Modify the Core `Host` view retrieving dynamic Lists via Socket payloads observing standard `isOnline` entities generating selectable arrays replacing the arbitrary Join Room boxes fundamentally. Ensure `store/gameStore.ts` explicitly drops mapping constraints routing into the new active parameters reliably avoiding crashes.
</action>
<read_first>
- src/App.tsx
- src/store/gameStore.ts
</read_first>
<acceptance_criteria>
- Realtime applications no longer use textual Code inputs forcing seamless UX workflows directly interacting smoothly rendering online arrays locally identically.
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- Device identity relies on locally cached ids mapping users directly without forcing excessive input typing constantly ensuring seamless recovery.
</must_haves>

<requirements>
- SRS Section 3.1 & 3.2
</requirements>
