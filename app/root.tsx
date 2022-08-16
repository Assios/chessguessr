import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Plausible from "plausible-tracker";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png",
  },
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chessguessr – Wordle for Chess Games",
  description: "Guess the continuation of the chess game",
  "og:title": "Chessguessr – Wordle for Chess Games",
  "og:description":
    "In this Wordle-inspired game, your task is to guess the continuation of a chess game.",
  "og:image":
    "https://user-images.githubusercontent.com/1413265/179962925-46c12915-e99d-40c0-b92b-82960bdffb16.png",
  "twitter:title": "Chessguessr – Guess the continuation of a chess game",
  "twitter:description":
    "In this Wordle-inspired game, your task is to guess the continuation of a chess game.",
  "twitter:image":
    "https://user-images.githubusercontent.com/1413265/179962925-46c12915-e99d-40c0-b92b-82960bdffb16.png",
  "twitter:card": "summary_large_image",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [wrongTheme, setWrongTheme] = useState(false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const { trackPageview, trackEvent } = Plausible({
    domain: "chessguessr.com",
    apiHost: "https://chessguessr-proxy.vercel.app",
  });

  const context: any = {
    showTutorial,
    showModal,
    setShowModal,
    setShowTutorial,
    setTutorial,
    trackPageview,
    trackEvent,
  };

  useEffect(() => {
    trackPageview();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      localStorage.setItem("theme", "corporate");
      setWrongTheme(true);

      trackEvent("Wrong theme");
    }
  }, []);

  return (
    <html data-theme="corporate" lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Toaster />
          <Navbar
            setShowTutorial={setShowTutorial}
            setShowModal={setShowModal}
          />

          {wrongTheme && (
            <div className="alert alert-warning shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  Warning: Wrong theme detected. Please refresh the page to fix
                  this.
                </span>
              </div>
            </div>
          )}

          <Outlet context={context} />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>
        <Footer />
      </body>
    </html>
  );
}
