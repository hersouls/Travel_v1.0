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
      fontSize: {
        // 황금비율 기반 폰트 크기
        'xs': ['0.75rem', { lineHeight: '1.5' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }], // 14px
        'base': ['1rem', { lineHeight: '1.618' }], // 16px (본문)
        'lg': ['1.125rem', { lineHeight: '1.618' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }], // 20px
        '2xl': ['1.625rem', { lineHeight: '1.4' }], // 26px (타이틀)
        '3xl': ['2.625rem', { lineHeight: '1.3' }], // 42px (H1)
        '4xl': ['3.375rem', { lineHeight: '1.2' }], // 54px
        '5xl': ['4.25rem', { lineHeight: '1.1' }], // 68px
      },
      spacing: {
        // 황금비율 기반 간격
        '2': '0.5rem', // 8px
        '3': '0.8125rem', // 13px (8 * 1.618)
        '4': '1rem', // 16px
        '5': '1.3125rem', // 21px (13 * 1.618)
        '6': '1.5rem', // 24px
        '7': '2.125rem', // 34px (21 * 1.618)
        '8': '2rem', // 32px
        '9': '3.25rem', // 52px (34 * 1.618)
        '10': '2.5rem', // 40px
        '11': '4.0625rem', // 65px (40 * 1.618)
        '12': '3rem', // 48px
        '13': '5.25rem', // 84px (52 * 1.618)
        '14': '3.5rem', // 56px
        '15': '6.5rem', // 104px (65 * 1.618)
        '16': '4rem', // 64px
        '17': '8.125rem', // 130px (84 * 1.618)
        '18': '4.5rem', // 72px
        '19': '10.125rem', // 162px (104 * 1.618)
        '20': '5rem', // 80px
        '21': '12.625rem', // 202px (130 * 1.618)
        '22': '5.5rem', // 88px
        '24': '6rem', // 96px
        '26': '6.5rem', // 104px
        '28': '7rem', // 112px
        '30': '7.5rem', // 120px
        '32': '8rem', // 128px
        '34': '8.5rem', // 136px
        '36': '9rem', // 144px
        '40': '10rem', // 160px
        '44': '11rem', // 176px
        '48': '12rem', // 192px
        '52': '13rem', // 208px
        '56': '14rem', // 224px
        '60': '15rem', // 240px
        '64': '16rem', // 256px
        '72': '18rem', // 288px
        '80': '20rem', // 320px
        '88': '22rem', // 352px
        '96': '24rem', // 384px
        '104': '26rem', // 416px
        '112': '28rem', // 448px
        '120': '30rem', // 480px
        '128': '32rem', // 512px
        '136': '34rem', // 544px
        '144': '36rem', // 576px
        '152': '38rem', // 608px
        '160': '40rem', // 640px
        '168': '42rem', // 672px
        '176': '44rem', // 704px
        '184': '46rem', // 736px
        '192': '48rem', // 768px
        '200': '50rem', // 800px
        '208': '52rem', // 832px
        '216': '54rem', // 864px
        '224': '56rem', // 896px
        '232': '58rem', // 928px
        '240': '60rem', // 960px
        '248': '62rem', // 992px
        '256': '64rem', // 1024px
        '264': '66rem', // 1056px
        '272': '68rem', // 1088px
        '280': '70rem', // 1120px
        '288': '72rem', // 1152px
        '296': '74rem', // 1184px
        '304': '76rem', // 1216px
        '312': '78rem', // 1248px
        '320': '80rem', // 1280px
        '328': '82rem', // 1312px
        '336': '84rem', // 1344px
        '344': '86rem', // 1376px
        '352': '88rem', // 1408px
        '360': '90rem', // 1440px
        '368': '92rem', // 1472px
        '376': '94rem', // 1504px
        '384': '96rem', // 1536px
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
      // 황금비율 기반 크기
      width: {
        'golden-card': '320px',
        'golden-image': '360px',
        'golden-button': '65px',
      },
      height: {
        'golden-card': '198px',
        'golden-image': '223px',
        'golden-button': '40px',
      },
      maxWidth: {
        'golden-container': '1280px',
        'golden-card': '320px',
        'golden-image': '360px',
      },
      minHeight: {
        'golden-card': '198px',
        'golden-image': '223px',
      },
    },
  },
  plugins: [],
};

export default config;