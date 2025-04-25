/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'color-100': '#9D4EDD',
        'color-200': '#7B2CBF',
        'color-300': '#5A189A',
        'color-400': '#C77DFF',
        'color-500': '#3C096C',
        'color-600': '#240046',
        'color-700': '#10002B',
        'color-main': '#C77DFF',
        'color-gray': '#c5c6d0',
      },
    },
  },
  plugins: [],
};
