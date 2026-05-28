const UI = {
    /* ---------- THEME ---------- */
    toggleTheme() {
        const dark = document.documentElement.classList.toggle("dark");
        State.data.theme = dark ? "dark" : "light";
        $("#iconMoon").classList.toggle("hidden", dark);
        $("#iconSun").classList.toggle("hidden", !dark);
        this.toast("Giao diện", `Chuyển sang chế độ ${dark ? "tối" : "sáng"}`, "theme");
    },

    /* ---------- TOAST ---------- */
    toast(title, msg, kind = "info") {
        const icons = {
            info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
             /* Thay đổi icon giỏ hàng trong thông báo Toast */
            cart: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6h18" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10a4 4 0 0 1-8 0" stroke-linecap="round" stroke-linejoin="round"/>',
            heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
            sale: '<path d="M3 12 12 3l9 9-9 9z"/><circle cx="9" cy="9" r="1.4"/>',
            check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4L16 9.5"/>',
            theme: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2"/>',
            crm: '<path d="M4 4h16v12H7l-3 3Z"/>',
        };
        const t =
            el(`<div class="toast card flex items-start gap-3 p-3.5 pr-4 shadow-lg" style="box-shadow:var(--shadow-lg)">
      <div class="shrink-0 w-9 h-9 rounded-xl grad-navy text-white flex items-center justify-center">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${icons[kind] || icons.info}</svg></div>
      <div class="min-w-0 flex-1">
        <div class="text-[12.5px] font-semibold leading-tight">${escapeHtml(title)}</div>
        <div class="text-[11.5px] text-mute mt-0.5 leading-snug">${escapeHtml(msg)}</div>
      </div>
      <button class="text-mute hover:text-ink text-lg leading-none -mt-1" onclick="this.parentElement.remove()">×</button>
    </div>`);
        $("#toastWrap").appendChild(t);
        setTimeout(() => {
            t.style.transition = "all .5s var(--ease)";
            t.style.opacity = 0;
            t.style.transform = "translateX(40px)";
            setTimeout(() => t.remove(), 500);
        }, 4200);
    },

    /* ---------- OVERLAY MOUNT ---------- */
    mount(html) {
        const wrap = $("#overlays");
        const node = el(html);
        wrap.appendChild(node);
        requestAnimationFrame(() => node.querySelector(".ovl")?.classList.add("show"));
        requestAnimationFrame(() =>
            node.querySelector("[data-panel]")?.classList.add("panel-in"),
        );
        return node;
    },
    closeOverlay(node) {
        const ovl = node.querySelector(".ovl");
        ovl?.classList.remove("show");
        const panel = node.querySelector("[data-panel]");
        if (panel) {
            panel.style.transition = "transform .45s var(--ease)";
            panel.classList.remove("panel-in");
        }
        setTimeout(() => node.remove(), 420);
    },

    /* ---------- CART DRAWER ---------- */
    openCart() {
        const items = State.data.cart;
        const sub = cartSubtotal();
        const node = this.mount(`<div>
      <div class="ovl" onclick="UI.closeOverlay(this.parentElement)"></div>
      <aside data-panel class="fixed top-0 right-0 h-full w-full max-w-[440px] z-[210] surface flex flex-col" style="transform:translateX(100%);transition:transform .5s var(--ease-out);box-shadow:var(--shadow-lg)">
        <div class="flex items-center justify-between px-6 py-5 border-b hairline">
          <h3 class="title-exp font-bold text-[15px] tracking-wide">GIỎ HÀNG <span class="text-mute font-sans font-normal">(${cartCount()})</span></h3>
          <button onclick="UI.closeOverlay(this.closest('div[data-mounted],div'))" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full" data-close>×</button>
        </div>
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4" id="cartBody"></div>
        <div class="border-t hairline px-6 py-5 space-y-4" id="cartFoot"></div>
      </aside></div>`);
        node.setAttribute("data-mounted", "");
        node.querySelector("[data-close]").onclick = () => this.closeOverlay(node);
        const render = () => {
            const body = node.querySelector("#cartBody");
            const foot = node.querySelector("#cartFoot");
            const cart = State.data.cart;
            if (!cart.length) {
                body.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-center py-20">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background:var(--line)">
<!-- Thay đổi icon giỏ hàng trống trong Drawer -->
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" class="text-mute" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
          <p class="text-mute text-sm">Giỏ hàng đang trống</p>
          <button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('shop')" class="btn btn-ghost mt-5 px-6 py-2.5 text-sm">Khám phá BST</button></div>`;
                foot.innerHTML = "";
                return;
            }
            body.innerHTML = cart
                .map((it) => {
                    const p = productById(it.pid);
                    return `<div class="flex gap-3.5 anim-float">
          <div class="w-20 h-24 rounded-xl overflow-hidden shrink-0 surface">${fashionSVG(it.pid + it.color, p.palette)}</div>
          <div class="flex-1 min-w-0">
<div class="flex justify-between gap-2"><p class="text-[13px] font-semibold leading-tight clamp-2">${p.name}</p>
<button onclick="Cart.remove('${it.key}')" class="text-mute hover:text-red-500 text-xs shrink-0">✕</button></div>
<p class="text-[11px] text-mute mt-0.5">${it.color} · Size ${it.size}</p>
<div class="flex items-center justify-between mt-2">
  <div class="flex items-center surface rounded-lg border hairline">
    <button class="qbtn" onclick="Cart.qty('${it.key}',-1)">−</button>
    <span class="w-7 text-center text-[12px] font-semibold">${it.qty}</span>
    <button class="qbtn" onclick="Cart.qty('${it.key}',1)">+</button>
  </div>
  <span class="text-[13px] font-semibold">${fmt(it.price * it.qty)}</span>
</div>
          </div></div>`;
                })
                .join("");
            const ship = sub > 1000000 ? 0 : 30000;
            foot.innerHTML = `
        <div class="flex justify-between text-[13px]"><span class="text-mute">Tạm tính</span><span class="font-semibold">${fmt(cartSubtotal())}</span></div>
        <div class="flex justify-between text-[13px]"><span class="text-mute">Vận chuyển</span><span class="font-semibold">${ship === 0 ? "Miễn phí" : fmt(ship)}</span></div>
        <div class="flex justify-between text-[15px] pt-2 border-t hairline"><span class="font-semibold">Tổng cộng</span><span class="font-bold">${fmt(cartSubtotal() + ship)}</span></div>
        <button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('checkout')" class="btn btn-primary w-full py-3.5 text-sm">Thanh toán</button>
        <p class="text-[10.5px] text-mute text-center">Bạn sẽ nhận <b class="text-ink">+${Math.floor((cartSubtotal() / 100000) * 10)} điểm</b> với đơn này</p>`;
        };
        render();
        node._render = render;
    },

    /* ---------- SEARCH OVERLAY ---------- */
    openSearch() {
        const node = this.mount(`<div data-mounted>
      <div class="ovl" onclick="UI.closeOverlay(this.parentElement)"></div>
      <div data-panel class="fixed top-0 inset-x-0 z-[210] glass border-b hairline" style="transform:translateY(-100%);transition:transform .5s var(--ease-out)">
        <div class="max-w-[760px] mx-auto px-5 py-7">
          <div class="flex items-center gap-3 border-b-2 hairline pb-3" style="border-color:var(--blue-2)">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-mute"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
<input id="searchInput" autofocus placeholder="Tìm denim, jacket, BST…" class="flex-1 bg-transparent text-lg font-display outline-none placeholder:text-mute">
<button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-mute text-sm hover:text-ink">ESC</button>
          </div>
          <div class="mt-5 flex flex-wrap gap-2 text-[11px]" id="searchSuggest">
${["Selvedge Jean", "Trucker Jacket", "SS26 Indigo", "Knitwear", "Founder Capsule"].map((s) => `<button onclick="UI.runSearch('${s}')" class="px-3 py-1.5 rounded-full surface border hairline hover:border-blues-500 transition">${s}</button>`).join("")}
          </div>
          <div id="searchResults" class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"></div>
        </div>
      </div></div>`);
        node.querySelector(".panel-in") || node.querySelector("[data-panel]");
        const inp = node.querySelector("#searchInput");
        setTimeout(() => inp.focus(), 300);
        inp.addEventListener("input", () => this.runSearch(inp.value, node));
        this._searchNode = node;
    },
    runSearch(q, node) {
        node = node || this._searchNode;
        if (!node) return;
        const inp = node.querySelector("#searchInput");
        if (inp && inp.value !== q) inp.value = q;
        const res = node.querySelector("#searchResults");
        const ql = q.toLowerCase().trim();
        if (!ql) {
            res.innerHTML = "";
            return;
        }
        const found = PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(ql) ||
                p.cat.toLowerCase().includes(ql) ||
                p.collection.toLowerCase().includes(ql),
        ).slice(0, 8);
        res.innerHTML = found.length
            ? found
                  .map(
                      (
                          p,
                      ) => `<button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('product',{id:'${p.id}'})" class="text-left group anim-float">
      <div class="aspect-[4/5] rounded-lg overflow-hidden surface mb-2 zoom-wrap">${fashionSVG(p.id, p.palette)}</div>
      <p class="text-[11px] font-semibold leading-tight clamp-2">${p.name}</p>
      <p class="text-[11px] text-mute">${fmt(p.price)}</p></button>`,
                  )
                  .join("")
            : `<p class="col-span-full text-center text-mute text-sm py-6">Không tìm thấy kết quả cho "${escapeHtml(q)}"</p>`;
    },

    /* ---------- NOTIFICATION CENTER ---------- */
    openNotif() {
        const list = State.data.notifs;
        const node = this.mount(`<div data-mounted>
      <div class="ovl" onclick="UI.closeOverlay(this.parentElement)"></div>
      <aside data-panel class="fixed top-0 right-0 h-full w-full max-w-[400px] z-[210] surface flex flex-col" style="transform:translateX(100%);transition:transform .5s var(--ease-out);box-shadow:var(--shadow-lg)">
        <div class="flex items-center justify-between px-6 py-5 border-b hairline">
          <h3 class="title-exp font-bold text-[15px] tracking-wide">THÔNG BÁO</h3>
          <button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">×</button>
        </div>
        <div class="flex-1 overflow-y-auto p-5 space-y-3">
          ${
  list.length
      ? list
            .map(
                (n) => `<div class="card p-4 anim-float">
<div class="flex items-start gap-3">
  <span class="w-2 h-2 rounded-full mt-1.5 shrink-0" style="background:${n.read ? "var(--ink-mute)" : "var(--blue-2)"}"></span>
  <div class="flex-1"><p class="text-[12.5px] font-semibold leading-tight">${n.title}</p>
  <p class="text-[11.5px] text-mute mt-1 leading-snug">${n.msg}</p>
  <p class="text-[10px] text-mute mt-1.5">${n.time}</p></div>
</div></div>`,
            )
            .join("")
      : `<div class="text-center text-mute text-sm py-20">Chưa có thông báo</div>`
          }
        </div>
      </aside></div>`);
        State.data.notifs.forEach((n) => (n.read = true));
        Badges.update();
    },

    /* ---------- MOBILE MENU ---------- */
    toggleMobileMenu() {
        if (this._mobOpen) {
            this.closeMobileMenu();
            return;
        }
        const isDark = document.documentElement.classList.contains("dark");
        const mobThemeSvg = isDark
            ? `<circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />`
            : `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />`;
        const node = this.mount(`<div data-mounted data-mobmenu>
      <div class="ovl" onclick="UI.closeMobileMenu()"></div>
      <aside data-panel class="fixed top-0 left-0 h-full w-[82%] max-w-[340px] z-[210] surface flex flex-col" style="transform:translateX(-100%);transition:transform .5s var(--ease-out);box-shadow:var(--shadow-lg)">
        <div class="px-6 py-6 border-b hairline">
          <span class="title-exp font-bold text-[18px] tracking-[.16em]">THE BLUES</span>
          <p class="kicker text-[8px] text-mute mt-1">DENIM · MENSWEAR</p>
        </div>
        <nav class="flex-1 overflow-y-auto py-3">
          ${NAV.map(
  (
      n,
  ) => `<button onclick="UI.closeMobileMenu();Router.go('${n.route}'${n.params ? "," + JSON.stringify(n.params) : ""})" class="w-full text-left px-6 py-3.5 text-[15px] font-medium font-display hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center justify-between">
${n.label}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-mute"><path d="m9 6 6 6-6 6"/></svg></button>`,
          ).join("")}
        </nav>
        <div class="px-6 py-5 border-t hairline space-y-2">
          <button onclick="UI.closeMobileMenu();Router.go('loyalty')" class="btn btn-primary w-full py-3 text-sm">Membership</button>
          <button onclick="UI.toggleTheme()" class="btn btn-ghost w-full py-2.5 text-[13px] flex items-center justify-center gap-2">
<svg id="mobThemeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${mobThemeSvg}</svg>
<span>Giao diện Tối/Sáng</span>
          </button>
        </div>
      </aside></div>`);
        this._mobNode = node;
        this._mobOpen = true; // Cập nhật trạng thái menu di động đang mở
    },
    closeMobileMenu() {
        if (this._mobNode) {
            this.closeOverlay(this._mobNode);
            this._mobNode = null;
        }
        this._mobOpen = false;
    },

    /* ---------- GENERIC MODAL ---------- */
    modal(html, size = "max-w-lg") {
        const node = this.mount(`<div data-mounted>
      <div class="ovl" onclick="UI.closeOverlay(this.parentElement)"></div>
      <div class="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
        <div data-panel class="surface rounded-2xl w-full ${size} max-h-[88vh] overflow-y-auto pointer-events-auto anim-scale" style="box-shadow:var(--shadow-lg)">${html}</div>
      </div></div>`);
        return node;
    },

    /* ---------- AFTER RENDER: reveal + scroll spy + badges ---------- */
    afterRender() {
        Badges.update();
        this.bindReveal();
        this.bindMagnetic();
        this.syncNav();
        this.bindCounters();
    },
    bindReveal() {
        const obs = new IntersectionObserver(
            (ents) => {
                ents.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("in");
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );
        $$(".reveal").forEach((n) => obs.observe(n));
    },
    bindCounters() {
        const fmtN = (n) =>
            n >= 1000
                ? new Intl.NumberFormat("vi-VN").format(Math.round(n))
                : String(Math.round(n));
        const obs = new IntersectionObserver(
            (ents) => {
                ents.forEach((e) => {
                    if (!e.isIntersecting) return;
                    const node = e.target;
                    obs.unobserve(node);
                    const to = parseFloat(String(node.dataset.to).replace(/[.,]/g, ""));
                    if (isNaN(to)) {
                        node.textContent = node.dataset.to;
                        return;
                    }
                    const dur = 1400,
                        t0 = performance.now();
                    const step = (t) => {
                        const k = Math.min(1, (t - t0) / dur);
                        const eased = 1 - Math.pow(1 - k, 3);
                        node.textContent = fmtN(to * eased);
                        if (k < 1) requestAnimationFrame(step);
                        else node.textContent = fmtN(to);
                    };
                    requestAnimationFrame(step);
                });
            },
            { threshold: 0.5 },
        );
        $$(".count").forEach((n) => obs.observe(n));
    },
    bindMagnetic() {
        $$(".magnetic").forEach((b) => {
            b.onmousemove = (e) => {
                const r = b.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                b.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
            };
            b.onmouseleave = () => {
                b.style.transform = "";
            };
        });
    },
    syncNav() {
        const route = typeof currentRouteName === "function" ? currentRouteName() : "home";
        $$("[data-mob]").forEach((b) => {
            const on =
                b.dataset.mob === route ||
                (route === "product" && b.dataset.mob === "shop");
            b.style.color = on ? "var(--blue-2)" : "";
        });
        $$("#megaNav .nav-link").forEach((a) =>
            a.classList.toggle("active", a.dataset.route === route),
        );
    },
};

/* badge updater */
const Badges = {
    update() {
        const c = cartCount(),
            w = wishCount(),
            n = State.data.notifs.filter((x) => !x.read).length;
        $("#cartDot").style.display = c ? "block" : "none";
        $("#wishDot").style.display = w ? "block" : "none";
        $("#notifDot").style.display = n ? "block" : "none";
        // re-render open cart drawer if present
        const cd = $("#overlays [data-mounted] #cartBody");
        if (cd) {
            const mn = cd.closest("[data-mounted]");
            if (mn && mn._render) mn._render();
        }
    },
};
