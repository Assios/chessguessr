import { useState } from "react";

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const useQuiz = (game) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStatus, setGameStatus] = useState(GameStatus.IN_PROGRESS);
  const [score, setScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flash, setFlash] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionCorrect, setIsOptionCorrect] = useState(null);

  const [roundStatus, setRoundStatus] = useState(
    game.rounds.map((game, i) => {
      return {
        name: `Round ${i + 1}`,
        status: i === 0 ? "current" : "upcoming",
        correct: false,
      };
    })
  );

  const checkAnswer = (answerIndex) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setFlash(true);
    setSelectedOption(answerIndex);

    const isCorrect = game.rounds[currentRound].correctAnswer === answerIndex;

    setRoundStatus((prevRoundStatus) =>
      prevRoundStatus.map((round, i) => {
        if (i === currentRound) {
          return { ...round, status: "complete", correct: isCorrect };
        } else if (i === currentRound + 1) {
          return { ...round, status: "current" };
        } else {
          return round;
        }
      })
    );

    if (isCorrect) {
      setIsOptionCorrect(true);
      setScore(score + 1);
    } else {
      setIsOptionCorrect(false);
    }

    setTimeout(() => {
      if (currentRound < game.rounds.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setGameStatus(GameStatus.COMPLETED);
      }

      setSelectedOption(null);
      setIsOptionCorrect(null);
      setIsTransitioning(false);
    }, 500);

    setTimeout(() => {
      setFlash(false);
    }, 700);
  };

  return {
    currentRound,
    gameStatus,
    score,
    selectedOption,
    isOptionCorrect,
    checkAnswer,
    isTransitioning,
    roundStatus,
    flash,
  };
};
