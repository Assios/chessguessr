// lichessAuth.ts
import { useState } from "react";
import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";

interface Me {
  id: string;
  username: string;
  httpClient: HttpClient; // with pre-set Authorization header
  perfs: { [key: string]: any };
}

const lichessHost = "https://lichess.org";
const scopes = ["board:play"];
const clientId = "test-chessguessr"; // replace with your actual client ID
const clientUrl = "http://localhost:3000"; // use the current origin

export function useLichessAuth() {
  const [user, setUser] = useState<Me | null>(null);

  const oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId,
    scopes,
    redirectUrl: clientUrl,
    onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
    onInvalidGrant: console.warn,
  });

  const login = async () => {
    await oauth.fetchAuthorizationCode();
  };

  const logout = async () => {
    if (user) {
      await user.httpClient(`${lichessHost}/api/token`, { method: "DELETE" });
      localStorage.clear();
      setUser(null);
    }
  };

  const authenticate = async () => {
    const httpClient = oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const userData = await res.json();

    if (userData.error) {
      throw userData.error;
    }

    setUser({
      ...userData,
      httpClient,
    });
  };

  return {
    user,
    login,
    logout,
    authenticate,
  };
}
