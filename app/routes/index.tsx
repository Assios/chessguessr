import { Chessguessr } from "../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useEffect } from "react";
import type { OutletContextType } from "~/utils/types";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const dailyGame = games.find((game) => {
    return game.date === d;
  });

  if (!dailyGame) {
    throw new Response("No game found for today", { status: 404 });
  }

  const docRef = doc(db, "stats", dailyGame.id.toString());
  const docSnap = await getDoc(docRef);

  return json({ game: dailyGame, stats: docSnap.data() });
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
