/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        22: "5.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        "lichess-light": {
          primary: "#F1F1F1",
          secondary: "#4D4D4D",
          accent: "#F0F0F0",
          neutral: "#4D4D4D",
          "base-100": "#EDEBE8",
          info: "#87C6EE",
          success: "#F0F0F0",
          warning: "#F1B24B",
          error: "#EA7175",
        },
      },
      {
        "lichess-dark": {
          primary: "#373430",
          secondary: "#2E2C29",
          accent: "#393632",
          neutral: "#2E2C29",
          "base-100": "#161512",
          info: "#87C6EE",
          success: "#629923",
          warning: "#BF811E",
          error: "#EA7175",
        },
      },
      "light",
      "dark",
      "cupcake",
      "night",
      "corporate",
    ],
  },
};
