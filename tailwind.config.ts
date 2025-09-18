
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'luxury-navy': '#1B2951',
          'luxury-navy-light': '#2C3E68',
          'luxury-navy-dark': '#0F1B3C',
          'luxury-cream': '#F8F5F0',
          'charcoal-gray': '#4A4A4A',
          'deep-navy': '#1A1B3A',
          'luxury-black': '#0D0D0D',
          'pearl-white': '#FEFEFE',
        },
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
          sans: ['Inter', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.8s ease-out forwards',
          'slide-up': 'slideUp 0.8s ease-out forwards',
        },
      },
    },
    plugins: [],
  }
