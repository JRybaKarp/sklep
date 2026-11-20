/* NAILCHEMY – wspólny, trwały koszyk (nakładka, koszyk i kasa) */
(function () {
    'use strict';
    var STORAGE_KEY = 'nailchemyCart';
    var SHIPPING = { d1: 15, d2: 12, d3: 0 };
    var products = [
        { id: 'eliksir-keratynowy', name: 'Oliwka cherry', detail: '15 ml', price: 21.25, image: 'img/21.jpeg' },
        { id: 'lakier-rose-dust', name: 'Lakier Rose Dust', detail: 'Klasyczny', price: 35.00, image: 'img/16.jpg' },
        { id: 'baza-mineralna', name: 'Baza Mineralna Rose Gold', detail: '12 ml', price: 59.00, image: 'img/17.jpg' },
        { id: 'peeling-enzymatyczny', name: 'Peeling Enzymatyczny Dłoni', detail: '100 ml', price: 15.00, image: 'img/18.jpg' },
        { id: 'pedzelek-fine-art', name: 'Pędzelek Fine Art #00', detail: '1 szt.', price: 44.00, image: 'img/19.jpg' },
        { id: 'zestaw-startowy', name: 'Zestaw Startowy Alchemik', detail: 'Zestaw', price: 299.00, image: 'img/20.jpg' }
    ];
    function readCart() {
        try {
            var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (Array.isArray(saved)) return saved.filter(function (item) { return products.some(function (p) { return p.id === item.id; }) && Number(item.qty) > 0; });
        } catch (e) {}
        var initial = [{ id: 'eliksir-keratynowy', qty: 1 }, { id: 'lakier-rose-dust', qty: 1 }];
        writeCart(initial);
        return initial;
    }
    function writeCart(cart) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {} }
    var cart = readCart();
    function productFor(id) { return products.find(function (p) { return p.id === id; }); }
    function count() { return cart.reduce(function (sum, item) { return sum + item.qty; }, 0); }
    function subtotal() { return cart.reduce(function (sum, item) { var p = productFor(item.id); return sum + (p ? p.price * item.qty : 0); }, 0); }
    function money(value) { return value.toFixed(2).replace('.', ',') + ' PLN'; }
    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }
    function change(id, delta) {
        var item = cart.find(function (entry) { return entry.id === id; });
        if (!item && delta > 0) cart.push({ id: id, qty: delta });
        else if (item) item.qty += delta;
        cart = cart.filter(function (entry) { return entry.qty > 0; });
        persistAndRender();
    }
    function setQty(id, value) {
        var qty = Math.max(1, Math.min(99, parseInt(value, 10) || 1));
        var item = cart.find(function (entry) { return entry.id === id; });
        if (item) item.qty = qty;
        persistAndRender();
    }
    function persistAndRender() { writeCart(cart); renderAll(); }
    function qtyControls(item, compact) {
        return '<div class="cart-quantity-control ' + (compact ? 'is-compact' : '') + '">' +
            '<button type="button" class="cart-qty-btn" data-cart-action="minus" data-id="' + item.id + '" aria-label="Zmniejsz ilość">−</button>' +
            '<input class="cart-quantity-input" type="number" min="1" max="99" value="' + item.qty + '" data-cart-qty="' + item.id + '" aria-label="Ilość ' + escapeHtml(productFor(item.id).name) + '">' +
            '<button type="button" class="cart-qty-btn" data-cart-action="plus" data-id="' + item.id + '" aria-label="Zwiększ ilość">+</button></div>';
    }
    function renderDrawer() {
        var list = document.getElementById('cartDrawerItemsList');
        if (!list) return;
        list.innerHTML = cart.length ? cart.map(function (item) {
            var p = productFor(item.id);
            return '<div class="cart-drawer-item"><img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" class="cart-drawer-img"><div class="cart-drawer-info"><div class="cart-drawer-name">' + escapeHtml(p.name) + '</div><div class="cart-drawer-price">' + money(p.price) + '</div>' + qtyControls(item, true) + '</div><button type="button" class="cart-remove-btn" data-cart-action="remove" data-id="' + item.id + '" aria-label="Usuń produkt"><i class="fa-solid fa-trash-can"></i></button></div>';
        }).join('') : '<p class="cart-empty-message">Twój koszyk jest pusty. Czas dodać coś alchemicznego!</p>';
        var sum = document.getElementById('cartSubtotal'); if (sum) sum.textContent = money(subtotal());
        var badge = document.getElementById('cartBadgeCount'); if (badge) badge.textContent = count();
    }
    function renderCartPage() {
        var body = document.getElementById('cartPageItems');
        if (!body) return;
        body.innerHTML = cart.length ? cart.map(function (item) {
            var p = productFor(item.id);
            return '<tr><td><div class="d-flex align-items-center gap-3"><img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" class="cart-table-img"><div><h6 class="text-accent mb-1">' + escapeHtml(p.name) + '</h6><small class="text-white-50">' + escapeHtml(p.detail) + '</small></div></div></td><td>' + money(p.price) + '</td><td>' + qtyControls(item, false) + '</td><td class="fw-bold text-accent">' + money(p.price * item.qty) + '</td><td class="text-end"><button type="button" class="btn btn-outline-danger btn-sm rounded-circle" data-cart-action="remove" data-id="' + item.id + '" aria-label="Usuń produkt"><i class="fa-solid fa-trash-can"></i></button></td></tr>';
        }).join('') : '<tr><td colspan="5" class="text-center py-5 text-white-50">Twój koszyk jest pusty.</td></tr>';
        var sub = document.getElementById('cartPageSubtotal'); if (sub) sub.textContent = money(subtotal());
        var total = document.getElementById('cartPageTotal'); if (total) total.textContent = money(subtotal() + 15);
        var checkout = document.getElementById('cartCheckoutButton'); if (checkout) checkout.disabled = cart.length === 0;
    }
    function renderCheckout() {
        var list = document.getElementById('checkoutItems');
        if (!list) return;
        list.innerHTML = cart.length ? cart.map(function (item) { var p = productFor(item.id); return '<li class="d-flex justify-content-between mb-2"><span>' + escapeHtml(p.name) + ' (' + item.qty + ' szt.)</span><strong class="text-white">' + money(p.price * item.qty) + '</strong></li>'; }).join('') : '<li class="text-white-50">Koszyk jest pusty.</li>';
        var delivery = document.querySelector('input[name="d"]:checked');
        var shipping = delivery ? (SHIPPING[delivery.id] || 0) : 15;
        var shipEl = document.getElementById('checkoutShipping'); if (shipEl) shipEl.textContent = money(shipping);
        var totalEl = document.getElementById('checkoutTotal'); if (totalEl) totalEl.textContent = money(subtotal() + shipping);
        var pay = document.getElementById('checkoutPayButton'); if (pay) pay.disabled = cart.length === 0;
    }
    function renderAll() { renderDrawer(); renderCartPage(); renderCheckout(); }
    document.addEventListener('click', function (event) {
        var button = event.target.closest('[data-cart-action]');
        if (button) {
            var id = button.getAttribute('data-id');
            if (button.dataset.cartAction === 'plus') change(id, 1);
            if (button.dataset.cartAction === 'minus') change(id, -1);
            if (button.dataset.cartAction === 'remove') { cart = cart.filter(function (item) { return item.id !== id; }); persistAndRender(); }
        }
        var prodQtyBtn = event.target.closest('[data-product-qty-btn]');
        if (prodQtyBtn) {
            var qtyInput = document.querySelector('[data-product-quantity]');
            if (qtyInput) {
                var current = parseInt(qtyInput.value, 10) || 1;
                var delta = prodQtyBtn.getAttribute('data-product-qty-btn') === 'plus' ? 1 : -1;
                qtyInput.value = Math.max(1, Math.min(99, current + delta));
            }
        }
        var add = event.target.closest('[data-add-to-cart]');
        if (add) {
            var idToAdd = add.getAttribute('data-add-to-cart');
            var amountInput = document.querySelector('[data-product-quantity]');
            var amount = Math.max(1, Math.min(99, parseInt(amountInput && amountInput.value, 10) || 1));
            if (productFor(idToAdd)) { change(idToAdd, amount); if (window.showNotification) window.showNotification('Produkt dodany do koszyka!'); }
        }
    });
    document.addEventListener('change', function (event) {
        if (event.target.matches('[data-cart-qty]')) setQty(event.target.getAttribute('data-cart-qty'), event.target.value);
        if (event.target.matches('input[name="d"]')) renderCheckout();
    });
    window.addEventListener('storage', function (event) { if (event.key === STORAGE_KEY) { cart = readCart(); renderAll(); } });
    function syncInvoiceFields() {
        var checkbox = document.getElementById('wantInvoiceCheckbox');
        var container = document.getElementById('invoiceFieldsContainer');
        if (!checkbox || !container) return;
        var checked = checkbox.checked;
        container.hidden = !checked;
        container.querySelectorAll('input').forEach(function (inp) {
            inp.required = checked;
        });
    }
    document.addEventListener('change', function (event) {
        if (event.target && event.target.id === 'wantInvoiceCheckbox') syncInvoiceFields();
    });
    syncInvoiceFields();

    window.NailchemyCart = { add: function (id, qty) { if (productFor(id)) change(id, qty || 1); }, getItems: function () { return cart.slice(); } };
    renderAll();
})();
