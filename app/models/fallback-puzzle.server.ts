/**
 * Fallback puzzle generator for ChessGuessr.
 *
 * When no manually curated puzzle exists for today's date, this module
 * fetches a game from Lichess that meets the following criteria:
 *   1. Both players rated 1600+
 *   2. One player blunders, causing the eval score to flip by at least +/- 4 pawns (400cp)
 *   3. The next 5 moves maintain that flipped advantage consistently
 *   4. At least one of those 5 moves is a capture
 *
 * To avoid repeating games, used Lichess game IDs are persisted in
 * `app/data/used-game-ids.json`.
 */

import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
import * as fs from "fs";
import * as path from "path";
import { GameType } from "~/utils/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const BLUNDER_THRESHOLD = 400; // centipawns — eval swing required to qualify as a blunder
const FLIP_THRESHOLD = 400;    // centipawns — advantage required after the blunder
const STABLE_THRESHOLD = 300;  // centipawns — max variance across the 5 solution evals
const MIN_ELO = 1600;
const PUZZLE_MOVES = 5;
const MIN_HALF_MOVES = 20;     // skip opening (first 10 full moves)
const MAX_FROM_END = 10;       // don't start a puzzle in the final 10 half-moves
const GAMES_PER_USER = 20;     // games to fetch per player
const LICHESS_API = "https://lichess.org";

const USED_IDS_PATH = path.join(process.cwd(), "app", "data", "used-game-ids.json");

// ─── Used-game tracking ───────────────────────────────────────────────────────

function loadUsedIds(): Set<string> {
  try {
    if (fs.existsSync(USED_IDS_PATH)) {
      const raw = fs.readFileSync(USED_IDS_PATH, "utf-8");
      const ids: string[] = JSON.parse(raw);
      return new Set(ids);
    }
  } catch {
    // If the file is corrupt or missing, start fresh
  }
  return new Set();
}

function saveUsedId(gameId: string): void {
  try {
    const dir = path.dirname(USED_IDS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing = loadUsedIds();
    existing.add(gameId);
    fs.writeFileSync(USED_IDS_PATH, JSON.stringify([...existing], null, 2));
  } catch (err) {
    console.error("[fallback] Failed to save used game ID:", err);
  }
}

// ─── Lichess API helpers ──────────────────────────────────────────────────────

interface LichessEval {
  eval?: number;  // centipawns from white's perspective
  mate?: number;  // mate in N (positive = white mates, negative = black mates)
}

interface LichessGame {
  id: string;
  moves?: string;
  players?: {
    white?: { user?: { name?: string; title?: string }; rating?: number };
    black?: { user?: { name?: string; title?: string }; rating?: number };
  };
  analysis?: LichessEval[];
  event?: string;
  variant?: string;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "chessguessr-fallback/1.0",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchNdjson(url: string): Promise<LichessGame[]> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/x-ndjson",
      "User-Agent": "chessguessr-fallback/1.0",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  return text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => {
      try { return JSON.parse(l) as LichessGame; } catch { return null; }
    })
    .filter((g): g is LichessGame => g !== null);
}

/** Sample N items randomly from an array. */
function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/** Fetch a diverse pool of active Lichess players from multiple rating tiers. */
async function fetchDiversePlayers(perf: string): Promise<string[]> {
  const perfs = perf === "blitz" ? ["blitz", "rapid", "classical"] : [perf, "blitz"];
  const all: string[] = [];

  for (const p of perfs) {
    try {
      const data = await fetchJson(`${LICHESS_API}/api/player/top/50/${p}`) as { users?: { id: string }[] };
      const users = data.users ?? [];
      const ids = users.map((u) => u.id);
      // Sample from three tiers of the top 50
      if (ids.length >= 10)  all.push(...sample(ids.slice(0, 10), 3));
      if (ids.length >= 25)  all.push(...sample(ids.slice(10, 25), 3));
      if (ids.length >= 50)  all.push(...sample(ids.slice(25, 50), 3));
      await new Promise((r) => setTimeout(r, 300));
    } catch {
      // Skip this perf type if unavailable
    }
  }

  // Deduplicate and shuffle
  const seen = new Set<string>();
  const unique = all.filter((id) => { if (seen.has(id)) return false; seen.add(id); return true; });
  return sample(unique, unique.length); // full shuffle
}

/** Fetch recent games for a user, including Stockfish evals. */
async function fetchGamesForUser(username: string, perf: string): Promise<LichessGame[]> {
  const params = new URLSearchParams({
    max: String(GAMES_PER_USER),
    rated: "true",
    perfType: perf,
    evals: "true",
    clocks: "false",
    opening: "false",
  });
  return fetchNdjson(`${LICHESS_API}/api/games/user/${username}?${params}`);
}

// ─── Eval helpers ─────────────────────────────────────────────────────────────

function evalToCp(e: LichessEval | undefined): number | null {
  if (!e) return null;
  if ("mate" in e && e.mate !== undefined) return e.mate > 0 ? 10000 : -10000;
  if ("eval" in e && e.eval !== undefined) return e.eval;
  return null;
}

// ─── Puzzle detection ─────────────────────────────────────────────────────────

interface BlunderResult {
  solutionStartIndex: number;  // half-move index where solver plays from
  solutionMoves: string[];
  preBlunderEval: number;
  postBlunderEval: number;
}

function findBlunderSequence(
  analysis: LichessEval[],
  moves: string[]
): BlunderResult | null {
  const maxStart = analysis.length - PUZZLE_MOVES - MAX_FROM_END - 1;

  for (let i = MIN_HALF_MOVES; i < maxStart; i++) {
    const before = evalToCp(analysis[i]);
    const after = evalToCp(analysis[i + 1]);
    if (before === null || after === null) continue;

    const swing = after - before;

    // Require an actual side-flip of at least BLUNDER_THRESHOLD centipawns
    const isWhiteBlunder =
      swing <= -BLUNDER_THRESHOLD &&
      before >= -FLIP_THRESHOLD &&  // was even or white winning
      after <= -FLIP_THRESHOLD;     // now black winning

    const isBlackBlunder =
      swing >= BLUNDER_THRESHOLD &&
      before <= FLIP_THRESHOLD &&   // was even or black winning
      after >= FLIP_THRESHOLD;      // now white winning

    if (!isWhiteBlunder && !isBlackBlunder) continue;

    // Check that all 5 post-blunder evals maintain the new advantage
    if (i + 1 + PUZZLE_MOVES >= analysis.length) continue;

    const postEvals: number[] = [];
    let valid = true;
    for (let j = 0; j < PUZZLE_MOVES; j++) {
      const e = evalToCp(analysis[i + 1 + j]);
      if (e === null) { valid = false; break; }
      postEvals.push(e);
    }
    if (!valid) continue;

    if (isWhiteBlunder && !postEvals.every((e) => e <= -FLIP_THRESHOLD)) continue;
    if (isBlackBlunder && !postEvals.every((e) => e >= FLIP_THRESHOLD)) continue;

    // Stability check
    if (Math.max(...postEvals) - Math.min(...postEvals) > STABLE_THRESHOLD) continue;

    // Extract solution moves
    const solutionStart = i + 1;
    if (solutionStart + PUZZLE_MOVES > moves.length) continue;
    const solutionMoves = moves.slice(solutionStart, solutionStart + PUZZLE_MOVES);

    // Require at least one capture in the solution
    if (!solutionMoves.some((m) => m.includes("x"))) continue;

    return { solutionStartIndex: solutionStart, solutionMoves, preBlunderEval: before, postBlunderEval: after };
  }

  return null;
}

/** Compute the FEN after replaying a sequence of UCI/SAN moves from the starting position. */
function fenAfterMoves(moves: string[]): string | null {
  const chess = new Chess();
  for (const move of moves) {
    const result = chess.move(move, { sloppy: true });
    if (!result) return null;
  }
  return chess.fen();
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generate a fallback puzzle for today by searching Lichess games.
 * Returns null if no suitable game can be found.
 */
export async function generateFallbackGame(): Promise<GameType | null> {
  const today = new Date().toISOString().split("T")[0];
  const usedIds = loadUsedIds();
  const perf = "blitz";

  console.log("[fallback] No curated puzzle for", today, "— searching Lichess...");

  const players = await fetchDiversePlayers(perf);
  console.log(`[fallback] Searching ${players.length} players`);

  for (const username of players) {
    let games: LichessGame[];
    try {
      games = await fetchGamesForUser(username, perf);
      await new Promise((r) => setTimeout(r, 400)); // rate limiting
    } catch (err) {
      console.warn(`[fallback] Failed to fetch games for ${username}:`, err);
      continue;
    }

    // Shuffle to avoid always picking the most recent game
    games = sample(games, games.length);

    for (const game of games) {
      const gameId = game.id;
      if (!gameId || usedIds.has(gameId)) continue;

      const analysis = game.analysis ?? [];
      const movesStr = game.moves ?? "";
      const moves = movesStr.trim().split(/\s+/).filter(Boolean);

      const white = game.players?.white;
      const black = game.players?.black;
      const wRating = white?.rating ?? 0;
      const bRating = black?.rating ?? 0;

      if (wRating < MIN_ELO || bRating < MIN_ELO) continue;
      if (!analysis.length) continue;

      const result = findBlunderSequence(analysis, moves);
      if (!result) continue;

      // Compute FEN at the puzzle start position
      const fenMoves = moves.slice(0, result.solutionStartIndex);
      const fen = fenAfterMoves(fenMoves);
      if (!fen) {
        console.warn(`[fallback] Could not compute FEN for game ${gameId}`);
        continue;
      }

      // Mark this game as used so it's never repeated
      saveUsedId(gameId);

      console.log(`[fallback] Found puzzle in game ${gameId} (${username})`);

      return {
        id: Date.now(), // synthetic ID — won't collide with curated puzzles
        date: today,
        fen,
        solution: result.solutionMoves,
        gameUrl: `https://lichess.org/${gameId}`,
        white: white?.user?.name ?? "",
        black: black?.user?.name ?? "",
        wRating,
        bRating,
        wTitle: white?.user?.title,
        bTitle: black?.user?.title,
        event: game.event,
        variant: game.variant === "standard" ? undefined : game.variant,
      };
    }
  }

  console.error("[fallback] No suitable puzzle found after searching all players");
  return null;
}
