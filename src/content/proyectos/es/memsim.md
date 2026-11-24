---
titulo: 'memsim'
resumen: 'Simulador de asignación de memoria en C: particiones dinámicas con First-Fit, Best-Fit y Worst-Fit, coalescencia, compactación e índice de fragmentación externa.'
area: 'sistemas'
estado: 'desplegado'
anio: 2026
rol: 'Proyecto académico'
stack:
  - 'C'
  - 'Gestión de memoria'
  - 'Estructuras de datos'
imagen: '../../../assets/img/portadas/memsim.png'
imagenAlt: 'Portada del proyecto memsim'
enlaces:
  repo: 'https://github.com/ForcexDev/memsim'
orden: 3
---

Un gestor de memoria con particiones dinámicas, escrito en C. Simula lo que hace un
sistema operativo cuando le piden memoria y tiene que decidir dónde ponerla.

## Las tres políticas

Las tres recorren la lista de huecos libres y eligen distinto:

- **First-Fit** — el primer hueco donde quepa. La más rápida.
- **Best-Fit** — el hueco más pequeño donde quepa. Desperdicia menos por bloque,
  pero deja muchos restos diminutos e inservibles.
- **Worst-Fit** — el hueco más grande. Deja restos grandes, que sí sirven para algo,
  a costa de partir los bloques buenos.

No hay una que gane siempre, y eso es justo lo que el simulador deja ver.

## Lo que pasa al liberar

Al liberar un bloque se comprueban sus vecinos: si el de al lado también está libre,
los dos se funden en uno solo. Eso es la **coalescencia**, y sin ella la memoria se
convierte en confeti aunque quede espacio de sobra.

Cuando ni con coalescencia queda un hueco lo bastante grande, entra la
**compactación**: se mueve todo lo ocupado hacia un extremo y el espacio libre queda
junto, en un solo bloque.

## Medir en vez de opinar

El simulador calcula el **índice de fragmentación externa** en cada paso: cuánta
memoria libre hay en total frente a cuánta cabe en el hueco más grande. Es el número
que dice si el problema es que no hay memoria o que está mal repartida.

## Las pruebas

Hay una batería de trazas para los casos que rompen cosas:

- fragmentación extrema — muchos bloques pequeños alternando ocupado y libre;
- **PID repetidos** — dos procesos que piden con el mismo identificador;
- entradas inválidas — tamaños negativos, liberar algo que no se asignó, pedir más
  memoria de la que existe.

El código está en [github.com/ForcexDev/memsim](https://github.com/ForcexDev/memsim).
