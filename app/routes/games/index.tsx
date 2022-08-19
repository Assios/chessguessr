import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { sortBy } from "../../utils/sort";
import dayjs from "dayjs";

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
      <h1 className="text-center text-4xl mb-8 font-semibold">
        Puzzle history
      </h1>
      <div className="p-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {gamesSorted.map((game) => {
          return (
            <div className="card border-2 bg-base-100 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title">
                  {game.white} – {game.black}
                </h2>
                <div className="badge badge-primary">
                  {dayjs(game.date).format("MMMM D[th], YYYY")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
