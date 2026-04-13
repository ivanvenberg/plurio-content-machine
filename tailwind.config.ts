import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        plurio: {
          yellow: '#F5E642',
          'yellow-pale': '#FDFBE8',
          navy: '#1B1A2E',
          'navy-mid': '#2D2C45',
          white: '#FFFFFF',
          gray: '#F7F7F9',
          'gray-mid': '#E8E8EC',
          muted: '#6B6B80',
          border: '#E2E2E8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
