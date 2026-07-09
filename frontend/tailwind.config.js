export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3"
        },
        spark: {
          50: "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f2811a",
          600: "#dd6b0f",
          700: "#b8560c"
        }
      }
    }
  },
  plugins: []
};
