import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { PDFDocumentProxy } from "pdfjs-dist";
const reader = document.querySelector<HTMLDialogElement>("#resume-reader")!;
const pane = reader.querySelector<HTMLElement>(".reading-pane")!;
const paper = reader.querySelector<HTMLElement>(".paper")!;
const status = reader.querySelector<HTMLElement>(".reader-status")!;
const file = reader.dataset.file!,
  es = document.documentElement.lang === "es";
const button = (key: string) =>
  reader.querySelector<HTMLButtonElement>("[data-" + key + "]")!;
let doc: Promise<PDFDocumentProxy> | undefined;
let pageNumber = 1,
  zoom = 1,
  generation = 0,
  lastWidth = 0;
async function draw() {
  if (!reader.open) return;
  const version = ++generation;
  try {
    if (!doc) {
      status.textContent = es ? "Abriendo PDF…" : "Opening PDF…";
      doc = import("pdfjs-dist").then((pdf) => {
        pdf.GlobalWorkerOptions.workerSrc = workerUrl;
        return pdf.getDocument({ url: file }).promise;
      });
    }
    const pdf = await doc;
    if (version !== generation) return;
    const page = await pdf.getPage(pageNumber);
    const original = page.getViewport({ scale: 1 });
    const available = Math.max(150, pane.clientWidth - 30);
    const viewport = page.getViewport({
      scale: (available / original.width) * zoom,
    });
    const ratio = Math.min(devicePixelRatio, 2);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width * ratio);
    canvas.height = Math.ceil(viewport.height * ratio);
    canvas.style.width = viewport.width + "px";
    canvas.style.height = viewport.height + "px";
    await page.render({
      canvas,
      viewport,
      transform: [ratio, 0, 0, ratio, 0, 0],
    }).promise;
    const [text, annotations] = await Promise.all([
      page.getTextContent(),
      page.getAnnotations(),
    ]);
    if (version !== generation) return;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      text.items.map((item) => ("str" in item ? item.str : "")).join(" "),
    );
    paper.replaceChildren(canvas);
    for (const a of annotations) {
      if (!a.url || !/^(https?:|mailto:|tel:)/i.test(a.url)) continue;
      const [x, y] = viewport.convertToViewportPoint(a.rect[0], a.rect[1]);
      const [x2, y2] = viewport.convertToViewportPoint(a.rect[2], a.rect[3]);
      const link = document.createElement("a");
      link.href = a.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", a.url);
      Object.assign(link.style, {
        left: Math.min(x, x2) + "px",
        top: Math.min(y, y2) + "px",
        width: Math.abs(x2 - x) + "px",
        height: Math.abs(y2 - y) + "px",
      });
      paper.append(link);
    }
    reader.querySelector("[data-page]")!.textContent =
      pageNumber + " / " + pdf.numPages;
    reader.querySelector("[data-zoom]")!.textContent =
      Math.round(zoom * 100) + "%";
    button("prev-page").disabled = pageNumber <= 1;
    button("next-page").disabled = pageNumber >= pdf.numPages;
    button("zoom-out").disabled = zoom <= 0.75;
    button("zoom-in").disabled = zoom >= 2;
    status.textContent = "";
  } catch {
    if (version !== generation) return;
    doc = undefined;
    status.textContent = es
      ? "No se pudo cargar la vista. "
      : "The preview could not load. ";
    const a = document.createElement("a");
    a.href = file;
    a.textContent = es ? "Abrir PDF" : "Open PDF";
    status.append(a);
  }
}
for (const [key, delta] of [
  ["prev-page", -1],
  ["next-page", 1],
] as const)
  button(key).onclick = async () => {
    const pdf = await doc;
    if (!pdf) return;
    pageNumber = Math.max(1, Math.min(pdf.numPages, pageNumber + delta));
    pane.scrollTo(0, 0);
    void draw();
  };
for (const [key, delta] of [
  ["zoom-out", -0.25],
  ["zoom-in", 0.25],
] as const)
  button(key).onclick = () => {
    zoom = Math.max(0.75, Math.min(2, zoom + delta));
    void draw();
  };
document
  .querySelectorAll<HTMLAnchorElement>("[data-open-resume]")
  .forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      reader.showModal();
      pageNumber = 1;
      zoom = 1;
      pane.scrollTo(0, 0);
      void draw();
    }),
  );
reader.addEventListener("close", () => {
  generation++;
});
new ResizeObserver(() => {
  if (reader.open && lastWidth !== pane.clientWidth) {
    lastWidth = pane.clientWidth;
    void draw();
  }
}).observe(pane);
