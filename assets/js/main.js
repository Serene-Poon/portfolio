/* =========================================================
   Serene Poon — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Language ---------- */
  const root = document.documentElement;
  const STORAGE_KEY = "serene-lang";

  function translate(lang) {
    root.dataset.lang = lang;
    root.setAttribute("lang", lang === "zh" ? "zh-Hant-HK" : "en");

    document.querySelectorAll("[data-en][data-zh]").forEach(function (el) {
      const value = el.dataset[lang];
      if (typeof value === "string") el.innerHTML = value;
    });

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.setLang === lang);
    });

    document.title = lang === "zh"
      ? "Serene Poon — 平面設計師・影片剪接・攝影師"
      : "Serene Poon — Graphic Designer, Video Editor & Photographer";

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { translate(btn.dataset.setLang); });
  });

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }

  const urlLang = new URLSearchParams(location.search).get("lang");
  if (urlLang === "zh" || urlLang === "en") {
    translate(urlLang);
  } else if (saved && saved !== root.dataset.lang) {
    translate(saved);
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox.querySelector("img");
  const lbTitle = lightbox.querySelector("strong");
  const lbMeta = lightbox.querySelector("figcaption span");
  const btnPrev = lightbox.querySelector(".lb-prev");
  const btnNext = lightbox.querySelector(".lb-next");
  const btnClose = lightbox.querySelector(".lb-close");

  let tiles = [];
  let index = 0;
  let lastFocused = null;
  let sectionLabel = "";

  function collectTiles() {
    tiles = Array.from(document.querySelectorAll(".tile"));
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function show(i) {
    if (!tiles.length) return;
    index = (i + tiles.length) % tiles.length;
    const tile = tiles[index];
    const img = tile.querySelector("img");
    const title = tile.dataset.title || "";
    const meta = tile.dataset.meta || "";

    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    lbTitle.textContent = title;
    lbTitle.style.display = title ? "" : "none";

    const counter = pad(index + 1) + " / " + pad(tiles.length);
    lbMeta.textContent = meta ? counter + " · " + meta : counter;
  }

  function open(tile) {
    collectTiles();
    lastFocused = tile;
    show(tiles.indexOf(tile));
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.addEventListener("click", function (e) {
    const tile = e.target.closest(".tile");
    if (tile) {
      e.preventDefault();
      open(tile);
      return;
    }
    if (e.target === lightbox) close();
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
  btnNext.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  /* swipe on touch devices */
  let touchX = null;
  lightbox.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* keyboard access on tiles */
  document.querySelectorAll(".tile").forEach(function (tile) {
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(tile);
      }
    });
  });

  /* ---------- ShowReel (click to load YouTube) ---------- */
  const videoFrame = document.getElementById("showreel");
  if (videoFrame) {
    const playBtn = videoFrame.querySelector(".video-play");
    const videoId = "OiAIreQaSsA";
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId +
          "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        iframe.title = "ShowReel 2026 — Serene Poon";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        videoFrame.innerHTML = "";
        videoFrame.appendChild(iframe);
      });
    }
  }

  /* ---------- Custom diamond cursor ---------- */
  const cursor = document.querySelector(".cursor-diamond");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (cursor && finePointer) {
    let tx = -100, ty = -100;
    let cx = -100, cy = -100;
    let raf = null;

    const HOT = "a, button, .tile, .btn, .lang-switch button";

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!cursor.classList.contains("is-visible")) {
        cx = tx; cy = ty;
        cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0) rotate(45deg)";
      }
      if (!raf) raf = requestAnimationFrame(tick);
      cursor.classList.add("is-visible");
    });

    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-visible"); });
    document.addEventListener("mouseover", function (e) {
      cursor.classList.toggle("is-active", !!(e.target.closest && e.target.closest(HOT)));
    });

    function tick() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0) rotate(45deg)";
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
  }

  /* ---------- Masonry gallery ---------- */
  const masons = Array.from(document.querySelectorAll(".masonry"));

  function columnCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 1100) return 2;
    return 3;
  }

  function buildMasonry() {
    const cols = columnCount();
    masons.forEach(function (m) {
      if (!m._items) m._items = Array.from(m.children);
      if (m.dataset.cols === String(cols) && m.children.length === cols) return;
      m.dataset.cols = String(cols);

      const items = m._items;
      m.style.setProperty("--masonry-cols", cols);
      m.innerHTML = "";
      const columns = [];
      for (let i = 0; i < cols; i++) {
        const col = document.createElement("div");
        col.className = "m-col";
        m.appendChild(col);
        columns.push(col);
      }

      const heights = new Array(cols).fill(0);
      items.forEach(function (tile) {
        const img = tile.querySelector("img");
        const w = Number(img.getAttribute("width")) || 1;
        const h = Number(img.getAttribute("height")) || 1;
        const target = heights.indexOf(Math.min.apply(null, heights));
        columns[target].appendChild(tile);
        heights[target] += h / w + 0.05;
      });
    });
  }

  buildMasonry();

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildMasonry, 150);
  });

  /* ---------- Active nav ---------- */
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
