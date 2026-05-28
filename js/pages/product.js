/* =====================================================================
   PAGE: PRODUCT DETAIL
   ===================================================================== */
Router.add("product", async (params) => {
    const p = productById(params.id) || PRODUCTS[0];
    // track recently viewed
    if (!State.data.recentlyViewed.includes(p.id)) {
        State.data.recentlyViewed.unshift(p.id);
        State.data.recentlyViewed = State.data.recentlyViewed.slice(0, 8);
    }
    let sel = { size: null, color: p.colors[0].name, gallery: 0, qty: 1 };
    const galleryImgs = [p.id, p.id + "b", p.id + "c", p.id + "d"];

    const wrap = el(
        '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-6 pb-16"></div>',
    );
    wrap.appendChild(
        el(`<div class="flex items-center gap-2 text-[11px] text-mute mb-6">
    <button onclick="Router.go('home')" class="hover:text-ink">Trang chủ</button><span>/</span>
    <button onclick="Router.go('shop',{cat:'${p.cat}'})" class="hover:text-ink">${p.cat}</button><span>/</span><span class="text-ink">${p.name}</span></div>`),
    );

    wrap.appendChild(
        el(`<div class="grid lg:grid-cols-[1fr_460px] gap-8 lg:gap-12">
    <!-- GALLERY -->
    <div class="flex gap-3">
      <div class="hidden sm:flex flex-col gap-3 w-20 shrink-0" id="thumbs">
        ${galleryImgs.map((g, i) => `<button onclick="setGallery(${i})" data-thumb="${i}" class="aspect-[4/5] rounded-xl overflow-hidden border-2 transition ${i === 0 ? "border-blues-500" : "border-transparent"}">${fashionSVG(g, i % 2 ? p.colors[1]?.pal || p.palette : p.palette)}</button>`).join("")}
      </div>
      <div class="flex-1">
        <div class="aspect-[4/5] rounded-2xl overflow-hidden surface zoom-wrap relative" id="mainImg" onmousemove="zoomMove(event)" onmouseleave="zoomLeave()">
          ${fashionSVG(galleryImgs[0], p.palette, p.cat.toUpperCase())}
          <span class="badge absolute top-4 left-4" style="${p.tag === "sale" ? "background:#dc2626;color:#fff" : "background:var(--grad-navy);color:#fff"}">${p.tag ? p.tag.toUpperCase() : ""}</span>
        </div>
        <!-- mobile thumbnails -->
        <div class="flex sm:hidden gap-2 mt-3 overflow-x-auto no-scrollbar">
          ${galleryImgs.map((g, i) => `<button onclick="setGallery(${i})" data-thumb-m="${i}" class="w-16 aspect-[4/5] rounded-lg overflow-hidden shrink-0 border-2 ${i === 0 ? "border-blues-500" : "border-transparent"}">${fashionSVG(g, p.palette)}</button>`).join("")}
        </div>
      </div>
    </div>

    <!-- INFO -->
    <div class="lg:sticky lg:top-24 self-start">
      <p class="kicker text-blues-500 mb-2">${p.collection}</p>
      <h1 class="headline text-3xl lg:text-[38px] leading-none">${p.name}</h1>
      <div class="flex items-center gap-3 mt-3 text-[13px]">
        <span class="text-amber-500">★★★★★</span><span class="text-soft">${p.rating}</span>
        <button onclick="document.getElementById('reviews').scrollIntoView({behavior:'smooth'})" class="text-mute hover:text-ink underline">${p.reviews} đánh giá</button>
      </div>
      <div class="text-2xl font-bold mt-4">${p.oldPrice ? `<span class="text-red-600">${fmt(p.price)}</span> <span class="text-base text-mute line-through font-normal ml-1">${fmt(p.oldPrice)}</span> <span class="badge ml-1" style="background:#dc2626;color:#fff">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : fmt(p.price)}</div>
      <p class="text-[12px] text-mute mt-1">Hoặc 3 × ${fmt(p.price / 3)} không lãi suất</p>

      <div class="divider-grad my-6"></div>

      <!-- color -->
      <div><div class="flex items-center justify-between mb-3"><p class="text-[12px] font-semibold uppercase tracking-wider text-mute">Màu</p><span class="text-[12px] text-soft" id="colorLbl">${p.colors[0].name}</span></div>
        <div class="flex gap-2.5" id="pdpColors">${p.colors.map((c, i) => `<button data-c="${c.name}" onclick="setColor('${c.name}','${c.pal}',this)" class="w-10 h-10 rounded-full silver-border transition ${i === 0 ? "ring-2 ring-blues-500 ring-offset-2 ring-offset-transparent" : ""}" style="background:${c.hex}" title="${c.name}"></button>`).join("")}</div></div>

      <!-- size -->
      <div class="mt-6"><div class="flex items-center justify-between mb-3"><p class="text-[12px] font-semibold uppercase tracking-wider text-mute">Kích cỡ</p>
        <button onclick="UI.sizeGuide()" class="text-[12px] text-blues-500 hover:underline flex items-center gap-1"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7h18v10H3z"/><path d="M8 7v4M13 7v6M18 7v4"/></svg>Hướng dẫn size</button></div>
        <div class="grid grid-cols-5 gap-2" id="pdpSizes">${p.sizes.map((s) => `<button data-s="${s}" onclick="setSize('${s}',this)" class="h-11 rounded-lg border hairline text-[13px] font-semibold transition hover:border-blues-500">${s}</button>`).join("")}</div>
        <p class="text-[11px] mt-2" id="sizeWarn"></p></div>

      <!-- stock + qty -->
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center surface border hairline rounded-xl"><button class="qbtn" onclick="setQty(-1)">−</button><span id="qtyVal" class="w-9 text-center text-sm font-semibold">1</span><button class="qbtn" onclick="setQty(1)">+</button></div>
        <p class="text-[12px] ${p.stock < 8 ? "text-amber-600" : "text-emerald-600"} flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full ${p.stock < 8 ? "bg-amber-500" : "bg-emerald-500"}"></span>${p.stock < 8 ? `Chỉ còn ${p.stock} sản phẩm` : "Còn hàng"}</p>
      </div>

      <!-- CTAs -->
      <div class="flex gap-2.5 mt-5">
        <button id="pdpAdd" onclick="pdpAddToCart('${p.id}')" class="btn btn-primary flex-1 py-4 text-[14px]">Thêm vào giỏ</button>
        <button data-wish="${p.id}" onclick="Wishlist.toggle('${p.id}')" class="wishbtn ${Wishlist.has(p.id) ? "is-wished" : ""} btn btn-ghost w-14 py-4"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
      </div>
      <button onclick="pdpBuyNow('${p.id}')" class="btn btn-light w-full py-4 text-[14px] mt-2.5">Mua ngay</button>

      <!-- info accordions -->
      <div class="mt-7 divide-y hairline border-y hairline">
        ${accordion("Chất liệu & vải", `<p class="text-[13px] text-soft leading-relaxed">${p.material}</p><p class="text-[13px] text-soft leading-relaxed mt-2">${p.fabric}</p>`)}
        ${accordion("Vận chuyển & đổi trả", `<p class="text-[13px] text-soft leading-relaxed">Free express ship cho đơn từ 1.000.000đ. Giao 2–4 ngày. Đổi trả miễn phí trong 30 ngày.</p>`)}
        ${accordion("Bảo hành & sửa chữa", `<p class="text-[13px] text-soft leading-relaxed">Bảo hành đường may 12 tháng. Membership được sửa chữa trọn đời miễn phí.</p>`)}
        ${accordion("Sản xuất", `<p class="text-[13px] text-soft leading-relaxed">${p.origin}. ${p.care}</p>`)}
      </div>
    </div>
  </div>`),
    );

    // related + recently viewed + reviews
    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(
        0,
        4,
    );
    wrap.appendChild(
        el(`<section id="reviews" class="mt-20">
    <div class="grid lg:grid-cols-[300px_1fr] gap-10">
      <div><h2 class="headline text-3xl mb-5">Đánh giá</h2>
        <div class="flex items-end gap-3"><span class="text-5xl font-display">${p.rating}</span><div class="pb-1"><div class="text-amber-500 text-sm">★★★★★</div><p class="text-mute text-[12px] mt-1">${p.reviews} đánh giá</p></div></div>
        <div class="mt-5 space-y-1.5">${[5, 4, 3, 2, 1]
.map((s) => {
    const pct = s === 5 ? 68 : s === 4 ? 22 : s === 3 ? 7 : s === 2 ? 2 : 1;
    return `<div class="flex items-center gap-2 text-[11px]"><span class="w-3 text-mute">${s}</span><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" class="text-amber-400"><path d="m12 2 3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg><div class="flex-1 prog-track"><div class="prog-fill" style="width:${pct}%"></div></div><span class="w-8 text-right text-mute">${pct}%</span></div>`;
})
.join("")}</div>
      </div>
      <div class="space-y-4">${REVIEWS[p.id].map((r) => `<div class="card p-5"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full grad-navy text-white flex items-center justify-center text-[12px] font-bold">${r.name[0]}</div><div><p class="text-[13px] font-semibold">${r.name}</p>${r.verified ? '<p class="text-[10px] text-emerald-600 flex items-center gap-1">✓ Đã mua hàng</p>' : ""}</div></div><span class="text-[11px] text-mute">${r.date}</span></div><div class="text-amber-500 text-[12px] mt-3">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div><p class="text-[13px] font-semibold mt-2">${r.title}</p><p class="text-[13px] text-soft mt-1 leading-relaxed">${r.body}</p></div>`).join("")}</div>
    </div></section>`),
    );

    wrap.appendChild(
        el(
            `<section class="mt-20"><h2 class="headline text-3xl mb-7">Có thể bạn thích</h2><div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${related.map((rp) => C.productCard(rp)).join("")}</div></section>`,
        ),
    );

    const rv = State.data.recentlyViewed
        .filter((id) => id !== p.id)
        .slice(0, 4)
        .map(productById);
    if (rv.length)
        wrap.appendChild(
            el(
                `<section class="mt-16"><h2 class="headline text-3xl mb-7">Vừa xem gần đây</h2><div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${rv.map((rp) => C.productCard(rp)).join("")}</div></section>`,
            ),
        );

    /* sticky mobile purchase bar */
    wrap.appendChild(
        el(`<div class="lg:hidden fixed bottom-[57px] inset-x-0 z-[100] glass border-t hairline p-3 flex items-center gap-3" style="box-shadow:0 -8px 24px -12px rgba(13,24,64,.2)">
    <div class="flex-1 min-w-0"><p class="text-[11px] text-mute truncate">${p.name}</p><p class="text-[15px] font-bold">${fmt(p.price)}</p></div>
    <button onclick="pdpAddToCart('${p.id}')" class="btn btn-primary px-6 py-3 text-[13px]">Thêm vào giỏ</button>
  </div>`),
    );

    // expose handlers in closure
    window.setGallery = (i) => {
        sel.gallery = i;
        $("#mainImg").innerHTML =
            fashionSVG(galleryImgs[i], p.palette, p.cat.toUpperCase()) +
            `<span class="badge absolute top-4 left-4" style="${p.tag === "sale" ? "background:#dc2626;color:#fff" : "background:var(--grad-navy);color:#fff"}">${p.tag ? p.tag.toUpperCase() : ""}</span>`;
        $("#mainImg").onmousemove = zoomMove;
        $("#mainImg").onmouseleave = zoomLeave;
        $$("[data-thumb]").forEach((t, j) =>
            t.classList.toggle("border-blues-500", j === i),
        );
        $$("[data-thumb-m]").forEach((t, j) =>
            t.classList.toggle("border-blues-500", j === i),
        );
    };
    window.setColor = (name, pal, btn) => {
        sel.color = name;
        $("#colorLbl").textContent = name;
        $$("#pdpColors [data-c]").forEach((b) =>
            b.classList.remove("ring-2", "ring-blues-500", "ring-offset-2"),
        );
        btn.classList.add("ring-2", "ring-blues-500", "ring-offset-2");
        $("#mainImg").firstChild &&
            ($("#mainImg").innerHTML =
                fashionSVG(galleryImgs[sel.gallery] + name, pal, p.cat.toUpperCase()) +
                `<span class="badge absolute top-4 left-4" style="background:var(--grad-navy);color:#fff">${p.tag ? p.tag.toUpperCase() : ""}</span>`);
    };
    window.setSize = (s, btn) => {
        sel.size = s;
        $$("#pdpSizes [data-s]").forEach((b) => {
            b.style.background = "";
            b.style.color = "";
            b.style.borderColor = "";
        });
        btn.style.background = "var(--ink)";
        btn.style.color = "var(--bg)";
        btn.style.borderColor = "transparent";
        $("#sizeWarn").textContent = "";
    };
    window.setQty = (d) => {
        sel.qty = clamp(sel.qty + d, 1, 10);
        $("#qtyVal").textContent = sel.qty;
    };
    window.zoomMove = (e) => {
        const w = $("#mainImg");
        const target = w.querySelector("img, svg");
        if (!target) return;
        const r = w.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        target.style.transformOrigin = `${x}% ${y}%`;
        target.style.transform = "scale(1.8)";
    };
    window.zoomLeave = () => {
        const target = $("#mainImg")?.querySelector("img, svg");
        if (target) target.style.transform = "";
    };
    window.pdpAddToCart = (id) => {
        if (!sel.size) {
            $("#sizeWarn").innerHTML =
                '<span class="text-amber-600">Vui lòng chọn kích cỡ</span>';
            document
                .getElementById("pdpSizes")
                .animate(
                    [
                        { transform: "translateX(0)" },
                        { transform: "translateX(-6px)" },
                        { transform: "translateX(6px)" },
                        { transform: "translateX(0)" },
                    ],
                    { duration: 300 },
                );
            return;
        }
        Cart.add(id, { size: sel.size, color: sel.color, qty: sel.qty });
    };
    window.pdpBuyNow = (id) => {
        if (!sel.size) {
            $("#sizeWarn").innerHTML =
                '<span class="text-amber-600">Vui lòng chọn kích cỡ</span>';
            return;
        }
        Cart.add(id, { size: sel.size, color: sel.color, qty: sel.qty });
        Router.go("checkout");
    };

    return wrap;
});
