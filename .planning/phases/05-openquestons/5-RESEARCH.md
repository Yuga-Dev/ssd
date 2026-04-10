# Phase 5 Research: Open Questons (Updates)

## Database Provisioning
To manage Appwrite schema initialization natively, the best path forward is a standalone bootstrapping script locally run via Node rather than manually constructing fields via the UI.
We'll utilize `node-appwrite`'s `Databases` management class functions: `create()`, `createCollection()`, `createStringAttribute()`, and `createBooleanAttribute()`. This ensures the structure maps identically to what `server/src/gameEngine.ts` requires. 

## Host Configurations
Currently, the timer is hardcoded at exactly 5 minutes (`Date.now() + 5 * 60 * 1000`). 
By extending the Socket `start_game` payload with an optional `duration` numerical parameter, the backend can map incoming configurations into universally synced end times seamlessly. React Zustand states effortlessly encompass the new parameters.

## Chat
Dropped from scope definitively as per user instructions. Players will deduce identities via verbal communication.
