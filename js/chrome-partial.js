/* Inline header/announce/mobile-bottom-nav HTML so the app works
   without a fetch (file:// or static hosts that block XHR). */
window.CHROME_PARTIAL_HTML = `<!-- ====== ANNOUNCEMENT BAR ====== -->
<div
    id="announce"
    class="grad-navy text-white text-[11px] tracking-wider relative overflow-hidden"
>
    <div class="overflow-hidden whitespace-nowrap py-2 fade-mask">
        <div class="marq">
            <span class="px-8">FREE EXPRESS SHIPPING · ĐƠN TỪ 1.000.000đ</span>
            <span class="px-8">·</span
            ><span class="px-8">SS26 INDIGO CAPSULE — NOW LIVE</span>
            <span class="px-8">·</span><span class="px-8">MEMBERSHIP EARLY ACCESS</span>
            <span class="px-8">·</span
            ><span class="px-8">JAPANESE SELVEDGE · CRAFTED IN HOUSE</span>
            <span class="px-8">·</span>
            <span class="px-8">FREE EXPRESS SHIPPING · ĐƠN TỪ 1.000.000đ</span>
            <span class="px-8">·</span
            ><span class="px-8">SS26 INDIGO CAPSULE — NOW LIVE</span>
            <span class="px-8">·</span><span class="px-8">MEMBERSHIP EARLY ACCESS</span>
            <span class="px-8">·</span
            ><span class="px-8">JAPANESE SELVEDGE · CRAFTED IN HOUSE</span>
            <span class="px-8">·</span>
        </div>
    </div>
</div>

<!-- ====== TOP NAVBAR ====== -->
<header id="topbar" class="sticky top-0 z-[120] glass">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div class="flex items-center justify-between h-16 lg:h-[72px]">
            <!-- left -->
            <div class="flex items-center gap-3 lg:gap-8">
                <button
                    onclick="UI.toggleMobileMenu()"
                    class="lg:hidden p-2 -ml-2"
                    aria-label="menu"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <path d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                </button>
                <nav
                    class="hidden lg:flex items-center gap-7 text-[13px] font-medium"
                    id="megaNav"
                ></nav>
            </div>
            <!-- logo -->
            <a
                onclick="Router.go('home')"
                class="cursor-pointer absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
            >
                <span
                    class="title-exp font-bold text-[18px] lg:text-[20px] tracking-[.18em] leading-none"
                    >THE BLUES</span
                >
                <span class="kicker text-[8px] text-mute mt-[3px] tracking-[.4em]"
                    >DENIM · MENSWEAR</span
                >
            </a>
            <!-- right -->
            <div class="flex items-center gap-1 sm:gap-2">
                <button
                    onclick="UI.openSearch()"
                    class="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
                    aria-label="search"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                </button>
                <button
                    onclick="UI.toggleTheme()"
                    class="hidden lg:flex items-center justify-center p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
                    aria-label="theme"
                    id="themeBtn"
                >
                    <svg
                        id="iconMoon"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                    </svg>
                    <svg
                        id="iconSun"
                        class="hidden"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <circle cx="12" cy="12" r="4.2" />
                        <path
                            d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
                        />
                    </svg>
                </button>
                <button
                    onclick="Router.go('account')"
                    class="hidden lg:flex items-center justify-center p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition relative"
                    aria-label="account"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <circle cx="12" cy="8" r="3.6" />
                        <path d="M5 20a7 7 0 0 1 14 0" />
                    </svg>
                </button>
                <button
                    onclick="UI.openNotif()"
                    class="hidden lg:flex items-center justify-center p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition relative"
                    aria-label="notifications"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                    </svg>
                    <span class="ndot" id="notifDot" style="display: none"></span>
                </button>
                <button
                    onclick="Router.go('wishlist')"
                    class="hidden lg:flex items-center justify-center p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition relative"
                    aria-label="wishlist"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                    >
                        <path
                            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                        />
                    </svg>
                    <span class="ndot" id="wishDot" style="display: none"></span>
                </button>
                <button
                    onclick="UI.openCart()"
                    class="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition relative"
                    aria-label="cart"
                >
                    <!-- Thay đổi icon giỏ hàng cũ (giống hình thùng rác) sang icon Shopping Bag sang trọng -->
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <span class="ndot" id="cartDot" style="display: none"></span>
                </button>
            </div>
        </div>
    </div>
</header>

<!-- ====== APP ROOT ====== -->
<main id="app" class="min-h-screen"></main>

<!-- ====== FOOTER ====== -->
<footer id="footer"></footer>

<!-- ====== MOBILE BOTTOM NAV ====== -->
<nav
    class="mobnav glass lg:hidden fixed bottom-0 inset-x-0 z-[110] grid grid-cols-5 text-[10px] font-medium"
>
    <button
        onclick="Router.go('home')"
        data-mob="home"
        class="flex flex-col items-center gap-1 py-2.5 text-mute transition"
    >
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
            <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" /></svg
        >Home
    </button>
    <button
        onclick="Router.go('shop')"
        data-mob="shop"
        class="flex flex-col items-center gap-1 py-2.5 text-mute transition"
    >
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
            <path d="M3 9h18l-1.5 11h-15Z" />
            <path d="M8 9V6a4 4 0 0 1 8 0v3" /></svg
        >Shop
    </button>
    <button
        onclick="Router.go('loyalty')"
        data-mob="loyalty"
        class="flex flex-col items-center gap-1 py-2.5 text-mute transition"
    >
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
            <path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z" /></svg
        >Member
    </button>
    <button
        onclick="Router.go('wishlist')"
        data-mob="wishlist"
        class="flex flex-col items-center gap-1 py-2.5 text-mute transition relative"
    >
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
            <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            /></svg
        >Wishlist
    </button>
    <button
        onclick="Router.go('account')"
        data-mob="account"
        class="flex flex-col items-center gap-1 py-2.5 text-mute transition"
    >
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5 20a7 7 0 0 1 14 0" /></svg
        >Account
    </button>
</nav>
`;
