import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthProvider/AuthProvider";
import { updateUsername, isUsernameTaken } from "../firebase/utils";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [newUsername, setNewUsername] = useState("");
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState("");

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
      } catch (error) {
        console.error(`Failed to update username: ${error.message}`);
      }

      setMessage("Username updated successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setChanging(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {user.username}!
          </h1>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Username:</span>
              <span className="text-gray-800">{user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 text-xs">Change Username:</label>
              <input
                type="text"
                className="input input-bordered input-primary"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleUsernameChange}
              >
                {changing ? "Updating..." : "Update Username"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 text-center">
          <span className="text-gray-800">You are not logged in.</span>
        </div>
      </div>
    );
  }
}
