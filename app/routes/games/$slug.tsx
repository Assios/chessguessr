import { useState } from "react";
import { Chessguessr } from "../../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { getGames } from "~/models/game.server";
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

  const {
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    setTutorial,
  }: any = useOutletContext();

  return (
    <StyledIndex>
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
            firebaseStats={false}
          />
        )}
      </div>
    </StyledIndex>
  );
}
