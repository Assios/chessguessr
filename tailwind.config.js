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
        lichess: {
          primary: "#373430",
          secondary: "#2E2C29",
          accent: "#393632",
          neutral: "#2E2C29",
          "base-100": "#161512",
          info: "#87C6EE",
          success: "#393632",
          warning: "#F1B24B",
          error: "#EA7175",
        },
      },
      "light",
      "dark",
      "cupcake",
      "night",
    ],
  },
};
