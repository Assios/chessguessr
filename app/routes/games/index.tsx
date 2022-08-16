import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { sortBy } from "../../utils/sort";

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

  const gamesSorted = games.sort(sortBy("-date"));

  console.log("g", games);
  return (
    <div className="mt-10 mb-20 content-center lg:mb-0">
      <div className="grid grid-cols-4">
        {gamesSorted.map((game) => {
          return (
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {game.white} – {game.black}
                </h2>
                <p>{game.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
