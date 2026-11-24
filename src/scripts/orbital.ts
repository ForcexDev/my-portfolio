/**
 * El sistema orbital: cuerpos girando alrededor de una estrella que a su vez
 * se mueve, así que la estela que deja cada uno es una hélice.
 *
 * Es canvas 2D y no Three.js a propósito: son puntos, líneas y degradados, y
 * para eso el 2D no necesita descargar nada ni compilar un shader. El fondo de
 * estrellas ya lo pone `SpaceCanvas`, así que aquí sólo se dibuja el sistema —
 * el lienzo es transparente y deja ver el cielo de detrás.
 *
 * Qué es real y qué está puesto para que se vea bien, que conviene saberlo:
 * las órbitas son elipses de Kepler de verdad (misma ley de áreas, mismos
 * periodos según a^1.5), pero `compress` las acerca entre sí para que quepan
 * en pantalla, y `alignToCourse` endereza todos los planos sobre el del rumbo
 * de la estrella para que las hélices salgan paralelas. Eso último es la
 * imagen bonita, no la geometría real.
 *
 *   const orbital = montarOrbital(lienzo, { cuerpos });
 *   orbital.alPintar((puntos) => { … colocar etiquetas … });
 */

export interface Cuerpo {
  nombre: string;
  /** Semieje mayor. */
  a: number;
  /** Excentricidad. */
  e: number;
  /** Inclinación sobre la eclíptica, en grados. */
  i: number;
  /** Longitud del nodo ascendente, en grados. */
  node: number;
  /** Argumento del periastro, en grados. */
  peri: number;
  /** Anomalía media de partida, en grados. */
  M0: number;
  color: string;
  /** Radio del punto en px. Nada aquí está a escala: no se vería. */
  size: number;
  /** Brillo propio, multiplicando al general. */
  glow?: number;
}

export interface Opciones {
  cuerpos: Cuerpo[];
  /** Segundos de reloj por año del cuerpo de referencia. */
  segundosPorAno?: number;
  /** Cuánta estela guarda cada cuerpo, en años. */
  anosDeEstela?: number;
  /** Apretón radial: un cuerpo a r se dibuja a r^compresion. */
  compresion?: number;
  /** Tope de vueltas de estela, para que los rápidos no hagan un garabato. */
  vueltasMax?: number;
  /** Abre los planos de las órbitas en abanico, de 0 a 1. */
  aperturaPlanos?: number;
  /** Estira las órbitas, de 0 a 1. */
  excentricidad?: number;
  /** Endereza los planos sobre el del rumbo, de 0 a 1. */
  alinearAlRumbo?: number;
  /** Velocidad de la estrella por su campo, en unidades dibujadas por año. */
  deriva?: number;
  /** Rumbo: longitud y latitud eclípticas del ápex, en grados. */
  apex?: [number, number];
  /** Medio ancho de la vista, en unidades. */
  radioVista?: number;
  /** Cabeceo de la cámara. 0 mira a plomo sobre la eclíptica, 90 es de canto. */
  inclinacion?: number;
  /** Giro de la cámara. */
  giro?: number;
  /** Alabeo: decide hacia dónde corre la hélice por la pantalla. */
  alabeo?: number;
  /** Cuánto se adelanta la estrella del centro, en fracción del lado corto. */
  avance?: number;
  /** Dónde cae la estrella en el cuadro, en fracciones de ancho y alto. */
  foco?: [number, number];
  /** Fuerza del halo general, de 0 a 2. */
  brillo?: number;
  /** Dibuja la línea recta que deja la estrella al avanzar. */
  rastroDeLaEstrella?: boolean;
  /** Deja que el puntero mueva un poco la cámara. */
  interactivo?: boolean;
  colorEstrella?: string;
}

/** Dónde ha quedado cada cuerpo en pantalla, en px de CSS. */
export interface Punto {
  indice: number;
  x: number;
  y: number;
  /** Distancia a la cámara: sirve para ordenar por delante y por detrás. */
  fondo: number;
  /** Escala por perspectiva. */
  escala: number;
}

const TAU = Math.PI * 2;
const RAD = Math.PI / 180;

/**
 * Ecuación de Kepler, M = E − e·sen E, despejada para la anomalía excéntrica.
 * Newton; con excentricidades de sistema solar bastan tres pasadas.
 */
function anomaliaExcentrica(M: number, e: number): number {
  let m = M % TAU;
  if (m < 0) m += TAU;
  let E = m + e * Math.sin(m) * (1 + e * Math.cos(m));
  for (let k = 0; k < 8; k++) {
    const paso = (E - e * Math.sin(E) - m) / (1 - e * Math.cos(E));
    E -= paso;
    if (Math.abs(paso) < 1e-10) break;
  }
  return E;
}

function aRGB(color: string): [number, number, number] {
  const c = color.trim();
  if (c[0] === '#') {
    const hex = c.slice(1);
    const largo = hex.length === 3 ? hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]! : hex.slice(0, 6);
    const n = parseInt(largo, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = c.match(/(\d+(?:\.\d+)?)/g);
  if (m && m.length >= 3) return [+m[0]!, +m[1]!, +m[2]!];
  return [255, 255, 255];
}

/**
 * Cabeceo y giro que se le suman al plano de cada órbita con `aperturaPlanos`
 * a 1. Es una tabla fija y no números al azar, para que la roseta salga igual
 * en cada carga.
 */
const ABANICO: Array<[number, number]> = [
  [58, 35],
  [27, 145],
  [71, 250],
  [40, 80],
  [84, 190],
  [33, 310],
  [62, 120],
  [15, 20],
];

/** Excentricidad a la que se lleva cada órbita con `excentricidad` a 1. */
const ESTIRON = [0.52, 0.34, 0.63, 0.44, 0.3, 0.58, 0.4, 0.68];

export function montarOrbital(lienzo: HTMLCanvasElement, op: Opciones) {
  const ctx = lienzo.getContext('2d');
  const anfitrion = lienzo.parentElement;
  if (!ctx || !anfitrion) return null;

  const o = {
    segundosPorAno: 16,
    anosDeEstela: 2.6,
    compresion: 0.42,
    vueltasMax: 3,
    aperturaPlanos: 1,
    excentricidad: 0.25,
    alinearAlRumbo: 1,
    deriva: 1.5,
    apex: [272, 53] as [number, number],
    radioVista: 3.4,
    // Cabeceo y giro van juntos: con estos, el rastro de la estrella sale del
    // cuadro hacia abajo y corre hacia arriba a la derecha.
    inclinacion: 45,
    giro: 252,
    alabeo: 13.5,
    avance: 0.12,
    foco: [0.5, 0.5] as [number, number],
    brillo: 1,
    rastroDeLaEstrella: true,
    interactivo: true,
    colorEstrella: '#dff1ff',
    ...op,
  };

  const lento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ancho = 0;
  let alto = 0;
  /** Reloj de la simulación, en años. */
  let anos = lento ? 1.7 : 0;
  let anterior = 0;
  let visible = true;
  let vivo = true;
  let animacion = 0;

  /* --- cámara ----------------------------------------------------------- */
  // Ejes del mundo: x e y son la eclíptica, z apunta a su polo norte. La base
  // de pantalla sale de girar sobre z y luego cabecear sobre la nueva x.
  let pxPorUnidad = 1;
  let cx = 0;
  let cy = 0;
  let distanciaCamara = 1;
  const DER = { x: 1, y: 0, z: 0 };
  const ARR = { x: 0, y: 1, z: 0 };
  const ADE = { x: 0, y: 0, z: 1 };

  function ponerCamara(giroG: number, cabeceoG: number, alabeoG: number) {
    const A = giroG * RAD;
    const B = cabeceoG * RAD;
    const ca = Math.cos(A);
    const sa = Math.sin(A);
    const cb = Math.cos(B);
    const sb = Math.sin(B);
    const dx = ca;
    const dy = sa;
    const ax = -sa * cb;
    const ay = ca * cb;
    const az = sb;
    ADE.x = sa * sb;
    ADE.y = -ca * sb;
    ADE.z = cb;
    // El alabeo gira el cuadro sobre la línea de mirada: no cambia nada en el
    // espacio, sólo hacia dónde corre la hélice por la pantalla. Por eso se
    // elige aparte del ángulo de vista.
    const C = alabeoG * RAD;
    const cr = Math.cos(C);
    const sr = Math.sin(C);
    DER.x = dx * cr + ax * sr;
    DER.y = dy * cr + ay * sr;
    DER.z = ax * 0 + az * sr;
    ARR.x = -dx * sr + ax * cr;
    ARR.y = -dy * sr + ay * cr;
    ARR.z = az * cr;
  }

  // Salida de `proyectar`. Se reaprovecha para no reservar en el bucle caliente.
  const P = { x: 0, y: 0, fondo: 0, s: 0, ok: false };

  /** De desplazamiento respecto a la estrella, a pantalla. */
  function proyectar(dx: number, dy: number, dz: number) {
    const vx = dx * DER.x + dy * DER.y + dz * DER.z;
    const vy = dx * ARR.x + dy * ARR.y + dz * ARR.z;
    const vz = dx * ADE.x + dy * ADE.y + dz * ADE.z;
    const fondo = distanciaCamara - vz;
    if (fondo < 0.6) {
      P.ok = false;
      return;
    }
    const s = distanciaCamara / fondo;
    P.x = cx + vx * pxPorUnidad * s;
    P.y = cy - vy * pxPorUnidad * s;
    P.fondo = fondo;
    P.s = s;
    P.ok = true;
  }

  /* --- el rumbo de la estrella ------------------------------------------ */
  const RUMBO = { x: 0, y: 0, z: 0 };
  function ponerApex(lonG: number, latG: number) {
    const l = lonG * RAD;
    const b = latG * RAD;
    RUMBO.x = Math.cos(b) * Math.cos(l);
    RUMBO.y = Math.cos(b) * Math.sin(l);
    RUMBO.z = Math.sin(b);
  }

  /* --- elementos orbitales ---------------------------------------------- */
  interface Elementos {
    c: Cuerpo;
    rgb: [number, number, number];
    e: number;
    periodo: number;
    n: number;
    cw: number;
    sw: number;
    ci: number;
    si: number;
    cn: number;
    sn: number;
    M0: number;
    /** Giro que endereza el plano sobre el del rumbo. */
    enderezar: number[] | null;
  }

  /**
   * Construye el giro que lleva el plano de una órbita hacia el que está a
   * escuadra con el rumbo. Con `alinear` a 1 la normal acaba sobre el rumbo, y
   * entonces todas las estelas son hélices sobre el mismo eje.
   */
  function enderezarAlRumbo(nx: number, ny: number, nz: number, alinear: number): number[] | null {
    // Se apunta al extremo del rumbo hacia el que el plano ya se inclina, para
    // no dar la vuelta a una órbita del revés.
    const s = nx * RUMBO.x + ny * RUMBO.y + nz * RUMBO.z >= 0 ? 1 : -1;
    let tx = nx + alinear * (s * RUMBO.x - nx);
    let ty = ny + alinear * (s * RUMBO.y - ny);
    let tz = nz + alinear * (s * RUMBO.z - nz);
    const tl = Math.hypot(tx, ty, tz);
    if (tl < 1e-9) return null;
    tx /= tl;
    ty /= tl;
    tz /= tl;
    // Rodrigues: girar n sobre la normal mezclada, alrededor de su producto
    // vectorial.
    let ax = ny * tz - nz * ty;
    let ay = nz * tx - nx * tz;
    let az = nx * ty - ny * tx;
    const al = Math.hypot(ax, ay, az);
    if (al < 1e-9) return null;
    ax /= al;
    ay /= al;
    az /= al;
    const c = Math.max(-1, Math.min(1, nx * tx + ny * ty + nz * tz));
    const sA = al > 1 ? 1 : al;
    const k = 1 - c;
    return [
      c + ax * ax * k,
      ax * ay * k - az * sA,
      ax * az * k + ay * sA,
      ay * ax * k + az * sA,
      c + ay * ay * k,
      ay * az * k - ax * sA,
      az * ax * k - ay * sA,
      az * ay * k + ax * sA,
      c + az * az * k,
    ];
  }

  function elementosDe(c: Cuerpo, indice: number): Elementos {
    const aDibujo = Math.pow(c.a, o.compresion);
    // Tercera de Kepler sobre el espaciado ya apretado: P = a^1.5, n = 2π/P.
    // Así los de dentro siguen corriendo más que los de fuera.
    const periodo = Math.pow(aDibujo, 1.5);
    const abanico = ABANICO[indice % ABANICO.length]!;
    const inc = (c.i + o.aperturaPlanos * abanico[0]) * RAD;
    const nodo = (c.node + o.aperturaPlanos * abanico[1]) * RAD;
    const meta = ESTIRON[indice % ESTIRON.length]!;
    const ci = Math.cos(inc);
    const si = Math.sin(inc);
    const cn = Math.cos(nodo);
    const sn = Math.sin(nodo);
    return {
      c,
      rgb: aRGB(c.color),
      e: Math.min(0.85, c.e + o.excentricidad * (meta - c.e)),
      periodo,
      n: TAU / periodo,
      cw: Math.cos(c.peri * RAD),
      sw: Math.sin(c.peri * RAD),
      ci,
      si,
      cn,
      sn,
      M0: c.M0 * RAD,
      enderezar: o.alinearAlRumbo > 0 ? enderezarAlRumbo(si * sn, -si * cn, ci, o.alinearAlRumbo) : null,
    };
  }

  const R3 = { x: 0, y: 0, z: 0 };
  /** Posición respecto a la estrella en la anomalía media M. Escribe R3. */
  function posicion(el: Elementos, M: number) {
    const e = el.e;
    const E = anomaliaExcentrica(M, e);
    const xo = el.c.a * (Math.cos(E) - e);
    const yo = el.c.a * Math.sqrt(1 - e * e) * Math.sin(E);
    // girar por el argumento del periastro, dentro del plano de la órbita
    const x1 = xo * el.cw - yo * el.sw;
    const y1 = xo * el.sw + yo * el.cw;
    // inclinar el plano
    const y2 = y1 * el.ci;
    const z2 = y1 * el.si;
    // girar por el nodo ascendente
    let x = x1 * el.cn - y2 * el.sn;
    let y = x1 * el.sn + y2 * el.cn;
    let z = z2;
    const S = el.enderezar;
    if (S) {
      const rx = S[0]! * x + S[1]! * y + S[2]! * z;
      const ry = S[3]! * x + S[4]! * y + S[5]! * z;
      const rz = S[6]! * x + S[7]! * y + S[8]! * z;
      x = rx;
      y = ry;
      z = rz;
    }
    // Apretar por el radio. Los ángulos no se tocan, así que la inclinación de
    // cada plano y el hecho de que la estrella esté en el foco sobreviven.
    if (o.compresion !== 1) {
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > 1e-9) {
        const s = Math.pow(r, o.compresion - 1);
        x *= s;
        y *= s;
        z *= s;
      }
    }
    R3.x = x;
    R3.y = y;
    R3.z = z;
  }

  let elems: Elementos[] = [];

  /* --- el halo de cada cuerpo, dibujado una vez y reutilizado ------------ */
  const halos = new Map<string, HTMLCanvasElement>();
  function halo(color: string): HTMLCanvasElement {
    const hecho = halos.get(color);
    if (hecho) return hecho;
    const R = 64;
    const c = document.createElement('canvas');
    c.width = c.height = R * 2;
    const g = c.getContext('2d')!;
    const [r, v, b] = aRGB(color);
    const grad = g.createRadialGradient(R, R, 0, R, R, R);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.15, `rgba(${r},${v},${b},0.95)`);
    grad.addColorStop(0.36, `rgba(${r},${v},${b},0.26)`);
    grad.addColorStop(0.66, `rgba(${r},${v},${b},0.05)`);
    grad.addColorStop(1, `rgba(${r},${v},${b},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, R * 2, R * 2);
    halos.set(color, c);
    return c;
  }

  /* --- medidas ---------------------------------------------------------- */
  function medir() {
    const caja = anfitrion!.getBoundingClientRect();
    const w = Math.max(1, caja.width);
    const h = Math.max(1, caja.height);
    if (w === ancho && h === alto) return;
    ancho = w;
    alto = h;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    lienzo.width = Math.round(w * dpr);
    lienzo.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    encuadrar();
  }

  function encuadrar() {
    pxPorUnidad = (Math.min(ancho, alto) * 0.5) / o.radioVista;
    distanciaCamara = o.radioVista * 3.1;
    ponerApex(o.apex[0], o.apex[1]);
    ponerCamara(o.giro, o.inclinacion, o.alabeo);
  }

  /* --- puntero ---------------------------------------------------------- */
  let punteroX = 0;
  let punteroY = 0;
  let camX = 0;
  let camY = 0;
  const alMover = (ev: PointerEvent) => {
    if (!o.interactivo) return;
    const caja = anfitrion!.getBoundingClientRect();
    punteroX = ((ev.clientX - caja.left) / caja.width - 0.5) * 2;
    punteroY = ((ev.clientY - caja.top) / caja.height - 0.5) * 2;
  };
  const alSalir = () => {
    punteroX = 0;
    punteroY = 0;
  };

  /* --- la estrella ------------------------------------------------------ */
  function pintarEstrella(k: number, t: number) {
    const [r, v, b] = aRGB(o.colorEstrella);
    const latido = 1 + Math.sin(t * 2.1) * 0.02;
    // A esta distancia de una estrella no se ve su disco, se ve su brillo. Eso
    // es lo que se dibuja: un núcleo blanco y tres capas de halo cada vez más
    // abiertas y más flojas.
    const R = Math.max(5, Math.min(ancho, alto) * 0.013) * latido;

    const bruma = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 14);
    bruma.addColorStop(0, `rgba(${r},${v},${b},${0.05 * k})`);
    bruma.addColorStop(0.4, `rgba(140,200,255,${0.014 * k})`);
    bruma.addColorStop(1, 'rgba(110,170,255,0)');
    ctx!.fillStyle = bruma;
    ctx!.beginPath();
    ctx!.arc(cx, cy, R * 14, 0, TAU);
    ctx!.fill();

    const fuera = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 4.6);
    fuera.addColorStop(0, `rgba(${r},${v},${b},${0.34 * k})`);
    fuera.addColorStop(0.3, `rgba(170,220,255,${0.1 * k})`);
    fuera.addColorStop(0.62, `rgba(120,190,255,${0.025 * k})`);
    fuera.addColorStop(1, 'rgba(100,170,255,0)');
    ctx!.fillStyle = fuera;
    ctx!.beginPath();
    ctx!.arc(cx, cy, R * 4.6, 0, TAU);
    ctx!.fill();

    const nucleo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 2.3);
    nucleo.addColorStop(0, `rgba(255,255,255,${k})`);
    nucleo.addColorStop(0.42, `rgba(240,250,255,${0.7 * k})`);
    nucleo.addColorStop(0.72, `rgba(${r},${v},${b},${0.22 * k})`);
    nucleo.addColorStop(1, 'rgba(130,190,255,0)');
    ctx!.fillStyle = nucleo;
    ctx!.beginPath();
    ctx!.arc(cx, cy, R * 2.3, 0, TAU);
    ctx!.fill();

    ctx!.fillStyle = 'rgba(255,255,255,1)';
    ctx!.beginPath();
    ctx!.arc(cx, cy, R, 0, TAU);
    ctx!.fill();
  }

  /* --- un fotograma ----------------------------------------------------- */
  let avisar: ((puntos: Punto[]) => void) | null = null;

  function pintar(t: number) {
    const k = o.brillo;
    encuadrar();

    // la cámara va detrás del puntero, con retraso
    camX += (punteroX - camX) * 0.04;
    camY += (punteroY - camY) * 0.04;
    ponerCamara(o.giro + camX * 7, o.inclinacion + camY * 5, o.alabeo);

    const recorrido = o.deriva * t;

    cx = ancho * o.foco[0];
    cy = alto * o.foco[1];
    // La estrella, un poco por delante del centro: así las espirales tienen
    // sitio por detrás.
    proyectar(RUMBO.x, RUMBO.y, RUMBO.z);
    if (P.ok) {
      const dx = P.x - cx;
      const dy = P.y - cy;
      const largo = Math.hypot(dx, dy) || 1;
      const empuje = Math.min(ancho, alto) * o.avance;
      cx += (dx / largo) * empuje;
      cy += (dy / largo) * empuje;
    }

    ctx!.clearRect(0, 0, ancho, alto);
    // Suma, no tapa: dos estelas que se cruzan se iluminan la una a la otra.
    ctx!.globalCompositeOperation = 'lighter';

    /* el rastro recto de la estrella */
    if (o.rastroDeLaEstrella) {
      const atras = o.deriva * o.anosDeEstela * 1.1;
      proyectar(0, 0, 0);
      const hx = P.x;
      const hy = P.y;
      proyectar(-RUMBO.x * atras, -RUMBO.y * atras, -RUMBO.z * atras);
      if (P.ok) {
        const grad = ctx!.createLinearGradient(hx, hy, P.x, P.y);
        grad.addColorStop(0, `rgba(226,244,255,${k})`);
        grad.addColorStop(0.45, `rgba(110,190,255,${0.55 * k})`);
        grad.addColorStop(1, 'rgba(80,150,255,0)');
        ctx!.strokeStyle = grad;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(hx, hy);
        ctx!.lineTo(P.x, P.y);
        // Tres pasadas, de ancha y floja a fina y fuerte: así la línea brilla
        // en vez de ser un trazo plano.
        ctx!.lineWidth = 11;
        ctx!.globalAlpha = 0.16;
        ctx!.stroke();
        ctx!.lineWidth = 4;
        ctx!.globalAlpha = 0.3;
        ctx!.stroke();
        ctx!.globalAlpha = 1;
        ctx!.lineWidth = 1.8;
        ctx!.stroke();
      }
    }

    /* los cuerpos y sus hélices */
    const tiros: Array<{ el: Elementos; indice: number; x: number; y: number; fondo: number; s: number }> = [];

    elems.forEach((el, indice) => {
      const [r, v, b] = el.rgb;
      const fuerza = (el.c.glow ?? 1) * k;
      // La estela es una ventana al pasado, la misma para todos — salvo que al
      // más rápido se le recorta a unas pocas vueltas, o sería un garabato.
      const tramo = Math.min(o.anosDeEstela, o.vueltasMax * el.periodo);
      const vueltas = tramo / el.periodo;
      // Muestras suficientes para que las vueltas apretadas salgan suaves. Una
      // órbita estirada pide más: se muestrea a pasos iguales de tiempo, y
      // cerca del periastro se recorre mucho más en cada paso.
      const N = Math.max(48, Math.min(360, Math.ceil(vueltas * 46 * (1 + 2.2 * el.e)) + 48));

      const xs = new Float64Array(N + 1);
      const ys = new Float64Array(N + 1);
      const vale = new Uint8Array(N + 1);
      for (let q = 0; q <= N; q++) {
        const edad = (1 - q / N) * tramo; // años hacia atrás
        const M = el.M0 + el.n * (t - edad);
        posicion(el, M);
        // Dónde estuvo de verdad: su sitio alrededor de la estrella en aquel
        // momento, menos lo que la estrella ha avanzado desde entonces.
        // Elipse más avance recto es una hélice, y eso es el camino real.
        const atras = o.deriva * edad;
        proyectar(R3.x - RUMBO.x * atras, R3.y - RUMBO.y * atras, R3.z - RUMBO.z * atras);
        xs[q] = P.x;
        ys[q] = P.y;
        vale[q] = P.ok ? 1 : 0;
        if (q === N && P.ok) tiros.push({ el, indice, x: P.x, y: P.y, fondo: P.fondo, s: P.s });
      }

      const trazo = (desde: number, hasta: number, alfa: number, grueso: number) => {
        ctx!.strokeStyle = `rgba(${r},${v},${b},${alfa.toFixed(3)})`;
        ctx!.lineWidth = grueso;
        ctx!.beginPath();
        let puesto = false;
        for (let q = desde; q <= hasta; q++) {
          if (!vale[q]) {
            puesto = false;
            continue;
          }
          if (!puesto) {
            ctx!.moveTo(xs[q]!, ys[q]!);
            puesto = true;
          } else ctx!.lineTo(xs[q]!, ys[q]!);
        }
        ctx!.stroke();
      };

      // Primero el halo, en dos pasadas seguidas cerca de la cabeza.
      ctx!.lineCap = 'round';
      ctx!.lineJoin = 'round';
      trazo(Math.floor(N * 0.72), N, 0.05 * fuerza, 6.5);
      trazo(Math.floor(N * 0.86), N, 0.05 * fuerza, 3);

      // Y luego la línea, segmento a segmento con su propio alfa. Eso da
      // tantos escalones de desvanecido como muestras hay — cientos — en vez
      // de los cuatro que salen de repasar el camino entero unas pocas veces,
      // donde los escalones caen desiguales y se leen como cortes. Los
      // extremos a escuadra son lo que lo mantiene sin costuras: dos puntas
      // redondas en la misma junta se solaparían y encenderían una cuenta.
      ctx!.lineCap = 'butt';
      ctx!.lineWidth = 1.3;
      for (let q = 0; q < N; q++) {
        if (!vale[q] || !vale[q + 1]) continue;
        const f = (q + 1) / N; // 0 en la cola, 1 en el cuerpo
        const a = Math.pow(f, 2.6) * 0.95 * fuerza;
        if (a < 0.005) continue; // aquí la cola ya es invisible
        ctx!.strokeStyle = `rgba(${r},${v},${b},${a.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(xs[q]!, ys[q]!);
        ctx!.lineTo(xs[q + 1]!, ys[q + 1]!);
        ctx!.stroke();
      }
    });

    /* los cuerpos, de atrás hacia delante alrededor de la estrella */
    tiros.sort((p, q) => q.fondo - p.fondo);
    const escalaTam = Math.min(ancho, alto) / 660;
    const pintarCuerpo = (o2: (typeof tiros)[number]) => {
      const prof = Math.min(1.3, Math.max(0.5, o2.s));
      const tam = o2.el.c.size * prof * escalaTam;
      const fuerza = (o2.el.c.glow ?? 1) * k;
      const R = tam * 3.3;
      ctx!.globalAlpha = Math.min(1, 0.9 * fuerza);
      ctx!.drawImage(halo(o2.el.c.color), o2.x - R, o2.y - R, R * 2, R * 2);
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = 'rgba(255,255,255,0.95)';
      ctx!.beginPath();
      ctx!.arc(o2.x, o2.y, tam * 0.5, 0, TAU);
      ctx!.fill();
    };

    let i = 0;
    while (i < tiros.length && tiros[i]!.fondo > distanciaCamara) pintarCuerpo(tiros[i++]!);
    pintarEstrella(k, t);
    while (i < tiros.length) pintarCuerpo(tiros[i++]!);

    ctx!.globalCompositeOperation = 'source-over';

    avisar?.(
      tiros.map((s) => ({ indice: s.indice, x: s.x, y: s.y, fondo: s.fondo, escala: Math.min(1.3, Math.max(0.5, s.s)) })),
    );
  }

  /* --- bucle ------------------------------------------------------------ */
  function paso(ahora: number) {
    if (!vivo) return;
    animacion = requestAnimationFrame(paso);
    if (!visible) {
      anterior = ahora;
      return;
    }
    const dt = anterior ? Math.min(0.05, (ahora - anterior) / 1000) : 0;
    anterior = ahora;
    if (!lento) anos += dt / Math.max(0.1, o.segundosPorAno);
    pintar(anos);
  }

  elems = o.cuerpos.map(elementosDe);
  medir();
  pintar(anos);
  if (!lento) animacion = requestAnimationFrame(paso);

  const ro = new ResizeObserver(() => {
    medir();
    if (lento) pintar(anos);
  });
  ro.observe(anfitrion);

  // Fuera de pantalla no se pinta: son siete hélices de trescientas muestras
  // cada una, y no tiene sentido calcularlas para nadie.
  const io = new IntersectionObserver((e) => (visible = e[0]?.isIntersecting ?? true), { threshold: 0 });
  io.observe(anfitrion);

  const alCambiarVisibilidad = () => {
    visible = !document.hidden;
    anterior = 0;
  };
  document.addEventListener('visibilitychange', alCambiarVisibilidad);
  anfitrion.addEventListener('pointermove', alMover);
  anfitrion.addEventListener('pointerleave', alSalir);

  return {
    /** Se llama con la posición en pantalla de cada cuerpo, cada fotograma. */
    alPintar(cb: (puntos: Punto[]) => void) {
      avisar = cb;
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(animacion);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      anfitrion.removeEventListener('pointermove', alMover);
      anfitrion.removeEventListener('pointerleave', alSalir);
    },
  };
}
