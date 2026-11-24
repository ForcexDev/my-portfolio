// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages sirve el sitio bajo /my-portfolio/, no en la raiz del dominio.
// Si algun dia se enchufa un dominio propio (p.ej. portafolio.forcex.dev),
// basta con poner base: '/' y cambiar site.
export default defineConfig({
  site: 'https://forcexdev.github.io',
  base: '/my-portfolio',
  trailingSlash: 'ignore',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // el español vive en la raiz (/my-portfolio/), el ingles en /en/
      prefixDefaultLocale: false,
    },
  },

  markdown: {
    shikiConfig: {
      // night-owl arranca de un azul casi negro, que es el mismo sitio del que
      // sale la paleta. El tema por defecto es gris y desentonaba con el resto.
      theme: 'night-owl',
      wrap: false,
    },
  },

  integrations: [
    mdx(),
    icon(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CL', en: 'en-US' } },
    }),
  ],

  // Fuentes autoalojadas: Astro las descarga en build y las sirve desde el propio
  // dominio. Se van tres peticiones bloqueantes a Google Fonts y el salto de texto.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Orbitron',
      cssVariable: '--font-orbitron',
      weights: [500, 700, 900],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fira Code',
      cssVariable: '--font-fira',
      weights: [400, 500, 600],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  image: {
    // los PNG de 2 MB pasan a WebP con srcset automatico
    responsiveStyles: true,
    layout: 'constrained',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
