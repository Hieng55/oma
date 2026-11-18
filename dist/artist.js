const artistProfiles = {
  amaury: {
    name: 'Amaury', specialty: 'Realism · Cover up', folder: 'amaury',
    images: ['photo_2026-11-18_22-08-45.webp','photo_2026-11-18_22-08-48.webp','photo_2026-11-18_22-08-53.webp','photo_2026-11-18_22-08-54.webp','photo_2026-11-18_22-08-56.webp','photo_2026-11-18_22-09-29.webp','photo_2026-11-18_22-09-32.webp']
  },
  bee: {
    name: 'Bee', specialty: 'Realism · Mini color · Anime', folder: 'Bee',
    images: ['photo_2026-11-18_22-13-34.webp','photo_2026-11-18_22-13-36.webp','photo_2026-11-18_22-13-38.webp','photo_2026-11-18_22-13-43.webp','photo_2026-11-18_22-13-52.webp','photo_2026-11-18_22-13-54.webp']
  },
  kimiko: {
    name: 'Kimiko', specialty: 'X-ray · Fine line · Floral', folder: 'Kimiko',
    images: ['photo_2026-11-18_22-12-08.webp','photo_2026-11-18_22-12-10.webp','photo_2026-11-18_22-12-13.webp','photo_2026-11-18_22-12-14.webp','photo_2026-11-18_22-12-16.webp','photo_2026-11-18_22-12-18.webp','photo_2026-11-18_22-12-20.webp','photo_2026-11-18_22-12-51.webp']
  },
  tea: {
    name: 'Tea', specialty: 'Black & grey · Realism', folder: 'Tea',
    images: ['photo_2026-11-18_22-14-18.webp','photo_2026-11-18_22-14-20.webp','photo_2026-11-18_22-14-22.webp','photo_2026-11-18_22-14-24.webp','photo_2026-11-18_22-14-26.webp','photo_2026-11-18_22-14-27.webp','photo_2026-11-18_22-14-29.webp']
  },
  thea: {
    name: 'Thea', specialty: 'Fine line · Floral · Ornamental', folder: 'Thea',
    images: ['photo_2026-11-18_22-10-24.webp','photo_2026-11-18_22-10-26.webp','photo_2026-11-18_22-10-28.webp','photo_2026-11-18_22-10-30.webp','photo_2026-11-18_22-10-32.webp','photo_2026-11-18_22-10-38.webp','photo_2026-11-18_22-10-46.webp','photo_2026-11-18_22-10-48.webp','photo_2026-11-18_22-10-50.webp']
  }
};

const artistKey = document.body.dataset.artist || new URLSearchParams(window.location.search).get('artist')?.toLowerCase();
const artist = artistProfiles[artistKey] || artistProfiles.amaury;
const artistPath = (file) => `assets/artists/${artist.folder}/${file}`;

document.title = `${artist.name} | OMA Tattoo Artist`;
document.querySelectorAll('[data-artist-name]').forEach((element) => { element.textContent = artist.name; });
document.querySelector('[data-artist-specialty]').textContent = artist.specialty;
document.querySelectorAll('[data-artist-book]').forEach((link) => { link.href = `booking.html?artist=${encodeURIComponent(artist.name)}`; });

const cover = document.querySelector('[data-artist-cover]');
const coverSource = artistPath(artist.images[0]);
cover.src = coverSource;
cover.alt = `${artist.name} tattoo artist at OMA Tattoo`;
cover.fetchPriority = 'high';
cover.decoding = 'async';
cover.parentElement.style.setProperty('--profile-cover', `url("${coverSource}")`);

const gallery = document.querySelector('[data-artist-gallery]');
artist.images.slice(1).forEach((file, index) => {
  const button = document.createElement('button');
  button.className = 'portfolio-item';
  button.type = 'button';
  button.dataset.gallerySrc = artistPath(file);
  button.dataset.galleryLabel = `${artist.name} · Work ${index + 1}`;
  const image = document.createElement('img');
  image.src = artistPath(file);
  image.alt = `Tattoo work by ${artist.name}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  button.append(image);
  gallery.append(button);
});
