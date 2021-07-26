module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#4CB1D1',
          DEFAULT: '#44A5CA',
          dark: '#206FA8',
          darker: '#17496d',
          sale: '#fe0000',
        },
      },
      animation: {
        open: 'open 0.5s forwards',
        close: 'close 0.5s forwards',
      },
      keyframes: {
        open: {
          '0%': { transform: 'translate(-50%, -50%) scale(0)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
          '70%': { transform: 'translate(-50%, -50%) scale(0.95)' },
          '95%': { transform: 'translate(-50%, -50%) scale(1.1)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)' },
        },
        close: {
          '100%': { transform: 'translate(-50%, -50%) scale(0)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
          '30%': { transform: 'translate(-50%, -50%) scale(0.95)' },
          '5%': { transform: 'translate(-50%, -50%) scale(1.1)' },
          '0%': { transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
    },
    fontFamily: {
      robo: ['Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      montse: ['Montserrat', 'Roboto', 'sans-serif'],
    },
    container: (theme) => ({
      center: true,
      padding: '1rem',
    }),
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
    animation: ['motion-safe'],
  },
  plugins: [require('@tailwindcss/forms')],
};
