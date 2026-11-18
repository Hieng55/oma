document.querySelector('[data-style-shell]').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a><div class="page-progress" aria-hidden="true"><span></span></div>
  <header class="site-header" data-header>
    <a class="header-logo" href="index.html" aria-label="OMA Tattoo home"><img src="assets/oma-logo.webp" alt="OMA Tattoo"></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="artists.html">Artists</a><a href="styles.html" aria-current="page">Styles</a><a href="studio.html">Studio</a><a href="reviews.html">Reviews</a><a href="contact.html">Contact</a></nav>
    <p class="local-time"><span data-omaha-time>--:-- --</span> · OMAHA</p><a class="book-button" href="booking.html" data-style-book>Book now</a>
    <button class="menu-button" type="button" aria-controls="mobile-menu" aria-expanded="false"><span>Menu</span><i></i><i></i></button>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden><a href="artists.html">Artists</a><a href="styles.html" aria-current="page">Styles</a><a href="studio.html">Studio</a><a href="reviews.html">Reviews</a><a href="contact.html">Contact</a><a href="booking.html" data-style-book>Book now</a></nav>
  </header>
  <main id="main" class="inner-main artist-profile-page style-profile-page">
    <section class="artist-profile-hero"><div class="artist-profile-copy"><a class="artist-back-link" href="styles.html">← All styles</a><p>Tattoo style</p><h1 data-style-name>Style</h1><div class="style-description" data-style-description></div><div class="artist-profile-actions"><a class="outline-button" href="#portfolio">View similar work</a><a class="outline-button" href="booking.html" data-style-book>Book this style</a></div></div><div class="artist-profile-image"><img data-style-cover src="" alt=""></div></section>
    <section class="portfolio-section" id="portfolio"><div class="portfolio-heading"><p>Similar tattoos</p><h2><span data-style-name>Style</span> gallery</h2></div><div class="portfolio-grid" data-style-gallery></div><div class="style-specialists"><p>Artists working in this style</p><div data-style-artists></div></div></section>
    <div class="page-cta"><p>Want something in this style?</p><a class="outline-button" href="booking.html" data-style-book>Start your project</a></div>
  </main>
  <footer><div><h2>All styles</h2><a href="styles.html">Explore styles</a></div><div><h2>Artists</h2><a href="artists.html">Meet the team</a></div><div><h2>Contact</h2><a href="tel:+14026801201">+1 (402) 680-1201</a></div><div><h2>Hours</h2><p>Daily · 11 AM–7 PM</p></div><div class="footer-bottom"><strong class="footer-brand">OMA TATTOO</strong><p>© 2026 OMA Tattoo.</p></div></footer>
  <dialog class="lightbox" aria-label="Selected tattoo work"><button class="lightbox-close" type="button" aria-label="Close image">×</button><img src="" alt=""><p></p></dialog>`;
