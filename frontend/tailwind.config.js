/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Distinctive fonts for elevated design
        'display': ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'heading': ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'body': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        // Light theme colors (OSRS Wiki inspired)
        light: {
          bg: '#e0dbc9',         // Parchment background
          surface: '#ede6d4',    // Lighter parchment for cards
          border: '#b8a888',     // Brown borders
          text: '#2b1e0f',       // Dark brown text
          muted: '#5c4a2f',      // Medium brown muted text
          hover: '#d5ccb5',      // Darker beige on hover
          accent: '#8b6f47',     // Golden brown accent
        },
        // Dark theme colors
        dark: {
          bg: '#0f1419',
          surface: '#1a1f2e',
          border: '#2d3748',
          text: '#e2e8f0',
          muted: '#94a3b8',
          hover: '#1e293b',
          accent: '#a8956a',     // Golden brown accent
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
