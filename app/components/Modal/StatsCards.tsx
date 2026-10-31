import type { PlayerStats } from '~/utils/types';
import { getCurrentStreak } from '~/utils/utils';

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="flex flex-col-reverse rounded-lg bg-base-200 px-2 py-3 text-center">
    <dt className="text-xs opacity-70">{label}</dt>
    <dd className="text-2xl font-bold tabular-nums">{value}</dd>
  </div>
);

const StatsCards = ({ playerStats }: { playerStats: PlayerStats }) => {
  let numWins = 0;

  for (let i = 1; i < 6; i++) {
    numWins += playerStats.guesses[i];
  }

  const winPercentage = Math.round(
    (numWins / (numWins + playerStats.guesses['failed'])) * 100
  );

  return (
    <dl className="grid grid-cols-3 gap-2">
      <Stat label="Played" value={playerStats.gamesPlayed} />
      <Stat
        label="Win %"
        value={playerStats.gamesPlayed ? winPercentage : 0}
      />
      <Stat label="Current streak" value={getCurrentStreak(playerStats)} />
    </dl>
  );
};

export default StatsCards;
