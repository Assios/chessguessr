import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async () => {
  const games = await getGames();

  console.log("gp", games);

  return json({ games: games });
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
