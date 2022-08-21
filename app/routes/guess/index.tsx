import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { sortBy } from "../../utils/sort";
import dayjs from "dayjs";
import { useNavigate } from "@remix-run/react";
import TutorialModal from "~/components/TutorialModal";
import { useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { getPositions } from "~/models/guessGames.server";

export const meta: MetaFunction = () => ({
  title: "Chessguessr Guess the game",
});

export const loader: LoaderFunction = async () => {
  const games = await getPositions();

  const shuffled = games.sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, 4);

  return json({ games: selected });
};

const index = () => {
  const {
    showTutorial,
    setShowTutorial,
    setTutorial,
    setShowNavbarStats,
  }: any = useOutletContext();

  const { games } = useLoaderData();

  useEffect(() => {
    setShowNavbarStats(false);
  }, []);

  const solution = Math.floor(Math.random() * 3);

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
            Guess the game
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          You'll be shown a positions from famous games. Who played the games?
        </p>

        <div className="mt-10 flex justify-center">
          <Chessboard position={games[solution].fen} />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 mb-10">
          {games.map((game) => {
            return (
              <div className="card w-96 bg-base-100 shadow-xl mb-[-20px]">
                <div className="card-body">
                  <h2 className="card-title">
                    {game.white} – {game.black}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default index;
