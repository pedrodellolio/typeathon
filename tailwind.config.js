/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: "Roboto Mono Variable",
      },
      keyframes: {
        "pulse-border": {
          "0%": {
            borderColor: "#3b82f6" /* Start color */,
          },
          "50%": {
            borderColor: "transparent" /* Middle color (invisible) */,
          },
          "100%": {
            borderColor: "#3b82f6" /* End color */,
          },
        },
      },
    },
  },
  plugins: [],
};
