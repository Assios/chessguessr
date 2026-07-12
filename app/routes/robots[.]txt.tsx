import type { LoaderFunction } from "@remix-run/node";

const ORIGIN = "https://chessguessr.com";

export const loader: LoaderFunction = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
