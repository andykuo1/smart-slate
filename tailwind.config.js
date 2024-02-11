import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        short: { raw: '(max-height: 400px)' },
        tall: { raw: '(min-height: 400px)' },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents, e, prefix, config }) {
      addUtilities({
        '.horizontal-tb': {
          writingMode: 'horizontal-tb',
        },
        '.vertical-rl': {
          writingMode: 'vertical-rl',
        },
        '.vertical-lr': {
          writingMode: 'vertical-lr',
        },
        '.upright-rl': {
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
        },
        '.upright-lr': {
          writingMode: 'vertical-lr',
          textOrientation: 'upright',
        },
      });
    }),
  ],
};
