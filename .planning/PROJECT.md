# Imposter Word Game

## What This Is
A multiplayer word deduction game where a host selects players and the system secretly assigns words. One player is the imposter with a slightly different word. Players discuss and identify the imposter.

## Core Value
The suspense and social deduction of finding the imposter based on word clues, completely managed by the system without the host knowing the truth.

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Host can select 3-12 players from an existing player list
- [ ] System automatically assigns 1 Imposter and remaining players as Crewmates
- [ ] System automatically generates and assigns paired words using Gemini API
- [ ] Players receive words privately (Crewmates get real word, Imposter gets alternate)
- [ ] Players can reveal their words on device
- [ ] Discussion phase with countdown timer and optional chat
- [ ] Reveal phase shows Imposter identity, Real word, and Imposter word
- [ ] PWA support (installable, offline caching, mobile responsive)

### Out of Scope
- [ ] Host participating in the game as a player — explicitly excluded as host cannot see player roles or words.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Gemini API for word pair generation | Needs thematic real/imposter pairs with difficulty | — Pending |
| Appwrite for Backend, MongoDB for Database | Requirement specified | — Pending |
| Socket.IO for Realtime Communication | Requirement specified for multiplayer states | — Pending |

---
*Last updated: 2026-04-10 after initialization*

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
