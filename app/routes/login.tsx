import { useState } from "react";
import { signInWithEmailOrUsername } from "../firebase/authUtils";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailOrUsername(identifier, password);
      setMessage("Login successful!");

      window.location.href = "/profile";
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 m-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>

        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="identifier"
            >
              Username or Email:
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className={`btn ${loading ? "btn-primary loading" : "btn-blue"}`}
            >
              Login
            </button>
          </div>

          {message && (
            <div className="text-center font-semibold text-red-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
