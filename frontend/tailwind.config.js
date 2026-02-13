/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
        },
        secondary: '#60A5FA',
        success: '#22C55E',
        accent: '#F59E0B',
        background: 'var(--bg-primary)',
        card: 'var(--bg-secondary)',
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
        border: 'var(--border-color)',
      },
    },
  },
  plugins: [],
}
