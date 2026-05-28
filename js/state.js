/* =====================================================================
   GLOBAL STATE  (event-driven)
   ===================================================================== */
const State = {
    data: {
        route: "home",
        params: {},
        theme: "light",
        cart: [],
        wishlist: [],
        recentlyViewed: [],
        saveForLater: [],
        notifs: [],
        points: 1240, // starts as Gold member for a rich demo
        pointHistory: [
            { t: "Đăng ký tài khoản", pts: +20, date: "12/02/2026" },
            { t: "Đơn #TB-2381", pts: +128, date: "18/02/2026" },
            { t: "Đánh giá sản phẩm", pts: +15, date: "25/02/2026" },
            { t: "Sinh nhật", pts: +50, date: "02/03/2026" },
            { t: "Đơn #TB-2599", pts: +241, date: "14/04/2026" },
        ],
        orders: [
            {
                id: "TB-2599",
                date: "14/04/2026",
                status: "Đang giao",
                total: 2410000,
                items: 2,
            },
            {
                id: "TB-2381",
                date: "18/02/2026",
                status: "Hoàn tất",
                total: 1280000,
                items: 1,
            },
        ],
        vouchers: [
            {
                code: "WELCOME100",
                label: "Welcome voucher",
                value: "100.000đ",
                exp: "31/12/2026",
                used: false,
            },
            {
                code: "GOLDSHIP",
                label: "Free express shipping",
                value: "Miễn phí ship",
                exp: "30/06/2026",
                used: false,
            },
        ],
        user: {
            name: "Nguyễn Anh Quân",
            email: "quan@theblues.vn",
            joined: "12/02/2026",
            phone: "09xx xxx xxx",
        },
        appliedCoupon: null,
        usePoints: false,
    },
    subs: [],
    sub(fn) {
        this.subs.push(fn);
    },
    emit() {
        this.subs.forEach((f) => f(this.data));
        persist();
    },
    set(patch) {
        Object.assign(this.data, patch);
        this.emit();
    },
};
const STATE_STORAGE_KEY = "thebluesState_v1";
const PERSISTED_KEYS = [
    "theme",
    "cart",
    "wishlist",
    "recentlyViewed",
    "saveForLater",
    "notifs",
    "points",
    "pointHistory",
    "orders",
    "vouchers",
    "user",
    "appliedCoupon",
    "usePoints",
];
function persist() {
    try {
        const out = {};
        PERSISTED_KEYS.forEach((k) => (out[k] = State.data[k]));
        localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(out));
    } catch (e) {
        /* storage unavailable — ignore */
    }
}
function loadPersistedState() {
    try {
        const raw = localStorage.getItem(STATE_STORAGE_KEY);
        if (!raw) return;
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") {
            PERSISTED_KEYS.forEach((k) => {
                if (k in obj) State.data[k] = obj[k];
            });
        }
    } catch (e) {
        /* corrupted storage — ignore */
    }
}

/* derived */
const cartCount = () => State.data.cart.reduce((a, c) => a + c.qty, 0);
const cartSubtotal = () => State.data.cart.reduce((a, c) => a + c.price * c.qty, 0);
const wishCount = () => State.data.wishlist.length;

/* =====================================================================
   FAKE API  (async simulation w/ latency)
   ===================================================================== */
const API = {
    async fetchProducts(filter = {}) {
        await sleep(420 + Math.random() * 350);
        let list = [...PRODUCTS];
        if (filter.cat) list = list.filter((p) => p.cat === filter.cat);
        if (filter.collection)
            list = list.filter((p) => p.collection === filter.collection);
        if (filter.tag) list = list.filter((p) => p.tag === filter.tag);
        if (filter.sizes?.length)
            list = list.filter((p) => p.sizes.some((s) => filter.sizes.includes(s)));
        if (filter.colors?.length)
            list = list.filter((p) =>
                p.colors.some((c) => filter.colors.includes(c.name)),
            );
        if (filter.priceMax) list = list.filter((p) => p.price <= filter.priceMax);
        if (filter.avail === "instock") list = list.filter((p) => p.stock > 0);
        if (filter.sort === "price-asc") list.sort((a, b) => a.price - b.price);
        if (filter.sort === "price-desc") list.sort((a, b) => b.price - a.price);
        if (filter.sort === "rating") list.sort((a, b) => b.rating - a.rating);
        if (filter.sort === "new")
            list.sort((a, b) => (b.tag === "new") - (a.tag === "new"));
        return list;
    },
    async syncInventory() {
        await sleep(900 + Math.random() * 700);
        return INVENTORY_NODES.map((n) => ({
            ...n,
            last: "just now",
            status: Math.random() > 0.12 ? "ok" : "warn",
        }));
    },
    async checkout() {
        await sleep(1400);
        return {
            orderId: "TB-" + (2600 + Math.floor(Math.random() * 400)),
            eta: "2–4 ngày",
        };
    },
};
