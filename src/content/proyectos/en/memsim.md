---
titulo: 'memsim'
resumen: 'A memory allocation simulator in C: dynamic partitions with First-Fit, Best-Fit and Worst-Fit, coalescing, compaction and an external fragmentation index.'
area: 'sistemas'
estado: 'desplegado'
anio: 2026
rol: 'Academic project'
stack:
  - 'C'
  - 'Memory management'
  - 'Data structures'
imagen: '../../../assets/img/portadas/memsim.png'
imagenAlt: 'memsim project cover'
enlaces:
  repo: 'https://github.com/ForcexDev/memsim'
orden: 3
---

A dynamic-partition memory manager written in C. It simulates what an operating
system does when something asks for memory and it has to decide where to put it.

## The three policies

All three walk the free list and pick differently:

- **First-Fit** — the first hole it fits in. The fastest.
- **Best-Fit** — the smallest hole it fits in. Wastes less per block, but leaves a
  trail of tiny useless leftovers.
- **Worst-Fit** — the largest hole. Leaves big leftovers that are actually usable, at
  the cost of carving up the good blocks.

None of them wins every time, and that is exactly what the simulator makes visible.

## What happens on free

Freeing a block checks its neighbours: if the block next door is also free, the two
merge into one. That is **coalescing**, and without it memory turns into confetti
even when there is plenty of space left.

When even coalescing cannot produce a large enough hole, **compaction** kicks in:
everything allocated shifts to one end and the free space ends up together, in a
single block.

## Measure, do not guess

The simulator computes the **external fragmentation index** at each step: how much
free memory there is in total versus how much fits in the largest hole. That is the
number that tells you whether the problem is *no memory* or *badly spread memory*.

## The tests

There is a set of traces for the cases that break things:

- extreme fragmentation — many small blocks alternating used and free;
- **repeated PIDs** — two processes requesting under the same identifier;
- invalid input — negative sizes, freeing something never allocated, asking for more
  memory than exists.

Code at [github.com/ForcexDev/memsim](https://github.com/ForcexDev/memsim).
