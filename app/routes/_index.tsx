import { Chessguessr } from '../components/Chessguessr';
import { data } from 'react-router';
import { useLoaderData, useOutletContext } from 'react-router';
import type { MetaFunction } from 'react-router';
import { useEffect } from 'react';
import type { OutletContextType } from '~/utils/types';
import { convexClient } from '~/convex.server';
import { api } from '../../convex/_generated/api';
import { toGameType, toPuzzleStats } from '~/utils/convex-helpers';

export const meta: MetaFunction = () => [];

export async function loader() {
  const d = new Date().toISOString().split('T')[0];

  const puzzle = await convexClient.query(api.functions.getDailyPuzzle, {
    date: d,
  });

  if (!puzzle) {
    throw data('No game found for today', { status: 404 });
  }

  return { game: toGameType(puzzle), stats: toPuzzleStats(puzzle) };
}

export function ErrorBoundary() {
  return (
    <div className="mt-10 mb-20 content-center lg:mb-0">
      <div className="flex flex-row justify-center">
        <h1 className="text-center text-4xl mb-8 font-semibold">
          No puzzle today (yet!)
        </h1>
      </div>
      <p className="max-w-prose m-auto text-center text-lg">
        It looks like today's puzzle hasn't been added yet. Please{' '}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href="https://lichess.org/inbox/Assios"
          target="_blank"
          rel="noopener noreferrer"
        >
          message Assios on Lichess
        </a>{' '}
        to let me know!
      </p>
      <p className="max-w-prose m-auto text-center text-lg mt-4">
        In the meantime, you can play previous puzzles in the{' '}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href="/games"
        >
          archive
        </a>
        .
      </p>
    </div>
  );
}

export default function Index() {
  const { game, stats } = useLoaderData<typeof loader>();

  const {
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    setTutorial,
    setShowNavbarStats,
  } = useOutletContext<OutletContextType>();

  useEffect(() => {
    setShowNavbarStats(true);
  });

  return (
    <div>
      <div className="mt-10 mb-20 lg:mb-0">
        {game && (
          <Chessguessr
            showModal={showModal}
            setShowModal={setShowModal}
            showTutorial={showTutorial}
            setShowTutorial={setShowTutorial}
            setTutorial={setTutorial}
            game={game}
            stats={stats}
            shouldUpdateStats={true}
          />
        )}
      </div>
    </div>
  );
}
