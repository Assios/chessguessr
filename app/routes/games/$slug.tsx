import { Chessguessr } from "../../components/Chessguessr";
import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import dayjs from "dayjs";
import { useCatch, useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { redirect } from "@remix-run/node";
import { useEffect } from "react";
import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { OutletContextType } from "~/utils/types";
import { boardOgImage } from "~/utils/ogImage";

const ORIGIN = "https://www.chessguessr.com";

export const meta: MetaFunction = ({ data }) => {
  if (!data?.game) {
    return { title: "Chessguessr" };
  }

  const g = data.game;
  const imageUrl = boardOgImage(g.fen);

  const white = g.wAka || g.white;
  const black = g.bAka || g.black;
  const players = `${white} vs. ${black}`;
  const title = `Chessguessr #${g.id} – ${players}`;
  const description = `Guess the next five moves ${white} played against ${black}${g.event ? ` at ${g.event}` : ""
    } on ${dayjs(g.date).format(
      "MMMM D, YYYY"
    )} — a Wordle-style puzzle from a real chess game.`;

  return {
    title,
    description,
    "og:title": title,
    "og:description": description,
    "og:image": imageUrl,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": imageUrl,
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

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers: Record<string, string> = {};
  const cacheControl = loaderHeaders.get("Cache-Control");
  if (cacheControl) headers["Cache-Control"] = cacheControl;
  return headers;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const dates = url.searchParams.get("dates");
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();
  const index = parseInt(params.slug || "0") - 1;
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

  if (currentGame.date < d) {
    return json(
      { game: currentGame },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  }

  return json({ game: currentGame });
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
  } = useOutletContext<OutletContextType>();

  useEffect(() => {
    setShowNavbarStats(true);
  });

  return (
    <div className="mt-10 mb-20 lg:mb-0">
      {game && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
                { "@type": "ListItem", position: 2, name: "Archive", item: `${ORIGIN}/games` },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${game.wAka || game.white} vs. ${game.bAka || game.black
                    }`,
                  item: `${ORIGIN}/games/${game.id}`,
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
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
