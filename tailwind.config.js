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
  plugins: [require("daisyui")],
};
