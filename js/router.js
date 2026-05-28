/* =====================================================================
   ROUTER  — MPA navigation. Replaces the original SPA router.
   Router.go(name, params) navigates to the matching .html file.
   Route name is derived from the current URL pathname.
   ===================================================================== */
const ROUTES = [
    "home",
    "shop",
    "product",
    "checkout",
    "wishlist",
    "loyalty",
    "account",
    "about",
    "lookbook",
    "careers",
    "crm",
    "admin",
];

function currentRouteName() {
    const path = location.pathname.replace(/\/+$/, "");
    const file = path.split("/").pop() || "";
    if (!file || file === "index.html") return "home";
    const m = file.match(/^([a-z]+)\.html$/);
    if (m && ROUTES.includes(m[1])) return m[1];
    return "home";
}

function routeHref(name) {
    const inPages = /\/pages\//.test(location.pathname);
    if (name === "home") return inPages ? "../index.html" : "index.html";
    return inPages ? `${name}.html` : `pages/${name}.html`;
}

function buildHref(name, params = {}) {
    const base = routeHref(name);
    const keys = Object.keys(params || {});
    if (!keys.length) return base;
    const sp = new URLSearchParams();
    keys.forEach((k) => {
        const v = params[k];
        if (v === undefined || v === null || v === "") return;
        sp.append(k, String(v));
    });
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
}

const Router = {
    routes: {},
    add(name, fn) {
        this.routes[name] = fn;
    },
    go(name, params = {}) {
        // tear down webcam/timer if leaving admin
        if (name !== "admin" && window.currentWebcamStream) {
            try {
                window.currentWebcamStream
                    .getTracks()
                    .forEach((track) => track.stop());
                window.currentWebcamStream = null;
            } catch (err) {
                /* ignore */
            }
            if (window.packingTimerInterval) {
                clearInterval(window.packingTimerInterval);
            }
        }
        if (!ROUTES.includes(name)) name = "home";
        location.href = buildHref(name, params);
    },
};

function readQueryParams() {
    const params = {};
    new URLSearchParams(location.search).forEach((v, k) => {
        params[k] = v;
    });
    return params;
}
