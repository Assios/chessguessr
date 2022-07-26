# [Chessguessr](https://chessguessr.com)

Chessguessr is a game where you try to guess the next moves in a chessgame. All positions are currently taken from games played on [Lichess](https://lichess.org).

![](https://user-images.githubusercontent.com/1413265/181054468-38682e2f-837f-4ca2-94c0-f270bdc14488.png)

## Rules

Like Wordle, or Chessle, you are given hints after each guess.

- 🟩 indicates that the move is correct.
- 🟨 indicates that the move is correct, but in the wrong place.
- 🟥 indicates that the correct piece type was moved (but not necessarily the exact same piece).
- ⬜ indicates that the move is wrong.

## Development

Chessguessr is built with [Remix](https://remix.run/), Typescript, Tailwind, Firebase (for keeping track of puzzle stats).
