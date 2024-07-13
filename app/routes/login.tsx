import { useEffect, useState } from "react";
import { useLichessAuth } from "~/auth/lichessAuth";
import {
  signInWithEmailOrUsername,
  signInWithGoogle,
} from "../firebase/authUtils";
import { getFunctions, httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!password || password.length === 0) {
      setMessage("Password is required.");
      return;
    }

    const ERROR_MAP = {
      "auth/user-not-found": "Incorrect email/username or password.",
      "auth/wrong-password": "Incorrect email/username or password.",
      "auth/invalid-email": "Please provide a valid email address.",
      "auth/too-many-requests": "Too many requests. Please try again later.",
    };

    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailOrUsername(identifier, password);
      setMessage("Login successful!");
      window.location.href = "/profile";
    } catch (error) {
      setMessage(ERROR_MAP[error.code] || `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Assuming you want to redirect after successful login
      window.location.href = "/profile";
    } catch (error) {
      setMessage(`Error during Google Sign In: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to Chessguessr
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium leading-6"
              >
                Username or Email
              </label>
              <div className="mt-2">
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          {message && (
            <div className="text-center font-semibold text-red-500 mb-4">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center mt-4  justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="mr-2 h-5 w-5"
            />
            Sign in with Google
          </button>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
