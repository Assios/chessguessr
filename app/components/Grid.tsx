import { Row } from './Row';
import { GridProps } from '../utils/types';
import { convertToIcon } from '~/utils/utils';

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: GridProps) => {
  const iconifiedCurrentGuess = currentGuess.map((move) => {
    if (typeof move === 'string') {
      return convertToIcon(move);
    }
    return move;
  });

  const iconifiedGuesses = guesses.map((row) => {
    return row.map((move: any) => {
      if (move === null) {
        return null;
      }
      return {
        ...move,
        move:
          typeof move.move === 'string' ? convertToIcon(move.move) : move.move,
      };
    });
  });

  return (
    <div className="ml-0 sm:ml-4 mt-6 lg:mt-[3.3rem]">
      <p className="text-base sm:text-lg lg:text-2xl mb-2 font-semibold">Your guesses:</p>
      {iconifiedGuesses.map((guess: any, i: number) => {
        if (turn === i) {
          return (
            <Row
              key={i}
              currentGuess={iconifiedCurrentGuess}
              guess={guess}
              insufficientMoves={insufficientMoves}
            />
          );
        }
        return <Row key={i} guess={guess} />;
      })}
    </div>
  );
};
