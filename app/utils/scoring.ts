import type { FormattedGuessMove, FormattedGuessRow } from './types';

const PAWN_FILES = 'abcdefgh';
const KING_MOVES = 'OK'; // castling (O-O) counts as a king move

const samePieceType = (a: string, b: string) =>
  a[0] === b[0] ||
  (PAWN_FILES.includes(a[0]) && PAWN_FILES.includes(b[0])) ||
  (KING_MOVES.includes(a[0]) && KING_MOVES.includes(b[0]));

// Green: right move in the right slot. Yellow: the move is in the line, but in
// another slot. Blue (pieceColor): the right piece type was moved in this slot.
export const scoreGuess = (
  guess: string[],
  solution: string[]
): FormattedGuessMove[] => {
  const unmatched: (string | null)[] = [...solution];
  const yellowCandidates: (string | null)[] = [...solution];

  const scored: FormattedGuessMove[] = guess.map((move) => ({
    move,
    color: 'grey',
    pieceColor: 'regular',
  }));

  scored.forEach((tile, i) => {
    if (unmatched[i] === guess[i]) {
      tile.color = 'green';
      unmatched[i] = null;
      yellowCandidates[i] = null;
    }
  });

  scored.forEach((tile, i) => {
    const move = guess[i];
    if (tile.color !== 'green' && yellowCandidates.includes(move)) {
      tile.color = 'yellow';
      yellowCandidates[yellowCandidates.indexOf(move)] = null;
    }

    const expected = unmatched[i];
    if (tile.color !== 'green' && expected !== null && samePieceType(expected, move)) {
      tile.pieceColor = 'blue';
    }
  });

  return scored;
};

// One character per tile, used for the local result history.
export type TileCode = 'g' | 'y' | 'd' | 'b' | 'x';

export const tileCode = (tile: FormattedGuessMove): TileCode => {
  if (tile.color === 'green') return 'g';
  if (tile.color === 'yellow') return tile.pieceColor === 'blue' ? 'd' : 'y';
  return tile.pieceColor === 'blue' ? 'b' : 'x';
};

export const rowCodes = (rows: FormattedGuessRow[]) =>
  rows
    .filter((row) => row[0])
    .map((row) =>
      row.map((tile) => (tile ? tileCode(tile) : 'x')).join('')
    );

// Single code points only: flag sequences such as 🇺🇦 render as two letters on
// Windows. Yellow+blue is shared as yellow, the stronger signal.
const SHARE_EMOJI: Record<TileCode, string> = {
  g: '\u{1F7E9}',
  y: '\u{1F7E8}',
  d: '\u{1F7E8}',
  b: '\u{1F7E6}',
  x: '⬜',
};

export const shareText = ({
  id,
  rows,
  turns,
  solved,
  isDaily,
}: {
  id: number;
  rows: FormattedGuessRow[];
  turns: number;
  solved: boolean;
  isDaily: boolean;
}) => {
  const grid = rowCodes(rows)
    .map((codes) => [...codes].map((c) => SHARE_EMOJI[c as TileCode]).join(''))
    .join('\n');
  const url = isDaily
    ? 'https://www.chessguessr.com'
    : `https://www.chessguessr.com/games/${id}`;

  return `Chessguessr #${id} ${solved ? turns : 'X'}/5\n\n${grid}\n\n${url}`;
};
