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
      solution: ["Ke2", "Nxa1", "Rxh7+", "Kxh7", "Qh3+"],
      gameUrl: "https://lichess.org/MCI2SKd9/white#48",
      white: "penguingim1",
      black: "Tardisiana",
      wRating: 2655,
      bRating: 1626,
      id: 2,
    },
    {
      date: "2022-06-24",
      fen: "4r1k1/pbn2ppp/1p1q4/3p4/3P4/2N1RN2/PP1Q1PPP/6K1 w - - 1 19",
      solution: ["Nb5", "Qd7", "Nxc7", "Rxe3", "Qxe3"],
      gameUrl: "https://lichess.org/Tk7OjfVh#36",
      white: "howitzer14",
      black: "rueoxy001",
      wTitle: "GM",
      bTitle: "IM",
      wAka: "David Howell",
      wRating: 2886,
      bRating: 2663,
      id: 3,
    },
    {
      date: "2022-06-25",
      fen: "2k3rr/1b3p1p/1P2p1p1/pq1pP3/2pQ4/2P5/2B1NPPP/R5K1 w - - 3 25",
      solution: ["Ba4", "Qb2", "Qc5+", "Kb8", "Re1"],
      gameUrl: "https://lichess.org/ZP0qydyh/white#48",
      white: "RebeccaHarris",
      black: "TwelveTeen",
      wTitle: "GM",
      bTitle: "NM",
      wAka: "Daniel Naroditsky",
      wRating: 2721,
      bRating: 2520,
      id: 4,
    },
    {
      date: "2022-06-26",
      fen: "3r1k2/pp3q2/1n1pRp1p/2pN1P2/5P2/6P1/PPP4P/2KR4 w - - 3 26",
      solution: ["Rxf6", "Nxd5", "Rxf7+", "Kxf7", "Rxd5"],
      gameUrl: "https://lichess.org/U5YtZBOd#50",
      white: "Zhigalko_Sergei",
      black: "beatles_21",
      wTitle: "GM",
      bTitle: "IM",
      wAka: "Sergei Zhigalko",
      bAka: "Jurica Srbiš",
      wRating: 3070,
      bRating: 2860,
      id: 5,
    },
    {
      date: "2022-06-27",
      fen: "3rr3/pp2pnkp/2p2pp1/q2p1b2/2PP1N2/1P4P1/PQ2PPBP/2RR2K1 w - - 4 20",
      solution: ["cxd5", "cxd5", "Rc5", "Qb6", "Nxd5"],
      gameUrl: "https://lichess.org/DouGIVl6#38",
      white: "SVODMEVKO",
      black: "neslraCsungaM77",
      wTitle: "GM",
      bTitle: "GM",
      wRating: 2978,
      bRating: 3029,
      id: 6,
    },
    {
      date: "2022-06-28",
      fen: "r2q1r2/pp4k1/4b1p1/3Nnp1p/1PP3n1/P3PN2/3QBPPP/R4RK1 w - - 2 18",
      solution: ["Nxe5", "Nxe5", "Qb2", "Bxd5", "Qxe5+"],
      gameUrl: "https://lichess.org/7WscjKGA#34",
      white: "Fredericia",
      black: "dereito",
      wTitle: "WFM",
      wAka: "Ellen Fredericia Nilssen",
      wRating: 2379,
      bRating: 2392,
      id: 7,
    },
    {
      date: "2022-06-29",
      fen: "2r1k3/p3qp1Q/1n1rpbp1/3p4/2nP1NP1/1BP2R2/P4PK1/2B1R3 w - - 19 31",
      solution: ["Nxg6", "fxg6", "Qxg6+", "Qf7", "Rxf6"],
      gameUrl: "https://lichess.org/E19QuQRe#60",
      white: "IM petriashvili2",
      black: "splendidkid",
      wAka: "Nikoloz Petriashvili",
      wTitle: "IM",
      wRating: 2704,
      bRating: 2796,
      id: 8,
    },
    {
      date: "2022-06-30",
      fen: "3r4/2p2p2/1p2p1pp/p3P3/P2r1P2/1P2BK2/3P3k/2R5 w - - 0 40",
      solution: ["Bg1+", "Kh3", "Bxd4", "Kh2", "Bg1+"],
      gameUrl: "https://lichess.org/EcoMqfu6/white#78",
      white: "Fast_Chance",
      black: "AnishGiri",
      bTitle: "GM",
      wRating: 2755,
      bRating: 2997,
      id: 9,
    },
    {
      date: "2022-07-01",
      fen: "r2q1rk1/1p1b1pbp/p1n1p1n1/2pp3Q/P1B1N3/3P1N2/1PP3PP/R1B2RK1 w - - 0 15",
      solution: ["Nfg5", "h6", "Nf6+", "Bxf6", "Qxh6"],
      gameUrl: "https://lichess.org/fXis9bS7#28",
      white: "DrNykterstein",
      black: "Blazinq",
      wTitle: "GM",
      bTitle: "FM",
      wAka: "Magnus Carlsen",
      wRating: 3283,
      bRating: 3033,
      id: 10,
    },
    {
      date: "2022-07-02",
      fen: "r1b1k2r/ppp1nppp/8/2bpq3/3n4/2P1B3/PP1NBPPP/R2QK2R w KQkq - 0 10",
      solution: ["Bxd4", "Bxd4", "Nf3", "Bxc3+", "Kf1"],
      gameUrl: "https://lichess.org/xztMYqOP/white#18",
      white: "RpImpulse",
      black: "vicous",
      wRating: 1744,
      bRating: 1928,
      id: 11,
    },
    {
      date: "2022-07-03",
      fen: "r1bq1rk1/1p2bppp/p1n1pn2/3p1PB1/3NP3/2PB4/PP1N2PP/R2Q1RK1 w - - 0 12",
      solution: ["Nxc6", "bxc6", "e5", "Ne8", "f6"],
      gameUrl: "https://lichess.org/ijr0I8Yc/white#22",
      white: "noltinho",
      black: "prokopmate",
      wRating: 1890,
      bRating: 2046,
      id: 12,
    },
    {
      date: "2022-07-04",
      fen: "8/pp3k1P/6N1/2p1p1B1/1n1pP1p1/1q4P1/8/K6R w - - 1 38",
      solution: ["Nxe5+", "Ke6", "Rh6+", "Kxe5", "h8=Q+"],
      gameUrl: "https://lichess.org/AlZU0Ga6/white#74",
      white: "GM alireza2003",
      black: "GM Konevlad",
      wTitle: "GM",
      bTitle: "GM",
      wAka: "Alireza Firouzja",
      bAka: "Vladislav Artemiev",
      wRating: 2762,
      bRating: 3007,
      id: 13,
    },
    {
      date: "2022-07-05",
      fen: "2k2r1r/pb3p2/2n1pP1p/q2pP1pB/1NpP4/2Q3B1/1P4PP/5RK1 w - - 3 25",
      solution: ["Nxc6", "Qxc3", "Ne7+", "Kd7", "bxc3"],
      gameUrl: "https://lichess.org/LKL0jVuR/white#48",
      white: "GM AnishOnYoutube",
      black: "GM nihalsarin2004",
      wTitle: "GM",
      bTitle: "GM",
      wAka: "Anish Giri",
      bAka: "Nihal Sarin",
      wRating: 2869,
      bRating: 2972,
      id: 14,
    },
    {
      date: "2022-07-06",
      fen: "2r3k1/7p/6p1/1p6/1P2P3/2pq2N1/2Q2bPP/7K w - - 0 32",
      solution: ["Qxd3", "c2", "Qd5+", "Kh8", "Qe5+"],
      gameUrl: "https://lichess.org/8fERehxe/white#62",
      white: "ChessGiant",
      black: "Heisenberg01",
      bTitle: "FM",
      wRating: 2046,
      bRating: 2627,
      id: 15,
    },
    {
      date: "2022-07-07",
      fen: "1n1q2kr/4rpp1/pp5p/2p2R2/6N1/1PP1P3/P3Q1PP/5RK1 w - - 1 23",
      solution: ["Ne5", "Qe8", "Nxf7", "Rxf7", "Qc4"],
      gameUrl: "https://lichess.org/WvIezSkr#44",
      white: "BabaRamdev",
      black: "mutdpro",
      wTitle: "GM",
      bTitle: "IM",
      wRating: 3031,
      bRating: 3131,
      id: 16,
    },
    {
      date: "2022-07-08",
      fen: "1bb2rk1/1p1nqppp/r7/pNp5/P2P2N1/1Bn1PQ1P/1P4P1/2R2RK1 w - - 0 20",
      solution: ["Nxc3", "cxd4", "Nd5", "Qd8", "Rxc8"],
      gameUrl: "https://lichess.org/pu19iESz#38",
      white: "GM aspiringstar",
      black: "BetterAtTicTacToe",
      wTitle: "GM",
      wRating: 2896,
      bRating: 2875,
      id: 17,
    },
    {
      date: "2022-07-09",
      fen: "r6r/p3kpp1/1qp3b1/3pPnN1/5P2/2P2Q2/PP1N1bPP/R1B2K1R b - - 6 16",
      solution: ["Ng3+", "hxg3", "Rxh1+", "Ke2", "Re1#"],
      gameUrl: "https://lichess.org/JYhT24aC/black#31",
      white: "Rarelyadraw",
      black: "EricRosen",
      bTitle: "IM",
      bAka: "Eric Rosen",
      wRating: 1761,
      bRating: 2506,
      id: 18,
    },
    {
      date: "2022-07-10",
      fen: "r2qr1k1/1p1b1p1p/2pb1pp1/p2n3P/3P4/2PB1P2/PPQBN1P1/2KR3R w - - 0 16",
      solution: ["hxg6", "hxg6", "Bxg6", "fxg6", "Qxg6+"],
      gameUrl: "https://lichess.org/9yaDFsYB#30",
      white: "AndrewHoma",
      black: "Alexandra2011",
      wTitle: "GM",
      wRating: 2273,
      bRating: 1634,
      id: 19,
    },
    {
      date: "2022-07-11",
      fen: "5n2/4k3/2p3p1/1p2PrRp/p1n2N1P/P2N4/1PP1K3/8 w - - 3 39",
      solution: ["Nxg6+", "Nxg6", "Rxf5", "Nxh4", "Rxh5"],
      gameUrl: "https://lichess.org/kgnzxX2d/white#76",
      white: "DrDrunkenstein",
      black: "Creep30",
      wTitle: "GM",
      bTitle: "GM",
      wAka: "Magnus Carlsen",
      wRating: 2941,
      bRating: 2631,
      id: 20,
    },
    {
      date: "2022-07-12",
      fen: "r1bq2k1/pp3ppp/2p2n2/3Pr3/1b6/1PNBP3/P2B1PPP/R2Q1RK1 b - - 0 12",
      solution: ["Bxc3", "Bxc3", "Rxd5", "Bxf6", "gxf6"],
      gameUrl: "https://lichess.org/LILtG6EN/black#23",
      white: "Protagonist98",
      black: "aboveandbelow",
      wTitle: "GM",
      wRating: 2718,
      bRating: 2709,
      id: 21,
    },
    {
      date: "2022-07-13",
      fen: "3rrqk1/5p2/4p2p/1p4pn/4b3/1P3NQP/P4PP1/BB3RK1 w - - 2 31",
      solution: ["Qe5", "Qg7", "Qxg7+", "Nxg7", "Bxe4"],
      gameUrl: "https://lichess.org/8J0TyLDu/white#60",
      white: "DrCesar001",
      black: "defenceboy1",
      bTitle: "GM",
      wRating: 2829,
      bRating: 2892,
      id: 22,
    },
    {
      date: "2022-07-14",
      fen: "r1bq1rk1/ppp2ppp/8/2bp4/6n1/1B1P4/PPP1RPPP/RNBQ2K1 b - - 2 11",
      solution: ["Qh4", "h3", "Bxf2+", "Kh1", "Qg3"],
      gameUrl: "https://lichess.org/Dg8vybD0/black#21",
      white: "Cholwezovich",
      black: "Johanssc",
      bTitle: "GM",
      wRating: 2207,
      bRating: 2810,
      id: 23,
    },
    {
      date: "2022-07-15",
      fen: "r1bqkb1r/pppp1ppp/2nn4/4p2Q/8/1BN5/PPPP1PPP/R1B1K1NR w KQkq - 4 6",
      solution: ["Nb5", "g6", "Qf3", "f5", "Qd5"],
      gameUrl: "https://lichess.org/2cOg7Que#10",
      white: "Paparama",
      black: "JoeAssaad",
      wTitle: "FM",
      wRating: 2683,
      bRating: 2603,
      id: 24,
    },
    {
      date: "2022-07-16",
      fen: "r2qr1k1/pp3pp1/2p3p1/3Pp3/1PP1n3/P5P1/4BP1P/R2Q1RK1 w - - 0 20",
      solution: ["dxc6", "Nc3", "cxb7", "Nxd1", "Rfxd1"],
      gameUrl: "https://lichess.org/y3eP3jdE#38",
      white: "DrNykterstein",
      black: "Night-King96",
      wTitle: "GM",
      wAka: "Magnus Carlsen",
      wRating: 3259,
      bRating: 3138,
      id: 25,
    },
    {
      date: "2022-07-17",
      fen: "r2qk2r/p5pp/2pbp3/3nNpP1/3Pp3/2P5/PP3P1P/R1BQK2R w KQkq - 2 15",
      solution: ["Qh5+", "g6", "Nxg6", "Kd7", "Nxh8"],
      gameUrl: "https://lichess.org/bQVozJc5#28",
      white: "Urkis",
      black: "larso",
      wTitle: "GM",
      bTitle: "GM",
      wAka: "Frode Urkedal",
      bAka: "Lars Oskar Hauge",
      wRating: 2601,
      bRating: 2708,
      id: 26,
    },
    {
      date: "2022-07-18",
      fen: "b2rk2r/p3qp1p/3Rp1p1/2p1P3/3npNQ1/P1B5/2P2PPP/1R4K1 w k - 10 20",
      solution: ["Bxd4", "cxd4", "Nxe6", "Rxd6", "Rb8+"],
      gameUrl: "https://lichess.org/8eP28Gbb/white#38",
      white: "swimmerchess",
      black: "fireheart92",
      wTitle: "IM",
      bTitle: "GM",
      wRating: 2733,
      bRating: 2768,
      id: 27,
    },
    {
      date: "2022-07-19",
      fen: "rnbqkbnr/ppp1ppp1/8/3p3p/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3",
      solution: ["e5", "Bxe5", "f6", "Bg3", "h4"],
      gameUrl: "https://lichess.org/8YgqKpvt#5",
      white: "leniclukachess",
      black: "EricRosen",
      bTitle: "IM",
      bAka: "Eric Rosen",
      wRating: 2428,
      bRating: 2760,
      id: 28,
    },
    {
      date: "2022-07-20",
      fen: "r5k1/1RQ2p1p/4qbp1/p3r3/8/5B1P/5PP1/5RK1 w - - 0 24",
      solution: ["Rb6", "Rc8", "Rxe6", "Rxc7", "Rxf6"],
      gameUrl: "https://lichess.org/J8HKQ0Fy/white#46",
      white: "FM lefonghua",
      black: "degardov",
      wAka: "Lefong Hua",
      wTitle: "FM",
      wRating: 2371,
      bRating: 2460,
      id: 29,
    },
    {
      date: "2022-07-21",
      fen: "2kr4/1pp2ppp/5nb1/p3b3/1q3PP1/2N4P/PPPBB3/1KQ1R3 b - - 0 19",
      solution: ["Rxd2", "fxe5", "Rxc2", "Qxc2", "Bxc2+"],
      gameUrl: "https://lichess.org/gOqiCYjN/black#37",
      white: "khartso",
      black: "agadmator",
      wRating: 2127,
      bRating: 2120,
      id: 30,
    },
    {
      date: "2022-07-22",
      fen: "2r3k1/pp2pp1p/3P2p1/8/8/4P3/PbbNBPPP/2R3K1 w - - 3 20",
      solution: ["d7", "Rd8", "Rxc2", "Bf6", "Rc8"],
      gameUrl: "https://lichess.org/xm6jMikg#38",
      white: "GM JanistanTV",
      black: "Torjaeger10",
      wTitle: "GM",
      wAka: "Jan Gustafsson",
      wRating: 2686,
      bRating: 2632,
      id: 31,
    },
    {
      date: "2022-07-23",
      fen: "1r5r/p3pk1p/2pp1p2/5R2/2P1P1Q1/2qPB3/b1P3PP/5RK1 w - - 9 28",
      solution: ["e5", "dxe5", "Rxf6+", "exf6", "Qd7+"],
      gameUrl: "https://lichess.org/0GPeQ9Gs#54",
      white: "TSMFTXH",
      black: "Mardan0212",
      wTitle: "GM",
      wAka: "Hikaru Nakamura",
      wRating: "2276?",
      bRating: "2413",
      id: 32,
    },
    {
      date: "2022-07-24",
      fen: "1k1r2r1/1qnn1Q2/p3p3/1p2P3/2pP3P/6B1/1P3PP1/R4RK1 w - - 0 25",
      solution: ["d5", "Qxd5", "Rad1", "Qc6", "Rd6"],
      gameUrl: "https://lichess.org/ceKJybNd#48",
      white: "DrNykterstein",
      black: "nihalsarin2004",
      wAka: "Magnus Carlsen",
      bAka: "Nihal Sarin",
      wTitle: "GM",
      bTitle: "GM",
      wRating: "2996",
      bRating: "2860",
      id: 33,
    },
    {
      date: "2022-07-25",
      fen: "r1bq1rk1/p1p2ppp/2p2n2/3p4/1b2PB2/P1N5/1PPQBPPP/2KR3R b - - 0 11",
      solution: ["Nxe4", "Qd4", "Nxc3", "bxc3", "Bxa3+"],
      gameUrl: "https://lichess.org/A0IKJkoZ/black#21",
      white: "Watneg",
      black: "Moro183",
      wTitle: "GM",
      bTitle: "GM",
      wRating: "2789",
      bRating: "2700",
      id: 34,
    },
    {
      date: "2022-07-26",
      fen: "r4rk1/pp2ppbp/3pbnp1/q3n3/3NP1PP/2N1BP2/PPPQ4/1K1R1B1R b - - 0 12",
      solution: ["Nxf3", "Nxf3", "Nxe4", "Qd3", "Nxc3+"],
      gameUrl: "https://lichess.org/jPgEz0Z0/black#23",
      white: "AlexFrol",
      black: "Madland91",
      wRating: 2601,
      bRating: 2452,
      id: 35,
    },
    {
      date: "2022-07-27",
      fen: "r1bqkb1r/pp2pppp/2np1n2/8/2B1P3/2N2N2/PP3PPP/R1BQK2R w KQkq - 2 7",
      solution: ["e5", "Nxe5", "Nxe5", "dxe5", "Bxf7+"],
      gameUrl: "https://lichess.org/YiYYk1jZ/white#12",
      white: "EricRosen",
      black: "kurcho1",
      wTitle: "IM",
      wRating: 2629,
      bRating: 1863,
      id: 36,
    },
    {
      date: "2022-07-28",
      fen: "r3k2r/p1qbbppp/1pn1p3/2pnP3/2N5/5NP1/PPP2PBP/R1BQR1K1 w kq - 3 12",
      solution: ["Nd6+", "Bxd6", "exd6", "Qxd6", "c4"],
      gameUrl: "https://lichess.org/GqRxvHpr/white#22",
      white: "Fins",
      black: "ElevenElephants",
      wAka: "John Bartholomew",
      wTitle: "IM",
      wRating: 2601,
      bRating: 1500,
      id: 37,
    },
    {
      date: "2022-07-29",
      fen: "r1q1r1k1/ppb2pp1/2p1bn1p/2PpN3/3P1P1B/2PB4/P5PP/R2QR1K1 w - - 1 17",
      solution: ["Bxf6", "gxf6", "Qh5", "Kg7", "Re3"],
      gameUrl: "https://lichess.org/yta4rODX/white#32",
      white: "AnishGiri",
      black: "junglebook1",
      wTitle: "GM",
      bTitle: "GM",
      wRating: 3048,
      bRating: 3181,
      id: 38,
    },
    {
      date: "2022-07-30",
      fen: "6k1/p1q2p1p/bp4p1/2pPN3/2n2Q2/3B4/P4PPP/6K1 w - - 0 30",
      solution: ["d6", "Nxd6", "Bxa6", "b5", "Nxf7"],
      gameUrl: "https://lichess.org/kms76085/white#58",
      white: "GgangbuVip",
      black: "howitzer14",
      bTitle: "GM",
      wRating: 2784,
      bRating: 2938,
      id: 39,
    },
    {
      date: "2022-07-31",
      fen: "4rr1k/ppR4p/6p1/3B4/3b4/8/PP3PPP/5RK1 b - - 0 21",
      solution: ["Rxf2", "Rc4", "Rf4+", "Rxd4", "Rxd4"],
      gameUrl: "https://lichess.org/pAnhfF98/black#41",
      white: "DrDrunkenstein",
      black: "Crew64",
      wAka: "Magnus Carlsen",
      bAka: "Levy Rozman",
      wTitle: "GM",
      bTitle: "IM",
      wRating: 2766,
      bRating: 2492,
      id: 40,
    },
    {
      date: "2022-08-01",
      fen: "6r1/2p4k/1p2q1rp/3pP2Q/p2P1Pp1/2P4R/P4K2/7R w - - 0 32",
      solution: ["f5", "Rf8", "Rf3", "g3+", "Kg2"],
      gameUrl: "https://lichess.org/Zqt39Jaj/white#62",
      white: "TadeuszSoplica",
      black: "dannygajdos",
      wTitle: "FM",
      wRating: 2377,
      bRating: 2326,
      id: 41,
    },
    {
      date: "2022-08-02",
      fen: "2kr1b1r/pp1bpp1p/6p1/3BP3/Q7/4PN2/Pq1NK1P1/7R w - - 5 18",
      solution: ["Qc4+", "Kb8", "Rb1", "Bb5", "Rxb2"],
      gameUrl: "https://lichess.org/XON9GZ2p/white#34",
      white: "KeyzerSoze",
      black: "mbakkor",
      wTitle: "IM",
      wRating: 2471,
      bRating: 2321,
      id: 42,
    },
    {
      date: "2022-08-03",
      fen: "rn3rk1/6bp/p2p4/2pPp2n/4QpbP/2NB2Pq/1PPN1P2/R1B1R1K1 b - - 1 22",
      solution: ["fxg3", "Qxh7+", "Kf7", "Nf1", "gxf2+"],
      gameUrl: "https://lichess.org/gH2wBA1C/black#43",
      white: "Grukjr",
      black: "ObiWanKANOEBI",
      wTitle: "GM",
      bTitle: "GM",
      wRating: 2772,
      bRating: 2664,
      id: 43,
    },
    {
      date: "2022-08-04",
      fen: "r1bq1rk1/pp1nbppp/2p5/3pP3/3P3P/3B1N2/PPP3P1/R1BQK2R w KQ - 0 11",
      solution: ["Bxh7+", "Kxh7", "Ng5+", "Bxg5", "hxg5+"],
      gameUrl: "https://lichess.org/OR3sRhmX/white#20",
      white: "Kingscrusher-YouTube",
      black: "SergejManojlovic",
      wTitle: "CM",
      wRating: 2502,
      bRating: 2150,
      id: 44,
    },
    {
      date: "2022-08-05",
      fen: "4rr1k/6b1/p5Pp/5q2/PP2R1QB/8/3p1PP1/1B1R2K1 b - - 0 42",
      solution: ["Qxg4", "Rxg4", "Re1+", "Kh2", "Rxd1"],
      gameUrl: "https://lichess.org/myHAhrVm/black#83",
      white: "Zaven_ChessMood",
      black: "manwithavan",
      bAka: "Magnus Carlsen",
      wTitle: "GM",
      bTitle: "GM",
      wRating: 2830,
      bRating: 2762,
      id: 45,
    },
    {
      date: "2022-08-06",
      fen: "r3k2r/pp1n1ppp/2p1bp2/7Q/3P4/3BqN2/PPP3PP/1K1R3R w kq - 4 13",
      solution: ["Rhe1", "Qf4", "Rxe6+", "Kf8", "Re4"],
      gameUrl: "https://lichess.org/cECO0dDh/white#24",
      white: "SVODMEVKO",
      black: "Gevorg_Harutjunyan",
      wTitle: "GM",
      bTitle: "GM",
      wRating: 3077,
      bRating: 2860,
      id: 46,
    },
    {
      date: "2022-08-07",
      fen: "r4rk1/pp1b1ppp/2n1p3/2qp4/8/2PBP3/PP1N1PPP/R2QK2R w KQ - 0 13",
      solution: ["Bxh7+", "Kxh7", "Qh5+", "Kg8", "Ne4"],
      gameUrl: "https://lichess.org/v72eGZ6h/white#24",
      white: "stewartbanawa",
      black: "MrTroutstanding",
      wRating: 2617,
      bRating: 2606,
      id: 47,
    },
    {
      date: "2022-08-08",
      fen: "2r1k2r/1pbn1ppp/p1p1pn2/2Pp1b2/1P1P1B2/2N1PN1P/1P2BPP1/R4RK1 w k - 5 14",
      solution: ["Bxc7", "Rxc7", "b5", "cxb5", "Nxb5"],
      gameUrl: "https://lichess.org/WA8cozpK/white#26",
      white: "MagicAndy",
      black: "Boknoy2019",
      wTitle: "FM",
      wRating: 2493,
      bRating: 2323,
      id: 48,
    },
    {
      date: "2022-08-09",
      fen: "r3q3/3k2b1/p1p1npp1/3p3n/2pP4/2N2Q1N/PP1B1P2/2K1R3 w - - 6 22",
      solution: ["Nxd5", "Rb8", "Ndf4", "Nhxf4", "Nxf4"],
      gameUrl: "https://lichess.org/c4VLv6Hz/white#42",
      white: "lorci49",
      black: "Appsthattheyshouldnt",
      wTitle: "IM",
      wAka: "Laura Unuk",
      wRating: 2486,
      bRating: 2537,
      id: 49,
    },
    {
      date: "2022-08-10",
      fen: "8/8/6p1/p1p5/1k2K2P/1P6/P7/8 w - - 1 48",
      solution: ["Kd5", "Ka3", "Kxc5", "Kxa2", "b4"],
      gameUrl: "https://lichess.org/SCKSbcLd/white#94",
      white: "slowdumb",
      black: "Kuban23",
      wTitle: "WGM",
      wRating: 2360,
      bRating: 2726,
      id: 50,
    },
    {
      date: "2022-08-11",
      fen: "1r3k2/3P1P2/1r4p1/7p/8/2n4P/1p4P1/1R3RK1 w - - 1 44",
      solution: ["Rbe1", "Rf6", "Re8+", "Kg7", "Rxb8"],
      gameUrl: "https://lichess.org/Ogu5lvDr/white#86",
      white: "KnezMihailova",
      black: "Kjetil_Lie80",
      bTitle: "GM",
      wRating: 2849,
      bRating: 2604,
      id: 51,
    },
    {
      date: "2022-08-12",
      fen: "r2r3k/1bpqp1bp/pp2P3/5pp1/P1PN1P2/3P4/1BP2QPP/R1R3K1 b - - 0 22",
      solution: ["Qxd4", "Bxd4", "Bxd4", "fxg5", "Bxf2+"],
      gameUrl: "https://lichess.org/2WEFQvqu/black#43",
      white: "SophiaRodgers",
      black: "Sparklehorse",
      bTitle: "IM",
      wRating: 2276,
      bRating: 2308,
      id: 52,
    },
    {
      date: "2022-08-13",
      fen: "r2qk1nr/pp1nbpp1/2p1p2p/3pP3/3P1NPP/2NQ4/PPP2P2/R1B1K2R w KQkq - 1 11",
      solution: ["Nxe6", "fxe6", "Qg6+", "Kf8", "Rh3"],
      gameUrl: "https://lichess.org/QtMOmoYO/white#20",
      white: "nihalsarin2004",
      black: "darsen_dancer",
      wAka: "Nihal Sarin",
      wTitle: "GM",
      bTitle: "IM",
      wRating: 2944,
      bRating: 2688,
      id: 53,
    },
    {
      date: "2022-08-14",
      fen: "4k3/1bR2p1p/4ppr1/3q4/1Q6/4PN2/5PPP/6K1 b - - 2 27",
      solution: ["Rxg2+", "Kf1", "Rxf2+", "Ke1", "Rf1+"],
      gameUrl: "https://lichess.org/ZTkc58Tk/black#53",
      white: "Konevlad",
      black: "BSambuev",
      wTitle: "GM",
      bTitle: "GM",
      wAka: "Vladislav Artemiev",
      bAka: "Bator Sambuev",
      wRating: 2582,
      bRating: 2630,
      id: 54,
    },
    {
      date: "2022-08-15",
      fen: "r2qk2r/pp2bp1p/2n1b1p1/1Q2P3/2B5/5N2/PP3PPP/R1B1K2R b KQkq - 2 13",
      solution: ["a6", "Qb3", "Na5", "Qa4+", "b5"],
      gameUrl: "https://lichess.org/3MyF7UWe/black#25",
      white: "FakeBruceLee",
      black: "Powerrino",
      wTitle: "GM",
      wAka: "Zaur Mammadov",
      wRating: 2607,
      bRating: 2499,
      id: 55,
    },
    {
      date: "2022-08-16",
      fen: "r1bqk2r/ppp2pp1/2p2n2/2b4p/4P3/3P4/PPP1BPPP/RNBQ1RK1 b kq - 1 7",
      solution: ["Ng4", "h3", "Qd6", "g3", "Qxg3+"],
      gameUrl: "https://lichess.org/POePbLZn/black#13",
      white: "Stefan005",
      black: "EricRosen",
      wTitle: "FM",
      bAka: "Eric Rosen",
      bTitle: "IM",
      wRating: 2335,
      bRating: 2682,
      id: 56,
    },
    {
      date: "2022-08-17",
      fen: "2R2r1k/6b1/8/1P6/6Pp/4RpqP/P1Q5/5K2 b - - 1 47",
      solution: ["Qxh3+", "Ke1", "f2+", "Qxf2", "Qh1+"],
      gameUrl: "https://lichess.org/QJBExSuV/black#93",
      white: "Pandochka",
      black: "muisback",
      wTitle: "WGM",
      bTitle: "GM",
      wAka: "Maria Fominykh",
      bAka: "Rauf Mamedov",
      wRating: 2179,
      bRating: 2928,
      id: 57,
    },
    {
      date: "2022-08-18",
      fen: "r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6",
      solution: ["Nxd5", "Bxd8", "Bb4+", "Qd2", "Kxd8"],
      gameUrl: "https://lichess.org/xpqhsS1I/black#11",
      white: "BES_ALEX_1971_ba",
      black: "agofman",
      wRating: 2286,
      bRating: 2336,
      id: 58,
    },
    {
      date: "2022-08-19",
      fen: "r6k/6pp/2p1b2q/ppPpN3/3Pp3/6P1/PP3QP1/1K3R2 w - - 4 25",
      solution: ["Qf8+", "Rxf8", "Rxf8+", "Bg8", "Nf7#"],
      gameUrl: "https://lichess.org/DIDUYZVL/white#48",
      white: "moonLight2533",
      black: "abdonsky2020",
      wRating: 2015,
      bRating: 1999,
      id: 59,
    },
    {
      date: "2022-08-20",
      fen: "2r1r1k1/pp1n1pbp/6p1/3p4/5BP1/2PQ1N1P/P2N1q2/2RK3R b - - 2 23",
      solution: ["Nc5", "Qf1", "Qxf1+", "Nxf1", "Nd3"],
      gameUrl: "https://lichess.org/gxA2WzRB/black#45",
      white: "burbur1",
      black: "VerdeNotte",
      bTitle: "GM",
      bAka: "Gawain Jones",
      wRating: 2627,
      bRating: 2739,
      id: 60,
    },
    {
      date: "2022-08-21",
      fen: "8/3k4/4p3/2KPP1p1/2p1B2p/2P3P1/4b3/8 w - - 0 47",
      solution: ["gxh4", "gxh4", "d6", "h3", "Bc6+"],
      gameUrl: "https://lichess.org/dgdwgo1j/white#92",
      white: "Luckyriver",
      black: "Sgplus",
      wTitle: "LM",
      wRating: 2329,
      bRating: 2221,
      id: 61,
    },
    {
      date: "2022-08-22",
      fen: "2r3k1/p1q2pbp/4p1p1/8/2Qn4/2B3P1/P4PBP/1R4K1 w - - 0 24",
      solution: ["Qxc7", "Ne2+", "Kf1", "Rxc7", "Rb8+"],
      gameUrl: "https://lichess.org/Kvptsafx/white#46",
      white: "Finansist2",
      black: "jlhammer",
      bTitle: "GM",
      bAka: "Jon Ludvig Hammer",
      wRating: 2298,
      bRating: 2543,
      id: 62,
    },
    {
      date: "2022-08-23",
      fen: "3B3k/6rp/4Q1p1/p7/1p2p1P1/1P3b1P/PP1p1P1K/8 b - - 0 52",
      solution: ["h5", "Bf6", "d1=Q", "Bxg7+", "Kxg7"],
      gameUrl: "https://lichess.org/WJqexY0P/black#103",
      white: "MrSuccess",
      black: "playRapidNotBlitz",
      wTitle: "IM",
      bTitle: "IM",
      wAka: "Robert Gwaze",
      bAka: "Oleksii Molchanov",
      wRating: 2682,
      bRating: 2726,
      id: 63,
    },
    {
      date: "2022-08-24",
      fen: "r4rk1/1p1q1ppp/p1n1p2B/2p5/3bN1Q1/3P4/PPP2PPP/R4RK1 w - - 8 16",
      solution: ["Nxc5", "Qe7", "Nb3", "Bxb2", "Rab1"],
      gameUrl: "https://lichess.org/LgYFjeUo/white#30",
      white: "DrNykterstein",
      black: "mutdpro",
      wTitle: "GM",
      bTitle: "IM",
      wAka: "Magnus Carlsen",
      bAka: "Minh Le",
      wRating: 3329,
      bRating: 3190,
      id: 64,
    },
    {
      date: "2022-08-25",
      fen: "2r5/3bk2p/p2ppp2/1p2b2B/1r2P3/qP1N2P1/P1PRQ2P/1K5R b - - 4 24",
      solution: ["Bc3", "Rdd1", "Ra4", "bxa4", "bxa4"],
      gameUrl: "https://lichess.org/oBwL5dab/black#47",
      white: "ianfindlay2314",
      black: "Fins",
      wTitle: "FM",
      bTitle: "IM",
      bAka: "John Bartholomew",
      wRating: 2362,
      bRating: 2613,
      id: 65,
    },
    {
      date: "2022-08-26",
      fen: "rr6/4kp2/3b2p1/1B2p3/PB1p4/1n3PP1/1P5P/R1R3K1 w - - 4 32",
      solution: ["Rc7+", "Ke6", "Bc4+", "Kf6", "Rxf7+"],
      gameUrl: "https://lichess.org/frYGHvJt/white#62",
      white: "DrNykterstein",
      black: "mutdpro",
      wTitle: "GM",
      bTitle: "IM",
      wAka: "Magnus Carlsen",
      bAka: "Minh Le",
      wRating: 3295,
      bRating: 3222,
      id: 66,
    },
    {
      date: "2022-08-27",
      fen: "r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4",
      solution: ["Qg5", "Nxf7", "Qxg2", "Rf1", "Qxe4+"],
      gameUrl: "https://lichess.org/R21FvxpT/black#7",
      white: "Dr_Ruthless",
      black: "THE_MAMMADOV",
      wRating: 2454,
      bRating: 2614,
      id: 67,
    },
    {
      date: "2022-08-28",
      fen: "4B3/4R3/1R4p1/2p3k1/2p2r2/3b1pK1/PP6/5r2 w - - 2 46",
      solution: ["Re5+", "Bf5", "Rxg6+", "Kh5", "Kxf4"],
      gameUrl: "https://lichess.org/27DfZwhP/white#90",
      white: "PusheenMeow",
      black: "enriann10",
      wAka: "Jon Kristian Haarr",
      wTitle: "CM",
      wRating: 2525,
      bRating: 2494,
      id: 68,
    },
    {
      date: "2022-08-29",
      fen: "2rr2k1/4bpp1/p3pn1p/1pqnN3/8/P1P3BP/1P2QPP1/1B1RR1K1 w - - 4 32",
      solution: ["Nxf7", "Kxf7", "Qxe6+", "Kf8", "Bg6"],
      gameUrl: "https://lichess.org/55KdCDlX/white#62",
      white: "AnishGiri",
      black: "Night-King96",
      wAka: "Anish Giri",
      wTitle: "GM",
      bAka: "Oleksandr Bortnyk",
      bTitle: "GM",
      wRating: 3039,
      bRating: 3124,
      id: 69,
    },
    {
      date: "2022-08-30",
      fen: "2r1qrk1/pp4p1/1n1pp1p1/3p2Pp/1n1PP2P/P1N2P1N/1PP1Q3/2KR3R b - - 0 17",
      solution: ["Rxc3", "bxc3", "Na2+", "Kb2", "Na4+"],
      gameUrl: "https://lichess.org/J6RAbrM2/black#33",
      white: "Night-King96",
      black: "AnishGiri",
      bAka: "Anish Giri",
      bTitle: "GM",
      wAka: "Oleksandr Bortnyk",
      wTitle: "GM",
      wRating: 3117,
      bRating: 3046,
      id: 70,
    },
  ];
}
