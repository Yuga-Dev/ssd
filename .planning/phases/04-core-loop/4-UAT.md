---
status: testing
phase: 04-core-loop
source: [4-SUMMARY.md]
started: 2026-04-10T19:47:00.000Z
updated: 2026-04-10T19:47:00.000Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Database Sync & Obfuscation
expected: |
  Start a game with 3 browser tabs. For the two active players, you should see 'HOLD TO REVEAL'. Click and hold (or tap and hold) the element to verify the text briefly pulses with either a generic Crewmate word or an Imposter word. Make sure the Host tab sees none of this text.
awaiting: user response

## Tests

### 1. Database Sync & Obfuscation
expected: |
  Start a game with 3 browser tabs. For the two active players, you should see 'HOLD TO REVEAL'. Click and hold (or tap and hold) the element to verify the text briefly pulses with either a generic Crewmate word or an Imposter word. Make sure the Host tab sees none of this text.
result: [pending]

### 2. Synchronous UI Timers
expected: |
  Check the Host tab and verify the timer begins ticking downwards from 5 minutes (05:00). Wait for 5 seconds and check if the countdown perfectly transitions.
result: [pending]

### 3. End Game Identity Reveal
expected: |
  On the Host tab, click 'Force End Game'. Verify all 3 tabs immediately switch to a 'GAME OVER' state exposing exactly who the Imposter was and the difference between the two dictionary words mapped correctly.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0

## Gaps

