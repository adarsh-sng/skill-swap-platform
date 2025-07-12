/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // indigo-500
        secondary: '#f472b6', // pink-400
        background: '#18181b', // zinc-900
        surface: '#27272a', // zinc-800
        accent: '#22d3ee', // cyan-400
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        skillSwapDark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#6366f1',
          secondary: '#f472b6',
          accent: '#22d3ee',
          neutral: '#27272a',
          'base-100': '#18181b',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#eab308',
          error: '#ef4444',
        },
      },
    ],
    darkTheme: 'skillSwapDark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
  },
}; 