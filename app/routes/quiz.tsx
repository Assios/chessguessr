import { Chessboard } from "react-chessboard";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getQuiz } from "~/models/quiz.server";
import { useQuiz, GameStatus } from "../hooks/useQuiz";
import { useEffect } from "react";
import QuizModal from "~/components/Modal/QuizModal";
import QuizStep from "~/components/QuizStep";

export const loader: LoaderFunction = async () => {
  const games = await getQuiz();
  return json({ games });
};

const Quiz = () => {
  const { games } = useLoaderData();

  const game = games[0];

  const {
    currentRound,
    gameStatus,
    score,
    selectedOption,
    isOptionCorrect,
    roundStatus,
    checkAnswer,
    isTransitioning,
    flash,
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
      {showModal && (
        <QuizModal setShowModal={setShowModal} score={score} games={games} />
      )}
      <QuizStep roundStatus={roundStatus} currentRound={currentRound} />
      {gameStatus !== GameStatus.COMPLETED ? (
        <>
          <div className={`flex justify-center mt-10 relative`}>
            <Chessboard
              arePiecesDraggable={false}
              position={
                isTransitioning
                  ? "8/8/8/8/8/8/8/8 w - - 0 1"
                  : game.rounds[currentRound].fen
              }
              areArrowsAllowed={false}
              boardWidth={500}
              boardOrientation={"white"}
            />
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                flash ? "bg-white opacity-100 z-50" : "bg-transparent"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-3xl mx-auto">
            {game.rounds[currentRound].options.map((option, index) => {
              const isCorrectAnswer =
                index === game.rounds[currentRound].correctAnswer;
              const isAnswered = index === selectedOption;
              const isCorrectlyAnswered = isAnswered && isOptionCorrect;
              const isIncorrectlyAnswered = isAnswered && !isOptionCorrect;

              const bgColor = isCorrectlyAnswered
                ? "bg-green-400"
                : isCorrectAnswer && isOptionCorrect !== null
                ? "bg-green-400"
                : isIncorrectlyAnswered
                ? "bg-red-400"
                : "bg-primary";

              const textColor = "text-white";

              return (
                <button
                  key={index}
                  className={`relative ${bgColor} ${textColor} font-bold py-4 px-4 rounded transition-colors duration-1000`}
                  onClick={() => checkAnswer(index)}
                >
                  <div
                    className={`absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200`}
                  ></div>
                  {option}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Quiz;
