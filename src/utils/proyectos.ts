import { getCollection, type CollectionEntry } from 'astro:content';
import { ruta, segmentos, type Idioma } from '@/i18n';

export type Proyecto = CollectionEntry<'proyectos'>;

/**
 * El identificador de una entrada incluye el idioma (`es/memsim`). El slug que
 * va en la URL es lo que queda después: `memsim`. Los dos idiomas comparten
 * slug a propósito, así el botón ES|EN cae en el mismo proyecto.
 */
export const slugDe = (p: Proyecto) => p.id.split('/').slice(1).join('/');

/**
 * Los proyectos de un idioma, ordenados por el campo `orden` del frontmatter.
 * Los marcados `borrador: true` se ven en `npm run dev` y no en el sitio
 * publicado — así puedes escribir uno a medias sin que salga a producción.
 */
export async function proyectosDe(idioma: Idioma) {
  const suyos = await getCollection(
    'proyectos',
    ({ id, data }) => id.startsWith(`${idioma}/`) && (import.meta.env.DEV || !data.borrador),
  );
  return suyos.sort((a, b) => a.data.orden - b.data.orden);
}

/** `rutaProyecto('memsim', 'en')` → `/my-portfolio/en/projects/memsim` */
export const rutaProyecto = (slug: string, idioma: Idioma) =>
  ruta(`${segmentos.proyectos[idioma]}/${slug}`, idioma);
