# Chessguessr: Feature & Growth Ideas

**Date:** March 2026
**Current state:** ~700 daily unique users, 929 archived puzzles, zero-friction daily puzzle game
**Goal:** Identify high-impact website features and growth strategies, ranked by effectiveness

---

## Table of Contents

1. [Current Feature Inventory](#current-feature-inventory)
2. [Feature Ideas — Detailed Analysis](#feature-ideas)
   - [A. Core Game Experience](#a-core-game-experience)
   - [B. Stats, Streaks & Progression](#b-stats-streaks--progression)
   - [C. New Game Modes](#c-new-game-modes)
   - [D. Social & Multiplayer](#d-social--multiplayer)
   - [E. Archive & Content](#e-archive--content)
   - [F. UX & Platform](#f-ux--platform)
3. [Growth & Distribution Ideas](#growth--distribution-ideas)
4. [Master Rankings](#master-rankings)
5. [Recommended Roadmap](#recommended-roadmap)

---

## Current Feature Inventory

Before proposing new features, here's exactly what exists today:

### What's Implemented
- **Daily puzzle**: One new game per day at midnight UTC, from real Lichess games
- **5-move guessing**: Drag pieces on an interactive Chessground board
- **4-color feedback system**: Green (exact), Yellow (right move, wrong position), Blue (right piece type), Grey (wrong)
- **5 attempts**: Fail after 5 wrong guesses
- **Stats modal**: Games played, win %, current streak, guess distribution chart
- **Emoji sharing**: Copy emoji grid to clipboard (`Chessguessr #930 3/5 + emoji grid + URL`)
- **Archive**: All 929 past puzzles browsable in a card grid at `/games`
- **Tutorial**: First-visit modal explaining the mechanics
- **Theme toggle**: Light (corporate) and dark (lichess-dark)
- **Keyboard shortcuts**: Backspace/Left for undo, Right for redo, Enter/Space for submit
- **Responsive design**: 3 breakpoints (mobile 310px, tablet 370px, desktop 560px board)
- **Firebase stats**: Tracks aggregate solve rate and average turns per puzzle
- **Plausible analytics**: Page views and events
- **API endpoint**: `/api/daily` returns today's puzzle as JSON
- **Countdown timer**: Shows time until next puzzle
- **Buy Me a Coffee**: Donation widget

### What's Missing (Feature Gaps)
- No user accounts or server-side persistent stats
- No leaderboards of any kind
- No multiplayer or challenge mode
- No difficulty indicators on puzzles
- No hints system
- No post-solve game analysis or continuation
- No alternative game modes
- No achievements (component exists but unused)
- No direct social media share buttons (clipboard only)
- No streak/difficulty in share text
- No archive search, filter, or pagination
- No PWA / push notifications
- No personal rating or progression system
- No time tracking
- No sound effects

---

## Feature Ideas

### A. Core Game Experience

These improve the fundamental daily puzzle experience that every user touches.

---

#### A1. Enhanced Share Text
**Effort:** Very Low (few hours) | **Impact:** High | **Effectiveness: 9/10**

The share mechanic is chessguessr's single most important growth engine. Wordle's emoji grid drove it from 90 to 10M daily users, with 1.2 million Twitter shares in 13 days. The current share text is functional but leaves growth on the table.

**Current format:**
```
Chessguessr #930 3/5

🟩🟨🟦⬜🟩
🟨🟩🟩🟦🟩
🟩🟩🟩🟩🟩

https://chessguessr.com
```

**Proposed improvements:**
- Add current streak: `Chessguessr #930 3/5 🔥12` — seeing someone's 30-day streak creates FOMO
- Add community solve rate: `(34% solved today)` — makes good scores feel brag-worthy
- Add difficulty indicator: a star rating or emoji for today's difficulty
- Track shares as a Plausible event to measure viral coefficient

**Implementation:** Modify `getShareGameText()` in `Modal.tsx` (~20 lines of code). Streak is already in `playerStats.currentStreak`. Solve rate comes from Firebase `puzzleStats`.

**Why this ranks #1 for features:** It's the lowest-effort, highest-impact change possible. Every share is a free ad. Making shares more compelling directly increases the viral coefficient.

---

#### A2. Post-Solve Game Story & Continuation
**Effort:** Low-Medium (1 week) | **Impact:** High | **Effectiveness: 8.5/10**

After solving (or failing), the modal shows the solution and basic stats, then... nothing. The player's engagement with today's puzzle is over. This is a missed opportunity for deeper engagement and education.

**What to add:**
- **"What happened next"**: Show the rest of the game after the 5 moves — did the attack succeed? Was there a checkmate? A resignation? Auto-replay the continuation on the board.
- **Game narrative**: "This was a critical moment in the 2024 Candidates Tournament. Gukesh found Rd6!, a move that engines evaluate at +5.3, winning a decisive advantage."
- **Engine evaluation bar**: Show the eval of the starting position and how it changed with the correct moves. Stockfish evaluations add credibility and educational value.
- **"Why this move?"** annotations: For each solution move, a brief explanation of why it's strong (e.g., "Rxg6+ opens the g-file and exposes the king").
- **"ChessguessrBot" scoring**: Like NYT's WordleBot which grades each Wordle guess 0-99 for Skill and Luck — grade each move guess on how much it narrows the solution space. "Your first guess scored 82/99 for Skill." This transforms a 2-minute game into a 5-10 minute analysis session.

**Why it matters:**
- Transforms a 2-minute guessing game into a 5-10 minute learning experience
- Gives users a reason to linger after solving, increasing session duration
- Creates discussion fodder for Discord/Reddit ("Did you see the continuation after today's puzzle?")
- Chess.com's daily puzzle shows full analysis after solving — it's expected in the space

**Implementation:** The game data already has `gameUrl` linking to the Lichess game. You could fetch the full PGN from the Lichess API at solve time, or pre-compute game continuations and store them in the game data.

---

#### A3. Hint System (Optional Clues)
**Effort:** Medium (1-2 weeks) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

Some puzzles are brutally hard. When a player is stuck, they have two options: guess randomly or give up. A hint system provides a middle ground that preserves satisfaction while reducing frustration.

**Tiered hint system:**
- **Hint 1 (free):** "The first move involves a rook" — piece type only
- **Hint 2 (costs 1 guess):** "The first move is on the d-file" — narrows to a region
- **Hint 3 (costs 2 guesses):** Reveals the first move entirely

**Design principles:**
- Hints are opt-in — players who don't want them never see them
- Using hints affects scoring (mark in share text: "Chessguessr #930 3/5 💡" = hints used)
- Hints reduce frustration for beginners without diminishing the experience for experts
- The hint button should be subtle, not prominent

**Why it matters:**
- 70% of puzzle games offer some form of progressive hint system
- Reduces the "I have no idea, I'll just random-guess" experience that causes churn
- New players are most likely to churn on hard puzzles — hints keep them engaged long enough to build the habit

---

#### A4. Sound Effects & Haptic Feedback
**Effort:** Low (2-3 days) | **Impact:** Medium | **Effectiveness: 6.5/10**

Sound reinforces the emotional response to guessing correctly or incorrectly. Lichess and Chess.com both have satisfying piece-drop sounds that make the experience feel tactile.

**Sounds to add:**
- Piece movement: subtle wood-on-wood click (from Lichess sound pack, MIT licensed)
- Correct move (green): satisfying chime
- Wrong move (grey): soft thud
- Puzzle solved: celebration sound
- Puzzle failed: gentle "game over" tone
- Streak milestone: special fanfare

**Implementation:** Import Lichess sound files (open source). Add audio elements triggered on move submission/validation. Add a mute toggle in settings. Use `Howler.js` or native Audio API.

---

#### A5. Hard Mode
**Effort:** Low (3-5 days) | **Impact:** Medium | **Effectiveness: 6.5/10**

Like Wordle's Hard Mode: once you get a green or yellow tile, you must use that information in future guesses. Forces logical deduction instead of random guessing.

**Rules:**
- Green moves must be repeated in the same position in future guesses
- Yellow moves must be included somewhere in future guesses
- Blue clues must use the same piece type in that position

**Implementation:** Add validation in `submitGuess()` that checks current guess against previous feedback. Store hard mode preference in localStorage. Mark hard mode in share text: `Chessguessr #930 3/5*` (asterisk = hard mode).

**Why it matters:** Creates a prestige mechanic — hard mode solves are more impressive and more shareable. Wordle's hard mode created an entire meta-conversation on Twitter about difficulty.

---

### B. Stats, Streaks & Progression

These turn a daily puzzle into a long-term engagement loop. Duolingo's data shows streaks alone make users 3.6x more likely to stay engaged.

---

#### B1. Streak Overhaul
**Effort:** Medium (1-2 weeks) | **Impact:** Very High | **Effectiveness: 9.5/10**

The current streak system is bare-minimum: a number in the stats modal, no visual emphasis, no recovery mechanics, and it resets to 0 on any failure. Duolingo spent years optimizing streaks because they're the single most powerful retention mechanic:

- Users with 7+ day streaks: **3.6x more likely** to stay engaged long-term
- 55% of Duolingo users return specifically to maintain their streak
- Streak Freeze reduced churn by **21%** for at-risk users
- Active streak maintainers have **40% higher Day 30 retention**

**Features to add:**

1. **Prominent streak display**: Show the streak counter on the main page, not buried in the stats modal. A flame icon with the number, visible before/during/after play.

2. **Streak milestones with celebration**: Visual celebrations at 7, 30, 100, 365 days. Confetti animation, special badge unlocked. These create shareable moments ("I just hit 100 days on Chessguessr!").

3. **Streak freeze**: After maintaining a 7-day streak, earn one "Streak Freeze" that automatically protects your streak for one missed day. This is Duolingo's highest-impact anti-churn feature.

4. **Streak recovery**: If you miss a day and lose your streak, offer a 24-hour window to recover by solving 2 archive puzzles. This prevents the devastating "I lost my 50-day streak, why bother" moment that causes permanent churn.

5. **Max streak tracking**: Track and display the player's longest-ever streak alongside current streak. "Your best: 47 days. Current: 12 days." This creates a personal record to beat.

6. **Streak sharing**: "I'm on a 🔥47-day Chessguessr streak!" — one-click share button specifically for streaks, separate from the daily result share.

**Implementation:** Extend the `cg-stats` localStorage object to include `maxStreak`, `streakFreezes`, `lastStreakFreezeEarned`. Modify the streak logic in `useChessguessr.ts` `addGuess()`. Add a streak display component to the main page.

---

#### B2. Enhanced Stats Dashboard
**Effort:** Medium (1-2 weeks) | **Impact:** High | **Effectiveness: 8/10**

The current stats modal shows 3 numbers (games played, win %, current streak) and a guess distribution bar chart. Compared to what's possible, this is minimal.

**Stats to add:**
- **Max streak**: Longest-ever streak (creates a personal record to chase)
- **Average guesses**: Mean guesses per solved puzzle (precision metric)
- **Total puzzles solved**: Lifetime count (progress indicator)
- **Solve rate over time**: Sparkline or mini-chart showing improvement
- **Time played** (if timer added): Average solve time
- **Recent history**: Last 7 days shown as a row of icons (green check / red X / grey dash for missed)
- **Percentile rank**: "You solve puzzles faster than 72% of players" (requires Firebase data)

**Visual improvements:**
- Make the stats modal more visually rich — larger numbers, icons, progress indicators
- Add a "Personal Best" section highlighting the player's achievements
- Show "You vs Community" comparison for today's puzzle

**Why it matters:** Every stat is a hook. "I'm at 89% solve rate" becomes a goal to maintain. "My average is 2.8 guesses" becomes a number to improve. Stats make progress tangible and give players language to compare themselves.

---

#### B3. Achievement / Badge System
**Effort:** Medium (2 weeks) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

An `AchievementBadge.tsx` component already exists in the codebase (referencing an `Achievement` type with `id`, `title`, `description`, `iconUrl`, `achieved`), but it's not connected to anything. This is a half-built feature ready to be activated.

**Achievement ideas (organized by category):**

*Streaks:*
- "Getting Started" — 3-day streak
- "On Fire" — 7-day streak
- "Dedicated" — 30-day streak
- "Obsessed" — 100-day streak
- "Legendary" — 365-day streak

*Skill:*
- "First Try" — Solve a puzzle in 1 guess
- "Sharpshooter" — Solve 3 puzzles in a row on the first guess
- "All Green" — Get all 5 moves correct in a single guess
- "Perfect Week" — Solve all 7 daily puzzles in one week
- "Unbreakable" — Win 20 daily puzzles in a row

*Exploration:*
- "Archivist" — Solve 50 archive puzzles
- "Completionist" — Solve 100 archive puzzles
- "Time Traveler" — Solve puzzles from 3 different years
- "World Tour" — Solve puzzles featuring 10 different tournaments

*Special:*
- "Against the Odds" — Solve a puzzle that <20% of players solved
- "Grandmaster Puzzle" — Solve a puzzle from a Super-GM game (2700+ rating)
- "Endgame Specialist" — Solve 10 endgame puzzles

**Implementation:** Define achievements in a config array. Check conditions in `addGuess()` and when loading stats. Store unlocked achievements in localStorage. Display in a grid accessible from the navbar or stats modal. Use the existing `AchievementBadge.tsx` component.

**Why it matters:** Apps combining streaks AND milestones see 40-60% higher DAU vs. single-feature implementations. Achievements provide "collection" goals that drive long-term engagement beyond the daily puzzle.

---

#### B4. Personal Chessguessr Rating
**Effort:** Medium-High (2-3 weeks) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

Give each player a "Chessguessr Rating" that goes up when they solve puzzles and down when they fail, weighted by puzzle difficulty. Like an Elo rating for guessing chess moves.

**How it works:**
- Start at 1200 (like standard chess)
- Each puzzle has a hidden difficulty rating based on: original game player ratings, historical solve rate, engine evaluation complexity
- Solving an easy puzzle in many guesses: small gain
- Solving a hard puzzle in few guesses: large gain
- Failing an easy puzzle: larger loss
- Failing a hard puzzle: smaller loss
- Rating changes shown after each game: "+32" or "-15"

**Why it matters:**
- Creates a permanent progression system beyond streaks
- "My Chessguessr rating is 1850" becomes a source of identity and pride
- Rating creates natural difficulty calibration — you can tell players "today's puzzle is rated 1600" and they know if it's in their range
- Shareable: "Chessguessr #930 3/5 | Rating: 1847 (+28)"

**Implementation:** Compute puzzle difficulty from existing Firebase data (solve rate, average turns) and game metadata (player Elo). Store rating in localStorage (or server-side with accounts). Use a simplified Elo formula.

---

#### B5. Weekly / Monthly / Year-End Recap
**Effort:** Low-Medium (1 week for weekly, 2 weeks for annual) | **Impact:** Medium | **Effectiveness: 6.5/10**

At the end of each week (or month), show a summary screen:
- "You solved 6/7 puzzles this week"
- "Your hardest solve: Puzzle #927 (only 12% solved it)"
- "Your best guess: 1/5 on Puzzle #925"
- "Your streak: 23 days and counting"
- Shareable as an image or text

**Annual "Year in Chessguessr" (like Spotify Wrapped / Duolingo Year in Review):**
- Total puzzles solved, longest streak, best single guess
- Your "chess personality" based on behavior ("The Tactician" for fast solvers, "The Grinder" for high streaks)
- Comparison to community averages
- Social sharing cards optimized for Twitter/Instagram
- Duolingo's Year in Review drove a "significant spike" in new users when shared virally; #Duolingo365 trends on Twitter annually. Chess.com had a "Year in Chess" feature that was so popular its removal in 2024 caused community outcry.

**Why it matters:** Creates sharing moments beyond the daily puzzle. Spotify Wrapped proved that personal stats recaps are massively shareable — people love seeing their own data.

---

### C. New Game Modes

Each new mode expands the audience, increases daily engagement, and creates more content to share.

---

#### C1. "Guess the Elo" Mode
**Effort:** Medium (2-3 weeks) | **Impact:** High | **Effectiveness: 8.5/10**

A second daily game where players watch a game replay and guess the Elo rating of the players.

**Why this specific mode:**
- "Guess the Elo" is one of the most popular chess content formats. GothamChess's series gets millions of views per video.
- GuessTheElo.com and EloGuessr.com exist as standalone sites but are unpolished.
- The data already exists: every game in `game.server.ts` has player ratings.
- It's inherently shareable: "I guessed within 50 points! 🎯"
- It appeals to a different audience than the move-guessing game — people who watch chess but don't play at a high level.

**How it works:**
- Show a full game replay (auto-play or step-through)
- Player names and ratings are hidden
- Player enters their Elo guess
- Scoring: within 50 = perfect, within 100 = great, within 200 = good, within 400 = ok
- Reveal actual players, ratings, and game context
- Daily version (one game) + unlimited mode from archive

**Share format:**
```
Chessguessr Elo #42
🎯 Guessed: 2150 | Actual: 2200
Accuracy: 50 points off!

https://chessguessr.com/elo
```

---

#### C2. Puzzle Rush / Blitz Mode
**Effort:** High (3-4 weeks) | **Impact:** High | **Effectiveness: 8/10**

A timed mode: solve as many puzzles as possible in 3 or 5 minutes. Inspired by Chess.com's Puzzle Rush, which is one of their most popular and addictive features.

**How it works:**
- Timer starts at 3:00 or 5:00
- Puzzles appear one after another from the archive
- Simplified scoring: 1 point per solve, bonus for fewer guesses
- 3 strikes (failed puzzles) and you're out
- Leaderboard: daily and all-time high scores
- Shareable: "Blitz Chessguessr: 14 puzzles in 5 minutes! 🏃"

**Why it matters:**
- Creates unlimited replayability (the daily puzzle is a one-shot experience)
- High scores are inherently competitive and shareable
- Fills the "I've done today's puzzle, now what?" gap
- Speed-solving content is highly watchable for streamers

**Implementation:** Reuse the existing `Chessguessr` component with a timer wrapper. Pull random archive puzzles. Store high scores in localStorage (or Firebase for global leaderboards).

---

#### C3. "What Would You Play?" Community Mode
**Effort:** Medium-High (3 weeks) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

Show a position and ask: "What would YOU play here?" No right or wrong answer. After submitting, see what the community chose, what the GM actually played, and what the engine recommends.

**Why this mode is special:**
- **Zero intimidation**: No failing, no wrong answers. Everyone participates.
- **Fascinating data**: "73% of players chose Nxf7, but the grandmaster played Qh5!"
- **Discussion driver**: The most debatable positions generate the best community conversations.
- **Broader audience**: Even beginners can participate — just pick a move.
- **Daily content**: Each day's position creates debate and discussion.

**How it works:**
- Show the position, player to move
- Player makes one move (drag and drop, same as main game)
- After submitting, reveal:
  - Community vote distribution ("42% played Nf5, 31% played d4, 15% played Qh5...")
  - The actual game continuation
  - Engine's top 3 moves with evaluations
- Shareable: "I agreed with the GM! Only 15% of players found Qh5."

**Implementation:** Requires Firebase to store community votes. Each day's position gets a Firestore document tracking move counts. Display aggregated results after the player submits.

---

#### C4. Famous Games Collection
**Effort:** Medium (1-2 weeks dev + curation) | **Impact:** Medium | **Effectiveness: 7/10**

A curated collection of puzzles from the most famous games in history: Kasparov vs. Deep Blue, Fischer vs. Spassky, the Immortal Game, Morphy's Opera Game, the Evergreen Game.

**Why it works:**
- "Can you find the move that beat Deep Blue?" is an irresistible hook
- Famous games have built-in search interest (SEO value for "Kasparov Deep Blue moves")
- Educational value attracts chess improvers, not just puzzle solvers
- Narrative context makes each puzzle more engaging
- Evergreen content — these games never get old

**Implementation:** Curate 50-100 positions from historically significant games. Add narrative context to each (players, year, stakes, what happened). Create a "Famous Games" section at `/famous`. Each game gets its own shareable page.

---

#### C5. Beginner Mode (3 Moves) + Weekly Difficulty Curve
**Effort:** Low-Medium (1 week) | **Impact:** Medium | **Effectiveness: 7/10**

A simplified version with 3 moves instead of 5, using positions from lower-rated games (1200-1600) with more straightforward continuations. Additionally, implement a weekly difficulty curve like Chess.com's daily puzzle: Monday = easiest, Saturday = hardest, Sunday = special theme.

**Why it matters:**
- The current game is hard. Even experienced club players struggle with some puzzles.
- Beginners try, fail repeatedly, and churn. A beginner mode keeps them in the ecosystem.
- Chess.com's daily puzzle follows a weekly difficulty ramp (Monday easiest → Sunday hardest) — simple, predictable, and effective.
- Duolingo's progressive difficulty is a core reason for their 80% organic user acquisition.
- 3-move puzzles are quicker, less intimidating, and still satisfying.

**Implementation:** Add a mode toggle (Beginner / Standard). Filter games by player rating range. Truncate solution to 3 moves. Adjust the grid to 5 rows x 3 columns. For the weekly curve, tag games by difficulty and schedule easier games for Monday-Tuesday, harder for Friday-Saturday.

---

#### C6. Daily Challenge Variant
**Effort:** Low (3-5 days) | **Impact:** Medium | **Effectiveness: 6.5/10**

A bonus daily puzzle with special constraints — a "hard mode" daily challenge for players who've already completed the regular puzzle.

**Ideas:**
- **Blindfold**: Board is hidden after 5 seconds — you must memorize and play from memory
- **Speed round**: Solve within 60 seconds
- **No undo**: Can't take back moves
- **First try only**: You get exactly 1 guess — solve it or fail

**Why it matters:** Gives the core audience more to do each day without diluting the main puzzle. Creates a prestige mechanic — "I solved the blindfold challenge!" is highly shareable.

---

### D. Social & Multiplayer

These create viral loops where players bring other players.

---

#### D1. Challenge a Friend
**Effort:** Medium (2-3 weeks) | **Impact:** Very High | **Effectiveness: 9/10**

Let players send a challenge link to a friend. Both solve the same puzzle. Compare results.

**How it works:**
- After solving (or from the archive), click "Challenge a Friend"
- Generates a unique URL like `chessguessr.com/challenge/abc123`
- Friend opens URL, solves the same puzzle
- After both solve, show comparison: who solved in fewer guesses, move-by-move comparison
- Shareable result: "I beat @friend at Chessguessr #930! 3/5 vs 4/5"

**Why this is so powerful:**
- Every challenge sent is a free referral — someone who may never have heard of chessguessr now plays it
- GeoGuessr's "invite a friend to play together" mechanic is a key viral loop in their freemium model. GeoGuessr's Party Mode supports up to 20 friends via link, and only the host needs a subscription — free users experience premium gameplay through friends.
- NYT Games launched a multi-game friend leaderboard in April 2025 tracking scores across Wordle, Connections, Spelling Bee, and The Mini — showing that even the biggest players see friend competition as a growth lever
- Head-to-head competition adds emotional stakes
- No account required — works via shareable links and localStorage
- Challenge links have a 30-40% conversion rate (friend actually plays)

**Implementation:** Generate a challenge ID, store the puzzle ID + challenger's result in Firebase. When the friend visits, load the same puzzle. After both complete, show comparison view.

---

#### D2. Daily Leaderboard
**Effort:** Medium (2 weeks) | **Impact:** High | **Effectiveness: 8/10**

Show a leaderboard of today's top solvers — ranked by fewest guesses, then fastest time (if timer is added).

**How it works:**
- After solving today's puzzle, your result is optionally submitted to the leaderboard
- Requires a display name (no full account needed — just enter a name)
- Leaderboard shows: Rank, Name, Guesses (1-5), Time (optional)
- Updated in real-time throughout the day
- Resets each day at midnight UTC

**Why it matters:**
- Users who engage with leaderboards complete 40% more activities per week (Duolingo data)
- Leaderboards fulfill needs for social comparison and status
- "I'm #3 today!" is inherently shareable
- Creates a reason to solve the puzzle early in the day (competition for top spots)

**Implementation:** Firebase Firestore collection per day. Write result on solve (with rate limiting). Read and display in a leaderboard component. Add an opt-in name field.

---

#### D3. User Accounts (Lichess OAuth)
**Effort:** High (3-4 weeks) | **Impact:** High | **Effectiveness: 7.5/10**

Add optional accounts via Lichess OAuth for cross-device sync, persistent stats, and global leaderboards.

**Why Lichess OAuth specifically:**
- All games come from Lichess — natural fit
- Lichess OAuth is well-documented and free
- Gets the player's Lichess username and rating automatically
- Links chessguessr identity to a chess identity (credibility)
- No email/password management needed

**What accounts enable:**
- Cross-device stats sync (currently lost on browser clear)
- Global leaderboards with real usernames
- Achievement persistence
- Challenge history
- Profile pages ("Player X: 847 puzzles solved, 92% win rate, 156-day max streak")
- Streak protection that works across devices

**Implementation:** Remix supports OAuth flows. Use Lichess OAuth2 PKCE flow. Store user data in Firebase. Make accounts strictly optional — the zero-friction anonymous experience stays as the default.

---

#### D4. Social Share Buttons
**Effort:** Very Low (few hours) | **Impact:** Medium | **Effectiveness: 7/10**

The current share button only copies to clipboard. Add direct share buttons for Twitter/X, Reddit, WhatsApp, and the native Web Share API (mobile).

**Implementation:**
- Twitter: `https://twitter.com/intent/tweet?text=` + encoded share text
- Reddit: `https://reddit.com/submit?title=` + encoded text
- WhatsApp: `https://wa.me/?text=` + encoded text
- Mobile: `navigator.share()` for native share sheet
- Keep clipboard copy as fallback

**Why it matters:** Each friction point between "I want to share" and "I've shared" loses a percentage of sharers. Clipboard-only requires the extra step of opening an app and pasting. Direct share buttons remove that step.

---

### E. Archive & Content

The archive has 929 puzzles but minimal discoverability. These features make the archive more useful and more discoverable.

---

#### E1. Archive Search, Filter & Sort
**Effort:** Medium (1-2 weeks) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

The archive is currently a flat list of 929 cards sorted by date. Finding a specific puzzle or type of puzzle is impossible.

**Filters to add:**
- **By player**: Search for games featuring Magnus Carlsen, Hikaru, etc.
- **By difficulty**: Easy / Medium / Hard / Expert (based on solve rate data from Firebase)
- **By result**: Show only puzzles you haven't solved yet
- **By player title**: GM-only, IM-only, untitled
- **By rating range**: 1500-2000, 2000-2500, 2500+
- **By date range**: Month/year picker

**Sort options:**
- Date (newest/oldest) — current default
- Difficulty (easiest/hardest)
- Most popular (highest solve attempts)
- Unsolved first

**Additional improvements:**
- **Pagination or infinite scroll**: 929 cards on one page is slow
- **"Random puzzle" button**: Pick a random unsolved puzzle
- **Solved indicator**: Show a checkmark on puzzles the user has already completed (requires tracking in localStorage)

**Implementation:** Difficulty data comes from Firebase stats (solve rate). Player data is already in game objects. Add filter controls above the grid. Add localStorage tracking for solved archive puzzles.

---

#### E2. Puzzle Difficulty Rating
**Effort:** Low-Medium (1 week) | **Impact:** Medium-High | **Effectiveness: 7.5/10**

Tag every puzzle with a difficulty level visible to the player: Easy (1 star), Medium (2 stars), Hard (3 stars), Expert (4 stars).

**How to compute difficulty:**
- Primary signal: historical solve rate from Firebase (`solved / (solved + failed)`)
- Secondary signal: player Elo in the original game (higher = harder positions)
- Tertiary: number of "tricky" moves (moves with multiple reasonable alternatives)

**Where to show it:**
- On the daily puzzle: "Today's puzzle: ⭐⭐⭐ Hard"
- In the archive cards: difficulty badge
- In the share text: "Chessguessr #930 ⭐⭐⭐ 3/5"
- As an archive filter

**Why it matters:**
- Sets expectations — players know what they're getting into
- "Hard" labels make successful solves feel more impressive ("I solved an Expert puzzle!")
- "Easy" labels make the game more welcoming for beginners
- Difficulty in the share text adds context that drives engagement

---

#### E3. Daily Hint / Answer SEO Pages
**Effort:** Medium (1-2 weeks) | **Impact:** High | **Effectiveness: 8/10**

Create auto-generated pages at `/hints` targeting searches like "chessguessr today", "chessguessr answer", "chessguessr hints."

**Why it works:**
- "Wordle answer today" created a billion-click ecosystem across Forbes, Tom's Guide, and dozens of publishers
- Each daily puzzle creates a recurring search query opportunity
- These pages drive organic traffic from people who have never heard of chessguessr

**Page structure:**
- Tiered hints: thematic clue → piece type → specific file/rank → full answer (behind spoiler)
- Game context: player names, tournament, ratings
- Community stats: "Yesterday: 34% solve rate, average 3.2 guesses"
- Link back to play
- SEO meta tags: "Chessguessr Hints Today - March 1, 2026 | Puzzle #930"
- Archive of past hint pages (evergreen long-tail SEO)

**Implementation:** New Remix route at `/hints`. Auto-generates content from the daily game data. Use the existing game metadata (player names, event, ratings) to create hint content. Add `<meta>` tags for SEO.

---

#### E4. Game Context Pages
**Effort:** Medium (1-2 weeks) | **Impact:** Medium | **Effectiveness: 6.5/10**

For each archived puzzle, create a rich content page with the full game story, player bios, tournament context, and the position's significance.

**Content per page:**
- Full game PGN (fetched from Lichess API)
- Player information and photos
- Tournament/event context
- Engine analysis of key moments
- Link to play the chessguessr puzzle from this game
- Related puzzles from the same tournament/players

**Why it matters:** Creates hundreds of SEO-optimized pages. Each page targets long-tail searches like "Carlsen Nakamura speed chess 2024 analysis." Positions chessguessr as a content platform, not just a game.

---

### F. UX & Platform

These improve the experience for existing users and expand platform reach.

---

#### F1. Progressive Web App (PWA) + Push Notifications
**Effort:** Medium (1-2 weeks) | **Impact:** High | **Effectiveness: 8.5/10**

Convert chessguessr into a PWA with a service worker, web app manifest, and push notifications.

**What this enables:**
- **"Add to Home Screen"** prompt on mobile — makes chessguessr feel like a native app
- **Push notifications**: "Your daily puzzle is ready!", "Your 23-day streak is at risk!", "Only 12% solved yesterday's puzzle — can you do today's?"
- **Offline caching**: The game loads instantly, even on slow connections
- **Full-screen mode**: No browser chrome, immersive experience

**Why it matters:**
- Push notifications are the most direct retention tool available
- "Install" creates commitment — home screen apps are opened 2-3x more than bookmarked websites
- PWA delivers 80% of native app benefits at 10% of the cost
- Mobile users are the majority of web traffic for casual games

**Implementation:** Add a `manifest.json` with icons and theme colors. Register a service worker for caching. Use the Web Push API for notifications (requires a push server — Vercel serverless functions work). Add an install prompt banner.

---

#### F2. Timer / Speed Tracking
**Effort:** Low (3-5 days) | **Impact:** Medium | **Effectiveness: 7/10**

Track how long each puzzle takes to solve. Show the time in stats and optionally in the share text.

**How it works:**
- Timer starts when the puzzle loads (or on first move)
- Timer stops when the puzzle is solved/failed
- Show elapsed time in the stats modal: "Solved in 2:34"
- Optional: include in share text: "Chessguessr #930 3/5 ⏱️2:34"
- Track average solve time in personal stats
- Compare to community average: "You solved this 40% faster than average"

**Why it matters:**
- Adds a second dimension of competition (not just guesses, but speed)
- Creates more interesting leaderboard data
- Speed-solving is compelling content for streamers
- "I solved it in 47 seconds" is highly shareable

**Implementation:** Add a `useTimer` hook. Start on component mount or first `onDrop`. Stop in `addGuess()`. Store time in localStorage alongside game state.

---

#### F3. Improved Onboarding
**Effort:** Medium (1-2 weeks) | **Impact:** Medium | **Effectiveness: 7/10**

The current tutorial is a static modal with text and examples. It explains the rules but doesn't teach the player how to interact with the board.

**Improvements:**
- **Interactive tutorial**: Instead of reading about moves, the player makes a guided move. "Drag the rook to d6. Great! Now see how the tile turns green?"
- **Progressive disclosure**: Don't dump all rules at once. Show basic rules first, explain yellow/blue after the player encounters them.
- **Board interaction hints**: First-time players may not realize they can drag pieces. Show a subtle animation of a piece being dragged.
- **"Try it" practice puzzle**: After the tutorial, offer a simple practice position (doesn't count toward stats).

**Why it matters:** The tutorial is every user's first impression. A confused first-time player bounces. An engaged first-time player returns tomorrow. Interactive tutorials have significantly higher completion rates than passive text.

---

#### F4. Animated Move Replay
**Effort:** Low-Medium (1 week) | **Impact:** Medium | **Effectiveness: 6.5/10**

After solving or failing, animate the solution moves on the board one by one, showing the pieces moving naturally.

**How it works:**
- After the game ends, the board replays the 5 solution moves with smooth piece animations
- Each move has a 1-2 second pause so the player can follow
- Optionally: play/pause controls, speed control
- Show each move's notation highlighted as it plays

**Why it matters:**
- Helps players understand the tactical idea behind the solution
- Visually satisfying — seeing the combination unfold is more impactful than reading notation
- Reduces the "I don't understand the solution" frustration for lower-rated players
- Creates GIF-worthy moments for social sharing

---

#### F5. Keyboard-First Play Mode
**Effort:** Low (3-5 days) | **Impact:** Low-Medium | **Effectiveness: 5.5/10**

Allow moves to be entered via keyboard notation (e.g., type "Rd6" and press Tab/Enter to confirm), in addition to drag-and-drop.

**Why it matters:**
- Power users prefer keyboard input — it's faster
- Accessibility improvement for users who struggle with drag-and-drop
- Chess players are accustomed to entering moves by notation
- Keyboard shortcuts already exist for undo/redo/submit — this completes the keyboard experience

---

### G. Monetization Features (to fund growth)

Not growth features per se, but necessary to sustain development of the above.

---

#### G1. Optional Premium Tier
**Effort:** High (4-6 weeks) | **Impact:** Medium | **Effectiveness: 6/10**

A voluntary subscription that unlocks enhanced features while keeping the core game free forever.

**Free (always):** Daily puzzle, archive, basic stats, sharing
**Premium ($3-5/month):**
- Unlimited Puzzle Rush mode
- Advanced stats dashboard with trends and percentiles
- Streak Freeze (earn more, or use without earning)
- All game modes (Guess the Elo, etc.)
- Ad-free experience (if ads are ever added)
- Profile badges and cosmetics
- Early access to new features

**Why this model works:**
- GeoGuessr: free tier → $3.99-$9.99/mo subscription. Revenue went from $500K to $18M in 3 years.
- Healthy freemium conversion rate is 2-5%
- Never gate the core daily puzzle — that's what drives habit and virality
- Keep generous free functionality — subscribers pay for extras, not necessities

---

## Growth & Distribution Ideas

These are non-feature strategies for getting more people to the site. Kept brief since the focus is on features.

| # | Idea | Effort | Impact |
|---|------|--------|--------|
| G1 | **Content creator outreach** — get chess YouTubers to play/feature it | Medium | Very High |
| G2 | **Launch Discord server** — community hub for daily discussion | Very Low | High |
| G3 | **Active Reddit strategy** — r/chess (1.6M members), r/webgames | Low | High |
| G4 | **Submit to "Games Like Wordle" lists** — PC Gamer, Tom's Guide, etc. | Very Low | Medium |
| G5 | **Product Hunt / Hacker News launch** — time with a feature release | Very Low | Variable |
| G6 | **Twitter bot enhancement** — daily puzzle tweets with context, stats recaps | Low | Medium |
| G7 | **Lichess cross-promotion** — blog post, team events, deeper integration | Medium | Medium |
| G8 | **TikTok/YouTube Shorts** — short-form solve videos | Medium | Potentially High |
| G9 | **Email newsletter** — daily/weekly digest with stats and puzzle links | Low-Med | Medium |
| G10 | **Streamer tournament** — PogChamps-style event for chessguessr | Medium | Potentially Very High |

---

## Master Rankings

All ideas ranked by effectiveness, considering both impact and effort.

| Rank | Idea | Type | Effectiveness | Effort | Do When |
|------|------|------|:------------:|:------:|:-------:|
| 1 | **B1. Streak Overhaul** | Feature | 9.5/10 | Medium | **NOW** |
| 2 | **A1. Enhanced Share Text** | Feature | 9/10 | Very Low | **NOW** |
| 3 | **D1. Challenge a Friend** | Feature | 9/10 | Medium | **NOW** |
| 4 | **F1. PWA + Push Notifications** | Feature | 8.5/10 | Medium | **NOW** |
| 5 | **A2. Post-Solve Game Story** | Feature | 8.5/10 | Low-Med | **NOW** |
| 6 | **C1. Guess the Elo Mode** | Feature | 8.5/10 | Medium | **SOON** |
| 7 | **G1. Creator Outreach** | Growth | 8.5/10 | Medium | **NOW** |
| 8 | **E3. Daily Hint SEO Pages** | Feature | 8/10 | Medium | **SOON** |
| 9 | **D2. Daily Leaderboard** | Feature | 8/10 | Medium | **SOON** |
| 10 | **B2. Enhanced Stats Dashboard** | Feature | 8/10 | Medium | **SOON** |
| 11 | **C2. Puzzle Rush / Blitz** | Feature | 8/10 | High | **SOON** |
| 12 | **G2. Discord Server** | Growth | 8/10 | Very Low | **NOW** |
| 13 | **E2. Puzzle Difficulty Rating** | Feature | 7.5/10 | Low-Med | **SOON** |
| 14 | **B3. Achievement System** | Feature | 7.5/10 | Medium | **SOON** |
| 15 | **A3. Hint System** | Feature | 7.5/10 | Medium | **SOON** |
| 16 | **B4. Personal Rating** | Feature | 7.5/10 | Med-High | **PLAN** |
| 17 | **E1. Archive Search/Filter** | Feature | 7.5/10 | Medium | **SOON** |
| 18 | **D3. User Accounts** | Feature | 7.5/10 | High | **PLAN** |
| 19 | **C3. What Would You Play** | Feature | 7.5/10 | Med-High | **PLAN** |
| 20 | **G3. Reddit Strategy** | Growth | 7.5/10 | Low | **NOW** |
| 21 | **F2. Timer / Speed Tracking** | Feature | 7/10 | Low | **SOON** |
| 22 | **C4. Famous Games** | Feature | 7/10 | Medium | **PLAN** |
| 23 | **C5. Beginner Mode** | Feature | 7/10 | Low-Med | **PLAN** |
| 24 | **D4. Social Share Buttons** | Feature | 7/10 | Very Low | **NOW** |
| 25 | **F3. Improved Onboarding** | Feature | 7/10 | Medium | **PLAN** |
| 26 | **A4. Sound Effects** | Feature | 6.5/10 | Low | **PLAN** |
| 27 | **A5. Hard Mode** | Feature | 6.5/10 | Low | **PLAN** |
| 28 | **C6. Daily Challenge Variant** | Feature | 6.5/10 | Low | **PLAN** |
| 29 | **F4. Animated Move Replay** | Feature | 6.5/10 | Low-Med | **PLAN** |
| 30 | **B5. Weekly Recap** | Feature | 6.5/10 | Low | **PLAN** |
| 31 | **E4. Game Context Pages** | Feature | 6.5/10 | Medium | **LATER** |
| 32 | **G1. Premium Tier** | Feature | 6/10 | High | **LATER** |
| 33 | **F5. Keyboard Play Mode** | Feature | 5.5/10 | Low | **LATER** |

---

## Recommended Roadmap

### Phase 1: Quick Wins (Week 1-2)
*Maximize impact with minimal effort. Do these immediately.*

1. **Enhanced share text** (A1) — add streak, solve %, difficulty to share. Few hours of work.
2. **Social share buttons** (D4) — Twitter, Reddit, WhatsApp direct share. Few hours.
3. **Discord server** (G2) — launch community hub. Day 1.
4. **Start creator outreach** (G1) — DM chess micro-influencers. Ongoing.
5. **Submit to game directories** (G4) — "Games like Wordle" lists. Day 1-2.

### Phase 2: Core Retention Features (Week 3-6)
*Keep users coming back. These are the highest-impact features.*

6. **Streak overhaul** (B1) — visual counter, milestones, freeze, recovery, max streak
7. **Post-solve game story** (A2) — continuation, narrative, engine eval
8. **PWA + push notifications** (F1) — install prompt, daily puzzle notification
9. **Timer** (F2) — track and display solve time
10. **Puzzle difficulty rating** (E2) — tag every puzzle with stars

### Phase 3: Expand the Game (Week 7-12)
*New modes and social features that broaden the audience.*

11. **Challenge a friend** (D1) — shareable challenge links
12. **Guess the Elo mode** (C1) — second daily game
13. **Daily leaderboard** (D2) — compete on today's puzzle
14. **Enhanced stats dashboard** (B2) — richer stats, comparisons
15. **Achievement system** (B3) — badges, milestones, collection

### Phase 4: Platform & Depth (Month 4-6)
*Deepen engagement and build sustainable advantage.*

16. **Archive search/filter** (E1) — find puzzles by player, difficulty, date
17. **Daily hint SEO pages** (E3) — organic traffic from search
18. **Puzzle Rush mode** (C2) — timed unlimited play
19. **Hint system** (A3) — optional clues for stuck players
20. **Personal rating** (B4) — Chessguessr Elo
21. **User accounts** (D3) — Lichess OAuth, cross-device sync
22. **What Would You Play mode** (C3) — community voting

### Phase 5: Scale (Month 6+)
*Build a complete chess puzzle platform.*

23. **Beginner mode** (C5) — 3-move puzzles for newcomers
24. **Famous games collection** (C4) — historical chess puzzles
25. **Improved onboarding** (F3) — interactive tutorial
26. **Hard mode** (A5) — must use clues in future guesses
27. **Weekly recap** (B5) — shareable weekly summary
28. **Optional premium tier** (G1) — sustain development

---

## Appendix: Key Data Points

| Metric | Source |
|--------|--------|
| Wordle: 90 → 10M daily users in 3 months via emoji sharing | MoEngage |
| Wordle emoji sharing: 1.2M Twitter shares in 13 days | Emoji Timeline |
| Duolingo: 7+ day streaks → 3.6x higher long-term retention | Sensor Tower |
| Duolingo: Streak Freeze → 21% churn reduction | Trophy |
| Duolingo: Streaks + milestones → 40-60% higher DAU | RevenueCat |
| Duolingo: Leaderboard users → 40% more activities/week | Duolingo |
| GeoGuessr: 10M → 65M users through creator content | Wikipedia |
| GeoGuessr: $500K → $18M revenue via freemium (3 years) | CompWorth |
| Chess.com: Queen's Gambit → 500% increase in sign-ups | Towards Data Science |
| Chess.com: PogChamps 3 → 375K peak concurrent Twitch viewers | Chess Watch |
| Chess.com: 300+ partnered streamers program | TheZerotoOne |
| GothamChess: 5.3M YouTube subs, "Guess the Elo" millions of views | YouTube |
| Apps with gamification: 22% average retention improvement | Forrester |
| Gamification: 30-day churn reduced by 35% vs non-gamified | Forrester |
| Community integration: 22% higher engagement, 19% lower churn | Roveir |
| Reddit devlog → 10,000 Steam wishlists in 2 days | SnoopGame |
