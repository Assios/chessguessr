import { Chessguessr } from "../../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const dates = url.searchParams.get("dates");
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();
  const index = parseInt(params.slug) - 1;
  const currentGame = games[index];

  if (!currentGame) {
    throw new Response("Not Found", { status: 404 });
  }

  if (currentGame.date === d) {
    return redirect("/");
  } else if (currentGame.date > d && dates !== "all") {
    throw new Response("Not Found", { status: 404 });
  }

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
    <div className="mt-6 mb-20 lg:mb-5">
      {game && (
        <Chessguessr
          showModal={showModal}
          setShowModal={setShowModal}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
          game={game}
          stats={stats}
          shouldUpdateStats={false}
        />
      )}
    </div>
  );
}
