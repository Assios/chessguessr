import { rowCodes } from './scoring';
import { GameStatus } from './types';
import type { FormattedGuessRow } from './types';

// Per-puzzle results, kept alongside the lifetime counters in `cg-stats`
// (which predate this and are never derived from it). Keyed by the puzzle's
// own date string, so it's independent of the player's timezone.
export type HistoryEntry = {
  s: 'W' | 'L'; // solved or failed
  t: number; // rows used
  g: string[]; // one string per row, one tile code per move (see tileCode)
  a: 0 | 1; // 1 when played from the archive
};

type StoredHistory = { v: 1; games: Record<string, HistoryEntry> };

const KEY = 'cg-history';

export const readHistory = (): Record<string, HistoryEntry> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (parsed?.v === 1 && parsed.games) return parsed.games;
  } catch {}
  return {};
};

export const historyEntry = (
  rows: FormattedGuessRow[],
  status: GameStatus,
  fromArchive: boolean
): HistoryEntry => {
  const g = rowCodes(rows);
  return { s: status === GameStatus.SOLVED ? 'W' : 'L', t: g.length, g, a: fromArchive ? 1 : 0 };
};

// The first finished result for a puzzle wins; replays never overwrite it.
export const recordResult = (date: string, entry: HistoryEntry) => {
  try {
    const games = readHistory();
    if (games[date]) return;
    const stored: StoredHistory = { v: 1, games: { ...games, [date]: entry } };
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {}
};
