# Portafolio de Ezequiel Morales

Portafolio web bilingüe (ES/EN) de ForcexDev. Reúne sus proyectos, experiencia, aprendizaje en redes y ciberseguridad, habilidades, competencias, certificaciones y vías de contacto. El visitante puede alternar idioma sin recargar, explorar proyectos, escuchar la radio, cambiar la atmósfera desde el arcade y enviar un mensaje directo.

## Arcade

Incluye 16 carátulas clásicas OG (con Mortal Kombat 1992 al inicio, DOOM, Sonic Mania, Tetris, Pac-Man, Street Fighter II, Counter-Strike 1.6, Half-Life, Quake, Space Invaders, Asteroids, Pong, Metal Slug, GTA: San Andreas, Portal y Halo) en un carrusel continuo con discos ópticos impresos giratorios y un modo inmersivo Túnel 3D. Cada selección cambia la atmósfera visual del sitio y reproduce su tema en la radio.

## Próximas mejoras

- **CV protegido con código temporal canjeable:** restringir la visualización y descarga del CV mediante un código con expiración (TTL) o límite de usos generado para reclutadores y contactos específicos.
- **Nota de arquitectura segura:** como el portafolio se despliega como sitio estático en GitHub Pages, el PDF real no debe quedar expuesto en `public/documents/` ni validarse solo en el navegador. Conviene servirlo desde un endpoint ligero (por ejemplo, Cloudflare Worker + KV/R2 o Edge Function) que verifique el código/token y entregue el PDF únicamente cuando sea válido.
