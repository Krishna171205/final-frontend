
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#003d7a',
          600: '#003366',
          700: '#002952',
          800: '#001f3d',
          900: '#001529',
          950: '#000d1a',
        },
        'off-white': {
          50: '#fefefe',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#f0f0f0',
          400: '#ebebeb',
          500: '#e6e6e6',
          600: '#d9d9d9',
          700: '#cccccc',
          800: '#bfbfbf',
          900: '#b3b3b3',
        },
        'slate': {
          850: '#1a202c',
          950: '#0a0f1a',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #003d7a 0%, #001529 100%)',
        'luxury-gradient': 'linear-gradient(135deg, #003d7a 0%, #001529 100%)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'slideInLeft': 'slideInLeft 0.8s ease-out forwards',
        'slideInRight': 'slideInRight 0.8s ease-out forwards',
        'countUp': 'countUp 0.5s ease-out forwards',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

export default config
