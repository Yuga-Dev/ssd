---
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/main.tsx
  - src/App.tsx
  - src/store/gameStore.ts
  - src/lib/appwrite.ts
  - src/lib/socket.ts
  - vite.config.ts
  - server/package.json
  - server/index.js
autonomous: true
---

# Phase 1: Architecture Foundation - execution plan

## Goal: Set up frontend, backend, database and realtime sockets

<tasks>

<task id="frontend_setup">
<action>
Initialize a React + Vite project in `.` (the root) via `npx create-vite@latest ./ --template react-ts`. Then install tailwindcss, postcss, autoprefixer and run `npx tailwindcss init -p`. Add tailwind directives to `src/index.css`.
</action>
<read_first>
- 
</read_first>
<acceptance_criteria>
- `package.json` contains react, vite, and tailwind dependencies
- `vite.config.ts` exists
- `src/index.css` contains `@tailwind base;`
</acceptance_criteria>
</task>

<task id="pwa_setup" depends_on="frontend_setup">
<action>
Install `vite-plugin-pwa`. Update `vite.config.ts` to include `VitePWA` from `vite-plugin-pwa` with basic manifest configuration (name: "Imposter Game", short_name: "Imposter", theme_color: "#000000").
</action>
<read_first>
- vite.config.ts
</read_first>
<acceptance_criteria>
- `vite.config.ts` imports and uses `VitePWA`
</acceptance_criteria>
</task>

<task id="appwrite_setup" depends_on="frontend_setup">
<action>
Install `appwrite`. Create `src/lib/appwrite.ts`. Initialize and export a standard Appwrite `Client` and `Databases` class instance. Read endpoints from `import.meta.env.VITE_APPWRITE_ENDPOINT` and `import.meta.env.VITE_APPWRITE_PROJECT`.
</action>
<read_first>
- src/lib/appwrite.ts
</read_first>
<acceptance_criteria>
- `src/lib/appwrite.ts` exposes `client` and `databases`
- `package.json` contains `appwrite`
</acceptance_criteria>
</task>

<task id="socket_server" depends_on="">
<action>
Create `server` directory. Run `npm init -y` inside `server/`. Install `express`, `socket.io`, `cors`. Create `server/index.js` which sets up an express app with a raw HTTP server handling socket.io connections. Connect and disconnect events should be logged. Server should listen on port 3001.
</action>
<read_first>
- server/index.js
</read_first>
<acceptance_criteria>
- `server/package.json` exists with dependencies
- `server/index.js` requires `express` and `socket.io` and binds to 3001
</acceptance_criteria>
</task>

<task id="socket_client" depends_on="frontend_setup, socket_server">
<action>
Install `socket.io-client` in the root. Create `src/lib/socket.ts` that exports `socket = io(URL)` where URL falls back to `"http://localhost:3001"`. 
</action>
<read_first>
- src/lib/socket.ts
</read_first>
<acceptance_criteria>
- `src/lib/socket.ts` imports `io` from `socket.io-client`
- `src/lib/socket.ts` exports an active `socket` connection
</acceptance_criteria>
</task>

<task id="zustand_setup" depends_on="frontend_setup">
<action>
Install `zustand`. Create `src/store/gameStore.ts`. Define and export a Zustand store `useGameStore` containing initial properties `players: []`, `roomId: null`, and `isImposter: false` along with dummy setter actions.
</action>
<read_first>
- src/store/gameStore.ts
</read_first>
<acceptance_criteria>
- `src/store/gameStore.ts` imports `create` from `zustand`
- Store has `players` array in its type signature
</acceptance_criteria>
</task>

</tasks>

<must_haves>
- PWA install capability setup in Vite.
- Appwrite SDK available for client logic.
- Realtime node server and client connector available.
- Zustand store scaffolding available.
</must_haves>

<requirements>
- ARCH-01
- ARCH-02
- ARCH-03
</requirements>
