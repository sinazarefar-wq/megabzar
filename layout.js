// layout.js - ماژول مرکزی هدر، مگامنوی دو پنلی، سبد خرید، جستجوی زنده و فوتر مگا ابزار

const toPersianNum = num => num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

// ۱. استایل‌های مشترک کل سایت (تزریق خودکار در <head>)
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
* { box-sizing: border-box; outline: none; }
body {
    font-family: 'Vazirmatn', Tahoma, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    transition: background-color 0.4s ease, color 0.4s ease;
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

/* هدر و مگامنوی دو پنلی */
.header { background-color: var(--secondary-bg); border-bottom: 2px solid var(--accent-color); position: sticky; top: 0; z-index: 1000; }
.header-container { display: flex; align-items: center; justify-content: space-between; padding: 10px 30px; max-width: 1400px; margin: 0 auto; flex-wrap: wrap; gap: 15px; position: relative; }
.logo-img { height: 60px; width: auto; object-fit: contain; transition: transform 0.3s; }
.logo-img:hover { transform: scale(1.05); }
.menu-toggle { display: none; font-size: 24px; cursor: pointer; color: var(--text-color); user-select: none; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; width: 42px; height: 42px; align-items: center; justify-content: center; }
.nav-wrapper { display: flex; align-items: center; flex-grow: 1; justify-content: space-between; margin-right: 25px; }
.nav-menu { display: flex; gap: 22px; list-style: none; margin: 0; padding: 0; align-items: center; }
.nav-menu > li > a { color: var(--text-color); text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 0; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: color 0.3s; user-select: none; }
.nav-menu > li > a:hover, .has-megamenu.open > a { color: var(--accent-color); }
.arrow { font-size: 11px; transition: transform 0.3s; }
.has-megamenu:hover > a .arrow, .has-megamenu.open > a .arrow { transform: rotate(180deg); }

.has-megamenu { position: static !important; }
.megamenu-panel { display: none; position: absolute; top: 100%; right: 30px; left: 30px; background-color: var(--secondary-bg); border: 1px solid var(--border-color); border-top: 3px solid var(--accent-color); border-radius: 0 0 18px 18px; box-shadow: 0 24px 55px rgba(0, 0, 0, 0.65); z-index: 1500; overflow: hidden; }
.megamenu-panel::before { content: ''; position: absolute; top: -20px; right: 0; left: 0; height: 20px; background: transparent; }
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

/* جستجو و اکشن‌های هدر */
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
    body { padding-bottom: 68px; }
    .header-container { padding: 10px 15px; gap: 8px; }
    .logo { display: none; }
    .menu-toggle { display: flex; order: 1; }
    .search-container { order: 2; flex-grow: 1; max-width: calc(100% - 52px); margin: 0; }
    .nav-wrapper { display: none !important; }
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

// تزریق فوری استایل‌ها در بالای صفحه
const styleEl = document.createElement('style');
styleEl.innerHTML = sharedStyles;
document.head.insertBefore(styleEl, document.head.firstChild);

// ۲. کدهای HTML هدر و فوتر
const headerTemplate = `
<div class="page-transition" id="pageTransition">
    <img src="image.png" alt="مگا ابزار" class="transition-logo" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
</div>

<header class="header">
    <div class="header-container">
        <a href="index.html" class="logo">
            <img src="image.png" alt="مگا ابزار" class="logo-img" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
        </a>
        <div class="menu-toggle" onclick="toggleCatSheet()">☰</div>

        <div class="search-container" id="searchContainer">
            <div class="search-box-wrapper">
                <img src="https://img.icons8.com/ios-glyphs/60/ffffff/search--v1.png" alt="جستجو" class="search-icon-inline">
                <input type="text" id="searchInput" class="search-bar" placeholder=" " autocomplete="off">
                <div class="custom-search-placeholder">
                    <span>جستجو در</span>
                    <span class="brand-highlight">مگا ابزار</span>
                </div>
            </div>
            <div class="live-search-results" id="liveSearchResults"></div>
        </div>

        <div class="nav-wrapper" id="navWrapper">
            <nav>
                <ul class="nav-menu">
                    <li><a href="index.html">صفحه اصلی</a></li>
                    <li class="has-megamenu" id="desktopMegaMenu">
                        <a href="catalog.html" class="megamenu-trigger" onclick="toggleMegaMenu(event)">
                            <span>دسته‌بندی محصولات</span>
                            <span class="arrow">▼</span>
                        </a>
                        <div class="megamenu-panel">
                            <div class="megamenu-two-pane">
                                <div class="megamenu-sidebar">
                                    <a href="catalog.html?cat=power-tools" class="mega-tab-link active" data-target="pane-power" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">⚡</span><span>ابزار برقی و شارژی</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=welding" class="mega-tab-link" data-target="pane-welding" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">🔥</span><span>اینورتر و جوشکاری</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=hand-tools" class="mega-tab-link" data-target="pane-hand" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">🔧</span><span>ابزار دستی و مکانیکی</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=measuring" class="mega-tab-link" data-target="pane-measuring" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">📏</span><span>تراز لیزری و ابزار دقیق</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=pneumatic" class="mega-tab-link" data-target="pane-pneumatic" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">💨</span><span>ابزار بادی و کمپرسور</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=gardening" class="mega-tab-link" data-target="pane-gardening" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">🌲</span><span>اره موتوری و باغبانی</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=safety" class="mega-tab-link" data-target="pane-safety" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">🦺</span><span>ایمنی و حفاظت فردی</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                    <a href="catalog.html?cat=accessories" class="mega-tab-link" data-target="pane-accessories" onmouseenter="activateMegaTab(this)">
                                        <span class="mega-tab-right"><span class="mega-tab-icon">⚙️</span><span>مته، صفحه برش و جانبی</span></span>
                                        <span class="mega-tab-arrow">❮</span>
                                    </a>
                                </div>

                                <div class="megamenu-content-area">
                                    <div class="mega-pane active" id="pane-power">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=power-tools" class="mega-pane-main-link">همه محصولات ابزار برقی و شارژی</a>
                                                <a href="catalog.html?cat=power-tools" class="mega-pane-view-all">مشاهده آرشیو کامل (۳۴۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=power-tools" class="mega-subcol-title">دریل و پیچ‌گوشتی</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=1"><span>دریل چکشی دیوالت DWD024</span><span class="mega-item-badge">پرفروش</span></a></li>
                                                        <li><a href="product.html?id=5"><span>دریل شارژی براشلس میلواکی</span></a></li>
                                                        <li><a href="catalog.html?cat=power-tools"><span>دریل گیربکسی دو سرعته</span></a></li>
                                                        <li><a href="catalog.html?cat=power-tools"><span>دریل ستونی کارگاهی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=power-tools" class="mega-subcol-title">فرز و پولیش صنعتی</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=2"><span>مینی‌فرز دسته بلند ماکیتا</span><span class="mega-item-badge">اصل</span></a></li>
                                                        <li><a href="product.html?id=7"><span>فرز آهنگری سنگین AEG</span></a></li>
                                                        <li><a href="catalog.html?cat=power-tools"><span>مینی‌فرز دیمردار</span></a></li>
                                                        <li><a href="catalog.html?cat=power-tools"><span>پولیش اوربیتال خودرو</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=power-tools" class="mega-subcol-title">تخریب و برش سنگین</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=6"><span>بتن‌کن ۴ شیار هیلتی TE 2</span></a></li>
                                                        <li><a href="product.html?id=104"><span>چکش تخریب ۱۶ کیلویی ماکیتا</span></a></li>
                                                        <li><a href="product.html?id=101"><span>بکس شارژی دیوالت DCF899</span><span class="mega-item-badge">۲۲٪-</span></a></li>
                                                        <li><a href="product.html?id=106"><span>اره پروفیل‌بر صنعتی AEG</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="product.html?id=101" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400&auto=format&fit=crop" alt="بکس شارژی">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">🔥 پیشنهاد ویژه بانه</span>
                                                        <span class="mega-featured-title">بکس شارژی براشلس دیوالت ۲۰ ولت</span>
                                                        <span class="mega-featured-price">۱۱,۳۱۰,۰۰۰ تومان</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-welding">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=welding" class="mega-pane-main-link">همه تجهیزات اینورتر و جوشکاری</a>
                                                <a href="catalog.html?cat=welding" class="mega-pane-view-all">مشاهده آرشیو کامل (۱۲۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=welding" class="mega-subcol-title">اینورتر جوشکاری IGBT</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=102"><span>اینورتر ۲۵۰ آمپر رونیکس</span><span class="mega-item-badge">۱۸٪-</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>اینورتر ۲۰۰ آمپر دو ولوم</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>اینورتر ۳۰۰ و ۴۰۰ آمپر صنعتی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=welding" class="mega-subcol-title">جوش تخصصی و برش</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=welding"><span>دستگاه جوش میگ‌مگ (CO2)</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>دستگاه جوش آرگون (TIG)</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>برش پلاسما هوایی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=welding" class="mega-subcol-title">لوازم و ایمنی جوش</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=welding"><span>ماسک جوشکاری اتوماتیک</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>انبر جوش و انبر اتصال مس</span></a></li>
                                                        <li><a href="catalog.html?cat=welding"><span>کابل جوش نسوز تمام مس</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="product.html?id=102" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop" alt="اینورتر">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">⚡ پرفروش‌ترین دستگاه جوش</span>
                                                        <span class="mega-featured-title">اینورتر ۲۵۰ آمپر صنعتی رونیکس</span>
                                                        <span class="mega-featured-price">۶,۳۹۰,۰۰۰ تومان</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-hand">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=hand-tools" class="mega-pane-main-link">همه ابزارهای دستی و مکانیکی</a>
                                                <a href="catalog.html?cat=hand-tools" class="mega-pane-view-all">مشاهده آرشیو کامل (۵۲۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=hand-tools" class="mega-subcol-title">ست بکس و آچارآلات</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=3"><span>مجموعه ۱۲۸ عددی رونیکس</span><span class="mega-item-badge">ارسال رایگان</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>ست آچار یکسر رینگ کروم</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>آچار جغجغه و بکس فشارقوی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=hand-tools" class="mega-subcol-title">جعبه ابزار و کیف</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=105"><span>پک کیف ضدضربه میلواکی M18</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>جعبه ابزار فلزی تاشو</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>کیف کمری و کوله‌پشتی ابزار</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=hand-tools" class="mega-subcol-title">انبر و پیچ‌گوشتی</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=hand-tools"><span>ست انبردست، سیم‌چین و دم‌باریک</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>انبرقفلی و آچار شلاقی</span></a></li>
                                                        <li><a href="catalog.html?cat=hand-tools"><span>ست پیچ‌گوشتی ضربه‌خور</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="product.html?id=3" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=400&auto=format&fit=crop" alt="جعبه ابزار">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">🔧 پک کامل مکانیکی</span>
                                                        <span class="mega-featured-title">مجموعه ۱۲۸ عددی ابزار دستی رونیکس</span>
                                                        <span class="mega-featured-price">۵,۲۰۰,۰۰۰ تومان</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-measuring">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=measuring" class="mega-pane-main-link">همه تجهیزات تراز لیزری و ابزار دقیق</a>
                                                <a href="catalog.html?cat=measuring" class="mega-pane-view-all">مشاهده آرشیو کامل (۹۵+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=measuring" class="mega-subcol-title">تراز و متر لیزری</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=4"><span>متر لیزری ۵۰ متری بوش GLM</span><span class="mega-item-badge">بلوتوث</span></a></li>
                                                        <li><a href="product.html?id=8"><span>تراز لیزری ۳۶۰ درجه کرون</span></a></li>
                                                        <li><a href="catalog.html?cat=measuring"><span>تراز لیزری ۴ بعدی نور سبز</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=measuring" class="mega-subcol-title">ابزار دقیق مکانیکی</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=measuring"><span>کولیس دیجیتال و ورنیه</span></a></li>
                                                        <li><a href="catalog.html?cat=measuring"><span>میکرومتر و ساعت اندیکاتور</span></a></li>
                                                        <li><a href="catalog.html?cat=measuring"><span>ترکمتر (آچار گشتاورسنج)</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=measuring" class="mega-subcol-title">تستر برق و دما</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=measuring"><span>مولتی‌متر و کلمپ‌متر دیجیتال</span></a></li>
                                                        <li><a href="catalog.html?cat=measuring"><span>تب‌سنج و دماسنج لیزری صنعتی</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="product.html?id=4" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=400&auto=format&fit=crop" alt="متر لیزری">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">📏 دقت میلی‌متری</span>
                                                        <span class="mega-featured-title">متر لیزری بوش مدل GLM 50 C</span>
                                                        <span class="mega-featured-price">۴,۱۰۰,۰۰۰ تومان</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-pneumatic">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=pneumatic" class="mega-pane-main-link">همه محصولات ابزار بادی و کمپرسور</a>
                                                <a href="catalog.html?cat=pneumatic" class="mega-pane-view-all">مشاهده آرشیو کامل (۱۵۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=pneumatic" class="mega-subcol-title">کارواش و کمپرسور</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="product.html?id=103"><span>کارواش دینامی ۱۴۰ بار بوش</span><span class="mega-item-badge">۲۵٪-</span></a></li>
                                                        <li><a href="catalog.html?cat=pneumatic"><span>کمپرسور باد ۵۰ لیتری سایلنت</span></a></li>
                                                        <li><a href="catalog.html?cat=pneumatic"><span>کمپرسور باد فندکی دو سیلندر</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=pneumatic" class="mega-subcol-title">ابزارهای پنوماتیک</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=pneumatic"><span>بکس بادی جغجغه‌ای و تفنگی</span></a></li>
                                                        <li><a href="catalog.html?cat=pneumatic"><span>میخکوب و منگنه‌کوب بادی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=pneumatic" class="mega-subcol-title">پاشش رنگ و باد</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=pneumatic"><span>پیستوله رنگ‌پاش کاسه رو</span></a></li>
                                                        <li><a href="catalog.html?cat=pneumatic"><span>شیلنگ فنری و بادپاش</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="product.html?id=103" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop" alt="کارواش">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">💨 موتور القایی</span>
                                                        <span class="mega-featured-title">کارواش صنعتی دینامی بوش ۱۴۰ بار</span>
                                                        <span class="mega-featured-price">۶,۹۰۰,۰۰۰ تومان</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-gardening">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=gardening" class="mega-pane-main-link">همه محصولات اره موتوری و باغبانی</a>
                                                <a href="catalog.html?cat=gardening" class="mega-pane-view-all">مشاهده آرشیو کامل (۱۱۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=gardening" class="mega-subcol-title">اره زنجیری و هرس</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=gardening"><span>اره موتوری بنزینی ساتی‌دار</span></a></li>
                                                        <li><a href="catalog.html?cat=gardening"><span>اره زنجیری شارژی دستی</span></a></li>
                                                        <li><a href="catalog.html?cat=gardening"><span>قیچی باغبانی شارژی و دستی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=gardening" class="mega-subcol-title">علف‌زن و چمن‌زن</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=gardening"><span>علف‌زن دوشی و پشتی بنزینی</span></a></li>
                                                        <li><a href="catalog.html?cat=gardening"><span>شمشادزن و حاشیه‌زن</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=gardening" class="mega-subcol-title">پمپ آب و سم‌پاش</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=gardening"><span>سم‌پاش شارژی دو موتوره</span></a></li>
                                                        <li><a href="catalog.html?cat=gardening"><span>پمپ آب خانگی و کفکش</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="catalog.html?cat=gardening" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop" alt="باغبانی">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">🌲 تجهیزات باغبانی</span>
                                                        <span class="mega-featured-title">انواع اره زنجیری و علف‌زن صنعتی</span>
                                                        <span class="mega-featured-price">مشاهده لیست قیمت ❯</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-safety">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=safety" class="mega-pane-main-link">همه تجهیزات ایمنی و حفاظت فردی</a>
                                                <a href="catalog.html?cat=safety" class="mega-pane-view-all">مشاهده آرشیو کامل (۸۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=safety" class="mega-subcol-title">کفش و لباس کار</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=safety"><span>کفش ایمنی سرپنجه فولادی</span></a></li>
                                                        <li><a href="catalog.html?cat=safety"><span>لباس کار مهندسی و کارگاهی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=safety" class="mega-subcol-title">محافظ سر و چشم</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=safety"><span>عینک ایمنی ضدبخار و برش</span></a></li>
                                                        <li><a href="catalog.html?cat=safety"><span>کلاه ایمنی و گوشی صداگیر</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=safety" class="mega-subcol-title">دستکش و کمربند</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=safety"><span>دستکش ضدبرش و نسوز</span></a></li>
                                                        <li><a href="catalog.html?cat=safety"><span>کمربند ایمنی کار در ارتفاع</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="catalog.html?cat=safety" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop" alt="ایمنی">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">🦺 ایمنی استاندارد</span>
                                                        <span class="mega-featured-title">تجهیزات کامل حفاظت فردی کارگاه</span>
                                                        <span class="mega-featured-price">مشاهده محصولات ❯</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mega-pane" id="pane-accessories">
                                        <div>
                                            <div class="mega-pane-top-header">
                                                <a href="catalog.html?cat=accessories" class="mega-pane-main-link">همه محصولات مته، صفحه برش و جانبی</a>
                                                <a href="catalog.html?cat=accessories" class="mega-pane-view-all">مشاهده آرشیو کامل (۶۰۰+ کالا) ❯</a>
                                            </div>
                                            <div class="mega-pane-columns">
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=accessories" class="mega-subcol-title">انواع مته تخصصی</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=accessories"><span>ست مته آهن کبالت و تیتانیوم</span></a></li>
                                                        <li><a href="catalog.html?cat=accessories"><span>مته الماسه و چهارشیار بتن</span></a></li>
                                                        <li><a href="catalog.html?cat=accessories"><span>مته برگی، گازور و گردبر</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=accessories" class="mega-subcol-title">صفحه برش و ساب</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=accessories"><span>صفحه برش آهن و استیل</span></a></li>
                                                        <li><a href="catalog.html?cat=accessories"><span>صفحه گرانیت‌بر و سرامیک‌بر</span></a></li>
                                                        <li><a href="catalog.html?cat=accessories"><span>صفحه فلاپ و سنباده دیسکی</span></a></li>
                                                    </ul>
                                                </div>
                                                <div class="mega-subcol">
                                                    <a href="catalog.html?cat=accessories" class="mega-subcol-title">باتری و شارژر ابزار</a>
                                                    <ul class="mega-subcol-list">
                                                        <li><a href="catalog.html?cat=accessories"><span>باتری لیتیوم ۲۰ ولت دیوالت/ماکیتا</span></a></li>
                                                        <li><a href="catalog.html?cat=accessories"><span>ست نوک پیچ‌گوشتی ضربه‌ای</span></a></li>
                                                    </ul>
                                                </div>
                                                <a href="catalog.html?cat=accessories" class="mega-featured-card">
                                                    <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=400&auto=format&fit=crop" alt="مته و جانبی">
                                                    <div class="mega-featured-info">
                                                        <span class="mega-featured-tag">⚙️ لوازم مصرفی</span>
                                                        <span class="mega-featured-title">انواع مته، صفحه برش و باتری یدک</span>
                                                        <span class="mega-featured-price">مشاهده محصولات ❯</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="megamenu-bottom-bar">
                                <a href="catalog.html?filter=special" class="megamenu-promo-link">
                                    🔥 مشاهده ابزارهای دارای تخفیف ویژه امروز با تضمین اصالت بانه
                                </a>
                                <a href="catalog.html" class="megamenu-all-btn">ورود به کاتالوگ جامع محصولات ❯</a>
                            </div>
                        </div>
                    </li>
                    <li><a href="catalog.html">کاتالوگ فروشگاه</a></li>
                    <li><a href="index.html#megaOfferSection">فروش ویژه (مگا آف)</a></li>
                    <li><a href="index.html#blogSection">مجله ابزارشناسی</a></li>
                </ul>
            </nav>

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
    </div>
</header>
`;

const footerTemplate = `
<footer class="footer">
    <div class="footer-container">
        <div class="footer-features">
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/64/ffffff/delivery.png" alt="ارسال سریع" class="feature-icon">
                <span class="feature-text">ارسال سریع به سراسر کشور (تیپاکس و باربری)</span>
            </div>
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/64/ffffff/guarantee.png" alt="تضمین اصالت" class="feature-icon">
                <span class="feature-text">تضمین ۱۰۰٪ اصالت فیزیکی کالا</span>
            </div>
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/64/ffffff/return-purchase.png" alt="ضمانت بازگشت" class="feature-icon">
                <span class="feature-text">۷ روز مهلت تست و بازگشت کالا</span>
            </div>
            <div class="feature-item">
                <img src="https://img.icons8.com/ios-filled/64/ffffff/headset.png" alt="پشتیبانی" class="feature-icon">
                <span class="feature-text">مشاوره تخصصی پیش از خرید</span>
            </div>
        </div>

        <div class="footer-main">
            <div class="footer-col" style="flex: 1 1 300px;">
                <img src="image.png" alt="مگا ابزار" class="footer-logo" onerror="this.onerror=null; this.src='https://img.icons8.com/ios-filled/100/e53935/maintenance.png';">
                <div class="footer-contact">
                    پاسخگویی از ساعت ۸ صبح تا ۸ شب<br>
                    شماره تماس: <strong>۰۸۷-۱۲۳۴۵۶۷۸</strong><br>
                    آدرس فروشگاه مرکزی: <strong>بانه، میدان جهاد، مجتمع تجاری مگا ابزار، پلاک ۱۲</strong>
                </div>
                <div class="social-icons">
                    <a href="https://instagram.com" target="_blank" class="social-btn instagram" title="اینستاگرام مگا ابزار">
                        <img src="https://img.icons8.com/ios-glyphs/60/ffffff/instagram-new.png" alt="Instagram">
                    </a>
                    <a href="https://t.me" target="_blank" class="social-btn telegram" title="کانال تلگرام مگا ابزار">
                        <img src="https://img.icons8.com/ios-glyphs/60/ffffff/telegram-app.png" alt="Telegram">
                    </a>
                    <a href="https://wa.me/988712345678" target="_blank" class="social-btn whatsapp" title="مشاوره واتس‌اپ">
                        <img src="https://img.icons8.com/ios-glyphs/60/ffffff/whatsapp.png" alt="WhatsApp">
                    </a>
                </div>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">دسترسی سریع</h4>
                <ul class="footer-links">
                    <li><a href="about.html">درباره مگا ابزار</a></li>
                    <li><a href="contact.html">تماس با ما</a></li>
                    <li><a href="faq.html">سوالات متداول</a></li>
                    <li><a href="contact.html#complaints">ثبت شکایات و پیشنهادات</a></li>
                    <li><a href="blog.html">وبلاگ آموزشی ابزارشناسی</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">راهنمای خرید و ارسال</h4>
                <ul class="footer-links">
                    <li><a href="guide.html#order">نحوه ثبت سفارش آنلاین</a></li>
                    <li><a href="guide.html#shipping">رویه ارسال کالاهای سنگین (باربری)</a></li>
                    <li><a href="guide.html#payment">شیوه‌های پرداخت و درگاه شاپرک</a></li>
                    <li><a href="terms.html#return">شرایط بازگشت کالا و گارانتی</a></li>
                    <li><a href="terms.html">قوانین و حریم خصوصی</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">نمادهای اعتماد الکترونیکی</h4>
                <div class="trust-symbols">
                    <div class="trust-symbol">نماد اعتماد<br>(e-Namad)</div>
                    <div class="trust-symbol">نشان ملی<br>(ساماندهی)</div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        کلیه حقوق مادی و معنوی این سایت متعلق به فروشگاه آنلاین «مگا ابزار» می‌باشد. توسعه اختصاصی بدون فریم‌ورک.
    </div>
</footer>

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
        <div class="cat-sheet-grid">
            <a href="catalog.html?cat=power-tools" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200&auto=format&fit=crop" alt="ابزار برقی">
                <span>ابزار برقی و شارژی</span>
            </a>
            <a href="catalog.html?cat=hand-tools" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=200&auto=format&fit=crop" alt="ابزار دستی">
                <span>ابزار دستی و مکانیکی</span>
            </a>
            <a href="catalog.html?cat=welding" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=200&auto=format&fit=crop" alt="جوشکاری">
                <span>اینورتر و جوشکاری</span>
            </a>
            <a href="catalog.html?cat=measuring" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=200&auto=format&fit=crop" alt="ابزار دقیق">
                <span>تراز لیزری و دقیق</span>
            </a>
            <a href="catalog.html?cat=pneumatic" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=200&auto=format&fit=crop" alt="ابزار بادی">
                <span>ابزار بادی و کمپرسور</span>
            </a>
            <a href="catalog.html?cat=gardening" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=200&auto=format&fit=crop" alt="باغبانی">
                <span>اره موتوری و باغبانی</span>
            </a>
            <a href="catalog.html?cat=safety" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=200&auto=format&fit=crop" alt="ایمنی">
                <span>ایمنی و کارگاهی</span>
            </a>
            <a href="catalog.html?cat=accessories" class="cat-sheet-card clickable-item">
                <img src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=200&auto=format&fit=crop" alt="جانبی">
                <span>مته و صفحه برش</span>
            </a>
        </div>
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
    <a href="index.html" class="bottom-nav-item" id="navHomeMobile">
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

// ۳. رندر خودکار هدر و فوتر در محل‌های مشخص‌شده
const headerTarget = document.getElementById('site-header');
if (headerTarget) headerTarget.innerHTML = headerTemplate;

const footerTarget = document.getElementById('site-footer');
if (footerTarget) footerTarget.innerHTML = footerTemplate;

// ۴. منطق‌های مشترک (تم، مگامنو، جستجوی زنده، ترنزیشن و سبد خرید)
function hideTransition() {
    const pt = document.getElementById('pageTransition');
    if (pt) {
        pt.classList.remove('active');
        pt.classList.add('loaded');
    }
}
setTimeout(hideTransition, 180);
window.addEventListener('pageshow', hideTransition);

function applyTheme(themeVal) {
    document.documentElement.setAttribute('data-theme', themeVal);
    localStorage.setItem('mega_abzar_theme', themeVal);
    const desktopSelect = document.getElementById('themeSelector');
    const mobileSelect = document.getElementById('mobileThemeSelector');
    if (desktopSelect) desktopSelect.value = themeVal;
    if (mobileSelect) mobileSelect.value = themeVal;
}
const savedTheme = localStorage.getItem('mega_abzar_theme');
if (savedTheme) applyTheme(savedTheme);

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

// دیتابیس جستجوی زنده در تمام صفحات
const globalSearchDB = [
    { id: '1', title: 'دریل چکشی دیوالت مدل DWD024 توان ۶۵۰ وات', brand: 'DEWALT', price: '۳,۸۲۵,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&auto=format&fit=crop' },
    { id: '2', title: 'مینی فرز دسته بلند ماکیتا 9558HN اصل', brand: 'MAKITA', price: '۲,۹۵۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&auto=format&fit=crop' },
    { id: '3', title: 'مجموعه ۱۲۸ عددی ابزار دستی رونیکس RH-27128', brand: 'RONIX', price: '۵,۲۰۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=500&auto=format&fit=crop' },
    { id: '4', title: 'متر لیزری بوش مدل GLM 50 C بلوتوث‌دار', brand: 'BOSCH', price: '۴,۱۰۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=500&auto=format&fit=crop' },
    { id: '5', title: 'دریل پیچ‌گوشتی شارژی براشلس میلواکی ۱۸ ولت', brand: 'MILWAUKEE', price: '۸,۳۰۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=500&auto=format&fit=crop' },
    { id: '6', title: 'بتن‌کن ۴ شیار هیلتی مدل TE 2 اورجینال', brand: 'HILTI', price: '۱۱,۲۰۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&auto=format&fit=crop' },
    { id: '101', title: 'بکس شارژی براشلس دیوالت ۲۰ ولت مدل DCF899', brand: 'DEWALT', price: '۱۱,۳۱۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&auto=format&fit=crop' },
    { id: '102', title: 'اینورتر جوشکاری ۲۵۰ آمپر صنعتی رونیکس RH-4625', brand: 'RONIX', price: '۶,۳۹۰,۰۰۰ تومان', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500&auto=format&fit=crop' }
];

const searchInput = document.getElementById('searchInput');
const liveSearchResults = document.getElementById('liveSearchResults');

if (searchInput && liveSearchResults) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (query.length < 2) {
            liveSearchResults.classList.remove('active');
            return;
        }
        const matched = globalSearchDB.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
        if (matched.length === 0) {
            liveSearchResults.innerHTML = `<div class="live-search-empty">ابزاری با عبارت «${this.value}» یافت نشد.</div>`;
        } else {
            liveSearchResults.innerHTML = matched.map(item => `
                <a href="product.html?id=${item.id}" class="live-search-item">
                    <img src="${item.image}" alt="${item.title}" class="live-search-img">
                    <div class="live-search-info">
                        <h4 class="live-search-title">${item.title}</h4>
                        <div class="live-search-meta">
                            <span class="live-search-brand">${item.brand}</span>
                            <span class="live-search-price">${item.price}</span>
                        </div>
                    </div>
                </a>
            `).join('');
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

// مدیریت سبد خرید کشویی در کل سایت
let cart = JSON.parse(localStorage.getItem('mega_abzar_cart') || '[]');

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

function changeQuantity(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndUpdateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndUpdateCart();
}

function saveAndUpdateCart() {
    localStorage.setItem('mega_abzar_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartBody = document.getElementById('cartBody');
    const cartCount = document.getElementById('cartCount');
    const cartCountMobileBottom = document.getElementById('cartCountMobileBottom');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    if (!cartBody) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const persianTotal = toPersianNum(totalItems);

    if (cartCount) {
        cartCount.innerText = persianTotal;
        cartCount.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }
    if (cartCountMobileBottom) {
        cartCountMobileBottom.innerText = persianTotal;
        cartCountMobileBottom.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (cart.length === 0) {
        cartBody.innerHTML = `<p class="empty-cart-text">سبد خرید شما در حال حاضر خالی است.</p>`;
        cartTotalPrice.innerText = '۰';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">${toPersianNum((item.price * item.quantity).toLocaleString())} تومان</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <span class="qty-number">${toPersianNum(item.quantity)}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="حذف از سبد">
                    <img src="https://img.icons8.com/ios-glyphs/60/ffffff/trash--v1.png" alt="حذف">
                </button>
            </div>`;
    });
    cartBody.innerHTML = html;
    cartTotalPrice.innerText = toPersianNum(total.toLocaleString());
}

// اتصال خودکار دکمه‌های افزودن به سبد خرید و کلیک کارت‌ها در هر صفحه
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    document.querySelectorAll('.btn-add-cart').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.globalDragFlag) return;
            const card = button.closest('.product-card');
            const title = card.querySelector('.product-name').innerText;
            const priceText = card.querySelector('.new-price').innerText.replace(' تومان', '').replace(/,/g, '');
            const image = card.querySelector('.product-image').src;
            const englishPriceText = priceText.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            const price = parseInt(englishPriceText) || 0;

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ title, price, image, quantity: 1 });

            saveAndUpdateCart();
            toggleCart();
        });
    });

    document.querySelectorAll('.clickable-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.globalDragFlag) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.target.closest('.btn-add-cart')) return;
            e.preventDefault();
            const targetUrl = this.getAttribute('href') || `product.html?id=${this.dataset.id || 1}`;
            const transition = document.getElementById('pageTransition');
            if (transition) {
                transition.classList.remove('loaded');
                transition.classList.add('active');
            }
            setTimeout(() => { window.location.href = targetUrl; }, 380);
        });
    });
});
