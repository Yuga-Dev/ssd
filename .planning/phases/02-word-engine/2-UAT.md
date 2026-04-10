---
status: testing
phase: 02-word-engine
source: [2-SUMMARY.md]
started: 2026-04-10T19:34:00.000Z
updated: 2026-04-10T19:34:00.000Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Auto-Restock
expected: |
  Start the `server` (ensure Appwrite environment variables are set). Since there are no words in the fresh Appwrite DB, the startup hook should detect < 20 unused words and print logs that it is requesting 100 new word pairs from Gemini.
awaiting: user response

## Tests

### 1. Cold Start Auto-Restock
expected: |
  Start the `server` (ensure Appwrite environment variables are set). Since there are no words in the fresh Appwrite DB, the startup hook should detect < 20 unused words and print logs that it is requesting 100 new word pairs from Gemini.
result: [pending]

### 2. Schema Integrity Verification
expected: |
  Check the Appwrite 'Words' collection. Verify there are exactly 100 new documents, and each contains valid strings for `realWord` and `imposterWord` alongside `used: false`.
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0

## Gaps

