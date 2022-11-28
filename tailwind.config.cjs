/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "pulse-transparent": {
          "0%, 100%": {
            opacity: 0.75,
          },
          "50%": {
            opacity: 0.25,
          },
        },
      },
      animation: {
        "pulse-transparent":
          "pulse-transparent 0.75s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
