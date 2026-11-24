/* Logros y competencias (CTF, maratones de programacion). Del CV. */

export type Logro = {
  id: string;
  titulo: string;
  organizador: { es: string; en: string };
  icono: string;
  /** 'AAAA' o 'AAAA — AAAA' si abarca varias ediciones; se muestra tal cual. */
  periodo: string;
  /** Lo que se destaca en grande en la tarjeta. */
  destacado: { es: string; en: string };
  /** `fecha` en 'AAAA-MM': la formatea utils/fechas.ts según el idioma. */
  ediciones: { fecha: string; resultado: { es: string; en: string } }[];
};

export const logros: Logro[] = [
  {
    id: 'ctf-dreamlab',
    titulo: 'CTF Hackathon',
    organizador: {
      es: 'Dreamlab / SEK · Universidad Diego Portales',
      en: 'Dreamlab / SEK · Universidad Diego Portales',
    },
    icono: 'lucide:flag',
    periodo: '2025 — 2026',
    destacado: { es: '4.º lugar', en: '4th place' },
    ediciones: [
      {
        fecha: '2026-06',
        resultado: { es: 'IV edición — 4.º lugar en equipo', en: '4th edition — 4th place, team' },
      },
      {
        fecha: '2025-11',
        resultado: { es: 'III edición — 800 puntos individuales', en: '3rd edition — 800 points, solo' },
      },
      {
        fecha: '2025-06',
        resultado: { es: 'II edición — 6.º lugar en equipo', en: '2nd edition — 6th place, team' },
      },
    ],
  },
  {
    id: 'ieee-xtreme',
    titulo: 'IEEE Xtreme 19.0',
    organizador: { es: 'Equipo FlagRebels', en: 'Team FlagRebels' },
    icono: 'lucide:trophy',
    periodo: '2025',
    destacado: { es: '6.º nacional', en: '6th nationally' },
    ediciones: [
      {
        fecha: '2025-10',
        resultado: {
          es: '6.º lugar nacional en Chile y 924.º mundial en la competencia de programación de 24 horas',
          en: '6th nationally in Chile and 924th worldwide in the 24-hour programming contest',
        },
      },
    ],
  },
];
