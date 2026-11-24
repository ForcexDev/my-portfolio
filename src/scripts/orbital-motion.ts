/**
 * Orbital Motion & Interaction Engine
 * Demand-driven, single-read rAF scroll choreography adapted to ForcexDev's orbital system.
 */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

const approach = (cur: number, target: number, dt: number, tau: number) =>
  target + (cur - target) * Math.exp(-Math.max(0, dt) / tau);

const windowed = (y: number, H: number, a: number, b: number) => {
  const span = (a - b) * H;
  if (!(span > 0)) return y <= b * H ? 1 : 0;
  return clamp01((a * H - y) / span);
};

const nearestRow = (centers: readonly number[], mid: number) => {
  let best = 0;
  let dist = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const d = Math.abs(centers[i] - mid);
    if (d < dist) {
      dist = d;
      best = i;
    }
  }
  return best;
};

export function initOrbitalMotion() {
  if (typeof window === "undefined") return;

  const docEl = document.documentElement;
  const mainEl = document.getElementById("main");
  if (!mainEl) return;

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fpQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  let still = rmQuery.matches;
  let fine = fpQuery.matches;

  if (!still) {
    docEl.setAttribute("data-motion", "ready");
  }

  const readEls = Array.from(
    mainEl.querySelectorAll<HTMLElement>("[data-reading]"),
  );
  const archiveList = mainEl.querySelector<HTMLElement>("[data-archive-list]");
  const archiveRows = archiveList
    ? Array.from(archiveList.querySelectorAll<HTMLElement>("[data-archive-row]"))
    : [];
  const archiveStage = archiveList?.querySelector<HTMLElement>(
    "[data-archive-stage]",
  );
  const archiveImgs = archiveStage
    ? Array.from(
        archiveStage.querySelectorAll<HTMLElement>("[data-archive-preview]"),
      )
    : [];

  const cursorEl = document.getElementById("orbital-cursor");
  const cursorText = cursorEl?.querySelector<HTMLElement>("span") ?? null;

  const state = {
    H: window.innerHeight || 800,
    readOff: [] as number[],
    rowMid: [] as number[],
    rowLocal: [] as number[],
    activeRow: -1,
    hoverRow: -1,
    ready: false,
    top: 0,
    last: 0,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    seen: false,
    label: "",
    raf: 0,
    cache: new WeakMap<HTMLElement, Record<string, string>>(),
  };

  const put = (el: HTMLElement | null | undefined, prop: string, val: string) => {
    if (!el) return;
    let map = state.cache.get(el);
    if (!map) {
      map = {};
      state.cache.set(el, map);
    }
    if (map[prop] === val) return;
    map[prop] = val;
    if (prop.charCodeAt(0) === 45) {
      el.style.setProperty(prop, val);
    } else {
      (el.style as unknown as Record<string, string>)[prop] = val;
    }
  };

  const flag = (
    el: HTMLElement | null | undefined,
    attr: string,
    on: boolean,
  ) => {
    if (!el) return;
    if (on !== el.hasAttribute(attr)) {
      if (on) el.setAttribute(attr, "");
      else el.removeAttribute(attr);
    }
  };

  const offsetInMain = (el: HTMLElement) => {
    let y = 0;
    let cur: HTMLElement | null = el;
    while (cur && cur !== mainEl) {
      y += cur.offsetTop;
      cur = cur.offsetParent as HTMLElement | null;
    }
    return y;
  };

  function syncCursorFromElement(target: Element | null) {
    if (!cursorEl || !cursorText) return;
    const blocked = target?.closest("[data-no-cursor]");
    const hit = !blocked
      ? target?.closest<HTMLElement>("[data-cursor]")
      : null;
    const label = hit?.getAttribute("data-cursor") || "";
    if (label !== state.label) {
      state.label = label;
      if (label) cursorText.textContent = label;
      flag(cursorEl, "data-on", Boolean(label));
    }
  }

  function schedule() {
    if (!state.raf) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function frame(now: number) {
    state.raf = 0;
    const dt = state.last ? Math.min(64, now - state.last) : 16;
    state.last = now;

    const rawTop = mainEl!.getBoundingClientRect().top;
    const scrollDelta = Math.abs(rawTop - state.top);
    state.top =
      !state.ready || still ? rawTop : approach(state.top, rawTop, dt, 68);
    state.ready = true;

    let again = !still && Math.abs(state.top - rawTop) > 0.35;
    const top = state.top;
    const H = state.H;

    if (cursorEl && fine && state.seen && !still && scrollDelta > 1) {
      syncCursorFromElement(document.elementFromPoint(state.mx, state.my));
    }

    // 1. Scroll-lit manifesto paragraphs (letter-by-letter illumination)
    for (let i = 0; i < readEls.length; i++) {
      const el = readEls[i];
      const y = top + (state.readOff[i] ?? 0);
      const q = still ? 1 : windowed(y, H, 0.78, 0.24);
      put(el, "--q", q.toFixed(4));
    }

    // 2. Archive illuminated rows + gliding floating preview
    if (archiveRows.length) {
      const nextActive =
        state.hoverRow >= 0
          ? state.hoverRow
          : fine
            ? 0
            : nearestRow(
                state.rowMid.map((m) => top + m),
                H * 0.52,
              );
      if (nextActive !== state.activeRow) {
        state.activeRow = nextActive;
        archiveRows.forEach((row, idx) =>
          flag(row, "data-active", idx === nextActive),
        );
        archiveImgs.forEach((img, idx) =>
          flag(img, "data-active", idx === nextActive),
        );
        if (archiveStage) {
          put(
            archiveStage,
            "--oy",
            `${(state.rowLocal[nextActive] ?? 0).toFixed(1)}px`,
          );
        }
      }
    }

    // 3. Contextual trailing action pill cursor (desktop fine pointer only)
    if (cursorEl && fine && state.seen && !still) {
      state.cx = approach(state.cx, state.mx, dt, 52);
      state.cy = approach(state.cy, state.my, dt, 52);
      put(
        cursorEl,
        "transform",
        `translate3d(${state.cx.toFixed(1)}px,${state.cy.toFixed(1)}px,0)`,
      );
      if (
        Math.abs(state.cx - state.mx) > 0.3 ||
        Math.abs(state.cy - state.my) > 0.3
      ) {
        again = true;
      }
    }

    if (again) schedule();
  }

  function measure() {
    state.H = window.innerHeight || 800;
    state.readOff = readEls.map((el) => offsetInMain(el));
    state.rowMid = archiveRows.map(
      (r) => offsetInMain(r) + r.offsetHeight * 0.5,
    );
    state.rowLocal = archiveRows.map((r) => r.offsetTop + r.offsetHeight * 0.5);
    state.activeRow = -1;
    state.cache = new WeakMap();
    schedule();
  }

  archiveRows.forEach((row, idx) => {
    row.addEventListener("pointerenter", (ev) => {
      if (ev.pointerType !== "mouse" || !fine) return;
      state.hoverRow = idx;
      schedule();
    });
    row.addEventListener("focusin", () => {
      state.hoverRow = idx;
      schedule();
    });
  });

  archiveList?.addEventListener("pointerleave", () => {
    state.hoverRow = -1;
    schedule();
  });

  if (cursorEl && cursorText) {
    document.addEventListener(
      "pointermove",
      (ev) => {
        if (ev.pointerType !== "mouse" || !fine || still) return;
        state.mx = ev.clientX;
        state.my = ev.clientY;
        if (!state.seen) {
          state.seen = true;
          state.cx = state.mx;
          state.cy = state.my;
        }
        syncCursorFromElement(ev.target as Element | null);
        schedule();
      },
      { passive: true },
    );

    document.addEventListener("pointerleave", () => {
      state.label = "";
      flag(cursorEl, "data-on", false);
    });
  }

  const revealEls = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  if (revealEls.length) {
    if (still || typeof IntersectionObserver === "undefined") {
      revealEls.forEach((el) => el.setAttribute("data-in", ""));
    } else {
      const revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-in", "");
            revealIO.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
      );
      revealEls.forEach((el) => revealIO.observe(el));
    }
  }

  const arcHosts = Array.from(
    document.querySelectorAll<HTMLElement>("[data-orbital-arcs]"),
  );
  if (arcHosts.length && typeof IntersectionObserver !== "undefined") {
    const arcIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          flag(entry.target as HTMLElement, "data-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "120px 0px" },
    );
    arcHosts.forEach((el) => arcIO.observe(el));
  }

  const syncPrefs = () => {
    still = rmQuery.matches;
    fine = fpQuery.matches;
    if (still) {
      docEl.removeAttribute("data-motion");
      revealEls.forEach((el) => el.setAttribute("data-in", ""));
      flag(cursorEl, "data-on", false);
    } else {
      docEl.setAttribute("data-motion", "ready");
    }
    measure();
  };

  rmQuery.addEventListener("change", syncPrefs);
  fpQuery.addEventListener("change", syncPrefs);

  measure();
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(measure).observe(mainEl);
  }
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  document.fonts?.ready.then(measure).catch(() => {});
}
