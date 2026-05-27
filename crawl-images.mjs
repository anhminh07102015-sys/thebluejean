/**
 * crawl-images.mjs — Download real fashion photos from theblues.com.vn and
 * build a seed→image manifest for the demo site.
 *
 * Usage:  node crawl-images.mjs
 *
 * Polite crawler: browser UA + referer, sequential with delays, respects the
 * product/category paths allowed by robots.txt. Images are for a LOCAL demo
 * only — do not redistribute or deploy publicly.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

const ORIGIN = "https://theblues.com.vn";
const UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const OUT = path.resolve("images");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// demo category -> site category listing path
const CAT_MAP = {
    Denim: "product-category/thoi-trang-nam/quan-dai/",
    Outerwear: "product-category/thoi-trang-nam/ao-khoac/",
    Knitwear: "product-category/thoi-trang-nu/ao-kieu-nu/",
    Shirts: "product-category/thoi-trang-nam/ao-somi/",
    Tees: "product-category/thoi-trang-nam/ao-thun/",
    Accessories: "product-category/phu-kien-nam-nu/",
};
const PER_CAT = 8; // product pages to crawl per category

// demo products grouped by category (must match PNAMES order in the HTML)
const DEMO_PRODUCTS = [
    ["p1", "Denim"], ["p2", "Outerwear"], ["p3", "Denim"], ["p4", "Outerwear"],
    ["p5", "Tees"], ["p6", "Knitwear"], ["p7", "Shirts"], ["p8", "Denim"],
    ["p9", "Knitwear"], ["p10", "Outerwear"], ["p11", "Tees"], ["p12", "Denim"],
    ["p13", "Knitwear"], ["p14", "Shirts"], ["p15", "Outerwear"], ["p16", "Tees"],
    ["p17", "Denim"], ["p18", "Accessories"], ["p19", "Accessories"],
    ["p20", "Accessories"], ["p21", "Knitwear"], ["p22", "Outerwear"],
    ["p23", "Accessories"], ["p24", "Tees"],
];

async function fetchText(url, tries = 2) {
    for (let i = 0; i < tries; i++) {
        try {
            const res = await fetch(url, {
                headers: { "User-Agent": UA, Referer: ORIGIN + "/", Accept: "text/html" },
                signal: AbortSignal.timeout(30000),
            });
            if (res.ok) return await res.text();
            if (res.status === 404) return "";
        } catch (e) {
            if (i === tries - 1) console.warn("  ! fetch failed", url, e.message);
        }
        await sleep(800);
    }
    return "";
}

async function download(url, dest) {
    for (let i = 0; i < 2; i++) {
        try {
            const res = await fetch(url, {
                headers: { "User-Agent": UA, Referer: ORIGIN + "/" },
                signal: AbortSignal.timeout(45000),
            });
            if (!res.ok || !res.body) throw new Error("HTTP " + res.status);
            await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
            return true;
        } catch (e) {
            if (i === 1) {
                console.warn("  ! download failed", url, e.message);
                return false;
            }
            await sleep(600);
        }
    }
    return false;
}

// pull product page URLs from a category listing
function productLinks(html) {
    const set = new Set();
    const re = /href="(https:\/\/theblues\.com\.vn\/san-pham\/[^"?#]+)"/g;
    let m;
    while ((m = re.exec(html))) set.add(m[1].replace(/\/?$/, "/"));
    return [...set];
}

// full-size gallery images from a product page (ordered, unique)
function galleryImages(html) {
    const out = [];
    const seen = new Set();
    const push = (u) => {
        if (u && /\.(jpe?g|png|webp)$/i.test(u) && !seen.has(u)) {
            seen.add(u);
            out.push(u);
        }
    };
    let m;
    const re = /data-large_image="([^"]+)"/g;
    while ((m = re.exec(html))) push(m[1]);
    if (!out.length) {
        const og = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (og) push(og[1]);
    }
    return out;
}

// portrait model/lifestyle shots from the homepage (full-res versions)
function homepageShots(html) {
    const out = new Set();
    const re = /https:\/\/theblues\.com\.vn\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\/[^" )]+?\.(?:jpe?g|png)/g;
    let m;
    while ((m = re.exec(html))) {
        let u = m[0];
        if (/favicon|logo|icon|placeholder|-\d{2,3}x\d{2,3}\.png|bo-cong-thuong|chinh-sach/i.test(u)) continue;
        // strip WooCommerce crop suffix -> full image
        u = u.replace(/-\d{3,4}x\d{3,4}(?=\.\w+$)/, "");
        out.add(u);
    }
    return [...out];
}

async function main() {
    for (const d of ["products", "cat", "hero", "pool"])
        await mkdir(path.join(OUT, d), { recursive: true });

    // 1) crawl category listings -> product page URLs
    console.log("== Collecting product URLs per category ==");
    const catProductUrls = {};
    for (const [cat, p] of Object.entries(CAT_MAP)) {
        const html = await fetchText(ORIGIN + "/" + p);
        const links = productLinks(html).slice(0, PER_CAT);
        catProductUrls[cat] = links;
        console.log(`  ${cat}: ${links.length} products`);
        await sleep(700);
    }

    // 2) visit each product page -> gallery images
    console.log("== Fetching product galleries ==");
    const catGalleries = {}; // cat -> [ [imgUrl,...], ... ]
    const allShots = []; // for lifestyle pool
    for (const [cat, urls] of Object.entries(catProductUrls)) {
        catGalleries[cat] = [];
        for (const u of urls) {
            const html = await fetchText(u);
            const imgs = galleryImages(html);
            if (imgs.length) {
                catGalleries[cat].push(imgs);
                allShots.push(...imgs);
            }
            console.log(`  [${cat}] ${imgs.length} imgs <- ${u.split("/").slice(-2)[0]}`);
            await sleep(650);
        }
    }

    // 3) homepage -> hero + extra lifestyle pool
    console.log("== Fetching homepage shots ==");
    const homeHtml = await fetchText(ORIGIN + "/");
    const homeShots = homepageShots(homeHtml);
    console.log(`  homepage: ${homeShots.length} candidate shots`);

    // ---- build assignment ----
    const manifest = { products: {}, categories: {}, hero: [], pool: [], placeholder: "" };
    const dl = []; // {url, dest, rel}
    const queue = (url, rel) => {
        dl.push({ url, dest: path.join(OUT, rel), rel });
        return rel;
    };

    // products: assign one real product (rotating) per demo product, 4 slots each
    const catCursor = Object.fromEntries(Object.keys(CAT_MAP).map((c) => [c, 0]));
    for (const [pid, cat] of DEMO_PRODUCTS) {
        const pool = catGalleries[cat] || [];
        let imgs = [];
        if (pool.length) {
            imgs = pool[catCursor[cat] % pool.length];
            catCursor[cat]++;
        }
        // fall back to any shots if this product had none
        if (!imgs || !imgs.length) imgs = allShots.slice(0, 4);
        const slots = ["", "b", "c", "d"];
        manifest.products[pid] = slots.map((s, i) => {
            const src = imgs[i] || imgs[i % imgs.length] || allShots[0];
            return queue(src, `products/${pid}${s}.jpg`);
        });
    }

    // category tiles: first gallery image of that category
    for (const cat of Object.keys(CAT_MAP)) {
        const g = catGalleries[cat]?.[0];
        const src = (g && g[0]) || allShots[0];
        manifest.categories[cat] = queue(src, `cat/${cat.toLowerCase()}.jpg`);
    }

    // hero pool: prefer homepage model shots (full res), fill from product shots
    const heroSrcs = [...new Set([...homeShots, ...allShots])].slice(0, 14);
    heroSrcs.forEach((src, i) => manifest.hero.push(queue(src, `hero/hero_${i}.jpg`)));

    // lifestyle pool: broad mix for look/ig/journal/team/collections/etc.
    const poolSrcs = [...new Set([...allShots, ...homeShots])].slice(0, 44);
    poolSrcs.forEach((src, i) => manifest.pool.push(queue(src, `pool/pool_${i}.jpg`)));

    manifest.placeholder = manifest.pool[0] || manifest.hero[0] || "";

    // ---- download everything (dedupe by dest) ----
    console.log(`== Downloading ${new Set(dl.map((d) => d.dest)).size} images ==`);
    const done = new Set();
    let ok = 0;
    for (const { url, dest } of dl) {
        if (done.has(dest)) continue;
        done.add(dest);
        const good = await download(url, dest);
        if (good) ok++;
        await sleep(300);
    }
    console.log(`  downloaded ${ok}/${done.size}`);

    // ---- write manifest (JSON + a JS global usable from file://) ----
    await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
    await writeFile(
        path.join(OUT, "manifest.js"),
        "window.IMAGE_MANIFEST = " + JSON.stringify(manifest) + ";\n",
    );

    // ---- assertions ----
    const sizes = {
        products: Object.keys(manifest.products).length,
        categories: Object.keys(manifest.categories).length,
        hero: manifest.hero.length,
        pool: manifest.pool.length,
    };
    console.log("== Manifest sizes ==", sizes);
    const warn = [];
    if (sizes.products < 24) warn.push("products < 24");
    if (sizes.categories < 6) warn.push("categories < 6");
    if (sizes.hero < 5) warn.push("hero pool < 5");
    if (sizes.pool < 15) warn.push("lifestyle pool < 15 (will look repetitive)");
    if (warn.length) console.warn("!! WARNINGS:", warn.join("; "));
    else console.log("OK — pools healthy.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
