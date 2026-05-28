/* =====================================================================
   PAGE: ADMIN / CMS  ·  enterprise mockup (incl. inventory sync)
   ===================================================================== */
const adminState = { tab: "dashboard", chartMetric: "revenue", tiktokFilter: "Tất cả", packingScanned: false, packingFilter: "Tất cả", packingSearch: "", packingRecordState: "idle", packingRecordTime: 0 };
Router.add("admin", async () => {
    const wrap = el(
        '<div class="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-16"></div>',
    );
    wrap.appendChild(
        el(`<div class="flex items-center justify-between flex-wrap gap-3 mb-6">
    <div><p class="kicker text-blues-500 mb-2">The Blues · Console</p><h1 class="headline text-4xl">Admin & CMS</h1></div>
    <div class="flex items-center gap-2 text-[12px] text-mute"><span class="w-2 h-2 rounded-full bg-green-500"></span>Tất cả hệ thống hoạt động</div>
  </div>`),
    );

    const tabs = [
        ["dashboard", "Dashboard"],
        ["products", "Sản phẩm"],
        ["inventory", "Kho & Sync"],
        ["orders", "Đơn hàng"],
        ["tiktok", "TikTok Shop"],
        ["packing", "Đóng gói"],
        ["loyalty", "Loyalty"],
        ["crm", "CRM"],
        ["analytics", "Analytics"],
        ["banner", "Banner"],
    ];
    const layout = el('<div class="grid lg:grid-cols-[200px_1fr] gap-6"></div>');
    const side = el(
        `<aside class="w-full overflow-hidden lg:sticky lg:top-24 lg:self-start"><div class="card w-full p-2 flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">${tabs.map(([k, l]) => `<button data-at="${k}" class="adminTab whitespace-nowrap text-left px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition ${adminState.tab === k ? "grad-navy text-white" : "text-mute hover:text-ink"}">${l}</button>`).join("")}</div></aside>`,
    );
    const main = el('<div class="min-w-0"></div>');
    layout.appendChild(side);
    layout.appendChild(main);
    wrap.appendChild(layout);

    const stat = (l, v, d) =>
        `<div class="card p-5"><p class="text-[11px] text-mute uppercase tracking-wider">${l}</p><p class="text-2xl font-bold mt-1">${v}</p>${d ? `<p class="text-[11px] text-blues-500 mt-1">${d}</p>` : ""}</div>`;

    window.changeAdminChart = (metric) => {
        adminState.chartMetric = metric;
        const containers = main.querySelectorAll(".adminChartContainer");
        containers.forEach(c => {
            c.innerHTML = renderAdminChart(metric);
        });
    };

    function render() {
        const t = adminState.tab;
        if (t === "dashboard") {
            main.innerHTML = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        ${stat("Doanh thu tháng", "284.5M", "+22% MoM")}${stat("Đơn hàng", "1.284", "+8%")}${stat("Khách mới", "412", "+15%")}${stat("AOV", "842.000đ", "+4%")}
      </div>
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="card p-4 sm:p-5 lg:col-span-2 flex flex-col justify-between"><p class="font-semibold text-sm mb-4">Phân tích hiệu suất</p><div class="adminChartContainer">${renderAdminChart(adminState.chartMetric || 'revenue')}</div></div>
        <div class="card p-5"><p class="font-semibold text-sm mb-3">Top sản phẩm</p>${PRODUCTS.slice(
0,
4,
        )
.map(
    (p, i) =>
        `<div class="flex items-center gap-3 py-2"><span class="text-[12px] text-mute w-4">${i + 1}</span><div class="w-9 h-11 rounded-md overflow-hidden shrink-0">${fashionSVG(p.id, p.palette)}</div><div class="flex-1 min-w-0"><p class="text-[12px] font-medium truncate">${p.name}</p><p class="text-[11px] text-mute">${fmt(p.price)}</p></div><span class="text-[12px] font-bold text-blues-500">${120 - i * 18}</span></div>`,
)
.join("")}</div>
      </div>`;
        } else if (t === "products") {
            main.innerHTML = `<div class="card overflow-hidden"><div class="flex items-center justify-between p-4 hairline-b"><p class="font-semibold text-sm">Quản lý sản phẩm (${PRODUCTS.length})</p><button class="btn btn-primary px-4 py-2 text-[12px]">+ Thêm sản phẩm</button></div>
        <div class="overflow-x-auto"><table class="w-full text-[12.5px]"><thead><tr class="text-left text-mute" style="border-bottom:1px solid var(--line)">${["Sản phẩm", "Danh mục", "Giá", "Tồn", "Trạng thái"].map((h) => `<th class="px-4 py-3 font-medium">${h}</th>`).join("")}</tr></thead>
        <tbody>${PRODUCTS.slice(0, 10)
.map(
    (p) =>
        `<tr style="border-bottom:1px solid var(--line)"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-8 h-10 rounded overflow-hidden shrink-0">${fashionSVG(p.id, p.palette)}</div><span class="font-medium">${p.name}</span></div></td><td class="px-4 py-3 text-mute">${p.cat}</td><td class="px-4 py-3 font-semibold">${fmt(p.price)}</td><td class="px-4 py-3">${p.stock}</td><td class="px-4 py-3"><span class="badge ${p.stock < 8 ? "text-white" : ""}" style="${p.stock < 8 ? "background:#d97706" : "background:var(--line);color:var(--soft)"}">${p.stock < 8 ? "Sắp hết" : "Còn hàng"}</span></td></tr>`,
)
.join("")}</tbody></table></div>
      </div>`;
        } else if (t === "inventory") {
            main.innerHTML = `<div class="flex items-center justify-between flex-wrap gap-3 mb-4"><div><p class="font-semibold">Inventory sync</p><p class="text-[12px] text-mute">Tích hợp realtime với hệ thống quản lý kho của bạn.</p></div><button id="syncBtn" class="btn btn-primary px-5 py-2.5 text-[13px]">⟳ Đồng bộ ngay</button></div>
        <div id="syncNodes" class="grid sm:grid-cols-2 gap-3 mb-6">${INVENTORY_NODES.map((n) => nodeCard(n)).join("")}</div>
        <div class="grid sm:grid-cols-3 gap-3 mb-6">
          ${stat("Tổng SKU", "2.976", "4 kho")}${stat("Đồng bộ thành công", "98.7%", "24h qua")}${stat("Cảnh báo tồn thấp", "7", "SKU")}
        </div>
        <div class="card overflow-hidden"><div class="p-4 hairline-b"><p class="font-semibold text-sm">API integration</p></div>
        <div class="divide-y" style="border-color:var(--line)">${[
["POS · KiotViet", "connected", "2 phút trước"],
["Warehouse API", "connected", "1 phút trước"],
["Shopify mirror", "connected", "5 phút trước"],
["3PL Ninja", "syncing", "đang chạy"],
        ]
.map(
    ([n, s, t]) =>
        `<div class="flex items-center justify-between px-4 py-3"><div class="flex items-center gap-3"><span class="w-2 h-2 rounded-full ${s === "connected" ? "bg-green-500" : "bg-amber-500 animate-pulse"}"></span><span class="text-[13px] font-medium">${n}</span></div><span class="text-[11px] text-mute">${t}</span></div>`,
)
.join("")}</div></div>`;
            const btn = main.querySelector("#syncBtn");
            btn.onclick = async () => {
                btn.textContent = "⟳ Đang đồng bộ…";
                btn.disabled = true;
                const nodesEl = main.querySelector("#syncNodes");
                nodesEl.innerHTML = INVENTORY_NODES.map(
                    () =>
                        '<div class="card p-4"><div class="skel h-4 w-2/3 mb-2"></div><div class="skel h-3 w-1/3"></div></div>',
                ).join("");
                const res = await API.syncInventory();
                nodesEl.innerHTML = res.map((n) => nodeCard(n)).join("");
                btn.textContent = "✓ Đã đồng bộ";
                setTimeout(() => {
                    btn.textContent = "⟳ Đồng bộ ngay";
                    btn.disabled = false;
                }, 1500);
                UI.toast("Inventory", "Đồng bộ kho thành công", "check");
            };
        } else if (t === "orders") {
            const all = [
                ...State.data.orders,
                {
                    id: "TB-2602",
                    date: "25/05/2026",
                    status: "Đóng gói",
                    total: 1890000,
                    items: 1,
                },
                {
                    id: "TB-2601",
                    date: "24/05/2026",
                    status: "Đang giao",
                    total: 3200000,
                    items: 3,
                },
            ];
            main.innerHTML = `<div class="card overflow-hidden"><div class="p-4 hairline-b"><p class="font-semibold text-sm">Đơn hàng gần đây</p></div>
        <div class="overflow-x-auto"><table class="w-full text-[12.5px]"><thead><tr class="text-left text-mute" style="border-bottom:1px solid var(--line)">${["Mã đơn", "Ngày", "SP", "Tổng", "Trạng thái"].map((h) => `<th class="px-4 py-3 font-medium">${h}</th>`).join("")}</tr></thead>
        <tbody>${all.map((o) => `<tr style="border-bottom:1px solid var(--line)"><td class="px-4 py-3 font-mono font-semibold">#${o.id}</td><td class="px-4 py-3 text-mute">${o.date}</td><td class="px-4 py-3">${o.items}</td><td class="px-4 py-3 font-semibold">${fmt(o.total)}</td><td class="px-4 py-3"><span class="badge text-white" style="background:${o.status === "Hoàn tất" ? "#16a34a" : "var(--grad-navy)"}">${o.status}</span></td></tr>`).join("")}</tbody></table></div></div>`;
        } else if (t === "tiktok") {
            main.innerHTML = renderTikTokShop();
            
            // Bind events
            const syncBtn = main.querySelector("#tiktokSyncBtn");
            if (syncBtn) {
                syncBtn.onclick = () => window.syncTikTokOrders(syncBtn);
            }
            
            // Bind filter tabs
            const filterTabs = main.querySelectorAll(".tiktokFilterTab");
            filterTabs.forEach(tb => {
                tb.onclick = () => {
                    adminState.tiktokFilter = tb.dataset.filter;
                    filterTabs.forEach(x => {
                        const on = x.dataset.filter === adminState.tiktokFilter;
                        x.className = `tiktokFilterTab whitespace-nowrap px-4 py-2 rounded-lg text-[13px] font-medium transition ${on ? 'grad-navy text-white' : 'text-mute hover:text-ink'}`;
                    });
                    const tableBody = main.querySelector("#tiktokOrdersTableBody");
                    if (tableBody) tableBody.innerHTML = renderTikTokOrderRows(adminState.tiktokFilter);
                };
            });
            
            // Bind row clicks
            const tableBody = main.querySelector("#tiktokOrdersTableBody");
            if (tableBody) {
                tableBody.onclick = (e) => {
                    const row = e.target.closest(".tiktok-order-row");
                    if (row) {
                        const orderId = row.dataset.orderId;
                        window.openTikTokOrderDetail(orderId);
                    }
                };
            }
        } else if (t === "packing") {
            main.innerHTML = renderPackingScreen();
            setupPackingHandlers(main);
        } else if (t === "loyalty") {
            main.innerHTML = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">${TIERS.map((t) => stat(t.name.split(" ")[0], `${{ blue: "1.842", silver: "612", gold: "208", black: "34" }[t.key]}`, "thành viên")).join("")}</div>
        <div class="card p-5"><p class="font-semibold text-sm mb-4">Phân bố hạng thành viên</p>
        ${TIERS.map((t) => {
const w = { blue: 66, silver: 22, gold: 9, black: 3 }[t.key];
return `<div class="mb-3"><div class="flex justify-between text-[12px] mb-1"><span class="font-medium">${t.name}</span><span class="text-mute">${w}%</span></div><div class="h-2.5 rounded-full overflow-hidden" style="background:var(--line)"><div class="h-full rounded-full" style="width:${w}%;background:${t.grad}"></div></div></div>`;
        }).join("")}</div>`;
        } else if (t === "crm") {
            main.innerHTML = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">${stat("Campaign chạy", "6", "active")}${stat("Email gửi 24h", "3.842", "+12%")}${stat("Conversion", "4.2%", "+0.8%")}${stat("Unsub", "0.3%", "-0.1%")}</div>
        <div class="card p-5"><div class="flex items-center justify-between mb-4"><p class="font-semibold text-sm">Campaign đang chạy</p><button onclick="Router.go('crm')" class="text-[12px] text-blues-500">Mở CRM Studio →</button></div>
        ${Object.entries(CRM.flows)
.map(
    ([k, f], i) =>
        `<div class="flex items-center justify-between py-2.5 ${i ? "hairline-t" : ""}"><div><p class="text-[13px] font-medium">${f.name}</p><p class="text-[11px] text-mute font-mono">${k}</p></div><span class="badge text-white" style="background:#16a34a">Active</span></div>`,
)
.join("")}</div>`;
        } else if (t === "analytics") {
            main.innerHTML = `<div class="grid lg:grid-cols-2 gap-4 mb-4"><div class="card p-5"><p class="font-semibold text-sm mb-4">Lưu lượng theo kênh</p>${[
                ["Organic", 42],
                ["Direct", 24],
                ["Social", 20],
                ["Email", 14],
            ]
                .map(
                    ([l, v]) =>
                        `<div class="mb-3"><div class="flex justify-between text-[12px] mb-1"><span>${l}</span><span class="text-mute">${v}%</span></div><div class="h-2 rounded-full overflow-hidden" style="background:var(--line)"><div class="h-full rounded-full" style="width:${v}%;background:var(--grad-navy)"></div></div></div>`,
                )
                .join("")}</div>
        <div class="card p-4 sm:p-5 flex flex-col justify-between"><p class="font-semibold text-sm mb-4">Biểu đồ hiệu suất</p><div class="adminChartContainer">${renderAdminChart(adminState.chartMetric || 'revenue')}</div></div></div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">${stat("Bounce rate", "32%", "-4%")}${stat("Avg session", "4:12", "+0:30")}${stat("Return rate", "38%", "+6%")}${stat("NPS", "72", "+5")}</div>`;
        } else if (t === "banner") {
            main.innerHTML = `<div class="flex items-center justify-between mb-4"><p class="font-semibold text-sm">Quản lý banner trang chủ</p><button class="btn btn-primary px-4 py-2 text-[12px]">+ Banner mới</button></div>
        <div class="grid sm:grid-cols-2 gap-4">${["SS26 Indigo Drop", "Flash Sale Weekend", "Membership", "New Arrivals"].map((b, i) => `<div class="card overflow-hidden reveal"><div class="aspect-[16/9] relative pimg">${heroSVG("banner-" + i, ["indigo", "raw", "wash", "stone"][i])}<div class="absolute inset-0 grid place-items-center"><p class="headline text-white text-xl">${b}</p></div></div><div class="p-3 flex items-center justify-between"><span class="badge text-white" style="background:${i < 2 ? "#16a34a" : "var(--line)"};${i >= 2 ? "color:var(--soft)" : ""}">${i < 2 ? "Đang hiển thị" : "Nháp"}</span><div class="flex gap-2"><button class="text-[12px] text-mute hover:text-ink">Sửa</button><button class="text-[12px] text-mute hover:text-ink">Ẩn</button></div></div></div>`).join("")}</div>`;
        }
        UI.bindReveal();
    }
    side.querySelectorAll(".adminTab").forEach(
        (b) =>
            (b.onclick = () => {
                if (b.dataset.at !== "packing") {
                    if (window.currentWebcamStream) {
                        try {
                            window.currentWebcamStream.getTracks().forEach(track => track.stop());
                            window.currentWebcamStream = null;
                        } catch (err) {
                            console.error("Lỗi khi tắt webcam:", err);
                        }
                    }
                    if (window.packingTimerInterval) {
                        clearInterval(window.packingTimerInterval);
                        window.packingTimerInterval = null;
                    }
                    adminState.packingRecordState = "idle";
                    adminState.packingRecordTime = 0;
                }

                adminState.tab = b.dataset.at;
                side.querySelectorAll(".adminTab").forEach((x) => {
                    const on = x.dataset.at === adminState.tab;
                    x.className = `adminTab whitespace-nowrap text-left px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition ${on ? "grad-navy text-white" : "text-mute hover:text-ink"}`;
                });
                render();
            }),
    );
    render();
    return wrap;
});
function nodeCard(n) {
    const ok = n.status === "ok";
    return `<div class="card p-4"><div class="flex items-start justify-between"><div><p class="text-[13px] font-semibold">${n.wh}</p><p class="text-[11px] text-mute mt-0.5">${n.sku} SKU · ${n.sync || n.last || "vừa xong"}</p></div><span class="flex items-center gap-1.5 text-[11px] ${ok ? "text-green-600" : "text-amber-600"}"><span class="w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-amber-500"}"></span>${ok ? "OK" : "Cảnh báo"}</span></div></div>`;
}

function renderPackingScreen() {
    if (!adminState.packingScanned) {
        return `
        <div class="flex flex-col items-center justify-center p-8 lg:p-16 text-center max-w-lg mx-auto h-[60vh]">
            <div class="relative w-72 h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden mb-6" style="border-color:var(--line); background:var(--surface)">
                <!-- Red scanner laser line -->
                <div class="absolute w-full h-[2px] bg-red-500 top-0 left-0 animate-bounce" style="box-shadow: 0 0 8px rgba(239, 68, 68, 0.8)"></div>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-mute mb-2">
                    <path d="M4 6V4h2M18 4h2v2M4 18v2h2M18 20h2v-2M7 8h2v8H7zm4 0h1v8h-1zm3 0h3v8h-3zm-6 0h1v8H8z"/>
                </svg>
                <p class="text-[12px] text-mute font-medium px-4">Hướng mã vạch đơn hàng vào Camera để nhận diện</p>
            </div>
            <h2 class="headline text-2xl mb-2">Quét mã vận đơn</h2>
            <p class="text-mute text-[13px] mb-6">Bật tính năng quét mã để tự động nhận diện thông tin đơn hàng, bưu kiện và kích hoạt luồng quay video đóng gói đối soát.</p>
            <button onclick="window.simulatePackingScan()" class="btn btn-primary px-7 py-3 text-sm flex items-center gap-2">
                🔍 Nhận diện mã vạch (#HYDRA000897)
            </button>
        </div>`;
    }

    const orderId = "#HYDRA000897";
    const isRecording = adminState.packingRecordState === "recording";
    const isDone = adminState.packingRecordState === "done";
    
    return `
    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 w-full text-[12.5px] items-stretch min-h-[65vh]">
        <!-- Column 1: Sidebar List -->
        <div class="card p-4 flex flex-col gap-3 shrink-0">
            <div class="relative w-full">
                <input type="text" placeholder="Tìm kiếm" class="w-full pl-8 pr-3 py-2 rounded-xl text-[12px] bg-transparent" style="border: 1px solid var(--line)" value="${adminState.packingSearch || ''}" oninput="adminState.packingSearch = this.value">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-mute text-[13px]">🔍</span>
            </div>
            <div class="flex gap-1.5 p-0.5 rounded-lg text-[11.5px]" style="background:var(--line)">
                <button onclick="window.changePackingFilter('Tất cả')" class="flex-1 py-1 rounded-md text-center font-medium transition ${adminState.packingFilter === 'Tất cả' ? 'bg-white dark:bg-[#1f293d] text-ink shadow-sm' : 'text-mute'}">Tất cả</button>
                <button onclick="window.changePackingFilter('tiktok_shop')" class="flex-1 py-1 rounded-md text-center font-medium transition ${adminState.packingFilter === 'tiktok_shop' ? 'bg-white dark:bg-[#1f293d] text-ink shadow-sm' : 'text-mute'}">TikTok Shop</button>
            </div>
            
            <div class="mt-2">
                <p class="text-[11px] text-mute uppercase tracking-wider font-semibold mb-2">ĐƠN HÀNG (1)</p>
                <div class="border-2 rounded-xl p-3.5 flex flex-col gap-2 relative transition cursor-pointer" style="border-color:var(--blues-500); background:var(--surface)">
                    <div class="flex items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
                        <span class="badge text-[9.5px] px-1.5 py-0.5 text-white flex items-center gap-1 bg-[#0c1426] dark:bg-[#1a2333] shrink-0 whitespace-nowrap" style="border:1px solid var(--line)">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white"><path d="M12.525.02c1.31-.08 2.62.08 3.84.47 1.57.51 2.94 1.48 3.93 2.76.99 1.28 1.52 2.87 1.5 4.5-.02 1.3-.3 2.58-.8 3.78a10.96 10.96 0 0 1-2.92 4.19c-1.33 1.15-2.91 2.01-4.6 2.52-1.57.47-3.23.53-4.83.17a10.63 10.63 0 0 1-5.12-2.73 11.23 11.23 0 0 1-2.95-4.66A11.75 11.75 0 0 1 .1 6.8c.11-1.34.54-2.64 1.25-3.77.72-1.13 1.72-2.03 2.9-2.6A9.9 9.9 0 0 1 8.21.05c1.44-.08 2.88-.09 4.31-.03Zm.81 4.79v5.99c0 .64-.47 1.18-1.1 1.23-.74.06-1.39-.52-1.39-1.25V4.81c0-.64.47-1.18 1.1-1.23.74-.06 1.39.52 1.39 1.25Z"/></svg>
                            TikTok
                        </span>
                        <span class="badge text-[9.5px] px-1.5 py-0.5 text-[#ef4444] bg-red-500/10 font-bold flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            ${isDone ? 'ĐÃ ĐÓNG GÓI' : 'ĐANG ĐÓNG GÓI'}
                        </span>
                    </div>
                    <h4 class="font-bold text-[13px] text-ink mt-1">${orderId}</h4>
                    <div class="flex justify-between items-center text-[11px] text-mute mt-1">
                        <span>Số lượng: 1</span>
                        <span class="flex items-center gap-1">🕒 8/4/2026</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Area: Grid Container on Desktop -->
        <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 items-stretch">
            <!-- Column 2: Center (Product Details & Video Recording) -->
            <div class="flex flex-col gap-4">
                <!-- Card Header -->
                <div class="card px-5 py-3.5 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button class="w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 grid place-items-center border" style="border-color:var(--line)">‹</button>
                        <span class="font-bold text-sm text-ink">Đơn hàng ${orderId}</span>
                        <button class="w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/5 grid place-items-center border" style="border-color:var(--line)">›</button>
                    </div>
                </div>

                <!-- Product List card -->
                <div class="card p-5 flex-1 flex flex-col gap-4">
                    <h4 class="font-semibold text-[13px] uppercase tracking-wider text-mute mb-1">Chi tiết sản phẩm</h4>
                    
                    <div class="border rounded-xl p-4 flex gap-4 items-start" style="border-color:var(--line)">
                        <div class="w-12 h-14 rounded-lg overflow-hidden shrink-0 surface relative">
                            ${fashionSVG("look-1", "indigo")}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h5 class="font-bold text-[13.5px] text-ink leading-tight">Áo Thun Trơn Boxy Co Giãn 4 Chiều Hydra Basic-Đen-S</h5>
                            <p class="text-mute text-[11.5px] mt-1">Sku: ao-thun-tron-boxy-Den-S - Trọng lượng: 500g</p>
                            <span class="badge mt-2 text-[10.5px] text-blues-600 bg-blues-500/10 font-mono">PKG-1-1-20260527021956</span>
                        </div>
                    </div>
                    
                    <!-- Video Camera Area -->
                    <div class="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-black border border-black" id="packingCameraContainer">
                        <video id="packingWebcam" class="w-full h-full object-cover scale-x-[-1]" playsinline muted></video>
                        
                        <div id="webcamFallback" class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0f172a] text-white">
                            <div class="w-14 h-14 rounded-full bg-slate-800 grid place-items-center mb-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                            </div>
                            <p class="text-[13px] font-semibold text-white/90">Webcam không hoạt động</p>
                            <p class="text-[11px] text-white/60 mt-1 max-w-[220px]">Vui lòng cấp quyền truy cập Camera hoặc sử dụng webcam của trình duyệt để tiếp tục ghi hình.</p>
                        </div>

                        <div class="absolute inset-x-0 top-0 p-4 flex items-center justify-between pointer-events-none text-white z-10" style="background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span class="text-[11px] font-semibold tracking-wider uppercase text-white/95">Live Camera feed</span>
                            </div>
                            
                            ${isRecording ? `
                                <div class="flex items-center gap-2.5 bg-red-600 px-2.5 py-1 rounded-md text-[10.5px] font-bold text-white shadow-lg animate-pulse">
                                    <span class="w-2 h-2 rounded-full bg-white"></span>
                                    <span>● REC</span>
                                    <span id="recordTimer">00:00</span>
                                </div>
                            ` : ''}
                            
                            ${isDone ? `
                                <div class="flex items-center gap-1 bg-green-600 px-2.5 py-1 rounded-md text-[10.5px] font-bold text-white shadow-lg">
                                    <span>✓ ĐÃ GHI VIDEO</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Column 3: Right (Package details & Controls) -->
            <div class="flex flex-col gap-4">
                <!-- Package list header -->
                <div class="card px-5 py-3.5 flex items-center justify-between">
                    <span class="font-bold text-sm text-ink flex items-center gap-1.5">📦 Bưu kiện</span>
                    <button onclick="UI.toast('Đã in nhãn','Đang gửi yêu cầu in nhãn bưu kiện PKG-1-1-20260527021956...','print')" class="btn btn-ghost border px-3 py-1.5 text-[11px] font-medium rounded-lg flex items-center gap-1">In nhãn (1)</button>
                </div>

                <!-- Package details -->
                <div class="card p-5 flex-1 flex flex-col justify-between">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                            <span class="font-mono font-bold text-ink">PKG-1-1-20260527021956</span>
                            <button class="text-mute hover:text-ink text-[12px]">✏️</button>
                        </div>
                        <div class="divide-y text-[12px] space-y-3" style="border-color:var(--line)">
                            <div class="flex justify-between pt-1">
                                <span class="text-mute">Loại</span>
                                <span class="font-semibold">Hộp</span>
                            </div>
                            <div class="flex justify-between pt-3">
                                <span class="text-mute">Trọng lượng hiện tại</span>
                                <span class="font-bold text-ink">500.00g</span>
                            </div>
                            <div class="flex justify-between pt-3">
                                <span class="text-mute">Trọng lượng tối đa</span>
                                <span class="font-semibold text-mute">2000.00g</span>
                            </div>
                            <div class="flex justify-between pt-3">
                                <span class="text-mute">Số lượng</span>
                                <span class="font-semibold">1</span>
                            </div>
                            <div class="flex justify-between pt-3 text-[12px] text-mute flex-wrap gap-1.5">
                                <span>Dài: <strong class="text-ink">30cm</strong></span>
                                <span>Rộng: <strong class="text-ink">22cm</strong></span>
                                <span>Cao: <strong class="text-ink">8cm</strong></span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Control buttons -->
                    <div class="flex flex-col gap-2 mt-6">
                        <button id="startPackingBtn" class="btn btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 border whitespace-nowrap" style="${isRecording || isDone ? 'background:var(--line); color:var(--mute); cursor:not-allowed;' : ''}">
                            ▶ Bắt đầu đóng gói
                        </button>
                        <button id="confirmPackingBtn" class="btn w-full py-3.5 text-sm flex items-center justify-center gap-2 border font-semibold whitespace-nowrap" style="${isRecording ? 'background:#16a34a; color:#fff;' : 'background:var(--line); color:var(--mute); cursor:not-allowed;'}" ${!isRecording ? 'disabled' : ''}>
                            ✓ Hoàn tất đóng gói
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function setupPackingHandlers(main) {
    const video = main.querySelector("#packingWebcam");
    const fallback = main.querySelector("#webcamFallback");
    
    if (video && !window.currentWebcamStream) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 400 } })
            .then(stream => {
                video.srcObject = stream;
                video.play();
                if (fallback) fallback.classList.add("hidden");
                window.currentWebcamStream = stream;
            })
            .catch(err => {
                console.warn("Webcam access denied or unavailable:", err);
                if (fallback) fallback.classList.remove("hidden");
            });
    } else if (video && window.currentWebcamStream) {
        video.srcObject = window.currentWebcamStream;
        video.play();
        if (fallback) fallback.classList.add("hidden");
    }
    
    const startBtn = main.querySelector("#startPackingBtn");
    const confirmBtn = main.querySelector("#confirmPackingBtn");
    
    if (startBtn && adminState.packingRecordState === "idle") {
        startBtn.onclick = () => {
            adminState.packingRecordState = "recording";
            adminState.packingRecordTime = 0;
            
            main.innerHTML = renderPackingScreen();
            setupPackingHandlers(main);
            
            let duration = 0;
            window.packingTimerInterval = setInterval(() => {
                duration++;
                adminState.packingRecordTime = duration;
                const timerEl = main.querySelector("#recordTimer");
                if (timerEl) {
                    const min = String(Math.floor(duration / 60)).padStart(2, '0');
                    const sec = String(duration % 60).padStart(2, '0');
                    timerEl.textContent = `${min}:${sec}`;
                }
            }, 1000);
            
            UI.toast("Ghi hình", "Đã bắt đầu quay video đóng gói đơn #HYDRA000897", "record");
        };
    }
    
    if (confirmBtn && adminState.packingRecordState === "recording") {
        confirmBtn.onclick = () => {
            clearInterval(window.packingTimerInterval);
            adminState.packingRecordState = "done";
            
            UI.toast("Đóng gói", "Đơn hàng đã đóng gói thành công. Video đối soát bưu kiện PKG-1-1-20260527021956 đã được tải lên Cloud đối soát.", "check");
            
            const orderExists = State.data.orders.some(x => x.id === "HYDRA-0897");
            if (!orderExists) {
                State.data.orders.push({
                    id: "HYDRA-0897",
                    date: "27/05/2026",
                    status: "Hoàn tất",
                    total: 1250000,
                    items: 1
                });
            }
            
            main.innerHTML = renderPackingScreen();
            setupPackingHandlers(main);
        };
    }
}

window.simulatePackingScan = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
        console.error("Audio API beep failed:", e);
    }

    UI.toast("Quét mã", "Đã quét và nhận diện đơn hàng #HYDRA000897", "check");
    adminState.packingScanned = true;
    
    const main = document.querySelector('aside').nextElementSibling;
    if (main && adminState.tab === "packing") {
        main.innerHTML = renderPackingScreen();
        setupPackingHandlers(main);
    }
};

window.changePackingFilter = (filter) => {
    adminState.packingFilter = filter;
    const main = document.querySelector('aside').nextElementSibling;
    if (main && adminState.tab === "packing") {
        main.innerHTML = renderPackingScreen();
        setupPackingHandlers(main);
    }
};
const TIKTOK_ORDERS = [
    {
        id: "57628901452391054",
        date: "27/05/2026 09:12",
        customer: "@minh_denim99",
        customerName: "Trần Thế Minh",
        phone: "+84 912 *** 456",
        address: "12 Đường số 4, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        items: [
            { name: "Raw Selvedge 14oz Slim Jean", sku: "RS-14SL-32", color: "Raw Indigo", size: "32", price: 1250000, qty: 1, img: "look-1" }
        ],
        subtotal: 1250000,
        tiktokCoupon: 150000,
        platformDiscount: 50000,
        commission: 84000,
        shippingFee: 35000,
        shippingCarrier: "J&T Express",
        trackingId: "JT88294015239",
        buyerPaid: 1085000,
        estimatedPayout: 966000,
        status: "Chờ vận chuyển",
        syncStatus: "pending"
    },
    {
        id: "57628901452391032",
        date: "27/05/2026 08:30",
        customer: "@yuna_k_style",
        customerName: "Nguyễn Yuna",
        phone: "+84 905 *** 789",
        address: "Căn hộ 1502, Tháp B, Masteri Thảo Điền, Quận 2, TP. Hồ Chí Minh",
        items: [
            { name: "Seoul Retro Denim Jacket", sku: "SR-DJ-M", color: "Vintage Blue", size: "M", price: 1650000, qty: 1, img: "look-2" }
        ],
        subtotal: 1650000,
        tiktokCoupon: 200000,
        platformDiscount: 60000,
        commission: 112000,
        shippingFee: 40000,
        shippingCarrier: "TikTok Shipping (GHTK)",
        trackingId: "GHTK992015291",
        buyerPaid: 1430000,
        estimatedPayout: 1278000,
        status: "Đang giao",
        syncStatus: "synced"
    },
    {
        id: "57628901452390984",
        date: "26/05/2026 15:45",
        customer: "@hoang_art",
        customerName: "Lê Huy Hoàng",
        phone: "+84 983 *** 123",
        address: "45 Ngõ Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
        items: [
            { name: "Loose Selvedge Jean Stone", sku: "LS-ST-30", color: "Stone Wash", size: "30", price: 1150000, qty: 1, img: "look-3" },
            { name: "Blues Logo Tee White", sku: "LT-WH-L", color: "White", size: "L", price: 450000, qty: 2, img: "look-4" }
        ],
        subtotal: 2050000,
        tiktokCoupon: 300000,
        platformDiscount: 80000,
        commission: 145000,
        shippingFee: 0,
        shippingCarrier: "J&T Express",
        trackingId: "JT88293998150",
        buyerPaid: 1670000,
        estimatedPayout: 1605000,
        status: "Hoàn tất",
        syncStatus: "synced"
    },
    {
        id: "57628901452390772",
        date: "25/05/2026 11:20",
        customer: "@tuan_anh_9x",
        customerName: "Phạm Tuấn Anh",
        phone: "+84 977 *** 567",
        address: "182 Trần Phú, Hải Châu, Đà Nẵng",
        items: [
            { name: "Seoul Retro Denim Jacket", sku: "SR-DJ-L", color: "Vintage Blue", size: "L", price: 1650000, qty: 1, img: "look-2" }
        ],
        subtotal: 1650000,
        tiktokCoupon: 0,
        platformDiscount: 0,
        commission: 0,
        shippingFee: 35000,
        shippingCarrier: "TikTok Shipping (NinjaVan)",
        trackingId: "NV992015562",
        buyerPaid: 0,
        estimatedPayout: 0,
        status: "Đã hủy",
        syncStatus: "ignored"
    }
];

function renderTikTokShop() {
    const pendingCount = TIKTOK_ORDERS.filter(x => x.status === "Chờ vận chuyển" && x.syncStatus === "pending").length;
    return `
    <div class="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
            <p class="font-semibold text-lg">TikTok Shop Manager</p>
            <p class="text-[12px] text-mute">Quản lý và đồng bộ trực tiếp đơn hàng từ gian hàng @theblues.official</p>
        </div>
        <div class="flex items-center gap-3">
            <button id="tiktokSyncBtn" class="btn btn-primary px-5 py-2.5 text-[13px] flex items-center gap-2">
                <svg id="syncSpinner" class="hidden animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span id="syncBtnText">⟳ Đồng bộ đơn hàng</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card p-4">
            <p class="text-[11px] text-mute uppercase tracking-wider">Doanh thu TikTok</p>
            <p class="text-2xl font-bold mt-1">4.185.000đ</p>
            <p class="text-[11px] text-emerald-600 mt-1">▲ 3 đơn hàng hôm nay</p>
        </div>
        <div class="card p-4">
            <p class="text-[11px] text-mute uppercase tracking-wider">Chờ vận chuyển</p>
            <p class="text-2xl font-bold mt-1" id="pendingShipCount">${pendingCount}</p>
            <p class="text-[11px] text-amber-600 mt-1">Đơn cần đóng gói gấp</p>
        </div>
        <div class="card p-4">
            <p class="text-[11px] text-mute uppercase tracking-wider">Đang giao</p>
            <p class="text-2xl font-bold mt-1">1</p>
            <p class="text-[11px] text-blues-500 mt-1">Đang trung chuyển</p>
        </div>
        <div class="card p-4">
            <p class="text-[11px] text-mute uppercase tracking-wider">Trạng thái API</p>
            <p class="text-2xl font-bold mt-1 text-emerald-600 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Kết nối tốt
            </p>
            <p class="text-[11px] text-mute mt-1" id="lastSyncTime">Đồng bộ 2 phút trước</p>
        </div>
    </div>

    <div class="flex gap-1 p-1 rounded-xl mb-4 overflow-x-auto no-scrollbar" style="background:var(--surface); border:1px solid var(--line)">
        ${["Tất cả", "Chờ vận chuyển", "Đang giao", "Hoàn tất", "Đã hủy"].map(lbl => {
            const active = (adminState.tiktokFilter || "Tất cả") === lbl;
            return `<button data-filter="${lbl}" class="tiktokFilterTab whitespace-nowrap px-4 py-2 rounded-lg text-[13px] font-medium transition ${active ? 'grad-navy text-white' : 'text-mute hover:text-ink'}">${lbl}</button>`;
        }).join("")}
    </div>

    <div class="card overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-[12.5px] whitespace-nowrap">
                <thead>
                    <tr class="text-left text-mute" style="border-bottom:1px solid var(--line)">
                        <th class="px-4 py-3 font-medium">Mã đơn TikTok</th>
                        <th class="px-4 py-3 font-medium">Thời gian</th>
                        <th class="px-4 py-3 font-medium">Khách hàng</th>
                        <th class="px-4 py-3 font-medium">Sản phẩm</th>
                        <th class="px-4 py-3 font-medium text-right">Tổng tiền</th>
                        <th class="px-4 py-3 font-medium">Đơn vị VC</th>
                        <th class="px-4 py-3 font-medium">Trạng thái</th>
                        <th class="px-4 py-3 font-medium text-center">ERP Sync</th>
                    </tr>
                </thead>
                <tbody id="tiktokOrdersTableBody">
                    ${renderTikTokOrderRows(adminState.tiktokFilter || "Tất cả")}
                </tbody>
            </table>
        </div>
    </div>`;
}

function renderTikTokOrderRows(filter = "Tất cả") {
    const filtered = TIKTOK_ORDERS.filter(o => filter === "Tất cả" || o.status === filter);
    if (filtered.length === 0) {
        return `<tr><td colspan="8" class="text-center py-8 text-mute">Không có đơn hàng nào thuộc trạng thái này.</td></tr>`;
    }
    return filtered.map(o => {
        const syncBadge = o.syncStatus === "synced" 
            ? `<span class="badge" style="background:#16a34a;color:#fff">Đã đồng bộ</span>`
            : o.syncStatus === "pending"
                ? `<span class="badge" style="background:#d97706;color:#fff">Chờ đồng bộ</span>`
                : `<span class="badge" style="background:var(--line);color:var(--soft)">Bỏ qua</span>`;
        
        const statusBadge = {
            "Chờ thanh toán": `<span class="badge text-white" style="background:#4b5563">Chờ thanh toán</span>`,
            "Chờ vận chuyển": `<span class="badge text-white" style="background:#d97706">Chờ vận chuyển</span>`,
            "Đang giao": `<span class="badge text-white" style="background:#2563eb">Đang giao</span>`,
            "Hoàn tất": `<span class="badge text-white" style="background:#16a34a">Hoàn tất</span>`,
            "Đã hủy": `<span class="badge" style="background:var(--line);color:var(--soft)">Đã hủy</span>`
        }[o.status] || o.status;

        const itemSummary = o.items.map(it => `${it.name} (${it.color}/${it.size}) x${it.qty}`).join("<br/>");

        return `
        <tr style="border-bottom:1px solid var(--line)" class="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer tiktok-order-row" data-order-id="${o.id}">
            <td class="px-4 py-3.5 font-mono font-semibold text-blues-500">${o.id}</td>
            <td class="px-4 py-3.5 text-mute">${o.date}</td>
            <td class="px-4 py-3.5"><div class="font-medium">${o.customerName}</div><div class="text-[11px] text-mute">${o.customer}</div></td>
            <td class="px-4 py-3.5 min-w-[200px] truncate max-w-[300px]" title="${itemSummary.replace(/<br\/>/g, ', ')}">${itemSummary}</td>
            <td class="px-4 py-3.5 text-right font-semibold">${fmt(o.buyerPaid)}</td>
            <td class="px-4 py-3.5 text-mute">${o.shippingCarrier}</td>
            <td class="px-4 py-3.5">${statusBadge}</td>
            <td class="px-4 py-3.5 text-center">${syncBadge}</td>
        </tr>`;
    }).join("");
}

window.openTikTokOrderDetail = (orderId) => {
    const o = TIKTOK_ORDERS.find(x => x.id === orderId);
    if (!o) return;

    const statusBadge = {
        "Chờ thanh toán": `<span class="badge text-white" style="background:#4b5563">Chờ thanh toán</span>`,
        "Chờ vận chuyển": `<span class="badge text-white" style="background:#d97706">Chờ vận chuyển</span>`,
        "Đang giao": `<span class="badge text-white" style="background:#2563eb">Đang giao</span>`,
        "Hoàn tất": `<span class="badge text-white" style="background:#16a34a">Hoàn tất</span>`,
        "Đã hủy": `<span class="badge" style="background:var(--line);color:var(--soft)">Đã hủy</span>`
    }[o.status] || o.status;

    const syncBadge = o.syncStatus === "synced" 
        ? `<span class="badge" style="background:#16a34a;color:#fff">Đã đồng bộ ERP</span>`
        : o.syncStatus === "pending"
            ? `<span class="badge" style="background:#d97706;color:#fff">Chờ đồng bộ</span>`
            : `<span class="badge" style="background:var(--line);color:var(--soft)">Bỏ qua</span>`;

    const modalContent = `
    <div class="p-6 sm:p-8">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
            <div>
                <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="headline text-xl sm:text-2xl">Chi tiết đơn hàng TikTok</h3>
                    ${statusBadge}
                    ${syncBadge}
                </div>
                <p class="text-[11px] font-mono text-mute mt-1">TikTok Order ID: ${o.id} · Đặt lúc ${o.date}</p>
            </div>
            <button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="text-mute hover:text-ink text-2xl leading-none">×</button>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mt-4">
            <!-- Left Panel: Delivery & Items -->
            <div class="space-y-4">
                <!-- Shipping Info -->
                <div class="card p-4" style="background:var(--surface)">
                    <h4 class="font-semibold text-[13px] uppercase tracking-wider text-mute mb-2">Thông tin giao hàng</h4>
                    <div class="text-[12.5px] space-y-1">
                        <p><span class="font-medium text-mute">Người nhận:</span> ${o.customerName}</p>
                        <p><span class="font-medium text-mute">Điện thoại:</span> ${o.phone}</p>
                        <p><span class="font-medium text-mute">Địa chỉ:</span> ${o.address}</p>
                        <div class="mt-2.5 pt-2.5 hairline-t flex items-center justify-between text-[11px]">
                            <span>Đơn vị vận chuyển: <span class="font-semibold">${o.shippingCarrier}</span></span>
                            <span>Mã vận đơn: <span class="font-mono font-semibold text-blues-500">${o.trackingId}</span></span>
                        </div>
                    </div>
                </div>

                <!-- Products Info -->
                <div class="card p-4">
                    <h4 class="font-semibold text-[13px] uppercase tracking-wider text-mute mb-3">Sản phẩm đặt mua</h4>
                    <div class="space-y-3">
                        ${o.items.map(it => `
                            <div class="flex gap-3">
                                <div class="w-12 h-14 rounded-lg overflow-hidden shrink-0 relative surface">
                                    ${fashionSVG(it.img, "indigo")}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-[12.5px] font-semibold truncate">${it.name}</p>
                                    <p class="text-[11px] text-mute">${it.color} · Size ${it.size} · SKU: ${it.sku}</p>
                                    <div class="flex items-center justify-between mt-1 text-[12px]">
                                        <span class="text-mute">${fmt(it.price)} x ${it.qty}</span>
                                        <span class="font-semibold">${fmt(it.price * it.qty)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>

            <!-- Right Panel: Financial & Actions -->
            <div class="space-y-4">
                <!-- Finance summary -->
                <div class="card p-4" style="background:var(--surface)">
                    <h4 class="font-semibold text-[13px] uppercase tracking-wider text-mute mb-3">Tài chính & Thuế sàn</h4>
                    <div class="text-[12.5px] space-y-2">
                        <div class="flex justify-between">
                            <span class="text-mute">Tạm tính (Người mua):</span>
                            <span>${fmt(o.subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-red-500">
                            <span class="text-mute">Khuyến mãi TikTok Shop:</span>
                            <span>-${fmt(o.tiktokCoupon)}</span>
                        </div>
                        <div class="flex justify-between text-red-500">
                            <span class="text-mute">Trợ giá vận chuyển sàn:</span>
                            <span>-${fmt(o.platformDiscount)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-mute">Phí vận chuyển thực tế:</span>
                            <span>${fmt(o.shippingFee)}</span>
                        </div>
                        <div class="flex justify-between pt-2.5 hairline-t font-semibold text-[13px]">
                            <span>Người mua thanh toán:</span>
                            <span class="text-ink">${fmt(o.buyerPaid)}</span>
                        </div>
                        <div class="flex justify-between text-amber-600">
                            <span class="text-mute">Chiết khấu sàn (Platform Fee):</span>
                            <span>-${fmt(o.commission)}</span>
                        </div>
                        <div class="flex justify-between pt-2.5 border-t-2 border-dashed font-bold text-[14px]" style="border-color:var(--line)">
                            <span class="text-blues-500">Doanh thu thực nhận ERP:</span>
                            <span class="text-blues-500">${fmt(o.estimatedPayout)}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 mt-2">
                    ${o.syncStatus === "pending" ? `
                        <button onclick="window.syncSingleTikTokOrder('${o.id}', this)" class="btn btn-primary w-full py-3 text-sm">
                            ⟳ Đồng bộ sang ERP / POS
                        </button>
                    ` : ""}
                    <button onclick="UI.toast('Đang in nhãn','Đã gửi lệnh in nhãn đơn hàng ${o.id} sang máy in...','print')" class="btn btn-ghost w-full py-3 text-sm flex items-center justify-center gap-2 border hairline">
                        🖨️ In nhãn vận chuyển (TikTok Shipping Label)
                    </button>
                    <button onclick="UI.closeOverlay(this.closest('[data-mounted]'))" class="btn btn-ghost w-full py-3 text-[13px]">
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    </div>`;

    UI.modal(modalContent, "max-w-3xl");
};

window.syncSingleTikTokOrder = (orderId, btn) => {
    btn.disabled = true;
    btn.textContent = "Đang đồng bộ...";
    
    setTimeout(() => {
        const o = TIKTOK_ORDERS.find(x => x.id === orderId);
        if (o) {
            o.syncStatus = "synced";
            const orderExists = State.data.orders.some(x => x.id === `TT-${o.id.substring(o.id.length - 4)}`);
            if (!orderExists) {
                State.data.orders.push({
                    id: `TT-${o.id.substring(o.id.length - 4)}`,
                    date: o.date.split(" ")[0],
                    status: "Hoàn tất",
                    total: o.estimatedPayout,
                    items: o.items.reduce((acc, x) => acc + x.qty, 0)
                });
            }
        }
        UI.toast("Đồng bộ", `Đã đồng bộ thành công đơn hàng TikTok #${orderId} sang hệ thống ERP.`, "check");
        
        const modal = btn.closest('[data-mounted]');
        if (modal) UI.closeOverlay(modal);
        
        const activeFilter = document.querySelector(".tiktokFilterTab.grad-navy")?.dataset.filter || "Tất cả";
        const tableBody = document.getElementById("tiktokOrdersTableBody");
        if (tableBody) tableBody.innerHTML = renderTikTokOrderRows(activeFilter);
        
        const pendingCountEl = document.getElementById("pendingShipCount");
        if (pendingCountEl) {
            const pendingCount = TIKTOK_ORDERS.filter(x => x.status === "Chờ vận chuyển" && x.syncStatus === "pending").length;
            pendingCountEl.textContent = pendingCount;
        }
    }, 1200);
};

window.syncTikTokOrders = (btn) => {
    const spinner = btn.querySelector("#syncSpinner");
    const text = btn.querySelector("#syncBtnText");
    
    spinner.classList.remove("hidden");
    btn.disabled = true;
    text.textContent = "Đang đồng bộ…";
    
    setTimeout(() => {
        let syncedCount = 0;
        TIKTOK_ORDERS.forEach(o => {
            if (o.syncStatus === "pending") {
                o.syncStatus = "synced";
                syncedCount++;
                const orderExists = State.data.orders.some(x => x.id === `TT-${o.id.substring(o.id.length - 4)}`);
                if (!orderExists) {
                    State.data.orders.push({
                        id: `TT-${o.id.substring(o.id.length - 4)}`,
                        date: o.date.split(" ")[0],
                        status: "Hoàn tất",
                        total: o.estimatedPayout,
                        items: o.items.reduce((acc, x) => acc + x.qty, 0)
                    });
                }
            }
        });
        
        spinner.classList.add("hidden");
        btn.disabled = false;
        text.textContent = "✓ Đã đồng bộ";
        
        setTimeout(() => {
            text.textContent = "⟳ Đồng bộ đơn hàng";
        }, 2000);
        
        UI.toast("TikTok Shop", `Đã đồng bộ thành công ${syncedCount} đơn hàng mới sang hệ thống ERP.`, "check");
        
        const activeFilter = document.querySelector(".tiktokFilterTab.grad-navy")?.dataset.filter || "Tất cả";
        const tableBody = document.getElementById("tiktokOrdersTableBody");
        if (tableBody) tableBody.innerHTML = renderTikTokOrderRows(activeFilter);
        
        const pendingCountEl = document.getElementById("pendingShipCount");
        if (pendingCountEl) {
            const pendingCount = TIKTOK_ORDERS.filter(x => x.status === "Chờ vận chuyển" && x.syncStatus === "pending").length;
            pendingCountEl.textContent = pendingCount;
        }
        
        const lastSyncEl = document.getElementById("lastSyncTime");
        if (lastSyncEl) lastSyncEl.textContent = "Đồng bộ vừa xong";
    }, 1800);
};

function renderAdminChart(metric = 'revenue') {
    const datasets = {
        revenue: {
            label: "Doanh thu",
            data: [18400000, 22500000, 19800000, 28400000, 24600000, 32800000, 30500000],
            days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
            shortDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            format: (v) => fmt(v),
            color: "var(--grad-navy)",
            desc: "Doanh thu tuần này: " + fmt(177000000)
        },
        orders: {
            label: "Đơn hàng",
            data: [42, 58, 49, 72, 64, 88, 76],
            days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
            shortDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            format: (v) => v + " đơn hàng",
            color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            desc: "Tổng đơn hàng tuần này: 449 đơn"
        },
        visitors: {
            label: "Lượt truy cập",
            data: [1240, 1580, 1490, 2120, 1840, 2580, 2260],
            days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
            shortDays: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            format: (v) => v.toLocaleString("vi-VN") + " lượt",
            color: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            desc: "Tổng truy cập tuần này: 13.110 lượt"
        }
    };

    const ds = datasets[metric] || datasets.revenue;
    const max = Math.max(...ds.data);

    return `
    <div class="chart-wrapper flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-[12px] text-mute font-medium">${ds.desc}</span>
            <div class="flex gap-1 p-0.5 rounded-lg" style="background:var(--line)">
                ${["revenue", "orders", "visitors"].map(m => {
                    const active = m === metric;
                    const lbl = m === "revenue" ? "Doanh thu" : m === "orders" ? "Đơn hàng" : "Truy cập";
                    return `<button onclick="window.changeAdminChart('${m}')" class="px-2.5 py-0.5 text-[10px] font-medium rounded-md transition ${active ? 'bg-white dark:bg-[#1f293d] text-ink shadow-sm' : 'text-mute hover:text-ink'}">${lbl}</button>`;
                }).join("")}
            </div>
        </div>
        <div class="flex items-end gap-2 sm:gap-3.5 h-32 pt-4">
            ${ds.data.map((v, i) => {
                const pct = max > 0 ? (v / max) * 100 : 0;
                return `
                <div class="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0c1426] dark:bg-[#1a2333] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap shadow-lg z-20 transform translate-y-1 group-hover:translate-y-0" style="border: 1px solid var(--line)">
                        <p class="font-medium text-white/70">${ds.days[i]}</p>
                        <p class="font-bold text-blues-400 mt-0.5">${ds.format(v)}</p>
                    </div>
                    <!-- Bar -->
                    <div class="w-full rounded-t-md transition-all duration-300 hover:opacity-85 cursor-pointer relative" style="height:${pct}%; background:${ds.color}; min-height: 4px;">
                        <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition rounded-t-md"></div>
                    </div>
                    <!-- Label -->
                    <span class="text-[10px] text-mute font-medium">${ds.shortDays[i]}</span>
                </div>`;
            }).join("")}
        </div>
    </div>`;
}

