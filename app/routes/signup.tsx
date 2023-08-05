import React, { useState } from "react";
import {
  signUpWithEmailPasswordAndUsername,
  observeAuth,
} from "../firebase/authUtils";
import { User } from "firebase/auth";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await signUpWithEmailPasswordAndUsername(email, password, username);
      setMessage("Successfully signed up!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-5 text-center">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={handleSignUp}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        {message && (
          <div className="text-center font-semibold text-red-500">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
