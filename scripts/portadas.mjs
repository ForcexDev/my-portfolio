/**
 * Genera las portadas de los proyectos que no tienen captura todavía.
 *
 * Se ejecuta a mano y una sola vez: `node scripts/portadas.mjs`. Los PNG
 * quedan en src/assets/img/portadas/. Cuando tengas una captura de verdad de
 * alguno, sustituye el archivo y ya está — el markdown no cambia.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SALIDA = new URL('../src/assets/img/portadas/', import.meta.url);
const W = 1200;
const H = 675;

const portadas = [
  { slug: 'pharmalogic', ruta: '~/proyectos/pharmalogic', a: '#4299e1', b: '#6b46c1', glifo: '{ }' },
  { slug: 'compendium-notes', ruta: '~/proyectos/compendium-notes', a: '#00f3ff', b: '#3182ce', glifo: '</>' },
  { slug: 'memsim', ruta: '~/proyectos/memsim', a: '#9f7aea', b: '#bc13fe', glifo: '0x00' },
  { slug: 'cercasco', ruta: '~/proyectos/cercasco', a: '#805ad5', b: '#4299e1', glifo: '((•))' },
];

// Rejilla de fondo: las mismas líneas finas que usa el resto del sitio.
const rejilla = `
  <pattern id="r" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="rgba(66,153,225,0.10)" stroke-width="1"/>
  </pattern>`;

// El glifo va dentro de un SVG, así que `<`, `>` y `&` tienen que ir escapados.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = ({ ruta, a, b, glifo }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${rejilla}
    <radialGradient id="halo" cx="28%" cy="34%" r="62%">
      <stop offset="0" stop-color="${a}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="filo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#000011"/>
  <rect width="${W}" height="${H}" fill="url(#r)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <g font-family="monospace">
    <text x="80" y="${H / 2 - 26}" font-size="120" fill="${a}" opacity="0.85">${esc(glifo)}</text>
    <text x="82" y="${H / 2 + 54}" font-size="42" fill="#e2e8f0" opacity="0.9">${esc(ruta)}</text>
  </g>

  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#filo)"/>
</svg>`;

await mkdir(SALIDA, { recursive: true });

for (const p of portadas) {
  const destino = new URL(`${p.slug}.png`, SALIDA);
  await sharp(Buffer.from(svg(p))).png({ compressionLevel: 9 }).toFile(destino.pathname.slice(1));
  console.log('→', p.slug + '.png');
}
