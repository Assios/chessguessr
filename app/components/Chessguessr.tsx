import { useEffect, useRef } from 'react';
import useChessguessr from '../hooks/useChessguessr';
import ChessgroundBoard from './ChessgroundBoard';
import { Grid } from './Grid';
import { Row } from './Row';
import Modal from './Modal/Modal';
import { GameStatus } from '~/utils/types';
import type { GameType, PuzzleStats } from '~/utils/types';
import TutorialModal from './TutorialModal';
import Countdown from 'react-countdown';
import {
  countdownRenderer,
  midnightUtcTomorrow,
  GameLink,
  guessifySolution,
  reloadForNewPuzzle,
  useHotkeys,
} from '~/utils/utils';
import useCopyToClipboard from '~/hooks/useCopyToClipboard';

export const Chessguessr = ({
  game,
  stats,
  showModal,
  setShowModal,
  showTutorial,
  setShowTutorial,
  shouldUpdateStats,
}: {
  game: GameType;
  stats?: PuzzleStats;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  shouldUpdateStats: boolean;
}) => {
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
  } = useChessguessr(game, shouldUpdateStats);

  const {
    white,
    black,
    wRating,
    bRating,
    wTitle,
    bTitle,
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

  // On short phones the last rows can sit under the sticky action bar. After
  // a submit (not when a saved game is restored), bring the next row into view;
  // scroll-margin in ui.css keeps it clear of the bar.
  const submitted = useRef(false);
  const submit = () => {
    submitted.current = true;
    submitGuess();
  };

  useEffect(() => {
    if (!submitted.current) return;
    submitted.current = false;
    if (gameStatus !== GameStatus.IN_PROGRESS) return;
    document
      .querySelector('.cg-row-current')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [turn]);

  const [linkValue, copy] = useCopyToClipboard();
  const gameLink = 'https://www.chessguessr.com/games/' + game.id;

  useHotkeys('Backspace', takeback, [currentGuess, fenHistory]);
  useHotkeys('Left', takeback, [currentGuess, fenHistory]);
  useHotkeys('Right', goForwards, [currentGuess, fenHistory]);
  useHotkeys('Enter', submit, [currentGuess]);
  useHotkeys('Space', submit, [currentGuess]);

  return (
    <>
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
      />
      <div className="cg-game">
        <header className="cg-game-header">
          <h1 className="text-sm sm:text-lg lg:text-xl font-semibold text-center leading-snug">
            {wTitle && (
              <span className="text-secondary-content">{wTitle}</span>
            )}{' '}
            {white} {wRating && `(${wRating})`}
            <span className="mx-1">–</span>
            {bTitle && (
              <span className="text-secondary-content">{bTitle}</span>
            )}{' '}
            {black} {bRating && `(${bRating})`}
          </h1>
          <div className="flex justify-between items-center gap-2 mt-1">
            {gameStatus === GameStatus.IN_PROGRESS || !shouldUpdateStats ? (
              <p className="text-sm sm:text-base font-semibold">
                {colorToPlay === 'b' ? 'Black' : 'White'} to play
              </p>
            ) : (
              <p className="text-sm sm:text-base font-semibold">
                New game in{' '}
                <span className="tabular-nums">
                  <Countdown
                    date={midnightUtcTomorrow()}
                    renderer={countdownRenderer}
                    onComplete={reloadForNewPuzzle}
                  />
                </span>
              </p>
            )}
            <div className="flex flex-row items-center gap-1">
              {variant && (
                <span className="badge badge-accent badge-sm sm:badge-md">
                  {variant}
                </span>
              )}
              <span
                className="badge badge-accent badge-sm sm:badge-md"
                title="Event or website where the game was played"
              >
                {event ? event : 'lichess.org'}
              </span>
            </div>
          </div>
        </header>

        <div className="cg-game-board" style={{ touchAction: 'manipulation' }}>
          {position && (
            <ChessgroundBoard
              fen={position.fen()}
              orientation={colorToPlay === 'b' ? 'black' : 'white'}
              draggable={
                currentGuess.length < 5 &&
                gameStatus === GameStatus.IN_PROGRESS
              }
              onDrop={(from, to, promotion) => {
                onDrop(from, to, promotion);
              }}
            />
          )}
        </div>

        <div className="cg-game-guesses">
          {gameStatus === GameStatus.FAILED && (
            <div className="mb-3">
              <div className="flex justify-between items-baseline gap-2 mb-1">
                <p className="font-semibold">Solution</p>
                <span className="text-sm">
                  See game <GameLink game={game} />
                </span>
              </div>
              <Row guess={guessifySolution(game)} />
            </div>
          )}
          <Grid
            currentGuess={currentGuess}
            guesses={guesses}
            turn={turn}
            insufficientMoves={insufficientMoves}
          />
        </div>

        <div
          className="cg-game-actions bg-base-100"
          style={{ touchAction: 'manipulation' }}
        >
          <button
            type="button"
            className="btn btn-accent normal-case gap-1"
            onClick={takeback}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
            Undo
          </button>
          <button
            type="button"
            className="btn btn-primary normal-case"
            onClick={submit}
          >
            Submit
          </button>
        </div>

        <div className="cg-game-link flex flex-row items-center gap-2">
          <input
            type="text"
            aria-label="Link to this puzzle"
            className="input input-bordered h-10 min-w-0 flex-1 text-xs sm:text-sm"
            readOnly={true}
            value={gameLink}
            onFocus={(event) => event.target.select()}
          />
          <button
            type="button"
            className="btn btn-square btn-primary h-10 min-h-0 w-10"
            onClick={() => copy(gameLink)}
            aria-label={linkValue ? 'Copied' : 'Copy link'}
          >
            {linkValue ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
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
                aria-hidden="true"
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
    </>
  );
};
