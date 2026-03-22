import { useLoaderData, useOutletContext, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import { GameType, OutletContextType } from '~/utils/types';
import { sortBy } from '../utils/sort';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
import TutorialModal from '~/components/TutorialModal';
import { useEffect, useMemo, useState } from 'react';
import { convexClient } from '~/convex.server';
import { api } from '../../convex/_generated/api';
import { toGameType } from '~/utils/convex-helpers';

export const meta: MetaFunction = () => [
  { title: 'Chessguessr Archive – Play through all previous puzzles' },
  {
    name: 'description',
    content:
      'On this page, you can play through all of the previous Chessguessr puzzles at your leisure. Whether you\'re looking to brush up on your chess skills or just enjoy a fun and challenging puzzle, our archive has something for everyone.',
  },
];

export async function loader() {
  const d = new Date().toISOString().split('T')[0];

  const puzzles = await convexClient.query(api.functions.getAllPuzzles, {});

  const games = puzzles.map(toGameType).filter((game) => game.date <= d);

  return { games };
}

export default function GamesIndex() {
  const {
    showTutorial,
    setShowTutorial,
    setTutorial,
    setShowNavbarStats,
  } = useOutletContext<OutletContextType>();

  const { games } = useLoaderData<typeof loader>();

  useEffect(() => {
    setShowNavbarStats(false);
  }, []);

  const gamesSorted = games.sort(sortBy('-date'));

  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const filteredGames = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return gamesSorted;
    return gamesSorted.filter((game: GameType) => {
      const fields = [
        game.white,
        game.black,
        game.wAka,
        game.bAka,
        game.event,
      ];
      return fields.some((f) => f && f.toLowerCase().includes(q));
    });
  }, [gamesSorted, search]);

  const isFiltering = search.trim().length > 0;

  return (
    <div>
      <div>
        <TutorialModal
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
        />
      </div>
      <div className="mt-10 mb-20 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl mb-8 font-semibold">
            Game Archive – Unlimited Chessguessr
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          On this page, you can play through all of the previous Chessguessr
          puzzles at your leisure. Whether you're looking to brush up on your
          chess skills or just enjoy a fun and challenging puzzle, our archive
          has something for everyone. Your stats will only update for today's
          puzzle, though. Play today's Chessguessr{' '}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="/"
          >
            here
          </a>
          . Happy puzzling!
        </p>

        <div className="flex flex-col items-center mt-8 px-4">
          <div className="relative w-full max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by player or event..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
          {isFiltering && (
            <p className="mt-3 text-sm opacity-60">
              {filteredGames.length}{' '}
              {filteredGames.length === 1 ? 'game' : 'games'} found
            </p>
          )}
        </div>

        <div className="p-12 margin-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredGames.map((game: GameType, i: number) => {
            return (
              <div
                key={game.id}
                className="card lg:w-96 border-2 bg-base-100 shadow-xl mb-6"
              >
                <figure>
                  <img
                    src={
                      '//images.weserv.nl/?url=fen-to-image.com/image/36/' +
                      game.fen
                    }
                    alt={`${game.white} vs ${game.black}`}
                  />
                </figure>
                <div className="card-body">
                  {!isFiltering && i === 0 && (
                    <div className="badge badge-accent">TODAY'S</div>
                  )}
                  <h2 className="card-title">
                    {game.white} – {game.black}
                  </h2>
                  <div className="badge badge-primary">
                    {dayjs(game.date).format('MMMM Do, YYYY')}
                  </div>
                  {game.event && (
                    <div className="badge badge-outline text-xs">
                      {game.event}
                    </div>
                  )}
                  <div className="card-actions justify-end">
                    <button
                      className="btn"
                      onClick={() => {
                        navigate(`/games/${game.id}`);
                      }}
                    >
                      Play
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isFiltering && filteredGames.length === 0 && (
          <p className="text-center text-lg opacity-50 -mt-4 mb-12">
            No games match your search.
          </p>
        )}
      </div>
    </div>
  );
}
