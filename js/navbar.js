/**
 * NAILCHEMY – wspólny navbar (+ panel Kategorii i panel Koszyka)
 *
 * Wystarczy na KAŻDEJ podstronie, w miejscu gdzie ma być navbar, dać:
 *     <script src="js/navbar.js"></script>
 * Skrypt wstawia HTML dokładnie w to miejsce (bez mrugania strony)
 * i sam podświetla aktywny link na podstawie <body data-page="...">.
 *
 * Edytujesz navbar RAZ tutaj – zmienia się na wszystkich stronach.
 */
(function () {
    var html = `
    <header class="sticky-top" style="top: 0;">
        <nav class="navbar navbar-expand-lg navbar-custom">
            <div class="container">
                
                <div class="d-flex align-items-center gap-3">
                    <button class="btn-categories-trigger" type="button" data-bs-toggle="offcanvas" data-bs-target="#categoriesDrawer">
                        <i class="fa-solid fa-bars text-accent"></i>
                        <span class="d-none d-sm-inline">Kategorie</span>
                    </button>

                    <a class="navbar-brand" href="index.html">
                        <svg class="brand-logo-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M38 66 C38 60, 62 60, 62 66 L62 70 C62 70, 78 74, 78 92 C78 108, 65 114, 50 114 C35 114, 22 108, 22 92 C22 74, 38 70, 38 70 Z" stroke="#BF8EA0" stroke-width="3.5" fill="#2C2226"/>
                            <rect x="42" y="58" width="16" height="8" rx="2" stroke="#BF8EA0" stroke-width="3" fill="#1E1619"/>
                            <path d="M26 90 C32 106, 68 106, 74 90 C70 98, 58 106, 50 96 C42 106, 30 98, 26 90 Z" fill="#F0DFD5" opacity="0.9"/>
                            <path d="M42 85 L50 98 L58 85" stroke="#BF8EA0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <g transform="translate(10, -5) rotate(18 50 50)">
                                <rect x="58" y="24" width="18" height="28" rx="4" stroke="#F0DFD5" stroke-width="3" fill="#BF8EA0"/>
                                <line x1="58" y1="52" x2="52" y2="64" stroke="#F0DFD5" stroke-width="3" stroke-linecap="round"/>
                            </g>
                            <path d="M50 56 C46 44, 30 46, 32 34 C34 22, 54 20, 52 10 C50 2, 42 4, 44 12 C46 20, 32 26, 36 38 C38 44, 48 48, 50 56 Z" stroke="#BF8EA0" stroke-width="3" fill="none" stroke-linecap="round"/>
                            <circle cx="58" cy="18" r="2" fill="#F0DFD5"/>
                        </svg>
                        Nailchemy
                    </a>
                </div>

                <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNailchemy">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNailchemy">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center me-lg-3">
                        <li class="nav-item"><a class="nav-link" data-nav="home" href="index.html">Strona Główna</a></li>
                        <li class="nav-item"><a class="nav-link" data-nav="about" href="o-nas.html">O nas</a></li>
                        <li class="nav-item"><a class="nav-link" data-nav="shop" href="sklep.html">Sklep</a></li>
                        <li class="nav-item"><a class="nav-link" data-nav="blog" href="blog.html">Blog</a></li>
                        <li class="nav-item"><a class="nav-link" href="index.html#oferta">Oferta</a></li>
                        <li class="nav-item"><a class="nav-link" href="kontakt.html">Kontakt</a></li>
                    </ul>
                </div>

                <!-- Ikony Konta oraz Koszyka (licznik aktualizowany przez cart.js) -->
                <div class="d-flex align-items-center gap-2">
                    <a href="konto.html" class="nav-ecommerce-icon" title="Konto Użytkownika">
                        <i class="fa-regular fa-user"></i>
                    </a>
                    <a data-bs-toggle="offcanvas" data-bs-target="#cartDrawer" class="nav-ecommerce-icon position-relative" title="Koszyk Zakupowy">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary text-accent border border-primary" id="cartBadgeCount" style="font-size: 0.7rem;">0</span>
                    </a>
                </div>

            </div>
        </nav>
    </header>
    <!-- OFFCANVAS KATEGORIE (LEWY) -->
    <div class="offcanvas offcanvas-start offcanvas-custom" tabindex="-1" id="categoriesDrawer">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">
                <i class="fa-solid fa-layer-group text-primary-brand"></i> Kategorie Produktów
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <div class="mb-4">
                <div class="category-group-title"><i class="fa-solid fa-bottle-droplet"></i> Lakierowa Alchemia</div>
                <a class="category-item-link" href="sklep.html">Lakiery Hybrydowe</a>
                <a class="category-item-link" href="sklep.html">Bazy & Topy</a>
                <a class="category-item-link" href="sklep.html">Kolekcje Sezonowe</a>
            </div>
            <div class="mb-4">
                <div class="category-group-title"><i class="fa-solid fa-spa"></i>Pielęgnacja</div>
                <a class="category-item-link" href="sklep.html">Oliwki</a>
                <a class="category-item-link" href="sklep.html">Serum Regenerujące Paznokcie</a>
            </div>
            <div class="mb-4">
                <div class="category-group-title"><i class="fa-solid fa-blog"></i>Strefa Blogowa</div>
                <a class="category-item-link" href="blog.html">Archiwum Wpisów</a>
            </div>
        </div>
    </div>
    <!-- OFFCANVAS KOSZYK (PRAWY) -->
    <div class="offcanvas offcanvas-end offcanvas-custom" tabindex="-1" id="cartDrawer">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">
                <i class="fa-solid fa-bag-shopping text-primary-brand"></i> Twój Koszyk
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column p-0">
            <div class="p-3 flex-grow-1 overflow-y-auto" id="cartDrawerItemsList"></div>
            <div class="cart-drawer-footer">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-white-50">Suma częściowa:</span>
                    <span class="h5 mb-0 text-accent fw-bold" id="cartSubtotal">140,00 PLN</span>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-light w-50 rounded-pill btn-sm" data-bs-dismiss="offcanvas" onclick="location.href='koszyk.html'">Zobacz koszyk</button>
                    <button class="btn btn-hero-solid cart-action-button w-50 rounded-pill btn-sm" data-bs-dismiss="offcanvas" onclick="location.href='zamowienie.html'">Do kasy</button>
                </div>
            </div>
        </div>
    </div>
`;

    var host = document.currentScript;
    host.insertAdjacentHTML('beforebegin', html);

    // Aktywny link w menu (data-page ustawione w <body>)
    var page = document.body.getAttribute('data-page');
    // strony "powiązane" podświetlają ten sam link co strona nadrzędna
    var parent = { product: 'shop', single: 'blog', cart: 'shop', checkout: 'shop' };
    var current = parent[page] || page;
    document.querySelectorAll('.navbar-custom .nav-link[data-nav]').forEach(function (a) {
        if (a.getAttribute('data-nav') === current) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        }
    });
})();
