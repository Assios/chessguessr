import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = await getGames();

  return games.find((game) => {
    return game.date === d;
  });
};

const StyledIndex = styled.div`
  margin-top: 5rem;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default function Index() {
  const game = useLoaderData();

  return <StyledIndex>{game && <Chessguessr game={game} />}</StyledIndex>;
}
