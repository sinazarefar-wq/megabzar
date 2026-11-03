// cart.js - سبد خرید مشترک همه صفحات. آیتم‌ها فقط با id ذخیره می‌شوند.

const CART_KEY = 'mega_abzar_cart_v2';

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY) || 'null');
        if (Array.isArray(saved)) return saved.filter(i => getProduct(i.id));
        const old = JSON.parse(localStorage.getItem('mega_abzar_cart') || '[]');
        const migrated = [];
        old.forEach(o => {
            const p = PRODUCTS.find(x => x.title === o.title || x.pageTitle === o.title);
            if (p) migrated.push({ id: p.id, quantity: o.quantity || 1 });
        });
        return migrated;
    } catch (e) { return []; }
}

let cart = loadCart();

function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
}

window.addEventListener('storage', e => {
    if (e.key === CART_KEY) { cart = loadCart(); updateCartUI(); }
});

function addToCart(id, qty = 1) {
    const p = getProduct(id);
    if (!p || !p.inStock) return;
    const existing = cart.find(i => String(i.id) === String(p.id));
    if (existing) existing.quantity += qty;
    else cart.push({ id: p.id, quantity: qty });
    saveAndUpdateCart();
    openCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => String(i.id) === String(id));
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i !== item);
    saveAndUpdateCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => String(i.id) !== String(id));
    saveAndUpdateCart();
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + getProduct(i.id).price * i.quantity, 0);
}

function getCartCount() {
    return cart.reduce((sum, i) => sum + i.quantity, 0);
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

function openCart() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
}

function saveAndUpdateCart() {
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    if (typeof window.onCartUpdated === 'function') window.onCartUpdated();
    const cartBody = document.getElementById('cartBody');
    const cartCount = document.getElementById('cartCount');
    const cartCountMobileBottom = document.getElementById('cartCountMobileBottom');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    if (!cartBody) return;

    const totalItems = getCartCount();
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

    cartBody.innerHTML = cart.map(item => {
        const p = getProduct(item.id);
        return `
            <div class="cart-item">
                <img src="${productImage(p, 200)}" alt="${escapeHTML(p.title)}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${escapeHTML(p.title)}</h4>
                    <div class="cart-item-price">${formatPrice(p.price * item.quantity)}</div>
                    <div class="cart-qty-controls">
                        <button class="qty-btn" onclick="changeQuantity(${p.id}, 1)" aria-label="افزایش تعداد">+</button>
                        <span class="qty-number">${toPersianNum(item.quantity)}</span>
                        <button class="qty-btn" onclick="changeQuantity(${p.id}, -1)" aria-label="کاهش تعداد">−</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${p.id})" title="حذف از سبد" aria-label="حذف از سبد">
                    <img src="https://img.icons8.com/ios-glyphs/60/ffffff/trash--v1.png" alt="">
                </button>
            </div>`;
    }).join('');
    cartTotalPrice.innerText = toPersianNum(getCartTotal().toLocaleString('en-US'));
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // استفاده از Event Delegation سراسری برای پشتیبانی از المان‌های داینامیک (مثل محصولات مشابه در product.html)
    document.addEventListener('click', e => {
        const addBtn = e.target.closest('.product-card .btn-add-cart');
        if (addBtn) {
            e.stopPropagation();
            if (window.globalDragFlag) return;
            const card = addBtn.closest('.product-card');
            if (card && card.dataset.id) {
                addToCart(card.dataset.id);
            }
            return;
        }

        const clickableCard = e.target.closest('.clickable-item');
        if (clickableCard) {
            if (window.globalDragFlag) { e.preventDefault(); e.stopPropagation(); return; }
            if (e.target.closest('.btn-add-cart')) return;
            e.preventDefault();
            const targetUrl = clickableCard.getAttribute('href') || `product.html?id=${clickableCard.dataset.id || 1}`;
            const transition = document.getElementById('pageTransition');
            if (transition) { transition.classList.remove('loaded'); transition.classList.add('active'); }
            setTimeout(() => { window.location.href = targetUrl; }, 380);
        }
    });
});
