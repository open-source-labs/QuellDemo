module.exports = {
  content: [
    "./client/src/**/*/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#242424",
        lightblue: "#7DD0E9",
        darkblue: "#252E3A",
        darkgrey: "#676464",
        altblue: "#4A788D"
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px'
      },
      blur: {
        xs: '1px'
      },
      dropShadow: {
        icon: '0 0 2px rgb(37,46,58)'
      }
    },
  },
  variants: {},
  plugins: [],
};
