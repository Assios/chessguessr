import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ImageResponse } from "@vercel/og";

const param = (value: string | string[] | undefined, max: number) =>
  (Array.isArray(value) ? value[0] : value || "").slice(0, max);

const SQUARE_COLORS = ["#22c55e", "#22c55e", "#eab308", "#3b82f6", "#9ca3af"];

const card = (fen: string, white: string, black: string, label: string) => {
  const boardUrl =
    "https://images.weserv.nl/?url=" +
    encodeURIComponent(
      `lichess1.org/export/fen.gif?fen=${fen}&theme=brown&piece=cburnett`
    ) +
    "&w=534&h=534&fit=contain&output=png";

  const nameSize = Math.max(white.length, black.length) > 24 ? 34 : 40;

  const squares = SQUARE_COLORS.map((color) => ({
    type: "div",
    props: {
      style: {
        width: 30,
        height: 30,
        borderRadius: 6,
        background: color,
        marginRight: 10,
      },
    },
  }));

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#262421",
        padding: 48,
        alignItems: "center",
      },
      children: [
        {
          type: "img",
          props: {
            src: boardUrl,
            width: 534,
            height: 534,
            style: { borderRadius: 16 },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 534,
              paddingLeft: 56,
              flex: 1,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    {
                      type: "div",
                      props: { style: { display: "flex" }, children: squares },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 62,
                          color: "#ffffff",
                          marginTop: 20,
                          letterSpacing: -1,
                        },
                        children: "Chessguessr",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 28,
                          color: "#f59e0b",
                          marginBottom: 14,
                        },
                        children: label,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: nameSize,
                          color: "#ffffff",
                          lineHeight: 1.3,
                        },
                        children: white,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: nameSize,
                          color: "#ffffff",
                          lineHeight: 1.3,
                          display: "flex",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: { color: "#9ca3af", marginRight: 14 },
                              children: "vs.",
                            },
                          },
                          { type: "span", props: { children: black } },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    background: "#f59e0b",
                    color: "#262421",
                    fontSize: 26,
                    whiteSpace: "nowrap",
                    padding: "18px 32px",
                    borderRadius: 999,
                    alignSelf: "flex-start",
                  },
                  children: "Can you guess the next 5 moves?",
                },
              },
            ],
          },
        },
      ],
    },
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fen = param(req.query.fen, 100);
  const white = param(req.query.w, 40);
  const black = param(req.query.b, 40);
  const num = param(req.query.num, 6);
  const date = param(req.query.date, 30);

  if (!/^[pnbrqkPNBRQK1-8/]+$/.test(fen) || !white || !black) {
    res.status(400).send("Bad request");
    return;
  }

  const label = num ? `#${num}${date ? ` · ${date}` : ""}` : date;

  // Satori accepts plain element objects; the ReactElement type is only nominal.
  const image = new ImageResponse(card(fen, white, black, label) as any, {
    width: 1200,
    height: 630,
  });
  const buffer = Buffer.from(await image.arrayBuffer());

  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    "public, max-age=86400, s-maxage=31536000, immutable"
  );
  res.status(200).send(buffer);
}
