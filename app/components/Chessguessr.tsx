import { useContext, useEffect } from "react";
import useChessguessr from "../hooks/useChessguessr";
import { Chessboard } from "react-chessboard";
import { Grid } from "./Grid";
import { Row } from "./Row";
import styled from "styled-components";
import Modal from "./Modal/Modal";
import { GameType, GameStatus } from "~/utils/types";
import { useWindowSize } from "~/hooks/useWindowSize";
import TutorialModal from "./TutorialModal";
import Countdown from "react-countdown";
import {
  countdownRenderer,
  midnightUtcTomorrow,
  GameLink,
  guessifySolution,
  useHotkeys,
} from "~/utils/utils";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { AuthContext } from "./AuthProvider/AuthProvider";
import { useOutletContext } from "@remix-run/react";

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 1rem;

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

const SolutionWrapper = styled.div`
  margin-left: 1rem;
  margin-bottom: -1.3rem;

  @media (max-width: 1140px) {
    margin-bottom: 0rem;
  }
`;

export const Chessguessr = ({
  game,
  stats,
  showModal,
  setShowModal,
  showTutorial,
  setShowTutorial,
  setTutorial,
  shouldUpdateStats,
}: {
  game: GameType;
  stats?: any;
  showModal: boolean;
  setShowModal: any;
  showTutorial: boolean;
  setShowTutorial: any;
  setTutorial: any;
  shouldUpdateStats: boolean;
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Component must be wrapped with <AuthProvider>");
  }

  const { user } = authContext;

  const {
    currentGuess,
    onDrop,
    position,
    takeback,
    goForwards,
    submitGuess,
    guesses,
    turn,
    insufficientMoves,
    playerStats,
    gameStatus,
    colorToPlay,
    fenHistory,
  } = useChessguessr(game, shouldUpdateStats, user, stats);

  const size = useWindowSize();

  const {
    white,
    black,
    wRating,
    bRating,
    wTitle,
    bTitle,
    wAka,
    bAka,
    event,
    variant,
  } = game;

  useEffect(() => {
    if (gameStatus !== GameStatus.IN_PROGRESS) {
      setTimeout(function () {
        setShowModal(true);
      }, 1000);
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

  const [linkValue, copy] = useCopyToClipboard();

  const nextDate = midnightUtcTomorrow();

  useHotkeys("Backspace", takeback, [currentGuess, fenHistory]);
  useHotkeys("Left", takeback, [currentGuess, fenHistory]);
  useHotkeys("Right", goForwards, [currentGuess, fenHistory]);
  useHotkeys("Enter", submitGuess, [currentGuess]);
  useHotkeys("Space", submitGuess, [currentGuess]);

  const { trackEvent }: any = useOutletContext();

  return (
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
          shouldUpdateStats={shouldUpdateStats}
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
            <p className="sm:text-lg lg:text-2xl mb-2 font-semibold text-center">
              {wTitle && (
                <span className="text-secondary-content">{wTitle}</span>
              )}{" "}
              {white} {wRating && `(${wRating})`} –{" "}
              {bTitle && (
                <span className="text-secondary-content">{bTitle}</span>
              )}{" "}
               {black} {bRating && `(${bRating})`}
            </p>
            {position && (
              <div className="flex justify-between">
                {gameStatus === GameStatus.IN_PROGRESS || !shouldUpdateStats ? (
                  <p className="sm:text-lg lg:text-md mb-4 font-semibold">
                    {colorToPlay === "b" ? "Black" : "White"} to play
                  </p>
                ) : (
                  <p className="sm:text-lg lg:text-md mb-4 font-semibold">
                    New game in{" "}
                    <Countdown
                      date={nextDate}
                      zeroPadTime={2}
                      renderer={countdownRenderer}
                    />
                  </p>
                )}
                <div className="flex flex-row">
                  {variant && (
                    <span className="mt-2 mr-1 badge badge-accent">
                      {variant}
                    </span>
                  )}
                  <div
                    className="tooltip hidden md:block"
                    data-tip="Event or website where the game was played"
                  >
                    <span className="mt-2 badge badge-accent">
                      {event ? event : "lichess.org"}
                    </span>
                  </div>
                  <div className="block md:hidden">
                    <span className="mt-2 badge badge-accent">
                      {event ? event : "lichess.org"}
                    </span>
                  </div>
                </div>
              </div>
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
                areArrowsAllowed={true}
                boardWidth={getBoardWidth()}
                boardOrientation={colorToPlay === "b" ? "black" : "white"}
                customArrowColor={"rgba(98, 155, 35, 0.9)"}
              />
            )}
          </ChessboardWrapper>
          <Buttons>
            <button
              className="py-2 px-4 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-focus focus:outline-none focus:ring-opacity-75 mr-2 mb-4"
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

            <button
              className="py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-opacity-75 ml-2 mb-4"
              onClick={submitGuess}
            >
              Submit
            </button>
          </Buttons>
        </BoardWrapper>
        <div className="flex flex-col">
          {gameStatus === GameStatus.FAILED && (
            <>
              <SolutionWrapper className="flex flex-col justify-end pl-3 border-b-5 border-b-zinc-500">
                <div className="flex flex-row justify-between">
                  <p className="sm:text-lg lg:text-2xl mb-3 font-semibold">
                    Game over! Solution:
                  </p>
                  <span>
                    See game <GameLink game={game} />
                  </span>
                </div>
                <div className="flex flex-row mt-1">
                  <Row guess={guessifySolution(game)} />
                </div>
              </SolutionWrapper>
            </>
          )}
          <Grid
            currentGuess={currentGuess}
            guesses={guesses}
            turn={turn}
            insufficientMoves={insufficientMoves}
          />
          <div className="flex mb-4 flex-row justify-end">
            <input
              type="text"
              className="input input-bordered input-sm w-full max-w-xs mt-2 mr-1 w-56"
              readOnly={true}
              value={"https://chessguessr.com/games/" + game.id}
              onFocus={(event) => event.target.select()}
            />
            <button
              className="btn btn-square btn-sm bg-primary border-primary mt-2"
              onClick={() => copy("https://chessguessr.com/games/" + game.id)}
            >
              {linkValue ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Game>
    </div>
  );
};
