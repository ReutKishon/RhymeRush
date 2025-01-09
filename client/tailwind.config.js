/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        regular: ["Oswald"],
        bold: ["Oswald"],
        bold2: ["Oswald"],
        satisfy: ["Oswald", "cursive"],
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(45deg, #FF99C8, #FCF6BD, #8BE4AD, #A9DEF9, #E4C1F9)",
        "gradient-radial":
          "radial-gradient(#FF99C8, #FCF6BD, #8BE4AD, #A9DEF9, #E4C1F9)",
        "gradient-top":
          "linear-gradient(0deg, #FF99C8, #FCF6BD, #8BE4AD, #A9DEF9, #E4C1F9)",
        "gradient-right":
          "linear-gradient(90deg, #FF99C8, #FCF6BD, #8BE4AD, #A9DEF9, #E4C1F9)",
          // "game-board": "url('./assets/images/notebook2.png')",
        },

      colors: {
        primary: {
          pink: "#FF99C8", // carnation-pink
          yellow: "#FCF6BD", // lemon-chiffon
          green: "#8BE4AD", // celadon
          blue: "#A9DEF9", // uranian-blue
          purple: "#E4C1F9", // mauve
        },
        // You can also access them by their proper names
        palette: {
          carnation: "#FF99C8",
          chiffon: "#FCF6BD",
          celadon: "#8BE4AD",
          uranian: "#A9DEF9",
          mauve: "#E4C1F9",
        },
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      },
    },
  },
  important: true,
  plugins: [],
};
