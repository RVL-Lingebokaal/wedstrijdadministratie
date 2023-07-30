/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E294B",
        secondary: "#5B7FAC",
        background: "#E5E5E5",
      },
      width: {
        "6xl": "72rem",
      },
    },
  },
  plugins: [],
};
