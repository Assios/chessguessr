import type { LoaderFunction } from "@remix-run/node";
import { getGames } from "~/models/game.server";

const ORIGIN = "https://www.chessguessr.com";

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
};

export const loader: LoaderFunction = async () => {
  const today = new Date().toISOString().split("T")[0];
  const games = await getGames();

  // Today's game lives at "/" (its /games/:id route 301s there) and future
  // games 404, so only include strictly-past games as their own URLs.
  const pastGames = games.filter((game) => game.date < today);

  const staticUrls: SitemapUrl[] = [
    { loc: `${ORIGIN}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${ORIGIN}/games`, changefreq: "daily", priority: "0.8" },
    { loc: `${ORIGIN}/privacy`, changefreq: "yearly", priority: "0.2" },
  ];

  const gameUrls: SitemapUrl[] = pastGames.map((game) => ({
    loc: `${ORIGIN}/games/${game.id}`,
    lastmod: game.date,
    changefreq: "monthly",
    priority: "0.6",
  }));

  const urls = [...staticUrls, ...gameUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
