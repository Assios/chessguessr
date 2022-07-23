import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

/*
Test: https://lichess.org/y7KR7XTq
move#: 24
*/

export async function action({ request }) {
  const body = await request.formData();
  const lichessId = body.get("lichess-game");
  const moveNumber = parseInt(body.get("move-number"), 10);

  const res = await fetch("https://lichess.org/game/export/0GPeQ9Gs", {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  });

  const data = await res.json();

  const moves = await data.moves.split(" ");

  const chess = new Chess();

  for (let i = 0; i < moveNumber; i++) {
    chess.move(moves[i]);
  }

  const solution = moves.slice(moveNumber, moveNumber + 5);

  return json({ game: data, solution, fen: chess.fen() });
}

const index = () => {
  const data = useActionData();

  console.log("d", data);
  return (
    <div>
      <Form method="post">
        <input
          className="block border-2 mb-2"
          type="text"
          name="lichess-game"
        />
        <input className="block border-2" type="number" name="move-number" />
        <button type="submit">Submit game</button>
      </Form>
    </div>
  );
};

export default index;
