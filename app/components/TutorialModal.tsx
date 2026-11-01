import { Dialog } from './Dialog';
import { Tile } from './Tile';

// Each example flips one tile inside an otherwise unplayed line, so the
// colour is read in context. animationIndex staggers the flips.
const EXAMPLES = [
  {
    moves: ['Nd5', 'Nbxd5', 'exd5', 'Qd6', 'Rxd4'],
    flip: 0,
    color: 'green',
    pieceColor: 'regular',
    animationIndex: 1,
    text: 'Nd5 is the correct move in the correct spot.',
  },
  {
    moves: ['Be6', 'Bxb6', 'Bxc4+', 'Kg1', 'Ne2+'],
    flip: 1,
    color: 'yellow',
    pieceColor: 'regular',
    animationIndex: 3,
    text: 'The move Bxb6 is in the played line, but in the wrong spot.',
  },
  {
    moves: ['Nxg7', 'Kd8', 'Qf6+', 'Nxf6', 'Be7#'],
    flip: 3,
    color: 'grey',
    pieceColor: 'blue',
    animationIndex: 2,
    text: 'The same piece type was played in this spot, but the move is wrong. In this case, a knight was played, but not necessarily the same knight.',
  },
];

export default function TutorialModal({
  setShowTutorial,
  showTutorial,
}: {
  setShowTutorial: (show: boolean) => void;
  showTutorial: boolean;
}) {
  return (
    <Dialog
      open={showTutorial}
      onClose={() => setShowTutorial(false)}
      title="How to play"
      labelId="tutorial-title"
      wide
    >
      <p className="leading-relaxed sm:text-lg">
        You will be shown a position from a chess game. Guess the 5 next moves
        played in the game. After each guess, the color of the tile will show
        how close you were. It's like Wordle, or Chessle, but for chess games.
      </p>

      <div className="divider my-3 sm:my-4" />

      <h3 className="text-lg sm:text-xl font-semibold">Examples</h3>

      {EXAMPLES.map(({ moves, flip, color, pieceColor, animationIndex, text }) => (
        <div key={moves[flip]} className="mt-3 sm:mt-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {moves.map((move, i) =>
              i === flip ? (
                <Tile
                  key={move}
                  color={color}
                  pieceColor={pieceColor}
                  flipTile={true}
                  animationIndex={animationIndex}
                  tutorial={true}
                >
                  {move}
                </Tile>
              ) : (
                <Tile key={move} tutorial={true}>
                  {move}
                </Tile>
              )
            )}
          </div>
          <p className="mt-1.5 leading-snug sm:text-lg">{text}</p>
        </div>
      ))}

      <p className="mt-4 sm:mt-5 leading-relaxed sm:text-lg">
        <span className="font-bold">NB!</span> The notation has to be identical
        for the moves to be considered the same (<i>Nxf7</i> and <i>Nxf7+</i>{' '}
        aren't considered the same moves).
      </p>
      <p className="mt-3 font-bold leading-relaxed sm:text-lg">
        A new position will appear every day at midnight UTC.
      </p>

      <div className="mt-5 flex sm:justify-end">
        <button
          type="button"
          className="btn btn-primary btn-block sm:w-auto sm:px-8 normal-case"
          onClick={() => setShowTutorial(false)}
        >
          Got it
        </button>
      </div>
    </Dialog>
  );
}
