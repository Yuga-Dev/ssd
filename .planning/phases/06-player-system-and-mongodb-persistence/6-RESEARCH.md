# Phase 6 Research: Player System and MongoDB Persistence

## Tech Stack Expansion
- `mongoose`: We will implement standard MongoDB Object Modeling.
- LocalStorage references map Device/ID structures continuously.

## Architecture Patterns

### Database Migrations
We will create a `Player` Schema:
```ts
{
  displayName: String,
  deviceId: String,
  isOnline: Boolean
}
```

We will create a `Session` Schema:
```ts
{
  hostId: String,
  players: [String],
  status: String,
  wordPairId: String,
  createdAt: Date
}
```

### Removing Room Codes
The current execution binds Room creations and joins exclusively derived from a generated alphanumeric integer. When refactoring out Room Codes, the Session needs to be addressed via a standard absolute generic ID (e.g., standard MongoDB Object IDs). The Host UI will pull a query for absolutely every `isOnline` player that isn't already inside a game and visualize them. 

### Global Connection Polling
Currently, sockets are only tracked relative to a single Game. We must create a new parallel mapping routing `Player IDs` back to their global `Socket IDs` natively at connection enabling the server to pull a selected Player right into a Game instance forcefully.
