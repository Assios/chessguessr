import type {
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from "@remix-run/react";
import styles from "./tailwind.css";
import chessgroundBase from "chessground/assets/chessground.base.css";
import chessgroundTheme from "chessground/assets/chessground.brown.css";
import chessgroundPieces from "chessground/assets/chessground.cburnett.css";
import chessgroundOverrides from "./styles/chessground.overrides.css";
import tileAnimations from "./styles/tile-animations.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { Footer } from "./components/Footer";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Plausible from "plausible-tracker";
import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { OutletContextType } from "./utils/types";

export const CANONICAL_ORIGIN = "https://www.chessguessr.com";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_ORIGIN}/#website`,
      url: `${CANONICAL_ORIGIN}/`,
      name: "Chessguessr",
      description:
        "Solve chess puzzles from real games, with the help of Wordle-like hints.",
    },
    {
      "@type": "VideoGame",
      name: "Chessguessr",
      url: `${CANONICAL_ORIGIN}/`,
      applicationCategory: "GameApplication",
      genre: "Puzzle",
      gamePlatform: "Web browser",
      operatingSystem: "Any",
      description:
        "A daily Wordle-inspired chess game: guess the next five moves played in a real game.",
      author: { "@type": "Person", name: "Assios" },
    },
  ],
};

// Escape "<" so the JSON can't break out of the <script> tag.
const jsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

// Applies the saved theme before first paint so deferring the theme-change
// library below doesn't cause a flash of the default theme.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='corporate'||t==='lichess-dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.png",
    type: "image/png",
  },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: chessgroundBase },
  { rel: "stylesheet", href: chessgroundTheme },
  { rel: "stylesheet", href: chessgroundPieces },
  { rel: "stylesheet", href: chessgroundOverrides },
  { rel: "stylesheet", href: tileAnimations },
];

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }: { error: Error }) => {
  return (
    <html data-theme="corporate" lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js" integrity="sha384-9l0HtvnB08o05/gpJ0/s/MH6b4qnQsdwaxyvtOJY/j8yiQWS1kAmsRQVMgKxcREb" crossOrigin="anonymous"></script>
        <Meta />
        <Links />
              </head>
      <div className="mt-10 mb-20 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl mb-8 font-semibold">
            {error.name}
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          {error.message}
        </p>
        <p className="max-w-prose m-auto text-center text-lg">
          If this error persists, please{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://github.com/Assios/chessguessr/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            file an issue
          </a>{" "}
          on Github or{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://lichess.org/inbox/Assios"
            target="_blank"
            rel="noopener noreferrer"
          >
            contact Assios on Lichess
          </a>
          .
        </p>
      </div>
    </html>
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <html data-theme="corporate" lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js" integrity="sha384-9l0HtvnB08o05/gpJ0/s/MH6b4qnQsdwaxyvtOJY/j8yiQWS1kAmsRQVMgKxcREb" crossOrigin="anonymous"></script>
        <Meta />
        <Links />
              </head>
      <div className="mt-10 mb-20 content-center lg:mb-0">
        <div className="flex flex-row justify-center">
          <h1 className="text-center text-4xl mb-8 font-semibold">
            {caught.status}
          </h1>
        </div>
        <p className="max-w-prose m-auto text-center text-lg">
          {caught.statusText}
        </p>
        <p className="max-w-prose m-auto text-center text-lg">
          If you think this is an error, you can{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://github.com/Assios/chessguessr/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            file an issue
          </a>{" "}
          on Github or{" "}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href="https://lichess.org/inbox/Assios"
            target="_blank"
            rel="noopener noreferrer"
          >
            contact Assios on Lichess
          </a>
          .
        </p>
      </div>
    </html>
  );
};

export const meta: MetaFunction = ({ location }) => ({
  charset: "utf-8",
  title: "Chessguessr – Wordle for Chess Games",
  description:
    "Solve chess puzzles from real games, with the help of Wordle-like hints.",
  "og:title": "Chessguessr – Wordle for Chess Games",
  "og:description":
    "In this Wordle-inspired game, your task is to guess the continuation of a chess game.",
  "og:image": `${CANONICAL_ORIGIN}/og-image.png`,
  "og:url": `${CANONICAL_ORIGIN}${location?.pathname ?? "/"}`,
  "og:type": "website",
  "og:site_name": "Chessguessr",
  "twitter:title": "Chessguessr – Wordle for Chess Games",
  "twitter:description":
    "Solve chess puzzles from real games, with the help of Wordle-like hints.",
  "twitter:image": `${CANONICAL_ORIGIN}/og-image.png`,
  "twitter:card": "summary_large_image",
  "twitter:site": "@chessguessr",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const location = useLocation();
  const canonical = `${CANONICAL_ORIGIN}${location.pathname}`;

  const [showModal, setShowModal] = useState(false);
  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showNavbarStats, setShowNavbarStats] = useState(true);

  const [wrongTheme, setWrongTheme] = useState(false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const { trackPageview, trackEvent } = Plausible({
    domain: "chessguessr.com",
    apiHost: "https://chessguessr-proxy.vercel.app",
  });

  const context: OutletContextType = {
    showTutorial,
    showModal,
    setShowModal,
    setShowTutorial,
    setTutorial,
    trackPageview,
    trackEvent,
    showNavbarStats,
    setShowNavbarStats,
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

  // Hide BMC widget when modals are open
  useEffect(() => {
    const bmcWidget = document.getElementById("bmc-wbtn");
    if (bmcWidget) {
      if (showModal || showTutorial) {
        bmcWidget.style.visibility = "hidden";
      } else {
        bmcWidget.style.removeProperty("visibility");
      }
    }
  }, [showModal, showTutorial]);

  return (
    <html data-theme="corporate" lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"
          integrity="sha384-9l0HtvnB08o05/gpJ0/s/MH6b4qnQsdwaxyvtOJY/j8yiQWS1kAmsRQVMgKxcREb"
          crossOrigin="anonymous"
        ></script>
        <Meta />
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
        <Links />
              </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Toaster />
          <Navbar
            setShowTutorial={setShowTutorial}
            setShowModal={setShowModal}
            showNavbarStats={showNavbarStats}
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="assios"
          data-description="Support me on Buy me a coffee!"
          data-message=""
          data-color="#FF813F"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        />
      </body>
    </html>
  );
}
