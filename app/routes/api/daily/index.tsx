import type { LoaderFunction } from "@remix-run/node";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const dailyGame = games.find((game) => {
    return game.date === d;
  });

  if (!dailyGame) {
    throw new Response("No game found for today", { status: 404 });
  }

  const dailyGameWithPlayers = {
    ...dailyGame,
    boardImage:
      "https://images.weserv.nl/?url=fen-to-image.com/image/36/" +
      dailyGame.fen.split(" ")[0],
    players: [
      {
        color: "white",
        name: dailyGame.white,
        rating: dailyGame.wRating,
        title: dailyGame.wTitle || null,
      },
      {
        color: "black",
        name: dailyGame.black,
        rating: dailyGame.bRating,
        title: dailyGame.bTitle || null,
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

  const now = new Date();
  const secondsUntilMidnightUtc = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) -
      now.getTime()) /
      1000
  );
  const sMaxAge = Math.min(3600, secondsUntilMidnightUtc);

  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${Math.min(
        300,
        sMaxAge
      )}, s-maxage=${sMaxAge}`,
    },
  });
};
