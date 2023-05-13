import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

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

  const [quizStats, setQuizStats] = useLocalStorage("quiz-stats", {
    scores: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

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

    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setIsOptionCorrect(true);
      setScore(newScore);
    } else {
      setIsOptionCorrect(false);
    }

    setTimeout(() => {
      if (currentRound < game.rounds.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setGameStatus(GameStatus.COMPLETED);
        setQuizStats((prevStats) => {
          const newScores = { ...prevStats.scores };
          newScores[newScore] = (newScores[newScore] || 0) + 1;
          return { ...prevStats, scores: newScores };
        });
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
    quizStats,
  };
};
