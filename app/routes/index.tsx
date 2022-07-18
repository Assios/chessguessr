import React, { useState, useEffect, useRef } from "react";
import { Chessguessr } from "../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData, useActionData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "~/firebase";
import { getDoc, doc, setDoc, increment } from "firebase/firestore";
import { Navbar } from "~/components/Navbar/Navbar";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useSubmit } from "@remix-run/react";
import useChessguessr, { GameStatus } from "../hooks/useChessguessr";
import { Chessboard } from "react-chessboard";
import { Grid } from "../components/Grid";
import styled from "styled-components";
import Modal from "../components/Modal/Modal";
import { Game } from "~/utils/types";
import { useWindowSize } from "~/hooks/useWindowSize";
import TutorialModal from "../components/TutorialModal";
import { incrementSolved } from "~/firebase/utils";

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;

  touch-action: manipulation;
`;

const Game = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Buttons = styled.div`
  display: flex;

  justify-content: center;

  touch-action: manipulation;
`;

const BoardWrapper = styled.div``;

const Players = styled.div`
  display: flex;

  flex-direction: column;

  justify-content: center;
`;

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const dailyGame = games.find((game) => {
    return game.date === d;
  });

  const docRef = doc(db, "stats", dailyGame.id.toString());
  const docSnap = await getDoc(docRef);

  return json({ game: dailyGame, stats: docSnap.data() });
};

export const action = async ({ formData }) => {
  console.log("SS");
  const d = await formData();
  console.log("d", d.get("gameStatus"));
  console.log("t", d.get("turn"));
  const statsDoc = doc(db, "stats", "1");

  setDoc(
    statsDoc,
    {
      solved: increment(1),
      turns: increment(10),
    },
    { merge: true }
  );

  return null;
};

const StyledIndex = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default function Index() {
  const { game, stats } = useLoaderData();
  const [showModal, setShowModal] = useState(false);
  const submit = useSubmit();

  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const data = useActionData();

  const {
    currentGuess,
    onDrop,
    position,
    takeback,
    submitGuess,
    guesses,
    turn,
    insufficientMoves,
    playerStats,
    gameStatus,
    colorToPlay,
  } = useChessguessr(game);

  const formRef = useRef<HtmlFormElement>(null); //Add a form ref.

  const handleSubmit = (event) => {
    event.preventDefault();

    submitGuess();

    const formData = new FormData(formRef.current);
    formData.set("arbitraryData", "jadda");

    submit(formData);
  };

  const size = useWindowSize();

  const { white, black, wRating, bRating } = game;

  useEffect(() => {
    if (gameStatus !== GameStatus.IN_PROGRESS) {
      setTimeout(function () {
        setShowModal(true);
      }, 1600);
    } else {
      setShowModal(false);
    }
  }, [gameStatus]);

  const getBoardWidth = () => {
    let width = 560;

    if (size.width < 581) width = 370;
    if (size.width < 451) width = 310;

    return width;
  };

  return (
    <StyledIndex>
      <Navbar
        fixed={false}
        setShowTutorial={setShowTutorial}
        setShowModal={setShowModal}
      />
      <div className="mt-20">
        {game && (
          <form method="post" onSubmit={handleSubmit}>
            <input readOnly name="gameStatus" value={gameStatus} />
            <input readOnly name="turn" value={turn} />

            <div>
              <div>
                <Modal
                  gameStatus={gameStatus}
                  game={game}
                  turn={turn}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  guesses={guesses}
                  playerStats={playerStats}
                  puzzleStats={stats}
                />
                <TutorialModal
                  showTutorial={showTutorial}
                  setShowTutorial={setShowTutorial}
                  setTutorial={setTutorial}
                />
              </div>
              <Game>
                <BoardWrapper>
                  <Players>
                    <p className="sm:text-lg lg:text-2xl mb-4 font-semibold text-center">
                      {white} ({wRating}) – {black} ({bRating})
                    </p>
                    {position && (
                      <p className="sm:text-lg lg:text-md mb-4 font-semibold text-center">
                        {colorToPlay === "b" ? "Black" : "White"} to play
                      </p>
                    )}
                  </Players>

                  <ChessboardWrapper>
                    {position && (
                      <Chessboard
                        arePiecesDraggable={
                          currentGuess.length < 5 &&
                          gameStatus === GameStatus.IN_PROGRESS
                        }
                        position={position.fen()}
                        onPieceDrop={onDrop}
                        areArrowsAllowed={false}
                        boardWidth={getBoardWidth()}
                        boardOrientation={
                          colorToPlay === "b" ? "black" : "white"
                        }
                      />
                    )}
                  </ChessboardWrapper>
                  <Buttons>
                    <button
                      className="py-2 px-4 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-focus focus:outline-none focus:ring-opacity-75 mr-2"
                      onClick={takeback}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                      </svg>
                      Undo last move
                    </button>

                    <button
                      className="py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-opacity-75 ml-2"
                      type="submit"
                    >
                      Submit
                    </button>
                  </Buttons>
                </BoardWrapper>
                <Grid
                  currentGuess={currentGuess}
                  guesses={guesses}
                  turn={turn}
                  insufficientMoves={insufficientMoves}
                />
              </Game>
            </div>
          </form>
        )}
      </div>
    </StyledIndex>
  );
}
