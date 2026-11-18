const styleProfiles = {
  'black-grey': {
    name: 'Black & Grey Realism', description: 'Deep shading, contrast, and dimensional realism created with a restrained black-and-grey palette.',
    images: ['assets/artists/Tea/photo_2026-11-18_22-14-20.webp','assets/artists/Tea/photo_2026-11-18_22-14-24.webp','assets/artists/Tea/photo_2026-11-18_22-14-26.webp','assets/artists/Tea/photo_2026-11-18_22-14-29.webp','assets/artists/amaury/photo_2026-11-18_22-08-48.webp'],
    artists: [['Tea','tea.html'],['Amaury','amaury.html']]
  },
  'fine-line': {
    name: 'Fine Line & Microrealism', description: 'Delicate linework, small-scale detail, and subtle composition with a precise, refined finish.',
    images: ['assets/artists/Thea/photo_2026-11-18_22-10-26.webp','assets/artists/Thea/photo_2026-11-18_22-10-28.webp','assets/artists/Thea/photo_2026-11-18_22-10-30.webp','assets/artists/Thea/photo_2026-11-18_22-10-32.webp','assets/artists/Thea/photo_2026-11-18_22-10-38.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-10.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-13.webp'],
    artists: [['Thea','thea.html'],['Kimiko','kimiko.html']]
  },
  realism: {
    name: 'Realism Sculptures', description: 'Lifelike values, texture, and depth inspired by portraiture, sculpture, and classical imagery.',
    images: ['assets/artists/amaury/photo_2026-11-18_22-08-48.webp','assets/artists/amaury/photo_2026-11-18_22-08-53.webp','assets/artists/amaury/photo_2026-11-18_22-08-54.webp','assets/artists/amaury/photo_2026-11-18_22-08-56.webp','assets/artists/amaury/photo_2026-11-18_22-09-29.webp','assets/artists/amaury/photo_2026-11-18_22-09-32.webp','assets/artists/Tea/photo_2026-11-18_22-14-22.webp'],
    artists: [['Amaury','amaury.html'],['Tea','tea.html']]
  },
  'color-anime': {
    name: 'Color & Anime', description: 'Character-focused tattooing with vivid color, graphic shapes, and energetic illustrative detail.',
    images: ['assets/artists/Bee/photo_2026-11-18_22-13-43.webp','assets/artists/Bee/photo_2026-11-18_22-13-36.webp','assets/artists/Bee/photo_2026-11-18_22-13-38.webp','assets/artists/Bee/photo_2026-11-18_22-13-52.webp','assets/artists/Bee/photo_2026-11-18_22-13-54.webp'],
    artists: [['Bee','bee.html']]
  },
  'floral-ornamental': {
    name: 'Floral & Ornamental', description: 'Botanical movement, fine-line florals, X-ray forms, and decorative compositions designed for the body.',
    images: ['assets/artists/Kimiko/photo_2026-11-18_22-12-10.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-13.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-14.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-16.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-18.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-20.webp','assets/artists/Kimiko/photo_2026-11-18_22-12-51.webp','assets/artists/Thea/photo_2026-11-18_22-10-26.webp'],
    artists: [['Kimiko','kimiko.html'],['Thea','thea.html']]
  },
  'custom-big-pieces': {
    name: 'Custom Big Pieces', description: 'Large-scale custom compositions developed around your story, anatomy, placement, and visual direction.',
    images: ['assets/artists/Tea/photo_2026-11-18_22-14-22.webp','assets/artists/Tea/photo_2026-11-18_22-14-20.webp','assets/artists/Tea/photo_2026-11-18_22-14-24.webp','assets/artists/Tea/photo_2026-11-18_22-14-26.webp','assets/artists/Tea/photo_2026-11-18_22-14-27.webp','assets/artists/Tea/photo_2026-11-18_22-14-29.webp','assets/artists/amaury/photo_2026-11-18_22-08-48.webp'],
    artists: [['Tea','tea.html'],['Amaury','amaury.html']]
  }
};

const styleKey = document.body.dataset.style;
const style = styleProfiles[styleKey] || styleProfiles['black-grey'];
document.title = `${style.name} | OMA Tattoo Styles`;
document.querySelectorAll('[data-style-name]').forEach((element) => { element.textContent = style.name; });
document.querySelector('[data-style-description]').textContent = style.description;
document.querySelectorAll('[data-style-book]').forEach((link) => { link.href = `booking.html?style=${encodeURIComponent(style.name)}`; });
const cover = document.querySelector('[data-style-cover]');
cover.src = style.images[0]; cover.alt = `${style.name} tattoo at OMA Tattoo`;
cover.fetchPriority = 'high'; cover.decoding = 'async';
const gallery = document.querySelector('[data-style-gallery]');
style.images.slice(1).forEach((src, index) => {
  const button = document.createElement('button'); button.className = 'portfolio-item'; button.type = 'button';
  button.dataset.gallerySrc = src; button.dataset.galleryLabel = `${style.name} · Work ${index + 1}`;
  const image = document.createElement('img'); image.src = src; image.alt = `${style.name} tattoo example`; image.loading = 'lazy'; image.decoding = 'async';
  button.append(image); gallery.append(button);
});
const artists = document.querySelector('[data-style-artists]');
style.artists.forEach(([name, href]) => { const link = document.createElement('a'); link.className = 'outline-button'; link.href = href; link.textContent = name; artists.append(link); });
