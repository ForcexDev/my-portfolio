import earthlight from "./earth.frag?raw";
const vertex =
  "attribute vec2 point;void main(){gl_Position=vec4(point,0.,1.);}";
const textures = new Map<string, Promise<HTMLImageElement>>();

function image(url: string) {
  if (!textures.has(url))
    textures.set(
      url,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      }),
    );
  return textures.get(url)!;
}

export function observeEarth(host: HTMLElement) {
  const modeValue = Number(host.dataset.mode || "0");
  const canvas = host.querySelector("canvas")!;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false,
    frame = 0,
    phase = 0,
    last = 0;
  let render: ((t: number) => void) | undefined;
  let initializing = false;
  const target = [0, 0],
    camera = [0, 0];

  function draw(now: number) {
    frame = 0;
    if (!visible || document.hidden || !render) return;
    if (last && now - last < 33 && !still.matches) {
      frame = requestAnimationFrame(draw);
      return;
    }
    if (last && !still.matches) phase += Math.min(now - last, 100) / 1000;
    last = now;
    camera.forEach(
      (v, i) => (camera[i] = still.matches ? 0 : v + (target[i] - v) * 0.1),
    );
    render(phase);
    if (!still.matches) frame = requestAnimationFrame(draw);
  }

  function wake() {
    cancelAnimationFrame(frame);
    last = 0;
    frame = requestAnimationFrame(draw);
  }

  async function init() {
    if (initializing) return;
    initializing = true;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;
    function compile(kind: number, source: string) {
      const shader = gl!.createShader(kind)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, earthlight));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const mapSpecs: Array<[string, string]> = [
      ["earth/day", "dayMap"],
      ["earth/night", "nightMap"],
      ["earth/clouds", "cloudsMap"],
      ["earth/specular", "specMap"],
    ];
    const maps = await Promise.all(
      mapSpecs.map(([name]) => image(host.dataset.assets + name + ".webp")),
    );

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

    const aniso =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    const maxAniso = aniso
      ? Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
      : 0;

    maps.forEach((map, i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, map);
      const pow2 =
        (map.width & (map.width - 1)) === 0 &&
        (map.height & (map.height - 1)) === 0;
      if (pow2) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        if (aniso && maxAniso) {
          gl.texParameterf(
            gl.TEXTURE_2D,
            aniso.TEXTURE_MAX_ANISOTROPY_EXT,
            maxAniso,
          );
        }
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      gl.uniform1i(gl.getUniformLocation(program, mapSpecs[i][1]), i);
    });

    const res = gl.getUniformLocation(program, "resolution"),
      pointer = gl.getUniformLocation(program, "pointer"),
      time = gl.getUniformLocation(program, "time"),
      mode = gl.getUniformLocation(program, "mode");

    let announced = false;
    render = (t) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(res, canvas.width, canvas.height);
      gl.uniform2f(pointer, camera[0], camera[1]);
      gl.uniform1f(time, t);
      gl.uniform1f(mode, modeValue);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = "1";
      if (!announced) {
        announced = true;
        window.dispatchEvent(new CustomEvent("orbital:earth-ready"));
      }
    };

    const resize = () => {
      const box = host.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, 2, 2560 / Math.max(1, box.width));
      canvas.width = Math.max(1, Math.round(box.width * scale));
      canvas.height = Math.max(1, Math.round(box.height * scale));
      wake();
    };
    new ResizeObserver(resize).observe(host);
    resize();
    host.parentElement?.addEventListener("pointermove", (e) => {
      if (still.matches) return;
      const r = host.getBoundingClientRect();
      target[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
      target[1] = 1 - ((e.clientY - r.top) / r.height) * 2;
    });
    canvas.addEventListener("webglcontextlost", () => {
      render = undefined;
      canvas.style.opacity = "0";
      cancelAnimationFrame(frame);
    });
    still.addEventListener("change", wake);
    document.addEventListener("visibilitychange", wake);
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      void init().catch(() => {});
      wake();
    } else cancelAnimationFrame(frame);
  }).observe(host);
}
