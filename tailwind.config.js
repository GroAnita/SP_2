/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-bg',
    'text-text',
    'bg-primary',
    'bg-secondary',
    'bg-card',
    'bg-success',
    'bg-error',
    'bg-header',
    'btntext',
  ],
  theme: {
    extend: {
      transition:
        'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
      colors: {
        header: 'var(--color-header)',
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        card: 'var(--color-card)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        btntext: 'var(--color-btn-text)',
        border: 'var(--color-border)',
        bottomnav: 'var(--color-bottom-nav)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
