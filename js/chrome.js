function buildNav() {
    const nav = $("#megaNav");
    const shopMega = `<div class="relative group">
    <button class="nav-link py-2 flex items-center gap-1" data-route="shop">Shop <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
    <div class="mega absolute left-0 top-full pt-3 group-hover:block">
      <div class="surface rounded-2xl p-6 w-[560px] grid grid-cols-3 gap-6" style="box-shadow:var(--shadow-lg)">
        <div><p class="kicker text-mute mb-3">Category</p>
          ${CATS.map((c) => `<button onclick="Router.go('shop',{cat:'${c}'})" class="block py-1.5 text-[13px] hover:text-blues-500 transition">${c}</button>`).join("")}</div>
        <div><p class="kicker text-mute mb-3">Collection</p>
          ${COLLECTIONS.map((c) => `<button onclick="Router.go('shop',{collection:'${c}'})" class="block py-1.5 text-[13px] hover:text-blues-500 transition">${c}</button>`).join("")}</div>
        <div class="rounded-xl overflow-hidden relative aspect-[3/4]">${fashionSVG("mega-feat", "raw")}
          <div class="absolute inset-0 flex flex-col justify-end p-4" style="background:linear-gradient(to top,rgba(10,18,48,.85),transparent)">
<p class="text-white text-[11px] kicker">Featured</p><p class="text-white font-display text-lg leading-tight">SS26 Indigo</p>
<button onclick="Router.go('shop',{collection:'SS26 Indigo'})" class="text-white/80 text-[11px] mt-1 underline">Khám phá →</button></div></div>
      </div></div></div>`;
    nav.innerHTML =
        shopMega +
        [
            "Lookbook|lookbook",
            "Membership|loyalty",
            "Câu chuyện|about",
            "Tuyển dụng|careers",
        ]
            .map((s) => {
                const [l, r] = s.split("|");
                return `<button onclick="Router.go('${r}')" class="nav-link py-2" data-route="${r}">${l}</button>`;
            })
            .join("");
    // mega menu hover
    nav.querySelectorAll(".group").forEach((g) => {
        const m = g.querySelector(".mega");
        g.addEventListener("mouseenter", () => m.classList.add("show"));
        g.addEventListener("mouseleave", () => m.classList.remove("show"));
    });
}

function buildFooter() {
    $("#footer").innerHTML = `<div class="grad-navy text-white mt-24">
    <div class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-10">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-8">
        <div class="lg:col-span-4">
          <span class="title-exp font-bold text-2xl tracking-[.16em]">THE BLUES</span>
          <p class="text-white/55 text-[13px] mt-4 leading-relaxed max-w-xs">Premium denim & menswear, crafted in-house. Built on Japanese selvedge, refined for a modern wardrobe.</p>
          <div class="flex gap-2.5 mt-6">
${["instagram", "tiktok", "youtube", "x"].map((s) => `<a href="#" onclick="return false" class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition text-[10px] uppercase tracking-wider">${s[0]}</a>`).join("")}
          </div>
        </div>
        <div class="lg:col-span-2"><p class="kicker text-white/40 mb-4">Shop</p>${CATS.map((c) => `<button onclick="Router.go('shop',{cat:'${c}'})" class="block py-1.5 text-[13px] text-white/70 hover:text-white transition">${c}</button>`).join("")}</div>
        <div class="lg:col-span-2"><p class="kicker text-white/40 mb-4">Company</p>${[
"Câu chuyện|about",
"Tuyển dụng|careers",
"Membership|loyalty",
"CRM Studio|crm",
"Admin|admin",
        ]
.map((s) => {
    const [l, r] = s.split("|");
    return `<button onclick="Router.go('${r}')" class="block py-1.5 text-[13px] text-white/70 hover:text-white transition">${l}</button>`;
})
.join("")}</div>
        <div class="lg:col-span-4">
          <p class="kicker text-white/40 mb-4">The Insider Letter</p>
          <p class="text-white/60 text-[13px] mb-3">Drop sớm, capsule độc quyền, và +50 điểm khi đăng ký.</p>
          <div class="flex gap-2">
<input id="footNews" placeholder="Email của bạn" class="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-white/40">
<button onclick="footerSignup()" class="btn bg-white text-blues-700 px-5 py-2.5 text-[13px] font-semibold">Đăng ký</button>
          </div>
        </div>
      </div>
      <div class="divider-grad my-8" style="background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)"></div>
      <div class="flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-white/45">
        <p>© 2026 The Blues Atelier. Mọi quyền được bảo lưu.</p>
        <div class="flex gap-5"><a href="#" onclick="return false" class="hover:text-white">Chính sách</a><a href="#" onclick="return false" class="hover:text-white">Điều khoản</a><a href="#" onclick="return false" class="hover:text-white">Bảo mật</a></div>
      </div>
    </div></div>`;
}
function footerSignup() {
    const v = $("#footNews").value;
    if (!v) {
        UI.toast("Email", "Vui lòng nhập email", "info");
        return;
    }
    $("#footNews").value = "";
    Loyalty.earn(50, "Đăng ký newsletter");
    CRM.fire("register");
}
