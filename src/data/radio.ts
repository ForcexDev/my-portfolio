/**
 * Emisoras de la radio del portafolio.
 *
 * Cada `id` es el ID de un vídeo/directo de YouTube: el que va después de
 * `?v=` en la URL. Para cambiar una emisora basta con pegar otro ID aquí.
 *
 * `caratula` es el GIF que gira en el widget. Están alojados en Giphy, así que
 * si alguno se cae basta con sustituir la URL.
 */

export interface Emisora {
  /** ID del vídeo de YouTube (lo que va tras `?v=`) */
  id: string;
  nombre: string;
  genero: string;
  caratula: string;
}

export const emisoras: Emisora[] = [
  {
    id: 'AXvnFk38sDQ',
    nombre: 'Cosmic Radio',
    genero: 'Deep Space Ambient',
    caratula: 'https://i.giphy.com/eHXed39iQn3TrMAZJO.webp',
  },
  {
    id: 'HuFYqnbVbzY',
    nombre: 'Midnight Brew',
    genero: 'Lofi Jazz Radio',
    caratula:
      'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3I3amZ3anQ0OHI2ejl5bXF0cGZ5MXBlbndibGdmMGVsMXYwY3F2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RMwgs5kZqkRyhF24KK/giphy.gif',
  },
  {
    id: '4xDzrJKXOOY',
    nombre: 'Neon Horizon',
    genero: 'Synthwave Radio',
    caratula:
      'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGx0dWZyb3doeHg0NmQzM2pmY3l4NnN1cWVqaTFobzFlZXJleGlmMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N43iolnh53IoyCjYp4/giphy.gif',
  },
];

/** Volumen inicial, 0-100. */
export const volumenInicial = 30;
