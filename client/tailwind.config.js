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
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0056b3',
          light: '#47a3ff',
        },
        secondary: {
          DEFAULT: '#5856D6',
        },
        success: {
          DEFAULT: '#34C759',
        },
        warning: {
          DEFAULT: '#FF9500',
        },
        danger: {
          DEFAULT: '#FF3B30',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#C7C7CC',
          500: '#AEAEB2',
          600: '#8E8E93',
          700: '#636366',
          800: '#48484A',
          900: '#3A3A3C',
        },
        background: {
          light: '#F5F5F7',
          dark: '#1D1D1F',
        },
        text: {
          light: '#1D1D1F',
          dark: '#F5F5F7',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['SF Pro Display', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-dark': '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)',
        'apple-sm': '0 2px 6px rgba(0, 0, 0, 0.05), 0 0.5px 2px rgba(0, 0, 0, 0.06)',
        'apple-sm-dark': '0 2px 6px rgba(0, 0, 0, 0.3), 0 0.5px 2px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}

