/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "inner-lg": "inset 0 5px 20px 0 rgba(0, 0, 0, 0.03)",
      },
      colors: {
        melon: "#fec5bb",
        palepink: "#fcdece",
        mistyrose: "#fae6dd",
        seashell: "#F8EDEB",
        seashellpale: "#fef5f4",
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
