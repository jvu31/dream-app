/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/(tabs)/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './App.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: { DEFAULT: '#f9f9fb', dark: '#f9f9fb' },
        background: { DEFAULT: '#060609', dark: '#060609' },
        primary: { DEFAULT: '#615f86', dark: '#615f86' },
        secondary: { DEFAULT: '#2b2435', dark: '#2b2435' },
        accent: { DEFAULT: '#5f4b6c', dark: '#5f4b6c' },
      },
    },
  },
  plugins: [require("nativewind/preset")],
};
