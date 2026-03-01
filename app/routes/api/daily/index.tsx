import { json, LoaderFunction } from "@remix-run/node";
import { getGames } from "~/models/game.server";
import { generateFallbackGame } from "~/models/fallback-puzzle.server";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  let dailyGame = games.find((game) => game.date === d);

  if (!dailyGame) {
    dailyGame = (await generateFallbackGame()) ?? undefined;
  }

  if (!dailyGame) {
    throw new Response("No puzzle available for today", { status: 404 });
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

  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
