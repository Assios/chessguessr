import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as ChessJS from "chess.js";
import { Chessboard } from "react-chessboard";
import { useWindowSize } from "~/hooks/useWindowSize";
import styled from "styled-components";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;

  touch-action: manipulation;
`;

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
  const size = useWindowSize();
  const data = useActionData();

  const getBoardWidth = () => {
    let width = 370;

    if (size.width < 451) width = 310;

    return width;
  };

  console.log("d", data);

  return (
    <div className="mt-10 flex flex-row space-x-24 flex-wrap">
      <div className="lg:ml-16 sm:w-auto lg:w-[659px]">
        <div className="space-y-4 text-center mb-10">
          <h1 className="font-bold text-3xl xl:text-4xl">
            Create your own{" "}
            <span className="text-primary">Chessguessr puzzle</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-xl leading-relaxed sm:mx-auto">
            Submit your own Lichess game and get a Chessguessr url.
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
      {data && (
        <div>
          <div className="flex flex-col justify-center">
            <p className="sm:text-lg lg:text-2xl mb-4 font-semibold text-center">
              {data?.game?.players?.white?.user?.name} (
              {data?.game?.players?.white?.rating}) – {" "}
              {data?.game?.players?.black?.user?.name} (
              {data?.game?.players?.black?.rating})
            </p>
          </div>
          <ChessboardWrapper>
            {data.fen && (
              <Chessboard
                arePiecesDraggable={false}
                position={data.fen}
                areArrowsAllowed={false}
                boardWidth={getBoardWidth()}
                boardOrientation={"white"}
              />
            )}
          </ChessboardWrapper>
        </div>
      )}
    </div>
  );
};

export default index;
