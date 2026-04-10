# Phase 3 Validation Strategy

**Verification Goals:**
- Host UI can successfully invoke a 'Create Room' event resulting in a 4-letter code.
- Min (3) and Max (12) player capacities are strictly enforced before allowing the game to start.
- `start_game` Socket event initializes an internal game state structure representing the room.
- Role assignment guarantees EXACTLY 1 Imposter internally mapped to a socket identifier.
- The Imposter role assignment must NOT be broadcast to the host or public game state.
