import { useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { getGravatarUrlWithDefault, isValidPlayerStats } from "~/utils/utils";
import { AuthContext } from "../../components/AuthProvider/AuthProvider";
import {
  updateUsername,
  isUsernameTaken,
  importStatsFromLocalStorage,
} from "../../firebase/utils";
import trianglify from "trianglify";

import { EnvelopeIcon } from "@heroicons/react/20/solid";

function generateBackground(emailHash: string) {
  const seedNumber = Array.from(emailHash).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  const colors = ["#4b6bfc", "#fbbd25", "#11b97f"];
  const shuffledColors = colors
    .slice(seedNumber % colors.length)
    .concat(colors.slice(0, seedNumber % colors.length));

  const cellSize = 20 + (seedNumber % 181);
  const variance = 0.1 + 0.8 * ((seedNumber % 100) / 100);

  const pattern = trianglify({
    width: 1920,
    height: 600,
    seed: emailHash,
    cellSize: cellSize,
    variance: variance,
    palette: {
      default: shuffledColors,
    },
  });

  const canvas = pattern.toCanvas();
  return canvas.toDataURL("image/png");
}

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [newUsername, setNewUsername] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState("");
  const [canUpdateUsername, setCanUpdateUsername] = useState(true);
  const [timeLeftToUpdate, setTimeLeftToUpdate] = useState("");
  const [localStats, setLocalStats] = useLocalStorage("cg-stats", null);

  const [importedDate, setImportedDate] = useState<string | null>(null);

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
        setMessage("Username cannot be empty.");
        return;
      }

      if (await isUsernameTaken(newUsername)) {
        setMessage("Username is already taken.");
        return;
      }

      try {
        await updateUsername(user.uid, newUsername);

        updateUser({
          ...user,
          username: newUsername,
        });

        setMessage("Username updated successfully!");
      } catch (error) {
        console.error(`Failed to update username: ${error.message}`);

        setMessage(`Failed to update username: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setChanging(false);
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
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            {profile && (
              <>
                <div className="flex">
                  <div
                    className="tooltip"
                    data-tip="Profile picture fetched from Gravatar using your email. Update it on gravatar.com."
                  >
                    <img
                      className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                      src={profile.avatar}
                      alt=""
                    />
                  </div>
                </div>
                <div className="mt-6 min-w-0 flex-1 sm:pb-1">
                  <h1 className="truncate text-2xl font-bold">
                    {profile.name}
                  </h1>
                  <div className="flex flex-row items-center space-x-2 mt-4">
                    <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="space-y-4 mt-8">
            {!importedDate && localStats && (
              <div className="p-6 rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-bold mb-4">
                  Import your game stats
                </h2>
                <p className="text-gray-600">
                  If you've been playing Chessguessr, your stats are saved in
                  your browser. By importing them, you can keep them safe on
                  your account and access them on any device. Please note, stats
                  can be imported only once.
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Your Local Stats:</h3>
                  <ul className="list-disc ml-4 text-gray-600">
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={importLocalStorageStats}
                  >
                    Import Stats to Account
                  </button>
                </div>
              </div>
            )}
            {message && (
              <div className="p-6 rounded-lg shadow-sm bg-white text-center font-semibold text-red-500 mb-4">
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
