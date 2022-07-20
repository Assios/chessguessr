import { useState, useEffect } from "react";
import { arraysEqual } from "../utils/utils";
import * as ChessJS from "chess.js";
import { Square } from "react-chessboard";
import toast from "react-hot-toast";
import { useLocalStorage } from "./useLocalStorage";
import { Game } from "~/utils/types";
import { incrementFailed, incrementSolved } from "../firebase/utils";

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SOLVED = "SOLVED",
  FAILED = "FAILED",
}

const chessCols = "abcdefgh";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const useChessguessr = (game: Game) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [guesses, setGuesses] = useState([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);

  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.IN_PROGRESS
  );

  const [position, setPosition] = useState(null);
  const [fenHistory, setFenHistory] = useState([]);
  const [insufficientMoves, setInsufficientMoves] = useState(false);
  const [colorToPlay, setColorToPlay] = useState("white");

  const [gameState, setGameState] = useLocalStorage("cg-state", {
    guesses: guesses,
    turn: turn,
    gameStatus: gameStatus,
    date: game.date,
  });

  const [playerStats, setPlayerStats] = useLocalStorage("cg-stats", {
    gamesPlayed: 0,
    currentStreak: 1,
    lastPlayed: null,
    guesses: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      failed: 0,
    },
  });

  useEffect(() => {
    if (gameState.turn > 0 && gameState.date === game.date) {
      setGuesses(gameState.guesses);
      setTurn(gameState.turn);
      setGameStatus(gameState.gameStatus);
    } else {
      setGameState({
        guesses: guesses,
        turn: turn,
        gameStatus: gameStatus,
        date: game.date,
      });
    }
  }, []);

  useEffect(() => {
    if (game) {
      const pos = new Chess(game.fen);
      setPosition(pos);
      setColorToPlay(pos.turn());
    }
  }, [game]);

  const updateChessBoard = (modify: any) => {
    setPosition((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  };

  const formatGuess = () => {
    let solutionArray = [...game.solution];
    let discardYellowArray = [...game.solution];

    let formattedGuess = [...currentGuess].map((move) => {
      return { move: move, color: "grey", pieceColor: "regular" };
    });

    formattedGuess.forEach((move, i) => {
      if (solutionArray[i] === move.move) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
        discardYellowArray[i] = null;
      }
    });

    formattedGuess.forEach((move, i) => {
      if (discardYellowArray.includes(move.move) && move.color !== "green") {
        formattedGuess[i].color = "yellow";
      }

      if (
        move.color !== "green" &&
        (solutionArray[i][0] === move.move[0] ||
          (chessCols.includes(solutionArray[i][0]) &&
            chessCols.includes(move.move[0])))
      ) {
        formattedGuess[i].pieceColor = "red";
      }

      discardYellowArray[solutionArray.indexOf(move.move)] = null;
    });

    return formattedGuess;
  };

  const addGuess = (formattedGuess: any) => {
    const newGuesses = [...guesses];
    const newTurn = turn + 1;
    const solved = arraysEqual(currentGuess, game.solution);
    let currentGameStatus = GameStatus.IN_PROGRESS;
    let streak = false;

    if (newTurn === 5 && !solved) {
      currentGameStatus = GameStatus.FAILED;

      setPlayerStats((prev) => {
        return {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          lastPlayed: game.date,
          currentStreak: 0,
          guesses: {
            ...prev.guesses,
            failed: prev.guesses.failed + 1,
          },
        };
      });

      incrementFailed(game.id);
    }

    newGuesses[turn] = formattedGuess;

    setGuesses(newGuesses);
    setTurn(newTurn);
    setGameStatus(currentGameStatus);

    if (solved) {
      setGameStatus(GameStatus.SOLVED);
      currentGameStatus = GameStatus.SOLVED;

      if (
        playerStats.lastPlayed &&
        Date.parse(game.date) - Date.parse(playerStats.lastPlayed) === 86400000
      ) {
        streak = true;
      }

      setPlayerStats((prev) => {
        return {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          lastPlayed: game.date,
          currentStreak: streak ? prev.currentStreak + 1 : 1,
          guesses: {
            ...prev.guesses,
            [turn + 1]: prev.guesses[turn + 1] + 1,
          },
        };
      });

      incrementSolved(game.id, turn + 1);
    } else {
      setPosition(new Chess(game.fen));
    }

    setGameState((prev) => {
      return {
        ...prev,
        guesses: newGuesses,
        turn: newTurn,
        gameStatus: currentGameStatus,
      };
    });

    setCurrentGuess([]);
    setFenHistory([]);
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    let move = null;

    updateChessBoard((game: any) => {
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
      setPosition(new Chess(game.fen));
    } else {
      setPosition(new Chess(fenHistory[fenHistory.length - 2]));
    }

    setCurrentGuess((prev) => prev.filter((_, i) => i !== prev.length - 1));

    setFenHistory((prev) => prev.filter((_, i) => i !== prev.length - 1));
  };

  const submitGuess = () => {
    if (turn > 5 || gameStatus !== GameStatus.IN_PROGRESS) {
      toast.error("Game over.", { duration: 2000 });

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
    onDrop,
    position,
    takeback,
    submitGuess,
    insufficientMoves,
    playerStats,
    gameStatus,
    colorToPlay,
  };
};

export default useChessguessr;
