import React, { useState, useEffect } from "react";
import { Chessguessr } from "../../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { db } from "../../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { Navbar } from "~/components/Navbar/Navbar";

export const loader: LoaderFunction = async ({ params }) => {
  const games = await getGames();

  const index = parseInt(params.slug) - 1;

  return json({ game: games[index] });
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

  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  return (
    <StyledIndex>
      <Navbar
        fixed={false}
        setShowTutorial={setShowTutorial}
        setShowModal={setShowModal}
      />
      <div className="mt-20">
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
    </StyledIndex>
  );
}
