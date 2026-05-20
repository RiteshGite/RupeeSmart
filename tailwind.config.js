/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C48C',
        secondary: '#1A1A2E',
        accent: '#F7B731',
        bg: '#0F0F1A',
        surface: '#1E1E30',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B8',
        success: '#00C48C',
        danger: '#FF6B6B',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out forwards',
        'particle': 'particle 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 196, 140, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 196, 140, 0.4)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(1)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 196, 140, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 196, 140, 0.3)',
        'glow-gold': '0 0 20px rgba(247, 183, 49, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 50%, rgba(0, 196, 140, 0.1) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
