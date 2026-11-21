/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        steel: {
          bg: '#0b0c0e',
          surface: '#14161a',
          card: 'rgba(24, 26, 31, 0.74)',
          'card-hover': 'rgba(34, 37, 44, 0.86)',
          silver: '#d4d4d8',
          yellow: '#facc15',
          'yellow-bright': '#fde047',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'liquid-flow': 'liquidFlow 16s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        liquidFlow: {
          '0%': { transform: 'scale(1) translate(0px, 0px) rotate(0deg)' },
          '50%': { transform: 'scale(1.12) translate(26px, -18px) rotate(8deg)' },
          '100%': { transform: 'scale(0.96) translate(-18px, 18px) rotate(-6deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
