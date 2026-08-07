/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      largemobile: "640px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      wide: "1536px",
      ultrawide: "1920px",
      "4k": "2560px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333ea', // Purple 600
          dark: '#7e22ce', // Purple 700
          light: '#a855f7', // Purple 500
        },
        dark: {
          DEFAULT: '#111111',
          secondary: '#1f1f1f',
          lighter: '#2d2d2d',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
