/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Prince Sattam bin Abdulaziz University — Modern Teal Palette ──
        primary: {
          50:  '#edfaf8',
          100: '#c8f0ec',
          200: '#92e2da',   // highlight tint
          300: '#5dd1c7',
          400: '#36bfb4',   // vibrant teal
          500: '#25a89d',   // main brand teal
          600: '#1b8c82',   // deep brand
          700: '#156b63',
          800: '#0f4e48',
          900: '#07302b',   // near-black teal
          950: '#041e1a',
        },
        psau: {
          teal:       '#1b8c82',
          tealLight:  '#36bfb4',
          cyan:       '#92e2da',
          glow:       '#5dd1c7',
          pale:       '#edfaf8',
          gold:       '#c9a227',   // accent warm
          goldLight:  '#e8c14a',
          gray:       '#6b7d7c',
          grayLight:  '#a0b4b2',
          dark:       '#07302b',
          darker:     '#041e1a',
        },
      },
      fontFamily: {
        sans:    ['IBM Plex Sans Arabic', 'Tajawal', 'sans-serif'],
        display: ['Readex Pro', 'Cairo', 'sans-serif'],
        arabic:  ['IBM Plex Sans Arabic', 'Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'psau-gradient':  'linear-gradient(135deg, #1b8c82 0%, #36bfb4 50%, #5dd1c7 100%)',
        'psau-dark':      'linear-gradient(135deg, #041e1a 0%, #07302b 50%, #0f4e48 100%)',
        'card-shine':     'linear-gradient(135deg, rgba(93,209,199,0.08) 0%, rgba(27,140,130,0.04) 100%)',
      },
      boxShadow: {
        'teal-sm':  '0 2px 8px rgba(27,140,130,0.25)',
        'teal-md':  '0 4px 20px rgba(27,140,130,0.30)',
        'teal-lg':  '0 8px 40px rgba(27,140,130,0.35)',
        'teal-glow':'0 0 24px rgba(93,209,199,0.40)',
      },
    },
  },
  plugins: [],
}
