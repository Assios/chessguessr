import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { Navbar } from "~/components/Navbar/Navbar";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useOutletContext } from "@remix-run/react";

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

const StyledIndex = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

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
    <StyledIndex>
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
            firebaseStats={true}
          />
        )}
      </div>
    </StyledIndex>
  );
}
