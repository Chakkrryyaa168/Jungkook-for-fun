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
        'deep-purple': '#211B38',
        'deep-purple-dark': '#151025',
        'deep-purple-light': '#2f2750',
        'lavender': {
          DEFAULT: '#B9A0D9',
          light: '#D9C8ED',
          dark: '#9373BE',
          soft: '#E8DFF5',
        },
        'soft-pink': {
          DEFAULT: '#F4DCEB',
          light: '#FBF0F6',
          dark: '#E2B8D4',
        },
        'cream': {
          DEFAULT: '#FFF8F0',
          dark: '#F5ECE1',
        },
        'gold-sparkle': '#FCD34D',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        script: ['"Sacramento"', 'cursive'],
      },
      boxShadow: {
        'dreamy': '0 10px 30px -10px rgba(185, 160, 217, 0.35)',
        'dreamy-glow': '0 0 25px rgba(185, 160, 217, 0.45)',
        'dreamy-purple': '0 15px 35px -5px rgba(33, 27, 56, 0.5)',
        'polaroid': '0 12px 28px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
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
