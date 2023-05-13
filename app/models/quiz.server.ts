export async function getQuiz(): Promise<Array<any>> {
  return [
    {
      date: "2023-05-12",
      id: 1,
      rounds: [
        {
          fen: "4r2k/1b3p1p/p2qNpP1/1p6/4pnB1/2P4R/1P3PP1/2K5 w - - 0 29",
          options: [
            "Carlsen – Caruana, 2018",
            "Fischer – Byrne, 1956",
            "Kasparov – Kramnik, 1994",
            "Tkachiev – Ponomariov, 2008",
          ],
          correctAnswer: 2,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "3rk2r/pR3p1p/2p1p1Bp/3n4/3q2P1/4RP2/P1P2Kb1/2BQ4 b k - 1 21",
          options: [
            "Anand – Lautier, 1997",
            "Fischer – Spassky, 1992",
            "Tal – Keres, 1973",
            "Smyslov – Browne, 1969",
          ],
          correctAnswer: 0,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "1r3kr1/pbpBBp1p/1b3P2/8/8/2P2q2/P4PPP/3R2K1 b - - 0 24",
          options: [
            "Spassky – Prie, 1991",
            "Khalifman – Filippov, 1995",
            "Kasparov – Smirin, 1988",
            "Anderssen – Dufrense, 1852",
          ],
          correctAnswer: 3,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16",
          options: [
            "Ambroz – Tal, 1981",
            "Fischer – Byrne, 1956",
            "Levenfish – Smyslov, 1948",
            "Tarrasch – Lasker, 1908",
          ],
          correctAnswer: 1,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "2R5/4bppk/1p1p3Q/5R1P/4P3/5P2/r4q1P/7K b - - 6 50",
          options: [
            "Carlsen – Karjakin, 2016",
            "Rubinstein – Lasker, 1909",
            "Carlsen – Caruana, 2018",
            "Ponomariov – Vallejo Pons, 2016",
          ],
          correctAnswer: 0,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
      ],
    },
  ];
}
