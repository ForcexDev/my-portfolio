/* El id que comparten el satélite de la órbita y su baldosa en la lista: es lo
   que permite que un clic en el sistema orbital baje a la tecnología correcta. */
export const slugSkill = (nombre: string): string =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
