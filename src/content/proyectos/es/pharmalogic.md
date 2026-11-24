---
titulo: 'PharmaLogic'
resumen: 'Sistema de gestión de droguería con control de acceso dinámico: 20 permisos granulares sobre 5 roles, editables desde la propia interfaz.'
area: 'full-stack'
estado: 'desplegado'
anio: 2026
rol: 'Full Stack / DevOps en un equipo de 5'
stack:
  - 'Java 17'
  - 'Spring Boot'
  - 'Spring Security'
  - 'JWT'
  - 'React'
  - 'PostgreSQL'
imagen: '../../../assets/img/portadas/pharmalogic.png'
imagenAlt: 'Portada del proyecto PharmaLogic'
enlaces:
  demo: 'https://pharmalogic.cl'
orden: 1
---

Sistema de gestión para una droguería: inventario, ventas, usuarios y trazabilidad.
Lo hicimos entre cinco, y me tocó la arquitectura, la integración entre backend y
frontend, y el despliegue.

## Control de acceso dinámico

La parte que más trabajo dio y de la que más aprendí. En vez de dejar los permisos
escritos en el código, el sistema tiene **20 permisos granulares** repartidos sobre
**5 roles**, y esa matriz se edita desde la interfaz: el administrador marca una
casilla y el permiso cambia sin tocar el despliegue.

Detrás hay tres cosas que lo sostienen:

- **Validación por endpoint.** Cada ruta declara qué permiso exige. No basta con
  estar autenticado; hay que tener el permiso concreto.
- **Log de auditoría.** Todo cambio sobre la matriz queda registrado: quién, qué y
  cuándo.
- **Un único punto de decisión.** La comprobación vive en el filtro, no repartida por
  los controladores, así no hay forma de olvidarse de ponerla en un endpoint nuevo.

## Seguridad de la API

- **JWT** emitido y validado con Spring Security, con filtro de validación en cada
  petición.
- Contraseñas con **BCrypt**, nunca en claro ni reversibles.
- **CORS restringido** al dominio del frontend, no `*`.
- Rutas protegidas por permiso, no por rol: cambiar de rol no obliga a tocar
  las rutas.

## Despliegue

| Pieza | Dónde |
|---|---|
| Frontend React | Vercel |
| API Spring Boot | Render |
| PostgreSQL | Neon |
| Documentación | Swagger |

Está en producción, en [pharmalogic.cl](https://pharmalogic.cl).
