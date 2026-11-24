/* Datos de contacto y enlaces. Fuente unica: si cambia algo, se cambia aqui
   y se actualiza en todo el sitio (nav, hub de contacto, pie, meta tags, CV). */

export const site = {
  nombre: 'Ezequiel Morales',
  nombreCompleto: 'Ezequiel Leandro Morales Herrera',
  alias: 'ForcexDev',
  ubicacion: 'Santiago, Chile',
  email: 'ezeforce.morales@gmail.com',
  // El telefono esta en el CV a proposito, pero no en la web: un portafolio
  // publico es un imán para el spam. Quien lo necesite lo tiene en el PDF.

  // Ruta del CV. Antes estaba escrita a mano en 5 sitios y apuntaba al de 2025.
  cv: 'cv/ForcexDev-CV.pdf',

  dominio: 'https://forcexdev.github.io/my-portfolio',
} as const;

export type Red = {
  id: string;
  nombre: string;
  url: string;
  icono: string; // nombre de icono para astro-icon
};

export const redes: Red[] = [
  { id: 'github', nombre: 'GitHub', url: 'https://github.com/ForcexDev', icono: 'simple-icons:github' },
  { id: 'linkedin', nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/ezequielleandromorales/', icono: 'simple-icons:linkedin' },
  { id: 'tryhackme', nombre: 'TryHackMe', url: 'https://tryhackme.com/p/ForcexDev', icono: 'simple-icons:tryhackme' },
  { id: 'hackthebox', nombre: 'Hack The Box', url: 'https://profile.hackthebox.com/profile/019c38be-e58b-70e7-8414-6252a08e0953', icono: 'simple-icons:hackthebox' },
  { id: 'leetcode', nombre: 'LeetCode', url: 'https://leetcode.com/u/ForcexDev/', icono: 'simple-icons:leetcode' },
  { id: 'hackerrank', nombre: 'HackerRank', url: 'https://www.hackerrank.com/profile/ezequiel_morales', icono: 'simple-icons:hackerrank' },
];

/* EmailJS: la publicKey es publica por diseño (va en el navegador de todos
   modos), no es un secreto filtrado. Si algun dia el formulario recibe spam,
   la solucion es activar el captcha en el panel de EmailJS, no esconder esto. */
export const emailjs = {
  publicKey: 'E8H5tFoLO5TEgufG-',
  serviceId: 'service_xv6tnfg',
  templateId: 'template_204nyfj',
} as const;
