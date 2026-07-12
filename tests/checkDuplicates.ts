/// <reference path="../app/declarations.d.ts" />
import { getGames } from "../app/models/game.server";
import { GameType } from "../app/utils/types";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

// Duplicates that already shipped and are grandfathered in. Only these exact
// id pairs are tolerated — any new duplicate (including a third occurrence
// of one of these positions/games) still fails the check.
const ALLOWED_DUPLICATE_PAIRS = new Set([
  "1309+1471", // same position
  "229+651", // same lichess game, different position
  "287+306",
  "481+530",
  "1112+1320",
]);

const pairKey = (ids: number[]) => [...ids].sort((a, b) => a - b).join("+");

const lichessGameId = (url: string) => {
  if (!url || url.includes("/broadcast/")) return null;
  const match = url.match(/lichess\.org\/([a-zA-Z0-9]{8})/);
  return match ? match[1] : null;
};

(async () => {
  const games = await getGames();
  const errors: string[] = [];

  // /games/:id looks games up by array index (games[id - 1]), and the daily
  // puzzle by exact date match — so ids and dates must both be contiguous.
  games.forEach((game, i) => {
    if (game.id !== i + 1) {
      errors.push(
        `Game at array position ${i} has id ${game.id}, expected ${i + 1}`
      );
    }
  });

  for (let i = 1; i < games.length; i++) {
    const prev = new Date(games[i - 1].date).getTime();
    const cur = new Date(games[i].date).getTime();
    if (cur - prev !== 86400000) {
      errors.push(
        `Dates not consecutive: id ${games[i - 1].id} (${
          games[i - 1].date
        }) -> id ${games[i].id} (${games[i].date})`
      );
    }
  }

  const checkDuplicates = (
    label: string,
    keyOf: (game: GameType) => string | null,
    allowGrandfathered: boolean
  ) => {
    const byKey = new Map<string, number[]>();
    for (const game of games) {
      const key = keyOf(game);
      if (key === null) continue;
      byKey.set(key, [...(byKey.get(key) || []), game.id]);
    }
    for (const [key, ids] of byKey) {
      if (ids.length === 1) continue;
      if (
        allowGrandfathered &&
        ids.length === 2 &&
        ALLOWED_DUPLICATE_PAIRS.has(pairKey(ids))
      ) {
        continue;
      }
      errors.push(`Duplicate ${label}: ${key} (ids ${ids.join(", ")})`);
    }
  };

  checkDuplicates("id", (g) => String(g.id), false);
  checkDuplicates("date", (g) => g.date, false);
  checkDuplicates("position", (g) => g.fen, true);
  checkDuplicates("lichess game", (g) => lichessGameId(g.gameUrl), true);

  for (const game of games) {
    if (!Array.isArray(game.solution) || game.solution.length !== 5) {
      errors.push(`Game ${game.id} does not have exactly 5 solution moves`);
      continue;
    }
    const chess = new Chess(game.fen);
    for (const move of game.solution) {
      if (!chess.move(move)) {
        errors.push(
          `Game ${game.id}: illegal solution move "${move}" from ${game.fen}`
        );
        break;
      }
    }
  }

  if (errors.length) {
    console.error(
      `${errors.length} problem(s) found:\n` +
        errors.map((e) => `  - ${e}`).join("\n")
    );
    process.exit(1);
  }

  console.log(
    `All ${games.length} games OK: no duplicates, ids and dates contiguous, solutions legal.`
  );
})().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
