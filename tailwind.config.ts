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
        'alzain-black': '#121212',
        'alzain-gold': '#FFC107',
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
