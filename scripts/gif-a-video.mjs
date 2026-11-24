/**
 * Convierte un GIF a MP4 para usarlo con <Figura video="...">.
 *
 *   node scripts/gif-a-video.mjs img/gameplay_realtime.gif video/gameplay
 *
 * El segundo argumento es la ruta de salida dentro de public/, sin extensión:
 * es exactamente lo que después se le pasa a la prop `video`.
 *
 * Un GIF de 19 MB queda en ~1 MB y, de paso, deja de bloquear el hilo de
 * pintado del navegador — un GIF se decodifica entero en CPU, un vídeo no.
 *
 * Usa el binario de `ffmpeg-static` (devDependency), así que no hace falta
 * tener ffmpeg instalado en el sistema.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const [entrada, salida] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error('uso: node scripts/gif-a-video.mjs <entrada.gif> <salida-sin-extension>');
  process.exit(1);
}

const destino = `public/${salida}`;
mkdirSync(dirname(destino), { recursive: true });

// yuv420p + el filtro de ancho par: sin eso, un GIF de ancho impar no se
// reproduce en Safari ni en la mayoría de móviles.
const parejo = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

// Solo H.264: lo reproduce cualquier navegador desde 2012, y en estos dos GIF
// salió más pequeño que el VP9 equivalente. Si algún día uno no comprime bien,
// añadir aquí un segundo trabajo con libvpx-vp9 y su <source> en Figura.astro.
const archivo = `${destino}.mp4`;
execFileSync(
  ffmpeg,
  ['-y', '-i', entrada, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', parejo, '-crf', '28', archivo],
  { stdio: 'inherit' },
);

const kb = (n) => `${Math.round(n / 1024)} kB`;
console.log(`${archivo}: ${kb(statSync(entrada).size)} → ${kb(statSync(archivo).size)}`);
