export type GameType = {
  date: string;
  fen: string;
  solution: string[];
  gameUrl: string;
  white: string;
  black: string;
  wAka?: string;
  bAka?: string;
  wTitle?: string;
  bTitle?: string;
  event?: string;
  eventUrl?: string;
  variant?: string;
  wRating: number | string | null;
  bRating: number | string | null;
  id: number;
};

// Formatted guess (produced by formatGuess(), used in Grid/Row/Modal)
export type GuessColor = 'green' | 'yellow' | 'grey';
export type PieceColor = 'blue' | 'regular';
export type FormattedGuessMove = {
  move: string | JSX.Element;
  color: GuessColor;
  pieceColor: PieceColor;
};
export type FormattedGuessRow = (FormattedGuessMove | null)[];

// Player stats (localStorage cg-stats)
export type GuessDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  failed: number;
  [key: string]: number;
};
export type PlayerStats = {
  gamesPlayed: number;
  currentStreak: number;
  lastPlayed: string | null;
  guesses: GuessDistribution;
};

// Puzzle stats (from Firestore)
export type PuzzleStats = {
  solved?: number;
  failed?: number;
  turns?: number;
};

// Game state (localStorage cg-state)
export type GameState = {
  guesses: FormattedGuessRow[];
  turn: number;
  gameStatus: GameStatus;
  date: string;
};

// Outlet context (defined in root.tsx, consumed everywhere)
export type OutletContextType = {
  showTutorial: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  setTutorial: (val: boolean) => void;
  trackPageview: () => void;
  trackEvent: (
    eventName: string,
    options?: { props?: Record<string, string> }
  ) => void;
  showNavbarStats: boolean;
  setShowNavbarStats: (show: boolean) => void;
};

// Chess.js 0.12.1 minimal types
export interface ChessMove {
  from: string;
  to: string;
  san: string;
  flags?: string;
  promotion?: string;
}
export interface ChessInstance {
  fen(): string;
  turn(): 'w' | 'b';
  move(
    move: string | { from: string; to: string; promotion?: string }
  ): ChessMove | null;
}

export type Guess = (string | JSX.Element)[];

export interface GridProps {
  currentGuess: Guess;
  guesses: FormattedGuessRow[];
  turn: number;
  insufficientMoves: boolean;
}

export interface RowProps {
  guess?: FormattedGuessRow;
  currentGuess?: Guess;
  insufficientMoves?: boolean;
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SOLVED = "SOLVED",
  FAILED = "FAILED",
}

export type FullFenHistory = {
  trueFenHistory: string[];
  cachedNavigableHistory: string[];
};

export type GuessWithHistory = {
  trueGuess: string[];
  cachedNavigableGuess: string[];
};
