/* Trayectoria: educacion, ayudantias, investigacion y experiencia laboral.
   Sale entera del CV. Se ordena sola por fecha (mas reciente primero), asi que
   para añadir algo basta con pegar una entrada mas, en cualquier posicion. */

export type Entrada = {
  id: string;
  tipo: 'educacion' | 'academico' | 'laboral';
  rol: { es: string; en: string };
  lugar: { es: string; en: string };
  ubicacion: string;
  desde: string; // AAAA-MM
  hasta: string | null; // null = sigue en curso
  puntos: { es: string[]; en: string[] };
};

export const trayectoria: Entrada[] = [
  {
    id: 'ayudantia-cripto',
    tipo: 'academico',
    rol: {
      es: 'Ayudante de Cátedra — Criptografía y Seguridad en Redes',
      en: 'Teaching Assistant — Cryptography & Network Security',
    },
    lugar: { es: 'Universidad Diego Portales', en: 'Universidad Diego Portales' },
    ubicacion: 'Santiago, Chile',
    desde: '2026-08',
    hasta: null,
    puntos: {
      es: [
        'Ayudantías prácticas sobre cifrado simétrico y asimétrico, funciones hash, firmas digitales, PKI y TLS, con ejercicios guiados y resolución de dudas.',
        'Preparación de laboratorios de análisis de tráfico y ataques a protocolos (Wireshark, Scapy, OpenSSL) y apoyo en la evaluación de tareas y controles.',
      ],
      en: [
        'Hands-on sessions on symmetric and asymmetric encryption, hash functions, digital signatures, PKI and TLS, with guided exercises and Q&A.',
        'Built traffic-analysis and protocol-attack labs (Wireshark, Scapy, OpenSSL) and supported grading of assignments and tests.',
      ],
    },
  },
  {
    id: 'ayudantia-tics',
    tipo: 'academico',
    rol: {
      es: 'Ayudante de Cátedra — Proyecto en TICs I',
      en: 'Teaching Assistant — ICT Project I',
    },
    lugar: { es: 'Universidad Diego Portales', en: 'Universidad Diego Portales' },
    ubicacion: 'Santiago, Chile',
    desde: '2026-03',
    hasta: null,
    puntos: {
      es: [
        'Apoyo en sesiones de cátedra y resolución de dudas frente al curso.',
        'Acompañamiento a equipos de proyecto: definición de alcance, elección de tecnologías y seguimiento de avances.',
        'Revisión de entregas y retroalimentación sobre informes, código y presentaciones.',
      ],
      en: [
        'Supported lectures and fielded questions in front of the class.',
        'Mentored project teams on scope definition, technology choices and progress tracking.',
        'Reviewed deliverables and gave feedback on reports, code and presentations.',
      ],
    },
  },
  {
    id: 'practica-investigacion',
    tipo: 'academico',
    rol: {
      es: 'Práctica de Investigación I',
      en: 'Research Practicum I',
    },
    lugar: {
      es: 'Universidad Diego Portales — profesor guía: Nicolás Boettcher',
      en: 'Universidad Diego Portales — advisor: Nicolás Boettcher',
    },
    ubicacion: 'Santiago, Chile',
    desde: '2025-12',
    hasta: null,
    puntos: {
      es: [
        'Auditoría de fuga de datos personales (PII) en aplicaciones de control parental y servicios digitales: análisis de tráfico, ingeniería inversa e interceptación TLS con Frida, tcpdump y Wireshark.',
        'Pipeline de captura y procesamiento de tráfico (.pcap) con extracción de características y almacenamiento estructurado para alimentar un motor de detección basado en reglas.',
        'Diseño de un dashboard DLP sobre OpenWrt que clasifica el tráfico en PII, datos sensibles y metadatos, lo contrasta con las políticas de privacidad declaradas y opera como SOC doméstico.',
      ],
      en: [
        'Auditing personal-data (PII) leakage in parental-control apps and digital services: traffic analysis, reverse engineering and TLS interception with Frida, tcpdump and Wireshark.',
        'Capture and processing pipeline for .pcap traffic, with feature extraction and structured storage feeding a rule-based detection engine.',
        'Designed a DLP dashboard on OpenWrt that classifies traffic into PII, sensitive data and metadata, checks it against the stated privacy policies, and runs as a home SOC.',
      ],
    },
  },
  {
    id: 'udp',
    tipo: 'educacion',
    rol: {
      es: 'Ingeniería Civil en Informática y Telecomunicaciones',
      en: 'BSc/MEng in Computer & Telecommunications Engineering',
    },
    lugar: { es: 'Universidad Diego Portales', en: 'Universidad Diego Portales' },
    ubicacion: 'Santiago, Chile',
    desde: '2023-03',
    hasta: null,
    puntos: {
      es: ['Cursando 4.º año.'],
      en: ['Currently in the 4th year.'],
    },
  },
  {
    id: 'sodimac',
    tipo: 'laboral',
    rol: { es: 'Analista de Inventario', en: 'Inventory Analyst' },
    lugar: { es: 'Sodimac', en: 'Sodimac' },
    ubicacion: 'Santiago, Chile',
    desde: '2022-05',
    hasta: '2022-07',
    puntos: {
      es: [
        'Análisis de inventario y auditoría de carga, coordinando bodega y transporte para mantener la trazabilidad de productos.',
      ],
      en: [
        'Inventory analysis and load auditing, coordinating warehouse and transport to keep products traceable.',
      ],
    },
  },
  {
    id: 'titan',
    tipo: 'laboral',
    rol: {
      es: 'Encargado de Informática y Logística',
      en: 'IT & Logistics Lead',
    },
    lugar: { es: 'Titan Service PC', en: 'Titan Service PC' },
    ubicacion: 'Santiago, Chile',
    desde: '2020-03',
    hasta: '2021-04',
    puntos: {
      es: [
        'Diagnóstico y reparación de equipos, soporte a usuarios, gestión de inventario técnico y control de dispositivos en garantía.',
      ],
      en: [
        'Hardware diagnosis and repair, user support, technical inventory management and warranty device tracking.',
      ],
    },
  },
];

/** Mas reciente primero. */
export const trayectoriaOrdenada = [...trayectoria].sort((a, b) => b.desde.localeCompare(a.desde));
