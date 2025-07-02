import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Design System - Single Source of Truth
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      
      // Color System - Consistent & Accessible
      colors: {
        // Primary Gorb Brand Colors
        'gorb': {
          50: '#ECFDF5',
          100: '#D1FAE5', 
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#00FFA3', // Primary - High contrast
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        
        // Secondary Cyan System
        'glow': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#1CF1DD', // Secondary highlight
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        
        // Semantic Colors
        'success': '#2AFF91',
        'warning': '#FCD34D',
        'error': '#FF4D4D',
        'info': '#60A5FA',
        
        // Neutral System - Dark Theme
        'neutral': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        
        // Theme Variables (replaces CSS variables for better consistency)
        background: '#0C0C0C',
        foreground: '#FAFAFA',
        card: '#171717',
        'card-foreground': '#FAFAFA',
        popover: '#171717',
        'popover-foreground': '#FAFAFA',
        primary: '#00FFA3',
        'primary-foreground': '#0A0A0A',
        secondary: '#1CF1DD',
        'secondary-foreground': '#0A0A0A',
        muted: '#262626',
        'muted-foreground': '#A3A3A3',
        accent: '#00FFA3',
        'accent-foreground': '#0A0A0A',
        destructive: '#FF4D4D',
        'destructive-foreground': '#FAFAFA',
        border: '#262626',
        input: '#262626',
        ring: '#00FFA3',
      },
      
      // Typography Scale - Consistent & Accessible
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.025em' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.025em' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0.0125em' }],
        'lg': ['18px', { lineHeight: '28px', letterSpacing: '0.0125em' }],
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '0.0125em' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '0em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.0125em' }],
        '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.025em' }],
        '5xl': ['48px', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '6xl': ['60px', { lineHeight: '1', letterSpacing: '-0.025em' }],
        '7xl': ['72px', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      
      // Spacing System - 4pt Grid
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
      },
      
      // Border Radius System
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
      },
      
      // Container System - Responsive & Max Width
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      
      // Shadow System
      boxShadow: {
        'glow-sm': '0 0 4px rgba(0, 255, 163, 0.3)',
        'glow': '0 0 8px rgba(0, 255, 163, 0.4)',
        'glow-lg': '0 0 16px rgba(0, 255, 163, 0.5)',
        'glow-xl': '0 0 24px rgba(0, 255, 163, 0.6)',
        'cyan-glow': '0 0 8px rgba(28, 241, 221, 0.4)',
        'cyan-glow-lg': '0 0 16px rgba(28, 241, 221, 0.5)',
      },
      
      // Animation System
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 255, 163, 0.4)' },
          '50%': { boxShadow: '0 0 16px rgba(0, 255, 163, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      
      // Responsive Breakpoints
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;