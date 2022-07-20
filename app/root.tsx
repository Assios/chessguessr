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
import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

const Content = styled.div`
  flex: 1;
`;

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
  title: "Chessguessr",
  description: "Guess the continuation of the chess game",
  "og:title": "Chessguessr",
  "og:description": "Guess the continuation of the chess game",
  "og:image": "/chessguessr.png",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [tutorial, setTutorial] = useLocalStorage("cg-tutorial", false);

  const [showTutorial, setShowTutorial] = useState(!tutorial);

  const context: any = {
    showTutorial,
    showModal,
    setShowModal,
    setShowTutorial,
    setTutorial,
  };

  return (
    <html data-theme="cupcake" lang="en">
      <head>
        <script
          defer
          data-domain="chessguessr.com"
          src="https://chessguessr-proxy.vercel.app/js/script.js"
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Content>
          <Toaster />
          <Navbar
            setShowTutorial={setShowTutorial}
            setShowModal={setShowModal}
          />
          <Outlet context={context} />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Content>
        <Footer />
      </body>
    </html>
  );
}
