---
status: testing
phase: 05-openquestons
source: [5-SUMMARY.md]
started: 2026-04-10T19:55:00.000Z
updated: 2026-04-10T19:55:00.000Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Database Bootstrapping Script
expected: |
  Open your terminal, navigate to the `server/` directory, and execute `npm run setup`. Verify the output cleanly states `Collection words_col already exists` or creates it successfully stating `Attributes mapped successfully`.
awaiting: user response

## Tests

### 1. Database Bootstrapping Script
expected: |
  Open your terminal, navigate to the `server/` directory, and execute `npm run setup`. Verify the output cleanly states `Collection words_col already exists` or creates it successfully stating `Attributes mapped successfully`.
result: [passed]

### 2. Variable Host Timers
expected: |
  Launch the frontend application and 'Create Room (Host)'. In the Lobby dashboard, verify the new '<select>' element exists. Change the dropdown setting to '3 Minutes (Fast)'. Join 2 additional tabs to the room. Click 'Start Game' and verify the Host active timer begins counting downwards exactly from 03:00.
result: [passed]

## Summary

total: 2
passed: 2
issues: 0
pending: 0
skipped: 0

## Gaps

