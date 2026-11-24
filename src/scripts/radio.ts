import { games } from "../data/arcade";
import { stations } from "../data/stations";

type Player = {
  getVideoData(): { video_id?: string };
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  setVolume(v: number): void;
};
type Options = {
  videoId: string;
  width: number;
  height: number;
  events: {
    onReady: (e: { target: Player }) => void;
    onStateChange: (e: { data: number }) => void;
    onError: () => void;
  };
};

const yt = window as Window & {
  YT?: { Player: new (id: string, options: Options) => Player };
  onYouTubeIframeAPIReady?: () => void;
};

const slot = document.getElementById("radio-slot")!;
const bar = document.getElementById("radio")!;
const dock = document.getElementById("radio-dock")!;
const collapseBtn = document.getElementById(
  "radio-collapse",
) as HTMLButtonElement;
const feedback = document.querySelector<HTMLElement>("[data-radio-feedback]")!;
const mast = document.querySelector<HTMLElement>(".mast");
const projectsTarget =
  document.getElementById("work-heading") ||
  document.getElementById("projects");

const arts = document.querySelectorAll<HTMLImageElement>("[data-radio-art]");
const titles = document.querySelectorAll<HTMLElement>("[data-radio-title]");
const genres = document.querySelectorAll<HTMLElement>("[data-radio-genre]");
const playBtns =
  document.querySelectorAll<HTMLButtonElement>("[data-radio-play]");
const prevBtns =
  document.querySelectorAll<HTMLButtonElement>("[data-radio-prev]");
const nextBtns =
  document.querySelectorAll<HTMLButtonElement>("[data-radio-next]");
const muteBtns =
  document.querySelectorAll<HTMLButtonElement>("[data-radio-mute]");
const volInputs =
  document.querySelectorAll<HTMLInputElement>("[data-radio-vol]");
const volWraps = document.querySelectorAll<HTMLElement>("[data-vol-wrap]");
const channel = dock.querySelector<HTMLElement>("[data-channel]")!;
const covers = document.querySelectorAll<HTMLButtonElement>("[data-game]");
const tunnelTitle = document.querySelector<HTMLElement>("[data-tunnel-title]");
const exitArcade = document.querySelector<HTMLButtonElement>(
  "[data-leave-arcade]",
)!;
const isEs = () => document.documentElement.lang === "es";
const base = slot.dataset.base || "/";

let selection = 0;
let requested = false;
let playing = false;
let loading = false;
let gameIndex = games.findIndex(
  (game) => game.key === document.documentElement.dataset.arcade,
);
let resumeStation = false;
let localFallback = false;
let playbackVersion = 0;
let minimized = false;
let currentVol = 30;
let lastVol = 30;

const localTrack = new Audio();
localTrack.preload = "none";
localTrack.loop = true;
type Track = {
  title: string;
  genre: string;
  art: string;
  id?: string;
  audio?: string;
};
function currentTrack(): Track {
  if (gameIndex >= 0) return games[gameIndex];
  if (localFallback)
    return {
      title: "Cornfield Chase",
      genre: isEs() ? "Pista local" : "Local track",
      art: stations[0].art,
      audio: "assets/audio/CornfieldChase.mp3",
    };
  return stations[selection];
}
let player: Player | undefined;
let timeout: number;

function applyVolume(val: number) {
  currentVol = Math.max(0, Math.min(100, Math.round(val)));
  volInputs.forEach((input) => {
    input.value = String(currentVol);
  });
  volWraps.forEach((wrap) => {
    wrap.style.setProperty("--vol", currentVol + "%");
    wrap.classList.toggle("muted", currentVol === 0);
  });
  muteBtns.forEach((btn) => {
    btn.setAttribute(
      "aria-label",
      currentVol === 0
        ? isEs()
          ? "Activar sonido"
          : "Unmute"
        : isEs()
          ? "Silenciar"
          : "Mute",
    );
  });
  localTrack.volume = currentVol / 100;
  player?.setVolume(currentVol);
}

function updateTrackMeta() {
  const { title, genre, art } = currentTrack();
  const index = gameIndex >= 0 ? gameIndex : selection;
  const count = gameIndex >= 0 ? games.length : stations.length;
  channel.textContent =
    localFallback && gameIndex < 0
      ? "MP3"
      : [index + 1, count].map((n) => String(n).padStart(2, "0")).join(" / ");
  covers.forEach((b) =>
    b.setAttribute(
      "aria-pressed",
      String(b.dataset.game === games[gameIndex]?.key),
    ),
  );
  if (tunnelTitle) {
    tunnelTitle.textContent = gameIndex >= 0 ? games[gameIndex].name : "Arcade";
  }
  exitArcade.hidden = gameIndex < 0;
  dock.title = title + " · " + genre;
  titles.forEach((el) => (el.textContent = title));
  genres.forEach((el) => (el.textContent = genre));
  arts.forEach((img) => {
    img.src = base + art;
    img.alt = "";
  });
}

function paint() {
  bar.classList.toggle("requested", requested);
  dock.classList.toggle("requested", requested);
  bar.classList.toggle("playing", playing);
  dock.classList.toggle("playing", playing);
  const label = requested
    ? isEs()
      ? "Pausar"
      : "Pause"
    : isEs()
      ? "Reproducir"
      : "Play";
  playBtns.forEach((btn) => btn.setAttribute("aria-label", label));
}

function syncMinimized() {
  dock.classList.toggle("minimized", minimized);
  collapseBtn.setAttribute(
    "aria-label",
    minimized
      ? isEs()
        ? "Expandir reproductor"
        : "Expand player"
      : isEs()
        ? "Minimizar reproductor"
        : "Minimize player",
  );
}

/* Smooth continuous scroll-driven handoff:
   1. Inline right under Hero
   2. Sticky smoothly under navbar while crossing the open starry gap above Projects
   3. Continuous cross-dissolve right before touching Projects -> top bar tucks gently up, Dynamic Island capsule glides smoothly in */
function positionFeedback(floating: boolean) {
  const container = floating ? dock : bar;
  if (feedback.parentElement !== container) container.append(feedback);
}
function updateScrollHandoff() {
  const mastH = mast ? mast.getBoundingClientRect().height : 68;
  bar.style.setProperty("--mast-h", Math.round(mastH) + "px");
  const slotRect = slot.getBoundingClientRect();

  if (!bar.classList.contains("sticky") && !bar.classList.contains("tucked")) {
    slot.style.minHeight = Math.max(82, Math.round(bar.offsetHeight)) + "px";
  }

  if (slotRect.top > mastH) {
    bar.classList.remove("sticky", "tucked");
    bar.style.removeProperty("--handoff");
    positionFeedback(false);
    dock.classList.remove("visible");
    dock.setAttribute("aria-hidden", "true");
    return;
  }

  if (!projectsTarget) {
    const past = slotRect.bottom < mastH;
    bar.classList.toggle("sticky", !past);
    bar.classList.toggle("tucked", past);
    positionFeedback(past);
    dock.classList.toggle("visible", past);
    dock.setAttribute("aria-hidden", String(!past));
    return;
  }

  const projTop = projectsTarget.getBoundingClientRect().top;
  // Start fading right after sticking (zero opacity jump) and finish 56px later,
  // well BEFORE the unified Navbar morphs into its floating Liquid Pill.
  const naturalProjAtStick = mastH + (projTop - slotRect.top);
  const startFade = naturalProjAtStick - 4;
  const endFade = startFade - 56;
  const raw = (startFade - projTop) / Math.max(1, startFade - endFade);
  const progress = Math.max(0, Math.min(1, raw));

  bar.classList.add("sticky");
  bar.style.setProperty("--handoff", progress.toFixed(3));
  const tucked = progress >= 0.96;
  bar.classList.toggle("tucked", tucked);

  const showDock = progress >= 0.42;
  positionFeedback(showDock);
  dock.classList.toggle("visible", showDock);
  dock.setAttribute("aria-hidden", String(!showDock));
}

function failed() {
  if (!requested) return;
  const track = currentTrack();
  stop();
  feedback.textContent = isEs()
    ? "No se pudo reproducir la pista. "
    : "The track could not play. ";
  if (track.id) {
    const link = document.createElement("a");
    link.href = "https://www.youtube.com/watch?v=" + track.id;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = isEs() ? "Abrir en YouTube" : "Open on YouTube";
    feedback.append(link);
  }
  if (gameIndex >= 0 || localFallback) return;
  const fallback = document.createElement("button");
  fallback.textContent = isEs()
    ? "Escuchar Cornfield Chase"
    : "Play Cornfield Chase";
  fallback.onclick = () => {
    localFallback = true;
    updateTrackMeta();
    start();
  };
  feedback.append(" · ", fallback);
}

function createPlayer() {
  if (!yt.YT || player || !loading) return;
  new yt.YT.Player("radio-player", {
    width: 1,
    height: 1,
    videoId: currentTrack().id || stations[selection].id,
    events: {
      onReady: ({ target }) => {
        player = target;
        loading = false;
        target.setVolume(currentVol);
        const id = currentTrack().id;
        if (requested && id) target.loadVideoById(id);
      },
      onStateChange: ({ data }) => {
        if (
          !currentTrack().id ||
          player?.getVideoData()?.video_id !== currentTrack().id
        )
          return;
        if (data === 1) {
          if (!requested) {
            player?.pauseVideo();
            return;
          }
          clearTimeout(timeout);
          feedback.textContent = "";
          playing = true;
        }
        if ((data === 2 && playing) || data === 0) {
          playing = false;
          if (data === 0 && requested && gameIndex >= 0) {
            start(true);
            return;
          }
          requested = false;
          clearTimeout(timeout);
        }
        paint();
      },
      onError: () => {
        const id = player?.getVideoData()?.video_id;
        if (currentTrack().id && (!id || id === currentTrack().id)) failed();
      },
    },
  });
}

function start(change = false) {
  const track = currentTrack();
  const version = ++playbackVersion;
  if (track.audio) {
    requested = true;
    paint();
    feedback.textContent = "";
    const source = new URL(base + track.audio, location.href).href;
    if (localTrack.src !== source) localTrack.src = source;
    localTrack.volume = currentVol / 100;
    void localTrack
      .play()
      .then(() => {
        if (version !== playbackVersion || !requested) return;
        playing = true;
        paint();
      })
      .catch(() => {
        if (version === playbackVersion) failed();
      });
    return;
  }
  requested = true;
  paint();
  feedback.textContent = isEs() ? "Cargando audio…" : "Loading audio…";
  clearTimeout(timeout);
  timeout = window.setTimeout(failed, 15000);
  if (player) {
    if (change || player.getVideoData()?.video_id !== track.id)
      player.loadVideoById(track.id!);
    else player.playVideo();
    return;
  }
  if (loading) return;
  loading = true;
  if (yt.YT?.Player) {
    createPlayer();
    return;
  }
  yt.onYouTubeIframeAPIReady = createPlayer;
  if (!document.getElementById("youtube-api")) {
    const script = document.createElement("script");
    script.id = "youtube-api";
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      script.remove();
      loading = false;
      if (currentTrack().id) failed();
    };
    document.head.append(script);
  }
}

function stop() {
  playbackVersion++;
  localTrack.pause();
  requested = false;
  playing = false;
  clearTimeout(timeout);
  feedback.textContent = "";
  player?.pauseVideo();
  paint();
}

function setGame(index: number, play: boolean) {
  if (gameIndex < 0 && index >= 0) resumeStation = requested;
  stop();
  gameIndex = index;
  const key = games[index]?.key;
  if (key) document.documentElement.dataset.arcade = key;
  else delete document.documentElement.dataset.arcade;
  try {
    if (key) sessionStorage.setItem("orbital-arcade", key);
    else sessionStorage.removeItem("orbital-arcade");
  } catch {
    /* The environment still works without session storage. */
  }
  updateTrackMeta();
  if (play) start(true);
}

covers.forEach((b) =>
  b.addEventListener("click", () => {
    const index = games.findIndex((g) => g.key === b.dataset.game);
    if (index >= 0) setGame(index, true);
  }),
);
exitArcade.addEventListener("click", () => {
  const lastCover = covers[gameIndex];
  setGame(-1, resumeStation);
  lastCover?.focus({ preventScroll: true });
});

function tune(step: number) {
  if (gameIndex >= 0) {
    setGame((gameIndex + step + games.length) % games.length, true);
    return;
  }
  stop();
  localFallback = false;
  selection = (selection + step + stations.length) % stations.length;
  updateTrackMeta();
  start(true);
}

playBtns.forEach((btn) =>
  btn.addEventListener("click", () => (requested ? stop() : start())),
);
prevBtns.forEach((btn) => btn.addEventListener("click", () => tune(-1)));
nextBtns.forEach((btn) => btn.addEventListener("click", () => tune(1)));

volInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const v = Number(input.value);
    if (v > 0) lastVol = v;
    applyVolume(v);
  });
});

muteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentVol > 0) {
      lastVol = currentVol;
      applyVolume(0);
    } else {
      applyVolume(lastVol || 30);
    }
  });
});

collapseBtn.addEventListener("click", () => {
  minimized = !minimized;
  syncMinimized();
});

let raf = 0;
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    updateScrollHandoff();
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
window.addEventListener("orbital:lang", () => {
  updateTrackMeta();
  applyVolume(currentVol);
  paint();
  syncMinimized();
});
updateTrackMeta();
applyVolume(currentVol);
syncMinimized();
updateScrollHandoff();
