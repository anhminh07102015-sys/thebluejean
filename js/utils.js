/* =====================================================================
   THE BLUES — Premium Denim Ecommerce  ·  SPA Engine
   Single-file frontend prototype. Pure vanilla JS + Tailwind.
   ===================================================================== */

/* ----------------------- UTILITIES ----------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (h) => {
    const t = document.createElement("template");
    t.innerHTML = h.trim();
    return t.content.firstElementChild;
};
const fmt = (n) => new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";
const fmtPts = (n) => new Intl.NumberFormat("vi-VN").format(Math.round(n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const now = () => new Date();
const escapeHtml = (s) =>
    String(s).replace(
        /[&<>"]/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

/* ----------------------- SVG IMAGE FACTORY -----------------------
   Generates editorial fashion placeholder "photography" via SVG so the
   prototype looks rich without external assets. Deterministic per seed. */
const PAL = {
    indigo: ["#21409A", "#1F3C88", "#111d45"],
    raw: ["#2a4eb0", "#1E3A8A", "#0f1d44"],
    stone: ["#9aa4bd", "#6c779a", "#3a4569"],
    ink: ["#1a2440", "#0e1530", "#05080f"],
    ecru: ["#d9d2c2", "#b3a98f", "#7d7257"],
    wash: ["#7d93c9", "#5470c0", "#2f4a92"],
};
function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}
/* =====================================================================
   REAL IMAGERY  — fashionSVG / heroSVG now resolve a seed to a real photo
   downloaded from theblues.com.vn (see crawl-images.mjs + images/manifest.js).
   Signatures are unchanged so every existing call site keeps working; the
   palKey/label args are kept for compatibility (label becomes alt text).
   ===================================================================== */
const IMG = (typeof window !== "undefined" && window.IMAGE_MANIFEST) || {
    products: {},
    categories: {},
    hero: [],
    pool: [],
    placeholder: "",
};
const IMG_BASE = (typeof location !== "undefined" && /\/pages\//.test(location.pathname))
    ? "../images/"
    : "images/"; // resolves relative to current page location
// 1×1 transparent pixel — only ever shown if the manifest is missing
const IMG_FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5'%3E%3Crect width='4' height='5' fill='%23223'/%3E%3C/svg%3E";

function imgPath(rel) {
    return rel ? IMG_BASE + rel : IMG_FALLBACK;
}
// deterministic pick from a pool; never crashes on an empty pool
function pickFromPool(pool, seed) {
    if (!pool || !pool.length) return imgPath(IMG.placeholder);
    return imgPath(pool[hashStr(String(seed)) % pool.length]);
}
// product ids: p1, p1b/c/d, and concatenated variants like "p1Indigo Raw"
function productImg(seed) {
    const m = String(seed).match(/^(p\d+)([b-d])?/);
    if (!m || !IMG.products[m[1]]) return null;
    const arr = IMG.products[m[1]];
    const idx = m[2] ? { b: 1, c: 2, d: 3 }[m[2]] : 0;
    return imgPath(arr[idx % arr.length] || arr[0]);
}
// returns a real image src for any seed used across the site
function resolveFashionImg(seed) {
    const s = String(seed);
    const prod = productImg(s);
    if (prod) return prod;
    if (s.startsWith("cat-") && IMG.categories[s.slice(4)])
        return imgPath(IMG.categories[s.slice(4)]);
    return pickFromPool(IMG.pool, s); // look*, ig*, journal-*, team-*, coll*, …
}
function imgTag(src, label, pos) {
    return `<img src="${src}" alt="${escapeHtml(label || "The Blues")}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:${pos};display:block">`;
}
function fashionSVG(seed, palKey = "indigo", label = "") {
    return imgTag(resolveFashionImg(seed), label, "center top");
}
function heroSVG(seed, palKey) {
    const src = IMG.hero.length
        ? pickFromPool(IMG.hero, seed)
        : pickFromPool(IMG.pool, seed);
    return imgTag(src, "The Blues", "center 22%");
}
