import { Game } from "~/utils/types";

export async function getGames(): Promise<Array<Game>> {
  return [
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
      fen: "r2q1r1k/6bp/2n1B1p1/1p6/p2pP3/P2P2Q1/1PnB4/R3K2R w KQ - 0 25",
      solution: ["Ke2", "Nxa1", "Rxh7+", "Kxh7", "Qh3"],
      gameUrl: "https://lichess.org/MCI2SKd9/white#48",
      white: "penguingim1",
      black: "Tardisiana",
      wRating: 2655,
      bRating: 1626,
      id: 2,
    },
    {
      date: "2022-06-24",
      fen: "r1b1k2r/ppp1nppp/8/2bpq3/3n4/2P1B3/PP1NBPPP/R2QK2R w KQkq - 0 10",
      solution: ["Bxd4", "Bxd4", "Nf3", "Bxc3+", "Kf1"],
      gameUrl: "https://lichess.org/xztMYqOP/white#18",
      white: "RpImpulse",
      black: "vicous",
      wRating: 1744,
      bRating: 1928,
      id: 3,
    },
  ];
}
