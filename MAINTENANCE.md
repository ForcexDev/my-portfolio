# Mantenimiento del portafolio

Instala las dependencias con `npm ci` y ejecuta `npm run dev`. La aplicación se sirve bajo `/my-portfolio/`. Ejecuta `npm run check` para verificar los tipos y `npm run build` para generar el sitio estático en `dist/`.

## Contenido

- Las páginas de entrada en `src/pages/` comparten los componentes de `src/components/`. La portada está en español y la versión inglesa se publica en `en.html`.
- Los textos de la portada están en `src/i18n/es.json` y `src/i18n/en.json`.
- Para actualizar un proyecto, modifica sus enlaces, etiquetas e imagen en `src/data/projects.json` y sus textos en ambos diccionarios. Los proyectos con artículo se muestran como destacados y el resto aparece en el listado. Los artículos viven en `src/content/projects/`.
- El visor y la descarga comparten `public/documents/Ezequiel-Morales-CV.pdf`. Los resultados del CTF se mantienen en `src/components/Competition.astro`.
- Las habilidades y emisoras se mantienen en `src/data/`. Para actualizar una credencial, revisa los textos de ambos idiomas y su enlace de verificación en `Profile.astro`.
- Los controles compartidos por la radio y el arcade están en `src/scripts/radio.ts`. Las pistas del arcade se mantienen en `src/data/arcade.ts`. La radio carga YouTube cuando alguien solicita reproducción.
- El formulario en `Contact.astro` utiliza EmailJS y conserva los nombres de campo de la plantilla original.
- El navegador carga imágenes, descargas y audio desde `public/`. Las fuentes están en `src/fonts/` con sus licencias.

## Publicación

El flujo de GitHub Actions construye el sitio tras un push a `main` y publica `dist/` en GitHub Pages. La fuente de Pages debe estar configurada como GitHub Actions.
