import { zeroPad } from "react-countdown";
import { useHotkeys as _useHotkeys } from "react-hotkeys-hook";
import { PlayerStats } from "~/components/AuthProvider/AuthProvider";

export const arraysEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const midnightUtcTomorrow = () => {
  let tomorrow = new Date();

  tomorrow.setDate(new Date().getDate() + 1);

  return new Date(
    Date.UTC(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      0,
      0,
      0,
      0
    )
  );
};

export const countdownRenderer = ({ hours, minutes, seconds }) => (
  <span>
    {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
  </span>
);

const gameUrlText = (game) => {
  if (game.gameUrl.includes("lichess.org")) {
    return "on lichess";
  }

  return "here";
};

export const GameLink = ({ game }) => {
  return (
    <a
      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
      href={game.gameUrl}
      target="_blank"
    >
      {gameUrlText(game)}
    </a>
  );
};

export const guessifySolution = (game) => {
  return game.solution.map((move) => ({
    move,
    color: "green",
    pieceColor: "regular",
  }));
};

// We re-export useHotkeys with preventDefault on the handler
export const useHotkeys = (
  key: string,
  callback: () => void,
  deps: any[] = []
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

export const isValidPlayerStats = (stats: any): stats is PlayerStats => {
  if (!stats) return false;

  const hasValidNumberProp = (obj: any, propName: string) => {
    return typeof obj[propName] === "number";
  };

  const hasValidGuesses = (guesses: any) => {
    return (
      hasValidNumberProp(guesses, "1") &&
      hasValidNumberProp(guesses, "2") &&
      hasValidNumberProp(guesses, "3") &&
      hasValidNumberProp(guesses, "4") &&
      hasValidNumberProp(guesses, "5") &&
      hasValidNumberProp(guesses, "failed")
    );
  };

  return (
    hasValidNumberProp(stats, "gamesPlayed") &&
    hasValidNumberProp(stats, "currentStreak") &&
    (stats.lastPlayed === null || typeof stats.lastPlayed === "string") &&
    stats.guesses &&
    hasValidGuesses(stats.guesses)
  );
};

export const idToColor = (userID) => {
  const colors = {
    "cyan-400": "22D3EE",
    "yellow-400": "FBBF24",
    "amber-400": "F59E0B",
    "green-400": "10B981",
    "lime-400": "84CC16",
    "emerald-400": "059669",
    "teal-400": "14B8A6",
    "orange-400": "FB923C",
    "red-400": "EF4444",
    "fuchsia-400": "D946EF",
    "pink-400": "EC4899",
    "rose-400": "FB7185",
  };

  let hash = 0;
  for (let i = 0; i < userID.length; i++) {
    hash += userID.charCodeAt(i);
  }

  const colorKeys = Object.keys(colors);
  const index = hash % colorKeys.length;
  return colors[colorKeys[index]];
};
