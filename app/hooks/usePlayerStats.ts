import { useState, useEffect } from "react";
import { getUserFromFirestore, updateUserStats } from "../firebase/utils";
import { useLocalStorage } from "./useLocalStorage";

export function usePlayerStats(uid: string | null) {
  const defaultStats = {
    gamesPlayed: 0,
    currentStreak: 1,
    lastPlayed: null,
    guesses: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      failed: 0,
    },
  };

  const [localStats, setLocalStats] = useLocalStorage("cg-stats", defaultStats);

  const [playerStats, setPlayerStatsState] = useState(defaultStats);

  const setPlayerStats = (updater: any) => {
    setPlayerStatsState((prevState) => {
      const updatedStats = updater(prevState);

      if (uid) {
        updateUserStats(uid, updatedStats);
      } else {
        setLocalStats(updatedStats);
      }

      return updatedStats;
    });
  };

  useEffect(() => {
    if (uid) {
      const fetchStats = async () => {
        const user = await getUserFromFirestore(uid);
        if (user && user.stats) {
          setPlayerStatsState(user.stats);
        }
      };
      fetchStats();
    } else {
      setPlayerStatsState(localStats);
    }
  }, [uid, localStats]);

  return { playerStats, setPlayerStats };
}
