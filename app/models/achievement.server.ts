export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  achieved: boolean;
}

export async function getAchievements(): Promise<Array<Achievement>> {
  return [
    {
      id: "first-to-solve",
      title: "First to Solve!",
      description: "Be the first player to solve a puzzle.",
      iconUrl: "path.png",
      achieved: false,
    },
  ];
}
