/**
 * Unit tests for the fallback puzzle detection logic.
 *
 * Run with: npx ts-node tests/testBlunderDetection.ts
 *
 * These tests are fully offline — no Lichess API calls are made.
 */

import { findBlunderSequence, fenAfterMoves } from "../app/models/fallback-puzzle.server";

// ─── Mini test harness ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err: any) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

function expect<T>(actual: T, expected: T, label?: string): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(
      `${label ? label + ": " : ""}expected ${e}, got ${a}`
    );
  }
}

function assertNotNull<T>(val: T | null, label?: string): T {
  if (val === null) throw new Error(`${label ?? "value"} should not be null`);
  return val;
}

function assertNull(val: unknown, label?: string): void {
  if (val !== null) throw new Error(`${label ?? "value"} should be null, got ${JSON.stringify(val)}`);
}

// ─── Test data helpers ────────────────────────────────────────────────────────

/** Build a flat eval array with a blunder at position `blunderAt`.
 *  Before the blunder: eval = +100 (slight white advantage).
 *  After: eval = -600 (black winning) for 5 moves.
 *  Optionally includes a capture in the solution moves.
 */
function makeEvals(blunderAt: number, total: number, withCapture = true): { eval: number }[] {
  return Array.from({ length: total }, (_, i) => {
    if (i < blunderAt + 1) return { eval: 100 };
    return { eval: -600 };
  });
}

/** Build a flat move array of length n, optionally inserting 'Bxe5' at index captureAt. */
function makeMoves(n: number, captureAt?: number): string[] {
  return Array.from({ length: n }, (_, i) => (captureAt !== undefined && i === captureAt ? "Bxe5" : "e4"));
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log("\nfindBlunderSequence:");

test("returns null when analysis is too short", () => {
  const result = findBlunderSequence(makeEvals(20, 25), makeMoves(25, 22));
  assertNull(result);
});

test("detects a valid white-blunder sequence", () => {
  // Blunder at move 22 (well inside the window), capture at solutionStart + 1
  const evals = makeEvals(22, 40);
  const moves = makeMoves(40, 24); // capture at index 24 = solutionStart(23)+1
  const result = assertNotNull(findBlunderSequence(evals, moves), "result");
  expect(result.solutionStartIndex, 23);
  expect(result.solutionMoves.some((m) => m.includes("x")), true, "has capture");
  expect(result.preBlunderEval, 100);
  expect(result.postBlunderEval, -600);
});

test("requires a capture in solution moves — returns null when absent", () => {
  const evals = makeEvals(22, 40);
  const moves = makeMoves(40); // no captures anywhere
  const result = findBlunderSequence(evals, moves);
  assertNull(result, "should be null without capture");
});

test("requires eval to actually cross the flip threshold", () => {
  // Eval drops 350cp but never crosses -400 — should not qualify
  const evals = Array.from({ length: 40 }, (_, i) => ({ eval: i < 23 ? 100 : -250 }));
  const moves = makeMoves(40, 24);
  const result = findBlunderSequence(evals, moves);
  assertNull(result, "swing below threshold should not qualify");
});

test("requires stability across 5 solution evals", () => {
  // Eval oscillates wildly after the blunder — instability exceeds STABLE_THRESHOLD
  const evals = Array.from({ length: 40 }, (_, i) => {
    if (i <= 22) return { eval: 100 };
    // Alternates between -400 and -800 → range = 400 > STABLE_THRESHOLD(300)
    return { eval: i % 2 === 0 ? -400 : -800 };
  });
  const moves = makeMoves(40, 24);
  const result = findBlunderSequence(evals, moves);
  assertNull(result, "unstable sequence should not qualify");
});

test("skips blunders in the opening (before half-move 20)", () => {
  // Blunder ONLY at half-move 10 — with MIN_HALF_MOVES=20, this should be skipped
  // and return null (no qualifying blunder within the valid window)
  const evals = makeEvals(10, 40); // all 100 before index 11, then -600 after
  const moves = makeMoves(40, 12);
  const result = findBlunderSequence(evals, moves);
  // The swing from 100→-600 only happens at index 10; i starts at 20 where
  // both before and after are -600 (swing = 0), so no blunder is found
  assertNull(result, "early blunder should be skipped by MIN_HALF_MOVES guard");
});

test("returns null when no solution moves available (game too short)", () => {
  const evals = makeEvals(22, 26); // only 3 moves after blunder
  const moves = makeMoves(26, 24);
  assertNull(findBlunderSequence(evals, moves));
});

test("handles mate evaluations (maps to ±10000)", () => {
  // Sequence with a mate eval after the blunder
  const evals = Array.from({ length: 40 }, (_, i) => {
    if (i <= 22) return { eval: 100 };
    return i === 23 ? { mate: -3 } : { eval: -600 }; // mate for black at index 23
  });
  const moves = makeMoves(40, 24);
  const result = findBlunderSequence(evals, moves);
  // mate -3 → -10000, well below -400, and range between -10000 and -600 = 9400 > STABLE_THRESHOLD
  // So stability check should fail here
  assertNull(result, "mate eval causes instability — should not qualify");
});

// ─── fenAfterMoves tests ──────────────────────────────────────────────────────

console.log("\nfenAfterMoves:");

test("returns starting FEN for empty move list", () => {
  const fen = assertNotNull(fenAfterMoves([]), "fen");
  // Starting position
  expect(fen.startsWith("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), true, "starting pos");
});

test("returns correct FEN after 1.e4", () => {
  const fen = assertNotNull(fenAfterMoves(["e4"]), "fen");
  expect(fen.includes("rnbqkbnr/pppppppp/8/8/4P3"), true, "e4 pawn moved");
});

test("returns correct FEN after e4 e5", () => {
  const fen = assertNotNull(fenAfterMoves(["e4", "e5"]), "fen");
  expect(fen.includes("4p3"), true, "black e5 pawn");
  expect(fen.includes("4P3"), true, "white e4 pawn");
});

test("returns null for invalid move sequence", () => {
  const fen = fenAfterMoves(["e4", "e9"]); // e9 is not a valid square
  assertNull(fen, "invalid move should return null");
});

test("handles a longer Sicilian sequence", () => {
  const fen = assertNotNull(fenAfterMoves(["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4"]), "fen");
  // Just verify it parses and returns a non-empty FEN
  expect(fen.includes("/"), true, "looks like a FEN");
  expect(fen.length > 20, true, "FEN has content");
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
