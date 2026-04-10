# Phase 2 Research: Word Engine

## Tech Stack
- Google Gen AI SDK (`@google/generative-ai`)
- Appwrite Server SDK (`node-appwrite`)
- TypeScript Node environment

## Architecture Patterns
- **Generative AI Schema**: Gemini models return generic text unless instructed to return JSON. Use system instructions or prompt tuning to ensure a rigid `[{realWord, imposterWord}]` JSON output is provided.
- **Background Daemon**: Given it's a lightweight Express backend, `setInterval` on process startup is sufficient for continuous DB checks without overhead of full cron solutions.
- **Database Rules**: Appwrite Server API key needed (`node-appwrite`) to securely batch-insert word pairs without hitting client-side rate limits or exposing insertion logic.
