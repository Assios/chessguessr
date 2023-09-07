import { zeroPad } from "react-countdown";
import { useHotkeys as _useHotkeys } from "react-hotkeys-hook";
import {
  FaChessBishop,
  FaChessKing,
  FaChessKnight,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa";

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
    move: convertToIcon(move),
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

export const convertToIcon = (move: string) => {
  if (!move) return "";

  if (move[0].toLowerCase() === move[0] && /[a-h]/.test(move[0])) {
    return (
      <>
        <FaChessPawn /> {move}
      </>
    );
  }

  switch (move[0]) {
    case "K":
      return (
        <>
          <FaChessKing /> {move.substr(1)}
        </>
      );
    case "Q":
      return (
        <>
          <FaChessQueen /> {move.substr(1)}
        </>
      );
    case "B":
      return (
        <>
          <FaChessBishop /> {move.substr(1)}
        </>
      );
    case "N":
      return (
        <>
          <FaChessKnight /> {move.substr(1)}
        </>
      );
    case "R":
      return (
        <>
          <FaChessRook /> {move.substr(1)}
        </>
      );
    default:
      return move;
  }
};
