# AGENTS.md

Guidance for coding agents working in this repository.

## What this is

Chessguessr (https://www.chessguessr.com) is a daily Wordle-style chess game: the
player sees a position from a real game (mostly Lichess) and has 5 attempts to
guess the next 5 moves. It has a real daily audience, so treat production data
in users' browsers (localStorage) and the public `/api/daily` endpoint as
contracts.

## Stack (as of late 2026 — old, an upgrade is planned)

- Remix **1.16** with v1 conventions: nested folder routes, `CatchBoundary` +
  `ErrorBoundary`, `useCatch`, object-style `meta`. React **17** (`hydrate`).
- TypeScript (`strict`), path alias `~/*` → `app/*`.
- Tailwind 3 + daisyUI 2. Themes: `corporate` (light, default) and
  `lichess-dark`, toggled by `theme-change` loaded from jsDelivr.
- `chessground` 8 for the board, `chess.js` 0.12 for move legality/SAN.
  `chess.js` is declared as `any` in `app/declarations.d.ts`; the minimal types
  used are in `app/utils/types.ts`.
- Firebase Firestore (client SDK) only for aggregate per-puzzle stats
  (`stats/{puzzleId}`: `solved`, `failed`, `turns`).
- Plausible analytics via a proxy (`chessguessr-proxy.vercel.app`).
- Hosted on Vercel (`serverBuildTarget: "vercel"`, `server.js`).

## Commands

```bash
npm run dev               # Tailwind watcher + remix dev
npm run build             # Tailwind (minified) + remix build
npm start                 # serve the production build
npm run check-duplicates  # puzzle data integrity check (also the git pre-push hook)
npm run typecheck         # tsc --noEmit
npm run lint              # eslint app + tests (0 errors; keep it that way)
npm test                  # node:test via ts-node (add new test files to the script)
```

CI (`.github/workflows/ci.yml`) runs all four on pushes to master and on PRs.
`deploy-to-vercel.yml` is a manual, broken legacy workflow; deploys go through
Vercel's Git integration.

In `npm run dev` the Tailwind watcher can lose the race with the first Remix
build ("Could not resolve ./tailwind.css"). Run `npx tailwindcss -o
./app/tailwind.css` once, then touch a file to rebuild.

`app/tailwind.css` is generated (gitignored); edit `tailwind.config.js` or the
files in `app/styles/` instead. `api/` is Remix build output and ignored, except
`api/og.ts` (a Vercel function that renders share-card images).

## Layout

- `app/root.tsx`: document shell, meta/JSON-LD, theme bootstrapping, navbar/footer,
  Plausible, and the Outlet context (modal/tutorial state, `trackEvent`).
- `app/routes/index.tsx`: today's puzzle (date chosen on the server in **UTC**).
- `app/routes/games/index.tsx`: the archive (all past puzzles).
- `app/routes/games/$slug.tsx`: one archive puzzle. Today's id redirects to `/`.
  Future ids 404, except with `?dates=all`.
- `app/routes/api/daily/index.tsx`: public JSON API, documented in README.
  External consumers may depend on its shape.
- `app/routes/sitemap[.]xml.tsx`, `robots[.]txt.tsx`, `privacy.tsx`.
- `app/hooks/useChessguessr.ts`: all game state.
- `app/utils/scoring.ts`: the scoring rule `scoreGuess()` (green = right move
  and slot, yellow = in the line but wrong slot, blue = right piece type in that
  slot, grey = wrong; castling counts as a king move), tile codes, and the share
  text. Tested in `tests/scoring.test.ts`. Any change must keep existing results
  identical.
- `app/utils/history.ts`: per-puzzle results in `cg-history` (see below).
- `app/components/Chessguessr.tsx`: page composition. The layout (board size,
  tile size, phone/landscape/desktop arrangement) is CSS in `app/styles/ui.css`,
  driven by `--board`/`--tile-*` variables, not JS. `ChessgroundBoard.tsx`
  wraps chessground, including the custom promotion picker, and fills its parent.
- `app/components/Dialog.tsx`: native `<dialog>` used by the result sheet
  (`Modal/Modal.tsx`) and the tutorial. Bottom sheet on phones.

## Puzzle data — `app/models/game.server.ts`

All puzzles (past and future) are one array returned by `getGames()`. Invariants
enforced by `tests/checkDuplicates.ts`:

- `id` equals array index + 1 (archive routes look up `games[id - 1]`).
- Dates are consecutive days with no gaps.
- No duplicate positions or Lichess games. Grandfathered pairs live in
  `ALLOWED_DUPLICATE_PAIRS`; don't add to it without the owner's say-so.
- `solution` is exactly 5 SAN moves, written the way `chess.js` generates them
  from the FEN, with `+`/`#` and disambiguation (`Nbd2`). Guesses are
  compared as exact strings.

This file uses double quotes (Prettier override). Everything else uses single
quotes, though older files are mixed. Prettier isn't enforced; keep diffs
minimal and don't reformat unrelated code. The repo is public, so future
solutions in this file are public too.

## Client state (localStorage) — backwards compatibility matters

| key | contents |
| --- | --- |
| `cg-state` | today's in-progress/finished game: `{ guesses, turn, gameStatus, date }` |
| `cg-stats` | lifetime stats: `{ gamesPlayed, currentStreak, lastPlayed, guesses: {1..5, failed} }` |
| `cg-tutorial` | `true` once the how-to-play modal has been shown |
| `cg-history` | `{ v: 1, games: { [puzzleDate]: { s: 'W'\|'L', t, g: ['ggyxb', …], a: 0\|1 } } }`, one entry per finished puzzle, first result wins |
| `theme` | `corporate` or `lichess-dark` (a legacy `light` value is migrated in `root.tsx`) |

Real players have years of streaks in these keys. Any shape change needs a read-side
migration, never a reset. Only the daily puzzle (`shouldUpdateStats`) writes
`cg-stats`/`cg-state`; archive results only go into `cg-history` (with `a: 1`).
`cg-stats` predates `cg-history` and must never be derived from it.

## Known gotchas

- `useLocalStorage` reads storage in the `useState` initializer, so the server
  render and the first client render differ. Don't render storage-dependent UI
  directly from it; open things after mount (see the tutorial in `root.tsx`).
- The daily date is computed in UTC on the server. The countdown targets midnight
  UTC but doesn't reload the puzzle when it hits zero.
- The full solution ships to the client in loader data. Fine for anonymous play,
  but anything competitive (leaderboards) must verify server-side.
- Local development writes real stats: finishing the daily puzzle on localhost
  increments the production Firestore counters. Test end states by seeding
  `cg-state` in localStorage, or play archive puzzles (which never write stats).
- `/api/og` isn't served in production (the Remix Vercel build owns every
  route), so `og:image` uses the static `/og-image.png` for now.
- Branches `auth`, `server-side-fb`, `blog`, and the other old Firebase-era
  branches are being abandoned; don't merge from them. `react-router-v7-convex`
  is an unmerged migration experiment.

The October 2026 audit (`docs/audit-2026-10.md`) lists known bugs and the
agreed direction: React Router 7, daisyUI 5 with a custom theme, puzzles moving
to a DB, and accounts after that. Check it before large changes.

## Working agreements

- Keep the game playable without an account; accounts must be additive.
- Verify UI changes at phone (≈375–430 px wide, portrait and landscape), tablet
  and desktop widths, in both themes.
- Don't commit, push, or deploy unless asked.
