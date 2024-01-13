import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {},
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
