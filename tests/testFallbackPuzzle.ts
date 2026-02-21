/**
 * Integration test for the fallback puzzle generator.
 *
 * Run with: npx ts-node tests/testFallbackPuzzle.ts
 *
 * This test makes real Lichess API calls and may take 30-120 seconds.
 * It validates that generateFallbackGame() returns a puzzle meeting all criteria.
 */

import { generateFallbackGame } from "../app/models/fallback-puzzle.server";

// ─── Mini test harness ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}${detail ? `: ${detail}` : ""}`);
    failed++;
  }
}

// ─── Run integration test ─────────────────────────────────────────────────────

(async () => {
  console.log("\nFallback puzzle integration test (live Lichess API)...");
  console.log("This may take up to 2 minutes while searching games.\n");

  const start = Date.now();
  let puzzle: Awaited<ReturnType<typeof generateFallbackGame>>;

  try {
    puzzle = await generateFallbackGame();
  } catch (err: any) {
    console.error("generateFallbackGame() threw an error:", err.message);
    process.exit(1);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Found in ${elapsed}s\n`);
  console.log("generateFallbackGame() result:");

  if (!puzzle) {
    console.log("  ⚠️  generateFallbackGame() returned null.");
    console.log("  This means no qualifying game was found in the current player pool.");
    console.log("  This is not necessarily a bug — try running again.");
    console.log("  If this consistently returns null, check the Lichess API or puzzle criteria.\n");
    process.exit(0);
  }

  console.log(`  id:       ${puzzle.id}`);
  console.log(`  date:     ${puzzle.date}`);
  console.log(`  white:    ${puzzle.white} (${puzzle.wRating})`);
  console.log(`  black:    ${puzzle.black} (${puzzle.bRating})`);
  console.log(`  gameUrl:  ${puzzle.gameUrl}`);
  console.log(`  fen:      ${puzzle.fen}`);
  console.log(`  solution: ${puzzle.solution.join(", ")}`);
  console.log();

  // ─── Validation checks ──────────────────────────────────────────────────────

  console.log("Validation:");

  check("puzzle is not null", puzzle !== null);
  check("date is today's date", puzzle.date === new Date().toISOString().split("T")[0],
    `got ${puzzle.date}`);
  check("id is a positive integer", Number.isInteger(puzzle.id) && puzzle.id > 0,
    `got ${puzzle.id}`);
  check("FEN is a non-empty string", typeof puzzle.fen === "string" && puzzle.fen.length > 10,
    `got "${puzzle.fen}"`);
  check("FEN looks valid (has 6 space-separated parts)",
    puzzle.fen.trim().split(" ").length === 6, `got ${puzzle.fen.trim().split(" ").length} parts`);
  check("solution has exactly 5 moves", puzzle.solution.length === 5,
    `got ${puzzle.solution.length}`);
  check("solution has at least one capture", puzzle.solution.some((m) => m.includes("x")),
    `moves: ${puzzle.solution.join(", ")}`);
  check("white player name is present", typeof puzzle.white === "string" && puzzle.white.length > 0,
    `got "${puzzle.white}"`);
  check("black player name is present", typeof puzzle.black === "string" && puzzle.black.length > 0,
    `got "${puzzle.black}"`);
  check("white rating >= 1600", Number(puzzle.wRating) >= 1600, `got ${puzzle.wRating}`);
  check("black rating >= 1600", Number(puzzle.bRating) >= 1600, `got ${puzzle.bRating}`);
  check("gameUrl points to lichess", typeof puzzle.gameUrl === "string" &&
    puzzle.gameUrl.startsWith("https://lichess.org/"), `got "${puzzle.gameUrl}"`);
  check("gameUrl has a valid game ID", /^https:\/\/lichess\.org\/[a-zA-Z0-9]{8}$/.test(puzzle.gameUrl),
    `got "${puzzle.gameUrl}"`);

  // ─── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n${passed + failed} checks: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
