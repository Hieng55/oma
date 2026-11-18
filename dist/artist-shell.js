document.querySelector('[data-artist-shell]').innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a><div class="page-progress" aria-hidden="true"><span></span></div>
  <header class="site-header" data-header>
    <a class="header-logo" href="index.html" aria-label="OMA Tattoo home"><img src="assets/oma-logo.webp" alt="OMA Tattoo"></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="artists.html" aria-current="page">Artists</a><a href="styles.html">Styles</a><a href="studio.html">Studio</a><a href="reviews.html">Reviews</a><a href="contact.html">Contact</a></nav>
    <p class="local-time"><span data-omaha-time>--:-- --</span> · OMAHA</p><a class="book-button" href="booking.html" data-artist-book>Book now</a>
    <button class="menu-button" type="button" aria-controls="mobile-menu" aria-expanded="false"><span>Menu</span><i></i><i></i></button>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden><a href="artists.html" aria-current="page">Artists</a><a href="styles.html">Styles</a><a href="studio.html">Studio</a><a href="reviews.html">Reviews</a><a href="contact.html">Contact</a><a href="booking.html" data-artist-book>Book now</a></nav>
  </header>
  <main id="main" class="inner-main artist-profile-page">
    <section class="artist-profile-hero"><div class="artist-profile-copy"><a class="artist-back-link" href="artists.html">← All artists</a><p data-artist-specialty></p><h1 data-artist-name>Artist</h1><div class="artist-profile-actions"><a class="outline-button" href="#portfolio">View portfolio</a><a class="outline-button" href="booking.html" data-artist-book>Book this artist</a></div></div><div class="artist-profile-image"><img data-artist-cover src="" alt=""></div></section>
    <section class="portfolio-section" id="portfolio"><div class="portfolio-heading"><p>Selected work</p><h2><span data-artist-name>Artist</span> portfolio</h2></div><div class="portfolio-grid" data-artist-gallery></div></section>
    <div class="page-cta"><p>Ready to start your tattoo?</p><a class="outline-button" href="booking.html" data-artist-book>Book this artist</a></div>
  </main>
  <footer><div><h2>All artists</h2><a href="artists.html">Meet the team</a></div><div><h2>Contact</h2><a href="tel:+14026801201">+1 (402) 680-1201</a></div><div><h2>Visit</h2><a href="contact.html">10808 Prairie Hills Dr<br>Omaha, NE 68144</a></div><div><h2>Hours</h2><p>Daily · 11 AM–7 PM</p></div><div class="footer-bottom"><strong class="footer-brand">OMA TATTOO</strong><p>© 2026 OMA Tattoo.</p></div></footer>
  <dialog class="lightbox" aria-label="Selected tattoo work"><button class="lightbox-close" type="button" aria-label="Close image">×</button><img src="" alt=""><p></p></dialog>`;
