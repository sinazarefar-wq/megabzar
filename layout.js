// layout.js - ماژول مرکزی هدر دو ردیفه ثابت، مگامنو، تم سراسری هوشمند و فوتر مگا ابزار

// ۱. تابع مرکزی همگام‌سازی تم از حافظه (خواندن آخرین انتخاب کاربر در تمام صفحات)
function syncThemeFromStorage() {
    const savedTheme = localStorage.getItem('mega_abzar_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const desktopSelect = document.getElementById('themeSelector');
    const mobileSelect = document.getElementById('mobileThemeSelector');
    if (desktopSelect) desktopSelect.value = savedTheme;
    if (mobileSelect) mobileSelect.value = savedTheme;
}

// اجرای فوری قبل از رندر صفحه برای جلوگیری از چشمک زدن تم پیش‌فرض
syncThemeFromStorage();

// ۲. تابع تغییر تم (فقط زمانی اجرا می‌شود که خودِ کاربر منوی تم را تغییر دهد)
function applyTheme(themeVal) {
    if (!themeVal) return;
    localStorage.setItem('mega_abzar_theme', themeVal);
    syncThemeFromStorage();
}

// گوش دادن به رویدادهای تعویض صفحه، دکمه Back مرورگر و تب‌های دیگر برای حفظ ۱۰۰٪ آخرین تم
window.addEventListener('pageshow', syncThemeFromStorage);
window.addEventListener('focus', syncThemeFromStorage);
window.addEventListener('storage', syncThemeFromStorage);
document.addEventListener('DOMContentLoaded', syncThemeFromStorage);


// ۳. استایل‌های مشترک کل سایت (هدر دو ردیفه ثابت، فاصله استاندارد زیر هدر، مگامنو و فوتر)
const sharedStyles = `
:root, [data-theme="dark"] {
    --bg-color: #121212;
    --secondary-bg: #1a1a1a;
    --card-bg: #222222;
    --accent-color: #e53935;
    --accent-soft: rgba(229, 57, 53, 0.15);
    --text-color: #ffffff;
    --text-muted: #b0b0b0;
    --border-color: #333333;
    --image-bg: #2a2a2a;
    --icon-filter: invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%);
    --icon-active-filter: invert(30%) sepia(85%) saturate(3000%) hue-rotate(345deg) brightness(95%) contrast(95%);
}
[data-theme="light"] {
    --bg-color: #f5f5f5;
    --secondary-bg: #ffffff;
    --card-bg: #ffffff;
    --accent-color: #d32f2f;
    --accent-soft: rgba(211, 47, 47, 0.1);
    --text-color: #212529;
    --text-muted: #6c757d;
    --border-color: #e0e0e0;
    --image-bg: #f8f9fa;
    --icon-filter: invert(35%) sepia(10%) saturate(300%) hue-rotate(175deg) brightness(90%) contrast(85%);
    --icon-active-filter: invert(24%) sepia(90%) saturate(3500%) hue-rotate(350deg) brightness(88%) contrast(95%);
}
[data-theme="navy"] {
    --bg-color: #0f172a;
    --secondary-bg: #1e293b;
    --card-bg: #27354f;
    --accent-color: #f59e0b;
    --accent-soft: rgba(245, 158, 11, 0.2);
    --text-color: #f8fafc;
    --text-muted: #94a3b8;
    --border-color: #334155;
    --image-bg: #1e293b;
    --icon-filter: invert(65%) sepia(15%) saturate(400%) hue-rotate(175deg) brightness(95%) contrast(90%);
    --icon-active-filter: invert(65%) sepia(85%) saturate(1500%) hue-rotate(355deg) brightness(100%) contrast(95%);
}

/* برچسب‌های کارت محصول که از داده محصول می‌آیند */
.badge-free-ship { position: absolute; top: 10px; left: 10px; background: #2e9e5b; color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; z-index: 2; pointer-events: none; }
.badge-out-of-stock { position: absolute; top: 40px; right: 10px; background: #555; color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; z-index: 2; pointer-events: none; }
.btn-add-cart:disabled { opacity: .5; cursor: not-allowed; }

* { box-sizing: border-box; }
:focus-visible { outline: 2px solid var(--accent-color); outline-offset: 2px; }

body {
    font-family: 'Vazirmatn', Tahoma, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 132px 0 0 0 !important;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* ایجاد فاصله تنفس مناسب برای نوار مسیر راهنما (Breadcrumb) در صفحات کاتالوگ و محصول */
.catalog-hero-header {
    padding-top: 22px !important;
}
.breadcrumb-container {
    margin-top: 22px !important;
    padding-top: 6px !important;
}

.page-transition {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: var(--bg-color); z-index: 9999;
    display: flex; justify-content: center; align-items: center;
    opacity: 1; visibility: visible;
    transition: opacity 0.35s ease, visibility 0.35s ease;
    animation: forceHideTransition 0.4s ease 0.5s forwards;
}
@keyframes forceHideTransition { to { opacity: 0; visibility: hidden; pointer-events: none; } }
.page-transition.loaded { opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; display: none !important; }
.page-transition.active { display: flex !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; animation: none !important; }
.transition-logo { width: 110px; animation: pulse 0.8s infinite alternate; }
@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.12); } }

/* هدر دو ردیفه هوشمند (کاملاً فیکس و ثابت در بالای صفحه) */
.header {
    background-color: var(--secondary-bg);
    border-bottom: 2px solid var(--accent-color);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1500;
    width: 100%;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    transition: background-color 0.3s ease;
}
.header.hide-nav-tier .header-nav-row {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    border-top: none;
    overflow: hidden;
}

/* ردیف اول هدر (همیشه ثابت) */
.header-main-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 30px;
    max-width: 1400px;
    margin: 0 auto;
    gap: 15px;
    background-color: var(--secondary-bg);
}
.logo-img { height: 52px; width: auto; object-fit: contain; transition: transform 0.3s; }
.logo-img:hover { transform: scale(1.05); }
.menu-toggle { display: none; font-size: 24px; cursor: pointer; color: var(--text-color); user-select: none; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; width: 42px; height: 42px; align-items: center; justify-content: center; }

/* ردیف دوم هدر (نوار منو و مگامنو که موقع اسکرول به پایین مخفی می‌شود) */
.header-nav-row {
    background-color: var(--bg-color);
    border-top: 1px solid var(--border-color);
    padding: 0 30px;
    max-height: 55px;
    overflow: visible;
    transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
    opacity: 1;
}
.nav-container {
    max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; position: relative;
}
.nav-menu { display: flex; gap: 24px; list-style: none; margin: 0; padding: 0; align-items: center; }
.nav-menu > li > a {
    color: var(--text-color); text-decoration: none; font-size: 14.5px; font-weight: 700;
    padding: 12px 0; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: color 0.3s; user-select: none;
}
.nav-menu > li > a:hover, .has-megamenu.open > a { color: var(--accent-color); }
.arrow { font-size: 10px; transition: transform 0.3s; }
.has-megamenu:hover > a .arrow, .has-megamenu.open > a .arrow { transform: rotate(180deg); }

/* مگامنوی دو پنلی ثابت */
.has-megamenu { position: static !important; }
.megamenu-panel {
    display: none; position: absolute; top: 100%; right: 0; left: 0;
    background-color: var(--secondary-bg); border: 1px solid var(--border-color);
    border-top: 3px solid var(--accent-color); border-radius: 0 0 18px 18px;
    box-shadow: 0 24px 55px rgba(0, 0, 0, 0.65); z-index: 1600; overflow: hidden;
}
.megamenu-panel::before { content: ''; position: absolute; top: -25px; right: 0; left: 0; height: 25px; background: transparent; }
@media (min-width: 993px) {
    .has-megamenu:hover .megamenu-panel, .has-megamenu.open .megamenu-panel { display: block; animation: megaFadeIn 0.2s ease forwards; }
}
@keyframes megaFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.megamenu-two-pane { display: grid; grid-template-columns: 270px 1fr; height: 410px; }
.megamenu-sidebar { background-color: var(--bg-color); border-left: 1px solid var(--border-color); padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.mega-tab-link { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; border-radius: 10px; text-decoration: none; color: var(--text-muted); font-size: 13.5px; font-weight: 700; transition: all 0.2s ease; }
.mega-tab-right { display: flex; align-items: center; gap: 10px; }
.mega-tab-icon { font-size: 16px; width: 22px; text-align: center; }
.mega-tab-arrow { font-size: 11px; opacity: 0; transform: translateX(4px); transition: all 0.2s ease; }
.mega-tab-link:hover, .mega-tab-link.active { background-color: var(--card-bg); color: var(--accent-color); }
.mega-tab-link:hover .mega-tab-arrow, .mega-tab-link.active .mega-tab-arrow { opacity: 1; transform: translateX(0); color: var(--accent-color); }

.megamenu-content-area { padding: 24px 28px; background-color: var(--secondary-bg); overflow-y: auto; display: flex; flex-direction: column; justify-content: space-between; }
.mega-pane { display: none; height: 100%; flex-direction: column; justify-content: space-between; }
.mega-pane.active { display: flex; animation: paneFade 0.18s ease; }
@keyframes paneFade { from { opacity: 0; } to { opacity: 1; } }
.mega-pane-top-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); }
.mega-pane-main-link { font-size: 16px; font-weight: 900; color: var(--text-color); text-decoration: none; display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
.mega-pane-main-link::before { content: ''; width: 4px; height: 18px; background-color: var(--accent-color); border-radius: 2px; }
.mega-pane-main-link:hover { color: var(--accent-color); }
.mega-pane-view-all { font-size: 12.5px; font-weight: 700; color: var(--accent-color); text-decoration: none; background-color: var(--accent-soft); padding: 6px 14px; border-radius: 20px; transition: opacity 0.2s; }
.mega-pane-view-all:hover { opacity: 0.85; }

.mega-pane-columns { display: grid; grid-template-columns: repeat(3, 1fr) 230px; gap: 22px; align-items: start; }
.mega-subcol { display: flex; flex-direction: column; gap: 10px; }
.mega-subcol-title { font-size: 13.5px; font-weight: 800; color: var(--text-color); text-decoration: none; display: flex; align-items: center; gap: 6px; padding-bottom: 6px; border-bottom: 1px dashed var(--border-color); transition: color 0.2s; }
.mega-subcol-title::before { content: '◂'; color: var(--accent-color); font-size: 11px; }
.mega-subcol-title:hover { color: var(--accent-color); }
.mega-subcol-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.mega-subcol-list li a { color: var(--text-muted); text-decoration: none; font-size: 12.5px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; transition: color 0.2s, transform 0.2s; }
.mega-subcol-list li a:hover { color: var(--accent-color); transform: translateX(-4px); }
.mega-item-badge { font-size: 10px; background-color: var(--accent-soft); color: var(--accent-color); padding: 1px 6px; border-radius: 6px; font-weight: 800; }
.mega-featured-card { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; text-decoration: none; color: var(--text-color); display: flex; flex-direction: column; transition: border-color 0.25s, transform 0.25s; }
.mega-featured-card:hover { border-color: var(--accent-color); transform: translateY(-3px); }
.mega-featured-card img { width: 100%; height: 125px; object-fit: cover; }
.mega-featured-info { padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.mega-featured-tag { font-size: 10.5px; color: var(--accent-color); font-weight: 800; }
.mega-featured-title { font-size: 12.5px; font-weight: 800; line-height: 1.5; }
.mega-featured-price { font-size: 13px; font-weight: 900; color: var(--text-color); margin-top: 4px; }
.megamenu-bottom-bar { background-color: var(--bg-color); padding: 12px 28px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.megamenu-promo-link { font-size: 12.5px; font-weight: 700; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.megamenu-promo-link:hover { color: var(--accent-color); }
.megamenu-all-btn { background-color: var(--accent-color); color: #fff; text-decoration: none; padding: 7px 18px; border-radius: 20px; font-size: 12.5px; font-weight: 800; }

/* جستجو و سبد خرید هدر */
.search-container { position: relative; flex-grow: 1; max-width: 420px; margin: 0 20px; }
.search-box-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
.search-bar { width: 100%; background-color: var(--bg-color); border: 1.5px solid var(--border-color); border-radius: 14px; padding: 11px 42px 11px 18px; color: var(--text-color); font-family: inherit; font-size: 14px; transition: all 0.3s; }
.search-bar:focus { border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.15); }
.search-icon-inline { position: absolute; right: 14px; width: 18px; height: 18px; filter: var(--icon-filter); pointer-events: none; z-index: 2; }
.custom-search-placeholder { position: absolute; right: 42px; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; align-items: center; gap: 5px; font-size: 13.5px; color: var(--text-muted); transition: opacity 0.2s ease, visibility 0.2s ease; white-space: nowrap; }
.custom-search-placeholder .brand-highlight { font-weight: 900; font-size: 15px; color: var(--accent-color); letter-spacing: -0.3px; }
.search-bar:focus + .custom-search-placeholder, .search-bar:not(:placeholder-shown) + .custom-search-placeholder { opacity: 0; visibility: hidden; }
.live-search-results { position: absolute; top: calc(100% + 8px); right: 0; width: 100%; background-color: var(--secondary-bg); border: 1px solid var(--border-color); border-top: 2px solid var(--accent-color); border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.45); z-index: 2000; max-height: 350px; overflow-y: auto; display: none; }
.live-search-results.active { display: block; }
.live-search-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--border-color); text-decoration: none; color: var(--text-color); transition: background-color 0.2s; }
.live-search-item:last-child { border-bottom: none; }
.live-search-item:hover { background-color: var(--card-bg); }
.live-search-img { width: 46px; height: 46px; border-radius: 8px; object-fit: cover; background: var(--image-bg); flex-shrink: 0; }
.live-search-info { flex-grow: 1; }
.live-search-title { font-size: 13px; font-weight: 700; margin: 0 0 4px 0; }
.live-search-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
.live-search-brand { color: var(--text-muted); font-weight: 600; }
.live-search-price { color: var(--accent-color); font-weight: 800; }
.live-search-empty { padding: 20px; text-align: center; font-size: 13px; color: var(--text-muted); }

.header-actions { display: flex; gap: 10px; align-items: center; }
.btn-action { background-color: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); padding: 9px 16px; border-radius: 12px; cursor: pointer; font-family: inherit; font-size: 13.5px; font-weight: 700; transition: all 0.25s; display: flex; align-items: center; gap: 6px; }
.btn-action:hover { border-color: var(--accent-color); }
select.btn-action { appearance: none; padding-left: 22px; cursor: pointer; }
.btn-cart-modern { background: linear-gradient(135deg, var(--accent-color), #b71c1c); color: #ffffff !important; border: none; padding: 9px 18px; border-radius: 12px; font-family: inherit; font-size: 13.5px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(229, 57, 53, 0.35); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.btn-cart-modern:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(229, 57, 53, 0.5); }
.btn-cart-modern img { width: 19px; height: 19px; filter: brightness(0) invert(1); }
.header-cart-badge { background-color: #ffffff; color: var(--accent-color); font-size: 11.5px; font-weight: 900; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; display: none; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }

/* فوتر ۴ ستونه کامل */
.footer { background-color: var(--secondary-bg); border-top: 1px solid var(--border-color); margin-top: 50px; padding-top: 30px; color: var(--text-color); }
.footer-container { max-width: 1440px; margin: 0 auto; padding: 0 30px; }
.footer-features { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding-bottom: 25px; border-bottom: 1px solid var(--border-color); margin-bottom: 30px; }
.feature-item { display: flex; align-items: center; gap: 10px; flex: 1 1 200px; justify-content: center; }
.feature-icon { width: 30px; height: 30px; filter: var(--icon-active-filter); }
.feature-text { font-size: 13.5px; font-weight: 700; }
.footer-main { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; margin-bottom: 40px; text-align: right; }
.footer-col { flex: 1 1 200px; }
.footer-logo { height: 55px; margin-bottom: 15px; object-fit: contain; }
.footer-contact { font-size: 14px; color: var(--text-muted); line-height: 2; margin-bottom: 20px; }
.footer-contact strong { color: var(--text-color); }
.footer-title { font-size: 16px; font-weight: 700; margin: 0 0 20px 0; color: var(--text-color); position: relative; padding-bottom: 10px; }
.footer-title::after { content: ''; position: absolute; right: 0; bottom: 0; width: 40px; height: 3px; background-color: var(--accent-color); border-radius: 2px; }
.footer-links { list-style: none; padding: 0; margin: 0; }
.footer-links li { margin-bottom: 12px; }
.footer-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.3s; }
.footer-links a:hover { color: var(--accent-color); }
.social-icons { display: flex; gap: 12px; margin-top: 15px; }
.social-btn { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 50%; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.social-btn img { width: 20px; height: 20px; filter: var(--icon-filter); transition: filter 0.3s, transform 0.3s; }
.social-btn:hover { transform: translateY(-4px) scale(1.05); }
.social-btn:hover img { filter: brightness(0) invert(1); transform: scale(1.1); }
.social-btn.instagram:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); border-color: #d6249f; box-shadow: 0 6px 18px rgba(214, 36, 159, 0.45); }
.social-btn.telegram:hover { background-color: #24A1DE; border-color: #24A1DE; box-shadow: 0 6px 18px rgba(36, 161, 222, 0.45); }
.social-btn.whatsapp:hover { background-color: #25D366; border-color: #25D366; box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45); }
.trust-symbols { display: flex; gap: 15px; }
.trust-symbol { width: 90px; height: 90px; background-color: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 8px; color: #121212; font-weight: 800; font-size: 12px; text-align: center; line-height: 1.5; }
.footer-bottom { background-color: var(--bg-color); padding: 18px 30px; text-align: center; font-size: 12.5px; color: var(--text-muted); border-top: 1px solid var(--border-color); }

/* سبد خرید کشویی و شیت موبایل */
.cart-overlay, .cat-sheet-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.72); z-index: 2000; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; }
.cart-overlay.active, .cat-sheet-overlay.active { opacity: 1; visibility: visible; }
.cart-drawer { position: fixed; top: 0; left: -420px; width: 390px; max-width: 90%; height: 100%; background-color: var(--secondary-bg); border-right: 1px solid var(--border-color); z-index: 2100; display: flex; flex-direction: column; transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: -5px 0 25px rgba(0,0,0,0.5); }
.cart-drawer.active { left: 0; }
.cart-header { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.cart-title { font-size: 18px; font-weight: 700; margin: 0; }
.cart-close { background: none; border: none; color: var(--text-color); font-size: 22px; cursor: pointer; }
.cart-body { padding: 20px; flex-grow: 1; overflow-y: auto; }
.empty-cart-text { text-align: center; color: var(--text-muted); margin-top: 50px; font-size: 14px; }
.cart-item { display: flex; gap: 12px; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); }
.cart-item-img { width: 64px; height: 64px; object-fit: cover; background-color: var(--image-bg); border-radius: 8px; flex-shrink: 0; }
.cart-item-details { flex-grow: 1; }
.cart-item-title { font-size: 13px; font-weight: 700; margin: 0 0 6px 0; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.cart-item-price { font-size: 14px; color: var(--accent-color); font-weight: 800; margin-bottom: 8px; }
.cart-qty-controls { display: flex; align-items: center; gap: 8px; }
.qty-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--border-color); background-color: var(--card-bg); color: var(--text-color); font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-number { font-size: 13px; font-weight: 700; min-width: 20px; text-align: center; }
.cart-item-remove { background: none; border: none; cursor: pointer; padding: 6px; opacity: 0.7; }
.cart-item-remove img { width: 18px; height: 18px; filter: var(--icon-filter); }
.cart-footer { padding: 20px; border-top: 1px solid var(--border-color); background-color: var(--bg-color); }
.cart-total { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 15px; font-weight: 700; }
.btn-checkout { width: 100%; background-color: var(--accent-color); color: #fff; border: none; padding: 12px; border-radius: 8px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; }

.cat-sheet-overlay { z-index: 2200; }
.cat-bottom-sheet { position: fixed; bottom: -100%; left: 0; width: 100%; max-height: 82vh; background-color: var(--secondary-bg); border-top: 2px solid var(--accent-color); border-radius: 22px 22px 0 0; z-index: 2300; display: flex; flex-direction: column; transition: bottom 0.38s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 -8px 30px rgba(0,0,0,0.6); }
.cat-bottom-sheet.active { bottom: 0; }
.cat-sheet-handle { width: 44px; height: 5px; background-color: var(--border-color); border-radius: 10px; margin: 10px auto 4px auto; }
.cat-sheet-header { padding: 12px 20px 15px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.cat-sheet-title { font-size: 16px; font-weight: 800; margin: 0; }
.cat-sheet-body { padding: 16px 20px 30px 20px; overflow-y: auto; }
.cat-sheet-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
.cat-sheet-card { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-color); font-size: 13px; font-weight: 700; }
.cat-sheet-card img { width: 38px; height: 38px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.cat-sheet-theme-box { display: flex; align-items: center; justify-content: space-between; background: var(--bg-color); padding: 12px 15px; border-radius: 12px; border: 1px solid var(--border-color); font-size: 13px; font-weight: 700; }

.mobile-bottom-nav { display: none; }
@media (max-width: 992px) {
    body { padding: 70px 0 68px 0 !important; }
    .catalog-hero-header { padding-top: 14px !important; }
    .breadcrumb-container { margin-top: 14px !important; }
    .header-main-row { padding: 10px 15px; gap: 8px; }
    .logo { display: none; }
    .menu-toggle { display: flex; order: 1; }
    .search-container { order: 2; flex-grow: 1; max-width: calc(100% - 52px); margin: 0; }
    .header-actions { display: none !important; }
    .header-nav-row { display: none !important; }
    .footer-features { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
    .feature-item { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; flex-direction: column; text-align: center; gap: 6px !important; }
    .feature-text { font-size: 11.5px; }
    .footer-main { flex-direction: column; gap: 25px; }
    .mobile-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; width: 100%; height: 64px; background-color: var(--secondary-bg); border-top: 1px solid var(--border-color); z-index: 1500; justify-content: space-around; align-items: center; box-shadow: 0 -4px 18px rgba(0,0,0,0.35); }
    .bottom-nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; color: var(--text-muted); font-size: 11px; font-weight: 600; position: relative; flex: 1; height: 100%; }
    .bottom-nav-icon-img { width: 23px; height: 23px; object-fit: contain; margin-bottom: 4px; filter: var(--icon-filter); }
    .bottom-nav-item.active, .bottom-nav-item:hover { color: var(--accent-color); }
    .bottom-nav-item.active .bottom-nav-icon-img, .bottom-nav-item:hover .bottom-nav-icon-img { filter: var(--icon-active-filter); }
    .mobile-cart-badge { position: absolute; top: 6px; right: calc(50% - 18px); background-color: var(--accent-color); color: #fff; font-size: 10px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 50%; display: none; align-items: center; justify-content: center; font-weight: 800; }
}
`;

const styleEl = document.createElement('style');
styleEl.innerHTML = sharedStyles;
document.head.insertBefore(styleEl, document.head.firstChild);

// ---------- ساخت هدر و فوتر از داده‌های Store (مدیریت از پنل) ----------
function buildMegaNav(label) {
    const cats = getCategories();
    const bottom = Store.get('megaBottom');
    const sidebar = cats.map((c, i) => `
        <a href="catalog.html?cat=${escapeHTML(c.id)}" class="mega-tab-link${i === 0 ? ' active' : ''}" data-target="pane-${escapeHTML(c.id)}" onmouseenter="activateMegaTab(this)">
            <span class="mega-tab-right"><span class="mega-tab-icon">${escapeHTML(c.icon)}</span><span>${escapeHTML(c.title)}</span></span>
            <span class="mega-tab-arrow">❮</span>
        </a>`).join('');
    const panes = cats.map((c, i) => {
        const m = c.menu || {};
        const f = m.featured;
        let fPrice = f ? f.priceText : '';
        if (f) {
            const pid = (f.link || '').match(/product\.html\?id=(\w+)/);
            const fp = pid && getProduct(pid[1]);
            if (fp) fPrice = formatPrice(fp.price);
        }
        return `
        <div class="mega-pane${i === 0 ? ' active' : ''}" id="pane-${escapeHTML(c.id)}">
            <div>
                <div class="mega-pane-top-header">
                    <a href="catalog.html?cat=${escapeHTML(c.id)}" class="mega-pane-main-link">${escapeHTML(m.mainLabel || c.title)}</a>
                    <a href="catalog.html?cat=${escapeHTML(c.id)}" class="mega-pane-view-all">${escapeHTML(m.viewAllLabel || 'مشاهده همه')} ❯</a>
                </div>
                <div class="mega-pane-columns">
                    ${(m.columns || []).map(col => `
                    <div class="mega-subcol">
                        <a href="${escapeHTML(col.link)}" class="mega-subcol-title">${escapeHTML(col.title)}</a>
                        <ul class="mega-subcol-list">
                            ${(col.items || []).map(it => `<li><a href="${escapeHTML(it.link)}"><span>${escapeHTML(it.label)}</span>${it.badge ? `<span class="mega-item-badge">${escapeHTML(it.badge)}</span>` : ''}</a></li>`).join('')}
                        </ul>
                    </div>`).join('')}
                    ${f ? `
                    <a href="${escapeHTML(f.link)}" class="mega-featured-card">
                        <img src="${escapeHTML(imageUrl(f.image, 400))}" alt="${escapeHTML(f.title)}">
                        <div class="mega-featured-info">
                            <span class="mega-featured-tag">${escapeHTML(f.tag)}</span>
                            <span class="mega-featured-title">${escapeHTML(f.title)}</span>
                            <span class="mega-featured-price">${escapeHTML(fPrice)}</span>
                        </div>
                    </a>` : ''}
                </div>
            </div>
        </div>`;
    }).join('');
    return `
    <li class="has-megamenu" id="desktopMegaMenu">
        <a href="catalog.html" class="megamenu-trigger" onclick="toggleMegaMenu(event)">
            <span>${escapeHTML(label)}</span>
            <span class="arrow">▼</span>
        </a>
        <div class="megamenu-panel">
            <div class="megamenu-two-pane">
                <div class="megamenu-sidebar">${sidebar}</div>
                <div class="megamenu-content-area">${panes}</div>
            </div>
            <div class="megamenu-bottom-bar">
                <a href="${escapeHTML(bottom.promoHref)}" class="megamenu-promo-link">${escapeHTML(bottom.promoText)}</a>
                <a href="${escapeHTML(bottom.allHref)}" class="megamenu-all-btn">${escapeHTML(bottom.allLabel)} ❯</a>
            </div>
        </div>
    </li>`;
}

function buildNav() {
    return '<ul class="nav-menu">' + Store.get('nav').map(item => {
        if (item.type === 'megamenu') return buildMegaNav(item.label);
        return `<li><a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a></li>`;
    }).join('') + '</ul>';
}

function buildCatSheet() {
    return getCategories().map(c => `
        <a href="catalog.html?cat=${escapeHTML(c.id)}" class="cat-sheet-card clickable-item">
            <img src="${escapeHTML(imageUrl(c.image, 200))}" alt="${escapeHTML(c.title)}">
            <span>${escapeHTML(c.sheetTitle || c.title)}</span>
        </a>`).join('');
}

function buildFooter() {
    const st = getSettings().store, f = Store.get('footer');
    return `
<footer class="footer">
    <div class="footer-container">
        <div class="footer-features">
            ${f.features.map(x => `
            <div class="feature-item">
                <img src="${escapeHTML(x.icon)}" alt="${escapeHTML(x.alt)}" class="feature-icon">
                <span class="feature-text">${escapeHTML(x.text)}</span>
            </div>`).join('')}
        </div>
        <div class="footer-main">
            <div class="footer-col" style="flex: 1 1 300px;">
                <img src="${escapeHTML(st.logo)}" alt="${escapeHTML(st.name)}" class="footer-logo" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
                <div class="footer-contact">
                    ${escapeHTML(st.workingHours)}<br>
                    شماره تماس: <strong>${escapeHTML(st.phone)}</strong><br>
                    آدرس فروشگاه مرکزی: <strong>${escapeHTML(st.address)}</strong>
                </div>
                <div class="social-icons">
                    ${f.social.filter(x => x.enabled !== false && x.url).map(x => `
                    <a href="${escapeHTML(x.url)}" target="_blank" rel="noopener" class="social-btn ${escapeHTML(x.id)}" title="${escapeHTML(x.title)}">
                        <img src="${escapeHTML(x.icon)}" alt="${escapeHTML(x.id)}">
                    </a>`).join('')}
                </div>
            </div>
            ${f.columns.map(col => `
            <div class="footer-col">
                <h4 class="footer-title">${escapeHTML(col.title)}</h4>
                <ul class="footer-links">
                    ${col.links.map(l => `<li><a href="${escapeHTML(l.href)}">${escapeHTML(l.label)}</a></li>`).join('')}
                </ul>
            </div>`).join('')}
            <div class="footer-col">
                <h4 class="footer-title">نمادهای اعتماد الکترونیکی</h4>
                <div class="trust-symbols">
                    ${f.trustSymbols.map(h => `<div class="trust-symbol">${h}</div>`).join('')}
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">${escapeHTML(f.copyright)}</div>
</footer>`;
}

const SITE = getSettings().store;

// کارت محصول مشترک (صفحه اصلی و محصولات مشابه) - همه‌چیز از داده محصول می‌آید
function productCardHTML(p) {
    const off = discountPercent(p);
    return `
    <div class="product-card clickable-item" data-id="${p.id}">
        ${off > 0 ? `<span class="badge-discount">${toPersianNum(off)}٪ تخفیف</span>` : ''}
        ${p.freeShipping ? `<span class="badge-free-ship">ارسال رایگان</span>` : ''}
        ${!p.inStock ? `<span class="badge-out-of-stock">ناموجود</span>` : ''}
        <div class="product-image-wrapper">
            <img src="${escapeHTML(productImage(p, 500))}" class="product-image" alt="${escapeHTML(p.title)}" loading="lazy">
        </div>
        <div class="product-info">
            <span class="product-brand">${escapeHTML(p.brand)}</span>
            <h3 class="product-name">${escapeHTML(p.title)}</h3>
            <div class="product-price">
                ${p.oldPrice > p.price ? `<span class="old-price">${toPersianNum(p.oldPrice.toLocaleString('en-US'))}</span>` : ''}
                <span class="new-price">${formatPrice(p.price)}</span>
            </div>
            <button class="btn-add-cart" ${p.inStock ? '' : 'disabled'}>${p.inStock ? 'افزودن به سبد خرید' : 'فعلاً ناموجود'}</button>
        </div>
    </div>`;
}

// ۴. قالب HTML هدر دو ردیفه هوشمند
const headerTemplate = `
<div class="page-transition" id="pageTransition">
    <img src="image.png" alt="مگا ابزار" class="transition-logo" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
</div>

<header class="header" id="siteHeaderEl">
    <div class="header-main-row">
        <a href="index.html" class="logo">
            <img src="${escapeHTML(SITE.logo)}" alt="${escapeHTML(SITE.name)}" class="logo-img" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
        </a>
        <div class="menu-toggle" onclick="toggleCatSheet()">☰</div>

        <div class="search-container" id="searchContainer">
            <div class="search-box-wrapper">
                <img src="https://img.icons8.com/ios-glyphs/60/ffffff/search--v1.png" alt="جستجو" class="search-icon-inline">
                <input type="text" id="searchInput" class="search-bar" placeholder=" " autocomplete="off">
                <div class="custom-search-placeholder">
                    <span>جستجو در</span>
                    <span class="brand-highlight">${escapeHTML(SITE.name)}</span>
                </div>
            </div>
            <div class="live-search-results" id="liveSearchResults"></div>
        </div>

        <div class="header-actions">
            <select id="themeSelector" class="btn-action" onchange="applyTheme(this.value)">
                <option value="dark">🌙 تاریک</option>
                <option value="light">☀️ روشن</option>
                <option value="navy">👷‍♂️ سرمه‌ای</option>
            </select>
            <button class="btn-action" onclick="window.location.href='profile.html'">ورود / ثبت‌نام</button>
            <button class="btn-cart-modern" onclick="toggleCart()">
                <img src="https://img.icons8.com/ios-filled/64/ffffff/shopping-cart.png" alt="سبد">
                <span>سبد خرید</span>
                <span class="header-cart-badge" id="cartCount">۰</span>
            </button>
        </div>
    </div>

    <div class="header-nav-row">
        <div class="nav-container">
            <nav class="nav-wrapper" id="navWrapper">
                ${buildNav()}
            </nav>
        </div>
    </div>
</header>
`;

// ۵. قالب HTML فوتر کامل
const footerTemplate = `
${buildFooter()}

<div class="cart-overlay" id="cartOverlay" onclick="toggleCart()"></div>
<div class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
        <h3 class="cart-title">سبد خرید شما</h3>
        <button class="cart-close" onclick="toggleCart()">✕</button>
    </div>
    <div class="cart-body" id="cartBody">
        <p class="empty-cart-text">سبد خرید شما در حال حاضر خالی است.</p>
    </div>
    <div class="cart-footer">
        <div class="cart-total">
            <span>مبلغ قابل پرداخت:</span>
            <span><span id="cartTotalPrice">۰</span> تومان</span>
        </div>
        <a href="cart.html" class="btn-action" style="justify-content:center; margin-bottom:8px; text-decoration:none;">مشاهده سبد خرید</a>
        <button class="btn-checkout" onclick="window.location.href='checkout.html'">تکمیل خرید و ثبت سفارش</button>
    </div>
</div>

<div class="cat-sheet-overlay" id="catSheetOverlay" onclick="toggleCatSheet()"></div>
<div class="cat-bottom-sheet" id="catBottomSheet">
    <div class="cat-sheet-handle"></div>
    <div class="cat-sheet-header">
        <h3 class="cat-sheet-title">دسته‌بندی ابزارآلات و تنظیمات</h3>
        <button class="cart-close" onclick="toggleCatSheet()">✕</button>
    </div>
    <div class="cat-sheet-body">
        <div class="cat-sheet-grid">${buildCatSheet()}</div>
        <div class="cat-sheet-theme-box">
            <span>پوسته نمایش سایت:</span>
            <select id="mobileThemeSelector" class="btn-action" style="width: auto; margin: 0;" onchange="applyTheme(this.value)">
                <option value="dark">🌙 تاریک</option>
                <option value="light">☀️ روشن</option>
                <option value="navy">👷‍♂️ سرمه‌ای</option>
            </select>
        </div>
    </div>
</div>

<nav class="mobile-bottom-nav">
    <a href="index.html" class="bottom-nav-item active">
        <img src="https://img.icons8.com/ios-filled/64/ffffff/home.png" alt="خانه" class="bottom-nav-icon-img">
        <span>خانه</span>
    </a>
    <a href="#" class="bottom-nav-item" onclick="toggleCatSheet(); return false;">
        <img src="https://img.icons8.com/ios-filled/64/ffffff/categorize.png" alt="دسته‌بندی" class="bottom-nav-icon-img">
        <span>دسته‌بندی</span>
    </a>
    <a href="#" class="bottom-nav-item" onclick="toggleCart(); return false;">
        <img src="https://img.icons8.com/ios-filled/64/ffffff/shopping-cart.png" alt="سبد خرید" class="bottom-nav-icon-img">
        <span>سبد خرید</span>
        <span class="mobile-cart-badge" id="cartCountMobileBottom">۰</span>
    </a>
    <a href="profile.html" class="bottom-nav-item">
        <img src="https://img.icons8.com/ios-filled/64/ffffff/user-male-circle.png" alt="حساب کاربری" class="bottom-nav-icon-img">
        <span>حساب</span>
    </a>
</nav>
`;

// ۶. تزریق در صفحات و همگام‌سازی فوری منوهای انتخاب تم
const headerTarget = document.getElementById('site-header');
if (headerTarget) headerTarget.innerHTML = headerTemplate;

const footerTarget = document.getElementById('site-footer');
if (footerTarget) footerTarget.innerHTML = footerTemplate;

// همگام‌سازی منوی کشویی تم بلافاصله بعد از ساخته شدن هدر
syncThemeFromStorage();

// ۷. اسکریپت‌های تعاملی مشترک
function hideTransition() {
    const pt = document.getElementById('pageTransition');
    if (pt) {
        pt.classList.remove('active');
        pt.classList.add('loaded');
    }
}
setTimeout(hideTransition, 180);
window.addEventListener('pageshow', hideTransition);

// اسکرول هوشمند هدر دو ردیفه
let lastScrollY = window.scrollY;
const headerEl = document.getElementById('siteHeaderEl');
window.addEventListener('scroll', () => {
    if (!headerEl) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY > 70 && currentScrollY > lastScrollY) {
        headerEl.classList.add('hide-nav-tier');
    } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
        headerEl.classList.remove('hide-nav-tier');
    }
    lastScrollY = currentScrollY;
}, { passive: true });

function toggleMegaMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('desktopMegaMenu').classList.toggle('open');
}

function activateMegaTab(tabElement) {
    const targetId = tabElement.getAttribute('data-target');
    document.querySelectorAll('.mega-tab-link').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.mega-pane').forEach(el => el.classList.remove('active'));
    tabElement.classList.add('active');
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
}

function toggleCatSheet() {
    document.getElementById('catBottomSheet').classList.toggle('active');
    document.getElementById('catSheetOverlay').classList.toggle('active');
}

const searchInput = document.getElementById('searchInput');
const liveSearchResults = document.getElementById('liveSearchResults');

if (searchInput && liveSearchResults) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (query.length < 2) {
            liveSearchResults.classList.remove('active');
            return;
        }
        const sourceDB = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
        const matched = sourceDB.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
        if (matched.length === 0) {
            liveSearchResults.innerHTML = `<div class="live-search-empty">ابزاری با عبارت «${escapeHTML(this.value)}» یافت نشد.</div>`;
        } else {
            liveSearchResults.innerHTML = matched.map(item => {
                const imgUrl = (typeof productImage === 'function') ? productImage(item, 200) : item.image;
                const priceStr = (typeof formatPrice === 'function') ? formatPrice(item.price) : `${toPersianNum(item.price.toLocaleString())} تومان`;
                return `
                <a href="product.html?id=${item.id}" class="live-search-item">
                    <img src="${imgUrl}" alt="${escapeHTML(item.title)}" class="live-search-img">
                    <div class="live-search-info">
                        <h4 class="live-search-title">${item.title}</h4>
                        <div class="live-search-meta">
                            <span class="live-search-brand">${item.brand}</span>
                            <span class="live-search-price">${priceStr}</span>
                        </div>
                    </div>
                </a>`;
            }).join('');
        }
        liveSearchResults.classList.add('active');
    });
}

document.addEventListener('click', e => {
    if (liveSearchResults && !e.target.closest('#searchContainer')) {
        liveSearchResults.classList.remove('active');
    }
    const mega = document.getElementById('desktopMegaMenu');
    if (mega && !e.target.closest('#desktopMegaMenu')) {
        mega.classList.remove('open');
    }
});
