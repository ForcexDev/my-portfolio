# Guía de Mantenimiento y Escalabilidad

Este documento detalla la estructura del código y cómo agregar nuevos proyectos o walkthroughs manteniendo el estilo visual y la funcionalidad.

## 1. Estructura de Archivos
El sistema de plantillas consta de 4 partes principales:
- **HTML (Contenido):** `pages/nombre-proyecto.html`
- **CSS Base:** `css/page-template.css` (Estilos modulares para subpáginas) y `css/components.css` (Estilos globales compartidos como el botón Back-to-Top).
- **CSS Responsivo:** `css/responsive.css` (Base móvil) y **`css/responsive-enhancements.css`** (Ajustes finos para Mobile/2K traídos por el usuario).
- **JS (Funcionalidad):** `js/page-template.js` (Lógica específica de subpáginas).

## 2. Decisiones de Diseño Explicadas
### Cursores y Navegación
- **Home:** Usa el "Cursor Cósmico" personalizado.
- **Subpáginas (Project/Walkthrough):** Se fuerza el **cursor por defecto** del sistema para evitar conflictos de UX en lecturas largas o interacciones complejas. Esto se controla en `page-template.css`.

### Marcos y Contenido Multimedia
- **Imágenes y Videos:** Usan un sistema de "marco adaptativo" (`width: fit-content` en contenedores o bordes directos en `img`) para que el borde siempre abrace el contenido sin dejar espacios vacíos, sin importar la relación de aspecto.

### Botón "Volver Arriba"
- Sincronizado con el Home para mantener el estilo Glassmorphism premium. Se hereda directamente de `components.css`.

## 3. Cómo Agregar un Nuevo Proyecto
Para crear una nueva página de proyecto (Showcase) o guía (Walkthrough), sigue estos pasos:

### Paso 1: Duplicar la Plantilla Correcta
- Si es un **Proyecto** (con imágenes grandes, demo, galería):
  Duplicate `pages/ia-project-showcase.html` y renómbralo (ej: `mi-nuevo-proyecto.html`).
- Si es un **Walkthrough** (con pasos, código, terminal):
  Duplicate `pages/bandit-walkthrough.html` y renómbralo (ej: `nueva-guia.html`).

### Paso 2: Editar Metadatos (Head)
Abre el nuevo archivo y modifica:
```html
<title>Nombre del Proyecto | ForcexDev</title>
<!-- Asegúrate de MANTENER los links a responsive-enhancements.css y components.css -->
```

### Paso 3: Modificar el Contenido
El contenido está dentro de `.page-content`. Las secciones clave son:

- **Encabezado (`header.page-header`):**
  - `.page-title`: Título principal.
  - `.page-subtitle`: Descripción breve.
  - `.page-tags`: Etiquetas de tecnologías (ej: `<span class="tag">React</span>`).

- **Bloques de Texto (`article.text-block`):**
  - Usa `<section>` para separar temas.
  - Usa `<h2>` con iconos para subtítulos (ej: `<h2><i class="fas fa-star"></i> Características</h2>`).
  - **Código:** Usa la estructura `.code-block` para snippets con botón de copiar. El scroll horizontal se previene automáticamente con `pre-wrap`.
  - **Alertas:** Usa `.callout.info` para notas importantes.

### Paso 4: Configurar Navegación
La navbar simplificada ya está configurada. Solo asegúrate de que el logo apunte correctamente al inicio:
```html
<a href="../index.html#home" class="logo">ForcexDev</a>
```

### Paso 5: Agregar el Link en el Portfolio Principal
Edita `index.html` y busca la sección `#projects`. Agrega una nueva `project-card` que enlace a tu nueva página:
```html
<a href="pages/mi-nuevo-proyecto.html" class="project-link-btn">Ver Detalles</a>
```

## 4. Personalización de Estilos
Todo el diseño se controla centralmente desde `css/page-template.css` y `css/responsive-enhancements.css`.

### Gestión de Botones
El sistema utiliza diferentes clases de botones según su función:
1.  **Botones de Llamada a la Acción (`.cta-button`, `.submit-btn`):**
    - **Estilos Base:** Definidos globalmente en `css/base.css` o `css/components.css`.
    - **Ajustes Responsivos:** Sus tamaños y paddings para tablet/móvil se ajustan en `css/responsive-enhancements.css`.
2.  **Botón Volver Arriba (`.back-to-top`):**
    - **Estilo Premium:** Heredado directamente de `css/components.css` para mantener la identidad visual del Home (Glassmorphism, flotación). No debe haber estilos duplicados en `page-template.css`.
3.  **Botones de Copia (`.copy-btn`):**
    - **Específicos:** Definidos exclusivamente en `css/page-template.css` ya que solo aparecen en bloques de código.

### Gestión de Botones (Acciones Finales)
Al final de cada proyecto o walkthrough, encontrarás una sección de acciones (`<footer>`). Aquí puedes agregar o quitar botones según necesites:

#### 1. Estructura HTML Base
```html
<footer class="text-block" style="text-align: center; margin-top: 4rem;">
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <!-- TUS BOTONES VAN AQUÍ -->
    </div>
</footer>
```

#### 2. Código para Botones Comunes
Copia y pega estos bloques dentro del `div` anterior:

**A. Ver Repositorio (GitHub):**
```html
<a href="URL_DEL_REPO" target="_blank" class="cta-button">
    <i class="fab fa-github"></i> <span>View Repository</span>
</a>
```

**B. Ver Demo en Vivo:**
```html
<a href="URL_DEL_DEMO" target="_blank" class="cta-button">
    <i class="fas fa-external-link-alt"></i> <span>Live Demo</span>
</a>
```

**C. Volver al Portafolio (Secundario):**
```html
<a href="../index.html#projects" class="cta-button secondary-btn">
    <span>Back to Portfolio</span>
</a>
```

#### 3. Cómo Agregar/Quitar
- **Agregar:** Simplemente pega el código del botón que quieras dentro del `div` contenedor.
- **Quitar:** Borra la etiqueta `<a>` completa del botón que no desees.
- **Personalizar:** Cambia el `href` por tu link y el texto del `span`.

- **Colores Generales:** Se usan variables CSS (`var(--nebula-blue)`, etc.) definidas en `variables.css`.
- **Media Queries:** Si necesitas ajustar algo para móvil, hazlo preferiblemente en `responsive-enhancements.css` para mantener el orden.

## 5. Escalabilidad
El código está diseñado para ser modular.
- **Navbar:** Si decides cambiar la navbar en el futuro, solo necesitas editar el bloque `<nav>` en tus archivos HTML. El CSS se adaptará automáticamente.
- **Scripts:** `page-template.js` detecta automáticamente todos los bloques de código y les añade la funcionalidad de copiar, sin necesidad de configuración extra.

## 6. Checklist para GitHub
Antes de subir cambios (commit/push):
1.  [ ] Verifica que todos los links (`href`) funcionen.
2.  [ ] Abre la página en modo incógnito para asegurar que no hay cache de estilos viejos.
3.  [ ] Prueba la versión móvil (usa las DevTools de Chrome con F12 -> Icono de celular).
4.  [ ] Confirma que el Contact Hub se vea idéntico en Home y Subpáginas.
