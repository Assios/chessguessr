import { convexClient } from '~/convex.server';
import { api } from '../../convex/_generated/api';
import { toGameType } from '~/utils/convex-helpers';

export async function loader() {
  const d = new Date().toISOString().split('T')[0];

  const puzzle = await convexClient.query(api.functions.getDailyPuzzle, {
    date: d,
  });

  if (!puzzle) {
    throw new Response('No game found for today', { status: 404 });
  }

  const game = toGameType(puzzle);

  const dailyGameWithPlayers = {
    ...game,
    boardImage:
      'https://images.weserv.nl/?url=fen-to-image.com/image/36/' +
      game.fen.split(' ')[0],
    players: [
      {
        color: 'white',
        name: game.white,
        rating: game.wRating,
        title: game.wTitle || null,
      },
      {
        color: 'black',
        name: game.black,
        rating: game.bRating,
        title: game.bTitle || null,
      },
    ],
  };

  const {
    white,
    black,
    wRating,
    bRating,
    wTitle,
    bTitle,
    bAka,
    wAka,
    gameUrl,
    ...response
  } = dailyGameWithPlayers;

  const body = JSON.stringify(response);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control':
        'public, max-age=300, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
