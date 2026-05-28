/* =====================================================================
   PAGE: WISHLIST
   ===================================================================== */
Router.add("wishlist", async () => {
    const wrap = el(
        '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-16"></div>',
    );
    const items = State.data.wishlist.map(productById);
    const saved = State.data.saveForLater.map(productById);
    wrap.appendChild(
        el(`<div class="flex items-center justify-between mb-2"><h1 class="headline text-4xl lg:text-5xl">Wishlist</h1>
    <span class="text-mute text-sm">${items.length} sản phẩm</span></div>
    <p class="text-mute text-sm mb-8">Chúng tôi sẽ báo bạn khi sản phẩm giảm giá hoặc sắp hết hàng.</p>`),
    );

    if (!items.length) {
        wrap.appendChild(
            el(
                `<div class="text-center py-24"><div class="w-16 h-16 rounded-2xl grid place-items-center mx-auto mb-4" style="background:var(--line)"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" class="text-mute"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div><p class="text-mute mb-5">Wishlist của bạn đang trống</p><button onclick="Router.go('shop')" class="btn btn-primary px-7 py-3 text-sm">Khám phá BST</button></div>`,
            ),
        );
    } else {
        // activity log
        wrap.appendChild(
            el(`<div class="card p-5 mb-8"><div class="flex items-center gap-2 mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="text-blues-500"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><p class="title-exp font-bold text-[13px]">WISHLIST ACTIVITY</p></div>
      <div class="space-y-2 text-[12.5px]">${items
          .slice(0, 3)
          .map(
  (p, i) =>
      `<div class="flex items-center justify-between"><span class="text-soft">${p.name}</span>${i === 0 && p.oldPrice ? `<span class="badge" style="background:#dc2626;color:#fff">VỪA GIẢM GIÁ</span>` : p.stock < 8 ? `<span class="badge" style="background:#d97706;color:#fff">SẮP HẾT · ${p.stock}</span>` : `<span class="text-mute text-[11px]">đang theo dõi giá</span>`}</div>`,
          )
          .join("")}</div></div>`),
        );
        wrap.appendChild(
            el(
                `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">${items
                    .map((p) => {
                        return `<article class="card card-hover overflow-hidden group reveal">
        <div class="relative"><div class="pimg aspect-[4/5] cursor-pointer" onclick="Router.go('product',{id:'${p.id}'})">${fashionSVG(p.id, p.palette, p.cat.toUpperCase())}</div>
        ${C.badgeFor(p.tag) ? `<div class="absolute top-3 left-3">${C.badgeFor(p.tag)}</div>` : ""}
        <button onclick="Wishlist.toggle('${p.id}')" class="absolute top-3 right-3 w-9 h-9 rounded-full glass grid place-items-center hover:scale-110 transition text-red-500"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button></div>
        <div class="p-3.5"><h3 class="text-[13px] font-semibold clamp-2 leading-tight">${p.name}</h3>
        <p class="text-[13px] font-bold mt-1.5">${p.oldPrice ? `<span class="text-red-600">${fmt(p.price)}</span>` : fmt(p.price)}</p>
        <div class="flex gap-2 mt-3"><button onclick="Cart.add('${p.id}')" class="btn btn-primary flex-1 py-2 text-[11px]">Thêm giỏ</button><button onclick="Wishlist.saveLater('${p.id}');Wishlist.toggle('${p.id}')" class="btn btn-ghost px-3 py-2 text-[11px]">Lưu sau</button></div></div>
      </article>`;
                    })
                    .join("")}</div>`,
            ),
        );
    }
    if (saved.length) {
        wrap.appendChild(
            el(
                `<section class="mt-14"><h2 class="headline text-2xl mb-5">Lưu để xem sau</h2><div class="grid grid-cols-2 sm:grid-cols-4 gap-4">${saved.map((p) => C.productCard(p)).join("")}</div></section>`,
            ),
        );
    }
    return wrap;
});

