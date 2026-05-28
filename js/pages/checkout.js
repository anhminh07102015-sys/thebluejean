/* =====================================================================
   PAGE: CHECKOUT (multi-step, guest, sticky summary)
   ===================================================================== */
let coStep = 1;
Router.add("checkout", async () => {
    coStep = 1;
    if (!State.data.cart.length) {
        const e =
            el(`<div class="max-w-md mx-auto px-5 py-32 text-center" data-cartpage>
      <h1 class="headline text-3xl mb-3">Giỏ hàng trống</h1><p class="text-mute mb-6">Hãy thêm vài món bạn yêu thích.</p>
      <button onclick="Router.go('shop')" class="btn btn-primary px-7 py-3 text-sm">Khám phá BST</button></div>`);
        return e;
    }
    const wrap = el(
        '<div class="max-w-[1100px] mx-auto px-5 sm:px-8 pt-8 pb-16" data-cartpage></div>',
    );
    wrap.appendChild(
        el(`<div class="flex items-center justify-between mb-8">
    <h1 class="headline text-3xl lg:text-4xl">Thanh toán</h1>
    <button onclick="Router.go('shop')" class="text-[13px] text-mute hover:text-ink flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 19-7-7 7-7M5 12h14"/></svg>Tiếp tục mua sắm</button></div>`),
    );

    // step indicator
    wrap.appendChild(
        el(`<div class="flex items-center gap-2 mb-8" id="coSteps">
    ${["Thông tin", "Vận chuyển", "Thanh toán"].map((s, i) => `<div class="flex items-center gap-2 flex-1"><div class="step-dot w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold ${i === 0 ? "text-white" : "text-mute"}" data-step="${i + 1}" style="${i === 0 ? "background:var(--grad-navy)" : "background:var(--line)"}">${i + 1}</div><span class="text-[12px] font-medium hidden sm:block ${i === 0 ? "" : "text-mute"}" data-steplbl="${i + 1}">${s}</span>${i < 2 ? '<div class="flex-1 h-px hairline border-t"></div>' : ""}</div>`).join("")}
  </div>`),
    );

    wrap.appendChild(
        el(`<div class="grid lg:grid-cols-[1fr_380px] gap-8">
    <div id="coForm"></div>
    <aside class="lg:sticky lg:top-24 self-start"><div id="coSummary"></div></aside>
  </div>`),
    );

    setTimeout(() => {
        renderCoStep();
        renderCoSummary();
    }, 30);
    return wrap;
});

function renderCoStep() {
    const f = $("#coForm");
    if (!f) return;
    const field = (id, label, ph, type = "text") =>
        `<div><label class="text-[12px] font-semibold text-mute block mb-1.5">${label}</label><input id="${id}" type="${type}" placeholder="${ph}" class="w-full surface border hairline rounded-xl px-4 py-3 text-[14px]"></div>`;
    if (coStep === 1) {
        f.innerHTML = `<div class="card p-6 anim-float">
      <div class="flex items-center justify-between mb-5"><h2 class="title-exp font-bold text-[15px]">THÔNG TIN LIÊN HỆ</h2>
        <span class="text-[11px] text-emerald-600 flex items-center gap-1"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Guest checkout · không cần đăng nhập</span></div>
      <div class="space-y-4">
        ${field("coEmail", "Email", "ban@email.com", "email")}
        <div class="grid grid-cols-2 gap-3">${field("coFirst", "Họ tên", "Nguyễn Văn A")}${field("coPhone", "Số điện thoại", "09xx xxx xxx")}</div>
        ${field("coAddr", "Địa chỉ", "Số nhà, đường, phường")}
        <div class="grid grid-cols-2 gap-3">${field("coCity", "Thành phố", "TP. HCM")}${field("coDist", "Quận / Huyện", "Quận 1")}</div>
        <label class="flex items-center gap-2 text-[12.5px] text-soft cursor-pointer"><input type="checkbox" class="accent-blues-500 w-4 h-4" checked> Nhận thông báo đơn hàng & ưu đãi qua email</label>
      </div>
      <button onclick="coNext()" class="btn btn-primary w-full py-3.5 text-sm mt-6">Tiếp tục → Vận chuyển</button>
    </div>`;
    } else if (coStep === 2) {
        f.innerHTML = `<div class="card p-6 anim-float">
      <h2 class="title-exp font-bold text-[15px] mb-5">PHƯƠNG THỨC VẬN CHUYỂN</h2>
      <div class="space-y-3" id="shipOpts">
        ${[
["Express", "2–4 ngày · giao tận nơi", cartSubtotal() > 1000000 ? 0 : 30000, true],
["Standard", "4–7 ngày tiêu chuẩn", 0, false],
["Same-day", "Nội thành HCMC trong ngày", 60000, false],
        ]
.map(
    (o, i) => `
          <label class="ship-opt flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${o[3] ? "border-blues-500" : "hairline border"}" data-ship="${i}" onclick="selectShip(${i},${o[2]})">
<span class="w-4 h-4 rounded-full border-2 ${o[3] ? "border-blues-500" : "border-current"} grid place-items-center"><span class="ship-dot w-2 h-2 rounded-full ${o[3] ? "bg-blues-500" : ""}" style="${o[3] ? "background:var(--blue-2)" : ""}"></span></span>
<div class="flex-1"><p class="text-[13px] font-semibold">${o[0]}</p><p class="text-[11px] text-mute">${o[1]}</p></div>
<span class="text-[13px] font-semibold">${o[2] === 0 ? "Miễn phí" : fmt(o[2])}</span></label>`,
)
.join("")}
      </div>
      <div class="mt-5 p-4 rounded-xl flex items-center gap-3" style="background:var(--line)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="text-blues-500"><rect x="2" y="6" width="14" height="11" rx="2"/><path d="M16 9h3l3 3v5h-6"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>
        <p class="text-[12.5px] text-soft">Dự kiến giao: <b class="text-ink">${new Date(Date.now() + 3 * 864e5).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}</b></p></div>
      <div class="flex gap-3 mt-6"><button onclick="coStep=1;renderCoStep()" class="btn btn-ghost px-6 py-3.5 text-sm">Quay lại</button><button onclick="coNext()" class="btn btn-primary flex-1 py-3.5 text-sm">Tiếp tục → Thanh toán</button></div>
    </div>`;
    } else {
        f.innerHTML = `<div class="card p-6 anim-float">
      <h2 class="title-exp font-bold text-[15px] mb-5">PHƯƠNG THỨC THANH TOÁN</h2>
      <div class="space-y-3">
        ${[
["Thẻ tín dụng / ghi nợ", "Visa · Mastercard · JCB", "card", true],
["Ví MoMo", "Thanh toán qua MoMo", "momo", false],
["VNPay QR", "Quét mã VNPay", "vnpay", false],
["COD", "Thanh toán khi nhận hàng", "cod", false],
        ]
.map(
    (o, i) => `
          <label class="pay-opt flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${o[3] ? "border-blues-500" : "hairline border"}" onclick="selectPay(${i})" data-pay="${i}">
<span class="w-4 h-4 rounded-full border-2 grid place-items-center" style="${o[3] ? "border-color:var(--blue-2)" : ""}"><span class="w-2 h-2 rounded-full" style="${o[3] ? "background:var(--blue-2)" : ""}"></span></span>
<div class="flex-1"><p class="text-[13px] font-semibold">${o[0]}</p><p class="text-[11px] text-mute">${o[1]}</p></div></label>`,
)
.join("")}
      </div>
      <div id="cardForm" class="mt-4 space-y-3">
        <div><label class="text-[12px] font-semibold text-mute block mb-1.5">Số thẻ</label><input placeholder="0000 0000 0000 0000" class="w-full surface border hairline rounded-xl px-4 py-3 text-[14px] font-mono"></div>
        <div class="grid grid-cols-2 gap-3"><div><label class="text-[12px] font-semibold text-mute block mb-1.5">Hết hạn</label><input placeholder="MM/YY" class="w-full surface border hairline rounded-xl px-4 py-3 text-[14px] font-mono"></div><div><label class="text-[12px] font-semibold text-mute block mb-1.5">CVV</label><input placeholder="123" class="w-full surface border hairline rounded-xl px-4 py-3 text-[14px] font-mono"></div></div>
      </div>
      <div class="flex gap-3 mt-6"><button onclick="coStep=2;renderCoStep()" class="btn btn-ghost px-6 py-3.5 text-sm">Quay lại</button><button onclick="placeOrder()" id="placeBtn" class="btn btn-primary flex-1 py-3.5 text-sm">Đặt hàng · ${fmt(coTotal())}</button></div>
    </div>`;
    }
    updateStepDots();
}
function updateStepDots() {
    $$("[data-step]").forEach((d) => {
        const n = +d.dataset.step;
        const on = n <= coStep;
        d.style.background = on ? "var(--grad-navy)" : "var(--line)";
        d.style.color = on ? "#fff" : "var(--ink-mute)";
        if (n < coStep) {
            d.innerHTML = "✓";
        } else {
            d.textContent = n;
        }
    });
    $$("[data-steplbl]").forEach((l) => {
        l.classList.toggle("text-mute", +l.dataset.steplbl > coStep);
    });
}
function coNext() {
    coStep++;
    renderCoStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
}
window.selectShip = (i, cost) => {
    $$("[data-ship]").forEach((o) => {
        o.classList.remove("border-blues-500");
        o.style.borderColor = "";
        o.querySelector(".ship-dot").style.background = "";
    });
    const el = $$("[data-ship]")[i];
    el.style.borderColor = "var(--blue-2)";
    el.querySelector(".ship-dot").style.background = "var(--blue-2)";
    State.data._shipCost = cost;
    renderCoSummary();
};
window.selectPay = (i) => {
    $$("[data-pay]").forEach((o) => {
        o.style.borderColor = "";
        o.querySelector("span span").style.background = "";
        o.querySelector("span").style.borderColor = "";
    });
    const el = $$("[data-pay]")[i];
    el.style.borderColor = "var(--blue-2)";
    el.querySelector("span").style.borderColor = "var(--blue-2)";
    el.querySelector("span span").style.background = "var(--blue-2)";
    $("#cardForm").style.display = i === 0 ? "block" : "none";
};
function coTotal() {
    const ship = State.data._shipCost ?? (cartSubtotal() > 1000000 ? 0 : 30000);
    const disc = State.data.appliedCoupon ? Math.round(cartSubtotal() * 0.1) : 0;
    const pts = State.data.usePoints ? Loyalty.redeemValue(cartSubtotal()) : 0;
    return cartSubtotal() + ship - disc - pts;
}

function renderCoSummary() {
    const s = $("#coSummary");
    if (!s) return;
    const ship = State.data._shipCost ?? (cartSubtotal() > 1000000 ? 0 : 30000);
    const disc = State.data.appliedCoupon ? Math.round(cartSubtotal() * 0.1) : 0;
    const ptsVal = State.data.usePoints ? Loyalty.redeemValue(cartSubtotal()) : 0;
    s.innerHTML = `<div class="card p-6">
    <h3 class="title-exp font-bold text-[14px] mb-4">ĐƠN HÀNG (${cartCount()})</h3>
    <div class="space-y-3 max-h-64 overflow-y-auto no-scrollbar mb-4">
      ${State.data.cart
          .map((it) => {
  const p = productById(it.pid);
  return `<div class="flex gap-3"><div class="w-14 h-16 rounded-lg overflow-hidden shrink-0 relative surface">${fashionSVG(it.pid + it.color, p.palette)}<span class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full grad-navy text-white text-[10px] grid place-items-center font-bold">${it.qty}</span></div><div class="flex-1 min-w-0"><p class="text-[12px] font-semibold clamp-2 leading-tight">${p.name}</p><p class="text-[10px] text-mute">${it.color}·${it.size}</p><p class="text-[12px] font-semibold mt-0.5">${fmt(it.price * it.qty)}</p></div></div>`;
          })
          .join("")}
    </div>
    <!-- coupon -->
    <div class="flex gap-2 mb-3"><input id="coupon" placeholder="Mã giảm giá" class="flex-1 surface border hairline rounded-lg px-3 py-2.5 text-[12px]"><button onclick="applyCoupon()" class="btn btn-ghost px-4 py-2.5 text-[12px]">Áp dụng</button></div>
    <!-- loyalty -->
    <label class="flex items-center justify-between p-3 rounded-lg mb-4 cursor-pointer" style="background:var(--line)">
      <div class="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="text-blues-500"><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z"/></svg><div><p class="text-[12px] font-semibold">Dùng ${State.data.points} điểm</p><p class="text-[10px] text-mute">Tối đa ${fmt(Loyalty.redeemValue(cartSubtotal()))} (20% đơn)</p></div></div>
      <input type="checkbox" ${State.data.usePoints ? "checked" : ""} onchange="State.data.usePoints=this.checked;renderCoSummary()" class="accent-blues-500 w-4 h-4"></label>
    <div class="space-y-2 text-[13px] border-t hairline pt-4">
      <div class="flex justify-between"><span class="text-mute">Tạm tính</span><span>${fmt(cartSubtotal())}</span></div>
      <div class="flex justify-between"><span class="text-mute">Vận chuyển</span><span>${ship === 0 ? "Miễn phí" : fmt(ship)}</span></div>
      ${disc ? `<div class="flex justify-between text-emerald-600"><span>Giảm giá (10%)</span><span>−${fmt(disc)}</span></div>` : ""}
      ${ptsVal ? `<div class="flex justify-between text-blues-500"><span>Điểm thưởng</span><span>−${fmt(ptsVal)}</span></div>` : ""}
      <div class="flex justify-between text-lg font-bold pt-2 border-t hairline"><span>Tổng cộng</span><span>${fmt(coTotal())}</span></div>
    </div>
    <p class="text-[11px] text-mute mt-3 flex items-center gap-1.5"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="text-emerald-500"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Thanh toán an toàn · mã hoá SSL</p>
  </div>`;
    if (coStep === 3) {
        const b = $("#placeBtn");
        if (b) b.innerHTML = "Đặt hàng · " + fmt(coTotal());
    }
}
function applyCoupon() {
    const v = $("#coupon").value.trim().toUpperCase();
    if (!v) return;
    State.data.appliedCoupon = v;
    UI.toast("Mã giảm giá", `Đã áp dụng "${v}" · giảm 10%`, "check");
    renderCoSummary();
}

async function placeOrder() {
    const btn = $("#placeBtn");
    btn.innerHTML = '<span class="spin"></span> Đang xử lý…';
    btn.disabled = true;
    const earned = Math.floor((cartSubtotal() / 100000) * 10);
    const res = await API.checkout();
    // CRM + loyalty + inventory triggers
    CRM.fire("checkout", { order: res.orderId });
    State.data.orders.unshift({
        id: res.orderId,
        date: new Date().toLocaleDateString("vi-VN"),
        status: "Đang xử lý",
        total: coTotal(),
        items: cartCount(),
    });
    if (State.data.usePoints) {
        const used = Math.floor(Loyalty.redeemValue(cartSubtotal()) / 50000) * 100;
        State.data.points = Math.max(0, State.data.points - used);
    }
    Cart.clear();
    State.data.usePoints = false;
    State.data.appliedCoupon = null;
    State.data._shipCost = null;
    Notif.push(
        "Đặt hàng thành công",
        `Đơn ${res.orderId} đang được xử lý. Dự kiến giao ${res.eta}.`,
        "check",
    );
    Loyalty.earn(earned, `Đơn ${res.orderId}`);
    showOrderSuccess(res, earned);
}
function showOrderSuccess(res, earned) {
    const node = UI.modal(
        `<div class="p-8 text-center">
    <div class="w-16 h-16 rounded-full grad-navy text-white grid place-items-center mx-auto mb-5 anim-scale"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg></div>
    <h3 class="headline text-3xl mb-2">Cảm ơn bạn!</h3>
    <p class="text-soft text-sm">Đơn hàng <b class="text-ink font-mono">${res.orderId}</b> đã được tiếp nhận.</p>
    <div class="grid grid-cols-2 gap-3 my-6 text-left">
      <div class="card p-4"><p class="text-[11px] text-mute">Giao dự kiến</p><p class="text-[14px] font-semibold mt-0.5">${res.eta}</p></div>
      <div class="card p-4"><p class="text-[11px] text-mute">Điểm tích luỹ</p><p class="text-[14px] font-semibold mt-0.5 text-blues-500">+${earned} điểm</p></div>
    </div>
    <div class="flex gap-2.5"><button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('account')" class="btn btn-ghost flex-1 py-3 text-sm">Xem đơn hàng</button>
    <button onclick="UI.closeOverlay(this.closest('[data-mounted]'));Router.go('home')" class="btn btn-primary flex-1 py-3 text-sm">Về trang chủ</button></div>
  </div>`,
        "max-w-md",
    );
}

