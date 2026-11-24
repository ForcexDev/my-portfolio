import type { Idioma } from '@/i18n';

/**
 * 'AAAA-MM' → «ago. 2026» / «Aug 2026».
 *
 * Los datos guardan la fecha en ISO y el idioma decide cómo se lee, que es
 * más barato que mantener una tabla de meses por idioma. El día 01 y UTC
 * evitan que la fecha se corra un mes según la zona horaria del visitante.
 */
export const mes = (fecha: string, idioma: Idioma) =>
  new Intl.DateTimeFormat(idioma === 'es' ? 'es-CL' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${fecha}-01T00:00:00Z`));
