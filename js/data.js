/* ----------------------- DATA: PRODUCTS ----------------------- */
const CATS = ["Denim", "Outerwear", "Knitwear", "Shirts", "Tees", "Accessories"];
const COLLECTIONS = [
    "SS26 Indigo",
    "Selvedge Archive",
    "Workwear Edit",
    "Essentials",
    "Founder Capsule",
];
const COLORS = [
    { name: "Indigo Raw", hex: "#1F3C88", pal: "raw" },
    { name: "Washed Blue", hex: "#5470c0", pal: "wash" },
    { name: "Midnight", hex: "#111d45", pal: "ink" },
    { name: "Stone", hex: "#8b93ab", pal: "stone" },
    { name: "Ecru", hex: "#cfc6b0", pal: "ecru" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PNAMES = [
    ["Kuroki Selvedge Slim Jean", "Denim"],
    ["Type-III Trucker Jacket", "Outerwear"],
    ["Indigo Cropped Wide Jean", "Denim"],
    ["Raw Denim Chore Coat", "Outerwear"],
    ["Heavyweight Loopwheel Tee", "Tees"],
    ["Merino Half-Zip Knit", "Knitwear"],
    ["Western Snap Denim Shirt", "Shirts"],
    ["Tapered Carpenter Pant", "Denim"],
    ["Indigo Overdye Hoodie", "Knitwear"],
    ["Selvedge Field Jacket", "Outerwear"],
    ["Boxy Pocket Tee", "Tees"],
    ["Pleated Wide Trouser", "Denim"],
    ["Cashmere Crew Sweater", "Knitwear"],
    ["Oxford Band-Collar Shirt", "Shirts"],
    ["Waxed Denim Parka", "Outerwear"],
    ["Ribbed Tank Twin-Pack", "Tees"],
    ["Double-Knee Painter Jean", "Denim"],
    ["Suede Trim Cap", "Accessories"],
    ["Indigo Bandana Scarf", "Accessories"],
    ["Leather Belt — Brass", "Accessories"],
    ["Garment-Dyed Sweatpant", "Knitwear"],
    ["Cropped Denim Vest", "Outerwear"],
    ["Selvedge Tote — Natural", "Accessories"],
    ["Mock-Neck Long Sleeve", "Tees"],
];
const tags = [
    "new",
    "sale",
    "best",
    null,
    null,
    "best",
    "new",
    null,
    "sale",
    "new",
    null,
    "best",
    null,
    null,
    "sale",
    null,
    "new",
    null,
    null,
    "best",
    "sale",
    null,
    "new",
    null,
];

const PRODUCTS = PNAMES.map((pn, i) => {
    const base = [
        890000, 2490000, 1290000, 2890000, 690000, 1690000, 1190000, 1390000, 1490000,
        3290000, 590000, 1590000, 2190000, 990000, 3690000, 790000, 1690000, 490000,
        390000, 690000, 990000, 1890000, 890000, 650000,
    ][i];
    const onSale = tags[i] === "sale";
    const price = onSale ? Math.round((base * 0.78) / 1000) * 1000 : base;
    const cols = COLORS.slice(0, 2 + (i % 3)).map((c) => c);
    return {
        id: "p" + (i + 1),
        name: pn[0],
        cat: pn[1],
        collection: COLLECTIONS[i % COLLECTIONS.length],
        price,
        oldPrice: onSale ? base : null,
        tag: tags[i],
        rating: (4.2 + (hashStr(pn[0]) % 8) / 10).toFixed(1),
        reviews: 12 + (hashStr(pn[0]) % 320),
        colors: cols,
        sizes: SIZES.slice(0, 4 + (i % 3)),
        stock: 3 + (hashStr(pn[0]) % 40),
        palette: cols[0].pal,
        material: [
            "100% Japanese cotton selvedge denim",
            "Garment-washed for softness",
            "Loopwheel cotton jersey, 9.2oz",
            "Brushed merino lambswool",
            "Organic cotton oxford weave",
        ][i % 5],
        fabric: [
            "14.5oz unsanforized · woven on vintage shuttle looms in Okayama",
            "Cone Mills heritage construction",
            "Tubular knit, no side seam",
            "Mulesing-free merino, fully fashioned",
        ][i % 4],
        desc: "Crafted from premium materials with an obsessive attention to fit and finish — a quiet, considered piece built to age beautifully.",
        care: "Wash cold inside-out. Hang dry. Iron low.",
        origin: "Cut & sewn at The Blues atelier, Đà Nẵng",
    };
});
const productById = (id) => PRODUCTS.find((p) => p.id === id);

/* reviews mock */
const REVIEWS = {};
PRODUCTS.forEach((p) => {
    const names = [
        "Minh T.",
        "David L.",
        "Quang N.",
        "Hữu P.",
        "James W.",
        "Tuấn A.",
        "Kenji S.",
        "Long V.",
    ];
    const txt = [
        "Vải dày dặn, form chuẩn, lên màu indigo rất đẹp.",
        "Fit is impeccable, fades beautifully after a month.",
        "Đáng tiền, chất lượng vượt mong đợi.",
        "Premium feel, runs true to size.",
        "Đường may sắc sảo, đóng gói cao cấp.",
    ];
    REVIEWS[p.id] = Array.from({ length: 3 + (hashStr(p.id) % 4) }, (_, i) => ({
        name: names[(hashStr(p.id) + i) % names.length],
        stars: 4 + (i % 2),
        title: ["Quality denim", "Repeat buyer", "Worth every đồng", "Beautiful piece"][
            i % 4
        ],
        body: txt[(hashStr(p.id) + i) % txt.length],
        date: `${1 + i * 3} ngày trước`,
        verified: true,
    }));
});

/* =====================================================================
   LOYALTY ENGINE  (per spec §7)
   10.000đ = 1 điểm  ·  earn: 100k = 10 pts  ·  redeem 100pts = 50.000đ
   max redeem 20% order value  ·  tiers Blue/Silver/Gold/Black
   ===================================================================== */
const TIERS = [
    {
        key: "blue",
        name: "Blue Member",
        min: 0,
        max: 299,
        color: "#21409A",
        grad: "linear-gradient(135deg,#2a4eb0,#1E3A8A,#111d45)",
        perks: ["Welcome voucher 100.000đ", "Wishlist & sale alerts", "BST email sớm"],
    },
    {
        key: "silver",
        name: "Silver",
        min: 300,
        max: 999,
        color: "#9aa4bd",
        grad: "linear-gradient(135deg,#c9cfdb,#9aa4bd,#5b6480)",
        perks: ["Early access drops", "Free ship đơn >1 triệu", "Priority support"],
    },
    {
        key: "gold",
        name: "Gold",
        min: 1000,
        max: 2499,
        color: "#c79a4e",
        grad: "linear-gradient(135deg,#f0d79a,#c79a4e,#8a6a2c)",
        perks: [
            "VIP launch invitations",
            "Personal styling support",
            "Pre-order access",
        ],
    },
    {
        key: "black",
        name: "Black",
        min: 2500,
        max: Infinity,
        color: "#0c1426",
        grad: "linear-gradient(135deg,#3a4569,#141d3a,#05080f)",
        perks: [
            "Đặc quyền hạng Black",
            "Capsule & limited release access",
            "Premium seasonal gift",
            "Private event invitation",
        ],
    },
];
TIERS[1].grad = "linear-gradient(135deg,#dfe4ee,#9aa4bd,#5b6480)";
function tierFor(pts) {
    return TIERS.find((t) => pts >= t.min && pts <= t.max) || TIERS[0];
}
function nextTier(pts) {
    const i = TIERS.findIndex((t) => t.key === tierFor(pts).key);
    return TIERS[i + 1] || null;
}
/* nav config */
const NAV = [
    { label: "Trang chủ", route: "home" },
    { label: "Shop", route: "shop" },
    { label: "Denim", route: "shop", params: { cat: "Denim" } },
    { label: "Lookbook", route: "lookbook" },
    { label: "Membership", route: "loyalty" },
    { label: "Câu chuyện", route: "about" },
    { label: "Tuyển dụng", route: "careers" },
    { label: "CRM Studio", route: "crm" },
    { label: "Admin", route: "admin" },
];
const INVENTORY_NODES = [
    { wh: "HCMC · Central Warehouse", sku: 842, status: "ok", sync: "2 phút trước" },
    { wh: "Hà Nội · Fulfillment Hub", sku: 612, status: "ok", sync: "4 phút trước" },
    { wh: "Đà Nẵng · Atelier Stock", sku: 318, status: "warn", sync: "21 phút trước" },
    { wh: "3PL · Ninja Logistics", sku: 1204, status: "ok", sync: "1 phút trước" },
];
