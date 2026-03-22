import { useState, useEffect } from "react";
import { arraysEqual, wrongSolution } from "../utils/utils";
import * as ChessJS from "chess.js";
import toast from "react-hot-toast";
import { useLocalStorage } from "./useLocalStorage";
import {
  GameType,
  GameStatus,
  FullFenHistory,
  GuessWithHistory,
  ChessInstance,
  FormattedGuessMove,
  FormattedGuessRow,
  OutletContextType,
  GameState,
  PlayerStats,
} from "~/utils/types";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

function getConvexClient() {
  if (typeof window === "undefined") return null;
  const url = (window as any).__CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}
import { useOutletContext } from "react-router";

const chessCols = "abcdefgh";
const kingMove = "OK";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const useNavigableGuessAndFenHistory = () => {
  const [_currentGuess, _setCurrentGuess] = useState<GuessWithHistory>({
    trueGuess: [],
    cachedNavigableGuess: [],
  });
  const currentGuess = _currentGuess.trueGuess;
  const setCurrentGuess = (updater: (oldTrueGuess: string[]) => string[]) => {
    _setCurrentGuess((oldFullGuess) => {
      // Apply the user-requested update to see what the new true guess is
      const newTrueGuess = updater(oldFullGuess.trueGuess);
      for (let moveIndex = 0; moveIndex < newTrueGuess.length; moveIndex++) {
        const guessedMove = newTrueGuess[moveIndex];
        const cachedMove = oldFullGuess.cachedNavigableGuess[moveIndex];
        if (guessedMove !== cachedMove) {
          // Player has played a different move than what we had in the cache
          // We wipe the future history, since "going forwards" from here doesn't make sense now
          return {
            trueGuess: newTrueGuess,
            cachedNavigableGuess: [...newTrueGuess],
          };
        }
      }
      // If we made it here, no moves in the new true history are different from the cache
      // We return the same navigable cache so the player can "go forwards"
      return {
        trueGuess: newTrueGuess,
        cachedNavigableGuess: [...oldFullGuess.cachedNavigableGuess],
      };
    });
  };

  const [_fenHistory, _setFenHistory] = useState<FullFenHistory>({
    trueFenHistory: [],
    cachedNavigableHistory: [],
  });
  const fenHistory = _fenHistory.trueFenHistory;
  const setFenHistory = (
    updater: (oldTrueFenHistory: string[]) => string[]
  ) => {
    _setFenHistory((oldFullFenHistory: FullFenHistory) => {
      // Apply the user-requested update to see what the new true history is
      const newTrueHistory = updater(oldFullFenHistory.trueFenHistory);
      for (let moveIndex = 0; moveIndex < newTrueHistory.length; moveIndex++) {
        const fenPosition = newTrueHistory[moveIndex];
        const cachedPosition =
          oldFullFenHistory.cachedNavigableHistory[moveIndex];
        if (fenPosition !== cachedPosition) {
          // Player has played a different move than what we had in the cache
          // We wipe the future history, since "going forwards" from here doesn't make sense now
          return {
            trueFenHistory: newTrueHistory,
            cachedNavigableHistory: [...newTrueHistory],
          };
        }
      }
      // If we made it here, no moves in the new true history are different from the cache
      // We return the same navigable cache so the player can "go forwards"
      return {
        trueFenHistory: newTrueHistory,
        cachedNavigableHistory: [...oldFullFenHistory.cachedNavigableHistory],
      };
    });
  };

  const nextHistoryStep = () => {
    if (
      _fenHistory.cachedNavigableHistory.length === fenHistory.length ||
      _currentGuess.cachedNavigableGuess.length === currentGuess.length
    ) {
      return undefined;
    } else
      return {
        move: _currentGuess.cachedNavigableGuess[currentGuess.length],
        fen: _fenHistory.cachedNavigableHistory[fenHistory.length],
      };
  };


  return {
    currentGuess,
    setCurrentGuess,
    fenHistory,
    setFenHistory,
    nextHistoryStep,

  };
};

const useChessguessr = (game: GameType, shouldUpdateStats: boolean) => {
  const [turn, setTurn] = useState(0);
  const [guesses, setGuesses] = useState<FormattedGuessRow[]>([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);

  const { trackEvent } = useOutletContext<OutletContextType>();

  const [gameStatus, setGameStatus] = useState<GameStatus>(
    GameStatus.IN_PROGRESS
  );

  const {
    currentGuess,
    setCurrentGuess,
    fenHistory,
    setFenHistory,
    nextHistoryStep,

  } = useNavigableGuessAndFenHistory();
  const [position, setPosition] = useState<ChessInstance | null>(null);
  const [insufficientMoves, setInsufficientMoves] = useState(false);
  const [colorToPlay, setColorToPlay] = useState("white");

  const [gameState, setGameState, gameStateLoaded] = useLocalStorage<GameState>("cg-state", {
    guesses: guesses,
    turn: turn,
    gameStatus: gameStatus,
    date: game.date,
  });

  const [playerStats, setPlayerStats] = useLocalStorage<PlayerStats>("cg-stats", {
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
    if (!gameStateLoaded || !shouldUpdateStats) return;

    if (
      gameState.turn > 0 &&
      gameState.date === game.date &&
      !wrongSolution(gameState.guesses, gameState.gameStatus, gameState.date)
    ) {
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
  }, [gameStateLoaded]);

  useEffect(() => {
    if (game) {
      const pos = new Chess(game.fen) as unknown as ChessInstance;
      setPosition(pos);
      setColorToPlay(pos.turn());
    }
  }, [game]);

  const formatGuess = () => {
    const solutionArray: (string | null)[] = [...game.solution];
    const discardYellowArray: (string | null)[] = [...game.solution];

    const formattedGuess: FormattedGuessMove[] = [...currentGuess].map((move) => {
      return { move: move, color: "grey" as const, pieceColor: "regular" as const };
    });

    // mark all the green moves
    formattedGuess.forEach((move, i) => {
      if (solutionArray[i] === move.move) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
        discardYellowArray[i] = null;
      }
    });

    // mark all the yellow and blue moves
    formattedGuess.forEach((move, i) => {
       if (
        discardYellowArray.includes(move.move as string) &&
        move.color !== "green"
      ) {
        formattedGuess[i].color = "yellow";
        discardYellowArray[discardYellowArray.indexOf(move.move as string)] = null;
      }

      if (
        move.color !== "green" &&
        solutionArray[i] !== null &&
        ((solutionArray[i] as string)[0] === (move.move as string)[0] ||
          (chessCols.includes((solutionArray[i] as string)[0]) &&
            chessCols.includes((move.move as string)[0])) ||
          (kingMove.includes((solutionArray[i] as string)[0]) &&
            kingMove.includes((move.move as string)[0])))
      ) {
        formattedGuess[i].pieceColor = "blue";
      }
    });

    return formattedGuess;
  };

  const addGuess = (formattedGuess: FormattedGuessMove[]) => {
    const newGuesses = [...guesses];
    const newTurn = turn + 1;
    const solved = arraysEqual(currentGuess, game.solution);
    let currentGameStatus = GameStatus.IN_PROGRESS;
    let streak = false;

    if (newTurn === 5 && !solved) {
      currentGameStatus = GameStatus.FAILED;

      if (shouldUpdateStats) {
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

        getConvexClient()?.mutation(api.functions.incrementFailed, { puzzleId: game.id });
        trackEvent("Submit daily", { props: { result: "Failed" } });
      }
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

      if (shouldUpdateStats) {
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

        getConvexClient()?.mutation(api.functions.incrementSolved, { puzzleId: game.id, turns: turn + 1 });
        trackEvent("Submit daily", { props: { result: "Success" } });
      }
    } else {
      setPosition(new Chess(game.fen) as unknown as ChessInstance);
    }

    if (shouldUpdateStats) {
      setGameState((prev) => {
        return {
          ...prev,
          guesses: newGuesses,
          turn: newTurn,
          gameStatus: currentGameStatus,
        };
      });
    }

    setCurrentGuess(() => []);
    setFenHistory(() => []);
  };

  const onDrop = (
    sourceSquare: string,
    targetSquare: string,
    promotion?: "q" | "r" | "b" | "n"
  ): boolean => {
    if (!position) return false;

    const move = position.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion || "q",
    });

    if (!move) return false;

    const fenAfter = position.fen();
    setPosition(new Chess(fenAfter) as unknown as ChessInstance);

    if (currentGuess.length < 5) {
      setFenHistory((prev) => [...prev, fenAfter]);
      setCurrentGuess((prev) => [...prev, move.san]);
    }

    return true;
  };

  const takeback = () => {
    if (currentGuess.length < 1) {
      toast.error("Nothing to undo.", { duration: 2000 });
      return;
    }

    if (fenHistory.length < 2) {
      setPosition(new Chess(game.fen) as unknown as ChessInstance);
    } else {
      setPosition(new Chess(fenHistory[fenHistory.length - 2]) as unknown as ChessInstance);
    }

    setCurrentGuess((prev) => prev.filter((_, i) => i !== prev.length - 1));

    setFenHistory((prev) => prev.filter((_, i) => i !== prev.length - 1));
  };

  const goForwards = () => {
    const nextStep = nextHistoryStep();
    if (nextStep === undefined) {
      toast.error("No more moves to go forwards.", { duration: 2000 });
      return;
    }
    const { move, fen } = nextStep;
    setPosition(new Chess(fen) as unknown as ChessInstance);
    setCurrentGuess((prev) => [...prev, move]);
    setFenHistory((prev) => [...prev, fen]);
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

      setTimeout(() => {
        setInsufficientMoves(false);
      }, 1000);

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
    goForwards,
    submitGuess,
    insufficientMoves,
    playerStats,
    gameStatus,
    colorToPlay,
    fenHistory,
  };
};

export default useChessguessr;
