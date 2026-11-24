import type { Language } from "../i18n";

const pageCache = new Map<string, Document>();
let pendingSwitch: AbortController | null = null;

function normPath(urlLike: string): string {
  return new URL(urlLike, location.href).pathname;
}

const PRESERVE_TAGS = new Set(["CANVAS", "IFRAME", "SVG", "SCRIPT", "STYLE"]);
const PRESERVE_IDS = new Set(["radio-player"]);
const PRESERVE_CLASSES = [
  "earth-scene",
  "contact-globe",
  "black-hole-scene",
  "starfield-wrap",
  "nimbus-water",
  "orbital-loader",
];

function isPreserved(el: Element): boolean {
  if (PRESERVE_TAGS.has(el.tagName)) return true;
  if (el.id && PRESERVE_IDS.has(el.id)) return true;
  for (const cls of PRESERVE_CLASSES) {
    if (el.classList.contains(cls)) return true;
  }
  return false;
}

const SYNC_ATTRS = [
  "aria-label",
  "title",
  "placeholder",
  "data-cursor",
  "alt",
  "hreflang",
  "data-success",
  "data-failure",
  "data-sending",
];

function syncAttrs(cur: Element, next: Element) {
  for (const attr of SYNC_ATTRS) {
    const val = next.getAttribute(attr);
    if (val === null) {
      cur.removeAttribute(attr);
    } else if (cur.getAttribute(attr) !== val) {
      cur.setAttribute(attr, val);
    }
  }
  if (cur.tagName === "A" && cur.hasAttribute("href") && next.hasAttribute("href")) {
    const nh = next.getAttribute("href");
    if (nh !== null && cur.getAttribute("href") !== nh) {
      cur.setAttribute("href", nh);
    }
  }
}

function morphElement(cur: Element, next: Element) {
  if (isPreserved(cur)) return;

  // Scroll-lit manifesto: swap letter spans + total character count while preserving live --q
  if (cur.hasAttribute("data-reading") && next.hasAttribute("data-reading")) {
    const nextAria = next.getAttribute("aria-label");
    if (nextAria !== null) cur.setAttribute("aria-label", nextAria);
    const curQ = (cur as HTMLElement).style.getPropertyValue("--q") || "1";
    const match = next.getAttribute("style")?.match(/--n:\s*(\d+)/);
    if (match) (cur as HTMLElement).style.setProperty("--n", match[1]);
    cur.innerHTML = next.innerHTML;
    (cur as HTMLElement).style.setProperty("--q", curQ);
    return;
  }

  syncAttrs(cur, next);

  // Preserve form input values if user already typed in the contact form
  if (cur.tagName === "INPUT" || cur.tagName === "TEXTAREA") return;

  const curNodes = Array.from(cur.childNodes);
  const nextNodes = Array.from(next.childNodes);
  const len = Math.min(curNodes.length, nextNodes.length);

  for (let i = 0; i < len; i++) {
    const c = curNodes[i];
    const n = nextNodes[i];
    if (c.nodeType === Node.TEXT_NODE && n.nodeType === Node.TEXT_NODE) {
      if (c.nodeValue !== n.nodeValue) c.nodeValue = n.nodeValue;
    } else if (
      c.nodeType === Node.ELEMENT_NODE &&
      n.nodeType === Node.ELEMENT_NODE &&
      (c as Element).tagName === (n as Element).tagName
    ) {
      morphElement(c as Element, n as Element);
    }
  }

  // Fallback for inline mixed text/element containers when structure differs
  if (curNodes.length !== nextNodes.length) {
    const hasPreservedChild = curNodes.some(
      (node) => node.nodeType === Node.ELEMENT_NODE && isPreserved(node as Element),
    );
    if (!hasPreservedChild && !cur.querySelector("canvas, iframe, form, input, textarea")) {
      cur.innerHTML = next.innerHTML;
    }
  }
}

function syncHeaderChrome(nextDoc: Document, nextLang: Language) {
  const curSkip = document.querySelector<HTMLAnchorElement>("a.skip");
  const nextSkip = nextDoc.querySelector<HTMLAnchorElement>("a.skip");
  if (curSkip && nextSkip) curSkip.textContent = nextSkip.textContent;

  const curNav = document.getElementById("liquid-nav");
  const nextNav = nextDoc.getElementById("liquid-nav");
  if (curNav && nextNav) {
    const label = nextNav.getAttribute("aria-label");
    if (label) curNav.setAttribute("aria-label", label);
    const curItems = curNav.querySelectorAll<HTMLElement>(".nimbus-item");
    const nextItems = nextNav.querySelectorAll<HTMLElement>(".nimbus-item");
    curItems.forEach((item, idx) => {
      const target = nextItems[idx];
      if (!target) return;
      const aria = target.getAttribute("aria-label");
      if (aria) item.setAttribute("aria-label", aria);
      const curLbl = item.querySelector(".nimbus-label");
      const nextLbl = target.querySelector(".nimbus-label");
      if (curLbl && nextLbl) curLbl.textContent = nextLbl.textContent;
    });
  }

  const curMenu = document.getElementById("menu");
  const nextMenu = nextDoc.getElementById("menu");
  if (curMenu && nextMenu) {
    const aria = nextMenu.getAttribute("aria-label");
    if (aria) curMenu.setAttribute("aria-label", aria);
    const curTxt = Array.from(curMenu.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
    const nextTxt = Array.from(nextMenu.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
    if (curTxt && nextTxt) curTxt.nodeValue = nextTxt.nodeValue;
  }

  const curPicker = document.querySelector<HTMLDetailsElement>(".language-picker");
  const nextPicker = nextDoc.querySelector<HTMLDetailsElement>(".language-picker");
  if (curPicker && nextPicker) {
    const curSum = curPicker.querySelector("summary");
    const nextSum = nextPicker.querySelector("summary");
    if (curSum && nextSum) {
      const aria = nextSum.getAttribute("aria-label");
      if (aria) curSum.setAttribute("aria-label", aria);
      const curImg = curSum.querySelector("img");
      const nextImg = nextSum.querySelector("img");
      if (curImg && nextImg) curImg.src = nextImg.getAttribute("src") || curImg.src;
      const curCode = curSum.querySelector("span");
      const nextCode = nextSum.querySelector("span");
      if (curCode && nextCode) curCode.textContent = nextCode.textContent;
    }

    const curLinks = curPicker.querySelectorAll<HTMLAnchorElement>(".languages a");
    const nextLinks = nextPicker.querySelectorAll<HTMLAnchorElement>(".languages a");
    curLinks.forEach((link, idx) => {
      const target = nextLinks[idx];
      if (!target) return;
      const curCurrent = target.getAttribute("aria-current");
      if (curCurrent) link.setAttribute("aria-current", curCurrent);
      else link.removeAttribute("aria-current");
      // Move check icon visibility without destroying links
      const existingCheck = link.querySelector("svg");
      const shouldCheck = link.lang === nextLang;
      if (existingCheck) {
        existingCheck.style.display = shouldCheck ? "" : "none";
      }
    });
  }
}

function applyLanguageDoc(nextDoc: Document, nextLang: Language, targetUrl: string, push: boolean) {
  const savedY = window.scrollY;

  document.documentElement.lang = nextLang;
  document.title = nextDoc.title;

  const curMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const nextMeta = nextDoc.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (curMeta && nextMeta) curMeta.content = nextMeta.content;

  syncHeaderChrome(nextDoc, nextLang);

  const curMain = document.getElementById("main");
  const nextMain = nextDoc.getElementById("main");
  if (curMain && nextMain) morphElement(curMain, nextMain);

  const curFooter = document.querySelector("footer.orbital-footer");
  const nextFooter = nextDoc.querySelector("footer.orbital-footer");
  if (curFooter && nextFooter) morphElement(curFooter, nextFooter);

  if (push) {
    const dest = new URL(targetUrl, location.href);
    dest.hash = location.hash;
    history.pushState({ lang: nextLang }, "", dest.pathname + dest.search + dest.hash);
  }

  window.scrollTo({ top: savedY, behavior: "instant" as ScrollBehavior });
  window.dispatchEvent(new CustomEvent("orbital:lang", { detail: { lang: nextLang } }));
  window.dispatchEvent(new Event("resize"));
}

async function fetchLangDoc(url: string, signal?: AbortSignal): Promise<Document> {
  const key = normPath(url);
  const cached = pageCache.get(key);
  if (cached) return cached;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  pageCache.set(key, doc);
  return doc;
}

export function initSeamlessLanguageSwitch() {
  const picker = document.querySelector<HTMLDetailsElement>(".language-picker");
  if (!picker) return;

  // Store initial page snapshot by normalized path for zero-latency back switching
  pageCache.set(location.pathname, document.cloneNode(true) as Document);

  const links = picker.querySelectorAll<HTMLAnchorElement>(".languages a[lang]");
  links.forEach((link) => {
    link.addEventListener("click", async (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (document.getElementById("mast")?.dataset.article === "true") return;

      e.preventDefault();
      picker.open = false;

      const nextLang = (link.lang === "en" ? "en" : "es") as Language;
      if (nextLang === document.documentElement.lang) return;

      pendingSwitch?.abort();
      const ctrl = new AbortController();
      pendingSwitch = ctrl;

      try {
        const nextDoc = await fetchLangDoc(link.href, ctrl.signal);
        if (ctrl.signal.aborted) return;
        applyLanguageDoc(nextDoc, nextLang, link.href, true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          location.href = link.href;
        }
      }
    });
  });

  window.addEventListener("popstate", async () => {
    if (document.getElementById("mast")?.dataset.article === "true") return;
    const isEn = /\/en(?:\.html|\/)?$/i.test(location.pathname);
    const nextLang: Language = isEn ? "en" : "es";
    if (nextLang === document.documentElement.lang) return;
    try {
      const nextDoc = await fetchLangDoc(location.href);
      applyLanguageDoc(nextDoc, nextLang, location.href, false);
    } catch {
      location.reload();
    }
  });
}
