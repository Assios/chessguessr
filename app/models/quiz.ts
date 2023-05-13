export async function getQuiz(): Promise<Array<any>> {
  return [
    {
      date: "2023-05-12",
      id: 1,
      rounds: [
        {
          fen: "r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16",
          options: [
            "Carlsen vs Caruana",
            "Fischer vs Byrne",
            "So vs Ding",
            "Firouzja vs Caruana",
          ],
          correctAnswer: 1,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "1k6/1P6/r5p1/1R3r1p/P4P1K/8/5P2/2R5 b - - 4 47",
          options: ["Yo vs Bo", "Do vs Ko", "Lo vs Co", "Bapp vs Sapp"],
          correctAnswer: 3,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16",
          options: [
            "Sepp",
            "Fischer vs Byrne",
            "So vs Ding",
            "Firouzja vs Caruana",
          ],
          correctAnswer: 1,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16",
          options: [
            "Bepp vs Caruana",
            "Fischer vs Byrne",
            "So vs Ding",
            "Firouzja vs Caruana",
          ],
          correctAnswer: 1,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
        {
          fen: "r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16",
          options: [
            "Kepp vs Caruana",
            "Fischer vs Byrne",
            "So vs Ding",
            "Firouzja vs Caruana",
          ],
          correctAnswer: 1,
          gameUrl: "https://lichess.org/ZAMs9lOM#31",
        },
      ],
    },
  ];
}
