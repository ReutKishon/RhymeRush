/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        regular: ["Poppins_400Regular"],
        bold: ["Poppins_600SemiBold"],
        bold2: ["Poppins_700Bold"],
      },

      colors: {
        customColorSet: {
          primary: "#1cd896",
          secondary: "#FFFFFF",
        },
      },
    },
  },
  important: true,
  plugins: [],
};
