/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "inner-lg": "inset 0 10px 40px 0 rgba(0, 0, 0, 0.15)",
      },
      colors: {
        melon: "#fec5bb",
        palepink: "#fcd5ce",
        mistyrose: "#fae1dd",
        seashell: "#f8edeb",
        platinum: "#e8e8e4",
        platchrome: "#d8e2dc",
        linen: "#ece4db",
        silk: "#ffe5d9",
        peachpuff: "#ffd7ba",
        peachcrayon: "#fec89a",
        darkplatinum: "#5E806C",
      },
    },
  },
  plugins: [],
}
