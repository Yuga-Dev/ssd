# Phase 1: Architecture Foundation - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up frontend, backend, database and realtime sockets. Delivers an installable PWA shell connected to an Appwrite backend and a Socket.IO real-time server.

</domain>

<decisions>
## Implementation Decisions

### PWA Implementation
- **D-01:** Use Vite PWA plugin for automatic manifest and service worker generation
- **D-02:** Support basic offline fallback page, relying on network-first caching

### Socket.IO Setup
- **D-03:** Deploy a standalone Node.js Express server to handle Socket.IO connections (separate from Appwrite BaaS)
- **D-04:** Use standard Socket.IO client in the React frontend

### Database & Backend
- **D-05:** Use Appwrite SDK for client-server database interactions
- **D-06:** Setup Appwrite project locally or integrate with cloud instance

### State Management
- **D-07:** Initialize Zustand store for global application state (player sessions, current view)

### the agent's Discretion
- Project file structure
- Vite configuration details
- Environment variable structure

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Focus on connecting the core layers.

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
