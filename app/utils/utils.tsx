import { zeroPad } from "react-countdown";

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
