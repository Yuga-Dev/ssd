# Phase 4 Research: Core Loop

## Tech Stack
- Appwrite Databases (`listDocuments` & `updateDocument`)
- React Time/Interval abstractions
- Socket.IO targeted emissions

## Architecture Patterns
- **Async Game State Transitions**: Our existing `startGame` method is strictly synchronous. We must transition this into a `Promise` returning structure. Since we only transition out of the Lobby State into Active state once Database confirmation succeeds, it avoids exposing early states if Appwrite encounters limits.
- **Client Timestamping**: Transmitting synchronized integer seconds across WebSockets yields stuttering. The superior mechanism involves the Backend attaching a future `unix timestamp` termination time and pushing that out once. The React clients then just compute `targetTime - Date.now()` locally within a `requestAnimationFrame` or `setInterval` hook.
- **Obfuscation**: A core social deduction feature involves hiding words from nearby observers. Players must hold down an interactive element on mobile screens allowing them to peek at their assigned word momentarily.
