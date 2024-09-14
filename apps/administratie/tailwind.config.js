const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: ['highlight'],
  theme: {
    extend: {
      colors: {
        primary: '#0E294B',
        secondary: {
          100: '#CCD7E5',
          500: '#5B7FAC',
        },
        background: '#E5E5E5',
        highlight: '#EF8F5A',
        success: {
          100: '#EDF9F3',
          500: '#48BD84',
          600: '#3A976A',
        },
      },
      width: {
        '6xl': '72rem',
        '5xl': '64rem',
        '4xl': '56rem',
        '3xl': '48rem',
      },
    },
  },
  plugins: [],
};
