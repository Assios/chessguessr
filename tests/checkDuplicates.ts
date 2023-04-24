import { getGames } from "../app/models/game.server";

(async () => {
  const games = await getGames();
  const dateMap = new Map<string, number>();
  const idMap = new Map<number, number>();
  const fenMap = new Map<string, number>();

  for (const game of games) {
    const date = game.date;
    const id = game.id;
    const fen = game.fen;

    const dateCount = dateMap.get(date) || 0;
    const idCount = idMap.get(id) || 0;
    const fenCount = fenMap.get(fen) || 0;

    if (dateCount >= 1) {
      throw new Error(`Duplicate date detected: ${date}`);
    }
    if (idCount >= 1) {
      throw new Error(`Duplicate ID detected: ${id}`);
    }
    if (fenCount >= 1) {
      throw new Error(`Duplicate position detected: ${fen}`);
    }

    dateMap.set(date, dateCount + 1);
    idMap.set(id, idCount + 1);
    fenMap.set(fen, fenCount + 1);
  }

  console.log("No duplicate dates, IDs, or positions found!");
})().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
