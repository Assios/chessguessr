/**
 * Migration script: seed all puzzles from game.server.ts into Convex.
 *
 * Usage: npx ts-node scripts/migrate-to-convex.ts
 *
 * Requires CONVEX_URL env var (loaded from .env.local).
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('CONVEX_URL not set. Check .env.local');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// Import games from the static file
async function main() {
  // Dynamic import to handle the async getGames()
  const { getGames } = require('../app/models/game.server');
  const games = await getGames();

  console.log(`Found ${games.length} puzzles to migrate.`);

  // Convex mutations have argument size limits, so batch in groups of 50
  const BATCH_SIZE = 50;

  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE);

    const puzzles = batch.map((game: any) => ({
      puzzleId: game.id,
      date: game.date,
      fen: game.fen,
      solution: game.solution,
      gameUrl: game.gameUrl,
      white: game.white,
      black: game.black,
      ...(game.wAka && { wAka: game.wAka }),
      ...(game.bAka && { bAka: game.bAka }),
      ...(game.wTitle && { wTitle: game.wTitle }),
      ...(game.bTitle && { bTitle: game.bTitle }),
      wRating: game.wRating,
      bRating: game.bRating,
      ...(game.event && { event: game.event }),
      ...(game.eventUrl && { eventUrl: game.eventUrl }),
      ...(game.variant && { variant: game.variant }),
      // Initialize stats at zero — we'll merge Firebase stats separately
      solved: 0,
      failed: 0,
      totalTurns: 0,
    }));

    await client.mutation(api.functions.seedPuzzles, { puzzles });

    console.log(
      `Migrated ${Math.min(i + BATCH_SIZE, games.length)}/${games.length} puzzles`
    );
  }

  console.log('Migration complete!');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
