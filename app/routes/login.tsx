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
    <div className="flex justify-center items-center">
      <div className="mt-4 w-full max-w-md p-8 m-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label" htmlFor="identifier">
            <span className="label-text">Username or Email:</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-primary w-full max-w-xs"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
          <button
            type="submit"
            className="mt-6 btn btn-primary"
            onClick={handleSubmit}
          >
            {loading ? "Logging in..." : "Login"}
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
