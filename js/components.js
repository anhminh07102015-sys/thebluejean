/* =====================================================================
   REUSABLE COMPONENTS
   ===================================================================== */
const C = {
    badgeFor(tag) {
        if (!tag) return "";
        const map = {
            new: ["NEW", "background:var(--grad-navy);color:#fff"],
            sale: ["SALE", "background:#dc2626;color:#fff"],
            best: ["BEST SELLER", "background:var(--ink);color:var(--bg)"],
        };
        const [t, s] = map[tag] || ["", ""];
        return `<span class="badge" style="${s}">${t}</span>`;
    },
    /* product card */
    productCard(p, extra = "") {
        const wished = Wishlist.has(p.id);
        return `<article class="pcard group card card-hover overflow-hidden reveal ${extra}">
      <div class="relative">
        <div class="pimg aspect-[4/5] cursor-pointer" onclick="Router.go('product',{id:'${p.id}'})">
          <div class="ph main">${fashionSVG(p.id, p.palette, p.cat.toUpperCase())}</div>
          <div class="ph alt">${fashionSVG(p.id + "b", p.colors[1]?.pal || p.palette)}</div>
        </div>
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">${this.badgeFor(p.tag)}</div>
        <button data-wish="${p.id}" onclick="event.stopPropagation();Wishlist.toggle('${p.id}')" class="wishbtn ${wished ? "is-wished" : ""} absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition hover:scale-110">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
        <div class="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button onclick="event.stopPropagation();UI.quickView('${p.id}')" class="btn glass w-full py-2.5 text-[12px] font-semibold backdrop-blur">Quick View</button>
        </div>
      </div>
      <div class="p-3.5">
        <p class="kicker text-[8.5px] text-mute mb-1">${p.collection}</p>
        <h3 class="text-[13px] font-semibold leading-tight clamp-2 cursor-pointer hover:text-blues-500 transition" onclick="Router.go('product',{id:'${p.id}'})">${p.name}</h3>
        <div class="flex items-center gap-2 mt-2">
          ${p.oldPrice ? `<span class="text-[13px] font-bold text-red-600">${fmt(p.price)}</span><span class="text-[11px] text-mute line-through">${fmt(p.oldPrice)}</span>` : `<span class="text-[13px] font-bold">${fmt(p.price)}</span>`}
        </div>
        <div class="flex items-center gap-1 mt-2">
          ${p.colors.map((c) => `<span class="w-3.5 h-3.5 rounded-full silver-border" style="background:${c.hex}"></span>`).join("")}
          <span class="ml-auto text-[10px] text-mute flex items-center gap-0.5">★ ${p.rating}</span>
        </div>
      </div>
    </article>`;
    },
    skeletonCard() {
        return `<div class="card overflow-hidden"><div class="skel aspect-[4/5]"></div><div class="p-3.5 space-y-2"><div class="skel h-2.5 w-1/3"></div><div class="skel h-3 w-4/5"></div><div class="skel h-3 w-1/4"></div></div></div>`;
    },
    sectionHead(kicker, title, sub, cta) {
        return `<div class="flex items-end justify-between gap-6 mb-8 reveal">
      <div><p class="kicker text-blues-500 mb-3">${kicker}</p>
      <h2 class="headline text-3xl sm:text-4xl lg:text-[44px]">${title}</h2>
      ${sub ? `<p class="text-mute text-sm mt-3 max-w-md">${sub}</p>` : ""}</div>
      ${cta ? `<button onclick="${cta.action}" class="hidden sm:inline-flex btn btn-ghost px-5 py-2.5 text-[13px] shrink-0">${cta.label}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>` : ""}
    </div>`;
    },
    carousel(id, cards) {
        return `<div class="relative reveal">
      <div id="${id}" class="flex gap-4 overflow-x-auto no-scrollbar snap-x scroll-smooth pb-2 -mx-1 px-1">${cards}</div>
      <button onclick="document.getElementById('${id}').scrollBy({left:-340,behavior:'smooth'})" class="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass items-center justify-center hover:scale-110 transition z-10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 6-6 6 6 6"/></svg></button>
      <button onclick="document.getElementById('${id}').scrollBy({left:340,behavior:'smooth'})" class="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass items-center justify-center hover:scale-110 transition z-10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg></button>
    </div>`;
    },
};

/* quick view modal */
UI.quickView = function (pid) {
    const p = productById(pid);
    let size = p.sizes[0],
        color = p.colors[0].name;
    const node = this.modal(
        `<div class="grid sm:grid-cols-2">
    <div class="aspect-square sm:aspect-auto sm:h-full surface">${fashionSVG(p.id, p.palette, p.cat.toUpperCase())}</div>
    <div class="p-6 sm:p-7">
      <div class="flex items-start justify-between"><p class="kicker text-blues-500">${p.collection}</p>
      <button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-mute hover:text-ink text-xl leading-none">×</button></div>
      <h3 class="headline text-2xl mt-2">${p.name}</h3>
      <div class="flex items-center gap-2 mt-2 text-sm"><span class="text-amber-500">★</span> ${p.rating}<span class="text-mute">· ${p.reviews} đánh giá</span></div>
      <div class="text-xl font-bold mt-3">${p.oldPrice ? `<span class="text-red-600">${fmt(p.price)}</span> <span class="text-sm text-mute line-through font-normal">${fmt(p.oldPrice)}</span>` : fmt(p.price)}</div>
      <p class="text-[13px] text-soft mt-4 leading-relaxed">${p.desc}</p>
      <div class="mt-5"><p class="text-[11px] font-semibold mb-2 text-mute uppercase tracking-wider">Màu sắc</p>
        <div class="flex gap-2" id="qvColors">${p.colors.map((c, i) => `<button data-c="${c.name}" class="qvc w-9 h-9 rounded-full silver-border transition ${i === 0 ? "ring-2 ring-blues-500 ring-offset-2 ring-offset-transparent" : ""}" style="background:${c.hex}" title="${c.name}"></button>`).join("")}</div></div>
      <div class="mt-4"><p class="text-[11px] font-semibold mb-2 text-mute uppercase tracking-wider">Kích cỡ</p>
        <div class="flex flex-wrap gap-2" id="qvSizes">${p.sizes.map((s, i) => `<button data-s="${s}" class="qvs w-11 h-10 rounded-lg border hairline text-[12px] font-semibold transition ${i === 0 ? "bg-ink text-bg" : "hover:border-blues-500"}" style="${i === 0 ? "background:var(--ink);color:var(--bg)" : ""}">${s}</button>`).join("")}</div></div>
      <div class="flex gap-2.5 mt-6">
        <button id="qvAdd" class="btn btn-primary flex-1 py-3.5 text-sm">Thêm vào giỏ</button>
        <button onclick="Wishlist.toggle('${p.id}')" data-wish="${p.id}" class="wishbtn ${Wishlist.has(p.id) ? "is-wished" : ""} btn btn-ghost w-12 py-3.5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
      </div>
      <button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('product',{id:'${p.id}'})" class="text-[12px] text-blues-500 mt-3 hover:underline">Xem chi tiết đầy đủ →</button>
    </div></div>`,
        "max-w-3xl",
    );
    node.querySelectorAll(".qvc").forEach(
        (b) =>
            (b.onclick = () => {
                color = b.dataset.c;
                node.querySelectorAll(".qvc").forEach((x) =>
                    x.classList.remove("ring-2", "ring-blues-500", "ring-offset-2"),
                );
                b.classList.add("ring-2", "ring-blues-500", "ring-offset-2");
            }),
    );
    node.querySelectorAll(".qvs").forEach(
        (b) =>
            (b.onclick = () => {
                size = b.dataset.s;
                node.querySelectorAll(".qvs").forEach((x) => {
                    x.style.background = "";
                    x.style.color = "";
                });
                b.style.background = "var(--ink)";
                b.style.color = "var(--bg)";
            }),
    );
    node.querySelector("#qvAdd").onclick = () => {
        Cart.add(pid, { size, color });
        UI.closeOverlay(node);
    };
};

/* wishlist filled style */
const wstyle = document.createElement("style");
wstyle.textContent = `.wishbtn.is-wished svg{fill:#dc2626;stroke:#dc2626} .wishbtn.is-wished{color:#dc2626}`;
document.head.appendChild(wstyle);
function accordion(title, body) {
    const id = "acc" + uid();
    return `<div><button onclick="toggleAcc('${id}',this)" class="w-full flex items-center justify-between py-4 text-left"><span class="text-[13px] font-semibold">${title}</span><svg class="acc-arrow transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg></button><div id="${id}" class="acc-body"><div class="pb-4">${body}</div></div></div>`;
}
function toggleAcc(id, btn) {
    const b = $("#" + id);
    const open = b.style.maxHeight && b.style.maxHeight !== "0px";
    b.style.maxHeight = open ? "0px" : b.scrollHeight + "px";
    btn.querySelector(".acc-arrow").style.transform = open ? "" : "rotate(45deg)";
}

/* size guide modal */
UI.sizeGuide = function () {
    this.modal(
        `<div class="p-7"><div class="flex items-start justify-between"><h3 class="headline text-2xl">Hướng dẫn chọn size</h3><button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-xl text-mute">×</button></div>
    <p class="text-[13px] text-soft mt-2 mb-5">Số đo tính bằng cm. Nếu ở giữa hai size, chọn size lớn hơn cho phom rộng.</p>
    <div class="overflow-x-auto"><table class="w-full text-[13px]"><thead><tr class="text-left text-mute border-b hairline"><th class="py-2.5 font-semibold">Size</th><th class="font-semibold">Ngực</th><th class="font-semibold">Eo</th><th class="font-semibold">Dài</th></tr></thead><tbody>
    ${[
        ["XS", 92, 76, 68],
        ["S", 96, 80, 70],
        ["M", 100, 84, 72],
        ["L", 106, 90, 74],
        ["XL", 112, 96, 76],
        ["XXL", 118, 102, 78],
    ]
        .map(
(r) =>
    `<tr class="border-b hairline"><td class="py-2.5 font-semibold">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`,
        )
        .join("")}
    </tbody></table></div></div>`,
        "max-w-md",
    );
};
