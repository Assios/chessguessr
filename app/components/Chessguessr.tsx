import { useEffect } from 'react';
import useChessguessr from '../hooks/useChessguessr';
import ChessgroundBoard from './ChessgroundBoard';
import { Grid } from './Grid';
import { Row } from './Row';
import Modal from './Modal/Modal';
import { GameType, GameStatus } from '~/utils/types';
import { useWindowSize } from '~/hooks/useWindowSize';
import TutorialModal from './TutorialModal';
import Countdown from 'react-countdown';
import {
  countdownRenderer,
  midnightUtcTomorrow,
  GameLink,
  guessifySolution,
  useHotkeys,
} from '~/utils/utils';
import useCopyToClipboard from '~/hooks/useCopyToClipboard';
import { useOutletContext } from '@remix-run/react';

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

  const size = useWindowSize();

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

  const getBoardWidth = () => {
    let width = 560;

    if (size.width < 581) width = 370;
    if (size.width < 451) width = 310;

    return width;
  };

  const [linkValue, copy] = useCopyToClipboard();

  const nextDate = midnightUtcTomorrow();

  useHotkeys('Backspace', takeback, [currentGuess, fenHistory]);
  useHotkeys('Left', takeback, [currentGuess, fenHistory]);
  useHotkeys('Right', goForwards, [currentGuess, fenHistory]);
  useHotkeys('Enter', submitGuess, [currentGuess]);
  useHotkeys('Space', submitGuess, [currentGuess]);

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
      <div className="flex justify-center flex-wrap">
        <div>
          <div className="flex flex-col justify-center px-2 sm:px-0">
            <p className="text-sm sm:text-lg lg:text-2xl mb-2 font-semibold text-center leading-relaxed">
              {wTitle && (
                <span className="text-secondary-content">{wTitle}</span>
              )}{' '}
              {white} {wRating && `(${wRating})`}
              <span className="mx-1">–</span>
              {bTitle && (
                <span className="text-secondary-content">{bTitle}</span>
              )}{' '}
              {black} {bRating && `(${bRating})`}
            </p>
            {position && (
              <div className="flex justify-between items-center mb-4">
                {gameStatus === GameStatus.IN_PROGRESS || !shouldUpdateStats ? (
                  <p className="text-sm sm:text-lg font-semibold">
                    {colorToPlay === 'b' ? 'Black' : 'White'} to play
                  </p>
                ) : (
                  <p className="text-sm sm:text-lg font-semibold">
                    New game in{' '}
                    <Countdown
                      date={nextDate}
                      zeroPadTime={2}
                      renderer={countdownRenderer}
                    />
                  </p>
                )}
                <div className="flex flex-row items-center gap-1">
                  {variant && (
                    <span className="badge badge-accent badge-sm sm:badge-md">
                      {variant}
                    </span>
                  )}
                  <div
                    className="tooltip tooltip-left"
                    data-tip="Event or website where the game was played"
                  >
                    <span className="badge badge-accent badge-sm sm:badge-md">
                      {event ? event : 'lichess.org'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="flex justify-center mb-4"
            style={{ touchAction: 'manipulation' }}
          >
            {position && (
              <ChessgroundBoard
                fen={position.fen()}
                orientation={colorToPlay === 'b' ? 'black' : 'white'}
                width={getBoardWidth()}
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
          <div
            className="flex justify-center gap-2 sm:gap-4 px-2 sm:px-0"
            style={{ touchAction: 'manipulation' }}
          >
            <button
              className="py-2 px-3 sm:px-4 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-focus focus:outline-none focus:ring-opacity-75 mb-4 text-sm sm:text-base flex items-center"
              onClick={takeback}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
              <span className="hidden sm:inline">Undo last move</span>
              <span className="sm:hidden">Undo</span>
            </button>

            <button
              className="py-2 px-4 sm:px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-opacity-75 mb-4 text-sm sm:text-base"
              onClick={submitGuess}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex flex-col px-2 sm:px-0">
          {gameStatus === GameStatus.FAILED && (
            <div className="ml-0 sm:ml-4 mb-4 lg:mb-0 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                <p className="text-base sm:text-lg lg:text-2xl font-semibold">
                  Game over! Solution:
                </p>
                <span className="text-sm sm:text-base">
                  See game <GameLink game={game} />
                </span>
              </div>
              <div className="flex flex-row">
                <Row guess={guessifySolution(game)} />
              </div>
            </div>
          )}
          <Grid
            currentGuess={currentGuess}
            guesses={guesses}
            turn={turn}
            insufficientMoves={insufficientMoves}
          />
          <div className="flex mb-4 flex-row justify-end items-center gap-1 mt-2">
            <input
              type="text"
              className="input input-bordered input-sm w-44 sm:w-56 text-xs sm:text-sm"
              readOnly={true}
              value={'https://chessguessr.com/games/' + game.id}
              onFocus={(event) => event.target.select()}
            />
            <button
              className="btn btn-square btn-sm bg-primary border-primary"
              onClick={() => copy('https://chessguessr.com/games/' + game.id)}
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
      </div>
    </div>
  );
};
