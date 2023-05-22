/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        mogra: ['var(--font-mogra)']
      },
    }
  },
  plugins: []
};
