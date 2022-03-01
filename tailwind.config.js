module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#2B2F3B',
      'alice-blue': '#F1F3F9',
      'alice-blue-hover': '#E2E6F3',
      'cameo-pink': '#EFBCD5',
      'cameo-pink-hover': '#EBADCC',
      'colorful-blue': '#5170ED',
      independence: '#4B5267',
      'magic-mint': '#BCEFD6',
      'magic-mint-hover': '#ADEBCD',
    },
    boxShadow: {
      lg: '4px 4px 0px 0px rgba(188, 239, 214, 1)',
      sm: '2px 2px 0px 0px rgba(188, 239, 214, 1)',
      none: '0px 0px 0px 0px rgba(188, 239, 214, 1)',
    },
    fontFamily: {
      inter: 'Inter, sans-serif',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
