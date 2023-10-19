/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["highlight"],
  theme: {
    extend: {
      colors: {
        primary: "#0E294B",
        secondary: {
          100: "#CCD7E5",
          500: "#5B7FAC",
        },
        background: "#E5E5E5",
        highlight: "#EF8F5A",
        success: {
          100: "#EDF9F3",
          500: "#48BD84",
          600: "#3A976A",
        },
      },
      width: {
        "6xl": "72rem",
        "5xl": "64rem",
        "4xl": "56rem",
        "3xl": "48rem",
      },
    },
  },
  plugins: [],
};
