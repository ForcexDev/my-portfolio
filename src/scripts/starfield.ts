const VERTEX =
  "attribute vec2 point;void main(){gl_Position=vec4(point,0.,1.);}";

const FRAGMENT = `precision highp float;
uniform vec2 resolution;
uniform float dpr;
uniform float time;
uniform float scroll;
uniform int environment;

float hash(vec2 cell) {
  return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
}

float stars(vec2 point, float density, float layer) {
  vec2 cell = floor(point * density);
  vec2 offset = vec2(hash(cell + layer), hash(cell - layer));
  vec2 delta = fract(point * density) - 0.1 - 0.8 * offset;
  return step(0.86, offset.x) * exp(-dot(delta, delta) * 260.0) *
    (0.27 + 0.72 * offset.y) * (0.86 + 0.14 * sin(time * 0.55 + offset.y * 22.0));
}

void main() {
  vec2 cssPos = gl_FragCoord.xy / dpr;
  vec2 p = cssPos / 620.0;
  vec2 skyPoint = p + vec2(time * 0.0024, -scroll / 620.0 * 0.16);
  float field = stars(skyPoint, 63.0, 4.0) + 0.45 * stars(skyPoint, 118.0, 8.0);
  vec3 color = vec3(0.008, 0.016, 0.044) + vec3(0.59, 0.76, 0.97) * field;
  if (environment == 1) {
    vec2 embers = (cssPos + vec2(-time * 5.0, -time * 19.0)) / 45.0;
    vec2 fleck = fract(embers) - vec2(.5);
    float spark = step(.88, hash(floor(embers))) * exp(-dot(fleck * vec2(1.8, .65), fleck) * 145.);
    color = vec3(.045,.015,.019) + vec3(.99,.41,.15) * (field + spark * .68);
  } else if (environment == 2) {
    vec2 rings = cssPos / 164. + vec2(-time * .026, scroll / 2600.);
    float radius = length((fract(rings) - vec2(.5)) * vec2(1.5,1.));
    float ring = (1. - smoothstep(.006,.017,abs(radius-.041))) * step(.88,hash(floor(rings)));
    color = vec3(.006,.035,.094) + vec3(.21,.83,.98) * field + vec3(.95,.71,.22) * ring * .56;
  } else if (environment == 3) {
    vec2 pixels = floor(cssPos / 3.) * 3. / 620.;
    float phosphor = stars(pixels + vec2(0.,floor(time*2.)*.002-scroll*.0002),45.,4.);
    color = vec3(.007,.045,.022) + vec3(.47,.98,.38) * phosphor;
  }
  gl_FragColor = vec4(color, 1.0);
}`;

export function initStarfield() {
  const canvas = document.getElementById("starfield") as HTMLCanvasElement | null;
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const point = gl.getAttribLocation(program, "point");
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "resolution");
  const uDpr = gl.getUniformLocation(program, "dpr");
  const uTime = gl.getUniformLocation(program, "time");
  const uScroll = gl.getUniformLocation(program, "scroll");

  const uEnvironment = gl.getUniformLocation(program, "environment");
  function syncTheme() {
    const environments = ["", "doom", "sonic", "invaders"];
    gl!.uniform1i(uEnvironment, Math.max(0, environments.indexOf(document.documentElement.dataset.arcade || "")));
    wake();
  }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let dpr = 1;
  let phase = 0;
  let last = 0;
  let frame = 0;

  function render() {
    gl!.viewport(0, 0, canvas!.width, canvas!.height);
    gl!.uniform2f(uRes, canvas!.width, canvas!.height);
    gl!.uniform1f(uDpr, dpr);
    gl!.uniform1f(uTime, phase);
    gl!.uniform1f(uScroll, window.scrollY);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    canvas!.style.opacity = "1";
  }

  function tick(now: number) {
    frame = 0;
    if (document.hidden) return;
    if (last && now - last < 33 && !reduced.matches) {
      frame = requestAnimationFrame(tick);
      return;
    }
    if (last && !reduced.matches) phase += Math.min(now - last, 100) / 1000;
    last = now;
    render();
    if (!reduced.matches) frame = requestAnimationFrame(tick);
  }

  function wake() {
    cancelAnimationFrame(frame);
    last = 0;
    if (reduced.matches) {
      render();
      return;
    }
    if (!document.hidden) frame = requestAnimationFrame(tick);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    canvas!.width = Math.max(1, Math.round(window.innerWidth * dpr));
    canvas!.height = Math.max(1, Math.round(window.innerHeight * dpr));
    wake();
  }

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    },
    { passive: true },
  );
  window.addEventListener(
    "scroll",
    () => {
      if (reduced.matches) render();
    },
    { passive: true },
  );
  canvas.addEventListener("webglcontextlost", () => {
    canvas.style.opacity = "0";
    cancelAnimationFrame(frame);
  });
  document.addEventListener("visibilitychange", wake);
  new MutationObserver(syncTheme).observe(document.documentElement, {attributes:true,attributeFilter:["data-arcade"]});
  syncTheme();
  reduced.addEventListener("change", wake);

  resize();
}
