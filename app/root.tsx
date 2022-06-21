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
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { Footer } from "./components/Footer";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body style={{ backgroundColor: "#ced9eb" }}>
        <Toaster />
        <Navbar fixed={false} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
