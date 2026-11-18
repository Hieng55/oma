const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelector('.site-header .local-time')?.remove();

const headerLogo = document.querySelector('.header-logo');
if (headerLogo && !headerLogo.querySelector('img')) {
  headerLogo.setAttribute('aria-label', 'OMA Tattoo home');
  headerLogo.innerHTML = '<img src="assets/oma-logo.webp" alt="OMA Tattoo">';
}

if (mobileMenu) {
  const homeLink = document.createElement('a');
  homeLink.href = 'index.html';
  homeLink.textContent = 'Home';
  homeLink.dataset.mobileHome = '';
  mobileMenu.prepend(homeLink);

  if (!mobileMenu.querySelector('[aria-current="page"]')) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    mobileMenu.querySelectorAll('a[href]').forEach((link) => {
      if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
    });
  }
}

const pageTransition = document.createElement('div');
pageTransition.className = 'page-transition';
pageTransition.setAttribute('aria-hidden', 'true');
pageTransition.innerHTML = '<span>OMA TATTOO</span>';
document.body.append(pageTransition);

if (!reduceMotion.matches) {
  pageTransition.classList.add('is-entering');
  pageTransition.addEventListener('animationend', () => pageTransition.classList.remove('is-entering'), { once: true });
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || reduceMotion.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
  const destination = new URL(link.href, window.location.href);
  const current = new URL(window.location.href);
  const isInternalPage = destination.origin === current.origin && destination.pathname.endsWith('.html');
  const isSameDocumentAnchor = destination.pathname === current.pathname && destination.search === current.search && destination.hash;
  if (!isInternalPage || isSameDocumentAnchor) return;
  event.preventDefault();
  pageTransition.classList.remove('is-entering');
  void pageTransition.offsetWidth;
  pageTransition.classList.add('is-leaving');
  window.setTimeout(() => { window.location.href = destination.href; }, 420);
});

window.addEventListener('pageshow', () => pageTransition.classList.remove('is-leaving'));

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  }));
}

const progress = document.querySelector('.page-progress span');
const updateProgress = () => {
  if (!progress) return;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const slides = [...document.querySelectorAll('[data-slide]')];
const slideDots = [...document.querySelectorAll('[data-slide-dot]')];
let slideIndex = 0;
let slideshowTimer;
const mobileSlideshow = window.matchMedia('(max-width: 820px)');

const loadMobileSlides = () => {
  if (!mobileSlideshow.matches) return;
  slides.slice(1).forEach((slide) => {
    const image = slide.querySelector('img[data-src]');
    if (!image) return;
    image.src = image.dataset.src;
    image.removeAttribute('data-src');
  });
};

const showSlide = (nextIndex) => {
  if (!slides.length) return;
  slideIndex = (nextIndex + slides.length) % slides.length;
  slides.forEach((slide, index) => slide.classList.toggle('is-active', index === slideIndex));
  slideDots.forEach((dot, index) => dot.classList.toggle('is-active', index === slideIndex));
};
const restartSlideshow = () => {
  window.clearInterval(slideshowTimer);
  if (mobileSlideshow.matches && slides.length > 1) {
    loadMobileSlides();
    slideshowTimer = window.setInterval(() => showSlide(slideIndex + 1), 5500);
  }
};
slideDots.forEach((dot, index) => dot.addEventListener('click', () => {
  showSlide(index);
  restartSlideshow();
}));
restartSlideshow();
mobileSlideshow.addEventListener('change', () => {
  loadMobileSlides();
  showSlide(0);
  restartSlideshow();
});

const stylesRail = document.querySelector('[data-styles-rail]');
const scrollStyles = (direction) => {
  const card = stylesRail?.querySelector('.style-card');
  if (!stylesRail || !card) return;
  const gap = Number.parseFloat(getComputedStyle(stylesRail).columnGap) || 0;
  stylesRail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
};
document.querySelector('[data-rail-prev]')?.addEventListener('click', () => scrollStyles(-1));
document.querySelector('[data-rail-next]')?.addEventListener('click', () => scrollStyles(1));
document.querySelector('[data-open-styles]')?.addEventListener('click', () => stylesRail?.scrollIntoView({ behavior: 'smooth', block: 'center' }));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxLabel = lightbox?.querySelector('p');
document.querySelectorAll('[data-gallery-src]').forEach((trigger) => trigger.addEventListener('click', () => {
  if (!lightbox || !lightboxImage || !lightboxLabel) return;
  lightboxImage.src = trigger.dataset.gallerySrc;
  lightboxImage.alt = trigger.querySelector('img')?.alt || trigger.dataset.galleryLabel || '';
  lightboxLabel.textContent = trigger.dataset.galleryLabel || '';
  lightbox.showModal();
}));
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

const omahaTimes = [...document.querySelectorAll('[data-omaha-time]')];
const updateOmahaTime = () => {
  if (!omahaTimes.length) return;
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit'
  }).format(new Date());
  omahaTimes.forEach((time) => { time.textContent = formattedTime; });
};
updateOmahaTime();
window.setInterval(updateOmahaTime, 30000);

const socialLinks = {
  maps: 'https://www.google.com/maps?cid=12009149571975565015',
  instagram: 'https://www.instagram.com/omatattoo.shop/',
  facebook: 'https://www.facebook.com/omatattoo68144'
};

document.querySelectorAll('footer > div').forEach((group) => {
  if (group.querySelector('h2')?.textContent.trim().toLowerCase() !== 'visit') return;
  const addressLink = group.querySelector('a');
  if (!addressLink) return;
  addressLink.href = socialLinks.maps;
  addressLink.target = '_blank';
  addressLink.rel = 'noopener noreferrer';
});

const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom && !footerBottom.querySelector('.footer-socials')) {
  const useBrandSocialIcons = document.body.classList.contains('home-page');
  const footerSocials = document.createElement('nav');
  footerSocials.className = 'footer-socials';
  footerSocials.setAttribute('aria-label', 'OMA Tattoo social links');
  footerSocials.innerHTML = `
    <a href="${socialLinks.maps}" target="_blank" rel="noopener noreferrer" aria-label="OMA Tattoo on Google Maps"><img class="footer-social-map" src="https://thesvg.org/icons/google-maps/default.svg" alt="" aria-hidden="true"></a>
    <a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="OMA Tattoo on Instagram"><img src="${useBrandSocialIcons ? 'assets/instagram.svg' : 'https://thesvg.org/ui/social-instagram/outline.svg'}" alt="" aria-hidden="true"></a>
    <a href="${socialLinks.facebook}" target="_blank" rel="noopener noreferrer" aria-label="OMA Tattoo on Facebook"><img src="${useBrandSocialIcons ? 'assets/facebook.svg' : 'https://thesvg.org/ui/social-facebook/outline.svg'}" alt="" aria-hidden="true"></a>
  `;
  footerBottom.insertBefore(footerSocials, footerBottom.querySelector('p'));
}

const footerCredit = footerBottom?.querySelector('p');
if (footerCredit) {
  footerCredit.className = 'footer-credit';
  footerCredit.innerHTML = '© 2026 OMA Tattoo. Designed by <a href="https://tdtransactionsllc.com/" target="_blank" rel="noopener noreferrer">TD Transactions LLC</a>. Developed by <a href="https://webs4v.vn/" target="_blank" rel="noopener noreferrer">Webs4V</a>.';
}

const requestedArtist = new URLSearchParams(window.location.search).get('artist');
const artistChoice = document.querySelector('#artist-choice');
if (requestedArtist && artistChoice) {
  const matchingOption = [...artistChoice.options].find((option) => option.textContent.toLowerCase() === requestedArtist.toLowerCase());
  if (matchingOption) artistChoice.value = matchingOption.value;
}
const requestedStyle = new URLSearchParams(window.location.search).get('style');
const tattooIdea = document.querySelector('#idea');
if (requestedStyle && tattooIdea) tattooIdea.placeholder = `I'm interested in ${requestedStyle}. Tell us more about your idea.`;

const inquiryForm = document.querySelector('#inquiry-form');
const inquiryNote = document.querySelector('#form-note');
const inquiryButton = inquiryForm?.querySelector('button[type="submit"]');
let bookingPhotos;
if (inquiryForm) {
  inquiryForm.enctype = 'multipart/form-data';
  const contactInput = inquiryForm.querySelector('#contact-field');
  const contactLabel = inquiryForm.querySelector('label[for="contact-field"]');
  if (contactInput) {
    contactInput.type = 'tel';
    contactInput.autocomplete = 'tel';
    contactInput.placeholder = '(402) 555-0123';
    contactInput.inputMode = 'tel';
  }
  if (contactLabel) contactLabel.textContent = 'Phone number';

  const submitSection = inquiryForm.querySelector('.booking-submit');
  const photoField = document.createElement('div');
  photoField.className = 'field booking-photo-field';
  photoField.innerHTML = '<label for="booking-photos">Reference photos</label><small data-photo-note>Optional - Up to 5 JPG, PNG, or WebP images - 5 MB each</small><label class="booking-photo-dropzone" for="booking-photos"><span aria-hidden="true">+</span><strong>Choose or drop images</strong><em>Show us your tattoo inspiration</em></label><input class="booking-photo-input" id="booking-photos" name="photos[]" type="file" accept="image/jpeg,image/png,image/webp" multiple><div class="booking-photo-list" data-photo-list aria-live="polite"></div>';
  submitSection?.before(photoField);

  const styleField = document.createElement('div');
  styleField.className = 'field';
  styleField.innerHTML = '<label for="style-choice">Select your style</label><small>Optional</small><select id="style-choice" name="style"><option value="">No preference</option><option>Black &amp; Grey Realism</option><option>Fine Line &amp; Microrealism</option><option>Realism Sculptures</option><option>Color &amp; Anime</option><option>Floral &amp; Ornamental</option><option>Custom Big Pieces</option></select>';
  submitSection?.before(styleField);
  const styleChoice = styleField.querySelector('select');
  if (requestedStyle && styleChoice) {
    const matchingStyle = [...styleChoice.options].find((option) => option.textContent.toLowerCase() === requestedStyle.toLowerCase());
    if (matchingStyle) styleChoice.value = matchingStyle.value;
  }

  const instagramField = document.createElement('div');
  instagramField.className = 'field';
  instagramField.innerHTML = '<label for="instagram-handle">Instagram</label><small>Required</small><input id="instagram-handle" name="instagram" autocomplete="off" placeholder="@username" required maxlength="120">';
  submitSection?.before(instagramField);

  const consentField = document.createElement('fieldset');
  consentField.className = 'booking-consents';
  consentField.innerHTML = '<legend>Text message consent</legend><label><input type="checkbox" name="sms_consent" value="yes" required><span>I agree to receive informational text messages from OMA Tattoo about my tattoo inquiry.</span></label><label><input type="checkbox" name="marketing_consent" value="yes"><span>I agree to receive optional promotional text messages, such as artist availability and offers.</span></label><p>Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.</p>';
  submitSection?.before(consentField);

  bookingPhotos = photoField.querySelector('input');
  const photoNote = photoField.querySelector('[data-photo-note]');
  const photoList = photoField.querySelector('[data-photo-list]');
  const dropzone = photoField.querySelector('.booking-photo-dropzone');
  bookingPhotos?.addEventListener('change', () => {
    const count = bookingPhotos.files?.length || 0;
    if (photoNote) photoNote.textContent = count ? `${count} image${count === 1 ? '' : 's'} selected - 5 maximum` : 'Optional - Up to 5 JPG, PNG, or WebP images - 5 MB each';
    if (photoList) photoList.textContent = [...(bookingPhotos.files || [])].map((file) => file.name).join(', ');
  });
  ['dragenter', 'dragover'].forEach((eventName) => dropzone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  }));
  ['dragleave', 'drop'].forEach((eventName) => dropzone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
  }));
  dropzone?.addEventListener('drop', (event) => {
    if (!bookingPhotos || !event.dataTransfer?.files.length) return;
    bookingPhotos.files = event.dataTransfer.files;
    bookingPhotos.dispatchEvent(new Event('change'));
  });
}
const loadSweetAlert = () => {
  if (window.Swal) return Promise.resolve(window.Swal);
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-sweetalert]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Swal), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.all.min.js';
    script.async = true;
    script.dataset.sweetalert = '';
    script.addEventListener('load', () => resolve(window.Swal), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
};
const sweetAlertReady = inquiryForm ? loadSweetAlert().catch(() => null) : Promise.resolve(null);
if (inquiryNote) inquiryNote.textContent = 'Your request will be sent securely to OMA Tattoo.';
if (inquiryButton) inquiryButton.textContent = 'Send booking request';

inquiryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const Swal = await sweetAlertReady;
  const photos = [...(bookingPhotos?.files || [])];
  let validationError = '';
  if (photos.length > 5) validationError = 'Please choose no more than 5 reference images.';
  if (!validationError && photos.some((photo) => photo.size > 5 * 1024 * 1024)) validationError = 'Each reference image must be 5 MB or smaller.';
  if (!validationError && photos.some((photo) => photo.type && !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type))) validationError = 'Only JPG, PNG, and WebP reference images are allowed.';
  if (validationError) {
    if (Swal) {
      await Swal.fire({
        icon: 'error',
        title: 'Check your images',
        text: validationError,
        confirmButtonText: 'Choose again',
        confirmButtonColor: '#0a0a0a',
        background: '#f1eee7',
        color: '#0a0a0a'
      });
    } else {
      window.alert(validationError);
    }
    return;
  }
  if (button) button.disabled = true;
  if (inquiryNote) inquiryNote.textContent = 'Sending your request...';
  if (Swal) {
    Swal.fire({
      title: 'Sending request',
      text: 'Please wait while we contact OMA Tattoo.',
      background: '#f1eee7',
      color: '#0a0a0a',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
  }

  try {
    const response = await fetch('api/send-telegram.php', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || 'Unable to send your request.');

    form.reset();
    const photoNote = form.querySelector('[data-photo-note]');
    const photoList = form.querySelector('[data-photo-list]');
    if (photoNote) photoNote.textContent = 'Optional - Up to 5 JPG, PNG, or WebP images - 5 MB each';
    if (photoList) photoList.textContent = '';
    if (inquiryNote) inquiryNote.textContent = 'Thank you! Your request was sent. OMA Tattoo will contact you soon.';
    const successMessage = result.message || 'Your booking request was sent successfully. OMA Tattoo will contact you soon.';
    if (Swal) {
      await Swal.fire({
        icon: 'success',
        title: 'Request sent',
        text: successMessage,
        confirmButtonText: 'Done',
        confirmButtonColor: '#0a0a0a',
        background: '#f1eee7',
        color: '#0a0a0a'
      });
    } else {
      window.alert(successMessage);
    }
  } catch (error) {
    const errorMessage = `${error.message} Please call or text +1 (402) 680-1201.`;
    if (inquiryNote) inquiryNote.textContent = errorMessage;
    if (Swal) {
      await Swal.fire({
        icon: 'error',
        title: 'Unable to send request',
        text: errorMessage,
        confirmButtonText: 'Try again',
        confirmButtonColor: '#0a0a0a',
        background: '#f1eee7',
        color: '#0a0a0a'
      });
    } else {
      window.alert(errorMessage);
    }
  } finally {
    if (button) button.disabled = false;
  }
});
