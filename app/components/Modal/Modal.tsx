import { Link, useOutletContext } from '@remix-run/react';
import Countdown from 'react-countdown';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { Dialog } from '~/components/Dialog';
import { Tile } from '~/components/Tile';
import StatsCards from './StatsCards';
import Distribution from './Distribution';
import {
  countdownRenderer,
  GameLink,
  midnightUtcTomorrow,
  reloadForNewPuzzle,
} from '~/utils/utils';
import { shareText } from '~/utils/scoring';
import { GameStatus } from '~/utils/types';
import type {
  GameType,
  FormattedGuessRow,
  PlayerStats,
  PuzzleStats,
  OutletContextType,
} from '~/utils/types';

const getSolvedPercentage = (puzzleStats: PuzzleStats | undefined) => {
  if (!puzzleStats?.solved) {
    return null;
  }

  const failed = puzzleStats.failed ?? 0;

  return Math.round((puzzleStats.solved / (puzzleStats.solved + failed)) * 100);
};

const getAverageNumberOfTurns = (puzzleStats: PuzzleStats | undefined) => {
  if (!(puzzleStats?.solved && puzzleStats.solved > 0 && puzzleStats?.turns && puzzleStats.turns > 0)) {
    return null;
  }

  return Math.round((puzzleStats.turns / puzzleStats.solved) * 100) / 100;
};

const GameDetails = ({
  game,
  showEventDetails,
}: {
  game: GameType;
  showEventDetails: boolean;
}) => (
  <p className="mt-6 text-sm leading-relaxed">
    This game was played between {game.white}
    {game.wAka && ` (${game.wAka})`} and {game.black}
    {game.bAka && ` (${game.bAka})`}
    {showEventDetails && game.event && (
      <>
        {' '}
        in the{' '}
        {game.eventUrl ? (
          <a
            className="link"
            href={game.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {game.event}
          </a>
        ) : (
          game.event
        )}
      </>
    )}
    .{' '}
    {game.gameUrl && (
      <>
        Check out the game <GameLink game={game} />.
      </>
    )}
  </p>
);

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  game: GameType;
  guesses: FormattedGuessRow[];
  turn: number;
  playerStats: PlayerStats;
  puzzleStats: PuzzleStats | undefined;
  gameStatus: GameStatus;
  shouldUpdateStats: boolean;
}

export default function Modal({
  showModal,
  setShowModal,
  game,
  guesses,
  turn,
  playerStats,
  puzzleStats,
  gameStatus,
  shouldUpdateStats,
}: ModalProps) {
  const { trackEvent } = useOutletContext<OutletContextType>();
  const [copied, copy] = useCopyToClipboard();

  const isOver = gameStatus !== GameStatus.IN_PROGRESS;
  const solved = gameStatus === GameStatus.SOLVED;
  const solvedPercentage = getSolvedPercentage(puzzleStats);
  const averageNumberOfTurns = getAverageNumberOfTurns(puzzleStats);

  const title = !isOver
    ? 'Statistics'
    : solved
    ? `Solved in ${turn}/5`
    : 'Not this time';

  const share = async () => {
    const text = shareText({
      id: game.id,
      rows: guesses,
      turns: turn,
      solved,
      isDaily: shouldUpdateStats,
    });

    // Phones get the native share sheet; desktops copy to the clipboard.
    const useShareSheet =
      typeof navigator.share === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;

    trackEvent('Click share score', {
      props: { method: useShareSheet ? 'share' : 'copy' },
    });

    if (useShareSheet) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return;
      }
    }

    copy(text);
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      title={title}
      labelId="result-title"
    >
      {!shouldUpdateStats && (
        <p className="mb-4 rounded-lg bg-base-200 px-3 py-2 text-sm">
          This is an archive puzzle, so it won't change your stats.{' '}
          <a className="link" href="/">
            Play today's puzzle
          </a>
          .
        </p>
      )}

      {isOver && (
        <section>
          <p className="mb-1 text-sm font-semibold">Solution</p>
          <div className="flex gap-1.5">
            {game.solution.map((move, i) => (
              <Tile
                color="green"
                flipTile={true}
                animationIndex={i}
                tutorial={true}
                key={`${move}-${i}`}
              >
                {move}
              </Tile>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block normal-case mt-5"
            onClick={share}
          >
            {copied ? 'Copied to clipboard' : 'Share result'}
          </button>

          {solvedPercentage !== null && averageNumberOfTurns !== null && (
            <p className="mt-3 text-sm">
              {solvedPercentage}% solved this puzzle · average{' '}
              {averageNumberOfTurns} tries
            </p>
          )}
          {shouldUpdateStats && (
            <p className="mt-1 text-sm">
              Next puzzle in{' '}
              <span className="font-semibold tabular-nums">
                <Countdown
                  date={midnightUtcTomorrow()}
                  renderer={countdownRenderer}
                  onComplete={reloadForNewPuzzle}
                />
              </span>
            </p>
          )}
        </section>
      )}

      <section className={isOver ? 'mt-6' : ''}>
        <StatsCards playerStats={playerStats} />
        {playerStats?.guesses && (
          <Distribution
            guessDistribution={playerStats.guesses}
            highlight={solved && shouldUpdateStats ? turn : undefined}
          />
        )}
      </section>

      {isOver && <GameDetails game={game} showEventDetails={solved} />}

      <p className="mt-4 text-sm">
        More puzzles in the{' '}
        <Link
          className="link"
          to="/games"
          onClick={() => trackEvent('Click modal archive link')}
        >
          archive
        </Link>
        . Follow{' '}
        <a
          className="link"
          href="https://twitter.com/chessguessr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chessguessr on X
        </a>{' '}
        for updates.
      </p>
    </Dialog>
  );
}
