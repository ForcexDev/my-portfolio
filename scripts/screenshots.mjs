// Capturas de referencia del portafolio. Uso:
//   npm run build && npm run preview
//   node scripts/screenshots.mjs [urlBase] [carpetaSalida]
//
// Los nombres de salida coinciden con los de docs/antes/, que se tomaron del
// sitio viejo antes de migrar, para poder ponerlos uno al lado del otro.
import { chromium } from 'playwright';
import { mkdir, unlink } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:4321/my-portfolio';
const carpeta = process.argv[3] ?? 'docs/despues';

const pantallas = [
  { nombre: 'desktop', width: 1440, height: 900 },
  { nombre: 'movil', width: 390, height: 844 },
];

const paginas = [
  { slug: 'home', ruta: '/' },
  { slug: 'bandit', ruta: '/proyectos/bandit' },
  { slug: 'ia-showcase', ruta: '/proyectos/iaimagebetter' },
  { slug: 'gca-showcase', ruta: '/proyectos/grand-chess-auto' },
];

/**
 * Las secciones aparecen con IntersectionObserver y `fullPage` de Chromium
 * captura fuera del viewport sin disparar el observador: si no se recorre la
 * página a mano primero, salen todas en negro.
 */
async function revelarTodo(pagina) {
  await pagina.evaluate(async () => {
    // con scroll-behavior:smooth, scrollTo() no aterriza donde se le pide
    const previo = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.5) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previo;
    await new Promise((r) => setTimeout(r, 600));
  });
}

/** Playwright solo escribe PNG; docs/ guarda webp, que pesa la cuarta parte. */
async function aWebp(png) {
  const destino = png.replace(/\.png$/, '.webp');
  const { height } = await sharp(png).metadata();
  // webp no admite más de 16383 px de alto y el home a 2x se pasa: se reduce
  await sharp(png).resize({ height: Math.min(height, 16383) }).webp({ quality: 82 }).toFile(destino);
  await unlink(png);
  return destino;
}

await mkdir(carpeta, { recursive: true });
const navegador = await chromium.launch();

for (const pantalla of pantallas) {
  const contexto = await navegador.newContext({
    viewport: { width: pantalla.width, height: pantalla.height },
    deviceScaleFactor: 2,
  });

  for (const p of paginas) {
    const pagina = await contexto.newPage();
    await pagina.goto(base + p.ruta, { waitUntil: 'load', timeout: 120000 });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.waitForTimeout(3500); // el loader y el terminal tecleando
    await revelarTodo(pagina);
    const png = `${carpeta}/${p.slug}-${pantalla.nombre}.png`;
    await pagina.screenshot({ path: png, fullPage: true, animations: 'disabled' });
    console.log('ok ', await aWebp(png));
    await pagina.close();
  }
  await contexto.close();
}

// Extra: el loader, que se esconde a los 300 ms del window.load
{
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pagina = await contexto.newPage();
  pagina.goto(base + '/').catch(() => {});
  await pagina.waitForSelector('#cosmic-loader', { timeout: 15000 });
  await pagina.waitForTimeout(400);
  const png = `${carpeta}/loader-desktop.png`;
  await pagina.screenshot({ path: png });
  console.log('ok ', await aWebp(png));
  await contexto.close();
}

await navegador.close();
console.log(`\nlisto -> ${carpeta}/`);
