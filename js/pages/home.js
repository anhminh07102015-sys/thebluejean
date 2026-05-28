/* =====================================================================
   PAGE: HOME
   ===================================================================== */
const HERO = [
    {
        tag: "SS26 · Indigo Capsule",
        title: "Raw Indigo,<br>Refined.",
        sub: "Japanese selvedge denim woven on vintage shuttle looms. The new SS26 capsule has landed.",
        cta: "Khám phá BST",
        route: ["shop", { collection: "SS26 Indigo" }],
        pal: "ink",
        seed: "hero1",
    },
    {
        tag: "The Selvedge Archive",
        title: "Built to<br>Fade Beautifully.",
        sub: "14.5oz unsanforized denim that ages with you — every crease a record of where you’ve been.",
        cta: "Xem Denim",
        route: ["shop", { cat: "Denim" }],
        pal: "raw",
        seed: "hero2",
    },
    {
        tag: "Membership",
        title: "For the<br>Few.",
        sub: "Truy cập capsule giới hạn, sự kiện riêng tư, và đặc quyền không bán đại trà.",
        cta: "Tham gia Membership",
        route: ["loyalty", {}],
        pal: "navy",
        seed: "hero3",
    },
];

Router.add("home", async () => {
    const wrap = el("<div></div>");
    /* HERO */
    wrap.appendChild(
        el(`<section class="relative h-[88vh] min-h-[560px] overflow-hidden">
    <div class="hero-bg" id="heroSlides">
      ${HERO.map(
          (h, i) => `<div class="hero-slide ${i === 0 ? "active" : ""}" data-i="${i}">
        <div class="hero-img">${heroSVG(h.seed, h.pal)}</div>
        <div class="absolute inset-0" style="background:linear-gradient(105deg,rgba(8,12,28,.78) 0%,rgba(8,12,28,.35) 45%,rgba(8,12,28,.1) 100%)"></div>
      </div>`,
      ).join("")}
    </div>
    <div class="relative h-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
      <div class="max-w-xl text-white" id="heroContent"></div>
    </div>
    <div class="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-10" id="heroDots">
      ${HERO.map((_, i) => `<button data-dot="${i}" class="h-1 rounded-full transition-all duration-500 ${i === 0 ? "w-8 bg-white" : "w-4 bg-white/40"}" onclick="goHeroSlide(${i})"></button>`).join("")}
    </div>
    <div class="absolute bottom-7 right-8 hidden lg:flex items-center gap-3 text-white/60 text-[11px] tracking-widest z-10">
      <span class="font-mono" id="heroNum">01</span><span class="w-10 h-px bg-white/30"></span><span class="font-mono">03</span>
    </div>
  </section>`),
    );

    /* render hero content + autoplay */
    setTimeout(() => {
        renderHeroContent(0);
        startHero();
    }, 50);

    /* trust strip — with icons */
    const tIcons = [
        '<path d="M3 9h18l-1.5 11h-15Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
        '<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6Z"/>',
        '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 18.5a2 2 0 1 0 .01 0M18.5 18.5a2 2 0 1 0 .01 0"/>',
        '<path d="M20 6 9 17l-5-5"/>',
    ];
    wrap.appendChild(
        el(`<section class="border-y hairline">
    <div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 hairline">
      ${[
          ["Selvedge Nhật", "Vải shuttle-loom 14oz"],
          ["May thủ công", "Atelier Đà Nẵng"],
          ["Free express ship", "Đơn từ 1.000.000đ"],
          ["Bảo hành 12 tháng", "Sửa chữa trọn đời"],
      ]
          .map(
  ([t, s], i) => `
        <div class="py-6 px-5 flex items-center gap-3 reveal reveal-d${(i % 4) + 1}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-blues-500 shrink-0"><g>${tIcons[i]}</g></svg>
          <div><p class="title-exp font-bold text-[13px] tracking-wide">${t}</p><p class="text-mute text-[12px] mt-0.5">${s}</p></div></div>`,
          )
          .join("")}
    </div></section>`),
    );

    const sec = (inner) => {
        const s = el(
            `<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-20"></section>`,
        );
        s.innerHTML = inner;
        return s;
    };

    /* WHY THE BLUES — value proposition */
    const whyItems = [
        [
            "M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6Z",
            "Vải tuyển chọn",
            "Selvedge dệt trên khung shuttle cổ điển tại Okayama. Càng mặc càng đẹp, fade tự nhiên theo dấu ấn riêng của bạn.",
        ],
        [
            "M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M9 13h.01M9 17h.01",
            "Sản xuất minh bạch",
            "Kiểm soát từng công đoạn tại atelier riêng — từ sợi đến đường may chốt tay. Biết rõ nơi và cách mọi thứ được tạo ra.",
        ],
        [
            "m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z",
            "Đặc quyền thành viên",
            "Membership với 4 hạng — tích điểm qua từng trải nghiệm, mở khoá capsule giới hạn và sự kiện riêng tư.",
        ],
        [
            "M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.85a5.5 5.5 0 0 0 0-7.78Z",
            "Chăm sóc trọn đời",
            "Bảo hành đường may 12 tháng và sửa chữa trọn đời cho Membership. Chúng tôi muốn sản phẩm sống cùng bạn thật lâu.",
        ],
    ];
    wrap.appendChild(
        sec(`${C.sectionHead("Why The Blues", "Khác biệt nằm ở chi tiết", "Bốn cam kết định hình mọi thứ chúng tôi làm.")}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${whyItems
        .map(
([ic, t, d], i) => `
      <div class="card card-hover p-6 reveal reveal-d${(i % 4) + 1}">
        <div class="w-12 h-12 rounded-2xl grad-navy text-white grid place-items-center mb-4"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${ic}"/></svg></div>
        <h3 class="headline text-lg mb-2">${t}</h3>
        <p class="text-[13px] text-mute leading-relaxed">${d}</p>
      </div>`,
        )
        .join("")}</div>`),
    );

    /* SHOP BY CATEGORY — interactive tiles */
    const catImg = {
        Denim: "indigo",
        Outerwear: "ink",
        Knitwear: "ecru",
        Shirts: "wash",
        Tees: "stone",
        Accessories: "raw",
    };
    wrap.appendChild(
        sec(`${C.sectionHead("Browse", "Mua theo danh mục", "Tìm nhanh đúng thứ bạn cần.", { label: "Tất cả sản phẩm", action: "Router.go('shop')" })}
    <div class="grid grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr gap-3 lg:gap-4">${CATS.map(
        (c, i) => `
      <div onclick="Router.go('shop',{cat:'${c}'})" class="relative ${i === 0 ? "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-[1/0.755]" : "aspect-[4/3]"} rounded-2xl overflow-hidden group cursor-pointer reveal">
        <div class="zoom-wrap h-full">${fashionSVG("cat-" + c, catImg[c] || "indigo", "")}</div>
        ${i === 0 ? `<span class="badge absolute top-4 left-4 text-white" style="background:rgba(255,255,255,.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2)">Featured</span>` : ""}
        <div class="absolute inset-0 flex flex-col justify-end p-5 lg:p-6" style="background:linear-gradient(to top,rgba(10,18,48,.78),transparent 55%)">
          <p class="kicker text-white/60 mb-1">${String(PRODUCTS.filter((p) => p.cat === c).length).padStart(2, "0")} sản phẩm</p>
          <h3 class="text-white font-display ${i === 0 ? "text-3xl lg:text-4xl" : "text-2xl lg:text-[26px]"} leading-none">${c}</h3>
          <span class="text-white/75 text-[12px] mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">Mua ngay <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </div></div>`,
    ).join("")}</div>`),
    );

    /* SEASONAL SLIDER / collections */
    const collCards = COLLECTIONS.map(
        (
            c,
            i,
        ) => `<div class="snap-start shrink-0 w-[280px] sm:w-[320px] group cursor-pointer reveal" onclick="Router.go('shop',{collection:'${c}'})">
    <div class="aspect-[3/4] rounded-2xl overflow-hidden relative card-hover card">
      <div class="zoom-wrap h-full">${fashionSVG("coll" + i, Object.keys(PAL)[i % 6])}</div>
      <div class="absolute inset-0 flex flex-col justify-end p-5" style="background:linear-gradient(to top,rgba(10,18,48,.8),transparent 60%)">
        <p class="kicker text-white/60 mb-1">Collection ${String(i + 1).padStart(2, "0")}</p>
        <h3 class="text-white font-display text-2xl leading-none">${c}</h3>
        <span class="text-white/70 text-[12px] mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">Khám phá <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </div></div></div>`,
    ).join("");
    const seasonal =
        sec(`${C.sectionHead("Seasonal Edit", "BST theo mùa", "Những capsule được tuyển chọn, cập nhật theo từng mùa.", { label: "Tất cả BST", action: "Router.go('shop')" })}
    ${C.carousel("collCar", collCards)}`);
    wrap.appendChild(seasonal);

    /* FLASH SALE */
    const saleItems = PRODUCTS.filter((p) => p.tag === "sale").slice(0, 4);
    wrap.appendChild(
        el(`<section class="reveal"><div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10">
    <div class="rounded-3xl overflow-hidden relative p-8 lg:p-12" style="background:var(--grad-navy)">
      <div class="absolute inset-0 opacity-30" style="background:radial-gradient(circle at 80% 20%,rgba(255,255,255,.25),transparent 50%)"></div>
      <div class="relative grid lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-4 text-white">
          <p class="kicker text-white/60 mb-3">Limited time</p>
          <h2 class="headline text-4xl lg:text-5xl mb-3">Indigo<br>Flash Sale</h2>
          <p class="text-white/70 text-sm mb-5 max-w-xs">Tuyển chọn -22% trong 48 giờ. Thành viên Membership giảm thêm.</p>
          <div class="flex gap-2.5" id="saleTimer"></div>
          <button onclick="Router.go('shop',{tag:'sale'})" class="btn bg-white text-blues-700 mt-6 px-6 py-3 text-sm font-semibold magnetic">Mua ngay</button>
        </div>
        <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${saleItems
  .map(
      (
          p,
      ) => `<div class="cursor-pointer group" onclick="Router.go('product',{id:'${p.id}'})">
<div class="aspect-[4/5] rounded-xl overflow-hidden relative mb-2"><div class="zoom-wrap h-full">${fashionSVG(p.id, p.palette)}</div>
<span class="badge absolute top-2 left-2" style="background:#dc2626;color:#fff">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span></div>
<p class="text-white text-[11px] font-medium clamp-2 leading-tight">${p.name}</p>
<p class="text-white text-[12px] font-bold">${fmt(p.price)} <span class="text-white/50 line-through font-normal text-[10px]">${fmt(p.oldPrice)}</span></p></div>`,
  )
  .join("")}
        </div>
      </div></div></div></section>`),
    );
    setTimeout(startSaleTimer, 60);

    /* BEST SELLERS */
    const best = PRODUCTS.filter((p) => p.tag === "best");
    wrap.appendChild(
        sec(`${C.sectionHead("Most Wanted", "Best Sellers", "Những thiết kế được yêu thích nhất mùa này.", { label: "Xem tất cả", action: "Router.go('shop')" })}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${best.map((p) => C.productCard(p)).join("")}</div>`),
    );

    /* FEATURED DENIM banner */
    wrap.appendChild(
        el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-8">
    <div class="grid lg:grid-cols-2 rounded-3xl overflow-hidden card reveal">
      <div class="relative aspect-[4/3] lg:aspect-auto min-h-[340px]">${heroSVG("denimfeat", "raw")}
        <div class="absolute inset-0" style="background:linear-gradient(45deg,rgba(10,18,48,.5),transparent)"></div></div>
      <div class="p-8 lg:p-14 flex flex-col justify-center">
        <p class="kicker text-blues-500 mb-3">The Denim Atelier</p>
        <h2 class="headline text-3xl lg:text-[42px] mb-4">Một chiếc quần jean<br>cho cả một thập kỷ.</h2>
        <p class="text-soft text-[14px] leading-relaxed mb-6 max-w-md">Dệt từ cotton selvedge Okayama 14.5oz, mỗi đường may được hoàn thiện thủ công tại atelier của chúng tôi. Đây không phải fast fashion — đây là di sản bạn mặc mỗi ngày.</p>
        <div class="flex gap-3"><button onclick="Router.go('shop',{cat:'Denim'})" class="btn btn-primary px-6 py-3 text-sm">Khám phá Denim</button>
        <button onclick="Router.go('about')" class="btn btn-ghost px-6 py-3 text-sm">Câu chuyện</button></div>
      </div></div></section>`),
    );

    /* NEW ARRIVALS carousel */
    const arrivals = PRODUCTS.filter((p) => p.tag === "new");
    wrap.appendChild(
        sec(`${C.sectionHead("Just Landed", "New Arrivals", "Vừa cập bến tại The Blues.", { label: "Tất cả hàng mới", action: "Router.go('shop',{tag:'new'})" })}
    ${C.carousel("arrCar", arrivals.map((p) => `<div class="snap-start shrink-0 w-[230px] sm:w-[260px]">${C.productCard(p)}</div>`).join(""))}`),
    );

    /* BRAND CAMPAIGN */
    wrap.appendChild(
        el(`<section class="relative h-[70vh] min-h-[440px] my-8 overflow-hidden reveal">
    <div class="absolute inset-0">${heroSVG("campaign", "ink")}<div class="absolute inset-0" style="background:linear-gradient(to right,rgba(8,12,28,.7),transparent)"></div></div>
    <div class="relative h-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
      <div class="max-w-lg text-white">
        <p class="kicker text-white/60 mb-4">Campaign · SS26</p>
        <h2 class="headline text-5xl lg:text-7xl mb-5">In Blue<br>We Trust.</h2>
        <p class="text-white/70 text-[15px] leading-relaxed mb-7 max-w-md">Một sắc indigo. Vô vàn cách kể câu chuyện của riêng bạn.</p>
        <button onclick="Router.go('lookbook')" class="btn glass text-white px-7 py-3.5 text-sm magnetic">Xem Lookbook</button>
      </div></div></section>`),
    );

    /* BRAND STATS — animated counters */
    wrap.appendChild(
        el(`<section class="border-y hairline reveal">
    <div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12 lg:py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      ${[
          ["48", "BST đã ra mắt"],
          ["12.400", "Khách hàng tin dùng"],
          ["98", "% hài lòng"],
          ["9", "Quốc gia giao hàng"],
      ]
          .map(
  ([n, l]) => `
        <div><p class="headline text-4xl lg:text-6xl text-blues-500 count" data-to="${n}">0</p><p class="text-mute text-[13px] mt-2">${l}</p></div>`,
          )
          .join("")}
    </div></section>`),
    );

    /* FABRIC STORY — editorial split */
    wrap.appendChild(
        el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
    <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div class="lg:col-span-6 reveal"><div class="rounded-3xl overflow-hidden aspect-[5/6] relative card">${fashionSVG("fabric-story", "indigo", "14oz SELVEDGE")}
        <div class="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 flex items-center justify-between">
          <div><p class="text-[10px] kicker text-mute">Okayama Mill</p><p class="text-[13px] font-semibold">Raw Selvedge 14oz</p></div>
          <button onclick="Router.go('shop',{cat:'Denim'})" class="btn btn-primary px-4 py-2 text-[11px]">Mua vải này</button>
        </div></div></div>
      <div class="lg:col-span-6 reveal">
        <p class="kicker text-blues-500 mb-3">The Fabric Story</p>
        <h2 class="headline text-4xl lg:text-5xl leading-[1.02]">Chàm thật. <br>Phai theo thời gian của bạn.</h2>
        <p class="text-soft leading-relaxed mt-5 max-w-md">Mỗi mét vải được nhuộm chàm tự nhiên nhiều lớp, dệt trên khung shuttle cổ điển. Sau vài tháng mặc, denim bắt đầu "kể chuyện" — những vệt fade ở đầu gối, mép túi, nếp gấp đều là dấu ấn không ai sao chép được.</p>
        <div class="grid grid-cols-3 gap-4 mt-8">
          ${[
  ["14oz", "Trọng lượng vải"],
  ["100%", "Cotton hữu cơ"],
  ["3 lớp", "Nhuộm chàm"],
          ]
  .map(
      ([n, l]) =>
          `<div class="pl-4" style="border-left:2px solid var(--blues)"><p class="headline text-2xl">${n}</p><p class="text-[11px] text-mute mt-1">${l}</p></div>`,
  )
  .join("")}
        </div>
        <button onclick="Router.go('about')" class="btn btn-ghost px-6 py-3 text-sm mt-8">Tìm hiểu quy trình →</button>
      </div>
    </div></section>`),
    );

    /* PRESS — as seen in (marquee) */
    wrap.appendChild(
        el(`<section class="py-10 overflow-hidden reveal">
    <p class="text-center kicker text-mute mb-6">Được nhắc đến trên</p>
    <div class="marquee-wrap relative overflow-hidden">
      <div class="marq items-center gap-16 whitespace-nowrap">
        ${Array.from({ length: 2 })
.map(() =>
    [
        "VOGUE",
        "GQ",
        "ELLE",
        "L'OFFICIEL",
        "ESQUIRE",
        "HIGHSNOBIETY",
        "HYPEBEAST",
        "DAZED",
    ]
        .map(
            (b) =>
                `<span class="title-exp font-bold text-2xl lg:text-3xl tracking-[.1em] mx-8" style="opacity:.4">${b}</span>`,
        )
        .join(""),
)
.join("")}
      </div>
    </div></section>`),
    );

    /* TRENDING OUTFITS / lookbook preview */
    wrap.appendChild(
        sec(`${C.sectionHead("Style Edit", "Trending Outfits", "Cách stylist của chúng tôi phối SS26.", { label: "Full Lookbook", action: "Router.go('lookbook')" })}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${["Indigo Monochrome", "Selvedge Layers", "Workwear Hybrid", "Quiet Tailoring"]
          .map(
  (t, i) => `
        <div class="group cursor-pointer reveal reveal-d${i + 1}" onclick="Router.go('lookbook')">
          <div class="aspect-[3/4] rounded-2xl overflow-hidden relative card card-hover"><div class="zoom-wrap h-full">${fashionSVG("look" + i, Object.keys(PAL)[(i + 2) % 6])}</div>
<div class="absolute inset-0 flex items-end p-5" style="background:linear-gradient(to top,rgba(10,18,48,.7),transparent 55%)">
  <div><p class="kicker text-white/60">Look ${i + 1}</p><p class="text-white font-display text-xl">${t}</p></div></div></div></div>`,
          )
          .join("")}
    </div>`),
    );

    /* CUSTOMER REVIEWS */
    wrap.appendChild(
        sec(`${C.sectionHead("Loved by thousands", "Khách hàng nói gì", "Hơn 12.000 đánh giá 5 sao.", "")}
    <div class="grid lg:grid-cols-12 gap-4 items-stretch">
      <div class="lg:col-span-4 card p-7 reveal flex flex-col justify-center">
        <div class="flex items-end gap-3"><p class="headline text-6xl">4.9</p><div class="mb-2"><div class="text-amber-400 text-lg">★★★★★</div><p class="text-[12px] text-mute mt-0.5">12.480 đánh giá</p></div></div>
        <div class="mt-5 space-y-1.5">${[
[5, 86],
[4, 11],
[3, 2],
[2, 1],
[1, 0],
        ]
.map(
    ([s, pct]) => `
          <div class="flex items-center gap-2 text-[11px]"><span class="text-mute w-3">${s}</span><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" class="text-amber-400"><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z"/></svg>
          <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background:var(--line)"><div class="h-full rounded-full" style="width:${pct}%;background:var(--grad-navy)"></div></div><span class="text-mute w-7 text-right">${pct}%</span></div>`,
)
.join("")}</div>
      </div>
      <div class="lg:col-span-8 grid sm:grid-cols-3 gap-4">
      ${[
          [
  "“Vải dày, form chuẩn, fade lên cực đẹp sau 2 tháng. Đáng từng đồng.”",
  "Minh T.",
  "Gold member",
          ],
          [
  "“Đóng gói như mở một món quà. Đây là cảm giác premium thật sự.”",
  "David L.",
  "Black member",
          ],
          [
  "“Service chu đáo, sửa quần miễn phí. Sẽ quay lại nhiều lần nữa.”",
  "Quang N.",
  "Silver member",
          ],
      ]
          .map(
  ([q, n, t], i) => `
        <div class="card p-7 reveal reveal-d${i + 1}">
          <div class="text-amber-400 text-sm mb-4">★★★★★</div>
          <p class="font-display text-[17px] leading-relaxed mb-5">${q}</p>
          <div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full grad-navy"></div>
          <div><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-mute">${t}</p></div></div>
        </div>`,
          )
          .join("")}
      </div>
    </div>`),
    );

    /* MEMBERSHIP TEASER */
    wrap.appendChild(
        el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-8 reveal">
    <div class="rounded-3xl p-8 lg:p-14 relative overflow-hidden" style="background:var(--grad-navy)">
      <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full" style="background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%)"></div>
      <div class="relative grid lg:grid-cols-2 gap-10 items-center">
        <div class="text-white">
          <p class="kicker text-white/60 mb-3">The Blues Membership</p>
          <h2 class="headline text-4xl lg:text-5xl mb-4">Membership</h2>
          <p class="text-white/70 text-[15px] leading-relaxed mb-6 max-w-md">4 hạng thành viên với đặc quyền tăng dần — từ welcome voucher đến capsule giới hạn và sự kiện riêng tư.</p>
          <div class="flex gap-3"><button onclick="Router.go('loyalty')" class="btn bg-white text-blues-700 px-6 py-3 text-sm font-semibold magnetic">Khám phá quyền lợi</button></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          ${TIERS.map(
  (
      t,
  ) => `<div class="rounded-xl p-4 border border-white/15" style="background:rgba(255,255,255,.06)">
<div class="w-8 h-8 rounded-lg mb-2" style="background:${t.grad}"></div>
<p class="text-white text-[13px] font-semibold">${t.name.split(" ")[0]}</p>
<p class="text-white/50 text-[10px]">${t.min}${t.max === Infinity ? "+" : "–" + t.max} điểm</p></div>`,
          ).join("")}
        </div>
      </div></div></section>`),
    );

    /* INSTAGRAM GALLERY */
    wrap.appendChild(
        sec(`${C.sectionHead("@theblues.atelier", "Cộng đồng The Blues", "Tag #InBlueWeTrust để được giới thiệu.", "")}
    <div class="grid grid-cols-3 lg:grid-cols-6 gap-2.5">
      ${Array.from(
          { length: 6 },
          (
  _,
  i,
          ) => `<div class="aspect-square rounded-xl overflow-hidden relative group cursor-pointer reveal reveal-d${(i % 5) + 1}">
        <div class="zoom-wrap h-full">${fashionSVG("ig" + i, Object.keys(PAL)[i % 6])}</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6" class="opacity-0 group-hover:opacity-100 transition"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></div></div>`,
      ).join("")}
    </div>`),
    );

    /* THE JOURNAL — blog preview */
    const posts = [
        [
            "Styling",
            "5 cách phối raw denim cho mùa hè",
            "Từ monochrome indigo đến layering nhẹ — cẩm nang của stylist The Blues.",
            "wash",
        ],
        [
            "Care Guide",
            "Cách giặt jeans để fade đẹp nhất",
            "Vì sao bạn nên giặt ít hơn bạn nghĩ, và làm thế nào để giữ form vải.",
            "indigo",
        ],
        [
            "Atelier",
            "Một ngày tại xưởng Đà Nẵng",
            "Theo chân những người thợ may dựng nên từng đường chỉ chốt tay.",
            "ecru",
        ],
    ];
    wrap.appendChild(
        sec(`${C.sectionHead("The Journal", "Câu chuyện & cẩm nang", "Đọc, học và mặc đẹp hơn.", { label: "Tất cả bài viết", action: "Router.go('about')" })}
    <div class="grid md:grid-cols-3 gap-4">${posts
        .map(
([cat, t, d, pal], i) => `
      <article onclick="Router.go('about')" class="card card-hover overflow-hidden cursor-pointer group reveal reveal-d${i + 1}">
        <div class="aspect-[16/10] overflow-hidden relative"><div class="zoom-wrap h-full">${fashionSVG("journal-" + i, pal)}</div>
          <span class="badge absolute top-3 left-3" style="background:var(--grad-navy);color:#fff">${cat}</span></div>
        <div class="p-5"><h3 class="headline text-lg leading-tight group-hover:text-blues-500 transition">${t}</h3>
          <p class="text-[13px] text-mute mt-2 leading-relaxed clamp-2">${d}</p>
          <span class="text-[12px] text-blues-500 mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Đọc tiếp <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>
      </article>`,
        )
        .join("")}</div>`),
    );

    /* FAQ accordion */
    const faqs = [
        [
            "Thời gian giao hàng bao lâu?",
            "Đơn nội thành 1–2 ngày, toàn quốc 2–4 ngày. Miễn phí express cho đơn từ 1.000.000đ.",
        ],
        [
            "Chính sách đổi trả thế nào?",
            "Đổi trả miễn phí trong 30 ngày với sản phẩm còn nguyên tem mác. Hoàn tiền trong 5–7 ngày làm việc.",
        ],
        [
            "Bảo hành sản phẩm ra sao?",
            "Bảo hành đường may 12 tháng. Riêng Membership được sửa chữa trọn đời miễn phí.",
        ],
        [
            "Làm sao để chọn đúng size?",
            "Mỗi sản phẩm có bảng size chi tiết và hướng dẫn đo. Bạn cũng có thể nhắn để được tư vấn fit 1:1.",
        ],
        [
            "Điểm thành viên hoạt động thế nào?",
            "10.000đ chi tiêu = 1 điểm. 100 điểm đổi được 50.000đ, tối đa 20% giá trị đơn. Tích điểm còn giúp bạn thăng hạng Membership.",
        ],
        [
            "The Blues sản xuất ở đâu?",
            "Vải selvedge từ Okayama (Nhật), may và hoàn thiện tại atelier riêng ở Đà Nẵng.",
        ],
    ];
    wrap.appendChild(
        el(`<section class="max-w-[820px] mx-auto px-5 sm:px-8 py-16 lg:py-20">
    <div class="text-center mb-10 reveal"><p class="kicker text-blues-500 mb-3">Hỏi & đáp</p><h2 class="headline text-4xl lg:text-5xl">Câu hỏi thường gặp</h2></div>
    <div class="card divide-y px-5 sm:px-7 reveal" style="border-color:var(--line)">
      ${faqs.map(([q, a]) => accordion(q, `<p class="text-[13.5px] text-soft leading-relaxed">${a}</p>`)).join("")}
    </div>
    <p class="text-center text-[13px] text-mute mt-6 reveal">Còn thắc mắc khác? <button onclick="Router.go('about')" class="text-blues-500 hover:underline">Liên hệ với chúng tôi →</button></p>
  </section>`),
    );

    /* NEWSLETTER */
    wrap.appendChild(
        el(`<section class="max-w-[760px] mx-auto px-5 py-20 text-center reveal">
    <p class="kicker text-blues-500 mb-3">Stay in the loop</p>
    <h2 class="headline text-4xl lg:text-5xl mb-4">The Insider Letter</h2>
    <p class="text-soft text-sm mb-7 max-w-md mx-auto">Drop sớm, capsule độc quyền và +50 điểm thành viên khi đăng ký.</p>
    <div class="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
      <input id="homeNews" placeholder="Email của bạn" class="flex-1 surface border hairline rounded-full px-5 py-3.5 text-sm">
      <button onclick="homeSignup()" class="btn btn-primary px-7 py-3.5 text-sm">Đăng ký nhận tin</button>
    </div></section>`),
    );

    return wrap;
});
function homeSignup() {
    const v = $("#homeNews");
    if (!v.value) {
        UI.toast("Email", "Vui lòng nhập email", "info");
        return;
    }
    v.value = "";
    Loyalty.earn(50, "Đăng ký newsletter");
    CRM.fire("register");
}

/* hero engine */
let heroIdx = 0,
    heroTimer = null;
function renderHeroContent(i) {
    const h = HERO[i];
    const c = $("#heroContent");
    if (!c) return;
    c.innerHTML = `<p class="kicker text-white/60 mb-4 anim-float">${h.tag}</p>
    <h1 class="headline text-5xl sm:text-6xl lg:text-7xl mb-5 anim-float" style="animation-delay:.08s">${h.title}</h1>
    <p class="text-white/75 text-[15px] sm:text-base leading-relaxed mb-8 max-w-md anim-float" style="animation-delay:.16s">${h.sub}</p>
    <div class="flex flex-wrap gap-3 anim-float" style="animation-delay:.24s">
      <button onclick="Router.go('${h.route[0]}',${JSON.stringify(h.route[1])})" class="btn btn-light px-7 py-3.5 text-sm magnetic glow-ring">${h.cta}</button>
      <button onclick="Router.go('about')" class="btn glass text-white px-7 py-3.5 text-sm">Câu chuyện thương hiệu</button>
    </div>`;
    UI.bindMagnetic();
}
function goHeroSlide(i) {
    heroIdx = i;
    $$("#heroSlides .hero-slide").forEach((s, j) => {
        s.classList.toggle("active", j === i);
        if (j === i) {
            const im = s.querySelector(".hero-img");
            im.style.animation = "none";
            void im.offsetWidth;
            im.style.animation = "";
        }
    });
    $$("#heroDots [data-dot]").forEach((d, j) => {
        d.className = `h-1 rounded-full transition-all duration-500 ${j === i ? "w-8 bg-white" : "w-4 bg-white/40"}`;
    });
    const num = $("#heroNum");
    if (num) num.textContent = String(i + 1).padStart(2, "0");
    renderHeroContent(i);
    resetHeroTimer();
}
function startHero() {
    resetHeroTimer();
}
function resetHeroTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
        if (!$("#heroSlides")) {
            clearInterval(heroTimer);
            return;
        }
        goHeroSlide((heroIdx + 1) % HERO.length);
    }, 5500);
}

/* sale countdown */
function startSaleTimer() {
    const wrap = $("#saleTimer");
    if (!wrap) return;
    let end = Date.now() + 1000 * 60 * 60 * 47 + 1000 * 60 * 23;
    const tick = () => {
        if (!$("#saleTimer")) return clearInterval(t);
        let d = Math.max(0, end - Date.now());
        const h = Math.floor(d / 3.6e6),
            m = Math.floor((d % 3.6e6) / 6e4),
            s = Math.floor((d % 6e4) / 1e3);
        wrap.innerHTML = [
            [h, "GIỜ"],
            [m, "PHÚT"],
            [s, "GIÂY"],
        ]
            .map(
                ([v, l]) =>
                    `<div class="text-center"><div class="bg-white/15 rounded-lg px-3 py-2 min-w-[52px] text-white font-mono text-xl font-bold">${String(v).padStart(2, "0")}</div><p class="text-white/50 text-[9px] mt-1 tracking-widest">${l}</p></div>`,
            )
            .join("");
    };
    tick();
    const t = setInterval(tick, 1000);
}

