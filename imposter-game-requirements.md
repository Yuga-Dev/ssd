# Imposter Word Game -- Final Requirements

## Overview

A multiplayer word deduction game where a host selects players and the
system secretly assigns words. One player is the imposter with a
slightly different word. Players discuss and identify the imposter.

The host **cannot see player roles or words**.

The application supports: - Web Application - Progressive Web
Application (PWA)

------------------------------------------------------------------------

## Core Features

### Player Selection

-   Host selects players from an existing player list
-   Minimum players: 3
-   Maximum players: 12

### Role Assignment

-   Server randomly assigns:
    -   1 Imposter
    -   Remaining players as Crewmates
-   Host cannot see role assignments

### Word Distribution

-   Server chooses a word pair
-   Crewmates receive the real word
-   Imposter receives the alternate word
-   Words are sent privately to each player

Example:

  Player   Word
  -------- -------
  A        Lion
  B        Lion
  C        Tiger
  D        Lion

### Word Reveal

Players see: Tap to reveal your word

### Discussion Phase

-   Countdown timer
-   Player discussion
-   Optional chat

### Reveal Phase

After timer ends: - Imposter identity revealed - Real word revealed -
Imposter word revealed

Game session ends.

------------------------------------------------------------------------

## AI Word Generation

Word pairs are generated using Google Gemini.

Batch generation: - 100 word pairs per batch

Trigger rule: - If unused words \< 20 → generate new batch

Word structure:

{ realWord imposterWord category difficulty relationship used }

------------------------------------------------------------------------

## Database

Collections:

players sessions wordPairs aiWordBatches

Example word pair:

{ "realWord": "Coffee", "imposterWord": "Tea", "category": "Food",
"difficulty": "Easy", "relationship": "Hot beverages", "used": false }

------------------------------------------------------------------------

## Technology Stack

Frontend - React - TailwindCSS - Zustand

Backend - Appwrite (Backend-as-a-Service)

Database - MongoDB

Realtime Communication - Socket.IO

AI Word Generation - Gemini API

------------------------------------------------------------------------

## PWA Support

Features: - Installable app - Offline asset caching - Mobile
responsive - Home screen launch

Required files: - manifest.json - service-worker.js

------------------------------------------------------------------------

## Game Flow

Host selects players → Start Game → Backend assigns roles → Backend
selects word pair → Words sent privately → Players reveal words →
Discussion timer → Reveal imposter → Session ends
