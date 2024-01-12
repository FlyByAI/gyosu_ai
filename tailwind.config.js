/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "60vh": "60vh",
        "75vh": "75vh",
        "80vh": "80vh",
      },
      fontFamily: {
        sans: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      animation: {
        scroll: "scroll 10s linear infinite",
        marqueeShort: 'scrollTextShort 3s linear infinite',
        marqueeMedium: 'scrollTextMedium 3s linear infinite',
        marqueeLong: 'scrollTextLong 3s linear infinite',
      },
    },
  },
  plugins: [],
};
