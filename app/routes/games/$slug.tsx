import { Chessguessr } from "../../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async ({ params }) => {
  const games = await getGames();

  const index = parseInt(params.slug) - 1;

  return json({ game: games[index] });
};

export default function Index() {
  const { game, stats } = useLoaderData();

  const {
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    setTutorial,
  }: any = useOutletContext();

  return (
    <div className="mt-10">
      {game && (
        <Chessguessr
          showModal={showModal}
          setShowModal={setShowModal}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
          game={game}
          stats={stats}
        />
      )}
    </div>
  );
}
