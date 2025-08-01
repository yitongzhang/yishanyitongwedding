import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'gooper-condensed': ['var(--font-gooper-condensed)'],
        'gooper-semibold': ['Gooper7-SemiBold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config