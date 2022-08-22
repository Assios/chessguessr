import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { sortBy } from "../../utils/sort";
import dayjs from "dayjs";
import { useNavigate } from "@remix-run/react";
import TutorialModal from "~/components/TutorialModal";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { getPositions } from "~/models/guessGames.server";
import useCountdown from "~/hooks/useCountdown";

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

  const [intervalValue, setIntervalValue] = useState<number>(1000);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: intervalValue,
    });

  const { games } = useLoaderData();

  useEffect(() => {
    setShowNavbarStats(false);
  }, []);

  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div>
      <div>
        <TutorialModal
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
        />
      </div>
      <div className="mt-10 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl font-semibold">{count}</h1>
        </div>

        <div className="mt-10 flex justify-center">
          <Chessboard position={games[1].fen} />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 mb-10">
          {games.map((game) => {
            return (
              <div className="card w-96 border-2 bg-base-100 shadow-xl mb-[-20px]">
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
