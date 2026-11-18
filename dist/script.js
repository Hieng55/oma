const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 24), { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}));

const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work-item');
filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  works.forEach((work) => {
    work.hidden = button.dataset.filter !== 'all' && work.dataset.artist !== button.dataset.filter;
  });
}));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxLabel = lightbox.querySelector('p');
works.forEach((work) => work.addEventListener('click', () => {
  const source = work.querySelector('img');
  lightboxImage.src = source.src;
  lightboxImage.alt = source.alt;
  lightboxLabel.textContent = work.dataset.label;
  lightbox.showModal();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

document.querySelector('#inquiry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hi OMA Tattoo — my name is ${data.get('name')}. Contact: ${data.get('contact')}. Tattoo idea: ${data.get('idea')}. Placement: ${data.get('placement') || 'Not decided'}. Artist: ${data.get('artist')}.`;
  document.querySelector('#form-note').textContent = 'Opening your messaging app…';
  location.href = `sms:+14026801201?&body=${encodeURIComponent(message)}`;
});
