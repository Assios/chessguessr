import React, { useState } from "react";
import {
  signUpWithEmailPasswordAndUsername,
  observeAuth,
  isValidUsername,
} from "../firebase/authUtils";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (loading) return;

    if (!email || !isValidEmail(email)) {
      setMessage("Please provide a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setMessage(
        "The password is too short. It should be at least 6 characters."
      );
      return;
    }

    if (!username || !isValidUsername(username)) {
      setMessage(
        "Username should only contain letters and numbers and be at most 16 characters long."
      );
      return;
    }

    const ERROR_MAP = {
      "auth/email-already-in-use":
        "There was an issue with your sign-up. Please try again later, or contact support@chessguessr.com if the problem persists.",
      "auth/invalid-email": "Please provide a valid email address.",
      "auth/weak-password":
        "The password is too weak. Please choose a stronger one.",
    };

    setLoading(true);
    setMessage("");

    try {
      await signUpWithEmailPasswordAndUsername(email, password, username);
      setMessage("Successfully signed up!");
      window.location.href = "/profile";
    } catch (error) {
      setMessage(ERROR_MAP[error.code] || `Error: ${error.message}`);
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
            maxLength={16}
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
        <div className="text-center">
          Already registered?{" "}
          <a href="/login" className="text-blue-500 underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
