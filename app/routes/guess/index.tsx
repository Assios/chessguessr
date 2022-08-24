import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { sortBy } from "../../utils/sort";
import dayjs from "dayjs";
import { useNavigate } from "@remix-run/react";
import TutorialModal from "~/components/TutorialModal";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { getPositions } from "~/models/guessGames.server";
import useCountdown from "~/hooks/useCountdown";

export const meta: MetaFunction = () => ({
  title: "Chessguessr Guess the game",
});

export const loader: LoaderFunction = async () => {
  const games = await getPositions();

  const shuffled = games.sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, 4);

  return json({ games: selected });
};

const index = () => {
  const {
    showTutorial,
    setShowTutorial,
    setTutorial,
    setShowNavbarStats,
  }: any = useOutletContext();

  const gPositions = () => {
    return [
      {
        fen: "2R5/5pkp/4pp2/pp6/3bq3/PP1N2P1/3RPP1P/6K1 b - - 0 27",
        white: "Magnus Carlsen",
        black: "Ian Nepomniachtchi",
        date: "2021.12.03",
        event: "FIDE World Championship 2021",
        link: "https://lichess.org/study/Hk9Zzv6o",
      },
      {
        fen: "r1r1k3/pp1qR2p/5pp1/3p2N1/6Q1/8/PP3PPP/2R3K1 b - - 0 22",
        white: "Wilhelm Steinitz",
        black: "Curt von Bardeleben",
        date: "1895.08.17",
        event: "Hastings",
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
        date: "1938.11.14",
        event: "AVRO",
        link: "https://lichess.org/study/Hk9Zzv6o",
      },
      {
        fen: "r3r1k1/pp3pbp/1qp1b1p1/2B5/2BP4/Q1n2N2/P4PPP/3R1K1R w - - 4 18",
        white: "Donald Byrne",
        black: "Bobby Fischer",
        date: "1956.10.17",
        event: "Third Rosenwald Trophy",
        link: "https://lichess.org/study/Hk9Zzv6o",
      },
      {
        fen: "2kr4/ppp1qpp1/2p5/2b2b2/2P1pPP1/1P2P3/PBQPB1p1/RN2K2R w Q - 0 16",
        white: "Bent Larsen",
        black: "Boris Spassky",
        date: "1970.03.31",
        event: "USSR vs. Rest of the World",
        link: "https://lichess.org/study/Hk9Zzv6o",
      },
    ];
  };

  const makeQuiz = (numQuestions: number) => {
    let allQuesitons = gPositions();

    let newQuestions = [];

    return allQuesitons;
  };

  const [intervalValue, setIntervalValue] = useState<number>(1000);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 60,
      intervalMs: intervalValue,
    });

  const { games } = useLoaderData();

  useEffect(() => {
    setShowNavbarStats(false);
  }, []);

  useEffect(() => {
    startCountdown();
  }, []);

  const q = makeQuiz(3);

  console.log("q", q);

  return (
    <div>
      <div>
        <TutorialModal
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setTutorial={setTutorial}
        />
      </div>
      <div className="mt-10 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl font-semibold">{count}</h1>
        </div>

        <div className="mt-10 flex justify-center">
          <Chessboard position={games[1].fen} />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 mb-10">
          {games.map((game) => {
            return (
              <div className="card w-96 border-2 bg-base-100 shadow-xl mb-[-20px]">
                <div className="card-body">
                  <h2 className="card-title">
                    {game.white} – {game.black}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default index;
