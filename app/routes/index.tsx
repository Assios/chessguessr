import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  return json([
    {
      fen: "r1bq1rk1/pp2bppp/2n2n2/2pp4/8/1P3NP1/PB1PPPBP/RN1Q1RK1 w - - 0 9",
      solution: ["d4", "Ne4", "Nc3", "Bf6", "Na4"],
      gameUrl: "https://lichess.org/Hk3Gr55R#16",
      white: "DrNykterstein",
      black: "ManuDavid2910",
      wRating: 3309,
      bRating: 2985,
      id: 2,
    },
    {
      fen: "3r2k1/prp3p1/1b2Rp1p/8/7P/1P4P1/P2qQP2/B1R3K1 w - - 1 25",
      solution: ["Re8+", "Kh7", "Qe4+", "g6", "Qe7#"],
      gameUrl: "https://lichess.org/PLHVVZhI/white#48",
      white: "Assios",
      black: "Phamtophive",
      wRating: 2267,
      bRating: 2291,
      id: 3,
    },
  ]);
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
  const games = useLoaderData();

  const game = games[Math.floor(Math.random() * 3)];

  return <StyledIndex>{game && <Chessguessr data={game} />}</StyledIndex>;
}
