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
import styled from "styled-components";
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
  title: "Chessguessr – Guess the moves",
  description: "Guess the continuation of the chess game",
  "og:title": "Chessguessr – Guess the moves",
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
