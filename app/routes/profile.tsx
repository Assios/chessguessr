import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider/AuthProvider";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.username}!</h1>
        <ul>
          <li>Username: {user.username}</li>
          <li>Email: {user.email}</li>
        </ul>
      </div>
    );
  } else {
    return <div>You are not logged in.</div>;
  }
}
