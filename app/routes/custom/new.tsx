import React, { useRef, useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { Chessboard } from "react-chessboard";
import { useWindowSize } from "~/hooks/useWindowSize";
import styled from "styled-components";
import { Tile } from "~/styles/styles";
import { getPosition } from "~/models/game.server";
import { doc, addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { numberToLetters } from "~/utils/utils";

const FormContent = styled.div``;

const BoardContent = styled.div``;

const TutorialVariation = styled.div`
  display: flex;

  justify-content: center;

  flex-direction: row;
  margin-top: 0.5rem;
`;

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;

  touch-action: manipulation;
`;

export async function action({ request }) {
  const body = await request.formData();
  const intent = body.get("intent");

  if (intent === "get-position") {
    const data = await getPosition(body);

    return json(data);
  }

  return null;
}

const index = () => {
  const size = useWindowSize();
  const data = useActionData();
  const [addedGame, setAddedGame] = useState<string>("");
  const [moveNumberInput, setMoveNumberInput] = useState("");
  const [moveNumber, setMoveNumber] = useState("");

  const getBoardWidth = () => {
    let width = 327;

    if (size.width < 451) width = 310;

    return width;
  };

  const uploadGame = async (e) => {
    e.preventDefault();
    setAddedGame("");

    const gameId = data?.game?.id + numberToLetters(parseInt(moveNumber, 10));

    await setDoc(doc(db, "games", gameId), {
      white: data?.game?.players?.white?.user?.name,
      black: data?.game?.players?.black?.user?.name,
      whiteRating: data?.game?.players?.white?.rating,
      blackRating: data?.game?.players?.black?.rating,
      fen: data.fen,
      gameUrl: "jifow",
      solution: data.solution,
    })
      .then(() => {
        setAddedGame(gameId);
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <Form method="post" className="flex flex-row justify-between">
      <div className="flex flex-row">
        <FormContent className="mt-10 lg:ml-16 sm:w-auto lg:w-[659px]">
          <div className="space-y-4 mb-10">
            <h1 className="font-bold text-3xl xl:text-4xl">
              Create your own{" "}
              <span className="text-primary">Chessguessr puzzle</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-xl leading-relaxed">
              Submit your own Lichess game and get a Chessguessr url.
            </p>
          </div>
          <div>
            <div className="form-control w-full max-w-xs flex flex-col block">
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
                value={moveNumberInput}
                onChange={(e) => {
                  setMoveNumberInput(e.target.value);
                }}
              />
            </div>

            <div className="form-control w-full max-w-xs mt-6">
              <button
                className="btn btn-primary"
                type="submit"
                name="intent"
                value="get-position"
                onClick={() => {
                  setMoveNumber(moveNumberInput);
                }}
              >
                Get position
              </button>
            </div>
          </div>
        </FormContent>
        {data && (
          <BoardContent>
            <div className="mt-10">
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
              <TutorialVariation>
                {data.solution?.map((move, i) => (
                  <Tile
                    color="green"
                    flipTile={true}
                    animationIndex={i * 0.2}
                    tutorial={true}
                  >
                    {move}
                  </Tile>
                ))}
              </TutorialVariation>
              <p className="sm:text-md mt-6 text-center content-center">
                Click to upload this position:{" "}
                <button className="btn btn-xs" onClick={uploadGame}>
                  Upload
                </button>
              </p>
              {addedGame && (
                <p className="sm:text-md mt-6 text-center content-center">
                  {addedGame} uploaded.
                </p>
              )}
            </div>
          </BoardContent>
        )}
      </div>
    </Form>
  );
};

export default index;
