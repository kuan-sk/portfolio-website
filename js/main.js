/* ========== Mobile Menu ========== */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

/* ========== Photo Data ========== */
const portraitPhotos = [
  'portrait_01.jpg','portrait_02.jpg','portrait_03.jpg',
  'portrait_04.jpg','portrait_05.jpg','portrait_06.jpg',
  'portrait_07.jpg','portrait_08.jpg','portrait_09.jpg',
  'portrait_10.jpg','portrait_11.jpg','portrait_12.jpg',
  'portrait_13.jpg','portrait_14.jpg','portrait_15.jpg',
  'portrait_16.jpg','portrait_17.jpg','portrait_18.jpg',
  'portrait_19.jpg','portrait_20.jpg','portrait_21.jpg',
  'portrait_22.jpg','portrait_23.jpg','portrait_24.jpg',
];

const campusPhotos = [
  'campus_01.jpg','campus_02.jpg','campus_03.jpg',
  'campus_04.jpg','campus_05.jpg','campus_06.jpg',
  'campus_07.jpg','campus_08.jpg','campus_09.jpg',
  'campus_10.jpg','campus_11.jpg','campus_12.jpg',
  'campus_13.jpg','campus_14.jpg','campus_15.jpg',
  'campus_16.jpg','campus_17.jpg','campus_18.jpg',
  'campus_19.jpg','campus_20.jpg','campus_21.jpg',
  'campus_22.jpg',
];

const allPhotos = [
  ...portraitPhotos.map(f => ({ file: f, cat: 'portrait', label: '人像摄影' })),
  ...campusPhotos.map(f => ({ file: f, cat: 'campus', label: '校园项目' })),
];

function getPhotoPath(photo, thumb) {
  const base = 'assets/photos/';
  if (thumb) return base + 'thumbnails/' + photo.file;
  return base + photo.cat + '/' + photo.file;
}

/* ========== Render Photo Cards ========== */
function createPhotoCard(photo, index, arrayRef) {
  const card = document.createElement('div');
  card.className = 'photo-card fade-up';
  card.setAttribute('data-cat', photo.cat);
  card.innerHTML = `
    <img src="${getPhotoPath(photo, true)}" alt="${photo.label}" loading="lazy"
         onerror="this.src='${getPhotoPath(photo, false)}'">
    <div class="photo-card-overlay">
      <span>${photo.label}</span>
    </div>
  `;
  card.addEventListener('click', () => openLightbox(index, arrayRef));
  return card;
}

/* ========== Index Page: Featured Grid ========== */
const featuredGrid = document.getElementById('featuredGrid');
if (featuredGrid) {
  // Show 6 random photos on home page
  const featured = [...allPhotos].sort(() => Math.random() - 0.5).slice(0, 6);
  featured.forEach((photo, i) => {
    featuredGrid.appendChild(createPhotoCard(photo, i, featured));
  });
}

/* ========== Gallery Page: Full Grid + Filter ========== */
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  let currentFilter = 'all';

  function renderGallery(filter) {
    galleryGrid.innerHTML = '';
    const filtered = filter === 'all'
      ? allPhotos
      : allPhotos.filter(p => p.cat === filter);

    filtered.forEach((photo, i) => {
      galleryGrid.appendChild(createPhotoCard(photo, i, filtered));
    });
    return filtered;
  }

  let activePhotos = renderGallery('all');

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePhotos = renderGallery(btn.dataset.filter);
    });
  });
}

/* ========== Lightbox ========== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxPhotos = [];
let lightboxIndex = 0;

function openLightbox(index, photos) {
  lightboxPhotos = photos;
  lightboxIndex = index;
  showImage(lightboxIndex);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showImage(i) {
  lightboxIndex = i;
  lightboxImg.src = getPhotoPath(lightboxPhotos[i], false);
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function nextImage() {
  lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
  showImage(lightboxIndex);
}

function prevImage() {
  lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
  showImage(lightboxIndex);
}

if (lightbox) {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', prevImage);
  document.getElementById('lightboxNext').addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

/* ========== Video Player ========== */
window.playVideo = function(videoId, btn) {
  const video = document.getElementById(videoId);
  if (!video) return;

  // Pause all other videos
  document.querySelectorAll('video').forEach(v => {
    if (v.id !== videoId) v.pause();
  });

  if (video.paused) {
    video.play();
    btn.style.display = 'none';
  } else {
    video.pause();
    btn.style.display = 'flex';
  }

  video.addEventListener('pause', () => { btn.style.display = 'flex'; });
  video.addEventListener('play', () => { btn.style.display = 'none'; });
  video.addEventListener('ended', () => { btn.style.display = 'flex'; });
};

/* ========== Scroll Animation ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => {
  observer.observe(el);
});
