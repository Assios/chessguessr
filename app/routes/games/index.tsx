import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const previousGames = games.filter((game) => {
    return game.date <= d;
  });

  return json({ games: previousGames });
};

const index = () => {
  const { games } = useLoaderData();

  console.log("g", games);
  return (
    <div>
      {games.map((game) => {
        return <div>{game.date}</div>;
      })}
    </div>
  );
};

export default index;
