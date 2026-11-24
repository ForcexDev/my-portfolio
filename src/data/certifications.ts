/* Certificaciones e idiomas. Del CV. */

export type Certificacion = {
  id: string;
  titulo: { es: string; en: string };
  emisor: string;
  icono: string;
  url: string | null; // null = todavia en curso, sin credencial
  estado: 'obtenida' | 'en-curso';
};

export const certificaciones: Certificacion[] = [
  {
    id: 'cisco-intro-ciber',
    titulo: {
      es: 'Introduction to Cybersecurity',
      en: 'Introduction to Cybersecurity',
    },
    emisor: 'Cisco Networking Academy',
    icono: 'simple-icons:cisco',
    url: 'https://www.credly.com/badges/05aff769-7021-4bf6-9e5e-15b542112284/public_url',
    estado: 'obtenida',
  },
  {
    id: 'cisco-networking',
    titulo: {
      es: 'Networking Essentials — Network Technician Career Path',
      en: 'Networking Essentials — Network Technician Career Path',
    },
    emisor: 'Cisco Networking Academy',
    icono: 'simple-icons:cisco',
    url: 'https://www.credly.com/badges/21eb7975-97d2-469e-b608-c23b6dab214e/public_url',
    estado: 'obtenida',
  },
  {
    id: 'fcc-ingles',
    titulo: {
      es: 'Inglés para Desarrolladores',
      en: 'English for Developers',
    },
    emisor: 'freeCodeCamp',
    icono: 'simple-icons:freecodecamp',
    url: null,
    estado: 'en-curso',
  },
];

export const idiomas = [
  { nombre: { es: 'Español', en: 'Spanish' }, nivel: 'C2', nativo: true },
  { nombre: { es: 'Inglés', en: 'English' }, nivel: 'B2', nativo: false },
];
