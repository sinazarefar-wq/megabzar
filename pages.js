// pages.js - ابزارهای مشترک صفحات محتوایی (about, contact, faq, guide, terms, blog)
// محتوا از Store می‌آید (مجموعه‌های pages, faq, posts) و در پنل مدیریت قابل ویرایش است.
// نیازمند: products.js, store.js, layout.js (به همین ترتیب قبل از این فایل بارگذاری شوند)

// ---------- استایل مشترک ----------
(function injectContentStyles() {
    const st = document.createElement('style');
    st.textContent = `
.cp-wrap { max-width: 1400px; margin: 0 auto; padding: 20px 30px 60px; }
.cp-crumb { font-size: 13px; color: var(--text-muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 14px; }
.cp-crumb a { color: var(--text-muted); text-decoration: none; }
.cp-crumb a:hover { color: var(--accent-color); }
.cp-crumb .cur { color: var(--text-color); font-weight: 700; }
.cp-head h1 { margin: 0 0 8px; font-size: 26px; font-weight: 900; display: flex; align-items: center; gap: 10px; }
.cp-head h1::before { content: ''; width: 5px; height: 26px; background: var(--accent-color); border-radius: 3px; }
.cp-head p { margin: 0 0 22px; color: var(--text-muted); line-height: 2; max-width: 820px; }
.cp-layout { display: grid; grid-template-columns: 250px 1fr; gap: 26px; align-items: start; }
.cp-layout.no-toc { grid-template-columns: 1fr; }
.cp-toc { position: sticky; top: 150px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 14px; }
.cp-toc b { display: block; margin: 2px 6px 10px; font-size: 13.5px; }
.cp-toc a { display: block; padding: 8px 10px; border-radius: 8px; color: var(--text-muted); text-decoration: none; font-size: 13.5px; font-weight: 600; }
.cp-toc a:hover, .cp-toc a.on { background: var(--accent-soft); color: var(--accent-color); }
.cp-main { min-width: 0; }
.cp-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; margin-bottom: 18px; scroll-margin-top: 150px; }
.cp-card h2 { margin: 0 0 14px; font-size: 19px; font-weight: 800; color: var(--text-color); }
.rt h2 { margin: 22px 0 8px; font-size: 17px; font-weight: 800; color: var(--accent-color); }
.rt h2:first-child { margin-top: 0; }
.rt p { margin: 0 0 12px; line-height: 2.1; font-size: 14.5px; color: var(--text-muted); }
.rt ul { margin: 0 0 14px; padding: 0 20px 0 0; display: flex; flex-direction: column; gap: 6px; }
.rt li { line-height: 2; font-size: 14.5px; color: var(--text-muted); }
.rt li::marker { color: var(--accent-color); }
.rt strong { color: var(--text-color); }
.rt a { color: var(--accent-color); font-weight: 700; text-decoration: none; }
.rt a:hover { text-decoration: underline; }
.cp-empty { text-align: center; color: var(--text-muted); padding: 40px 10px; }
.cp-btn { display: inline-block; background: var(--accent-color); color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-family: inherit; font-size: 14.5px; font-weight: 800; cursor: pointer; text-decoration: none; }
.cp-btn:hover { filter: brightness(1.08); }
.cp-btn:disabled { opacity: .6; cursor: not-allowed; }
.cp-btn.ghost { background: transparent; color: var(--text-color); border: 1px solid var(--border-color); }
.cp-btn.ghost:hover { border-color: var(--accent-color); color: var(--accent-color); filter: none; }
@media (max-width: 992px) {
    .cp-layout { grid-template-columns: 1fr; }
    .cp-toc { position: static; display: flex; gap: 6px; overflow-x: auto; padding: 8px; }
    .cp-toc b { display: none; }
    .cp-toc a { white-space: nowrap; }
    .cp-wrap { padding-left: 15px; padding-right: 15px; }
}
`;
    document.head.appendChild(st);
})();

// ---------- متن‌های قابل ویرایش ----------
// جایگزینی {{کلید}} در متن با مقدارهای فروشگاه (تلفن، آدرس، هزینه ارسال و ...)
function contentTokens() {
    const s = getSettings(), st = s.store, sh = s.shipping;
    const methods = (s.payment && s.payment.methods || []).filter(m => m.enabled).map(m => m.label);
    return {
        storeName: st.name,
        phone: st.phone,
        address: st.address,
        hours: st.workingHours,
        email: st.email || '',
        shipFee: !sh.enabled ? 'رایگان' : formatPrice(sh.fee),
        shipRule: !sh.enabled ? 'ارسال همه‌ی سفارش‌ها رایگان است.' : (sh.freeFromEnabled ? `ارسال سفارش‌های بالای ${formatPrice(sh.freeFrom)} رایگان است.` : ''),
        payments: methods.length ? methods.join('، ') : 'در حال حاضر هیچ روشی فعال نیست'
    };
}
function fillTokens(text) {
    const t = contentTokens();
    return String(text ?? '').replace(/\{\{(\w+)\}\}/g, (m, k) => (k in t ? t[k] : m));
}

// تبدیل متن ساده به HTML امن: خط خالی = پاراگراف، «## » = عنوان، «- » = لیست، **پررنگ**، [متن](لینک)
// هیچ HTML خامی پذیرفته نمی‌شود (همه چیز escape می‌شود)
function formatRichText(text) {
    const inline = raw => {
        let h = escapeHTML(raw);
        h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) =>
            /^(https?:\/\/|tel:|mailto:|[\w#?./=&;-]+$)/.test(href) && !/^javascript:/i.test(href)
                ? `<a href="${href}">${label}</a>` : m);
        return h;
    };
    return fillTokens(text).split(/\n\s*\n/).map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (!lines.length) return '';
        let out = '', list = [];
        const flush = () => { if (list.length) { out += '<ul>' + list.map(li => `<li>${inline(li)}</li>`).join('') + '</ul>'; list = []; } };
        const para = [];
        const flushPara = () => { if (para.length) { out += `<p>${para.map(inline).join('<br>')}</p>`; para.length = 0; } };
        lines.forEach(l => {
            if (l.startsWith('## ')) { flush(); flushPara(); out += `<h2>${inline(l.slice(3))}</h2>`; }
            else if (l.startsWith('- ')) { flushPara(); if (l.slice(2).trim()) list.push(l.slice(2).trim()); }
            else { flush(); para.push(l); }
        });
        flush(); flushPara();
        return out;
    }).join('');
}

function setPageMeta(title, description) {
    const name = getSettings().store.name;
    document.title = `${title} | ${name}`;
    if (description) {
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
        m.content = fillTokens(description);
    }
}

function crumbHTML(items) {
    return `<nav class="cp-crumb" aria-label="مسیر"><a href="index.html">${escapeHTML(getSettings().store.name)}</a>` +
        items.map((it, i) => `<span>❯</span>${i === items.length - 1 ? `<span class="cur">${escapeHTML(it.label)}</span>` : `<a href="${escapeHTML(it.href)}">${escapeHTML(it.label)}</a>`}`).join('') + '</nav>';
}

// صفحه محتوایی بر اساس کلید مجموعه pages (about, guide, terms, contact)
// opts: { before: HTML بعد از معرفی، after: HTML بعد از بخش‌ها }
function renderContentPage(key, opts = {}) {
    const root = document.getElementById('pageRoot');
    const page = (Store.get('pages') || {})[key];
    if (!page) { root.innerHTML = `<div class="cp-wrap"><div class="cp-empty">این صفحه پیدا نشد.</div></div>`; return; }
    setPageMeta(page.title, page.metaDescription || page.intro);
    const secs = (page.sections || []).filter(s => s.active !== false);
    const toc = secs.length > 2;
    root.innerHTML = `<div class="cp-wrap">
        ${crumbHTML([{ label: page.title }])}
        <div class="cp-head"><h1>${escapeHTML(fillTokens(page.title))}</h1>${page.intro ? `<p>${escapeHTML(fillTokens(page.intro))}</p>` : ''}</div>
        <div class="cp-layout${toc ? '' : ' no-toc'}">
            ${toc ? `<aside class="cp-toc"><b>فهرست مطالب</b>${secs.map(s => `<a href="#${escapeHTML(s.id)}">${escapeHTML(s.title)}</a>`).join('')}</aside>` : ''}
            <div class="cp-main">
                ${opts.before || ''}
                ${secs.map(s => `<section class="cp-card" id="${escapeHTML(s.id)}"><h2>${escapeHTML(fillTokens(s.title))}</h2><div class="rt">${formatRichText(s.body)}</div></section>`).join('')}
                ${opts.after || ''}
            </div>
        </div>
    </div>`;
    // هایلایت آیتم فعال فهرست هنگام اسکرول
    const links = [...root.querySelectorAll('.cp-toc a')];
    if (links.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
        }), { rootMargin: '-30% 0px -60% 0px' });
        root.querySelectorAll('.cp-card').forEach(c => io.observe(c));
    }
    // اگر با لینک #بخش آمده‌ایم، بعد از رندر به همان بخش برو
    if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t) setTimeout(() => t.scrollIntoView(), 50); }
}
