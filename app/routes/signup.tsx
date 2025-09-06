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

  const handleSignUp = async (e) => {
    e.preventDefault();

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

    const ERROR_MAP: Record<string, string> = {
      "auth/email-already-in-use":
        "There was an issue with your sign-up. Please try again later, or contact support@chessguessr.com if the problem persists.",
      "auth/invalid-email": "Please provide a valid email address.",
      "auth/weak-password":
        "The password is too weak. Please choose a stronger one.",
      "auth/operation-not-allowed":
        "Email/password sign-in is disabled for this project. Please enable it in Firebase Console → Authentication → Sign-in method.",
      "auth/unauthorized-domain":
        "This origin is not authorized for Firebase Auth. Please use http://localhost:3000 in development or add this domain in Firebase Console → Authentication → Settings → Authorized domains.",
      "auth/invalid-api-key":
        "The Firebase API key is invalid or restricted. Verify the key in app/firebase/firebaseConfig.ts and API restrictions in Google Cloud Console.",
      "auth/network-request-failed":
        "Network error while contacting Firebase. Check your connection and try again.",
    };

    setLoading(true);
    setMessage("");

    try {
      await signUpWithEmailPasswordAndUsername(email, password, username);
      setMessage("Successfully signed up!");
      window.location.href = "/profile";
    } catch (error: any) {
      console.error("Signup error", error);
      setMessage(ERROR_MAP[error?.code] || `Error: ${error?.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign up for Chessguessr
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  maxLength={16}
                  className="input input-bordered block w-full border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered block w-full border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered block w-full border-0 py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {message && (
            <div className="text-center font-semibold text-red-500 mb-4">
              {message}
            </div>
          )}

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
