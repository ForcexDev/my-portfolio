# Portafolio orbital

La portada ocupa el ancho de la ventana. Geist Sans firma toda la interfaz y los títulos de sección, mientras la cursiva de Instrument Serif reserva su acento únicamente para «Morales» en el hero sobre una vista orbital fotorrealista de la Tierra. Los tonos parten del azul nebulosa de la versión original. Los paneles translúcidos dejan ver el campo estelar WebGL en movimiento continuo, con reflejos azules sutiles que siguen el puntero.

La esfera terrestre, las estrellas, las nubes satelitales en movimiento, el reflejo especular oceánico, las luces nocturnas doradas, la atmósfera Rayleigh y la aurora se calculan en WebGL en la portada usando texturas 4K derivadas de mapas 8K de Solar System Scope. Las vistas estáticas de escritorio y móvil conservan la composición cuando WebGL no está disponible. Las animaciones se detienen fuera de pantalla y respetan la preferencia de movimiento reducido.

La navegación usa una sola barra unificada (`ForcexDev` + los 6 enlaces principales + `ES`) que parte transparente a ancho completo sobre el hero y, tras la salida limpia de la radio superior, se contrae desde los lados en una única cápsula flotante oscura sin contornos anidados, donde el shader WebGL inspirado en Nimbus UI ("Waterline") dibuja únicamente la gota de agua física y sus ondas.

La radio orbital presenta una barra limpia bajo el hero con portada animada y control de volumen hairline minimalista; al salir del hero se acopla antes de la transformación de la navbar en un reproductor rectangular compacto en la esquina inferior derecha con volumen visible y modo minimizado. Las habilidades técnicas alinean el título y los tabs líquidos en una sola fila sobre tarjetas limpias de un solo nivel con íconos directos de 36px y descripciones técnicas. Las certificaciones vuelven a tres filas horizontales de fondo oscuro fundido con el espacio, acciones de texto limpio (`Ver ↗`, `En Progreso`) y borde azul orbital luminoso al pasar el cursor. Los proyectos se presentan en una grilla editorial Bento con luz direccional de 1px exclusiva en el borde que sigue al cursor sin manchar el interior. El contacto mantiene su formulario limpio por defecto junto a la proyección ortográfica en `<canvas>` 2D a 60 fps con rotación horizontal fija de izquierda a derecha e inercia suave. El pie de página cierra el recorrido con la marca ForcexDev, un agujero negro en tonos azules y su disco de acreción.

## Referencias

- Nimbus UI · Liquid Navbar ("Waterline") de guglielmogiannattasio.it, adaptado de forma nativa a Astro + TypeScript en azul orbital.
- Contact with Globe de ScrollX UI, compartido por el autor del portafolio. https://scrollxui.dev/blocks/contact-sections/contact-with-globe
- Texturas terrestres 8K (day, night, clouds, specular) de Solar System Scope (https://www.solarsystemscope.com/textures/), bajo licencia CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/), convertidas a WebP 4K/2K con mipmaps WebGL.
- Tipografía Geist Variable (@fontsource-variable/geist) e Instrument Serif (cursiva).

- Carátulas promocionales de DOOM y Sonic Mania de las fichas de sus editores en Steam. La portada de Space Invaders es una ilustración en píxeles para este arcade.
- Logotipos de las organizaciones del CTF procedentes de Dreamlab Technologies y SEK.

- Logo general de IEEEXtreme en PNG transparente, del sitio oficial de la competición.
- Música de arcade: IDKFA de Andrew Hulshult y Studiopolis Act 1 de Tee Lopes se reproducen desde los canales del compositor y de Sonic. La marcha de cuatro notas de Space Invaders se recrea con un bucle de audio local.
