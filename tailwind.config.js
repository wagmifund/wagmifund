/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: '[data-theme="dark"]',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "hsl(var(--p) / 0.9)",
        "primary-hover": "hsl(var(--p) / 0.9)",
        theme: "hsl(var(--p) / 0.1)",
        "theme-darker": "hsl(var(--p) / 0.4)",
      },
      textColor: {
        theme: "hsl(var(--p) / 1)",
      },
      borderColor: {
        theme: "hsl(var(--p) / 1)",
      },
      fontFamily: {
        "space-grotesek": ["Space Grotesk", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        user: {
          "primary": "#06b6d4",
          "secondary": "#fb7185",
          "accent": "#d65ecc",
          "neutral": "#374151",
          "base-100": "#f3f4f6",
          "info": "#67e8f9",
          "success": "#4ade80",
          "warning": "#fde047",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
    daisyui: {
      styled: true,
      themes: true,
      base: true,
      utils: true,
      logs: true,
      rtl: false,
      prefix: "",
      darkTheme: "light",
    },
  },
  plugins: [require("daisyui")],
};


// c88003