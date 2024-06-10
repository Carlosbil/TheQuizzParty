/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addBase, theme }) {
      const colors = theme('colors');
      const newVars = Object.entries(colors).reduce((vars, [key, value]) => {
        if (typeof value === 'string') {
          vars[`--${key}`] = value;
        } else {
          Object.entries(value).forEach(([shade, color]) => {
            vars[`--${key}-${shade}`] = color;
          });
        }
        return vars;
      }, {});
      
      addBase({
        ':root': newVars,
      });
    }
  ],
};
