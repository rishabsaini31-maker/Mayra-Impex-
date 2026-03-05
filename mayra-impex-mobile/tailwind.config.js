/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5F0",
          100: "#FFE8DC",
          200: "#FFD1B9",
          300: "#FFBA96",
          400: "#FFA373",
          500: "#FF8C50", // Main peach/orange
          600: "#FF7536",
          700: "#E5611F",
          800: "#CC4F19",
          900: "#B33D13",
        },
        secondary: {
          50: "#FFF9F5",
          100: "#FFF2EB",
          200: "#FFE5D6",
          300: "#FFD8C2",
          400: "#FFCBAD",
          500: "#FFBE99", // Light orange
          600: "#FFB185",
          700: "#FFA470",
          800: "#FF975C",
          900: "#FF8A47",
        },
        accent: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
        },
      },
      borderRadius: {
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
      },
      spacing: {
        18: "72px",
        22: "88px",
      },
    },
  },
  plugins: [],
};
