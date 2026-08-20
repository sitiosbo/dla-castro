/** Tokens derivados de la identidad DLA (ver src/styles/tokens.css para la fuente de verdad). */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0F1B3D', // fondo hero, máxima autoridad
          800: '#1B2A5B', // primario (headers, texto de marca)
          600: '#2E4080', // estados intermedios, hover de navy
        },
        terracotta: {
          600: '#B5622C', // acento primario / CTAs
          500: '#C77C3F', // acento secundario / hover CTA
        },
        cream: {
          100: '#F7EAC8', // fondo de badges
        },
        ink: {
          600: '#4A5568', // texto de cuerpo
          400: '#6B7A90', // texto secundario / captions — WCAG AA 5.2:1
        },
        success: {
          500: '#0FA968', // checks, indicadores de efectividad
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '0.5rem',
      },
    },
  },
  plugins: [],
};
