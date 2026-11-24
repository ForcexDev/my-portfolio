---
titulo: 'Compendium Notes'
resumen: 'Transcripción y apuntes con privacidad por diseño: todo se procesa en el navegador, sin backend, y las claves de API nunca salen de tu máquina.'
area: 'full-stack'
estado: 'desplegado'
anio: 2025
rol: 'Proyecto personal'
stack:
  - 'Astro'
  - 'React'
  - 'TypeScript'
  - 'Tailwind'
  - 'WebAssembly'
imagen: '../../../assets/img/portadas/compendium-notes.png'
imagenAlt: 'Portada del proyecto Compendium Notes'
enlaces:
  demo: 'https://compendium-notes.vercel.app/'
orden: 2
---

Una aplicación para transcribir grabaciones y convertirlas en apuntes. La premisa
fue una sola: **que la grabación no salga nunca del navegador de quien la sube**.

## Privacidad por diseño, no por política

No hay backend. No hay base de datos. No hay un bucket donde queden los audios.
El procesamiento es **100 % en el cliente**, así que la promesa de privacidad no
depende de que me creas: depende de que no existe el sitio donde guardarlo.

Las claves de API van bajo esquema **BYOK** (*bring your own key*): las pone el
usuario, se quedan en su navegador, y nunca viajan a ningún servidor mío — porque
no hay servidor mío.

## El problema real: los archivos largos

Las APIs de transcripción tienen un límite de tamaño por petición. Una clase de
90 minutos lo supera de sobra.

La solución fue meter **FFmpeg compilado a WebAssembly** dentro de la pestaña:

1. Se trocea el audio en fragmentos que caben en el límite.
2. Se comprime cada fragmento, que baja mucho el tamaño sin perder inteligibilidad
   para voz hablada.
3. Se transcriben en orden y se cosen los resultados.

Es el mismo FFmpeg de siempre, corriendo dentro del navegador. Nada se sube para
trocearlo.

Está en [compendium-notes.vercel.app](https://compendium-notes.vercel.app/).
