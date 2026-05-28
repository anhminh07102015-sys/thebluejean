/* =====================================================================
   PAGE: SHOP (Product Listing)
   ===================================================================== */
let shopState = {};
Router.add("shop", async (params) => {
    shopState = {
        cat: params.cat || null,
        collection: params.collection || null,
        tag: params.tag || null,
        sizes: [],
        colors: [],
        priceMax: 4000000,
        avail: "all",
        sort: "new",
        shown: 8,
    };
    const wrap = el(
        '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-16"></div>',
    );

    const title =
        shopState.cat ||
        shopState.collection ||
        (shopState.tag === "sale"
            ? "Sale"
            : shopState.tag === "new"
              ? "New Arrivals"
              : "Tất cả sản phẩm");
    wrap.appendChild(
        el(`<div class="mb-8">
    <div class="flex items-center gap-2 text-[11px] text-mute mb-3"><button onclick="Router.go('home')" class="hover:text-ink">Trang chủ</button><span>/</span><span class="text-ink">${title}</span></div>
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div><h1 class="headline text-4xl lg:text-5xl">${title}</h1>
      <p class="text-mute text-sm mt-2" id="shopCount">Đang tải…</p></div>
      <div class="flex items-center gap-3">
        <button onclick="UI.openFilterDrawer()" class="lg:hidden btn btn-ghost px-4 py-2.5 text-[13px]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18M7 12h10M11 18h2"/></svg>Lọc</button>
        <div class="relative">
          <select id="sortSel" onchange="applySort(this.value)" class="surface border hairline rounded-full pl-4 pr-9 py-2.5 text-[13px] font-medium cursor-pointer">
<option value="new">Mới nhất</option><option value="price-asc">Giá: thấp → cao</option>
<option value="price-desc">Giá: cao → thấp</option><option value="rating">Đánh giá cao</option>
          </select>
          <svg class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div></div></div>`),
    );

    wrap.appendChild(
        el(`<div class="grid lg:grid-cols-[240px_1fr] gap-8">
    <aside class="hidden lg:block"><div class="sticky top-24" id="filterPanel"></div></aside>
    <div><div id="grid" class="grid grid-cols-2 sm:grid-cols-3 gap-4"></div>
      <div id="loadMore" class="mt-10 text-center"></div></div>
  </div>`),
    );

    setTimeout(() => {
        renderFilters($("#filterPanel"));
        loadShop();
    }, 30);
    return wrap;
});

function renderFilters(container) {
    if (!container) return;
    container.innerHTML = `
    <div class="space-y-6">
      ${filterGroup("Category", CATS, "cat", "radio")}
      ${filterGroup("Collection", COLLECTIONS, "collection", "radio")}
      ${filterGroup("Kích cỡ", SIZES, "sizes", "chip")}
      <div><p class="kicker text-mute mb-3">Màu sắc</p><div class="flex flex-wrap gap-2">
        ${COLORS.map((c) => `<button data-color="${c.name}" onclick="toggleColor('${c.name}',this)" class="w-8 h-8 rounded-full silver-border transition relative" style="background:${c.hex}" title="${c.name}"></button>`).join("")}</div></div>
      <div><p class="kicker text-mute mb-3">Giá tối đa</p>
        <input type="range" min="400000" max="4000000" step="100000" value="4000000" oninput="setPrice(this.value)" class="w-full accent-blues-500">
        <p class="text-[12px] text-soft mt-2" id="priceLbl">≤ 4.000.000đ</p></div>
      <div><p class="kicker text-mute mb-3">Tình trạng</p>
        <label class="flex items-center gap-2 text-[13px] cursor-pointer"><input type="checkbox" onchange="shopState.avail=this.checked?'instock':'all';loadShop(true)" class="accent-blues-500 w-4 h-4"> Còn hàng</label></div>
      <button onclick="resetFilters()" class="text-[12px] text-blues-500 hover:underline">Xoá bộ lọc</button>
    </div>`;
    // preselect
    if (shopState.cat)
        container
            .querySelector(`[data-f="cat"][data-v="${shopState.cat}"]`)
            ?.classList.add("sel");
    if (shopState.collection)
        container
            .querySelector(`[data-f="collection"][data-v="${shopState.collection}"]`)
            ?.classList.add("sel");
    syncFilterStyles(container);
}
function filterGroup(label, opts, key, type) {
    return `<div><p class="kicker text-mute mb-3">${label}</p><div class="${type === "chip" ? "flex flex-wrap gap-2" : "space-y-1"}">
    ${opts
        .map((o) =>
type === "chip"
    ? `<button data-f="${key}" data-v="${o}" onclick="toggleChip('${key}','${o}',this)" class="ffchip px-3 py-1.5 rounded-lg border hairline text-[12px] transition">${o}</button>`
    : `<button data-f="${key}" data-v="${o}" onclick="setRadio('${key}','${o}',this)" class="ffradio block w-full text-left text-[13px] py-1.5 px-2 rounded-lg transition hover:bg-black/5 dark:hover:bg-white/5">${o}</button>`,
        )
        .join("")}
  </div></div>`;
}
function syncFilterStyles(c = document) {
    c.querySelectorAll(".ffradio.sel").forEach((b) => {
        b.style.color = "var(--blue-2)";
        b.style.fontWeight = "600";
    });
    c.querySelectorAll(".ffchip.sel,.ffradio.sel").forEach((b) => {
        if (b.classList.contains("ffchip")) {
            b.style.background = "var(--ink)";
            b.style.color = "var(--bg)";
            b.style.borderColor = "transparent";
        }
    });
}
const fstyle = document.createElement("style");
fstyle.textContent = `.ffchip.sel{background:var(--ink);color:var(--bg);border-color:transparent} .ffradio.sel{color:var(--blue-2);font-weight:600;background:var(--line)} [data-color].sel{box-shadow:0 0 0 2px var(--surface),0 0 0 4px var(--blue-2)}`;
document.head.appendChild(fstyle);

function setRadio(key, val, btn) {
    const same = shopState[key] === val;
    shopState[key] = same ? null : val;
    document
        .querySelectorAll(`[data-f="${key}"]`)
        .forEach((b) => b.classList.remove("sel"));
    if (!same) btn.classList.add("sel");
    loadShop(true);
}
function toggleChip(key, val, btn) {
    const arr = shopState[key];
    const i = arr.indexOf(val);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(val);
    btn.classList.toggle("sel");
    loadShop(true);
}
function toggleColor(name, btn) {
    const arr = shopState.colors;
    const i = arr.indexOf(name);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(name);
    btn.classList.toggle("sel");
    loadShop(true);
}
function setPrice(v) {
    shopState.priceMax = +v;
    $("#priceLbl").textContent = "≤ " + fmt(+v);
    clearTimeout(window._pt);
    window._pt = setTimeout(() => loadShop(true), 300);
}
function applySort(v) {
    shopState.sort = v;
    loadShop(true);
}
function resetFilters() {
    Router.go("shop");
}

async function loadShop(reset = false) {
    const grid = $("#grid");
    if (!grid) return;
    if (reset) shopState.shown = 8;
    // skeleton
    grid.innerHTML = Array.from({ length: 8 }, () => C.skeletonCard()).join("");
    $("#loadMore").innerHTML = "";
    const list = await API.fetchProducts(shopState);
    shopState._list = list;
    const cnt = $("#shopCount");
    if (cnt) cnt.textContent = `${list.length} sản phẩm`;
    renderGrid();
}
function renderGrid() {
    const grid = $("#grid");
    const list = shopState._list || [];
    const slice = list.slice(0, shopState.shown);
    grid.innerHTML = slice.length
        ? slice.map((p, i) => C.productCard(p, `reveal-d${(i % 4) + 1}`)).join("")
        : `<div class="col-span-full text-center py-20 text-mute"><p class="text-lg">Không có sản phẩm phù hợp.</p><button onclick="resetFilters()" class="btn btn-ghost mt-4 px-5 py-2.5 text-sm">Xoá bộ lọc</button></div>`;
    UI.bindReveal();
    $$(".reveal", grid).forEach((n) => n.classList.add("in"));
    const lm = $("#loadMore");
    if (shopState.shown < list.length) {
        lm.innerHTML = `<button onclick="loadMoreShop()" id="lmBtn" class="btn btn-ghost px-8 py-3 text-sm">Xem thêm (${list.length - shopState.shown})</button>`;
    } else if (list.length > 8) {
        lm.innerHTML = `<p class="text-mute text-[12px]">Đã hiển thị tất cả ${list.length} sản phẩm</p>`;
    } else lm.innerHTML = "";
}
function loadMoreShop() {
    const btn = $("#lmBtn");
    if (btn) {
        btn.innerHTML =
            '<span class="spin" style="border-color:rgba(31,60,136,.3);border-top-color:var(--blue-2)"></span>';
    }
    setTimeout(() => {
        shopState.shown += 8;
        renderGrid();
    }, 600);
}

/* filter drawer (mobile) */
UI.openFilterDrawer = function () {
    const node = this.mount(`<div data-mounted>
    <div class="ovl" onclick="UI.closeOverlay(this.parentElement)"></div>
    <aside data-panel class="fixed top-0 left-0 h-full w-[85%] max-w-[340px] z-[210] surface flex flex-col" style="transform:translateX(-100%);transition:transform .5s var(--ease-out);box-shadow:var(--shadow-lg)">
      <div class="flex items-center justify-between px-6 py-5 border-b hairline"><h3 class="title-exp font-bold text-[15px]">BỘ LỌC</h3>
      <button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-xl">×</button></div>
      <div class="flex-1 overflow-y-auto p-6" id="drawerFilters"></div>
      <div class="border-t hairline p-5"><button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="btn btn-primary w-full py-3 text-sm">Xem kết quả</button></div>
    </aside></div>`);
    renderFilters(node.querySelector("#drawerFilters"));
};

