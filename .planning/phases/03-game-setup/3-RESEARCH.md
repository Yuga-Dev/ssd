# Phase 3 Research: Game Setup

## Tech Stack
- Socket.IO (Server & Client)
- Node.js Data Structures (Memory Maps)
- React Zustand Store (`gameStore.ts`)

## Architecture Patterns
- **Ephemeral State**: Game rooms exist in-memory natively mapped to Socket.IO instances on the backend without polluting the Appwrite persistent storage, maximizing speed and handling disconnect volatility cleanly.
- **Role Concealment**: Roles are established on the server-side memory graph (`server/src/gameEngine.ts`). When the Host fires `start_game`, the server randomizes the array of connection IDs, masking the roles from broad `io.to(room).emit()` dispatches so the frontend can't accidentally trace network logs.
- **Host vs Client**: The client who fires `create_room` is mapped as the definitive Host and receives the room code. Other clients firing `join_room(code)` attach to the socket grouping.
