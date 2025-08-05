/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-teal': '#2D5D4F',
        'warm-cream': '#F5E6D3',
        'bright-orange': '#F5A623',
        'light-cream': '#FDF8F0',
        'text-primary': '#0e1b18',
        'text-secondary': '#50958a',
      },
      fontFamily: {
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'cairo': ['"Cairo"', 'sans-serif'],
        'arabic': ['"Cairo"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        naafe: {
          primary: '#2D5D4F',
          secondary: '#50958a',
          accent: '#F5A623',
          neutral: '#0e1b18',
          'base-100': '#F5E6D3',
          'base-200': '#FDF8F0',
          'base-300': '#FFFFFF',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
};