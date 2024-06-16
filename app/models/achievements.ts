export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  achieved: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first-to-solve",
    title: "Sprinter",
    description: "Be the first to solve a daily Chessguessr.",
    iconUrl: "achievements/first.svg",
    achieved: false,
  },
  {
    id: "solve-any",
    title: "Guessr!",
    description: "Solve a daily Chessguessr.",
    iconUrl: "achievements/first.svg",
    achieved: false,
  },
];
