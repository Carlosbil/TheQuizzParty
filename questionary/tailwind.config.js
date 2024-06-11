/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
      },
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
