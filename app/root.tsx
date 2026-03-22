import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from 'react-router';
import styles from './tailwind.css?url';
import chessgroundBase from 'chessground/assets/chessground.base.css?url';
import chessgroundTheme from 'chessground/assets/chessground.brown.css?url';
import chessgroundPieces from 'chessground/assets/chessground.cburnett.css?url';
import chessgroundOverrides from './styles/chessground.overrides.css?url';
import tileAnimations from './styles/tile-animations.css?url';
import { Navbar } from './components/Navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import { Footer } from './components/Footer';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type PlausibleType from 'plausible-tracker';
import { OutletContextType } from './utils/types';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.png', type: 'image/png' },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: chessgroundBase },
  { rel: 'stylesheet', href: chessgroundTheme },
  { rel: 'stylesheet', href: chessgroundPieces },
  { rel: 'stylesheet', href: chessgroundOverrides },
  { rel: 'stylesheet', href: tileAnimations },
];

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { title: 'Chessguessr – Wordle for Chess Games' },
  {
    name: 'description',
    content:
      'Solve chess puzzles from real games, with the help of Wordle-like hints.',
  },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { property: 'og:title', content: 'Chessguessr – Wordle for Chess Games' },
  {
    property: 'og:description',
    content:
      'In this Wordle-inspired game, your task is to guess the continuation of a chess game.',
  },
  {
    property: 'og:image',
    content:
      'https://user-images.githubusercontent.com/1413265/179962925-46c12915-e99d-40c0-b92b-82960bdffb16.png',
  },
  {
    name: 'twitter:title',
    content: 'Chessguessr – Wordle for Chess Games',
  },
  {
    name: 'twitter:description',
    content:
      'Solve chess puzzles from real games, with the help of Wordle-like hints.',
  },
  {
    name: 'twitter:image',
    content:
      'https://user-images.githubusercontent.com/1413265/179962925-46c12915-e99d-40c0-b92b-82960bdffb16.png',
  },
  { name: 'twitter:card', content: 'summary_large_image' },
];

export function loader() {
  return {
    ENV: {
      CONVEX_URL: process.env.CONVEX_URL,
    },
  };
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html data-theme="corporate" lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="mt-10 mb-20 content-center lg:mb-0">
            <div className="flex flex-row justify-center">
              <h1 className="text-center text-4xl mb-8 font-semibold">
                {error.status}
              </h1>
            </div>
            <p className="max-w-prose m-auto text-center text-lg">
              {error.statusText}
            </p>
            <p className="max-w-prose m-auto text-center text-lg">
              If you think this is an error, you can{' '}
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href="https://github.com/Assios/chessguessr/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                file an issue
              </a>{' '}
              on Github or{' '}
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
          <Scripts />
        </body>
      </html>
    );
  }

  const errorObj = error instanceof Error ? error : new Error('Unknown error');

  return (
    <html data-theme="corporate" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mt-10 mb-20 content-center lg:mb-0">
          <div className="flex flex-row justify-center">
            <h1 className="text-center text-4xl mb-8 font-semibold">
              {errorObj.name}
            </h1>
          </div>
          <p className="max-w-prose m-auto text-center text-lg">
            {errorObj.message}
          </p>
          <p className="max-w-prose m-auto text-center text-lg">
            If this error persists, please{' '}
            <a
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              href="https://github.com/Assios/chessguessr/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              file an issue
            </a>{' '}
            on Github or{' '}
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
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const [showModal, setShowModal] = useState(false);
  const [tutorial, setTutorial] = useLocalStorage('cg-tutorial', false);

  const [showNavbarStats, setShowNavbarStats] = useState(true);

  const [wrongTheme, setWrongTheme] = useState(false);

  // Start hidden on server, check localStorage directly on client to avoid race
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cg-tutorial');
    if (!saved || saved === 'false') {
      setShowTutorial(true);
    }
  }, []);

  const [plausible, setPlausible] = useState<ReturnType<typeof PlausibleType> | null>(null);

  useEffect(() => {
    import('plausible-tracker').then((mod) => {
      const Plausible = mod.default;
      setPlausible(Plausible({
        domain: 'chessguessr.com',
        apiHost: 'https://chessguessr-proxy.vercel.app',
      }));
    });
  }, []);

  const trackPageview = plausible?.trackPageview ?? (() => {});
  const trackEvent = plausible?.trackEvent ?? (() => {});

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
    if (localStorage.getItem('theme') === 'light') {
      localStorage.setItem('theme', 'corporate');
      setWrongTheme(true);
      trackEvent('Wrong theme');
    }

    // Load theme-change after hydration to avoid DOM mismatch
    import('theme-change').then((mod) => {
      mod.themeChange(false);
    });
  }, []);

  // Hide BMC widget when modals are open
  useEffect(() => {
    const bmcWidget = document.getElementById('bmc-wbtn');
    if (bmcWidget) {
      if (showModal || showTutorial) {
        bmcWidget.style.visibility = 'hidden';
      } else {
        bmcWidget.style.removeProperty('visibility');
      }
    }
  }, [showModal, showTutorial]);

  return (
    <html data-theme="corporate" lang="en" suppressHydrationWarning>
      <head>
        <Meta />
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
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__CONVEX_URL = ${JSON.stringify(data.ENV.CONVEX_URL)};`,
            }}
          />
          <Scripts />
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
