import { gsap } from "gsap";

const Z_FAR = -2400;
const Z_NEAR = 780;
const RANGE = Z_NEAR - Z_FAR;
const DURATION = 22;
const FADE_IN = 0.06;
const FADE_OUT = 0.05;

function opacityForProgress(progress: number) {
  if (progress < FADE_IN) return Math.max(0, progress / FADE_IN);
  if (progress > 1 - FADE_OUT) return Math.max(0, (1 - progress) / FADE_OUT);
  return 1;
}

function getLayout(root: HTMLElement) {
  const width = root.clientWidth || window.innerWidth;
  const planeW = width < 768 ? Math.min(width * 0.27, 175) : Math.min(width * 0.22, 300);
  return {
    planeW,
    planeH: planeW * 1.5,
    offsetX: width < 768 ? width * 0.31 : width * 0.35,
    angle: 24,
  };
}

export function initArcadeViews() {
  const hub = document.getElementById("game-hub");
  if (!hub) return;

  const tabs = Array.from(hub.querySelectorAll<HTMLButtonElement>("[data-arcade-view]"));
  const marqueePanel = hub.querySelector<HTMLElement>("[data-view-panel='carousel']");
  const tunnelPanel = hub.querySelector<HTMLElement>("[data-view-panel='tunnel']");
  const tunnelRoot = hub.querySelector<HTMLElement>(".endless-root");
  const world = tunnelRoot?.querySelector<HTMLElement>(".endless-world") ?? null;
  const planes = world ? Array.from(world.querySelectorAll<HTMLElement>(".endless-plane")) : [];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tweens: gsap.core.Tween[] = [];
  let initialized = false;
  let visible = false;

  const applyLayout = () => {
    if (!tunnelRoot || !planes.length) return;
    const { planeW, planeH, offsetX, angle } = getLayout(tunnelRoot);
    planes.forEach((plane, index) => {
      const isLeft = index % 2 === 0;
      plane.style.width = `${planeW}px`;
      plane.style.height = `${planeH}px`;
      gsap.set(plane, {
        xPercent: -50,
        yPercent: -50,
        x: isLeft ? -offsetX : offsetX,
        y: 0,
        rotationY: isLeft ? angle : -angle,
        force3D: true,
      });
    });
  };

  const syncPlayback = () => {
    const activeTunnel = tunnelPanel ? !tunnelPanel.hidden : false;
    const play = activeTunnel && visible && !reduceMotion;
    tweens.forEach((t) => {
      if (play) t.resume();
      else t.pause();
    });
  };

  const setupTunnel = () => {
    if (initialized || !tunnelRoot || !world || !planes.length) return;
    initialized = true;

    gsap.ticker.lagSmoothing(0);
    gsap.set(world, { force3D: true });
    applyLayout();

    const total = planes.length;
    planes.forEach((plane, index) => {
      const img = plane.querySelector("img");
      const startProgress = index / total;
      gsap.set(plane, { z: Z_FAR + startProgress * RANGE });
      if (img) img.style.opacity = String(opacityForProgress(startProgress));
      plane.style.zIndex = String(Math.round(startProgress * 1000));

      if (reduceMotion) return;

      const tween = gsap.fromTo(
        plane,
        { z: Z_FAR },
        {
          z: Z_NEAR,
          duration: DURATION,
          ease: "none",
          repeat: -1,
          paused: true,
          immediateRender: false,
          onUpdate() {
            const p = this.progress();
            if (img) img.style.opacity = String(opacityForProgress(p));
            plane.style.zIndex = String(Math.round(p * 1000));
          },
        },
      );
      tween.progress(startProgress);
      tweens.push(tween);
    });

    // Slow down softly on pointer hover so clicking any flying cover is effortless
    tunnelRoot.addEventListener("pointerenter", () => {
      tweens.forEach((t) => gsap.to(t, { timeScale: 0.24, duration: 0.35, overwrite: "auto" }));
    });
    tunnelRoot.addEventListener("pointerleave", () => {
      tweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.45, overwrite: "auto" }));
    });

    window.addEventListener("resize", applyLayout);
    syncPlayback();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.arcadeView;
      if (!target || !marqueePanel || !tunnelPanel) return;

      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      const showTunnel = target === "tunnel";
      marqueePanel.hidden = showTunnel;
      tunnelPanel.hidden = !showTunnel;

      if (showTunnel) {
        setupTunnel();
        requestAnimationFrame(() => {
          applyLayout();
          syncPlayback();
        });
      } else {
        syncPlayback();
      }
    });
  });

  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "120px 0px" },
    ).observe(hub);
  } else {
    visible = true;
  }
}
