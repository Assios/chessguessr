import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { json } from "@remix-run/node"; // or "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const d = new Date().toISOString().split("T")[0];

  const games = [
    {
      date: "2022-06-18",
      fen: "r1bq1rk1/pp2bppp/2n2n2/2pp4/8/1P3NP1/PB1PPPBP/RN1Q1RK1 w - - 0 9",
      solution: ["d4", "Ne4", "Nc3", "Bf6", "Na4"],
      gameUrl: "https://lichess.org/Hk3Gr55R#16",
      white: "Sepp",
      black: "ManuDavid2910",
      wRating: 3309,
      bRating: 2985,
      id: 1,
    },
    {
      date: "2022-06-19",
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
      date: "2022-06-21",
      fen: "r5k1/pb1p2q1/1p4p1/n1p3Q1/4p1P1/2N1P3/PPP2r2/1K1R3R w - - 0 25",
      solution: ["Rd6", "Qf7", "Rxg6+", "Kf8", "Rh8+"],
      gameUrl: "https://lichess.org/510uJ3P3/white#48",
      white: "DrNykterstein",
      black: "nihalsarin2004",
      wRating: 3022,
      bRating: 2855,
      id: 3,
    },
  ];

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
