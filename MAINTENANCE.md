# Mantenimiento

Dónde tocar cada cosa. La regla general: **el contenido vive en `src/data/` y
`src/content/`, y nada de eso es HTML.** Si te encuentras editando un `.astro`
para cambiar un texto, casi seguro te has pasado de carpeta.

    npm install
    npm run dev        # http://localhost:4321/my-portfolio

## Dónde está cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, correo, redes, ruta del CV, claves de EmailJS | `src/data/site.ts` |
| El bloque neofetch y los comandos del terminal del hero | `src/data/hero.ts` |
| Habilidades técnicas (los 5 grupos) | `src/data/skills.ts` |
| Trayectoria (ayudantías, práctica, laboral) | `src/data/experience.ts` |
| Logros (CTF, IEEE Xtreme) | `src/data/achievements.ts` |
| Certificaciones e idiomas | `src/data/certifications.ts` |
| Las emisoras de la radio | `src/data/radio.ts` |
| Textos de interfaz (botones, títulos de sección) | `src/i18n/es.json` + `en.json` |
| Colores, tipografías, sombras | `src/styles/tokens.css` |
| Starfield, glass, borde cónico, keyframes | `src/styles/cosmic.css` |
| Un proyecto | `src/content/proyectos/{es,en}/<slug>.md` |

Los archivos de `src/data/` son TypeScript plano: arrays de objetos con un
comentario encima explicando cada campo. Editas el array y ya.

## Añadir un proyecto

Un proyecto = **dos archivos**, uno por idioma, con el mismo nombre:

    src/content/proyectos/es/mi-proyecto.md
    src/content/proyectos/en/mi-proyecto.md

El nombre del archivo es la URL: `/my-portfolio/proyectos/mi-proyecto`.
Copia el frontmatter de `memsim.md`, que es el más corto. Los campos y lo que
admite cada uno están documentados en `src/content.config.ts`; si te falta uno o
pones un `area` que no existe, **el build falla y te dice en qué archivo**.

La portada va en `src/assets/img/portadas/` y se referencia con ruta relativa.
Si todavía no tienes captura, `node scripts/portadas.mjs` genera una de relleno.
Astro se encarga del WebP y del `srcset`; no optimices nada a mano.

Si falta la versión en inglés, el build avisa. Para dejar uno a medias sin
publicarlo: `borrador: true` en el frontmatter.

## Componentes dentro de un proyecto

Renombra el archivo a `.mdx` e impórtalos arriba del todo. Los que hay:

```mdx
import Callout from '@/components/content/Callout.astro';
import Figura from '@/components/content/Figura.astro';
import Funciones from '@/components/content/Funciones.astro';
import HojaDeRuta from '@/components/content/HojaDeRuta.astro';
```

`grand-chess-auto.mdx` los usa todos — cópialo de ahí en vez de leer el código.
Los bloques de código con ``` ya salen con resaltado y botón de copiar, sin
hacer nada.

Para un vídeo: `node scripts/gif-a-video.mjs entrada.gif video/salida` y luego
`<Figura video="video/salida" …>`. Nunca metas un GIF; el del sitio viejo pesaba
19 MB él solo.

## Añadir un idioma

Está preparado para dos. Un tercero serían: una entrada en `i18n/`, un
`src/pages/<lang>/`, una carpeta en `src/content/proyectos/` y tocar
`astro.config.mjs`. No es gratis, pero tampoco hay nada hardcodeado en contra.

## Antes de subir

```
npm run check     # TypeScript + el esquema de los proyectos
npm run build     # 16 páginas, sin warnings
npm run preview   # respeta el base; aquí se ven las rutas rotas
npm run humo      # con el preview levantado en otra terminal
```

`humo` comprueba lo que el build no puede: los filtros de la rejilla, el botón
de copiar, el lightbox, el cambio de idioma y que el juego arranque con música.
Si toca algo de eso, que falle ahí y no en producción.

## Deploy

`git push` a `main` y `.github/workflows/deploy.yml` construye y publica solo.

**Una vez, a mano:** GitHub → Settings → Pages → Source → **GitHub Actions**.
Mientras siga en "Deploy from a branch", el workflow construye pero no publica.

## Lo que ya no existe

El flujo viejo era duplicar un HTML de 400 líneas por proyecto y mantener la
navbar, el hub de contacto y el footer copiados en cuatro archivos. Eso se acabó:
`src/layouts/Base.astro` los tiene una vez. Si ves que estás copiando y pegando
marcado, párate — hay un componente para eso o hace falta uno.
