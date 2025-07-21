import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Moonwave Design System Colors
        primary: {
          50: '#f0f0ff',
          100: '#e1e1ff',
          200: '#c3c3ff',
          300: '#a5a5ff',
          400: '#8787ff',
          500: '#6C63FF', // Moonwave Main
          600: '#5652cc',
          700: '#414199',
          800: '#2b2b66',
          900: '#161633',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6', // Background
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        accent: {
          50: '#fffbf0',
          100: '#fff7e6',
          200: '#ffefcc',
          300: '#ffe7b3',
          400: '#ffdf99',
          500: '#FFD700', // Highlight
          600: '#ccac00',
          700: '#998100',
          800: '#665600',
          900: '#332b00',
        },
        error: {
          50: '#fff0f0',
          100: '#ffe1e1',
          200: '#ffc3c3',
          300: '#ffa5a5',
          400: '#ff8787',
          500: '#FF3860', // Error
          600: '#cc2b4d',
          700: '#99203a',
          800: '#661527',
          900: '#330a13',
        },
        success: {
          50: '#f0fff4',
          100: '#e1ffe7',
          200: '#c3ffcf',
          300: '#a5ffb7',
          400: '#87ff9f',
          500: '#21B573', // Success
          600: '#1a915c',
          700: '#146d45',
          800: '#0d492e',
          900: '#072417',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;