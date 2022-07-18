import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData, useActionData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "~/firebase";
import { getDoc, doc, setDoc, increment } from "firebase/firestore";
import { Navbar } from "~/components/Navbar/Navbar";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { incrementSolved } from "~/firebase/utils";
import { useSubmit } from "@remix-run/react";

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

export const action = async ({ request }) => {
  const statsDoc = doc(db, "stats", "1");

  setDoc(
    statsDoc,
    {
      solved: increment(1),
      turns: increment(10),
    },
    { merge: true }
  );

  return null;
};

const StyledIndex = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default function Index() {
  const { game, stats } = useLoaderData();
  const [showModal, setShowModal] = useState(false);
  const submit = useSubmit();

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(event.target);
  };

  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const data = useActionData();
  console.log("d", data);

  return (
    <StyledIndex>
      <Navbar
        fixed={false}
        setShowTutorial={setShowTutorial}
        setShowModal={setShowModal}
      />
      <div className="mt-20">
        {game && (
          <form method="post" onSubmit={handleSubmit}>
            <Chessguessr
              showModal={showModal}
              setShowModal={setShowModal}
              showTutorial={showTutorial}
              setShowTutorial={setShowTutorial}
              setTutorial={setTutorial}
              game={game}
              stats={stats}
            />
            <button type="submit">halla</button>
          </form>
        )}
      </div>
    </StyledIndex>
  );
}
