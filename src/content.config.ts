import { defineCollection } from 'astro:content';
// Directo de zod: `astro:content` dejó de reexportarlo en Astro 7.
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Los proyectos.
 *
 * Un proyecto = un archivo markdown por idioma:
 *
 *   src/content/proyectos/es/memsim.md
 *   src/content/proyectos/en/memsim.md
 *
 * El nombre del archivo es la URL (`/proyectos/memsim`). Los dos idiomas
 * tienen que llamarse igual: si uno falta, el build avisa.
 *
 * Si necesitas componentes dentro del texto (<Callout>, <Figura>...), cambia la
 * extensión a `.mdx` y ya está: el resto sigue siendo markdown normal.
 *
 * Los campos de abajo son obligatorios salvo los marcados `.optional()`.
 * Si a un proyecto le falta uno, el build falla con el nombre del archivo —
 * mejor eso que publicar una tarjeta a medias.
 */
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      /** Una línea. Es lo que se lee en la tarjeta de la rejilla. */
      resumen: z.string(),
      /** Filtra la rejilla. Si añades una nueva, ponla también en i18n/*.json */
      area: z.enum(['full-stack', 'seguridad', 'sistemas', 'iot']),
      estado: z.enum(['desplegado', 'en-curso', 'archivado']),
      anio: z.number().int(),
      rol: z.string(),
      /** Tal cual se muestran los chips, en orden */
      stack: z.array(z.string()).min(1),
      imagen: image(),
      /** Texto alternativo de la imagen: no lo dejes vacío */
      imagenAlt: z.string(),
      enlaces: z
        .object({
          repo: z.url().optional(),
          demo: z.url().optional(),
        })
        .default({}),
      /** Menor = más arriba en la rejilla */
      orden: z.number().int().default(99),
      /** Lo saca de la rejilla sin borrar el archivo */
      borrador: z.boolean().default(false),
    }),
});

export const collections = { proyectos };
