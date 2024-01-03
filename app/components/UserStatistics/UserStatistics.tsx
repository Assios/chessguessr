import StatsCards from "./StatsCards";
import Distribution from "./Distribution";

const UserStatistics = ({ playerStats }) => {
  return (
    <div className="user-statistics">
      <StatsCards playerStats={playerStats} />
      {playerStats?.guesses && (
        <Distribution guessDistribution={playerStats.guesses} />
      )}
    </div>
  );
};

export default UserStatistics;
