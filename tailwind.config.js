/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./templates/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Template 1 (Chemists Club)
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        
        // Template 2 (Unico Hotels)
        body: ['Montserrat', 'system-ui', 'sans-serif'],
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        
        // Template 3 (Grand Hotel Central) - can also use body/heading
        'body-alt': ['Open Sans', 'system-ui', 'sans-serif'],
        'heading-alt': ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        // Template 1 colors
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4E4B7',
          dark: '#B8941F',
        },
        // Template 2 colors
        tan: {
          DEFAULT: '#8B7355',
          light: '#C4B5A0',
          dark: '#6B5842',
        },
        // Template 3 colors
        heritage: {
          DEFAULT: '#2C3E50',
          light: '#D4C5A9',
          dark: '#1A252F',
        },
        // Template 4 colors
        vibrant: {
          DEFAULT: '#ef4444',
          light: '#fca5a5',
          dark: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
