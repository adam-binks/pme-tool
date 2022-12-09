/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "inner-lg": "inset 0 10px 40px 0 rgba(0, 0, 0, 0.15)",
      }
    },
  },
  plugins: [],
}
