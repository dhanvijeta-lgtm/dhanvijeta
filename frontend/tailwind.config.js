/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          dark: '#050811',      // Deep premium dark background
          navy: '#0B132B',      // Navy dashboard panels
          gold: '#ffd700',      // Luxury gold accents
          emerald: '#10b981',   // Positive trading indicators
          rose: '#f43f5e',      // Negative trading indicators
          slate: '#1c2541'      // Boarder card borders
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.3)',
        'emerald-glow': '0 0 15px rgba(16, 185, 129, 0.3)',
        'rose-glow': '0 0 15px rgba(244, 63, 94, 0.3)'
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 25s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [],
}
