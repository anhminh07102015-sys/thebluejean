/* =====================================================================
   PAGE: CAREERS  ·  Recruitment
   ===================================================================== */
const careerState = { dept: "Tất cả" };
const JOBS = [
    {
        title: "Senior Fashion Designer",
        dept: "Design",
        loc: "Sài Gòn",
        type: "Full-time",
    },
    { title: "Master Tailor", dept: "Production", loc: "Đà Nẵng", type: "Full-time" },
    {
        title: "CRM & Lifecycle Manager",
        dept: "Marketing",
        loc: "Remote · VN",
        type: "Full-time",
    },
    { title: "Frontend Engineer", dept: "Tech", loc: "Remote", type: "Full-time" },
    {
        title: "Retail Experience Lead",
        dept: "Retail",
        loc: "Sài Gòn",
        type: "Full-time",
    },
    {
        title: "Sustainability Specialist",
        dept: "Production",
        loc: "Đà Nẵng",
        type: "Contract",
    },
    {
        title: "Social & Content Creator",
        dept: "Marketing",
        loc: "Sài Gòn",
        type: "Part-time",
    },
];
Router.add("careers", async () => {
    const wrap = el("<div></div>");
    wrap.appendChild(
        el(`<section class="relative overflow-hidden border-b" style="border-color:var(--line)">
    <div class="absolute inset-0" style="background:radial-gradient(100% 100% at 20% 0%, rgba(33,64,154,.14), transparent 55%)"></div>
    <div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24 relative grid lg:grid-cols-2 gap-10 items-center">
      <div><p class="kicker text-blues-500 mb-3 reveal">Careers</p>
        <h1 class="headline text-5xl lg:text-7xl reveal leading-[0.95]">Xây dựng<br>tương lai của denim.</h1>
        <p class="text-mute max-w-md mt-5 reveal">Chúng tôi tìm những người tin vào craft, sự minh bạch và trải nghiệm khách hàng đẳng cấp. Cùng viết chương tiếp theo của The Blues.</p>
        <div class="flex gap-3 mt-7 reveal"><button onclick="document.getElementById('jobList').scrollIntoView({behavior:'smooth'})" class="btn btn-primary px-6 py-3.5 text-sm">Xem vị trí mở</button><button onclick="UI.openApply()" class="btn btn-ghost px-6 py-3.5 text-sm">Ứng tuyển nhanh</button></div>
      </div>
      <div class="grid grid-cols-2 gap-4 reveal">
        <div class="rounded-2xl overflow-hidden aspect-[4/5]">${fashionSVG("career-1", "indigo")}</div>
        <div class="rounded-2xl overflow-hidden aspect-[4/5] mt-8">${fashionSVG("career-2", "wash")}</div>
      </div>
    </div>
  </section>`),
    );

    /* culture / benefits */
    const sec = (inner) => {
        const s = el(
            `<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-14 lg:py-20"></section>`,
        );
        s.innerHTML = inner;
        return s;
    };
    wrap.appendChild(
        sec(`${C.sectionHead("Culture", "Phúc lợi & văn hoá", "Chúng tôi đầu tư vào con người như đầu tư vào sản phẩm.")}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${[
        ["Equity & Founder shares", "Mọi nhân sự core đều có cổ phần."],
        ["Wardrobe allowance", "Ngân sách sản phẩm hàng quý + 50% off."],
        ["Remote-friendly", "Linh hoạt địa điểm cho vị trí phù hợp."],
        ["Learning budget", "Ngân sách học tập & dự hội thảo quốc tế."],
        ["Health & wellness", "Bảo hiểm cao cấp cho bạn và gia đình."],
        ["Atelier access", "Học craft trực tiếp tại xưởng Đà Nẵng."],
        ["Quarterly retreat", "Off-site sáng tạo mỗi quý."],
        ["Founder lunch", "Ăn trưa hàng tuần cùng đội ngũ sáng lập."],
    ]
        .map(
([t, d]) =>
    `<div class="card p-5 reveal"><h3 class="font-semibold text-sm">${t}</h3><p class="text-[12.5px] text-mute mt-2 leading-relaxed">${d}</p></div>`,
        )
        .join("")}</div>`),
    );

    /* job listing + dept filter */
    const jl = el(
        '<section id="jobList" class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-10 scroll-mt-24"></section>',
    );
    jl.appendChild(el(C.sectionHead("Open roles", "Vị trí đang tuyển", "")));
    const depts = ["Tất cả", ...new Set(JOBS.map((j) => j.dept))];
    const filterBar = el(
        `<div class="flex flex-wrap gap-2 mb-6 reveal">${depts.map((d) => `<button data-d="${d}" class="deptBtn px-4 py-2 rounded-full text-[12.5px] font-medium transition ${careerState.dept === d ? "grad-navy text-white" : "border hairline text-mute hover:text-ink"}">${d}</button>`).join("")}</div>`,
    );
    jl.appendChild(filterBar);
    const list = el('<div class="space-y-3"></div>');
    jl.appendChild(list);
    function renderJobs() {
        const f = JOBS.filter(
            (j) => careerState.dept === "Tất cả" || j.dept === careerState.dept,
        );
        list.innerHTML = f
            .map(
                (
                    j,
                ) => `<div class="card card-hover p-5 flex items-center justify-between flex-wrap gap-4 reveal">
      <div class="flex items-center gap-4"><div class="w-11 h-11 rounded-xl grid place-items-center shrink-0" style="background:var(--line)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-blues-500"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
        <div><h3 class="font-semibold">${j.title}</h3><p class="text-[12px] text-mute">${j.dept} · ${j.loc} · ${j.type}</p></div></div>
      <button onclick="UI.openApply('${j.title}')" class="btn btn-primary px-5 py-2.5 text-[13px]">Ứng tuyển</button>
    </div>`,
            )
            .join("");
        UI.bindReveal();
    }
    filterBar.querySelectorAll(".deptBtn").forEach(
        (b) =>
            (b.onclick = () => {
                careerState.dept = b.dataset.d;
                filterBar.querySelectorAll(".deptBtn").forEach((x) => {
                    const on = x.dataset.d === careerState.dept;
                    x.className = `deptBtn px-4 py-2 rounded-full text-[12.5px] font-medium transition ${on ? "grad-navy text-white" : "border hairline text-mute hover:text-ink"}`;
                });
                renderJobs();
            }),
    );
    renderJobs();
    wrap.appendChild(jl);

    /* hiring process timeline */
    wrap.appendChild(
        sec(`${C.sectionHead("Process", "Quy trình tuyển dụng", "Minh bạch, nhanh gọn — thường hoàn tất trong 2 tuần.")}
    <div class="grid sm:grid-cols-4 gap-4">${[
        ["01", "Ứng tuyển", "Gửi CV & portfolio"],
        ["02", "Phỏng vấn", "Trò chuyện với hiring manager"],
        ["03", "Thử thách", "Bài tập thực tế ngắn"],
        ["04", "Offer", "Gặp founder & nhận offer"],
    ]
        .map(
([n, t, d]) =>
    `<div class="card p-5 reveal"><p class="headline text-2xl text-blues-500/30">${n}</p><h3 class="font-semibold mt-2 text-sm">${t}</h3><p class="text-[12px] text-mute mt-1">${d}</p></div>`,
        )
        .join("")}</div>`),
    );

    /* office gallery */
    wrap.appendChild(
        sec(`${C.sectionHead("Studio", "Không gian làm việc", "")}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${["stone", "indigo", "wash", "raw"].map((p, i) => `<div class="rounded-2xl overflow-hidden aspect-square reveal pimg">${fashionSVG("office-" + i, p)}</div>`).join("")}</div>`),
    );

    return wrap;
});

/* apply form drawer */
UI.openApply = function (role = "") {
    const node = this.modal(
        `<div class="p-6 sm:p-8">
    <div class="flex items-start justify-between mb-1"><h3 class="headline text-2xl">Ứng tuyển</h3><button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-mute hover:text-ink text-2xl leading-none">×</button></div>
    <p class="text-mute text-[13px] mb-6">${role ? 'Vị trí: <span class="font-semibold text-ink">' + role + "</span>" : "Gửi hồ sơ — chúng tôi luôn tìm người giỏi."}</p>
    <div class="grid sm:grid-cols-2 gap-3">
      <div><label class="text-[11px] text-mute uppercase tracking-wider">Họ tên</label><input class="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent" style="border:1px solid var(--line)" placeholder="Nguyễn Văn A"></div>
      <div><label class="text-[11px] text-mute uppercase tracking-wider">Email</label><input class="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent" style="border:1px solid var(--line)" placeholder="ban@email.com"></div>
      <div class="sm:col-span-2"><label class="text-[11px] text-mute uppercase tracking-wider">Vị trí quan tâm</label><input value="${role}" class="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent" style="border:1px solid var(--line)" placeholder="Vị trí..."></div>
      <div class="sm:col-span-2"><label class="text-[11px] text-mute uppercase tracking-wider">Lời nhắn</label><textarea rows="3" class="w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent resize-none" style="border:1px solid var(--line)" placeholder="Vì sao bạn phù hợp..."></textarea></div>
    </div>
    <label class="mt-3 flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer hover:border-blues-500 transition" style="border-color:var(--line)" onclick="this.querySelector('p').textContent='cv_portfolio.pdf · đã chọn'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="text-blues-500"><path d="M12 16V4M5 11l7-7 7 7M5 20h14"/></svg>
      <div><p class="text-[13px] font-medium">Tải lên CV / Portfolio</p><p class="text-[11px] text-mute">PDF, tối đa 10MB</p></div>
    </label>
    <button onclick="UI.toast('Đã nhận hồ sơ','Cảm ơn bạn! Chúng tôi sẽ phản hồi trong 5 ngày','check');UI.closeOverlay(this.closest('[data-mounted]'))" class="btn btn-primary w-full py-3.5 text-sm mt-5">Gửi hồ sơ ứng tuyển</button>
  </div>`,
        "max-w-lg",
    );
};

