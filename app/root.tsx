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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chessguessr",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html data-theme="cupcake" lang="en">
      <head>
        <script
          defer
          data-domain="chessguessr.com"
          src="https://chessguessr-proxy.vercel.app/js/script.js"
        ></script>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <Toaster />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/*<Footer />*/}
      </body>
    </html>
  );
}
