import dayjs from "dayjs";

const ORIGIN = "https://www.chessguessr.com";

type OgGame = {
  id: number;
  date: string;
  fen: string;
  white: string;
  black: string;
  wAka?: string;
  bAka?: string;
  wRating?: number | string | null;
  bRating?: number | string | null;
};

const playerLabel = (
  name: string,
  aka?: string,
  rating?: number | string | null
) => `${aka || name}${rating ? ` (${rating})` : ""}`;

export const boardOgImage = (game: OgGame) => {
  const params = new URLSearchParams({
    fen: game.fen.split(" ")[0],
    w: playerLabel(game.white, game.wAka, game.wRating),
    b: playerLabel(game.black, game.bAka, game.bRating),
    num: String(game.id),
    date: dayjs(game.date).format("MMMM D, YYYY"),
  });
  return `${ORIGIN}/api/og?${params.toString()}`;
};
