# Phase 7 Research: AI Model Upgrades and PWA Integration

## AI Schema Mapping
The current `gemini.ts` outputs a flat `{ realWord, imposterWord }` JSON Object. As dictated by the exact SRS constraints (Section 4.1), the system must request dynamic `category`, `difficulty`, and `relationship` bounds.
The target JSON structure requires tracking standard word metrics allowing future enhancements.

## Native PWA Bypass
Previously, integrating `vite-plugin-pwa` forced a fatal crash given its peer-dependency mismatch concerning Vite 8.0+. To strictly follow PWA constraints natively without breaking compilation loops, the application will inject standard generic Service Worker hooks alongside caching configurations dynamically explicitly inside the `/public` directory.

## Persistent MongoDB Transition
All Appwrite code references must be systematically purged from `wordEngine.ts`. Standard Mongoose models executing queries like `.countDocuments({ used: false })` flawlessly execute the required batches.
New structurally tracked batches require creating an explicit `<AiWordBatch>` schema recording historical API interactions.
