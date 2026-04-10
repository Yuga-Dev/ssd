# Phase 6: Player System and MongoDB Persistence

## Context & Decisions

The user has approved the "recommended" paths across all architectural boundaries regarding the integration of a formal Player System and MongoDB Persistence tracking.

### 1. Player Authentication
**Decision:** Lightweight Identity Selection.
Players will not use complex email/password abstractions. They will be directed to an identification screen where they simply register/select a Display Name. The system records this identity uniquely and stores their device binding locally (LocalStorage/Socket IDs) identifying them to the backend seamlessly.

### 2. Room Code Replacement
**Decision:** Automatic Socket Routing.
The standard 4-letter room codes are entirely removed. Instead, when players identify themselves, their Socket ID is mapped back to their DB Profile. The Host creates a game by explicitly targeting existing active Player IDs from a dropdown rendering connected profiles. When the Host confirms, the system automatically routes all targeted players directly into the active session without them inserting manually.

### 3. MongoDB Synchronization
**Decision:** Hybrid Persistence.
To maintain the required `< 200 ms` real-time message latency requirement, the Game Engine will continue relying on ephemeral native Node `Map` arrays resolving active logic loops. However, on any state transition (Created, Started, Concluded), the system will fire parallel asynchronous updates to MongoDB capturing the historical architecture permanently without bottlenecking the UI.
