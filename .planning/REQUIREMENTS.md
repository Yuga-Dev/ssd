# Requirements

## v1 Requirements

### Game Setup
- [ ] **SETUP-01**: Host can select players from an existing player list (min 3, max 12)
- [ ] **SETUP-02**: System automatically assigns 1 Imposter role and remaining players as Crewmates

### Core Gameplay
- [ ] **GAME-01**: System generates word pairs using Gemini API (real/imposter words)
- [ ] **GAME-02**: Players receive their assigned word privately based on their role
- [ ] **GAME-03**: Players can manually reveal their assigned word on their device screen
- [ ] **GAME-04**: Discussion phase with countdown timer
- [ ] **GAME-05**: Reveal phase shows Imposter identity, real word, and imposter word when timer ends

### Architecture
- [ ] **ARCH-01**: Web Application and PWA installable with offline asset caching
- [ ] **ARCH-02**: Realtime communication for game phases using Socket.IO
- [ ] **ARCH-03**: Backend powered by Appwrite with MongoDB database
- [ ] **ARCH-04**: Gemini integration for batch processing word pairs (100 per batch)
- [ ] **ARCH-05**: Auto-replenish word batch when unused words < 20

## v2 Requirements
(None deferred currently)

## Out of Scope
- Host participating as a player — Host cannot see roles or words, so they cannot play directly

## Traceability
*To be filled by roadmap generation*
