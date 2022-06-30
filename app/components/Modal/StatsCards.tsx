import React from "react";
import { BiTrendingUp } from "react-icons/bi";

const StatsCards = ({ playerStats }) => {
  const numWins =
    playerStats.guesses[1] +
    playerStats.guesses[2] +
    playerStats.guesses[3] +
    playerStats.guesses[4] +
    playerStats.guesses[5];

  const winPercentage = Math.round(
    (numWins / (numWins + playerStats.guesses["failed"])) * 100
  );

  console.log("stats", playerStats);

  return (
    <div className="stats shadow flex flex-col md:flex-row">
      <div className="stat m-2">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div className="stat-title">Games played</div>
        <div className="stat-value text-primary">{playerStats.gamesPlayed}</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary"></div>
        <div className="stat-title">Win %</div>
        <div className="stat-value text-secondary">{winPercentage}%</div>
        <div className="stat-desc">Ratio of games you've solved</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="stat-title">Current streak</div>
        <div className="stat-value text-primary">
          {playerStats.currentStreak}
        </div>
        <div className="stat-desc">Number of games solved in a row</div>
      </div>
    </div>
  );
};

export default StatsCards;
