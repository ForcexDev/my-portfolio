/**
 * Native Astro/TypeScript port of Nimbus UI · Liquid Navbar ("Waterline")
 * Adapted for ForcexDev Orbital Blue palette (zero purple, zero React dependency).
 *
 * Features:
 * - WebGL water-droplet shader with spring head/tail physics, droplet splitting on long jumps,
 *   cursor meniscus lift, tap ripple waves, caustics & pure orbital-blue Fresnel sheen
 * - Automatic CSS droplet fallback when WebGL is unavailable
 * - Pauses off-screen and respects prefers-reduced-motion
 */

const PAD = 14;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

/* Pure orbital-blue & ice-crystal water shader (zero violet/magenta rainbow tint) */
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;uniform float uShowPill;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4*uShowPill+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 float shimmer=.5+.5*cos(6.2831*(fres*.75+p.x*.0028+uTime*.035));
 vec3 irid=mix(vec3(.32,.74,1.),vec3(.84,.96,1.),shimmer);
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.11+.07*uDark);
 vec3 c=vec3(0.,.14,.36)*sh;float a=sh;
 float pa=uShowPill*clamp(pm*(fres*.46+spec*.88+spec2),0.,1.);
 c=mix(vec3(.88,.96,1.),irid,.55*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.78,.94,1.),vec3(.36,.76,1.),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.28+.15*body)*(1.-.28*uDark);vec3 dc=mix(tint,vec3(.92,.98,1.),body*.55);
 float la=rim*.26;vec3 lc=mix(vec3(0.,.46,.86),vec3(.12,.58,1.),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.68+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(.92,.98,1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.42;dc=mix(vec3(.92,.98,1.),irid,.4)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;

type Body = { x: number; v: number };
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number };
type Rip = { x: number; y: number; age: number; amp: number };
type GLContext = {
  gl: WebGLRenderingContext;
  u: Record<string, WebGLUniformLocation | null>;
};

export interface LiquidPillController {
  setActive: (index: number, opts?: { triggerFx?: boolean; silent?: boolean }) => void;
  getActive: () => number;
  remeasure: () => void;
  setVisible: (visible: boolean) => void;
}

export interface LiquidPillOptions {
  initialActive?: number;
  onChange?: (index: number, item: HTMLElement) => void;
  activeAttr?: "aria-current" | "aria-selected";
  activeValue?: string;
}

function initGL(canvas: HTMLCanvasElement): GLContext | null {
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: true,
    alpha: true,
    antialias: false,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const name of [
    "uRes",
    "uDpr",
    "uTime",
    "uPill",
    "uBlob",
    "uSy",
    "uRip",
    "uMouse",
    "uDark",
    "uAmb",
    "uShowPill",
  ]) {
    u[name] = gl.getUniformLocation(program, name);
  }
  return { gl, u };
}

export function mountLiquidPill(
  nav: HTMLElement,
  options: LiquidPillOptions = {},
): LiquidPillController {
  const items = Array.from(nav.querySelectorAll<HTMLElement>(".nimbus-item"));
  const canvas = nav.querySelector<HTMLCanvasElement>(".nimbus-water");
  const dropEl = nav.querySelector<HTMLElement>(".nimbus-drop");
  const activeAttr = options.activeAttr ?? "aria-current";
  const activeValue = options.activeValue ?? "page";
  const showPillRim = nav.dataset.embedded === "true" ? 0 : 1;

  let current = Math.max(
    0,
    Math.min(options.initialActive ?? 0, Math.max(0, items.length - 1)),
  );
  const dark = nav.dataset.tone === "light" ? 0 : 1;

  const s = {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { x: 0, cy: 0, q: 0, r: 21 },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    inView: true,
    externVisible: true,
    reduce: !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as GLContext | null,
  };

  const blobsBuf = new Float32Array(24);
  const syBuf = new Float32Array(6);
  const ripsBuf = new Float32Array(24);

  if (canvas) {
    s.glc = initGL(canvas);
    nav.dataset.gl = s.glc ? "on" : "off";
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      s.glc = null;
      nav.dataset.gl = "off";
    });
  } else {
    nav.dataset.gl = "off";
  }

  function isActiveRendering() {
    return s.inView && s.externVisible && document.visibilityState === "visible";
  }

  function syncAttributes() {
    items.forEach((el, i) => {
      if (i === current) {
        el.setAttribute(activeAttr, activeValue);
      } else if (activeAttr === "aria-selected") {
        el.setAttribute("aria-selected", "false");
      } else {
        el.removeAttribute(activeAttr);
      }
    });
  }

  function draw() {
    const T = s.t;
    const sep = Math.abs(s.a.x - s.b.x);
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1);
    const r = T.r * (1 - 0.3 * thin);

    if (s.glc && s.w > 0 && s.h > 0) {
      const { gl: g, u } = s.glc;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, s.time);
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h);

      blobsBuf.fill(0);
      syBuf.fill(1);
      const head = s.lead === 0 ? s.a : s.b;
      const tail = s.lead === 0 ? s.b : s.a;
      blobsBuf.set(
        [
          head.x,
          T.cy,
          s.q * (1 - 0.25 * thin),
          T.r * (1 - 0.12 * thin),
          tail.x,
          T.cy,
          s.q * (1 - 0.8 * thin),
          T.r * (1 - 0.5 * thin),
        ],
        0,
      );
      syBuf[0] = syBuf[1] = s.sy.s;
      const satCount = Math.min(4, s.sats.length);
      for (let i = 0; i < satCount; i++) {
        const d = s.sats[i];
        blobsBuf.set([d.x, d.y, 0, d.r], 8 + i * 4);
      }
      g.uniform4fv(u.uBlob, blobsBuf);
      g.uniform1fv(u.uSy, syBuf);

      ripsBuf.fill(0);
      const recent = s.rips.slice(-6);
      for (let i = 0; i < recent.length; i++) {
        const rp = recent[i];
        ripsBuf.set([rp.x, rp.y, rp.age, rp.amp], i * 4);
      }
      g.uniform4fv(u.uRip, ripsBuf);
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s);
      g.uniform1f(u.uDark, dark);
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1);
      g.uniform1f(u.uShowPill, showPillRim);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    } else if (dropEl && s.w > 0) {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD;
      const width = sep + 2 * (s.q + r);
      dropEl.style.width = `${width}px`;
      dropEl.style.transform = `translateX(${left}px) scaleY(${s.sy.s})`;
    }
  }

  function step(dt: number, now: number) {
    const T = s.t;
    s.time += dt;
    s.q += (T.q - s.q) * Math.min(1, dt * 12);
    const bodies = [s.a, s.b];
    let still = true;

    if (s.reduce) {
      s.a.x = s.b.x = T.x;
      s.a.v = s.b.v = 0;
      s.sy.s = 1;
      s.sats = [];
    } else {
      bodies.forEach((B, i) => {
        const lead = i === s.lead;
        const k = lead ? 210 : 72;
        const c = lead ? 25 : 13;
        const f = !lead && now < s.lagFrom ? 0.08 : 1;
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f;
        B.x += B.v * dt;
        const lo = PAD + 6 + s.q + T.r - 3;
        const hi = PAD + s.w - 6 - s.q - T.r + 3;
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016;
          B.x = Math.max(lo, Math.min(hi, B.x));
          B.v *= -0.25;
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false;
      });

      const L = bodies[s.lead];
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1);
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt;
      s.sy.s += s.sy.v * dt;
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false;

      // Break the neck into trailing droplets on long jumps
      const sep = Math.abs(s.a.x - s.b.x);
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (T.q + T.r) || 1), 1));
      if (!s.split && s.moving && sep - 2 * T.q - 2 * r > -6) {
        s.split = true;
        const lo = bodies[1 - s.lead];
        const hi = bodies[s.lead];
        [0.3, 0.5, 0.72].forEach((t, j) => {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90,
          });
        });
      }

      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt;
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x));
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y));
        if (Math.abs(T.x - d.x) < T.q + T.r * 0.5) d.r -= dt * 26;
        return d.r > 0.6;
      });
      if (s.sats.length) still = false;
    }

    if (s.moving && still) {
      s.moving = false;
      if (s.split || !s.reduce) {
        s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : 0.7 });
      }
    }

    s.rips.forEach((p) => (p.age += dt));
    s.rips = s.rips.filter((p) => p.age < 2.4);
    const target = s.mouse.on ? 1 : 0;
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7);
  }

  function loop() {
    if (s.raf || !isActiveRendering()) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      step(dt, now);
      draw();
      const busy =
        s.moving || s.rips.length > 0 || s.sats.length > 0 || s.mouse.s > 0.01;
      if (isActiveRendering() && (!s.reduce || busy)) {
        s.raf = requestAnimationFrame(tick);
      } else {
        s.raf = 0;
      }
    };
    s.raf = requestAnimationFrame(tick);
  }

  function measure(forceSnap = false) {
    const el = items[current];
    if (!el || nav.offsetWidth === 0 || nav.offsetHeight === 0) return;
    s.w = nav.offsetWidth;
    s.h = nav.offsetHeight;
    const T = s.t;
    T.r = el.offsetHeight / 2;
    T.q = Math.max(0, el.offsetWidth / 2 - T.r);
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2;
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2;

    if (!s.ready || forceSnap) {
      s.a.x = s.b.x = nx;
      s.a.v = s.b.v = 0;
      s.q = T.q;
      s.ready = true;
    } else if (Math.abs(nx - T.x) > 0.5) {
      s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1;
      s.lagFrom = performance.now() + 70;
      s.moving = true;
      s.split = false;
    }
    T.x = nx;

    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = s.w + PAD * 2;
      const Hh = s.h + PAD * 2;
      const pw = Math.round(W * dpr);
      const ph = Math.round(Hh * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        canvas.style.width = `${W}px`;
        canvas.style.height = `${Hh}px`;
      }
    }

    draw();
    loop();
  }

  function localPoint(clientX: number, clientY: number) {
    const r = nav.getBoundingClientRect();
    return { x: clientX - r.left + PAD, y: clientY - r.top + PAD };
  }

  function ripple(x: number, y: number, amp: number) {
    if (s.reduce) return;
    s.rips.push({ x, y, age: 0, amp });
    loop();
  }

  function triggerIconFx(index: number) {
    const item = items[index];
    const ico = item?.querySelector<HTMLElement>(".nv-ico");
    const kind = item?.dataset.fx || (ico ? "pop" : "none");
    if (!ico || kind === "none") return;

    ico.removeAttribute("data-fx");
    void ico.offsetWidth; // restart CSS keyframe cleanly
    ico.setAttribute("data-fx", kind);

    const b = ico.getBoundingClientRect();
    const c = localPoint(b.left + b.width / 2, b.top + b.height / 2);
    if (kind === "drop") {
      window.setTimeout(() => ripple(c.x, s.t.cy, 1.35), 420);
    } else if (kind === "plane") {
      ripple(c.x, c.y, 0.65);
    }
  }

  function setActive(
    index: number,
    opts: { triggerFx?: boolean; silent?: boolean } = {},
  ) {
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    const changed = clamped !== current;
    current = clamped;
    syncAttributes();
    if (opts.triggerFx) triggerIconFx(clamped);
    measure(false);
    if (changed && !opts.silent) {
      options.onChange?.(clamped, items[clamped]);
    }
  }

  items.forEach((el, i) => {
    el.addEventListener("click", () => {
      setActive(i, { triggerFx: true, silent: false });
    });
  });

  nav.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (current + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    setActive(next, { triggerFx: true, silent: false });
    items[next]?.focus();
  });

  nav.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const p = localPoint(e.clientX, e.clientY);
    s.mouse.x = p.x;
    s.mouse.y = p.y;
    s.mouse.on = true;
    loop();
  });

  nav.addEventListener("pointerleave", () => {
    s.mouse.on = false;
    loop();
  });

  nav.addEventListener("pointerdown", (e) => {
    const p = localPoint(e.clientX, e.clientY);
    ripple(p.x, p.y, 0.8);
  });

  const io = new IntersectionObserver(([entry]) => {
    s.inView = entry.isIntersecting;
    if (isActiveRendering()) loop();
  });
  io.observe(nav);

  let lastW = -1;
  const ro = new ResizeObserver(() => {
    const w = nav.offsetWidth;
    if (w > 0 && w !== lastW) {
      lastW = w;
      measure(true);
    }
  });
  ro.observe(nav);

  document.addEventListener("visibilitychange", () => {
    if (isActiveRendering()) loop();
  });

  syncAttributes();
  measure(true);

  return {
    setActive,
    getActive: () => current,
    remeasure: () => measure(true),
    setVisible: (visible: boolean) => {
      s.externVisible = visible;
      if (visible) {
        if (!s.ready || s.w === 0) measure(true);
        loop();
      } else if (s.raf) {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      }
    },
  };
}

/**
 * Coordinates the single unified Header (.mast) morphing inward from the sides
 * into the floating Liquid Pill AFTER the top Radio bar has completely exited,
 * plus live scroll-spy section tracking across Projects -> Arcade and Contact.
 */
export function initGlobalLiquidNav() {
  const mast = document.getElementById("mast");
  const pillNav = document.getElementById("liquid-nav");
  const menuBtn = document.getElementById("menu");
  if (!mast || !pillNav) return;

  const isArticle = mast.dataset.article === "true";
  let userClickLockUntil = 0;

  const controller = mountLiquidPill(pillNav, {
    initialActive: 0,
    onChange: () => {
      userClickLockUntil = performance.now() + 850;
    },
  });

  const items = Array.from(pillNav.querySelectorAll<HTMLElement>(".nimbus-item"));
  const sections = items
    .map((el, index) => {
      const id = el.dataset.section || "";
      const target = id ? document.getElementById(id) : null;
      return { id, index, target };
    })
    .filter((entry): entry is { id: string; index: number; target: HTMLElement } =>
      Boolean(entry.target),
    );

  const projectsTarget =
    document.getElementById("work-heading") ||
    document.getElementById("projects");
  const radioSlot = document.getElementById("radio-slot");

  let pillShown = false;

  function updateMorph() {
    let showPill = false;

    if (isArticle || !projectsTarget) {
      showPill = window.scrollY > 140;
    } else {
      const mastH = mast!.getBoundingClientRect().height || 68;
      const projTop = projectsTarget.getBoundingClientRect().top;
      if (radioSlot) {
        const slotTop = radioSlot.getBoundingClientRect().top;
        const radioEndFade = mastH + (projTop - slotTop) - 60;
        // Trigger 18px AFTER top Radio bar reaches 0% opacity (zero simultaneous overlap)
        showPill = projTop < radioEndFade - 18;
      } else {
        showPill = projTop < 140;
      }
    }

    if (showPill !== pillShown) {
      pillShown = showPill;
      mast!.classList.toggle("morphed", showPill);
      if (showPill) {
        pillNav!.classList.remove("open");
        menuBtn?.setAttribute("aria-expanded", "false");
      }
      controller.setVisible(showPill);
      if (showPill) {
        requestAnimationFrame(() => controller.remeasure());
      }
    }

    // Live scroll-spy updates the active water droplet smoothly across Projects -> Contact
    if (!isArticle && sections.length > 0 && performance.now() >= userClickLockUntil) {
      const probeY = Math.min(window.innerHeight * 0.34, 280);
      let activeIdx = 0;

      for (const sec of sections) {
        const rect = sec.target.getBoundingClientRect();
        if (rect.top <= probeY) {
          activeIdx = sec.index;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 130
      ) {
        activeIdx = sections[sections.length - 1].index;
      }

      if (activeIdx !== controller.getActive()) {
        controller.setActive(activeIdx, { triggerFx: false, silent: true });
      }
    }
  }

  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      updateMorph();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  controller.setVisible(false);
  updateMorph();
}
