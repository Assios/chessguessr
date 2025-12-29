import { RowProps } from '~/utils/types';
import { Tile } from './Tile';

export const Row = ({ guess, currentGuess, insufficientMoves }: RowProps) => {
  const rowClasses = `text-center flex justify-center ${
    insufficientMoves ? 'animate-shake' : ''
  }`;

  if (currentGuess) {
    return (
      <div className={rowClasses}>
        {currentGuess.map((g: any, i: number) => (
          <Tile className="m-[3px]" key={i} current={true}>
            {g}
          </Tile>
        ))}
        {[...Array(5 - currentGuess.length)].map((_, i) => (
          <Tile className="m-[3px]" key={`empty-${i}`} />
        ))}
      </div>
    );
  }

  if (guess) {
    return (
      <div className={rowClasses}>
        {guess.map((move: any, i: number) => {
          if (move) {
            return (
              <Tile
                key={i}
                className="m-[3px]"
                color={move.color}
                pieceColor={move.pieceColor}
                flipTile={true}
                animationIndex={i}
              >
                {move.move}
              </Tile>
            );
          } else {
            return <Tile key={i} className="m-[3px]" />;
          }
        })}
      </div>
    );
  }

  return (
    <div className={rowClasses}>
      <Tile className="bg-primary m-[3px]" />
      <Tile className="bg-primary m-[3px]" />
      <Tile className="bg-primary m-[3px]" />
      <Tile className="bg-primary m-[3px]" />
      <Tile className="bg-primary m-[3px]" />
    </div>
  );
};
