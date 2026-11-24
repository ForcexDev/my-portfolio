/* La ventana de terminal del inicio: el bloque neofetch y los comandos que se
   teclean solos. Todo sale de aqui, asi que se traduce y se edita en un sitio. */

type Bilingue = { es: string; en: string };

export const neofetch = {
  usuario: 'ezequiel',
  host: 'forcexdev',
  lineas: [
    {
      clave: { es: 'OS', en: 'OS' },
      valor: { es: 'Kali Linux · Ubuntu · Windows', en: 'Kali Linux · Ubuntu · Windows' },
      icono: 'simple-icons:linux',
    },
    {
      clave: { es: 'Rol', en: 'Role' },
      valor: {
        es: 'Ing. Civil en Informática y Telecom.',
        en: 'Computer & Telecom Engineering',
      },
      icono: 'lucide:user-round',
    },
    {
      clave: { es: 'Univ', en: 'Univ' },
      valor: {
        es: 'Universidad Diego Portales · 4.º año',
        en: 'Universidad Diego Portales · 4th year',
      },
      icono: 'lucide:graduation-cap',
    },
    {
      clave: { es: 'Stack', en: 'Stack' },
      valor: {
        es: 'Java · Spring Boot · React · Astro',
        en: 'Java · Spring Boot · React · Astro',
      },
      icono: 'lucide:layers',
    },
    {
      clave: { es: 'Foco', en: 'Focus' },
      valor: {
        es: 'Ciberseguridad · Redes · Backend',
        en: 'Cybersecurity · Networking · Backend',
      },
      icono: 'lucide:crosshair',
    },
    {
      clave: { es: 'Ahora', en: 'Now' },
      valor: {
        es: 'Ayudante de cátedra · Práctica I+D',
        en: 'Teaching assistant · Research practicum',
      },
      icono: 'lucide:activity',
    },
    {
      clave: { es: 'Ubi', en: 'Location' },
      valor: { es: 'Santiago, Chile', en: 'Santiago, Chile' },
      icono: 'lucide:map-pin',
    },
  ] satisfies { clave: Bilingue; valor: Bilingue; icono: string }[],
};

/** Años programando, para que no haya que actualizarlo a mano cada enero. */
export const desdeAnio = 2023;
export const anios = new Date().getFullYear() - desdeAnio;

/* Comandos del terminal. Son reales: hacen lo que dicen que hacen, que era
   justo lo que fallaba antes (un `echo $Passion` que no existe en ningun shell). */
export const comandos: { cmd: string; salida: { es: string[]; en: string[] } }[] = [
  {
    cmd: 'whoami && groups',
    salida: {
      es: ['ezequiel', 'estudiante  ayudante  ctf-player'],
      en: ['ezequiel', 'student  teaching-assistant  ctf-player'],
    },
  },
  {
    cmd: 'ls ~/proyectos | wc -l',
    salida: { es: ['7'], en: ['7'] },
  },
  {
    cmd: 'cat ~/.config/foco.toml',
    salida: {
      es: ['[areas]', 'backend  = "seguro por defecto"', 'redes    = "TLS, DNS, captura de tráfico"', 'ofensiva = "CTF, pentesting web"'],
      en: ['[areas]', 'backend  = "secure by default"', 'networking = "TLS, DNS, traffic capture"', 'offensive  = "CTF, web pentesting"'],
    },
  },
  {
    cmd: 'curl -s forcexdev.dev/status | jq .',
    salida: {
      es: ['{', '  "disponible": true,', '  "sede": "Santiago, CL"', '}'],
      en: ['{', '  "available": true,', '  "based_in": "Santiago, CL"', '}'],
    },
  },
];

/* Log de arranque de la pantalla de carga. Engancha con la estetica del
   terminal de abajo, en vez de un "LOADING..." suelto. */
export const bootLog: { t: string; msg: Bilingue }[] = [
  { t: '0.00', msg: { es: 'montando /dev/nebula', en: 'mounting /dev/nebula' } },
  { t: '0.31', msg: { es: 'cargando cartografía estelar', en: 'loading stellar cartography' } },
  { t: '0.62', msg: { es: 'sincronizando órbitas', en: 'syncing orbits' } },
  { t: '0.88', msg: { es: 'forcexdev.core', en: 'forcexdev.core' } },
];
