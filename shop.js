/* NAILCHEMY – filtrowanie i sortowanie katalogu sklepu */
(function () {
    'use strict';
    var grid = document.querySelector('.col-lg-9 .row.g-4');
    if (!grid || !document.querySelector('[data-page="shop"]')) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.shop-product'));
    var countLabel = document.getElementById('shopResultCount');
    var sortSelect = document.getElementById('shopSort');
    var categoryInputs = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));
    var colorInputs = Array.prototype.slice.call(document.querySelectorAll('[data-color]'));
    var featureInputs = Array.prototype.slice.call(document.querySelectorAll('[data-feature]'));
    var minInput = document.getElementById('priceMin');
    var maxInput = document.getElementById('priceMax');
    var pricePreview = document.getElementById('priceRangePreview');
    var activeFilters = null;

    function updatePricePreview() {
        if (!pricePreview) return;
        var minVal = minInput && minInput.value !== '' ? Math.max(0, Number(minInput.value)) : 0;
        var maxVal = maxInput && maxInput.value !== '' ? Math.max(0, Number(maxInput.value)) : 350;
        pricePreview.textContent = minVal + ' – ' + maxVal + ' PLN';
    }

    function collectFilters() {
        var minVal = minInput.value === '' ? 0 : Math.max(0, Number(minInput.value));
        var maxVal = maxInput.value === '' ? Infinity : Math.max(0, Number(maxInput.value));
        return {
            categories: categoryInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.dataset.category; }),
            colors: colorInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.dataset.color; }),
            vegan: document.getElementById('f1').checked,
            fresh: document.getElementById('f2').checked,
            min: minVal,
            max: maxVal
        };
    }

    function render() {
        var filters = activeFilters || collectFilters();
        var visible = cards.filter(function (card) {
            var categoryMatch = !filters.categories.length || filters.categories.indexOf(card.dataset.category) !== -1;
            var colorMatch = !filters.colors.length || filters.colors.indexOf(card.dataset.color) !== -1;
            var veganMatch = !filters.vegan || card.dataset.vegan === 'true';
            var newMatch = !filters.fresh || card.dataset.new === 'true';
            var price = Number(card.dataset.price);
            return categoryMatch && colorMatch && veganMatch && newMatch && price >= filters.min && price <= filters.max;
        });
        var mode = sortSelect.value;
        visible.sort(function (a, b) {
            if (mode === 'name-asc') return (a.dataset.name || '').localeCompare(b.dataset.name || '', 'pl', { sensitivity: 'base' });
            if (mode === 'name-desc') return (b.dataset.name || '').localeCompare(a.dataset.name || '', 'pl', { sensitivity: 'base' });
            if (mode === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
            if (mode === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
            return Number(b.dataset.popularity) - Number(a.dataset.popularity);
        });
        cards.forEach(function (card) { card.parentElement.hidden = true; });
        visible.forEach(function (card) { card.parentElement.hidden = false; grid.appendChild(card.parentElement); });
        var empty = grid.querySelector('.shop-no-results');
        if (!visible.length) {
            if (!empty) { empty = document.createElement('div'); empty.className = 'shop-no-results'; empty.textContent = 'Nie znaleziono produktów spełniających wybrane kryteria.'; empty.setAttribute('role', 'status'); grid.appendChild(empty); }
        } else if (empty) empty.remove();
        if (countLabel) countLabel.innerHTML = 'Znaleziono <strong>' + visible.length + '</strong> ' + (visible.length === 1 ? 'produkt' : 'produktów') + ' w katalogu';
    }

    if (minInput) minInput.addEventListener('input', updatePricePreview);
    if (maxInput) maxInput.addEventListener('input', updatePricePreview);

    document.getElementById('applyShopFilters').addEventListener('click', function () {
        var filters = collectFilters();
        if (filters.max < filters.min) {
            if (window.showNotification) window.showNotification('Cena maksymalna nie może być niższa od minimalnej.');
            return;
        }
        updatePricePreview();
        activeFilters = filters;
        render();
    });

    document.getElementById('resetShopFilters').addEventListener('click', function () {
        categoryInputs.forEach(function (input) { input.checked = false; });
        colorInputs.forEach(function (input) { input.checked = false; });
        featureInputs.forEach(function (input) { input.checked = false; });
        minInput.value = 0;
        maxInput.value = 350;
        updatePricePreview();
        activeFilters = collectFilters();
        render();
    });

    try {
        var params = new URLSearchParams(window.location.search);
        var preCat = params.get('category');
        if (preCat) {
            categoryInputs.forEach(function (input) {
                if (input.dataset.category === preCat) input.checked = true;
            });
        }
    } catch (e) {}

    sortSelect.addEventListener('change', render);
    updatePricePreview();
    render();
})();
