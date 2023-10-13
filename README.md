# [Chessguessr](https://chessguessr.com)

[![Twitter](https://img.shields.io/twitter/follow/chessguessr?style=social)](https://twitter.com/chessguessr)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![](https://github.com/lukasb1b/chessguessr/blob/picture/public/chessguessr.PNG)

Chessguessr is a game where you try to guess the next moves in a chessgame. All positions are currently taken from games played on [Lichess](https://lichess.org).

## Rules

Like Wordle, or Chessle, you are given hints after each guess.

- 🟩 indicates that the move is correct.
- 🟨 indicates that the move is correct, but in the wrong place.
- 🟥 indicates that the correct piece type was moved (but not necessarily the exact same piece).
- ⬜ indicates that the move is wrong.

## Development

Chessguessr is built with [Remix](https://remix.run/), Typescript, Tailwind, Firebase (for keeping track of puzzle stats).

## REST API

### Get the daily Chessguessr puzzle

#### Request

`GET https://chessguessr.com/api/daily`

#### Response

The API returns a JSON object with the following properties:

- `date`: The date of the puzzle, in the format "YYYY-MM-DD".
- `fen`: The chess position in FEN format.
- `solution`: An array of moves that represents the solution to the puzzle.
- `id`: The unique ID of the puzzle.
- `boardImage`: an image of the chess board with the puzzle position.
- `players`: An array of objects representing the white and black players in the game. Each player object has the following properties:
    - `color`: The color of the player ("white" or "black").
    - `name`: The name of the player.
    - `rating`: The rating of the player.
    - `title`: The chess title of the player, if any (e.g. "GM" or "WIM").
