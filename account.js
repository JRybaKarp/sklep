/* NAILCHEMY – Pulpit, historia zamówień ze szczegółami, adresy i edycja konta (localStorage) */
(function () {
    'use strict';
    var ORDERS_KEY = 'nailchemyOrders';
    var ADDRESS_KEY = 'nailchemyAddress';
    var PROFILE_KEY = 'nailchemyProfile';

    var PRODUCT_CATALOG = {
        'eliksir-keratynowy': { name: 'Oliwka cherry (15 ml)', price: 21.25 },
        'lakier-rose-dust': { name: 'Lakier Rose Dust', price: 35.00 },
        'baza-mineralna': { name: 'Baza Mineralna Rose Gold (12 ml)', price: 59.00 },
        'peeling-enzymatyczny': { name: 'Peeling Enzymatyczny Dłoni (100 ml)', price: 15.00 },
        'pedzelek-fine-art': { name: 'Pędzelek Fine Art #00', price: 44.00 },
        'zestaw-startowy': { name: 'Zestaw Startowy Alchemik', price: 299.00 }
    };

    var DELIVERY_LABELS = {
        d1: { label: 'Kurier DPD', cost: 15 },
        d2: { label: 'Paczkomat InPost', cost: 12 },
        d3: { label: 'Odbiór osobisty w Warszawie', cost: 0 }
    };

    var PAYMENT_LABELS = {
        p1: 'BLIK',
        p2: 'Karta płatnicza',
        p3: 'Szybki przelew'
    };

    function read(key, fallback) {
        try { var value = JSON.parse(localStorage.getItem(key)); return value == null ? fallback : value; }
        catch (e) { return fallback; }
    }
    function money(value) { return Number(value || 0).toFixed(2).replace('.', ',') + ' PLN'; }
    function escapeHtml(value) { return String(value || '').replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }

    function ensureInitialOrders() {
        var orders = read(ORDERS_KEY, null);
        if (!Array.isArray(orders) || !orders.length) {
            orders = [{
                number: '#NAIL/2026/104829',
                date: '05.03.2026',
                items: [
                    { id: 'eliksir-keratynowy', name: 'Oliwka cherry (15 ml)', qty: 1, price: 21.25 },
                    { id: 'lakier-rose-dust', name: 'Lakier Rose Dust', qty: 1, price: 35.00 }
                ],
                subtotal: 140,
                deliveryMethod: 'Kurier DPD',
                shipping: 15,
                paymentMethod: 'BLIK',
                total: 155,
                status: 'Zrealizowane'
            }];
            try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (e) {}
        }
        return orders;
    }

    function switchTab(tab) {
        document.querySelectorAll('[data-account-tab]').forEach(function (item) {
            var active = item.dataset.accountTab === tab;
            item.classList.toggle('active', active);
            item.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        document.querySelectorAll('[data-account-panel]').forEach(function (panel) {
            panel.hidden = panel.dataset.accountPanel !== tab;
        });
    }

    function updateProfileUI(profile) {
        if (!profile) return;
        var fullName = profile.displayName || ((profile.firstName || 'Anna') + ' ' + (profile.lastName || 'Kowalska')).trim();
        var email = profile.email || 'anna@example.pl';
        var initials = ((profile.firstName || 'A')[0] + (profile.lastName || 'K')[0]).toUpperCase();

        var avatarEl = document.getElementById('accountAvatarInitials');
        var nameEl = document.getElementById('accountSidebarName');
        var emailEl = document.getElementById('accountSidebarEmail');
        var welcomeEl = document.getElementById('dashboardWelcomeName');

        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = fullName;
        if (emailEl) emailEl.textContent = email;
        if (welcomeEl) welcomeEl.textContent = fullName;

        var editForm = document.getElementById('accountEditForm');
        if (editForm) {
            if (editForm.elements.firstName) editForm.elements.firstName.value = profile.firstName || 'Anna';
            if (editForm.elements.lastName) editForm.elements.lastName.value = profile.lastName || 'Kowalska';
            if (editForm.elements.displayName) editForm.elements.displayName.value = fullName;
            if (editForm.elements.email) editForm.elements.email.value = email;
        }
    }

    function renderDashboardStats() {
        var orders = ensureInitialOrders();
        var cart = read('nailchemyCart', []);
        var address = read(ADDRESS_KEY, null);

        var ordersCountEl = document.getElementById('dashboardOrdersCount');
        var cartCountEl = document.getElementById('dashboardCartCount');
        var cityEl = document.getElementById('dashboardCity');

        if (ordersCountEl) ordersCountEl.textContent = Array.isArray(orders) ? orders.length : 0;
        if (cartCountEl) {
            var totalItems = Array.isArray(cart) ? cart.reduce(function (s, i) { return s + Number(i.qty || 0); }, 0) : 0;
            cartCountEl.textContent = totalItems;
        }
        if (cityEl && address && address.city) cityEl.textContent = address.city;
    }

    function showOrderDetails(order) {
        var card = document.getElementById('orderDetailsCard');
        if (!card || !order) return;

        var items = Array.isArray(order.items) && order.items.length ? order.items : [
            { name: 'Zamówienie z koszyka Nailchemy', qty: 1, price: Number(order.subtotal || order.total || 0) }
        ];
        var computedSubtotal = typeof order.subtotal === 'number'
            ? order.subtotal
            : items.reduce(function (sum, it) { return sum + Number(it.price || 0) * Number(it.qty || 1); }, 0);
        var shippingCost = typeof order.shipping === 'number'
            ? order.shipping
            : Math.max(0, Number(order.total || 0) - computedSubtotal);

        document.getElementById('orderDetailNumber').textContent = order.number || '-';
        document.getElementById('orderDetailStatus').textContent = order.status || 'Przyjęte';
        document.getElementById('orderDetailDate').textContent = order.date || '-';
        document.getElementById('orderDetailDelivery').textContent = (order.deliveryMethod || 'Kurier DPD') + ' (' + money(shippingCost) + ')';
        document.getElementById('orderDetailPayment').textContent = order.paymentMethod || 'BLIK';

        var invoiceBox = document.getElementById('orderDetailInvoiceBox');
        var invoiceText = document.getElementById('orderDetailInvoiceText');
        if (invoiceBox && invoiceText) {
            if (order.invoice && (order.invoice.companyName || order.invoice.nip)) {
                invoiceBox.hidden = false;
                invoiceText.textContent = [order.invoice.companyName, order.invoice.nip ? 'NIP: ' + order.invoice.nip : '', order.invoice.address].filter(Boolean).join(' | ');
            } else {
                invoiceBox.hidden = true;
            }
        }

        var itemsBody = document.getElementById('orderDetailItemsBody');
        itemsBody.innerHTML = items.map(function (it) {
            var lineTotal = Number(it.price || 0) * Number(it.qty || 1);
            return '<tr><td>' + escapeHtml(it.name) + '</td><td class="text-center">' + Number(it.qty || 1) + ' szt.</td><td class="text-end">' + money(it.price) + '</td><td class="text-end fw-bold text-accent">' + money(lineTotal) + '</td></tr>';
        }).join('');

        document.getElementById('orderDetailSubtotal').textContent = money(computedSubtotal);
        document.getElementById('orderDetailShipping').textContent = money(shippingCost);
        document.getElementById('orderDetailTotal').textContent = money(order.total || (computedSubtotal + shippingCost));

        card.hidden = false;
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderOrders() {
        var body = document.getElementById('accountOrdersBody');
        if (!body) return;
        var orders = ensureInitialOrders();
        if (!Array.isArray(orders) || !orders.length) {
            body.innerHTML = '<tr><td colspan="5" class="text-center text-white-50 py-4">Nie masz jeszcze żadnych zamówień.</td></tr>';
            return;
        }
        var reversed = orders.slice().reverse();
        body.innerHTML = reversed.map(function (order, idx) {
            return '<tr class="order-row-clickable" data-order-idx="' + idx + '" style="cursor: pointer;">' +
                '<td><strong>' + escapeHtml(order.number) + '</strong></td>' +
                '<td>' + escapeHtml(order.date) + '</td>' +
                '<td>' + money(order.total) + '</td>' +
                '<td><span class="account-order-status">' + escapeHtml(order.status || 'Przyjęte') + '</span></td>' +
                '<td class="text-end"><button type="button" class="btn btn-outline-light btn-sm rounded-pill px-3" data-view-order="' + idx + '"><i class="fa-regular fa-eye me-1"></i> Szczegóły</button></td>' +
            '</tr>';
        }).join('');

        body.querySelectorAll('[data-order-idx]').forEach(function (row) {
            row.addEventListener('click', function () {
                var idx = parseInt(row.getAttribute('data-order-idx'), 10);
                if (!isNaN(idx) && reversed[idx]) showOrderDetails(reversed[idx]);
            });
        });
    }

    var closeDetailsBtn = document.getElementById('closeOrderDetailsBtn');
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', function () {
            var card = document.getElementById('orderDetailsCard');
            if (card) card.hidden = true;
        });
    }

    function fillAddress(address) {
        var form = document.getElementById('accountAddressForm');
        if (!form || !address) return;
        Object.keys(address).forEach(function (key) { var field = form.elements[key]; if (field) field.value = address[key]; });
    }

    var savedProfile = read(PROFILE_KEY, null);
    if (savedProfile) updateProfileUI(savedProfile);

    var address = read(ADDRESS_KEY, null);
    if (address) fillAddress(address);

    document.querySelectorAll('[data-account-tab]').forEach(function (button) {
        button.addEventListener('click', function () {
            switchTab(button.dataset.accountTab);
            renderDashboardStats();
        });
    });

    document.querySelectorAll('[data-switch-tab]').forEach(function (button) {
        button.addEventListener('click', function () {
            switchTab(button.dataset.switchTab);
        });
    });

    var addressForm = document.getElementById('accountAddressForm');
    if (addressForm) addressForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var saved = {};
        Array.prototype.forEach.call(addressForm.elements, function (field) { if (field.name) saved[field.name] = field.value.trim(); });
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(saved));
        renderDashboardStats();
        var message = document.getElementById('addressSaveMessage');
        if (message) message.textContent = 'Adres został zapisany.';
    });

    var editForm = document.getElementById('accountEditForm');
    if (editForm) editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var message = document.getElementById('accountEditMessage');
        var newPass = editForm.elements.newPassword.value;
        var confirmPass = editForm.elements.confirmPassword.value;

        if (newPass || confirmPass) {
            if (newPass.length < 8) {
                if (message) message.textContent = 'Nowe hasło musi mieć co najmniej 8 znaków.';
                return;
            }
            if (newPass !== confirmPass) {
                if (message) message.textContent = 'Podane hasła nie są identyczne.';
                return;
            }
        }

        var profileData = {
            firstName: editForm.elements.firstName.value.trim(),
            lastName: editForm.elements.lastName.value.trim(),
            displayName: editForm.elements.displayName.value.trim(),
            email: editForm.elements.email.value.trim()
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
        updateProfileUI(profileData);

        editForm.elements.currentPassword.value = '';
        editForm.elements.newPassword.value = '';
        editForm.elements.confirmPassword.value = '';

        if (message) message.textContent = 'Dane konta zostały zaktualizowane.';
        if (window.showNotification) window.showNotification('Zmiany na koncie zostały zapisane!');
    });

    var logoutBtn = document.getElementById('accountLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', function () {
        if (window.goWithNotification) {
            window.goWithNotification('index.html', 'Zostałeś pomyślnie wylogowany z konta Nailchemy.');
        } else {
            location.href = 'index.html';
        }
    });

    var checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var fields = checkoutForm.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
        var values = Array.prototype.map.call(fields, function (field) { return field.value.trim(); });
        var addressData = { firstName: values[0], lastName: values[1], street: values[2], postal: values[3], city: values[4], phone: values[5], email: values[6] };
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(addressData));

        var cart = read('nailchemyCart', []);
        var detailedItems = cart.map(function (item) {
            var prod = PRODUCT_CATALOG[item.id] || { name: item.id, price: 0 };
            return {
                id: item.id,
                name: prod.name,
                qty: Number(item.qty || 1),
                price: prod.price
            };
        });
        var subtotal = detailedItems.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);

        var delivery = checkoutForm.querySelector('input[name="d"]:checked');
        var deliveryInfo = delivery ? (DELIVERY_LABELS[delivery.id] || { label: 'Kurier DPD', cost: 15 }) : { label: 'Kurier DPD', cost: 15 };
        var payment = checkoutForm.querySelector('input[name="p"]:checked');
        var paymentLabel = payment ? (PAYMENT_LABELS[payment.id] || 'BLIK') : 'BLIK';

        var wantInvoice = document.getElementById('wantInvoiceCheckbox');
        var invoiceData = null;
        if (wantInvoice && wantInvoice.checked) {
            invoiceData = {
                companyName: (document.getElementById('invoiceCompanyName') || {}).value || '',
                nip: (document.getElementById('invoiceNip') || {}).value || '',
                address: (document.getElementById('invoiceAddress') || {}).value || ''
            };
        }

        var orders = ensureInitialOrders();
        orders.push({
            number: '#NAIL/' + new Date().getFullYear() + '/' + String(Date.now()).slice(-6),
            date: new Date().toLocaleDateString('pl-PL'),
            items: detailedItems,
            subtotal: subtotal,
            deliveryMethod: deliveryInfo.label,
            shipping: deliveryInfo.cost,
            paymentMethod: paymentLabel,
            invoice: invoiceData,
            total: subtotal + deliveryInfo.cost,
            status: 'Przyjęte'
        });
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        localStorage.setItem('nailchemyCart', JSON.stringify([]));
        try { sessionStorage.setItem('nailchemyFlash', 'Zamówienie zostało opłacone i złożone pomyślnie!'); } catch (e) {}
        location.href = 'konto.html';
    });

    renderOrders();
    renderDashboardStats();
})();
