/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#070b1a",
          800: "#0b1230",
          700: "#131c45",
          600: "#1d2a5e",
        },
        glow: { cyan: "#22d3ee", amber: "#fbbf24", green: "#34d399" },
      },
      fontFamily: {
        display: ["Lexend", "Atkinson Hyperlegible", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
