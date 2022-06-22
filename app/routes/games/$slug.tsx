import React, { useState, useEffect } from "react";
import { Chessguessr } from "../../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";

export const loader: LoaderFunction = async ({ params }) => {
  const games = await getGames();

  const index = parseInt(params.slug) - 1;

  return games[index];
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
