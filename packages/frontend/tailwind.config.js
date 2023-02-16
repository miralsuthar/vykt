module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "btn-primary":
          "linear-gradient(181.11deg, #95BFFF -36.4%, #2931E1 122.53%)",
        navbar: "#111621",
        background: "#191F2D",
        "prompt-bg": "#141822",
        "prompt-input": "#202738",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
