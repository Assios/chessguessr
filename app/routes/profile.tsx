import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/AuthProvider/AuthProvider";
import { updateUsername, isUsernameTaken } from "../firebase/utils";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  console.log("u", user);
  const [newUsername, setNewUsername] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState("");
  const [canUpdateUsername, setCanUpdateUsername] = useState(true);
  const [timeLeftToUpdate, setTimeLeftToUpdate] = useState("");

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

  if (user) {
    return (
      <div className="flex justify-center items-center">
        <div className="mt-4 w-full max-w-md p-8 m-4 shadow-md rounded">
          <h1 className="text-2xl font-bold mb-5 text-center">
            Welcome, {user.username}!
          </h1>

          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="label-text">Username:</span>
              <span>{user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="label-text">Email:</span>
              <span>{user.email}</span>
            </div>
          </div>

          <hr className="mb-6" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Update Profile
            </h2>

            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="newUsername">
                <span className="label-text">Change Username:</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-primary w-full max-w-xs"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={!canUpdateUsername}
              />
              <button
                className="mt-4 btn btn-primary"
                onClick={handleUsernameChange}
                disabled={!canUpdateUsername}
              >
                {changing ? "Updating..." : "Update Username"}
              </button>
              {!canUpdateUsername && (
                <div className="mt-4 text-center font-semibold text-red-500 mb-4">
                  {timeLeftToUpdate}
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className="mt-4 text-center font-semibold text-red-500 mb-4">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
          <span>You are not logged in.</span>
        </div>
      </div>
    );
  }
}
