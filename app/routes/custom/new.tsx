import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const getIdFromUrl = (url: string): string | null => {
  if (!url.includes("lichess.org")) {
    return null;
  }

  const parts = url.split("/");

  let lastPart = parts[parts.length - 1];

  if (lastPart.includes("#")) {
    lastPart = lastPart.split("#")[0];
  }

  if (["white", "black"].includes(lastPart)) {
    return parts[parts.length - 2];
  }

  if (lastPart.length === 12) {
    return lastPart.substring(0, 8);
  } else if (lastPart.length === 8) return lastPart;

  return null;
};

/*
Test: https://lichess.org/y7KR7XTq
move#: 24
*/

export async function action({ request }) {
  const body = await request.formData();
  const lichessUrl = body.get("lichess-game");
  const moveNumber = parseInt(body.get("move-number"), 10);

  const lichessId = getIdFromUrl(lichessUrl);

  if (!lichessId) return;

  const res = await fetch(`https://lichess.org/game/export/${lichessId}`, {
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

  return (
    <div className="mt-10">
      <div className="space-y-4 text-center mb-10">
        <h1 className="font-bold text-3xl xl:text-4xl">
          Create your own{" "}
          <span className="text-primary">Chessguessr puzzle</span>
        </h1>
        <p className="text-gray-500 text-xl max-w-xl leading-relaxed sm:mx-auto">
          Submit your own Lichess game and get a Chessguessr url you can send
          your frends.
        </p>
      </div>

      <div className="flex justify-center">
        <Form method="post" className="flex flex-col block">
          <div className="form-control w-full max-w-xs">
            <label htmlFor="lichess-game" className="label">
              <span className="label-text">Lichess URL</span>
            </label>

            <input
              className="input input-bordered w-full max-w-xs"
              type="text"
              name="lichess-game"
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label htmlFor="move-number" className="label">
              <span className="label-text">Move number to start from</span>
            </label>

            <input
              className="input input-bordered w-full max-w-xs"
              type="text"
              name="move-number"
            />
          </div>

          <div className="form-control w-full max-w-xs mt-6">
            <button className="btn btn-primary" type="submit">
              Get position
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default index;
