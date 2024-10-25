/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          blue: {
            light: '#60A5FA',
            DEFAULT: '#3B82F6',
            dark: '#2563EB',
          },
          purple: {
            light: '#A78BFA',
            DEFAULT: '#8B5CF6',
            dark: '#7C3AED',
          },
          green: {
            light: '#34D399',
            DEFAULT: '#10B981',
            dark: '#059669',
          },
          rose: {
            light: '#FB7185',
            DEFAULT: '#F43F5E',
            dark: '#E11D48',
          },
        },
      },
    },
  },
  plugins: [],
};