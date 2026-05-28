/* =====================================================================
   BUSINESS LOGIC  — Cart / Wishlist / Loyalty / CRM triggers
   ===================================================================== */
const Cart = {
    add(pid, { size, color, qty = 1 } = {}) {
        const p = productById(pid);
        size = size || p.sizes[0];
        color = color || p.colors[0].name;
        const key = `${pid}|${size}|${color}`;
        const ex = State.data.cart.find((c) => c.key === key);
        if (ex) ex.qty += qty;
        else State.data.cart.push({ key, pid, size, color, qty, price: p.price });
        State.emit();
        Badges.update();
        UI.toast("Đã thêm vào giỏ", `${p.name} · ${color} · ${size}`, "cart");
        CRM.fire("add_to_cart", { pid });
    },
    qty(key, d) {
        const it = State.data.cart.find((c) => c.key === key);
        if (!it) return;
        it.qty = clamp(it.qty + d, 1, 20);
        State.emit();
        Badges.update();
        if ($("#app [data-cartpage]")) Router.go("checkout");
    },
    remove(key) {
        State.data.cart = State.data.cart.filter((c) => c.key !== key);
        State.emit();
        Badges.update();
        if ($("#app [data-cartpage]")) Router.go("checkout");
    },
    clear() {
        State.data.cart = [];
        State.emit();
        Badges.update();
    },
};

const Wishlist = {
    toggle(pid) {
        const i = State.data.wishlist.indexOf(pid);
        const p = productById(pid);
        if (i >= 0) {
            State.data.wishlist.splice(i, 1);
            UI.toast("Đã xoá khỏi wishlist", p.name, "heart");
        } else {
            State.data.wishlist.push(pid);
            UI.toast("Đã lưu wishlist", p.name, "heart");
            Loyalty.maybeWishSaleAlert(pid);
        }
        State.emit();
        Badges.update();
        $$(`[data-wish="${pid}"]`).forEach((b) =>
            b.classList.toggle("is-wished", State.data.wishlist.includes(pid)),
        );
        if (typeof currentRouteName === "function" && currentRouteName() === "wishlist")
            Router.go("wishlist");
    },
    has(pid) {
        return State.data.wishlist.includes(pid);
    },
    saveLater(pid) {
        if (!State.data.saveForLater.includes(pid)) State.data.saveForLater.push(pid);
        State.emit();
        UI.toast("Đã lưu để xem sau", "", "heart");
    },
};

const Loyalty = {
    earn(pts, reason) {
        State.data.points += pts;
        State.data.pointHistory.unshift({
            t: reason,
            pts: +pts,
            date: new Date().toLocaleDateString("vi-VN"),
        });
        const before = tierFor(State.data.points - pts),
            after = tierFor(State.data.points);
        State.emit();
        UI.toast("Tích điểm", `+${pts} điểm · ${reason}`, "check");
        if (before.key !== after.key) {
            this.tierUpgrade(after);
        }
    },
    tierUpgrade(tier) {
        Notif.push(
            "Thăng hạng thành viên",
            `Chúc mừng! Bạn đã đạt hạng ${tier.name}.`,
            "sale",
        );
        CRM.fire("tier_upgrade", { tier: tier.key });
        setTimeout(
            () => UI.toast("🎉 Thăng hạng", `Bạn vừa đạt hạng ${tier.name}`, "sale"),
            600,
        );
    },
    // points redeemable on an order (100 pts = 50.000đ, max 20% order)
    redeemValue(orderTotal) {
        const maxByPts = Math.floor(State.data.points / 100) * 50000;
        const maxByOrder = Math.floor(orderTotal * 0.2);
        return Math.min(maxByPts, maxByOrder);
    },
    maybeWishSaleAlert(pid) {
        // simulate: 45% chance the wished item is/will be on sale -> push notif shortly
        const p = productById(pid);
        if (Math.random() < 0.5) {
            setTimeout(() => {
                Notif.push(
                    "🔥 Sale alert",
                    `${p.name} trong wishlist của bạn vừa giảm giá!`,
                    "sale",
                );
                UI.toast("Wishlist · Sale alert", `${p.name} đang giảm giá`, "sale");
            }, 2600);
        } else if (p.stock < 8) {
            setTimeout(() => {
                Notif.push(
                    "⚠️ Sắp hết hàng",
                    `${p.name} chỉ còn ${p.stock} sản phẩm.`,
                    "info",
                );
            }, 3200);
        }
    },
};

const Notif = {
    push(title, msg, kind = "info") {
        State.data.notifs.unshift({
            id: uid(),
            title,
            msg,
            kind,
            read: false,
            time: "Vừa xong",
        });
        State.emit();
        Badges.update();
    },
};

/* =====================================================================
   CRM AUTOMATION ENGINE  — event-driven trigger log
   ===================================================================== */
const CRM = {
    log: [],
    flows: {
        add_to_cart: {
            name: "Abandoned cart recovery",
            email: "“Bạn còn quên gì đó…” + 5% off",
        },
        checkout: {
            name: "Order confirmation + review reminder",
            email: "Cảm ơn đơn hàng · nhắc đánh giá sau 7 ngày",
        },
        tier_upgrade: {
            name: "Tier upgrade celebration",
            email: "Chúc mừng thăng hạng · unlock benefits",
        },
        wishlist: {
            name: "Wishlist price-drop alert",
            email: "Sản phẩm bạn thích vừa giảm giá",
        },
        register: {
            name: "Welcome onboarding flow",
            email: "Welcome series · 3 emails",
        },
        birthday: {
            name: "Birthday campaign",
            email: "+50 điểm sinh nhật · voucher đặc biệt",
        },
    },
    fire(event, data = {}) {
        const f = this.flows[event];
        if (!f) return;
        this.log.unshift({
            event,
            name: f.name,
            email: f.email,
            time: new Date().toLocaleTimeString("vi-VN"),
            data,
        });
        // reflect in CRM page if open
        if (typeof currentRouteName === "function" && currentRouteName() === "crm") {
            const feed = $("#crmFeed");
            if (feed) this._renderFeed(feed);
        }
    },
    _renderFeed(feed) {
        feed.innerHTML =
            this.log
                .slice(0, 8)
                .map(
                    (l) => `<div class="flex items-start gap-3 anim-float">
      <div class="w-8 h-8 rounded-lg grad-navy text-white flex items-center justify-center shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h16v12H7l-3 3Z"/></svg></div>
      <div class="flex-1 min-w-0"><p class="text-[12px] font-semibold">${l.name}</p><p class="text-[11px] text-mute">${l.email}</p>
      <p class="text-[10px] text-mute mt-0.5 font-mono">trigger: ${l.event} · ${l.time}</p></div></div>`,
                )
                .join("") ||
            `<p class="text-mute text-sm text-center py-8">Chưa có automation nào được kích hoạt. Hãy thử Add to cart / Wishlist / Checkout.</p>`;
    },
};
