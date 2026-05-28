/* =====================================================================
   PAGE INIT  — shared bootstrap for every page in the MPA.
   Each page HTML calls window.bootstrapPage(renderFn) when ready.
   ===================================================================== */
(function () {
    const STATIC_NOTIFS = [
        {
            title: "🔥 Sale alert",
            msg: "Selvedge Tapered Jean trong wishlist vừa giảm 20%.",
            kind: "sale",
            read: false,
            time: "2 giờ trước",
        },
        {
            title: "Đơn #TB-2599 đang giao",
            msg: "Kiện hàng của bạn sẽ đến trong 1–2 ngày.",
            kind: "info",
            read: false,
            time: "Hôm qua",
        },
        {
            title: "🎁 +50 điểm sinh nhật",
            msg: "Chúc mừng sinh nhật! Quà đã vào ví của bạn.",
            kind: "info",
            read: true,
            time: "3 ngày trước",
        },
    ];

    function partialsPath(file) {
        const inPages = /\/pages\//.test(location.pathname);
        return (inPages ? "../" : "") + "partials/" + file;
    }

    async function loadPartials() {
        const wrap = document.getElementById("chrome-mount");
        if (!wrap) return;
        // Prefer baked-in JS partial (works on file:// too).
        if (typeof window.CHROME_PARTIAL_HTML === "string") {
            wrap.innerHTML = window.CHROME_PARTIAL_HTML;
            return;
        }
        // Fallback: fetch the html partial. Requires a local server.
        try {
            const res = await fetch(partialsPath("header.html"));
            wrap.innerHTML = await res.text();
        } catch (e) {
            console.error("Không load được partials/header.html — cần local server:", e);
        }
    }

    function seedDefaults() {
        loadPersistedState();
        if (!State.data.notifs || !State.data.notifs.length) {
            State.data.notifs = STATIC_NOTIFS.map((n) => ({ id: uid(), ...n }));
        }
    }

    function initTheme() {
        const isDark = State.data.theme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        const moon = document.getElementById("iconMoon");
        const sun = document.getElementById("iconSun");
        if (moon) moon.classList.toggle("hidden", isDark);
        if (sun) sun.classList.toggle("hidden", !isDark);
    }

    function initScrollChrome() {
        let lastY = 0;
        const bar = document.getElementById("topbar");
        if (!bar) return;
        window.addEventListener(
            "scroll",
            () => {
                const y = window.scrollY;
                bar.classList.toggle("scrolled", y > 10);
                if (y > lastY && y > 240) bar.classList.add("hidden-bar");
                else bar.classList.remove("hidden-bar");
                lastY = y;
            },
            { passive: true },
        );
    }

    let _seededCRM = false;
    function seedCRMOnce() {
        if (_seededCRM) return;
        _seededCRM = true;
        CRM.fire("register");
        CRM.fire("checkout", {});
        CRM.fire("wishlist", {});
    }

    async function bootstrap(renderFn) {
        seedDefaults();
        await loadPartials();
        buildNav();
        buildFooter();
        initTheme();
        initScrollChrome();
        seedCRMOnce();
        State.sub(() => {
            Badges.update();
        });

        const params = readQueryParams();
        const app = document.getElementById("app");
        const fn = renderFn || Router.routes[currentRouteName()];
        if (fn && app) {
            try {
                const node = await fn(params);
                if (node) app.appendChild(node);
            } catch (err) {
                console.error("Render error:", err);
            }
        }
        UI.afterRender();
    }

    window.bootstrapPage = bootstrap;
})();
