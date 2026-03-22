import type { GameType, PuzzleStats } from './types';

/**
 * Convert a Convex puzzle document to the GameType shape used throughout the app.
 */
export function toGameType(puzzle: any): GameType {
  return {
    id: puzzle.puzzleId,
    date: puzzle.date,
    fen: puzzle.fen,
    solution: puzzle.solution,
    gameUrl: puzzle.gameUrl,
    white: puzzle.white,
    black: puzzle.black,
    wAka: puzzle.wAka,
    bAka: puzzle.bAka,
    wTitle: puzzle.wTitle,
    bTitle: puzzle.bTitle,
    wRating: puzzle.wRating,
    bRating: puzzle.bRating,
    event: puzzle.event,
    eventUrl: puzzle.eventUrl,
    variant: puzzle.variant,
  };
}

/**
 * Extract PuzzleStats from a Convex puzzle document.
 */
export function toPuzzleStats(puzzle: any): PuzzleStats {
  return {
    solved: puzzle.solved || 0,
    failed: puzzle.failed || 0,
    turns: puzzle.totalTurns || 0,
  };
}
