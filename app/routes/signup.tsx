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
    <div className="flex justify-center items-center">
      <div className="mt-4 w-full max-w-md p-8 m-4 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-5 text-center">Sign Up</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="username">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-primary w-full max-w-xs"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered input-primary w-full max-w-xs"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered input-primary w-full max-w-xs"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button className="mt-6 btn btn-primary" onClick={handleSignUp}>
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
