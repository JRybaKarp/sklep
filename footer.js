/**
 * NAILCHEMY – wspólna, responsywna stopka korporacyjna.
 * Wstawiana na wszystkich podstronach przez <script src="js/footer.js"></script>.
 */
(function () {
    var html = `
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="row g-4 g-lg-5">
          <section class="col-12 col-md-6 col-lg-3" aria-labelledby="footer-brand-heading">
            <a class="footer-brand d-inline-flex align-items-center gap-2" href="index.html" aria-label="Nailchemy – strona główna">
              <span class="footer-brand-mark" aria-hidden="true"><i class="fa-solid fa-flask"></i></span>
              <span id="footer-brand-heading">Nailchemy</span>
            </a>
            <p class="footer-description">Łączymy świat koloru, pielęgnacji i świadomej stylizacji paznokci. Pomagamy tworzyć piękne stylizacje z dbałością o każdy detal.</p>
            <div class="footer-social d-flex gap-2" aria-label="Media społecznościowe">
              <a href="https://www.instagram.com/" aria-label="Instagram Nailchemy" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
              <a href="https://www.facebook.com/" aria-label="Facebook Nailchemy" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.pinterest.com/" aria-label="Pinterest Nailchemy" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-pinterest-p"></i></a>
            </div>
          </section>
          <nav class="col-6 col-lg-3" aria-labelledby="footer-nav-heading">
            <h2 class="footer-heading" id="footer-nav-heading">Szybka nawigacja</h2>
            <ul class="footer-links-list">
              <li><a href="index.html">Strona główna</a></li><li><a href="o-nas.html">O nas</a></li>
              <li><a href="index.html#oferta">Oferta</a></li><li><a href="blog.html">Blog</a></li><li><a href="kontakt.html">Kontakt</a></li>
            </ul>
          </nav>
          <nav class="col-6 col-lg-3" aria-labelledby="footer-customer-heading">
            <h2 class="footer-heading" id="footer-customer-heading">Strefa klienta</h2>
            <ul class="footer-links-list">
              <li><a href="sklep.html">Sklep</a></li><li><a href="koszyk.html">Koszyk</a></li>
              <li><a href="konto.html">Moje konto</a></li><li><a href="polityka-prywatnosci.html">Polityka prywatności</a></li>
              <li><a href="404.html">Błąd 404</a></li>
            </ul>
          </nav>
          <section class="col-12 col-lg-3" aria-labelledby="footer-newsletter-heading">
            <h2 class="footer-heading" id="footer-newsletter-heading">Bądź na bieżąco</h2>
            <p class="footer-description">Zapisz się do newslettera i otrzymuj informacje o nowościach.</p>
            <form class="footer-newsletter" id="footerNewsletterForm">
              <label class="visually-hidden" for="footerNewsletterEmail">Adres e-mail</label>
              <div class="input-group">
                <input class="form-control footer-input" type="email" id="footerNewsletterEmail" name="email" placeholder="Twój e-mail" autocomplete="email" required>
                <button class="btn footer-submit" type="submit" aria-label="Zapisz się do newslettera"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
              </div>
              <p class="footer-form-feedback" id="footerNewsletterFeedback" role="status" aria-live="polite"></p>
            </form>
            <div class="footer-contact-short"><a href="mailto:kontakt@nailchemy.pl">kontakt@nailchemy.pl</a><a href="tel:+48220000000">+48 22 000 00 00</a></div>
          </section>
        </div>
      </div>
      <div class="footer-legal">
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p class="mb-0">&copy; 2026 Nailchemy Sp. z o.o. Wszelkie prawa zastrzeżone. Zdjęcia-Martyna Stasiowska (prace własne).</p>
          <p class="mb-0">Projekt: Julia Ryba, Martyna Stasiowska<span aria-hidden="true">·</span> <a href="polityka-prywatnosci.html">Polityka prywatności</a></p>
        </div>
      </div>
    </footer>`;
    var script = document.currentScript;
    script.insertAdjacentHTML('beforebegin', html);
    var form = document.getElementById('footerNewsletterForm');
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault();
      document.getElementById('footerNewsletterFeedback').textContent = 'Dziękujemy za zainteresowanie! Formularz demonstracyjny nie zapisuje adresów.';
      form.reset();
    });
})();
