/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#742099',
        hoverColor: '#4a044e',
        borderColor: '#f9fafb',
        lightColor: '#d946ef',
      },
      fontFamily:{
        titleFont: ["Noto Sans", "sans-serif"],
        bodyFont: ["Noto Sans JP", "sans-serif"],
      },
      boxShadow: {
        shadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      },
      screens: {
        xxs: "320px",
        xs: "425px",
        smx: "520px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
