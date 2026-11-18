const artistProfiles = {
  amaury: {
    name: 'Amaury', specialty: 'Realism · Cover up', folder: 'amaury',
    images: ['photo_2026-11-18_22-08-45.jpg','photo_2026-11-18_22-08-48.jpg','photo_2026-11-18_22-08-53.jpg','photo_2026-11-18_22-08-54.jpg','photo_2026-11-18_22-08-56.jpg','photo_2026-11-18_22-09-29.jpg','photo_2026-11-18_22-09-32.jpg']
  },
  bee: {
    name: 'Bee', specialty: 'Realism · Mini color · Anime', folder: 'Bee',
    images: ['photo_2026-11-18_22-13-34.jpg','photo_2026-11-18_22-13-36.jpg','photo_2026-11-18_22-13-38.jpg','photo_2026-11-18_22-13-43.jpg','photo_2026-11-18_22-13-52.jpg','photo_2026-11-18_22-13-54.jpg']
  },
  kimiko: {
    name: 'Kimiko', specialty: 'X-ray · Fine line · Floral', folder: 'Kimiko',
    images: ['photo_2026-11-18_22-12-08.jpg','photo_2026-11-18_22-12-10.jpg','photo_2026-11-18_22-12-13.jpg','photo_2026-11-18_22-12-14.jpg','photo_2026-11-18_22-12-16.jpg','photo_2026-11-18_22-12-18.jpg','photo_2026-11-18_22-12-20.jpg','photo_2026-11-18_22-12-51.jpg']
  },
  tea: {
    name: 'Tea', specialty: 'Black & grey · Realism', folder: 'Tea',
    images: ['photo_2026-11-18_22-14-18.jpg','photo_2026-11-18_22-14-20.jpg','photo_2026-11-18_22-14-22.jpg','photo_2026-11-18_22-14-24.jpg','photo_2026-11-18_22-14-26.jpg','photo_2026-11-18_22-14-27.jpg','photo_2026-11-18_22-14-29.jpg']
  },
  thea: {
    name: 'Thea', specialty: 'Fine line · Floral · Ornamental', folder: 'Thea',
    images: ['photo_2026-11-18_22-10-24.jpg','photo_2026-11-18_22-10-26.jpg','photo_2026-11-18_22-10-28.jpg','photo_2026-11-18_22-10-30.jpg','photo_2026-11-18_22-10-32.jpg','photo_2026-11-18_22-10-38.jpg','photo_2026-11-18_22-10-46.jpg','photo_2026-11-18_22-10-48.jpg','photo_2026-11-18_22-10-50.jpg']
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
  button.append(image);
  gallery.append(button);
});
