import React, { useState, useEffect } from "react";
import useChessguessr, { GameStatus } from "../hooks/useChessguessr";
import { Chessboard } from "react-chessboard";
import { Grid } from "./Grid";
import styled from "styled-components";
import Modal from "./Modal";
import { Game } from "~/utils/types";
import { useWindowSize } from "~/hooks/useWindowSize";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import TutorialModal from "./TutorialModal";
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

  justify-content: center;
`;

export const Chessguessr = ({ game, stats }: { game: Game; stats?: any }) => {
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
  } = useChessguessr(game);

  const size = useWindowSize();

  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const { white, black, wRating, bRating } = game;

  const [showModal, setShowModal] = useState(false);

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
    <div>
      <div>
        <Modal
          correct={gameStatus === GameStatus.SOLVED}
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
            <p className="sm:text-lg lg:text-2xl mb-4 font-semibold">
              {white} ({wRating}) – {black} ({bRating})
            </p>
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
              />
            )}
          </ChessboardWrapper>
          <Buttons>
            {gameStatus === GameStatus.IN_PROGRESS && (
              <button
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 mr-2"
                onClick={takeback}
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
            )}
            {gameStatus === GameStatus.IN_PROGRESS ? (
              <button
                className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ml-2"
                onClick={submitGuess}
              >
                Submit
              </button>
            ) : (
              <button
                className="py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 ml-2"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Stats
              </button>
            )}
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
  );
};
