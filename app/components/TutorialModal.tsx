import { Dialog } from './Dialog';
import { Tile } from './Tile';

const EXAMPLE = [
  { move: 'Nd5', color: 'green', pieceColor: 'regular' },
  { move: 'exd5', color: 'grey', pieceColor: 'regular' },
  { move: 'Bxb6', color: 'yellow', pieceColor: 'regular' },
  { move: 'Qd6', color: 'grey', pieceColor: 'blue' },
  { move: 'Rxd4', color: 'grey', pieceColor: 'regular' },
];

const LEGEND = [
  { color: 'green', pieceColor: 'regular', text: 'Right move in the right spot.' },
  { color: 'yellow', pieceColor: 'regular', text: 'The move is in the line, but in another spot.' },
  { color: 'grey', pieceColor: 'blue', text: 'Right piece type in this spot (any knight, any pawn…), wrong move.' },
  { color: 'grey', pieceColor: 'regular', text: 'Not in the line.' },
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
    >
      <p className="leading-relaxed">
        You're shown a position from a real chess game. Guess the{' '}
        <strong>next 5 moves</strong> that were played, by making them on the
        board. You have 5 tries, and the tiles show how close each guess was.
      </p>

      <div className="flex gap-1.5 mt-4" aria-hidden="true">
        {EXAMPLE.map(({ move, color, pieceColor }, i) => (
          <Tile
            key={move}
            color={color}
            pieceColor={pieceColor}
            flipTile={true}
            animationIndex={i}
            tutorial={true}
          >
            {move}
          </Tile>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {LEGEND.map(({ color, pieceColor, text }) => (
          <li key={text} className="flex items-center gap-3">
            <Tile
              color={color}
              pieceColor={pieceColor}
              flipTile={true}
              tutorial={true}
              className="tile-legend"
            />
            <span className="text-sm leading-snug">{text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm leading-relaxed opacity-80">
        Moves must match exactly, including check (+). A new puzzle appears
        every day at midnight UTC.
      </p>

      <button
        type="button"
        className="btn btn-primary btn-block normal-case mt-5"
        onClick={() => setShowTutorial(false)}
      >
        Got it
      </button>
    </Dialog>
  );
}
