import { Row } from './Row';
import type { GridProps } from '../utils/types';

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: GridProps) => (
  <div className="cg-grid">
    <h2 className="cg-grid-label font-semibold">Your guesses</h2>
    {guesses.map((guess, i) =>
      turn === i ? (
        <Row
          key={i}
          currentGuess={currentGuess}
          guess={guess}
          insufficientMoves={insufficientMoves}
        />
      ) : (
        <Row key={i} guess={guess} />
      )
    )}
  </div>
);
