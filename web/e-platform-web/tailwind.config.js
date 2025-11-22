/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        accent: "#7c3aed",
        background: { light: "#f6f7f8", dark: "#101922" },
        neutral: { light: "#6b7280", dark: "#9ca3af" },
        text: { light: "#111827", dark: "#f9fafb" },
      },
      fontFamily: { display: ["Inter", "sans-serif"] },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};