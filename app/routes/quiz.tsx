import { Chessboard } from "react-chessboard";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getPlayerGuessGames } from "~/models/playerGuess.server";
import { useQuiz, GameStatus } from "../hooks/useQuiz";
import { useEffect } from "react";
import QuizModal from "~/components/Modal/QuizModal";
import { CheckIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/utils/utils";

export const loader: LoaderFunction = async () => {
  const games = await getPlayerGuessGames();
  return json({ games });
};

const Quiz = () => {
  const { games } = useLoaderData();

  const game = games[0];

  const {
    currentGame,
    currentRound,
    gameStatus,
    score,
    selectedOption,
    isOptionCorrect,
    roundStatus,
    checkAnswer,
  } = useQuiz(game);

  const {
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    setTutorial,
    setShowNavbarStats,
  }: any = useOutletContext();

  useEffect(() => {
    if (gameStatus !== GameStatus.IN_PROGRESS) {
      setTimeout(function () {
        setShowModal(true);
      }, 1000);
    } else {
      setShowModal(false);
    }
  }, [gameStatus]);

  return (
    <div className="m-10">
      {showModal && <QuizModal setShowModal={setShowModal} />}
      <ol role="list" className="flex items-center justify-center">
        {roundStatus.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== roundStatus.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div
                className={`h-0.5 w-full ${
                  stepIdx < currentRound
                    ? "bg-green-600"
                    : stepIdx === currentRound
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              />
            </div>
            {step.status === "complete" ? (
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  step.correct ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                <span className="sr-only">{step.name}</span>
              </div>
            ) : step.status === "current" ? (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-indigo-600"
                  aria-hidden="true"
                />
                <span className="sr-only">{step.name}</span>
              </div>
            ) : (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-transparent"
                  aria-hidden="true"
                />
                <span className="sr-only">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      {gameStatus !== GameStatus.COMPLETED ? (
        <>
          <div className="flex justify-center mt-20">
            <Chessboard
              arePiecesDraggable={false}
              position={game.rounds[currentRound].fen}
              areArrowsAllowed={false}
              boardWidth={400}
              boardOrientation={"white"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10 max-w-7xl mx-auto">
            {game.rounds[currentRound].options.map((option, index) => (
              <button
                key={index}
                className={`relative ${
                  index === selectedOption
                    ? isOptionCorrect
                      ? "bg-green-400 transition-colors duration-1000"
                      : "bg-red-400 transition-colors duration-1000"
                    : "bg-primary"
                } text-white font-bold py-4 px-4 rounded`}
                onClick={() => checkAnswer(index)}
              >
                <div
                  className={`absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200`}
                ></div>
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div
          className="mt-10 text-lg font-bold text-blue
        500"
        >
          You got {score} out of{" "}
          {games.reduce((acc, game) => acc + game.rounds.length, 0)} correct!
        </div>
      )}
    </div>
  );
};

export default Quiz;
