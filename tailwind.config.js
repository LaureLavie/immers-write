/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'border-border',
    'bg-background',
    'text-foreground',
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique personnalisée (doit correspondre à tailwind.config.ts)
        'deep-space-blue': '#28364e',
        'lavender': '#E5E6F1',
        'porcelain': '#FDFAF5',
        'metallic-gold': '#d4b044',
        'onyx': '#090b10',
        'brick-ember': '#bf0000',
        'indigo-custom': '#560078',
        'golden-orange': '#f59e0b',
        'jade-green': '#22C55E',
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // vous pouvez ajouter d'autres couleurs personnalisées ici
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

