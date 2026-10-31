import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rowCodes, scoreGuess, shareText } from '../app/utils/scoring';
import type { FormattedGuessRow } from '../app/utils/types';

// g = green, y = yellow, d = yellow + blue, b = blue, x = grey
const codes = (guess: string[], solution: string[]) =>
  rowCodes([scoreGuess(guess, solution)])[0];

const solution = ['Rd6', 'Qf7', 'Rxg6+', 'Kf8', 'Rh8+'];

test('exact solution is all green', () => {
  assert.equal(codes(solution, solution), 'ggggg');
});

test('right move in the wrong slot is yellow', () => {
  assert.equal(codes(['Qf7', 'Rd6', 'Rxg6+', 'Kf8', 'Rh8+'], solution), 'yyggg');
});

test('same piece type in the slot is blue, a different piece is grey', () => {
  assert.equal(codes(['Rd5', 'Qf7', 'Rxg6+', 'Kf8', 'Nc3'], solution), 'bgggx');
});

test('a move is marked yellow only as often as it appears in the solution', () => {
  const line = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'];
  assert.equal(codes(['Nf3', 'Nf3', 'e4', 'Nc6', 'Bb5'], line), 'yxygg');
});

test('a green match does not use up a second copy of the move', () => {
  const line = ['Nf3', 'Nc6', 'Nf3', 'd5', 'e4'];
  assert.equal(codes(['d5', 'Nf3', 'Nf3', 'Nc6', 'e4'], line), 'ydgyg');
});

test('any two pawn moves count as the same piece type', () => {
  assert.equal(
    codes(['exd5', 'a6', 'h4', 'g5', 'b4'], ['c4', 'b5', 'g4', 'f6', 'a3']),
    'bbbbb'
  );
});

test('castling counts as a king move', () => {
  assert.equal(
    codes(['O-O', 'Kg8', 'Ke2', 'O-O-O', 'Kh1'], ['Kf1', 'O-O', 'O-O-O', 'Kd7', 'Kg1']),
    'dbbdb'
  );
});

test('promotions and checks must match exactly', () => {
  assert.equal(
    codes(['a1=Q', 'h7', 'Kxh1', 'a1=Q+', 'Kh2'], ['h7', 'Rh1+', 'Kxh1', 'a1=Q+', 'Kh2']),
    'byggg'
  );
});

test('share text uses single code point emoji and the right link', () => {
  const rows: FormattedGuessRow[] = [
    scoreGuess(['Qf7', 'Rd6', 'Rxg6+', 'Kf8', 'Nc3'], solution),
    scoreGuess(solution, solution),
    [null, null, null, null, null],
  ];

  const daily = shareText({ id: 1, rows, turns: 2, solved: true, isDaily: true });
  assert.equal(
    daily,
    'Chessguessr #1 2/5\n\n🟨🟨🟩🟩⬜\n🟩🟩🟩🟩🟩\n\nhttps://www.chessguessr.com'
  );
  assert.doesNotMatch(daily, /\u{1F1FA}/u);

  assert.match(
    shareText({ id: 7, rows, turns: 5, solved: false, isDaily: false }),
    /^Chessguessr #7 X\/5\n[\s\S]*\nhttps:\/\/www\.chessguessr\.com\/games\/7$/
  );
});
