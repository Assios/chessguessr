import { useState } from "react";
import { signInWithEmailOrUsername } from "../firebase/authUtils";

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

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to Chessguessr
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

          <div className="relative mt-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white">
              <span className="text-sm font-semibold leading-6">Twitter</span>
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white">
              <span className="text-sm font-semibold leading-6">GitHub</span>
            </button>
          </div>

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
