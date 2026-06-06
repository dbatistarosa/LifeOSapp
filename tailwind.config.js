/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#00F5A0',
          blue: '#00C2FF',
        },
        accent: {
          purple: '#A78BFA',
          gold: '#F5C842',
        },
        bg: {
          void: '#03040A',
          deep: '#060810',
          base: '#0A0C18',
          surface: '#0F1525',
          raised: '#141C30',
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8A96B0',
          dim: '#4A5270',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      backgroundImage: {
        'aurora-green': 'linear-gradient(135deg, #00F5A0, #00C2FF)',
        'aurora-purple': 'linear-gradient(135deg, #A78BFA, #00C2FF)',
        'aurora-gold': 'linear-gradient(135deg, #F5C842, #00F5A0)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'waveform': 'waveform 1s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 245, 160, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 194, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 200, 66, 0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
