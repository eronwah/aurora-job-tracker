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
        aurora: {
          bg: '#08040d',
          card: 'rgba(23, 13, 38, 0.65)',
          'card-hover': 'rgba(32, 18, 54, 0.75)',
          border: 'rgba(0, 229, 153, 0.15)',
          'border-hover': 'rgba(0, 229, 153, 0.4)',
          emerald: '#00e599',
          'emerald-dark': '#059669',
          violet: '#8b5cf6',
          'violet-dark': '#6d28d9',
          pink: '#ec4899',
          cyan: '#06b6d4',
          slate: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'liquid-flow': 'liquidFlow 14s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        liquidFlow: {
          '0%': { transform: 'scale(1) translate(0px, 0px) rotate(0deg)' },
          '50%': { transform: 'scale(1.15) translate(30px, -20px) rotate(10deg)' },
          '100%': { transform: 'scale(0.95) translate(-20px, 20px) rotate(-8deg)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(30px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
