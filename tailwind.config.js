/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["emerald", "dark", "cupcake"],
  },
  theme: {
    extend: {
      height: {
        "1vh": "1vh",
        "12vh": "12vh",
        "13vh": "13vh",
        "14vh": "14vh",
        "15vh": "15vh",
        "60vh": "60vh",
        "65vh": "65vh",
        "70vh": "70vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "85vh": "85vh",
        "90vh": "90vh",
      },
      fontFamily: {
        sans: [
          "Arial",
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
  plugins: [require("daisyui")],
};
