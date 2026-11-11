/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-purple': '#654454',
        'deep-purple-dark': '#493440',
        'deep-purple-light': '#FFF8F2',
        'lavender': {
          DEFAULT: '#E8B4C8',
          light: '#FFDDE8',
          dark: '#A65F7C',
          soft: '#FFF0F5',
        },
        'soft-pink': {
          DEFAULT: '#FFF0F5',
          light: '#FFF8F2',
          dark: '#E8B4C8',
        },
        'cream': { DEFAULT: '#FFF8F2', dark: '#FFF0F5' },
        'gold-sparkle': '#E8B4C8',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        script: ['"Sacramento"', 'cursive'],
      },
      boxShadow: {
        'dreamy': '0 10px 30px -10px rgba(166, 95, 124, 0.22)',
        'dreamy-glow': '0 0 25px rgba(232, 180, 200, 0.4)',
        'dreamy-purple': '0 15px 35px -5px rgba(101, 68, 84, 0.25)',
        'polaroid': '0 12px 28px rgba(101, 68, 84, 0.12), 0 2px 4px rgba(101, 68, 84, 0.08)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
