import { useState, useEffect } from "react";
import { arraysEqual } from "../utils/utils";
import * as ChessJS from "chess.js";
import { Square } from "react-chessboard";
import toast from "react-hot-toast";
import { useLocalStorage } from "./useLocalStorage";
import {
  GameType,
  GameStatus,
  FullFenHistory,
  GuessWithHistory,
  Guess,
} from "~/utils/types";
import {
  addActivityToFeed,
  getUserFromFirestore,
  hasPlayedDaily,
  incrementFailed,
  incrementSolved,
  updateFirstSolverAndAchievement,
  updateXPAndLevel,
} from "../firebase/utils";
import { useOutletContext } from "@remix-run/react";
import { AppUser } from "~/components/AuthProvider/AuthProvider";
import { usePlayerStats } from "./usePlayerStats";
import { PlayerStats } from "../components/AuthProvider/AuthProvider";

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

const useChessguessr = (
  game: GameType,
  shouldUpdateStats: boolean,
  user: AppUser,
  stats: any
) => {
  const [turn, setTurn] = useState(0);
  const [guesses, setGuesses] = useState([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);

  const firstSolver = stats?.firstSolver;

  const { trackEvent }: any = useOutletContext();

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
  const [position, setPosition] = useState(null);
  const [insufficientMoves, setInsufficientMoves] = useState(false);
  const [colorToPlay, setColorToPlay] = useState("white");

  const [gameState, setGameState] = useLocalStorage("cg-state", {
    guesses: guesses,
    turn: turn,
    gameStatus: gameStatus,
    date: game.date,
  });

  const { playerStats, setPlayerStats } = usePlayerStats(user?.uid);

  useEffect(() => {
    if (!shouldUpdateStats) return;

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
      if (discardYellowArray.includes(move.move) && move.color !== "green") {
        formattedGuess[i].color = "yellow";
        discardYellowArray[discardYellowArray.indexOf(move.move)] = null;
      }

      if (
        move.color !== "green" &&
        (solutionArray[i][0] === move.move[0] ||
          (chessCols.includes(solutionArray[i][0]) &&
            chessCols.includes(move.move[0])) ||
          (kingMove.includes(solutionArray[i][0]) &&
            kingMove.includes(move.move[0])))
      ) {
        formattedGuess[i].pieceColor = "blue";
      }
    });

    return formattedGuess;
  };

  const addGuess = async (formattedGuess: any) => {
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

        const puzzleId = game.id;
        const puzzleUrl = `/games/${puzzleId}`;
        const playedMessage = `Played Chessguessr #${puzzleId}`;

        if (user) {
          const playedDaily = await hasPlayedDaily(user.uid);

          if (!playedDaily) {
            addActivityToFeed(
              user.uid,
              "playedDaily",
              playedMessage,
              game.id,
              puzzleUrl,
              "failed"
            );

            updateXPAndLevel(user.uid, 50);
          }
        } else {
          console.log("This puzzle has already been played");
        }

        incrementFailed(game.id);
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

        const puzzleId = game.id;
        const puzzleUrl = `/games/${puzzleId}`;

        const playedMessage = `Played Chessguessr #${puzzleId}`;

        if (user) {
          const playedDaily = await hasPlayedDaily(user.uid);

          if (!playedDaily) {
            addActivityToFeed(
              user.uid,
              "playedDaily",
              playedMessage,
              game.id,
              puzzleUrl,
              "solved"
            );

            await updateXPAndLevel(user.uid, 50);
            const newLevel = user.progress.level;

            toast.success(
              `You gained 50 XP for solving today's Chessguessr! Your level is now ${newLevel}`,
              {
                duration: 2500,
              }
            );
          }
        } else {
          console.log("This puzzle has already been played");
        }

        if (user && !firstSolver) {
          console.log("first-to-solve");
          updateFirstSolverAndAchievement(
            game.id,
            user.uid,
            user.username,
            "first-to-solve"
          );

          const puzzleId = game.id;
          const puzzleUrl = `/games/${puzzleId}`;
          const message = `First to solve Chessguessr #${puzzleId}`;

          addActivityToFeed(
            user.uid,
            "firstSolver",
            message,
            game.id,
            puzzleUrl
          );

          toast.success(
            "Congrats! You are the first user to solve today's Chessguessr 🥳",
            { duration: 5000 }
          );
        } else {
          console.log("USER", user);
        }

        incrementSolved(game.id, turn + 1);
        trackEvent("Submit daily", { props: { result: "Success" } });
      }
    } else {
      setPosition(new Chess(game.fen));
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

  const goForwards = () => {
    const nextStep = nextHistoryStep();
    if (nextStep === undefined) {
      toast.error("No more moves to go forwards.", { duration: 2000 });
      return;
    }
    const { move, fen } = nextStep;

    setPosition(new Chess(fen));

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
