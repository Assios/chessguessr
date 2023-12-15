import { Chessguessr } from "../components/Chessguessr";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  const dailyGame = games.find((game) => {
    return game.date === d;
  });

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
  }: any = useOutletContext();

  useEffect(() => {
    setShowNavbarStats(true);
  });

  return (
    <div>
      <div className="mr-2 ml-2 flex justify-center text-center mt-4">
        <p>
          Want more puzzles this advent? Check out{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://adventofchess.com"
            target="_blank"
          >
            Advent of Chess
          </a>
          , and get a chance to win a board signed by Magnus Carlsen.
        </p>
      </div>
      <div className="mt-6 mb-20 lg:mb-0">
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
