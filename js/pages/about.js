/* =====================================================================
   PAGE: ABOUT  ·  Editorial brand story
   ===================================================================== */
Router.add("about", async () => {
    const wrap = el("<div></div>");
    /* cinematic hero */
    wrap.appendChild(
        el(`<section class="relative h-[70vh] min-h-[440px] overflow-hidden">
    <div class="absolute inset-0">${heroSVG("about-hero", "indigo")}</div>
    <div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(10,15,35,.2),rgba(10,15,35,.7))"></div>
    <div class="absolute inset-0 flex items-center"><div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 w-full">
      <p class="kicker text-white/70 mb-3 reveal">Est. 2026 · Sài Gòn</p>
      <h1 class="headline text-5xl sm:text-6xl lg:text-8xl text-white max-w-3xl leading-[0.95] reveal">Denim, làm đúng cách.</h1>
      <p class="text-white/80 max-w-lg mt-5 reveal">The Blues là một xưởng denim hiện đại — nơi kỹ thuật selvedge truyền thống gặp tinh thần thiết kế Hàn Quốc tối giản.</p>
    </div></div>
  </section>`),
    );

    /* philosophy */
    const sec = (inner) => {
        const s = el(
            `<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24"></section>`,
        );
        s.innerHTML = inner;
        return s;
    };
    wrap.appendChild(
        sec(`<div class="grid lg:grid-cols-12 gap-8 items-start">
    <div class="lg:col-span-4"><p class="kicker text-blues-500 mb-3 reveal">Triết lý</p><h2 class="headline text-4xl reveal">Vải kể chuyện<br>theo thời gian.</h2></div>
    <div class="lg:col-span-8 grid sm:grid-cols-2 gap-8">
      <p class="text-soft leading-relaxed reveal">Chúng tôi tin rằng một chiếc quần jeans tốt sẽ đẹp hơn sau mười năm. Mỗi nếp gấp, mỗi vệt phai là dấu vết của người mặc — không thể sao chép. Đó là lý do mọi sản phẩm The Blues được làm để sống cùng bạn, không phải để thay thế theo mùa.</p>
      <p class="text-soft leading-relaxed reveal">Từ sợi cotton hữu cơ đến đường may chốt tay, chúng tôi kiểm soát từng công đoạn. Ít hơn nhưng tốt hơn — và minh bạch về nơi, cách mọi thứ được tạo ra.</p>
    </div>
  </div>`),
    );

    /* stats */
    wrap.appendChild(
        el(`<section class="border-y" style="border-color:var(--line);background:var(--surface)"><div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
    ${[
        ["14oz", "Selvedge denim Nhật"],
        ["100%", "Cotton hữu cơ GOTS"],
        ["12", "Tháng bảo hành đường may"],
        ["0", "Tồn kho đốt bỏ"],
    ]
        .map(
([n, l]) =>
    `<div class="reveal"><p class="headline text-4xl lg:text-5xl text-blues-500">${n}</p><p class="text-mute text-sm mt-2">${l}</p></div>`,
        )
        .join("")}
  </div></section>`),
    );

    /* craftsmanship / process */
    wrap.appendChild(
        sec(`${C.sectionHead("Craftsmanship", "Quy trình sản xuất", "Bốn bước, kiểm soát hoàn toàn — từ sợi đến sản phẩm hoàn thiện.")}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${[
          ["01", "Sợi & dệt", "Selvedge dệt trên khung shuttle cổ điển tại Okayama."],
          ["02", "Nhuộm indigo", "Nhuộm chàm tự nhiên nhiều lớp cho độ phai đẹp theo thời gian."],
          ["03", "Cắt may", "May tại atelier Đà Nẵng, đường may chốt tay bền bỉ."],
          ["04", "Hoàn thiện", "Wash, kiểm định và đóng gói tối giản, tái chế 100%."],
      ]
          .map(
  ([n, t, d]) => `
        <div class="card p-6 reveal"><p class="headline text-2xl text-blues-500/30">${n}</p><h3 class="font-semibold mt-3">${t}</h3><p class="text-[13px] text-mute mt-2 leading-relaxed">${d}</p></div>`,
          )
          .join("")}
    </div>`),
    );

    /* sustainability split */
    wrap.appendChild(
        sec(`<div class="grid lg:grid-cols-2 gap-8 items-center">
    <div class="reveal rounded-2xl overflow-hidden aspect-[4/3]">${heroSVG("sustain", "raw")}</div>
    <div class="reveal"><p class="kicker text-blues-500 mb-3">Bền vững</p>
      <h2 class="headline text-4xl">Ít hơn, nhưng tốt hơn.</h2>
      <p class="text-soft leading-relaxed mt-4">Sản xuất theo đơn đặt hàng giúp chúng tôi giảm 60% tồn kho dư thừa. Nước thải nhuộm được xử lý tuần hoàn, bao bì hoàn toàn tái chế. Chương trình sửa chữa trọn đời cho Membership giữ sản phẩm bền lâu nhất có thể.</p>
      <div class="flex flex-wrap gap-2 mt-5">${["GOTS Certified", "OEKO-TEX", "Carbon-neutral ship", "Repair program"].map((t) => `<span class="badge" style="background:var(--line);color:var(--soft)">${t}</span>`).join("")}</div>
    </div>
  </div>`),
    );

    /* timeline */
    wrap.appendChild(
        sec(`${C.sectionHead("History", "Hành trình", "")}
    <div class="space-y-0">${[
        ["2026", "Ra mắt The Blues với capsule Indigo đầu tiên."],
        ["2026 Q2", "Mở atelier Đà Nẵng & ra mắt Membership."],
        ["2026 Q4", "Hợp tác mill Okayama cho dòng Selvedge Archive."],
        ["2027", "Mục tiêu mở flagship store đầu tiên tại Sài Gòn."],
    ]
        .map(
([y, d], i, a) => `
      <div class="flex gap-6 reveal"><div class="flex flex-col items-center"><div class="w-3 h-3 rounded-full grad-navy mt-1.5"></div>${i < a.length - 1 ? '<div class="w-0.5 flex-1" style="background:var(--line)"></div>' : ""}</div>
      <div class="pb-10"><p class="headline text-xl text-blues-500">${y}</p><p class="text-soft mt-1">${d}</p></div></div>`,
        )
        .join("")}
    </div>`),
    );

    /* team */
    wrap.appendChild(
        sec(`${C.sectionHead("Team", "Những người đứng sau", "")}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${[
        ["Minh Trần", "Founder & Creative Director", "indigo"],
        ["Yuna Kim", "Head of Design", "wash"],
        ["Đức Lê", "Master Tailor", "raw"],
        ["Sora Park", "Brand & CRM", "stone"],
    ]
        .map(
([n, r, pal]) => `
      <div class="reveal"><div class="rounded-2xl overflow-hidden aspect-[4/5]">${fashionSVG("team-" + n, pal)}</div><p class="font-semibold mt-3 text-sm">${n}</p><p class="text-[12px] text-mute">${r}</p></div>`,
        )
        .join("")}
    </div>`),
    );

    /* store locations */
    wrap.appendChild(
        sec(`${C.sectionHead("Stores", "Cửa hàng", "Ghé thăm không gian của chúng tôi.")}
    <div class="grid sm:grid-cols-3 gap-4">${[
        ["Sài Gòn Atelier", "12 Lê Thánh Tôn, Q.1", "Đang mở"],
        ["Hà Nội Showroom", "45 Tràng Tiền, Hoàn Kiếm", "Sắp khai trương"],
        ["Đà Nẵng Workshop", "Khu xưởng An Hải", "Theo lịch hẹn"],
    ]
        .map(
([n, a, s]) => `
      <div class="card p-5 reveal"><h3 class="font-semibold">${n}</h3><p class="text-[13px] text-mute mt-1">${a}</p><span class="badge mt-3 inline-block" style="background:var(--line);color:var(--soft)">${s}</span></div>`,
        )
        .join("")}
    </div>`),
    );

    wrap.appendChild(buildAboutCTA());
    return wrap;
});
function buildAboutCTA() {
    return el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pb-20"><div class="rounded-2xl p-10 sm:p-16 text-center text-white relative overflow-hidden reveal" style="background:var(--grad-navy)">
    <h3 class="headline text-3xl sm:text-5xl">Tham gia câu chuyện</h3>
    <p class="text-white/75 mt-3 max-w-md mx-auto">Khám phá bộ sưu tập hoặc trở thành một phần của Membership.</p>
    <div class="flex items-center justify-center gap-3 mt-7"><button onclick="Router.go('shop')" class="btn px-7 py-3.5 text-sm font-semibold" style="background:#fff;color:#0c1426">Khám phá BST</button><button onclick="Router.go('careers')" class="btn px-7 py-3.5 text-sm font-semibold glass text-white">Tuyển dụng</button></div>
  </div></section>`);
}

