/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f0f0f',
        'gray-900': '#111827',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
      },
    },
  },
  plugins: [],
}
