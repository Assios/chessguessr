import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { sortBy } from "../../utils/sort";
import dayjs from "dayjs";
import { useNavigate } from "@remix-run/react";
import TutorialModal from "~/components/TutorialModal";
import { useEffect } from "react";

export const meta: MetaFunction = () => ({
  title: "Chessguessr Archive – Play through all previous puzzles",
  description:
    "On this page, you can play through all of the previous Chessguessr puzzles at your leisure. Whether you're looking to brush up on your chess skills or just enjoy a fun and challenging puzzle, our archive has something for everyone.",
});

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const previousGames = games.filter((game) => {
    return game.date <= d;
  });

  return json({ games: previousGames });
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

  const gamesSorted = games.sort(sortBy("-date"));

  const navigate = useNavigate();

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
            Game Archive – Unlimited Chessguessr
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          On this page, you can play through all of the previous Chessguessr
          puzzles at your leisure. Whether you're looking to brush up on your
          chess skills or just enjoy a fun and challenging puzzle, our archive
          has something for everyone. Your stats will only update for today's
          puzzle, though. Play today's Chessguessr{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="/"
          >
            here
          </a>
          . Happy puzzling!
        </p>

        <div className="p-12 margin-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {gamesSorted.map((game, i) => {
            return (
              <div className="card lg:w-96 border-2 bg-base-100 shadow-xl mb-6">
                <figure>
                  <img
                    src={
                      "//images.weserv.nl/?url=fen-to-image.com/image/36/" +
                      game.fen
                    }
                  />
                </figure>
                <div className="card-body">
                  {i == 0 && <div className="badge badge-accent">TODAY'S</div>}
                  <h2 className="card-title">
                    {game.white} – {game.black}
                  </h2>
                  <div className="badge badge-primary">
                    {dayjs(game.date).format("MMMM D[th], YYYY")}
                  </div>
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
      </div>
    </div>
  );
};

export default index;
