---
titulo: 'PharmaLogic'
resumen: 'Pharmaceutical warehouse management system with dynamic access control: 20 granular permissions across 5 roles, editable from the UI itself.'
area: 'full-stack'
estado: 'desplegado'
anio: 2026
rol: 'Full Stack / DevOps in a team of 5'
stack:
  - 'Java 17'
  - 'Spring Boot'
  - 'Spring Security'
  - 'JWT'
  - 'React'
  - 'PostgreSQL'
imagen: '../../../assets/img/portadas/pharmalogic.png'
imagenAlt: 'PharmaLogic project cover'
enlaces:
  demo: 'https://pharmalogic.cl'
orden: 1
---

A management system for a pharmaceutical warehouse: inventory, sales, users and
traceability. Five of us built it, and I took architecture, backend–frontend
integration and deployment.

## Dynamic access control

The hardest part, and the one I learned the most from. Instead of hard-coding
permissions, the system has **20 granular permissions** spread across **5 roles**,
and that matrix is edited from the UI: an admin ticks a box and the permission
changes without a redeploy.

Three things hold it up:

- **Per-endpoint validation.** Every route declares which permission it requires.
  Being authenticated isn't enough; you need the specific permission.
- **Audit log.** Every change to the matrix is recorded: who, what and when.
- **A single decision point.** The check lives in the filter, not scattered across
  controllers, so there's no way to forget it on a new endpoint.

## API security

- **JWT** issued and validated through Spring Security, with a validation filter on
  every request.
- Passwords hashed with **BCrypt**, never stored in plain text or reversible.
- **CORS restricted** to the frontend domain, not `*`.
- Routes guarded by permission, not by role: changing a role doesn't mean touching
  the routes.

## Deployment

| Piece | Where |
|---|---|
| React frontend | Vercel |
| Spring Boot API | Render |
| PostgreSQL | Neon |
| Docs | Swagger |

Live at [pharmalogic.cl](https://pharmalogic.cl).
