/**
 * NAILCHEMY – wspólne skrypty dla wszystkich podstron
 *  - modal powiadomień (zamiast alert())
 *  - showNotification(msg)
 *  - goWithNotification(url, msg): przejdź na inną stronę i pokaż tam powiadomienie
 */
(function () {
    var MODAL_HTML = `
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center p-4" style="background-color: var(--bg-card); border: 1px solid var(--primary-color); color: var(--text-color); border-radius: 20px;">
                <div class="modal-body">
                    <div class="mb-3"><i class="fa-solid fa-circle-check text-accent display-3"></i></div>
                    <h4 class="text-accent mb-2">Powiadomienie Nailchemy</h4>
                    <p id="notificationText" class="text-white-50">Treść powiadomienia...</p>
                    <button type="button" class="btn btn-hero-solid mt-3" data-bs-dismiss="modal">Rozumiem</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    window.showNotification = function (msg) {
        document.getElementById('notificationText').innerText = msg;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('notificationModal')).show();
    };

    window.goWithNotification = function (url, msg) {
        try { sessionStorage.setItem('nailchemyFlash', msg); } catch (e) {}
        location.href = url;
    };

    // pokaż powiadomienie przekazane z poprzedniej strony
    try {
        var flash = sessionStorage.getItem('nailchemyFlash');
        if (flash) {
            sessionStorage.removeItem('nailchemyFlash');
            window.showNotification(flash);
        }
    } catch (e) {}
})();

/* NAILCHEMY – karuzele: półkole bestsellerów + stały środek aktywnej opinii */
(function () {
    'use strict';
    if (!document.querySelector('[data-page="home"]')) return;

    function initBestsellersSemicircle() {
        var container = document.getElementById('bestsellersCarousel');
        var track = document.getElementById('bestsellersTrack');
        var prevBtn = document.getElementById('bsPrevBtn');
        var nextBtn = document.getElementById('bsNextBtn');
        if (!container || !track) return;

        var cards = Array.prototype.slice.call(track.children);
        if (!cards.length) return;

        var activeIndex = 2;
        var animating = false;

        function visibleCount() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 992) return Math.min(3, cards.length);
            return Math.min(5, cards.length);
        }

        function applyStates(direction) {
            var count = cards.length;
            var vis = visibleCount();
            var half = Math.floor(vis / 2);

            track.classList.remove('slide-from-next', 'slide-from-prev');
            if (direction === 'next') {
                void track.offsetWidth;
                track.classList.add('slide-from-next');
            } else if (direction === 'prev') {
                void track.offsetWidth;
                track.classList.add('slide-from-prev');
            }

            cards.forEach(function (card, idx) {
                var offset = (idx - activeIndex + count) % count;
                if (offset > count / 2) offset -= count;

                card.classList.remove(
                    'is-center-featured',
                    'is-arc-left',
                    'is-arc-right',
                    'is-arc-far-left',
                    'is-arc-far-right',
                    'is-hidden-card'
                );

                if (vis === 1) {
                    if (offset === 0) card.classList.add('is-center-featured');
                    else card.classList.add('is-hidden-card');
                } else if (Math.abs(offset) <= half) {
                    if (offset === 0) card.classList.add('is-center-featured');
                    else if (offset === -1) card.classList.add('is-arc-left');
                    else if (offset === 1) card.classList.add('is-arc-right');
                    else if (offset < -1) card.classList.add('is-arc-far-left');
                    else if (offset > 1) card.classList.add('is-arc-far-right');
                } else {
                    card.classList.add('is-hidden-card');
                }
            });

            window.setTimeout(function () {
                track.classList.remove('slide-from-next', 'slide-from-prev');
                animating = false;
            }, 380);
        }

        function step(delta) {
            if (animating) return;
            animating = true;
            var count = cards.length;
            activeIndex = (activeIndex + delta + count) % count;
            applyStates(delta > 0 ? 'next' : 'prev');
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

        cards.forEach(function (card, idx) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('a, button')) return;
                var count = cards.length;
                var offset = (idx - activeIndex + count) % count;
                if (offset > count / 2) offset -= count;
                if (offset !== 0) step(offset > 0 ? 1 : -1);
            });
        });

        window.addEventListener('resize', function () { applyStates(null); });
        applyStates(null);
    }

    function initPinnedCenterReviews() {
        var container = document.getElementById('reviewsCarousel');
        var track = document.getElementById('reviewsTrack');
        var prevBtn = document.getElementById('revPrevBtn');
        var nextBtn = document.getElementById('revNextBtn');
        if (!container || !track) return;

        var cards = Array.prototype.slice.call(track.children);
        if (!cards.length) return;

        var currentIndex = 1;
        var animating = false;

        function isMobile() {
            return window.innerWidth < 768;
        }

        function renderCenterPinned(direction) {
            var count = cards.length;
            track.classList.remove('slide-from-next', 'slide-from-prev');
            if (direction === 'next') {
                void track.offsetWidth;
                track.classList.add('slide-from-next');
            } else if (direction === 'prev') {
                void track.offsetWidth;
                track.classList.add('slide-from-prev');
            }

            if (isMobile()) {
                cards.forEach(function (card, idx) {
                    card.classList.remove('is-side-card', 'is-hidden-card', 'is-center-featured');
                    if (idx === currentIndex) {
                        card.classList.add('is-center-featured');
                        track.appendChild(card);
                    } else {
                        card.classList.add('is-hidden-card');
                    }
                });
            } else {
                var prevIdx = (currentIndex - 1 + count) % count;
                var nextIdx = (currentIndex + 1) % count;

                cards.forEach(function (card, idx) {
                    card.classList.remove('is-center-featured', 'is-side-card', 'is-hidden-card');
                    if (idx === prevIdx) {
                        card.classList.add('is-side-card');
                        track.appendChild(card);
                    }
                });

                cards.forEach(function (card, idx) {
                    if (idx === currentIndex) {
                        card.classList.add('is-center-featured');
                        track.appendChild(card);
                    }
                });

                cards.forEach(function (card, idx) {
                    if (idx === nextIdx && nextIdx !== prevIdx) {
                        card.classList.add('is-side-card');
                        track.appendChild(card);
                    }
                });

                cards.forEach(function (card, idx) {
                    if (idx !== prevIdx && idx !== currentIndex && idx !== nextIdx) {
                        card.classList.add('is-hidden-card');
                        track.appendChild(card);
                    }
                });
            }

            window.setTimeout(function () {
                track.classList.remove('slide-from-next', 'slide-from-prev');
                animating = false;
            }, 380);
        }

        function step(delta) {
            if (animating) return;
            animating = true;
            var count = cards.length;
            currentIndex = (currentIndex + delta + count) % count;
            renderCenterPinned(delta > 0 ? 'next' : 'prev');
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

        track.addEventListener('click', function (e) {
            var card = e.target.closest('.review-slide-card');
            if (!card) return;
            if (card.classList.contains('is-center-featured')) return;
            var targetIdx = Number(card.getAttribute('data-rev-index'));
            if (isNaN(targetIdx)) return;
            var count = cards.length;
            var diff = (targetIdx - currentIndex + count) % count;
            if (diff > count / 2) diff -= count;
            if (diff !== 0) step(diff > 0 ? 1 : -1);
        });

        window.addEventListener('resize', function () { renderCenterPinned(null); });
        renderCenterPinned(null);
    }

    initBestsellersSemicircle();
    initPinnedCenterReviews();

    document.addEventListener('click', function (e) {
        var favBtn = e.target.closest('[data-fav-toggle]');
        if (!favBtn) return;
        e.preventDefault();
        e.stopPropagation();
        favBtn.classList.toggle('is-active');
        var icon = favBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-regular', !favBtn.classList.contains('is-active'));
            icon.classList.toggle('fa-solid', favBtn.classList.contains('is-active'));
        }
    });
})();
