import { Game } from "~/utils/types";

export async function getPositions(): Promise<Array<any>> {
  return [
    {
      fen: "2R5/5pkp/4pp2/pp6/3bq3/PP1N2P1/3RPP1P/6K1 b - - 0 27",
      white: "Magnus Carlsen",
      black: "Ian Nepomniachtchi",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
    {
      fen: "r1r1k3/pp1qR2p/5pp1/3p2N1/6Q1/8/PP3PPP/2R3K1 b - - 0 22",
      white: "Wilhelm Steinitz",
      black: "Curt von Bardeleben",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
    {
      fen: "6k1/2q2B1p/b1Pp2p1/8/1p1b4/1P3Q2/2P2RPP/4r1BK b - - 0 31",
      white: "Anatoly Karpov",
      black: "Garry Kasparov",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
    {
      fen: "1qr3k1/5Npp/p1p3n1/1r6/2R2bQ1/1P5P/PB3PP1/3R2K1 b - - 0 26",
      white: "Paul Keres",
      black: "Jose Raul Capablanca",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
    {
      fen: "r3r1k1/pp3pbp/1qp1b1p1/2B5/2BP4/Q1n2N2/P4PPP/3R1K1R w - - 4 18",
      white: "Donald Byrne",
      black: "Bobby Fischer",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
    {
      fen: "2kr4/ppp1qpp1/2p5/2b2b2/2P1pPP1/1P2P3/PBQPB1p1/RN2K2R w Q - 0 16",
      white: "Bent Larsen",
      black: "Boris Spassky",
      link: "https://lichess.org/study/Hk9Zzv6o",
    },
  ];
}
