import { Chessguessr } from "../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { generateFallbackGame } from "~/models/fallback-puzzle.server";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  let dailyGame = games.find((game) => game.date === d);

  if (!dailyGame) {
    dailyGame = (await generateFallbackGame()) ?? undefined;
  }

  if (!dailyGame) {
    throw new Response("No puzzle available for today", { status: 404 });
  }

  // Fallback games use a synthetic ID and won't have Firebase stats — skip
  // gracefully rather than crashing on `dailyGame.id.toString()`.
  let stats = null;
  try {
    const docRef = doc(db, "stats", dailyGame.id.toString());
    const docSnap = await getDoc(docRef);
    stats = docSnap.data() ?? null;
  } catch {
    stats = null;
  }

  return json({ game: dailyGame, stats });
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
    <div>
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
            shouldUpdateStats={true}
          />
        )}
      </div>
    </div>
  );
}
