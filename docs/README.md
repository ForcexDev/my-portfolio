# Antes y después

Las mismas cuatro páginas y el loader, a 1440×900 y 390×844, antes y después de
migrar a Astro. Los nombres de archivo coinciden en las dos carpetas para poder
abrirlas una al lado de la otra.

| | antes | después |
|---|---|---|
| `home-*` | `index.html` | `/` |
| `bandit-*` | `pages/bandit-walkthrough.html` | `/proyectos/bandit` |
| `ia-showcase-*` | `pages/ia-project-showcase.html` | `/proyectos/iaimagebetter` |
| `gca-showcase-*` | `pages/grand-chess-auto-showcase.html` | `/proyectos/grand-chess-auto` |
| `loader-desktop` | igual | igual, más el log de arranque |
| `modal-proyecto-desktop` | el modal de detalle | — el modal ya no existe; cada proyecto tiene página propia |

Para rehacer las de después:

    npm run build && npm run preview
    npm run shots -- http://localhost:4321/my-portfolio docs/despues

Las de antes salieron del sitio viejo con `python -m http.server 8000` y una
versión anterior de `scripts/screenshots.mjs`. Ese script ahora apunta al sitio
nuevo, así que para rehacerlas habría que volver a `main`. No hace falta: son
justo el estado que ya no vuelve.
