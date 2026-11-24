/**
 * Traducciones de interfaz.
 *
 * Los textos viven en `es.json` y `en.json`. Para añadir uno, ponlo en LOS DOS
 * archivos con la misma clave: TypeScript da error si falta en inglés.
 *
 * Uso dentro de un componente `.astro`:
 *
 *   ---
 *   import { useTraducciones, idiomaDe } from '@/i18n';
 *   const idioma = idiomaDe(Astro.url);
 *   const t = useTraducciones(idioma);
 *   ---
 *   <h2>{t('proyectos.titulo')}</h2>
 */
import es from './es.json';
import en from './en.json';

export const idiomas = ['es', 'en'] as const;
export type Idioma = (typeof idiomas)[number];
export const idiomaPorDefecto: Idioma = 'es';

// `es` manda: si en.json se queda corto, el error sale aquí y no en producción.
const diccionarios: Record<Idioma, typeof es> = { es, en };

export type ClaveTexto = keyof typeof es;

export function useTraducciones(idioma: Idioma) {
  return (clave: ClaveTexto): string => diccionarios[idioma][clave];
}

/** Saca el idioma de la URL: `/en/...` es inglés, todo lo demás español. */
export function idiomaDe(url: URL): Idioma {
  return url.pathname.split('/').includes('en') ? 'en' : 'es';
}

/**
 * Construye una ruta respetando el `base` del sitio y el idioma.
 * `ruta('proyectos/memsim', 'en')` → `/my-portfolio/en/projects/memsim`
 */
export function ruta(destino: string, idioma: Idioma): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpio = destino.replace(/^\//, '');
  const prefijo = idioma === idiomaPorDefecto ? base : `${base}/en`;
  return limpio ? `${prefijo}/${limpio}` : `${prefijo}/`;
}

/** Cómo se llama cada sección en la URL de cada idioma. */
export const segmentos = {
  proyectos: { es: 'proyectos', en: 'projects' },
} as const;
