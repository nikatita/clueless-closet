/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        blush: {
          50:  '#fff0f3',
          100: '#ffe0e8',
          200: '#ffc1d1',
          400: '#ff6b9d',
          600: '#e63976',
        },
        cream: '#fdf6f0',
      }
    },
  },
  plugins: [],
}