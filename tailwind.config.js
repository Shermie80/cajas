/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-bai-jamjuree)", "sans-serif"],
      },
      colors: {
        primary: "#FACC15",
        secondary: "#1F2937",
      }
    },
  },
  plugins: [],
};
