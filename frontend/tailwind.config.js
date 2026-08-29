/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
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
        // Ink & Ember — noise resolves into signal.
        ink: '#0B0B0C',
        graphite: '#16161A',
        bone: '#EDEAE3',
        ash: '#8B8880',
        ember: {
          DEFAULT: '#FF4D1C',
          dim: '#C63A13',
        },

        // `dark-lighter` is still the surface behind inline code in articles.
        dark: {
          DEFAULT: '#0B0B0C',
          secondary: '#16161A',
          lighter: '#22222A',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        meta: '0.22em',
      },
    },
  },
  plugins: [],
}
