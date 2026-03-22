import { Chessguessr } from '../components/Chessguessr';
import {
  data,
  redirect,
  useLoaderData,
  useOutletContext,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import type { MetaFunction, LoaderFunctionArgs } from 'react-router';
import { useEffect } from 'react';
import { OutletContextType } from '~/utils/types';
import { convexClient } from '~/convex.server';
import { api } from '../../convex/_generated/api';
import { toGameType } from '~/utils/convex-helpers';

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  if (!loaderData?.game) {
    return [{ title: 'Chessguessr' }];
  }

  const fen = loaderData.game.fen.split(' ')[0];
  const imageUrl =
    'https://images.weserv.nl/?url=fen-to-image.com/image/36/' + fen;

  const players = loaderData.game.white + ' vs. ' + loaderData.game.black;
  return [
    { title: `Chessguessr – ${players}` },
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:image', content: imageUrl },
  ];
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="mt-10 mb-20 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl mb-8 font-semibold">
            {error.status}
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          {error.statusText}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 mb-20 content-center lg:mb-0">
      <div className="flex flex-row justify-center">
        <h1 className="text-center text-4xl mb-8 font-semibold">Error</h1>
      </div>
      <p className="max-w-prose m-auto text-center text-lg">
        Something went wrong.
      </p>
    </div>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const dates = url.searchParams.get('dates');
  const d = new Date().toISOString().split('T')[0];

  const puzzleId = parseInt(params.slug || '0');
  const puzzle = await convexClient.query(api.functions.getPuzzleById, {
    puzzleId,
  });

  if (!puzzle) {
    throw data(
      `Game with ID ${params.slug} could not be found. Are you sure this is the correct URL?`,
      { status: 404 }
    );
  }

  if (puzzle.date === d) {
    throw redirect('/');
  } else if (puzzle.date > d && dates !== 'all') {
    throw data(
      `Game with ID ${params.slug} could not be found. Are you sure this is the correct URL?`,
      { status: 404 }
    );
  }

  return { game: toGameType(puzzle) };
}

export default function GameSlug() {
  const { game } = useLoaderData<typeof loader>();

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
    <div className="mt-10 mb-20 lg:mb-0">
      {game && (
        <Chessguessr
          showModal={showModal}
          setShowModal={setShowModal}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
          game={game}
          stats={undefined}
          shouldUpdateStats={false}
        />
      )}
    </div>
  );
}
