/* =====================================================================
   PAGE: ACCOUNT  ·  Member Portal (Apple/Stripe style dashboard)
   ===================================================================== */
const acctState = { tab: "overview" };
Router.add("account", async () => {
    const wrap = el(
        '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-16"></div>',
    );
    const u = State.data.user,
        pts = State.data.points,
        tier = tierFor(pts),
        nt = nextTier(pts);

    wrap.appendChild(
        el(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl grid place-items-center text-white text-lg font-bold" style="background:${tier.grad}">${u.name.split(" ").pop()[0]}</div>
      <div><h1 class="headline text-3xl">Xin chào, ${u.name.split(" ").pop()}</h1>
      <p class="text-mute text-sm">${tier.name} · ${fmtPts(pts)} điểm · thành viên từ ${u.joined}</p></div>
    </div>
    <button onclick="Router.go('loyalty')" class="btn btn-ghost px-5 py-2.5 text-[13px] self-start sm:self-auto">Xem Membership →</button>
  </div>`),
    );

    const tabs = [
        ["overview", "Tổng quan"],
        ["orders", "Đơn hàng"],
        ["vouchers", "Voucher"],
        ["notifs", "Thông báo"],
        ["profile", "Hồ sơ"],
    ];
    const tabBar = el(
        `<div class="flex gap-1 p-1 rounded-xl mb-7 overflow-x-auto no-scrollbar" style="background:var(--surface);border:1px solid var(--line)">${tabs.map(([k, l]) => `<button data-tab="${k}" class="acctTab whitespace-nowrap px-4 py-2 rounded-lg text-[13px] font-medium transition ${acctState.tab === k ? "grad-navy text-white" : "text-mute hover:text-ink"}">${l}</button>`).join("")}</div>`,
    );
    wrap.appendChild(tabBar);
    const body = el("<div></div>");
    wrap.appendChild(body);

    function render() {
        const t = acctState.tab;
        if (t === "overview") {
            const nextHi = nt ? nt.min : tier.min;
            const lo = tier.min;
            const pct = nt
                ? clamp(Math.round(((pts - lo) / (nextHi - lo)) * 100), 4, 100)
                : 100;
            body.innerHTML = `
        <div class="grid sm:grid-cols-3 gap-4 mb-6">
          <div class="card p-5"><p class="text-[11px] text-mute uppercase tracking-wider">Điểm thành viên</p><p class="text-3xl font-bold text-blues-500 mt-1">${fmtPts(pts)}</p><p class="text-[11px] text-mute mt-1">≈ ${fmt(Math.floor(pts / 100) * 50000)} giá trị</p></div>
          <div class="card p-5"><p class="text-[11px] text-mute uppercase tracking-wider">Đơn hàng</p><p class="text-3xl font-bold mt-1">${State.data.orders.length}</p><p class="text-[11px] text-mute mt-1">${State.data.orders.filter((o) => o.status !== "Hoàn tất").length} đang xử lý</p></div>
          <div class="card p-5"><p class="text-[11px] text-mute uppercase tracking-wider">Voucher khả dụng</p><p class="text-3xl font-bold mt-1">${State.data.vouchers.filter((v) => !v.used).length}</p><p class="text-[11px] text-mute mt-1">trong ví của bạn</p></div>
        </div>
        <div class="card p-6 mb-6">
          <div class="flex items-center justify-between mb-3"><p class="font-semibold text-sm">Tiến trình hạng ${nt ? "· " + nt.name : ""}</p><span class="text-[12px] text-mute">${nt ? fmtPts(nextHi - pts) + " điểm nữa" : "Hạng cao nhất"}</span></div>
          <div class="h-2.5 rounded-full overflow-hidden" style="background:var(--line)"><div class="h-full rounded-full" style="width:${pct}%;background:var(--grad-navy)"></div></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="card p-5"><div class="flex items-center justify-between mb-3"><p class="font-semibold text-sm">Đơn gần đây</p><button onclick="acctGo('orders')" class="text-[12px] text-blues-500">Tất cả</button></div>
${
    State.data.orders
        .slice(0, 2)
        .map((o) => orderRow(o))
        .join("") || '<p class="text-mute text-sm">Chưa có đơn hàng</p>'
}</div>
          <div class="card p-5"><div class="flex items-center justify-between mb-3"><p class="font-semibold text-sm">Thông báo</p><button onclick="acctGo('notifs')" class="text-[12px] text-blues-500">Tất cả</button></div>
${
    State.data.notifs
        .slice(0, 3)
        .map(
            (n) =>
                `<div class="flex items-start gap-2.5 py-2"><span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style="background:${n.read ? "var(--line)" : "var(--blues)"}"></span><div><p class="text-[12.5px] font-medium leading-tight">${n.title}</p><p class="text-[11px] text-mute">${n.msg}</p></div></div>`,
        )
        .join("") || '<p class="text-mute text-sm">Không có thông báo mới</p>'
}</div>
        </div>`;
        } else if (t === "orders") {
            body.innerHTML = `<div class="space-y-3">${State.data.orders
                .map(
                    (o) => `
        <div class="card p-5">
          <div class="flex items-center justify-between flex-wrap gap-3">
<div><p class="font-semibold">#${o.id}</p><p class="text-[12px] text-mute">${o.date} · ${o.items} sản phẩm</p></div>
<div class="text-right"><p class="font-bold">${fmt(o.total)}</p><span class="badge mt-1 ${o.status === "Hoàn tất" ? "" : "text-white"}" style="${o.status === "Hoàn tất" ? "background:var(--line);color:var(--soft)" : "background:var(--grad-navy)"}">${o.status}</span></div>
          </div>
          <div class="mt-4 pt-4 hairline-t flex items-center gap-2">
${["Đặt hàng", "Đóng gói", "Đang giao", "Hoàn tất"]
    .map((s, i) => {
        const stages = ["Đặt hàng", "Đóng gói", "Đang giao", "Hoàn tất"];
        const cur = stages.indexOf(o.status === "Hoàn tất" ? "Hoàn tất" : o.status);
        return `<div class="flex-1"><div class="h-1.5 rounded-full" style="background:${i <= cur ? "var(--blues)" : "var(--line)"}"></div><p class="text-[9.5px] text-mute mt-1.5 ${i <= cur ? "" : "opacity-50"}">${s}</p></div>`;
    })
    .join("")}
          </div>
        </div>`,
                )
                .join("")}</div>`;
        } else if (t === "vouchers") {
            body.innerHTML = `<div class="grid sm:grid-cols-2 gap-4">${
                State.data.vouchers
                    .map(
                        (v) => `
        <div class="relative rounded-2xl overflow-hidden text-white p-5 ${v.used ? "opacity-50" : ""}" style="background:var(--grad-navy)">
          <div class="absolute -left-3 top-1/2 w-6 h-6 rounded-full" style="background:var(--bg)"></div>
          <div class="absolute -right-3 top-1/2 w-6 h-6 rounded-full" style="background:var(--bg)"></div>
          <p class="text-[10px] uppercase tracking-[0.25em] opacity-70">${v.label}</p>
          <p class="headline text-2xl mt-1">${v.value}</p>
          <div class="flex items-center justify-between mt-4 pt-4" style="border-top:1px dashed rgba(255,255,255,.25)">
<div><p class="text-[10px] opacity-60">Mã</p><p class="font-mono text-[13px] font-bold tracking-wider">${v.code}</p></div>
<div class="text-right"><p class="text-[10px] opacity-60">HSD</p><p class="text-[12px]">${v.exp}</p></div>
          </div>
        </div>`,
                    )
                    .join("") || '<p class="text-mute text-sm">Chưa có voucher nào</p>'
            }</div>`;
        } else if (t === "notifs") {
            body.innerHTML = `<div class="card divide-y" style="border-color:var(--line)">${
                State.data.notifs
                    .map(
                        (n) => `
        <div class="flex items-start gap-3 p-4">
          <div class="w-9 h-9 rounded-xl grid place-items-center shrink-0 ${n.kind === "sale" ? "bg-red-500 text-white" : "grad-navy text-white"}">${n.kind === "sale" ? "🔥" : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'}</div>
          <div class="flex-1"><p class="text-[13px] font-semibold">${n.title}</p><p class="text-[12px] text-mute">${n.msg}</p><p class="text-[10px] text-mute mt-1">${n.time}</p></div>
          ${!n.read ? '<span class="w-2 h-2 rounded-full mt-1.5" style="background:var(--blues)"></span>' : ""}
        </div>`,
                    )
                    .join("") ||
                '<p class="text-mute text-sm p-8 text-center">Không có thông báo</p>'
            }</div>`;
        } else if (t === "profile") {
            body.innerHTML = `<div class="card p-6 max-w-xl">
        <div class="grid sm:grid-cols-2 gap-4">
          ${[
  ["Họ tên", u.name],
  ["Email", u.email],
  ["Số điện thoại", u.phone],
  ["Thành viên từ", u.joined],
          ]
  .map(
      ([l, v]) =>
          `<div><label class="text-[11px] text-mute uppercase tracking-wider">${l}</label><input value="${v}" class="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent" style="border:1px solid var(--line)"></div>`,
  )
  .join("")}
        </div>
        <div class="flex items-center gap-3 mt-5">
          <button onclick="UI.toast('Hồ sơ','Đã lưu thông tin của bạn','check')" class="btn btn-primary px-6 py-2.5 text-sm">Lưu thay đổi</button>
          <button onclick="Loyalty.earn(50,'Cập nhật sinh nhật')" class="btn btn-ghost px-5 py-2.5 text-[13px]">🎂 Thêm sinh nhật (+50đ)</button>
        </div>
        <div class="mt-6 pt-6 hairline-t flex items-center justify-between">
          <div><p class="text-[13px] font-semibold">Chế độ giao diện</p><p class="text-[11px] text-mute">Sáng / Tối</p></div>
          <button onclick="UI.toggleTheme()" class="btn btn-ghost px-4 py-2 text-[12px]">Đổi giao diện</button>
        </div>
      </div>`;
        }
        body.querySelectorAll("[data-mounted]");
        UI.bindReveal();
    }
    tabBar
        .querySelectorAll(".acctTab")
        .forEach((b) => (b.onclick = () => acctGo(b.dataset.tab, tabBar, render)));
    window.acctGo = (tab, bar, rfn) => {
        acctState.tab = tab;
        const tb = bar || $(".acctTab")?.parentElement;
        if (tb)
            tb.querySelectorAll(".acctTab").forEach((x) => {
                const on = x.dataset.tab === tab;
                x.className = `acctTab whitespace-nowrap px-4 py-2 rounded-lg text-[13px] font-medium transition ${on ? "grad-navy text-white" : "text-mute hover:text-ink"}`;
            });
        (rfn || render)();
    };
    render();
    // mark notifs read on visit
    State.data.notifs.forEach((n) => (n.read = true));
    Badges.update();
    return wrap;
});
function orderRow(o) {
    return `<div class="flex items-center justify-between py-2.5"><div><p class="text-[13px] font-medium">#${o.id}</p><p class="text-[11px] text-mute">${o.date}</p></div><div class="text-right"><p class="text-[13px] font-semibold">${fmt(o.total)}</p><p class="text-[10px] text-mute">${o.status}</p></div></div>`;
}

