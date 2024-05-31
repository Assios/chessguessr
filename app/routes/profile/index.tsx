import { useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import {
  formatDate,
  generateBackground,
  getGravatarUrlWithDefault,
  isValidPlayerStats,
} from "~/utils/utils";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import {
  updateUsername,
  isUsernameTaken,
  importStatsFromLocalStorage,
  getUserActivities,
} from "../../firebase/utils";
import { achievements, Achievement } from "~/models/achievements";
import { EnvelopeIcon, PencilIcon } from "@heroicons/react/20/solid";
import { AiFillStar } from "react-icons/ai";
import { FaTrophy } from "react-icons/fa";

interface Activity {
  type: string;
  url: string;
  puzzleId: string;
  status: string;
  message: string;
  timestamp: Date;
}

function xpNeededForNextLevel(level) {
  return Math.pow(2, level) * 100;
}

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [newUsername, setNewUsername] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState("");
  const [showUsernameChange, setShowUsernameChange] = useState(false);
  const [canUpdateUsername, setCanUpdateUsername] = useState(true);
  const [timeLeftToUpdate, setTimeLeftToUpdate] = useState("");
  const [localStats, setLocalStats] = useLocalStorage("cg-stats", null);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);

  const [importedDate, setImportedDate] = useState<string | null>(null);

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserActivities(user.uid).then((data) => {
        setActivities(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.achievements) {
      const userAchievementsData = achievements.filter((ach) =>
        user.achievements.includes(ach.id)
      );
      setUserAchievements(userAchievementsData);
    }
  }, [user]);

  const activityIcon = (type: string) => {
    switch (type) {
      case "signup":
        return (
          <EnvelopeIcon className="h-5 w-5 text-white" aria-hidden="true" />
        );
      case "firstSolver":
        return <AiFillStar className="h-5 w-5 text-white" aria-hidden="true" />;
      default:
        return <FaTrophy className="h-5 w-5 text-white" aria-hidden="true" />;
    }
  };

  useEffect(() => {
    if (user && user.importedLocalStorageDate) {
      setImportedDate(user.importedLocalStorageDate);
    }
  }, [user]);

  const importLocalStorageStats = async () => {
    if (importedDate) {
      toast.error(
        `You've already imported stats on ${new Date(
          importedDate
        ).toLocaleDateString()}.`
      );
      return;
    }

    const localStatsStr = localStorage.getItem("cg-stats");
    if (!localStatsStr) {
      toast.error("No stats found in localStorage.");
      return;
    }

    const parsedLocalStats = JSON.parse(localStatsStr);

    if (!isValidPlayerStats(parsedLocalStats)) {
      toast.error("Invalid or missing stats in local storage.");
      return;
    }

    try {
      await importStatsFromLocalStorage(user.uid, parsedLocalStats);
      setImportedDate(new Date().toISOString());

      toast.success(
        "Your game stats have been successfully imported to your account!"
      );
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user && user.lastUpdatedUsername) {
      const lastUpdated = user.lastUpdatedUsername.toDate();
      const now = new Date();
      const monthInMilliseconds = 30 * 24 * 60 * 60 * 1000;

      if (now.getTime() - lastUpdated.getTime() < monthInMilliseconds) {
        setCanUpdateUsername(false);

        const timeLeft = new Date(lastUpdated.getTime() + monthInMilliseconds);
        setTimeLeftToUpdate(
          `You can update your username again on ${timeLeft.toLocaleDateString()}.`
        );
      }
    }
  }, [user]);

  const handleUsernameChange = async () => {
    if (changing) return;

    setChanging(true);

    try {
      if (newUsername === "") {
        toast.error("Username cannot be empty.", { duration: 2500 });
        return;
      }

      if (await isUsernameTaken(newUsername)) {
        toast.error("Username is already taken.", { duration: 2500 });
        return;
      }

      await updateUsername(user.uid, newUsername);

      updateUser({
        ...user,
        username: newUsername,
      });

      toast.success("Username updated successfully!", { duration: 2500 });
    } catch (error) {
      console.error(`Failed to update username: ${error.message}`);
      toast.error(`Failed to update username: ${error.message}`, {
        duration: 2500,
      });
    } finally {
      setChanging(false);
      setShowUsernameChange(false);
    }
  };

  const profile = user
    ? {
        name: user.username,
        email: user.email,
        avatar: getGravatarUrlWithDefault(user, 300),
        backgroundImage: generateBackground(user.emailHash), // replace with a user background link if any
      }
    : null;

  function groupByDate(activities) {
    return activities.reduce((acc, activity) => {
      const dateStr = formatDate(activity.timestamp);
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(activity);
      return acc;
    }, {});
  }
  const groupedActivities: Record<string, Activity[]> = groupByDate(activities);

  if (user) {
    return (
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={profile ? profile.backgroundImage : ""}
            alt=""
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={profile.avatar}
                alt="Avatar"
              />
            </div>
            <div className="mt-6 min-w-0 flex-1 sm:pb-1">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile.name}
                    <button
                      onClick={() => setShowUsernameChange(!showUsernameChange)}
                      className="ml-2 text-sm btn btn-ghost btn-xs"
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </h1>
                  <div className="flex flex-row items-center space-x-2 mt-4">
                    <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                </div>
                {showUsernameChange && (
                  <div className="flex items-center mb-8">
                    <input
                      type="text"
                      className="input input-bordered input-sm max-w-xs"
                      placeholder="New username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button
                      onClick={handleUsernameChange}
                      className="btn btn-primary btn-sm ml-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setShowUsernameChange(false)}
                      className="btn btn-ghost btn-sm ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className={"mt-2 h-6"}></div>
            </div>
          </div>

          <div className="mt-8">
            {!importedDate && localStats && (
              <div className="p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">
                  Import your game stats
                </h2>
                <p>
                  If you've been playing Chessguessr, your stats are saved in
                  your browser. By importing them, you can keep them safe on
                  your account and access them on any device. Please note, stats
                  can be imported only once.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Your Local Stats:</h3>
                  <ul className="list-disc ml-4">
                    <li>Games Played: {localStats.gamesPlayed}</li>
                    <li>Current Streak: {localStats.currentStreak}</li>
                    <li>Guess distribution:</li>
                    <ul className="list-disc ml-6">
                      <li>1: {localStats.guesses["1"]}</li>
                      <li>2: {localStats.guesses["2"]}</li>
                      <li>3: {localStats.guesses["3"]}</li>
                      <li>4: {localStats.guesses["4"]}</li>
                      <li>5: {localStats.guesses["5"]}</li>
                    </ul>
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={importLocalStorageStats}
                  >
                    Import Stats to Account
                  </button>
                </div>
              </div>
            )}
            <div className="mt-6 shadow overflow-hidden rounded-lg max-w-2xl mx-auto mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-semibold leading-6 font-medium">
                  Activity
                </h2>
              </div>
              <div className="flow-root px-4 pb-5 sm:px-6">
                <ul role="list" className="-mb-8">
                  {Object.entries(groupedActivities).map(
                    ([date, dateActivities]) => (
                      <li key={date}>
                        <h3 className="text-md font-semibold mb-4">{date}</h3>
                        {dateActivities.map((event, eventIdx) => (
                          <div key={eventIdx} className="relative pb-8">
                            {eventIdx !== dateActivities.length - 1 ? (
                              <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-300"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-blue-500">
                                  {activityIcon(event.type)}
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  {event.type === "firstSolver" ? (
                                    <p className="text-sm">
                                      First to solve{" "}
                                      <a
                                        href={event.url}
                                        className="text-blue-600 hover:underline"
                                      >
                                        Chessguessr #{event.puzzleId}
                                      </a>
                                    </p>
                                  ) : event.type === "playedDaily" ? (
                                    <p className="text-sm">
                                      Played{" "}
                                      <a
                                        href={event.url}
                                        className="text-blue-600 hover:underline"
                                      >
                                        Chessguessr #{event.puzzleId}
                                      </a>{" "}
                                      {event.status === "solved" ? (
                                        <span className="ml-2 text-green-500">
                                          ✅
                                        </span>
                                      ) : (
                                        <span className="ml-2 text-red-500">
                                          ❌
                                        </span>
                                      )}
                                    </p>
                                  ) : (
                                    <p className="text-sm">{event.message}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 shadow overflow-hidden rounded-lg max-w-2xl mx-auto mb-8">
              <div className="px-4 py-5 sm:px-6 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <ul role="list" className="space-y-4">
                  {userAchievements.length > 0 ? (
                    userAchievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4"
                      >
                        {achievement.iconUrl ? (
                          <img
                            src={achievement.iconUrl}
                            alt={achievement.title}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {achievement.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-600">
                            {achievement.title}
                          </h3>
                          {achievement.description && (
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-500">
                      No achievements earned yet.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {message && (
              <div className="p-6 rounded-lg shadow-sm text-center font-semibold text-red-500 mb-4">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-xl shadow-md w-96 text-center">
          <span>You are not logged in.</span>
        </div>
      </div>
    );
  }
}