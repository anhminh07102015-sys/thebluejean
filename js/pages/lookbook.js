/* =====================================================================
   PAGE: LOOKBOOK  ·  editorial visual grid
   ===================================================================== */
Router.add("lookbook", async () => {
    const wrap = el("<div></div>");
    wrap.appendChild(
        el(`<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pt-10 pb-6">
    <p class="kicker text-blues-500 mb-3 reveal">SS26 · Editorial</p>
    <h1 class="headline text-5xl lg:text-7xl reveal">The Indigo Lookbook</h1>
    <p class="text-mute max-w-lg mt-4 reveal">Một câu chuyện thị giác về denim thô, ánh sáng tự nhiên và những đường cắt tối giản.</p>
  </section>`),
    );
    const looks = PRODUCTS.slice(0, 8);
    const spans = [
        "lg:col-span-7 aspect-[16/10]",
        "lg:col-span-5 aspect-[4/5]",
        "lg:col-span-5 aspect-[4/5]",
        "lg:col-span-7 aspect-[16/10]",
        "lg:col-span-12 aspect-[21/9]",
        "lg:col-span-4 aspect-[3/4]",
        "lg:col-span-4 aspect-[3/4]",
        "lg:col-span-4 aspect-[3/4]",
    ];
    const grid = el(
        '<section class="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 pb-20 grid lg:grid-cols-12 gap-4"></section>',
    );
    looks.forEach((p, i) => {
        grid.appendChild(
            el(`<figure class="${spans[i] || "lg:col-span-6 aspect-[4/3]"} relative rounded-2xl overflow-hidden group reveal cursor-pointer" onclick="Router.go('product',{id:'${p.id}'})">
      <div class="pimg w-full h-full">${fashionSVG("look-" + p.id, p.palette, "")}</div>
      <div class="absolute inset-0 flex items-end p-5" style="background:linear-gradient(180deg,transparent 50%,rgba(10,15,35,.55))">
        <div class="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p class="text-white/70 text-[11px] kicker">${p.collection}</p>
          <p class="text-white font-semibold">${p.name}</p>
          <p class="text-white/80 text-[13px]">${fmt(p.price)}</p>
        </div>
      </div>
    </figure>`),
        );
    });
    wrap.appendChild(grid);
    return wrap;
});

