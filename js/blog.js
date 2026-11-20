/* NAILCHEMY – responsywne filtrowanie kategorii bloga */
(function () {
    'use strict';
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-blog-category]'));
    var controls = Array.prototype.slice.call(document.querySelectorAll('[data-blog-filter]'));
    if (!cards.length || !controls.length) return;

    function applyCategory(category) {
        cards.forEach(function (card) {
            var match = category === 'all' || card.dataset.blogCategory === category;
            var column = card.closest('.col-md-6');
            if (column) column.hidden = !match;
        });
        controls.forEach(function (control) {
            var active = control.dataset.blogFilter === category;
            control.classList.toggle('active', active);
            if (control.hasAttribute('aria-pressed')) control.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    controls.forEach(function (control) {
        control.addEventListener('click', function () { applyCategory(control.dataset.blogFilter); });
    });
    applyCategory('all');
})();
