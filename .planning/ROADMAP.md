# Roadmap

**4 phases** | **12 requirements mapped**

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Architecture Foundation | Set up frontend, backend, database and realtime sockets | ARCH-01, ARCH-02, ARCH-03 | Local environment works, backend connected, UI shells built |
| 2 | Word Engine | Integrate Gemini API and manage word batching | GAME-01, ARCH-04, ARCH-05 | Service fetches 100 word pairs, triggers refill when < 20, stores in DB |
| 3 | Game Setup | Implement player selection and role assignment | SETUP-01, SETUP-02 | Host can create game session, select 3-12 players, system assigns 1 Imposter internally |
| 4 | Core Loop | Implement gameplay phases (word distribution, discussion, reveal) | GAME-02, GAME-03, GAME-04, GAME-05 | Players get correct words privately, timer counts down, imposter exposed with correct UI at end |

### Phase 1: Architecture Foundation
Goal: Set up frontend, backend, database and realtime sockets
Requirements: ARCH-01, ARCH-02, ARCH-03
Success criteria:
1. PWA installable and caches assets
2. Frontend connects to Appwrite and MongoDB
3. Socket.IO connection established between client and server

### Phase 2: Word Engine
Goal: Integrate Gemini API and manage word batching
Requirements: GAME-01, ARCH-04, ARCH-05
Success criteria:
1. AI generates 100 pairs structured correctly
2. Background task triggers at < 20 words
3. Word pairs successfully saved to database

### Phase 3: Game Setup
Goal: Implement player selection and role assignment
Requirements: SETUP-01, SETUP-02
Success criteria:
1. Host can select 3-12 players from DB
2. System assigns exactly 1 Imposter per session
3. Roles are hidden from Host UI

### Phase 4: Core Loop
Goal: Implement gameplay phases (word distribution, discussion, reveal)
Requirements: GAME-02, GAME-03, GAME-04, GAME-05
**UI hint**: yes
Success criteria:
1. Crewmates get real word; Imposter gets alternate word
2. "Tap to reveal" works correctly on client devices
3. Countdown completes and exposes Imposter and both words natively

### Phase 5: Openquestons

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 4
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 5 to break down)

### Phase 6: Player System and MongoDB Persistence

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 5
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 6 to break down)

### Phase 7: Advanced Game Controls and Chat

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 7 to break down)

### Phase 8: AI Model Upgrades and PWA Integration

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)
