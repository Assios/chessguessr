import type { RowProps } from '~/utils/types';
import { Tile } from './Tile';

export const Row = ({ guess, currentGuess, insufficientMoves }: RowProps) => {
  const rowClasses = `cg-row ${insufficientMoves ? 'animate-shake' : ''}`;

  if (currentGuess) {
    return (
      <div className={`${rowClasses} cg-row-current`}>
        {currentGuess.map((g, i: number) => (
          <Tile key={i} current={true}>
            {g}
          </Tile>
        ))}
        {[...Array(5 - currentGuess.length)].map((_, i) => (
          <Tile key={`empty-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={rowClasses}>
      {(guess ?? [null, null, null, null, null]).map((move, i: number) =>
        move ? (
          <Tile
            key={i}
            color={move.color}
            pieceColor={move.pieceColor}
            flipTile={true}
            animationIndex={i}
          >
            {move.move}
          </Tile>
        ) : (
          <Tile key={i} />
        )
      )}
    </div>
  );
};
