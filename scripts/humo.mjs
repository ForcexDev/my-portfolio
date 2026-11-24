/**
 * Prueba de humo: lo que el build no puede comprobar solo.
 *
 *   npm run build && npm run preview     (en otra terminal)
 *   node scripts/humo.mjs
 *
 * Comprueba lo que es JavaScript y por tanto no falla en el build aunque esté
 * roto: los filtros de la rejilla, el botón de copiar de los bloques de código,
 * la lupa de las figuras y el arranque del juego. Si algún día uno deja de
 * funcionar, esto lo dice antes que un visitante.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.URL_BASE ?? 'http://localhost:4321/my-portfolio';
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });

const ir = async (ruta) => {
  await pagina.goto(`${base}${ruta}`, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(600);
};

// --- 1. los filtros de la rejilla -----------------------------------------
await ir('/');
const visibles = () => pagina.locator('.tarjeta:not(.oculta)').count();
const total = await visibles();
assert.ok(total >= 7, `esperaba 7 proyectos o más, hay ${total}`);

await pagina.locator('.filtro[data-area="seguridad"]').click();
const seguridad = await visibles();
assert.ok(seguridad > 0 && seguridad < total, `el filtro no filtró: ${seguridad} de ${total}`);
assert.equal(await pagina.locator('.filtro[data-area="seguridad"]').getAttribute('aria-pressed'), 'true');

await pagina.locator('.filtro[data-area="todos"]').click();
assert.equal(await visibles(), total, 'el botón "todos" no devolvió todas');

// --- 2. el juego ------------------------------------------------------------
// No se comprueba el marcador: subirlo depende de dónde caigan los enemigos.
// Lo que sí se comprueba es todo lo que se rompió alguna vez sin avisar: que
// la partida arranca y que la música existe en la ruta con el `base` puesto.
{
  const musica = pagina
    .waitForResponse((r) => r.url().includes('Derezzed.mp3'), { timeout: 10_000 })
    .catch(() => null);

  await pagina.locator('#juego').scrollIntoViewIfNeeded();
  await pagina.locator('#juego .empezar').click();

  const respuesta = await musica;
  assert.ok(respuesta, 'el juego no pidió la música');
  assert.ok(respuesta.status() < 400, `la música da ${respuesta.status()} en ${respuesta.url()}`);

  const capa = pagina.locator('#juego .capa');
  assert.ok(
    await capa.evaluate((e) => e.classList.contains('capa--fuera')),
    'la portada del juego no se apartó al empezar',
  );

  await pagina.keyboard.press('Escape');
  await pagina.waitForTimeout(200);
  assert.ok(
    !(await capa.evaluate((e) => e.classList.contains('capa--fuera'))),
    'la partida no termina con ESC',
  );
}

// --- 3. copiar código ------------------------------------------------------
await pagina.context().grantPermissions(['clipboard-read', 'clipboard-write']);
await ir('/proyectos/bandit');
const botones = pagina.locator('.proyecto .copiar');
assert.ok((await botones.count()) > 0, 'ningún bloque de código tiene botón de copiar');

await botones.first().click();
const copiado = await pagina.evaluate(() => navigator.clipboard.readText());
assert.ok(copiado.includes('ssh bandit0@'), `el portapapeles trae otra cosa: ${copiado.slice(0, 40)}`);

// --- 4. la lupa ------------------------------------------------------------
// Ahora mismo ningún proyecto usa <Figura src>, así que se inyecta una para
// probar el manejador. El día que haya una de verdad, esto sigue valiendo.
await pagina.evaluate(() => {
  const f = document.createElement('figure');
  f.className = 'figura';
  f.innerHTML = '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="prueba">';
  document.querySelector('.prosa').append(f);
});
await pagina.locator('.figura img').click();
assert.ok(await pagina.locator('dialog.lupa[open]').count(), 'la lupa no se abrió');

await pagina.keyboard.press('Escape');
assert.equal(await pagina.locator('dialog.lupa[open]').count(), 0, 'la lupa no cierra con ESC');

await navegador.close();
console.log('humo: todo en pie ✓');
