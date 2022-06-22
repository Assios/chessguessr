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
      date: "2022-06-22",
      fen: "r5k1/pb1p2q1/1p4p1/n1p3Q1/4p1P1/2N1P3/PPP2r2/1K1R3R w - - 0 25",
      solution: ["Rd6", "Qf7", "Rxg6+", "Kf8", "Rh8+"],
      gameUrl: "https://lichess.org/510uJ3P3/white#48",
      white: "DrNykterstein",
      black: "nihalsarin2004",
      wRating: 3022,
      bRating: 2855,
      id: 1,
    },
    {
      date: "2022-06-23",
      fen: "r1b1k2r/ppp1nppp/8/2bpq3/3n4/2P1B3/PP1NBPPP/R2QK2R w KQkq - 0 10",
      solution: ["Bxd4", "Bxd4", "Nf3", "Bxc3+", "Kf1"],
      gameUrl: "https://lichess.org/xztMYqOP/white#18",
      white: "RpImpulse",
      black: "vicous",
      wRating: 1744,
      bRating: 1928,
      id: 2,
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
