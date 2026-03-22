# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chessguessr is a Wordle-style chess puzzle game where players guess the next 5 moves in a chess game. Puzzles are sourced from Lichess games. The app is built with Remix, TypeScript, Tailwind CSS (with DaisyUI), and Firebase.

## Development Commands

```bash
npm run dev          # Start dev server (Remix + Tailwind watcher)
npm run build        # Production build (CSS + Remix)
npm start            # Serve production build
npm run check-duplicates  # Validate puzzle uniqueness (runs on pre-push)
npx ts-node tests/<file>.ts  # Run individual test scripts
npx eslint .         # Run linting
```

## Architecture

### Core Game Logic
- `app/hooks/useChessguessr.ts` - Main game state hook managing guesses, board position, move validation, and scoring. Uses chess.js for move validation.
- `app/components/Chessguessr.tsx` - Main game component orchestrating board, grid, and modals
- `app/components/ChessgroundBoard.tsx` - Chessground wrapper for the interactive chess board

### Data Flow
- `app/models/game.server.ts` - Contains all puzzles as a static array. Each puzzle has: date, FEN, 5-move solution, player info, and Lichess game URL
- `app/routes/index.tsx` - Daily puzzle loader; finds puzzle matching current date
- `app/routes/games/$slug.tsx` - Archive game loader by slug
- Firebase Firestore stores puzzle stats (solve rates) and user progress

### Guess Feedback System
The `formatGuess()` function in `useChessguessr.ts` determines hint colors:
- Green: Correct move in correct position
- Yellow: Correct move in wrong position
- Blue: Correct piece type moved (but wrong move)
- Grey: Incorrect

### State Persistence
- `useLocalStorage` hook stores: game state (`cg-state`), player stats (`cg-stats`), tutorial seen (`cg-tutorial`)

## Key Types

```typescript
// app/utils/types.ts
GameType: { date, fen, solution: string[], gameUrl, white, black, ratings, id }
GameStatus: IN_PROGRESS | SOLVED | FAILED
```

## Styling

- Tailwind + DaisyUI themes: `lichess-light`, `lichess-dark`, `corporate` (default)
- Import paths use `~/...` alias (maps to `./app/*`)
- Prettier: single quotes, semicolons, 2-space indent, ES5 trailing commas

## Adding New Puzzles

Add entries to the array in `app/models/game.server.ts`. Each puzzle needs:
- Unique `date` (YYYY-MM-DD format)
- Unique `id`
- Valid `fen` position
- 5-move `solution` array in SAN notation
- Player info and `gameUrl`

Run `npm run check-duplicates` before pushing to verify no duplicate dates/IDs/FENs.

## Deployment

Deployed to Vercel. The `api/` directory contains production build output—do not edit directly. Firestore rules are in `firestore.rules` and deployed via Firebase Console.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
