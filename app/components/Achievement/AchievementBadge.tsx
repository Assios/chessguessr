import { Achievement } from "../AuthProvider/AuthProvider";

interface AchievementBadgeProps {
    achievement: Achievement;
    achievedAchievements: string[];
  }
  
  export default function AchievementBadge({
    achievement,
    achievedAchievements,
  }: AchievementBadgeProps) {
    const isAchieved = achievedAchievements.includes(achievement.id);
  
    <div className="achievement-element relative m-4 hover:scale-105 transition-transform duration-200">
      <div className="flex justify-between items-center px-2">
        <p className="achievement-title text-center rounded-md py-1 px-2">
          {achievement.achieved ? achievement.title : "?"}
        </p>
      </div>
      <img
        src={achievement.iconUrl || "default_achievement.png"}
        alt={achievement.title}
        className={`w-16 h-16 mx-auto my-2 ${
          achievement.achieved ? "" : "grayscale"
        }`}
      />
      <p className="achievement-description text-xs text-center bg-gray-800 py-1 px-2 rounded-md absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        {achievement.achieved
          ? achievement.description
          : "Secret until achieved!"}
      </p>
    </div>
  );
}

export default AchievementBadge;
