import type { Cuerpo } from '@/scripts/orbital';

/**
 * Los cuerpos que giran en la portada y en proyectos.
 *
 * Los elementos orbitales son los reales del sistema solar (J2000, referidos a
 * la eclíptica): no por rigor, sino porque unas órbitas inventadas a ojo salen
 * todas iguales y estas no. Lo que sí se cambia son los colores, que son los
 * del sitio y no los de los planetas — aquí no hay naranjas ni marrones.
 */
const ELEMENTOS = [
  { a: 0.3871, e: 0.20563, i: 7.005, node: 48.331, peri: 29.125, M0: 174.796 },
  { a: 0.72333, e: 0.00677, i: 3.395, node: 76.68, peri: 54.853, M0: 50.115 },
  { a: 1.0, e: 0.01671, i: 0.0, node: 348.739, peri: 114.208, M0: 357.517 },
  { a: 1.52371, e: 0.09339, i: 1.85, node: 49.558, peri: 286.483, M0: 19.373 },
  { a: 5.2029, e: 0.04839, i: 1.303, node: 100.464, peri: 273.867, M0: 20.02 },
  { a: 9.537, e: 0.05386, i: 2.485, node: 113.665, peri: 339.392, M0: 317.02 },
  { a: 19.1913, e: 0.04726, i: 0.773, node: 74.006, peri: 98.999, M0: 142.238 },
  { a: 30.069, e: 0.00859, i: 1.77, node: 131.784, peri: 276.336, M0: 256.228 },
];

/** La paleta del sitio, de dentro hacia fuera. */
const COLORES = ['#00f3ff', '#63b3ed', '#4299e1', '#9f7aea', '#bc13fe', '#6b46c1', '#00f3ff', '#3182ce'];

/**
 * `cuerpoOrbital(3, 'memsim', '#bc13fe')` — el cuarto juego de elementos, con
 * ese nombre y ese color. El índice da la vuelta, así que sirve para cualquier
 * cantidad de cuerpos.
 */
export function cuerpoOrbital(indice: number, nombre: string, color?: string, tam = 3.6): Cuerpo {
  const el = ELEMENTOS[indice % ELEMENTOS.length]!;
  return { ...el, nombre, color: color ?? COLORES[indice % COLORES.length]!, size: tam };
}

/** Los seis de la portada. Son decorado: no representan nada. */
export const cuerposDelHero: Cuerpo[] = [
  cuerpoOrbital(0, 'a', undefined, 2.4),
  cuerpoOrbital(1, 'b', undefined, 3.4),
  cuerpoOrbital(2, 'c', undefined, 3.9),
  cuerpoOrbital(3, 'd', undefined, 3.0),
  cuerpoOrbital(4, 'e', undefined, 5.2),
  cuerpoOrbital(5, 'f', undefined, 4.6),
];
