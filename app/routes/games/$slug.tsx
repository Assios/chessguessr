import { Chessguessr } from "../../components/Chessguessr";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { redirect } from "@remix-run/node";
import { useEffect } from "react";
import { CatchBoundaryComponent } from "@remix-run/react/routeModules";

export const meta: MetaFunction = ({ data }) => {
  const players = data?.game?.white + " vs. " + data?.game?.black;
  return {
    title: `Chessguessr – ${players}`,
  };
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <div className="mt-10 mb-20 content-center lg:mb-0">
      <div className="flex flex-row justify-center">
        <h1 className="text-center text-4xl mb-8 font-semibold">
          {caught.status}
        </h1>
      </div>
      <p className="max-w-prose m-auto text-center text-lg">
        {caught.statusText}
      </p>
    </div>
  );
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const dates = url.searchParams.get("dates");
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();
  const index = parseInt(params.slug) - 1;
  const currentGame = games[index];

  if (!currentGame) {
    throw new Response("Not Found", {
      status: 404,
      statusText: `Game with ID ${params.slug} could not be found. Are you sure this is the correct URL?`,
    });
  }

  if (currentGame.date === d) {
    return redirect("/");
  } else if (currentGame.date > d && dates !== "all") {
    throw new Response("Not Found", {
      status: 404,
      statusText: `Game with ID ${params.slug} could not be found. Are you sure this is the correct URL?`,
    });
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
    setShowNavbarStats,
  }: any = useOutletContext();

  useEffect(() => {
    setShowNavbarStats(true);
  });

  return (
    <div className="mt-10 mb-20 lg:mb-0">
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
