/* =====================================================================
   PAGE: LOYALTY  ·  Membership  (membership · tiers · rewards · CRM cycle)
   ===================================================================== */
Router.add("loyalty", async () => {
    const wrap = el("<div></div>");
    const pts = State.data.points,
        tier = tierFor(pts),
        nt = nextTier(pts);
    const idx = TIERS.findIndex((t) => t.key === tier.key);
    const lo = tier.min,
        hi = nt ? nt.min : tier.min + (tier.max - tier.min);
    const pct = nt ? clamp(Math.round(((pts - lo) / (hi - lo)) * 100), 4, 100) : 100;
    const ringDeg = Math.round(pct * 3.6);

    // section wrapper (optional id + extra classes)
    const sec = (inner, extra = "", id = "") => {
        const s = el(
            `<section ${id ? `id="${id}"` : ""} class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 ${extra}"></section>`,
        );
        s.innerHTML = inner;
        return s;
    };

    // inline icon set reused across the page
    const ic = {
        gift: '<path d="M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
        truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 18.5a2 2 0 1 0 0 .01M18.5 18.5a2 2 0 1 0 0 .01"/>',
        cake: '<path d="M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M4 14c1.3 0 1.3-1.4 2.7-1.4S8 14 9.3 14s1.4-1.4 2.7-1.4S13.3 14 14.7 14s1.4-1.4 2.6-1.4S18.7 14 20 14M12 8V4M12 4l1-1M12 4l-1-1"/>',
        lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
        spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
        wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.7-.7-.7-2.7z"/>',
        star: '<path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11"/>',
        bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
        cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 6H6"/>',
        chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/>',
        contactless: '<path d="M6 8a8 8 0 0 1 0 8"/><path d="M10 6a12 12 0 0 1 0 12"/><path d="M14 4a16 16 0 0 1 0 16"/>',
    };
    const svg = (k, sz = 18, sw = 1.6) =>
        `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ic[k] || ""}</svg>`;

    /* ---------- HERO (real image) ---------- */
    wrap.appendChild(
        el(`<section class="relative overflow-hidden min-h-[480px] flex items-end">
    <div class="absolute inset-0">${heroSVG("membership-hero")}</div>
    <div class="absolute inset-0" style="background:linear-gradient(180deg, rgba(8,14,36,.30) 0%, rgba(8,14,36,.55) 55%, rgba(8,14,36,.9) 100%)"></div>
    <div class="relative max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-10 py-12 lg:py-16 text-white">
      <p class="kicker text-white/70 mb-3 reveal">The Blues · Membership</p>
      <h1 class="headline text-5xl lg:text-7xl reveal">Membership</h1>
      <p class="text-white/80 max-w-xl mt-4 reveal">Tham gia miễn phí — tích điểm qua từng trải nghiệm, mở khoá ưu đãi độc quyền, quà sinh nhật, early access và sự kiện riêng tư.</p>
      <div class="flex flex-wrap items-center gap-2 mt-6 reveal">
        <span class="badge text-white" style="background:rgba(255,255,255,.16);backdrop-filter:blur(6px)">Hạng của bạn · ${tier.name}</span>
        <span class="badge text-white" style="background:rgba(255,255,255,.16);backdrop-filter:blur(6px)">${fmtPts(pts)} điểm</span>
      </div>
      <div class="flex flex-wrap items-center gap-3 mt-5 reveal">
        <button onclick="document.getElementById('member-dash')?.scrollIntoView({behavior:'smooth'})" class="btn px-6 py-3 text-sm" style="background:#fff;color:var(--ink)">Quyền lợi của tôi</button>
        <button onclick="document.getElementById('member-programs')?.scrollIntoView({behavior:'smooth'})" class="btn px-6 py-3 text-sm" style="background:rgba(255,255,255,.14);color:#fff;backdrop-filter:blur(6px)">Khám phá ưu đãi</button>
      </div>
    </div>
  </section>`),
    );

    /* ---------- MEMBER DASHBOARD: digital card + progress ---------- */
    const seg = 100 / (TIERS.length - 1);
    const overallPct = nt
        ? Math.min(100, Math.round(idx * seg + (pct / 100) * seg))
        : 100;
    const dashStats = [
        { icon: "bolt", l: "Đã tích luỹ", v: `${fmtPts(pts)} đ`, hi: true },
        { icon: "gift", l: "Giá trị quy đổi", v: fmt(Math.floor(pts / 100) * 50000) },
        { icon: "star", l: "Review quý", v: "Q2 2026" },
    ];
    /* ====== shared fragments ====== */
    const fragHeader = (tag, sub) => `
    <div class="flex items-center gap-3 mb-6 reveal">
      <span class="badge" style="background:var(--grad-navy);color:#fff">${tag}</span>
      <p class="text-[12px] text-mute">${sub}</p>
    </div>`;

    const fragRoadmap = (compact = false) => `
      <div class="relative h-2 rounded-full" style="background:var(--line)">
        <div class="absolute inset-y-0 left-0 rounded-full" style="width:${overallPct}%;background:var(--grad-navy)"></div>
        ${TIERS.map((t, i) => {
            const reached = i <= idx;
            return `<div class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ${i === idx ? "ring-4 ring-blues-500/30" : ""}" style="left:${i * seg}%;background:${reached ? "var(--blue-2)" : "var(--surface)"};box-shadow:0 0 0 1.5px ${reached ? "var(--blue-2)" : "var(--line)"}"></div>`;
        }).join("")}
      </div>
      <div class="flex justify-between mt-3">
        ${TIERS.map((t, i) => `<div style="flex:1" class="${i === 0 ? "text-left" : i === TIERS.length - 1 ? "text-right" : "text-center"}"><p class="text-[${compact ? "10" : "11"}px] font-semibold ${i <= idx ? "text-ink" : "text-mute"}">${t.name.split(" ")[0]}</p>${compact ? "" : `<p class="text-[10px] text-mute mt-0.5">${fmtPts(t.min)}</p>`}</div>`).join("")}
      </div>`;

    const fragRing = (size = 92) => `
      <div class="loyalty-ring relative shrink-0 rounded-full grid place-items-center" style="width:${size}px;height:${size}px;background:conic-gradient(var(--blues) ${ringDeg}deg, var(--line) 0)">
        <div class="absolute rounded-full grid place-items-center text-center" style="inset:${Math.round(size * 0.09)}px;background:var(--surface)">
          <div><p class="text-[${size > 120 ? "28" : "20"}px] font-bold leading-none">${pct}%</p><p class="text-[${size > 120 ? "10" : "9"}px] text-mute mt-1 leading-tight px-1">${nt ? "tới " + nt.name : "tối đa"}</p></div>
        </div>
      </div>`;

    const fragNextPerks = `
      <p class="text-[11px] text-mute mb-2.5 flex items-center gap-1.5">${svg("lock", 13)}${nt ? `Mở khoá khi đạt <span class="font-semibold text-ink">${nt.name}</span>` : `Đặc quyền bạn đang có`}</p>
      <div class="flex flex-wrap gap-1.5">${(nt ? nt.perks : tier.perks).map((p) => `<span class="text-[11px] px-2.5 py-1 rounded-full bg-surface" style="border:1px solid var(--line);color:var(--ink-soft)">${p}</span>`).join("")}</div>`;

    /* ====== VARIANT A · Tách 3 khối rõ ràng ====== */
    const dashA = el('<section id="member-dash" class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12"></section>');
    dashA.innerHTML = `
      ${fragHeader("VARIANT A", "Tách 3 khối rõ ràng · card trái + card phải gọn + stats bar dưới")}
      ${C.sectionHead("Thành viên", "Khu vực thành viên", "Theo dõi hạng, điểm tích luỹ và đặc quyền của bạn.")}
      <div class="grid lg:grid-cols-2 gap-6 items-stretch mb-6">
        <div class="reveal">
          <div class="lux-card p-7 h-full min-h-[280px] flex flex-col justify-between gap-6" data-tier="${tier.key}">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="lux-chip"></div>
                <p class="lux-label">The Blues · Member</p>
              </div>
              <div class="text-white/55">${svg("contactless", 22, 1.6)}</div>
            </div>
            <div>
              <p class="lux-label mb-2">Hạng hiện tại</p>
              <p class="lux-foil headline text-5xl leading-none" data-tier="${tier.key}">${tier.name}</p>
              <div class="flex flex-wrap gap-1.5 mt-4">${tier.perks.slice(0, 3).map((p) => `<span class="lux-pill">${p}</span>`).join("")}</div>
            </div>
            <div class="lux-hairline"></div>
            <div class="flex items-end justify-between">
              <div>
                <p class="lux-label mb-1.5">Chủ thẻ</p>
                <p class="text-[13px] font-semibold tracking-wide">${State.data.user.name}</p>
                <p class="text-[10.5px] text-white/50 mt-0.5">Thành viên từ ${State.data.user.joined}</p>
              </div>
              <div class="text-right">
                <p class="lux-label mb-1.5">Điểm</p>
                <p class="lux-foil text-4xl font-bold tabular-nums leading-none" data-tier="${tier.key}">${fmtPts(pts)}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card p-6 sm:p-7 reveal flex flex-col gap-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <p class="kicker text-blues-500 mb-2">Tiến trình hạng</p>
              ${nt ? `<p class="text-[15px] text-soft leading-relaxed">Còn <span class="font-bold text-ink">${fmtPts(hi - pts)} điểm</span> nữa để lên hạng <span class="font-semibold text-ink">${nt.name}</span>.</p>` : `<p class="text-[15px] text-soft leading-relaxed">Bạn đang ở hạng cao nhất — <span class="font-semibold text-ink">${tier.name}</span>. Cảm ơn bạn 🖤</p>`}
            </div>
            ${fragRing(96)}
          </div>
          <div>${fragRoadmap()}</div>
          <div class="rounded-xl p-4 mt-auto" style="background:var(--bg)">${fragNextPerks}</div>
        </div>
      </div>
      <div class="card p-2 reveal grid grid-cols-2 lg:grid-cols-4 divide-x" style="border-color:var(--line)">
        ${[
            { icon: "bolt", l: "Đã tích luỹ", v: `${fmtPts(pts)} đ`, hi: true },
            { icon: "gift", l: "Giá trị quy đổi", v: fmt(Math.floor(pts / 100) * 50000) },
            { icon: "star", l: "Review kỳ này", v: "Q2 2026" },
            { icon: "spark", l: "Hạng kế tiếp", v: nt ? nt.name : "Tối đa" },
        ].map((s) => `
          <div class="flex items-center gap-3 p-4">
            <div class="w-10 h-10 rounded-xl grid place-items-center shrink-0" style="background:var(--bg);color:var(--blue-2)">${svg(s.icon, 18)}</div>
            <div class="min-w-0"><p class="text-[10.5px] text-mute uppercase tracking-wider">${s.l}</p><p class="text-[15px] font-bold tabular-nums mt-0.5 truncate ${s.hi ? "text-blues-500" : ""}">${s.v}</p></div>
          </div>`).join("")}
      </div>`;
    wrap.appendChild(dashA);

    /* ====== VARIANT B · Hero-card 7/5 split ====== */
    const dashB = el('<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12"></section>');
    dashB.innerHTML = `
      ${fragHeader("VARIANT B", "Hero card chiếm 7/12 · ring + roadmap + CTA bên phải")}
      <div class="grid lg:grid-cols-12 gap-6 items-stretch">
        <div class="lg:col-span-7 reveal">
          <div class="lux-card p-8 sm:p-10 h-full flex flex-col gap-10" data-tier="${tier.key}">
            <div class="flex items-start justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="lux-chip"></div>
                <div>
                  <p class="lux-label">The Blues</p>
                  <p class="text-[12px] text-white/70 mt-1">Privilege Membership</p>
                </div>
              </div>
              <div class="text-white/55">${svg("contactless", 26, 1.6)}</div>
            </div>
            <div class="flex items-end justify-between gap-6">
              <div>
                <p class="lux-label mb-3">Hạng hiện tại</p>
                <p class="lux-foil headline text-6xl leading-none" data-tier="${tier.key}">${tier.name}</p>
                <div class="flex flex-wrap gap-1.5 mt-5">${tier.perks.slice(0, 3).map((p) => `<span class="lux-pill">${p}</span>`).join("")}</div>
              </div>
              <div class="text-right shrink-0">
                <p class="lux-label mb-2">Điểm</p>
                <p class="lux-foil text-6xl font-bold tabular-nums leading-none" data-tier="${tier.key}">${fmtPts(pts)}</p>
                <p class="text-[11px] text-white/55 mt-3">${State.data.user.name}</p>
              </div>
            </div>
            <div class="lux-hairline"></div>
            <div class="grid grid-cols-3 gap-4">
              ${[
                  { l: "Giá trị quy đổi", v: fmt(Math.floor(pts / 100) * 50000) },
                  { l: "Review kỳ này", v: "Q2 2026" },
                  { l: "Thành viên từ", v: State.data.user.joined },
              ].map((s) => `<div><p class="lux-label">${s.l}</p><p class="text-[14px] font-semibold mt-2 text-white/90">${s.v}</p></div>`).join("")}
            </div>
          </div>
        </div>
        <div class="lg:col-span-5 card p-6 sm:p-7 reveal flex flex-col gap-6">
          <div class="flex flex-col items-center text-center gap-4">
            ${fragRing(140)}
            ${nt ? `<p class="text-[14px] text-soft leading-relaxed">Còn <span class="font-bold text-ink">${fmtPts(hi - pts)} điểm</span> để lên <span class="font-semibold text-ink">${nt.name}</span></p>` : `<p class="text-[14px] text-soft">Hạng cao nhất 🖤</p>`}
          </div>
          <div>${fragRoadmap(true)}</div>
          <button onclick="document.getElementById('member-programs')?.scrollIntoView({behavior:'smooth'})" class="btn btn-primary w-full py-3 text-sm mt-auto">Khám phá đặc quyền${nt ? ` ${nt.name}` : ""}</button>
        </div>
      </div>`;
    wrap.appendChild(dashB);

    /* ====== VARIANT C · Stacked vertical (banner + 3 cols) ====== */
    const dashC = el('<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12"></section>');
    dashC.innerHTML = `
      ${fragHeader("VARIANT C", "Banner full-width trên + 3 cột (ring · roadmap · perks) dưới")}
      <div class="lux-card p-6 sm:p-8 reveal mb-6" data-tier="${tier.key}">
        <div class="grid lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 items-center">
          <div class="flex items-center gap-4">
            <div class="lux-chip"></div>
            <div>
              <p class="lux-label">Hạng hiện tại</p>
              <p class="lux-foil headline text-3xl mt-1.5 leading-none" data-tier="${tier.key}">${tier.name}</p>
            </div>
          </div>
          <div class="min-w-0 lg:px-4 lg:border-l lg:border-r" style="border-color:rgba(255,255,255,.1)">
            <div class="flex items-center justify-between mb-2.5 gap-3">
              <p class="text-[12px] text-white/65">${State.data.user.name} · thành viên từ ${State.data.user.joined}</p>
              <p class="text-[12px] text-white/85 font-semibold">${nt ? `Còn ${fmtPts(hi - pts)} đ → ${nt.name}` : "Hạng cao nhất 🖤"}</p>
            </div>
            <div class="relative h-1.5 rounded-full" style="background:rgba(255,255,255,.12)">
              <div class="absolute inset-y-0 left-0 rounded-full" style="width:${pct}%;background:linear-gradient(90deg,var(--foil-1,#fbedc4),var(--foil-2,#d4af37));box-shadow:0 0 12px rgba(255,255,255,.3)"></div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-4">${tier.perks.slice(0, 3).map((p) => `<span class="lux-pill">${p}</span>`).join("")}</div>
          </div>
          <div class="text-right flex flex-col items-end gap-2">
            <div class="text-white/55 mb-1">${svg("contactless", 20, 1.6)}</div>
            <p class="lux-label">Điểm</p>
            <p class="lux-foil text-5xl font-bold tabular-nums leading-none" data-tier="${tier.key}">${fmtPts(pts)}</p>
          </div>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="card p-6 reveal flex flex-col items-center text-center gap-4">
          <p class="kicker text-blues-500">Tiến trình</p>
          ${fragRing(130)}
          <p class="text-[12px] text-mute">${nt ? `${pct}% đến ${nt.name}` : "Bạn đã ở đỉnh"}</p>
        </div>
        <div class="card p-6 reveal flex flex-col gap-4">
          <p class="kicker text-blues-500">Lộ trình 4 hạng</p>
          <div class="mt-2">${fragRoadmap()}</div>
          <div class="mt-auto pt-4 hairline-t grid grid-cols-2 gap-3">
            <div><p class="text-[10px] text-mute uppercase tracking-wider">Đã tích</p><p class="text-[14px] font-bold text-blues-500 mt-1">${fmtPts(pts)} đ</p></div>
            <div><p class="text-[10px] text-mute uppercase tracking-wider">Quy đổi</p><p class="text-[14px] font-bold mt-1">${fmt(Math.floor(pts / 100) * 50000)}</p></div>
          </div>
        </div>
        <div class="card p-6 reveal flex flex-col gap-3">
          ${fragNextPerks}
        </div>
      </div>`;
    wrap.appendChild(dashC);

    /* ====== VARIANT D · Bento grid + stats strip ====== */
    const dashD = el('<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12"></section>');
    dashD.innerHTML = `
      ${fragHeader("VARIANT D", "Stats strip trên · bento 2x2 dưới (card · ring · roadmap · perks)")}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        ${[
            { icon: "bolt", l: "Điểm tích luỹ", v: `${fmtPts(pts)} đ`, hi: true },
            { icon: "gift", l: "Giá trị quy đổi", v: fmt(Math.floor(pts / 100) * 50000) },
            { icon: "star", l: "Hạng hiện tại", v: tier.name },
            { icon: "spark", l: "Hạng kế tiếp", v: nt ? `${fmtPts(hi - pts)} đ nữa` : "Tối đa" },
        ].map((s, i) => `
          <div class="card p-4 reveal reveal-d${(i % 4) + 1} flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl grid place-items-center shrink-0" style="background:${s.hi ? "var(--grad-navy)" : "var(--bg)"};color:${s.hi ? "#fff" : "var(--blue-2)"}">${svg(s.icon, 18)}</div>
            <div class="min-w-0"><p class="text-[10.5px] text-mute uppercase tracking-wider">${s.l}</p><p class="text-[14px] font-bold tabular-nums truncate mt-0.5 ${s.hi ? "text-blues-500" : ""}">${s.v}</p></div>
          </div>`).join("")}
      </div>
      <div class="grid lg:grid-cols-2 gap-3">
        <div class="reveal">
          <div class="lux-card p-6 h-full min-h-[240px] flex flex-col justify-between gap-5" data-tier="${tier.key}">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="lux-chip"></div>
                <p class="lux-label">Digital Card</p>
              </div>
              <div class="text-white/55">${svg("contactless", 20, 1.6)}</div>
            </div>
            <div>
              <p class="lux-foil headline text-3xl leading-none" data-tier="${tier.key}">${tier.name}</p>
              <div class="flex flex-wrap gap-1.5 mt-3">${tier.perks.slice(0, 3).map((p) => `<span class="lux-pill">${p}</span>`).join("")}</div>
            </div>
            <div class="lux-hairline"></div>
            <div class="flex items-end justify-between">
              <div>
                <p class="lux-label mb-1">Chủ thẻ</p>
                <p class="text-[13px] font-semibold">${State.data.user.name}</p>
              </div>
              <div class="text-right">
                <p class="lux-label mb-1">Điểm</p>
                <p class="lux-foil text-3xl font-bold tabular-nums leading-none" data-tier="${tier.key}">${fmtPts(pts)}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card p-6 reveal flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
          <p class="kicker text-blues-500">Tiến trình</p>
          ${fragRing(140)}
          ${nt ? `<p class="text-[12px] text-soft">Còn <span class="font-bold text-ink">${fmtPts(hi - pts)} đ</span> để lên <span class="font-semibold text-ink">${nt.name}</span></p>` : `<p class="text-[12px] text-soft">Hạng cao nhất 🖤</p>`}
        </div>
        <div class="card p-6 reveal flex flex-col gap-4">
          <p class="kicker text-blues-500">Lộ trình hạng</p>
          <div class="mt-2">${fragRoadmap()}</div>
        </div>
        <div class="card p-6 reveal flex flex-col gap-3">
          ${fragNextPerks}
        </div>
      </div>`;
    wrap.appendChild(dashD);

    /* ---------- WELCOME OFFER (new members) ---------- */
    const welcomeSteps = [
        { n: "01", t: "Đăng ký miễn phí", d: "Tạo tài khoản trong 30 giây — không mất phí, không ràng buộc.", icon: "user" },
        { n: "02", t: "Nhận quà chào mừng", d: "Voucher 100.000đ + freeship cho đơn hàng đầu tiên.", icon: "gift" },
        { n: "03", t: "Mua sắm & tích điểm", d: "Mỗi 10.000đ = 1 điểm — tích điểm để lên hạng và đổi quà.", icon: "cart" },
    ];
    const welcomePerks = [
        { t: "Voucher 100.000đ", d: "Tặng ngay khi đăng ký", icon: "gift" },
        { t: "Freeship đơn đầu", d: "Không cần giá trị tối thiểu", icon: "truck" },
        { t: "+20 điểm chào mừng", d: "Cộng thẳng vào tài khoản", icon: "bolt" },
    ];
    wrap.appendChild(
        sec(
            `${C.sectionHead("Người mới", "Đặc quyền chào mừng", "Tham gia hôm nay và nhận ngay bộ quà dành cho thành viên mới.")}
    <div class="card overflow-hidden reveal">
      <div class="grid lg:grid-cols-2">
        <div class="p-7 lg:p-10">
          <p class="kicker text-blues-500 mb-5">Cách tham gia</p>
          <div class="space-y-5">${welcomeSteps
  .map(
      (s) => `<div class="flex gap-4">
<div class="w-11 h-11 rounded-xl grad-navy text-white grid place-items-center shrink-0">${svg(s.icon, 18)}</div>
<div><p class="text-[11px] text-mute font-mono">${s.n}</p><p class="font-semibold">${s.t}</p><p class="text-[13px] text-soft mt-0.5 leading-relaxed">${s.d}</p></div>
          </div>`,
  )
  .join("")}</div>
          <button onclick="UI.toast('🎉 Chào mừng đến The Blues Membership','Voucher 100.000đ + freeship đã sẵn sàng cho đơn đầu tiên của bạn','check')" class="btn btn-primary px-7 py-3.5 text-sm mt-7">Tham gia miễn phí</button>
          <p class="text-[11px] text-mute mt-3">Miễn phí · không ràng buộc · huỷ bất cứ lúc nào.</p>
        </div>
        <div class="relative p-7 lg:p-10 text-white grid content-center gap-5" style="background:var(--grad-navy)">
          <p class="kicker text-white/60">Quà chào mừng</p>
          ${welcomePerks
  .map(
      (p) => `<div class="flex items-center gap-4">
<div class="w-11 h-11 rounded-xl grid place-items-center shrink-0" style="background:rgba(255,255,255,.14)">${svg(p.icon, 18)}</div>
<div><p class="font-semibold">${p.t}</p><p class="text-[13px] text-white/70">${p.d}</p></div>
          </div>`,
  )
  .join("")}
        </div>
      </div>
    </div>`,
            "py-12",
        ),
    );

    /* ---------- BENEFITS + WAYS TO EARN ---------- */
    const benefits = [
        { t: "Freeship cả năm", d: "Miễn phí giao hàng cho đơn từ 500.000đ.", icon: "truck" },
        { t: "Quà sinh nhật", d: "+50 điểm và voucher đặc biệt tháng sinh nhật.", icon: "cake" },
        { t: "Early access", d: "Mua trước 48h mỗi đợt BST mới.", icon: "lock" },
        { t: "Stylist 1:1", d: "Tư vấn phối đồ riêng cùng stylist The Blues.", icon: "spark" },
        { t: "Sửa chữa trọn đời", d: "Sửa đường may miễn phí cho hạng Black.", icon: "wrench" },
        { t: "Ưu đãi độc quyền", d: "Flash sale & giá riêng chỉ dành cho thành viên.", icon: "star" },
    ];
    const earnWays = [
        { t: "Mua sắm", d: "10.000đ = 1 điểm", pts: "1đ / 10k", icon: "cart" },
        { t: "Viết đánh giá", d: "Mỗi sản phẩm đã mua", pts: "+15", icon: "chat" },
        { t: "Giới thiệu bạn", d: "Khi bạn bè mua đơn đầu", pts: "+100", icon: "users" },
        { t: "Sinh nhật", d: "Tự động mỗi năm", pts: "+50", icon: "cake" },
        { t: "Hoàn thiện hồ sơ", d: "Cập nhật thông tin", pts: "+20", icon: "user" },
        { t: "Member Days", d: "Cuối tuần nhân đôi điểm", pts: "x2", icon: "bolt" },
    ];
    wrap.appendChild(
        sec(
            `<div class="grid lg:grid-cols-2 gap-10">
      <div>
        ${C.sectionHead("Quyền lợi", "Đặc quyền thành viên", "")}
        <div class="grid sm:grid-cols-2 gap-3">${benefits
.map(
    (b, i) => `<div class="card card-hover p-5 reveal reveal-d${(i % 2) + 1}">
          <div class="w-11 h-11 rounded-xl grad-navy text-white grid place-items-center mb-3">${svg(b.icon, 18)}</div>
          <p class="font-semibold text-[14px]">${b.t}</p>
          <p class="text-[12.5px] text-mute mt-1 leading-relaxed">${b.d}</p>
        </div>`,
)
.join("")}</div>
      </div>
      <div>
        ${C.sectionHead("Tích điểm", "Cách kiếm điểm", "")}
        <div class="card divide-y reveal" style="border-color:var(--line)">${earnWays
.map(
    (e) => `<div class="flex items-center gap-4 p-4">
          <div class="w-10 h-10 rounded-xl grid place-items-center shrink-0" style="background:var(--bg);color:var(--blue-2)">${svg(e.icon, 17)}</div>
          <div class="flex-1 min-w-0"><p class="font-semibold text-[14px]">${e.t}</p><p class="text-[12px] text-mute">${e.d}</p></div>
          <span class="badge shrink-0" style="background:var(--grad-navy);color:#fff">${e.pts}</span>
        </div>`,
)
.join("")}</div>
      </div>
    </div>`,
            "py-12",
        ),
    );

    /* ---------- TIER COMPARISON ---------- */
    wrap.appendChild(
        sec(
            `${C.sectionHead("Privileges", "Bốn cấp độ thành viên", "Mỗi hạng mở khoá một tầng trải nghiệm mới.")}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${TIERS.map(
          (t, i) => `<div class="card p-5 reveal reveal-d${(i % 4) + 1} relative overflow-hidden ${t.key === tier.key ? "ring-2 ring-blues-500" : ""}">
        ${t.key === tier.key ? `<span class="badge absolute top-4 right-4" style="background:var(--grad-navy);color:#fff">HẠNG CỦA BẠN</span>` : ""}
        <div class="w-10 h-10 rounded-xl mb-4" style="background:${t.grad}"></div>
        <h3 class="headline text-xl">${t.name}</h3>
        <p class="text-[11px] text-mute mt-1">${t.max === Infinity ? `${fmtPts(t.min)}+ điểm` : `${fmtPts(t.min)}–${fmtPts(t.max)} điểm`}</p>
        <ul class="mt-4 space-y-2.5">${t.perks.map((p) => `<li class="flex items-start gap-2 text-[12.5px] text-soft"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blues-500 shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5"/></svg><span>${p}</span></li>`).join("")}</ul>
      </div>`,
      ).join("")}
    </div>`,
            "py-12",
        ),
    );

    /* ---------- PROGRAMS (image cards) ---------- */
    const programs = [
        { seed: "prog-referral", tag: "Referral", t: "Giới thiệu bạn bè", d: "Bạn được voucher 100.000đ, bạn của bạn cũng vậy — không giới hạn lượt mời." },
        { seed: "prog-memberdays", tag: "x2 điểm", t: "Member Days", d: "Cuối tuần đầu mỗi tháng — nhân đôi điểm cho mọi đơn hàng." },
        { seed: "prog-birthday", tag: "Sinh nhật", t: "Tháng sinh nhật", d: "Quà sinh nhật, +50 điểm và ưu đãi riêng suốt tháng sinh của bạn." },
        { seed: "prog-earlyaccess", tag: "Early access", t: "Mua trước 48h", d: "Truy cập capsule & BST giới hạn trước công chúng 48 giờ." },
        { seed: "prog-seasonal", tag: "Theo mùa", t: "Seasonal Savings", d: "Sự kiện giảm giá theo mùa — thành viên luôn nhận mức tốt nhất." },
        { seed: "prog-events", tag: "VIP", t: "Sự kiện riêng tư", d: "Pop-up, workshop tại atelier và buổi styling 1:1 chỉ dành cho member." },
    ];
    wrap.appendChild(
        sec(
            `${C.sectionHead("Programs", "Chương trình & ưu đãi", "Những đặc quyền được thiết kế để mỗi lần ghé The Blues đều xứng đáng.")}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${programs
        .map(
(p, i) => `<div class="card overflow-hidden card-hover reveal reveal-d${(i % 3) + 1}">
        <div class="aspect-[16/10] relative pimg">${heroSVG(p.seed)}
          <div class="absolute inset-0" style="background:linear-gradient(180deg, transparent 35%, rgba(8,14,36,.78))"></div>
          <span class="badge absolute top-3 left-3 text-white" style="background:rgba(255,255,255,.2);backdrop-filter:blur(6px)">${p.tag}</span>
          <p class="headline text-white text-xl absolute left-4 right-4 bottom-3">${p.t}</p>
        </div>
        <div class="p-5"><p class="text-[13px] text-soft leading-relaxed">${p.d}</p></div>
      </div>`,
        )
        .join("")}</div>`,
            "py-12",
            "member-programs",
        ),
    );

    /* ---------- MEMBER-EXCLUSIVE PRODUCTS ---------- */
    const memberProducts = [
        { id: "p3", name: "Indigo Selvedge Jacket", price: 1890000, note: "Giá member −15%" },
        { id: "p7", name: "Raw Denim Trucker", price: 1490000, note: "Member-only" },
        { id: "p13", name: "Heavy Knit Sweater", price: 990000, note: "Early access" },
        { id: "p19", name: "Oxford Tailored Shirt", price: 690000, note: "Giá member −10%" },
    ];
    wrap.appendChild(
        sec(
            `${C.sectionHead("Member-only", "Sản phẩm độc quyền", "Capsule và giá riêng chỉ mở cho thành viên The Blues.")}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${memberProducts
        .map(
(p, i) => `<div class="card overflow-hidden card-hover reveal reveal-d${(i % 4) + 1}">
        <div class="pimg aspect-[4/5]">${fashionSVG(p.id)}
          <span class="badge absolute top-3 left-3 text-white" style="background:var(--grad-navy)">MEMBER</span>
        </div>
        <div class="p-4"><p class="text-[13px] font-semibold truncate">${p.name}</p><p class="text-[12px] text-blues-500 mt-0.5">${p.note}</p><p class="text-sm font-bold mt-1">${fmt(p.price)}</p></div>
      </div>`,
        )
        .join("")}</div>`,
            "py-12",
        ),
    );

    /* ---------- REWARD CENTER + POINT HISTORY ---------- */
    const rc = el(
        '<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12 grid lg:grid-cols-5 gap-8"></section>',
    );
    const rewards = [
        { name: "Voucher 50.000đ", cost: 100, icon: "gift" },
        { name: "Voucher 150.000đ", cost: 280, icon: "gift" },
        { name: "Free express ship", cost: 120, icon: "truck" },
        { name: "Personal styling 1:1", cost: 500, icon: "spark" },
        { name: "Early access capsule", cost: 800, icon: "lock" },
        { name: "Vé sự kiện riêng tư", cost: 1500, icon: "star" },
    ];
    rc.appendChild(
        el(`<div class="lg:col-span-3">
    ${C.sectionHead("Reward Center", "Đổi điểm lấy đặc quyền", "")}
    <div class="grid sm:grid-cols-2 gap-3">${rewards
        .map((r) => {
const ok = pts >= r.cost;
return `<div class="card p-4 flex items-center gap-3 reveal ${ok ? "" : "opacity-60"}">
        <div class="w-11 h-11 rounded-xl grad-navy text-white grid place-items-center shrink-0">${svg(r.icon, 18)}</div>
        <div class="flex-1 min-w-0"><p class="text-[13px] font-semibold">${r.name}</p><p class="text-[11px] text-mute">${fmtPts(r.cost)} điểm</p></div>
        <button ${ok ? "" : "disabled"} onclick="redeemReward('${r.name}',${r.cost})" class="btn ${ok ? "btn-primary" : "btn-ghost"} px-3.5 py-2 text-[11px] shrink-0">${ok ? "Đổi" : "Chưa đủ"}</button>
      </div>`;
        })
        .join("")}</div>
  </div>`),
    );
    rc.appendChild(
        el(`<div class="lg:col-span-2">
    ${C.sectionHead("Activity", "Lịch sử điểm", "")}
    <div class="card p-2 reveal">
      <div class="max-h-[360px] overflow-y-auto no-scrollbar divide-y" style="border-color:var(--line)">${State.data.pointHistory
          .map(
  (h) => `
        <div class="flex items-center justify-between px-3 py-3">
          <div><p class="text-[13px] font-medium">${h.t}</p><p class="text-[11px] text-mute">${h.date}</p></div>
          <span class="text-[13px] font-bold ${h.pts >= 0 ? "text-blues-500" : "text-red-500"}">${h.pts >= 0 ? "+" : ""}${h.pts}</span>
        </div>`,
          )
          .join("")}</div>
    </div>
  </div>`),
    );
    wrap.appendChild(rc);

    /* ---------- MEMBER SPOTLIGHT ---------- */
    const testimonials = [
        { q: "Tích điểm nhanh, đổi voucher cực dễ. Mua đồ basic cũng thấy đáng đồng tiền.", n: "Anh Quân", r: "Gold member", seed: "member-quan" },
        { q: "Quà sinh nhật bất ngờ ghê, lại còn được mời tham dự sự kiện riêng tư.", n: "Mai Linh", r: "Black member", seed: "member-linh" },
        { q: "Early access giúp mình mua được capsule giới hạn trước khi cháy hàng.", n: "Đức Huy", r: "Silver member", seed: "member-huy" },
    ];
    wrap.appendChild(
        sec(
            `${C.sectionHead("Spotlight", "Thành viên nói gì", "")}
    <div class="grid sm:grid-cols-3 gap-4">${testimonials
        .map(
(t, i) => `<div class="card p-6 reveal reveal-d${(i % 3) + 1}">
        <div class="flex gap-0.5 text-blues-500 mb-3">${"★★★★★"
.split("")
.map(() => `<span>★</span>`)
.join("")}</div>
        <p class="text-[14px] text-soft leading-relaxed">“${t.q}”</p>
        <div class="flex items-center gap-3 mt-5">
          <div class="w-11 h-11 rounded-full overflow-hidden shrink-0">${fashionSVG(t.seed)}</div>
          <div><p class="text-[13px] font-semibold">${t.n}</p><p class="text-[11px] text-mute">${t.r}</p></div>
        </div>
      </div>`,
        )
        .join("")}</div>`,
            "py-12",
        ),
    );

    /* ---------- FAQ ---------- */
    const memberFaqs = [
        ["Tham gia Membership có mất phí không?", "Hoàn toàn miễn phí. Chỉ cần tạo tài khoản là bạn đã là thành viên Blue và nhận ngay quà chào mừng."],
        ["Tích điểm như thế nào?", "Mỗi 10.000đ chi tiêu = 1 điểm. Ngoài ra bạn được điểm khi đánh giá sản phẩm, giới thiệu bạn bè, vào sinh nhật và trong các ngày Member Days."],
        ["Điểm có hết hạn không?", "Điểm có hiệu lực 12 tháng kể từ lần tích gần nhất. Mỗi giao dịch mới sẽ tự động gia hạn toàn bộ điểm của bạn."],
        ["Đổi điểm được những gì?", "Voucher, freeship, styling 1:1, early access capsule và vé sự kiện riêng tư — đổi trực tiếp tại Reward Center."],
        ["Làm sao để lên hạng?", "Hạng xét theo tổng điểm tích luỹ: Blue → Silver (300) → Gold (1.000) → Black (2.500). Hệ thống đánh giá lại mỗi quý."],
        ["Freeship áp dụng ra sao?", "Thành viên freeship đơn từ 500.000đ; hạng Silver trở lên freeship đơn từ 1.000.000đ, và đơn hàng đầu tiên luôn được freeship."],
    ];
    wrap.appendChild(
        sec(
            `${C.sectionHead("FAQ", "Câu hỏi thường gặp", "")}
    <div class="max-w-3xl reveal">${memberFaqs
        .map(([q, a]) => accordion(q, `<p class="text-[13px] text-soft leading-relaxed">${a}</p>`))
        .join("")}</div>`,
            "py-12",
        ),
    );

    /* ---------- FINAL CTA (image) ---------- */
    wrap.appendChild(
        el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pb-16">
    <div class="relative overflow-hidden rounded-2xl reveal min-h-[300px] flex items-center">
      <div class="absolute inset-0">${heroSVG("membership-cta")}</div>
      <div class="absolute inset-0" style="background:linear-gradient(90deg, rgba(8,14,36,.88), rgba(8,14,36,.4))"></div>
      <div class="relative p-8 sm:p-12 text-white max-w-lg">
        <h3 class="headline text-3xl sm:text-4xl">Tham gia miễn phí hôm nay</h3>
        <p class="text-white/80 mt-3 text-sm leading-relaxed">Mỗi đơn hàng, mỗi đánh giá đều đưa bạn đến gần hơn với những đặc quyền thành viên The Blues.</p>
        <div class="flex flex-wrap gap-3 mt-6">
          <button onclick="Router.go('shop')" class="btn px-7 py-3.5 text-sm" style="background:#fff;color:var(--ink)">Mua sắm & tích điểm</button>
          <button onclick="Router.go('account')" class="btn px-7 py-3.5 text-sm" style="background:rgba(255,255,255,.14);color:#fff;backdrop-filter:blur(6px)">Tài khoản của tôi</button>
        </div>
      </div>
    </div>
  </section>`),
    );

    return wrap;
});

function redeemReward(name, cost) {
    if (State.data.points < cost) {
        UI.toast("Chưa đủ điểm", "Bạn cần thêm điểm để đổi quà này", "info");
        return;
    }
    State.data.points -= cost;
    State.data.pointHistory.unshift({
        t: `Đổi: ${name}`,
        pts: -cost,
        date: new Date().toLocaleDateString("vi-VN"),
    });
    State.data.vouchers.unshift({
        code: "RWD" + uid().slice(0, 4).toUpperCase(),
        label: name,
        value: "Đã đổi",
        exp: "90 ngày",
        used: false,
    });
    State.emit();
    UI.toast("🎁 Đổi quà thành công", `${name} đã được thêm vào ví voucher`, "check");
    Router.go("loyalty");
}

