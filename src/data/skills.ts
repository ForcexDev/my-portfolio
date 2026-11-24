/* Habilidades tecnicas, calcadas de los 5 grupos del CV (seccion "Habilidades
   Tecnicas"). Para añadir una: una linea en el array que toque.
   Los iconos estan verificados contra @iconify-json; si pones uno que no
   existe, el build falla y te lo dice. */

export type Skill = { nombre: string; icono: string };
export type SkillGroup = {
  id: string;
  titulo: { es: string; en: string };
  items: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'lenguajes',
    titulo: { es: 'Lenguajes', en: 'Languages' },
    items: [
      { nombre: 'Java', icono: 'devicon:java' },
      { nombre: 'Python', icono: 'devicon:python' },
      { nombre: 'JavaScript', icono: 'devicon:javascript' },
      { nombre: 'TypeScript', icono: 'devicon:typescript' },
      { nombre: 'C', icono: 'devicon:c' },
      { nombre: 'C++', icono: 'devicon:cplusplus' },
      { nombre: 'SQL', icono: 'devicon:postgresql' },
      { nombre: 'Bash', icono: 'simple-icons:gnubash' },
      { nombre: 'HTML/CSS', icono: 'devicon:html5' },
      { nombre: 'Lua', icono: 'devicon:lua' },
    ],
  },
  {
    id: 'desarrollo',
    titulo: { es: 'Desarrollo', en: 'Development' },
    items: [
      { nombre: 'Spring Boot', icono: 'devicon:spring' },
      { nombre: 'Spring Security', icono: 'simple-icons:springsecurity' },
      { nombre: 'JPA/Hibernate', icono: 'devicon:hibernate' },
      { nombre: 'React', icono: 'devicon:react' },
      { nombre: 'Astro', icono: 'simple-icons:astro' },
      { nombre: 'Vite', icono: 'devicon:vitejs' },
      { nombre: 'Tailwind', icono: 'devicon:tailwindcss' },
      { nombre: 'Node.js', icono: 'devicon:nodejs' },
      { nombre: 'Express', icono: 'simple-icons:express' },
      { nombre: 'Git/GitHub', icono: 'devicon:git' },
    ],
  },
  {
    id: 'ciberseguridad',
    titulo: { es: 'Ciberseguridad', en: 'Cybersecurity' },
    items: [
      // Varias de estas no tienen logo propio: van con glifo de terminal,
      // que ademas es lo que son: herramientas de linea de comandos.
      { nombre: 'Nmap', icono: 'lucide:radar' },
      { nombre: 'Gobuster', icono: 'lucide:scan-search' },
      { nombre: 'Feroxbuster', icono: 'lucide:scan-search' },
      { nombre: 'Burp Suite', icono: 'simple-icons:burpsuite' },
      { nombre: 'SQLMap', icono: 'lucide:database' },
      { nombre: 'Metasploit', icono: 'simple-icons:metasploit' },
      { nombre: 'Frida', icono: 'lucide:bug' },
      { nombre: 'LinPEAS', icono: 'devicon:linux' },
      { nombre: 'Wireshark', icono: 'simple-icons:wireshark' },
      { nombre: 'tcpdump', icono: 'lucide:terminal' },
      { nombre: 'Scapy', icono: 'lucide:waves' },
      { nombre: 'Hashcat', icono: 'simple-icons:hashcat' },
    ],
  },
  {
    id: 'datos',
    titulo: { es: 'Datos e Infraestructura', en: 'Data & Infrastructure' },
    items: [
      { nombre: 'PostgreSQL', icono: 'devicon:postgresql' },
      { nombre: 'MongoDB', icono: 'devicon:mongodb' },
      { nombre: 'Redis', icono: 'devicon:redis' },
      { nombre: 'Neo4j', icono: 'devicon:neo4j' },
      { nombre: 'Pandas', icono: 'devicon:pandas' },
      { nombre: 'Power BI', icono: 'simple-icons:powerbi' },
      { nombre: 'AWS', icono: 'simple-icons:amazonwebservices' },
      { nombre: 'Cloudflare', icono: 'devicon:cloudflare' },
      { nombre: 'Docker', icono: 'devicon:docker' },
      { nombre: 'Nginx', icono: 'devicon:nginx' },
      { nombre: 'OpenWrt', icono: 'simple-icons:openwrt' },
      { nombre: 'Vercel', icono: 'simple-icons:vercel' },
      { nombre: 'Render', icono: 'simple-icons:render' },
    ],
  },
  {
    id: 'redes',
    titulo: { es: 'Redes y Sistemas', en: 'Networking & Systems' },
    items: [
      { nombre: 'TCP/UDP', icono: 'lucide:network' },
      { nombre: 'TLS', icono: 'lucide:lock-keyhole' },
      { nombre: 'HTTP/S', icono: 'lucide:globe' },
      { nombre: 'DNS', icono: 'lucide:route' },
      { nombre: 'DHCP', icono: 'lucide:router' },
      { nombre: 'SSH', icono: 'lucide:terminal' },
      { nombre: 'Kali Linux', icono: 'devicon:kalilinux' },
      { nombre: 'Ubuntu', icono: 'devicon:ubuntu' },
      { nombre: 'Windows', icono: 'devicon:windows11' },
    ],
  },
];
