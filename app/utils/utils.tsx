import { zeroPad } from "react-countdown";
import { useHotkeys as _useHotkeys } from "react-hotkeys-hook";
import type { GameType, PlayerStats } from "./types";

export const arraysEqual = (a: string[], b: string[]) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// Called when the countdown to the next puzzle hits zero. The short delay
// gives a slightly-fast client clock time to agree with the server's date.
export const reloadForNewPuzzle = () => {
  window.setTimeout(() => window.location.reload(), 5000);
};

export const midnightUtcTomorrow = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
};

export const getCurrentStreak = (playerStats: PlayerStats) => {
  if (playerStats.gamesPlayed === 0 || !playerStats.lastPlayed) return 0;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
  )
    .toISOString()
    .split("T")[0];

  if (playerStats.lastPlayed !== today && playerStats.lastPlayed !== yesterday) {
    return 0;
  }

  return playerStats.currentStreak;
};

export const countdownRenderer = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) => (
  <span>
    {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
  </span>
);

const gameUrlText = (game: GameType) => {
  if (game.gameUrl.includes("lichess.org")) {
    return "on lichess";
  }

  return "here";
};

export const GameLink = ({ game }: { game: GameType }) => {
  return (
    <a
      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
      href={game.gameUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {gameUrlText(game)}
    </a>
  );
};

export const guessifySolution = (game: GameType) => {
  return game.solution.map((move) => ({
    move,
    color: "green" as const,
    pieceColor: "regular" as const,
  }));
};

// We re-export useHotkeys with preventDefault on the handler
export const useHotkeys = (
  key: string,
  callback: () => void,
  deps: unknown[] = []
) => {
  return _useHotkeys(
    key,
    (e) => {
      e.preventDefault();
      callback();
    },
    deps
  );
};
