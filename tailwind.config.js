module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3f4388',
        'primary-content': '#d9daed',
        'primary-dark': '#2f3265',
        'primary-light': '#4f54ab',

        secondary: '#883f80',
        'secondary-content': '#edd9eb',
        'secondary-dark': '#652f5f',
        'secondary-light': '#ab4fa1',

        background: '#111222',
        foreground: '#191a34',
        border: '#292c56',

        copy: '#fafafd',
        'copy-light': '#cbcde6',
        'copy-lighter': '#878ac5',

        success: '#3f883f',
        warning: '#88883f',
        error: '#883f3f',

        'success-content': '#d9edd9',
        'warning-content': '#ededd9',
        'error-content': '#edd9d9',
      },
    },
  },
  plugins: [],
};
