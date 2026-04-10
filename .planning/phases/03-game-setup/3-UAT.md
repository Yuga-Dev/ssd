---
status: testing
phase: 03-game-setup
source: [3-SUMMARY.md]
started: 2026-04-10T19:42:00.000Z
updated: 2026-04-10T19:42:00.000Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Host Room Creation
expected: |
  Start the frontend and backend servers. Navigate to the game site in a browser and click 'Create Room (Host)'. You should be placed into the Host Dashboard displaying a 4-letter Room Code. The 'Start Game' button should be visibly disabled since no one affects the player count yet.
awaiting: user response

## Tests

### 1. Host Room Creation
expected: |
  Start the frontend and backend servers. Navigate to the game site in a browser and click 'Create Room (Host)'. You should be placed into the Host Dashboard displaying a 4-letter Room Code. The 'Start Game' button should be visibly disabled since no one affects the player count yet.
result: [pending]

### 2. Player Join & Lobby Validation
expected: |
  Open a completely separate browser window. Enter the host's 4-letter Room Code alongside a nickname, then click 'Join Room'. On your new player tab it should lock into 'Waiting for host to start the game...'. On the host tab, the new player's name should appear synchronously in the lobby list.
result: [pending]

### 3. Start Condition Minimums
expected: |
  Have 3 total players join the lobby (you will need 2 more tabs). On the host tab, verify the 'Start Game' button becomes fully clickable when the threshold is met, updating its label correctly.
result: [pending]

### 4. Role Assignment & Game Start
expected: |
  As the host, click 'Start Game'. Verify the Host tab transitions smoothly indicating the game is under way. On the players' tabs, verify the layout transitions to the Identity screen. Exactly **one** player must see 'IMPOSTER' rendered in red, and the others must see 'CREWMATE' rendered in cyan.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0

## Gaps

