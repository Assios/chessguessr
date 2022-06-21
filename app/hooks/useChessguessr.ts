import { useState, useEffect } from "react";
import { arraysEqual } from "../utils/utils";
import * as ChessJS from "chess.js";
import { Square } from "react-chessboard";
import toast from "react-hot-toast";
import { useLocalStorage } from "./useLocalStorage";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const useChessguessr = (data: any) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guesses, setGuesses] = useState([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);
  const [history, setHistory] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [position, setPosition] = useState(null);
  const [fenHistory, setFenHistory] = useState([]);
  const [insufficientMoves, setInsufficientMoves] = useState(false);

  const [gameState, setGameState] = useLocalStorage("savestate", {
    guesses: guesses,
    turn: turn,
    history: history,
    correct: correct,
  });

  useEffect(() => {
    if (gameState.turn > 0) {
      setGuesses(gameState.guesses);
      setTurn(gameState.turn);
      setHistory(gameState.history);
      setCorrect(gameState.correct);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setPosition(new Chess(data.fen));
    }
  }, [data]);

  const safeGameMutate = (modify: any) => {
    setPosition((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  };

  const formatGuess = () => {
    let solutionArray = [...data.solution];

    let formattedGuess = [...currentGuess].map((move) => {
      return { key: move, color: "grey" };
    });

    formattedGuess.forEach((move, i) => {
      if (solutionArray[i] === move.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
      }
    });

    formattedGuess.forEach((move, i) => {
      if (solutionArray.includes(move.key) && move.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(move.key)] = null;
      }
    });

    return formattedGuess;
  };

  const addGuess = (formattedGuess: any) => {
    const newGuesses = [...guesses];
    const newTurn = turn + 1;
    const newHistory = [...history, currentGuess];
    const solved = arraysEqual(currentGuess, data.solution);

    newGuesses[turn] = formattedGuess;

    setGuesses(newGuesses);
    setTurn(newTurn);
    setHistory(newHistory);

    if (solved) {
      setCorrect(true);
    } else {
      setPosition(new Chess(data.fen));
    }

    setGameState((prev) => {
      return {
        ...prev,
        guesses: newGuesses,
        turn: newTurn,
        history: newHistory,
        correct: solved,
      };
    });

    setCurrentGuess([]);
    setFenHistory([]);
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    let move = null;

    safeGameMutate((game: any) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    });

    if (move) {
      if (currentGuess.length < 5 && position) {
        setFenHistory((prev): any => [...prev, position.fen()]);
        setCurrentGuess((prev): any => [...prev, move.san]);
      }

      return true;
    }

    return false;
  };

  const takeback = () => {
    if (currentGuess.length < 1) {
      toast.error("Nothing to undo.", { duration: 2000 });
      return;
    }

    if (fenHistory.length < 2) {
      setPosition(new Chess(data.fen));
    } else {
      setPosition(new Chess(fenHistory[fenHistory.length - 2]));
    }

    setCurrentGuess((prev) => prev.filter((_, i) => i !== prev.length - 1));

    setFenHistory((prev) => prev.filter((_, i) => i !== prev.length - 1));
  };

  const submitGuess = () => {
    if (turn > 5) {
      console.log("Too many guesses");
      return;
    }

    if (history.includes(currentGuess)) {
      console.log("Already guessed");
      return;
    }

    if (currentGuess.length !== 5) {
      console.log("Need 5 moves");
      setInsufficientMoves(true);
      toast.error("5 moves needed.", { duration: 2000 });

      setTimeout(
        function () {
          setInsufficientMoves(false);
        }.bind(this),
        1000
      );

      return;
    }

    const formatted = formatGuess();

    addGuess(formatted);
  };

  return {
    turn,
    currentGuess,
    guesses,
    correct,
    onDrop,
    position,
    takeback,
    submitGuess,
    insufficientMoves,
  };
};

export default useChessguessr;
