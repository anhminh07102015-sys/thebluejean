/* =====================================================================
   PAGE: CRM STUDIO  ·  automation dashboard
   ===================================================================== */
Router.add("crm", async () => {
    const wrap = el(
        '<div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-16"></div>',
    );
    wrap.appendChild(
        el(`<div class="flex items-end justify-between flex-wrap gap-4 mb-8">
    <div><p class="kicker text-blues-500 mb-2 reveal">CRM Studio</p><h1 class="headline text-4xl lg:text-5xl reveal">Automation & Lifecycle</h1>
    <p class="text-mute text-sm mt-2 reveal">Mọi hành động của khách hàng kích hoạt một hành trình. Theo dõi realtime bên dưới.</p></div>
    <button onclick="CRM.fire('birthday');UI.toast('CRM','Đã kích hoạt birthday flow','crm')" class="btn btn-ghost px-5 py-2.5 text-[13px] reveal">▶ Test trigger</button>
  </div>`),
    );

    /* KPI */
    wrap.appendChild(
        el(
            `<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">${[
                ["Active flows", "6", "+2 quý này"],
                ["Open rate", "68%", "+12% MoM"],
                ["Click rate", "24%", "+5% MoM"],
                ["Revenue / email", "42.000đ", "+18% MoM"],
            ]
                .map(
                    ([l, v, d]) =>
                        `<div class="card p-5 reveal"><p class="text-[11px] text-mute uppercase tracking-wider">${l}</p><p class="text-3xl font-bold mt-1">${v}</p><p class="text-[11px] text-blues-500 mt-1">${d}</p></div>`,
                )
                .join("")}</div>`,
        ),
    );

    const grid = el('<div class="grid lg:grid-cols-3 gap-6"></div>');

    /* automation cards */
    const flowKeys = Object.entries(CRM.flows);
    const statuses = ["Active", "Active", "Active", "Active", "Paused", "Active"];
    grid.appendChild(
        el(`<div class="lg:col-span-2">
    <h2 class="headline text-2xl mb-4 reveal">Automation flows</h2>
    <div class="grid sm:grid-cols-2 gap-3">${flowKeys
        .map(
([k, f], i) => `
      <div class="card p-5 reveal">
        <div class="flex items-start justify-between mb-2">
          <div class="w-9 h-9 rounded-xl grad-navy text-white grid place-items-center"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h16v12H7l-3 3Z"/></svg></div>
          <span class="badge ${statuses[i] === "Active" ? "text-white" : ""}" style="${statuses[i] === "Active" ? "background:#16a34a" : "background:var(--line);color:var(--soft)"}">${statuses[i]}</span>
        </div>
        <h3 class="font-semibold text-[13.5px] leading-tight">${f.name}</h3>
        <p class="text-[12px] text-mute mt-1.5 leading-relaxed">${f.email}</p>
        <div class="flex items-center gap-3 mt-3 pt-3 hairline-t text-[11px] text-mute">
          <span>trigger: <span class="font-mono text-blues-500">${k}</span></span>
        </div>
      </div>`,
        )
        .join("")}</div>

    <h2 class="headline text-2xl mt-10 mb-4 reveal">Customer journey</h2>
    <div class="card p-6 reveal">
      <div class="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        ${[
["Visit", "Lần đầu ghé thăm"],
["Sign-up", "Welcome flow"],
["First order", "Confirmation"],
["Engaged", "Outfit ideas"],
["Loyal", "Tier upgrade"],
["VIP", "Membership"],
        ]
.map(
    (s, i, a) => `
          <div class="flex items-center gap-2 shrink-0">
<div class="text-center"><div class="w-10 h-10 rounded-full grid place-items-center mx-auto ${i < 3 ? "grad-navy text-white" : "border-2"}" style="${i < 3 ? "" : "border-color:var(--line)"}">${i + 1}</div><p class="text-[11px] font-semibold mt-2">${s[0]}</p><p class="text-[10px] text-mute max-w-[80px]">${s[1]}</p></div>
${i < a.length - 1 ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-mute shrink-0"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' : ""}
          </div>`,
)
.join("")}
      </div>
    </div>

    <h2 class="headline text-2xl mt-10 mb-4 reveal">Message preview</h2>
    <div class="grid sm:grid-cols-2 gap-4 reveal">
      <div class="card overflow-hidden">
        <div class="px-4 py-2.5 hairline-b flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-red-400"></span><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span class="w-2.5 h-2.5 rounded-full bg-green-400"></span><span class="text-[11px] text-mute ml-2">Email · Welcome</span></div>
        <div class="p-5"><div class="rounded-lg grad-navy h-20 mb-3 grid place-items-center text-white headline text-xl">THE BLUES</div>
          <p class="text-[13px] font-semibold">Chào mừng đến The Blues Membership 🤝</p>
          <p class="text-[12px] text-mute mt-1.5 leading-relaxed">Cảm ơn bạn đã tham gia. Đây là voucher 100.000đ cho đơn đầu tiên của bạn.</p>
          <div class="btn btn-primary text-[11px] py-2 px-4 mt-3 inline-block">Khám phá BST →</div></div>
      </div>
      <div class="card overflow-hidden">
        <div class="px-4 py-2.5 hairline-b flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="text-blues-500"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/></svg><span class="text-[11px] text-mute">Push · Sale alert</span></div>
        <div class="p-5 space-y-3">
          ${[
  ["🔥 Wishlist vừa giảm giá", "Selvedge Slim Jean đang -20%. Nhanh tay!"],
  ["⚠️ Sắp hết hàng", "Item bạn thích chỉ còn vài size."],
  ["🎁 +50 điểm sinh nhật", "Chúc mừng sinh nhật! Quà đã vào ví."],
          ]
  .map(
      ([t, m]) =>
          `<div class="flex items-start gap-3 p-3 rounded-xl" style="background:var(--surface)"><div class="w-8 h-8 rounded-lg grad-navy shrink-0"></div><div><p class="text-[12.5px] font-semibold">${t}</p><p class="text-[11px] text-mute">${m}</p></div></div>`,
  )
  .join("")}
        </div>
      </div>
    </div>
  </div>`),
    );

    /* live feed */
    grid.appendChild(
        el(`<div>
    <h2 class="headline text-2xl mb-4 reveal">Live trigger feed</h2>
    <div class="card p-5 reveal sticky top-24">
      <div class="flex items-center gap-2 mb-4"><span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><p class="text-[12px] font-semibold text-mute uppercase tracking-wider">Realtime</p></div>
      <div id="crmFeed" class="space-y-3 max-h-[460px] overflow-y-auto no-scrollbar"></div>
      <p class="text-[11px] text-mute mt-4 pt-4 hairline-t">💡 Thử <button onclick="Router.go('shop')" class="text-blues-500 underline">thêm sản phẩm vào giỏ</button> hoặc wishlist để xem automation chạy.</p>
    </div>
  </div>`),
    );
    wrap.appendChild(grid);

    setTimeout(() => {
        const feed = $("#crmFeed");
        if (feed) CRM._renderFeed(feed);
    }, 60);
    return wrap;
});

