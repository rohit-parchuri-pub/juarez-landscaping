// ============ Mobile nav toggle ============
const menuBtn = document.querySelector('.nav__menu-btn');
const navLinks = document.querySelector('.nav__links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ============ Fade-in on scroll ============
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============ Gallery filtering ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ============ Lightbox ============
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightbox-media');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxLoc = document.getElementById('lightbox-loc');

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const media = card.querySelector('.project-card__media').innerHTML;
    lightboxMedia.innerHTML = media;
    lightboxTitle.textContent = card.dataset.title;
    lightboxDesc.textContent = card.dataset.desc;
    lightboxLoc.textContent = card.dataset.loc;
    lightbox.classList.add('open');
  });
});

document.querySelectorAll('[data-lightbox-close]').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target === el) lightbox.classList.remove('open');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// ============ Service area map (Leaflet) ============
function initServiceMap() {
  const mapEl = document.getElementById('service-map');
  if (!mapEl || typeof L === 'undefined') return;

  const center = [35.4787, -86.0892]; // Manchester, TN
  const map = L.map('service-map', { scrollWheelZoom: false }).setView(center, 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  L.marker(center).addTo(map).bindPopup('<strong>Juarez Landscaping &amp; Nursery</strong><br>Manchester, TN');

  const radiusMeters = 100 * 1609.34; // 100 miles
  const serviceCircle = L.circle(center, {
    radius: radiusMeters,
    color: '#2d6a4f',
    fillColor: '#4f9c74',
    fillOpacity: 0.12,
    weight: 2
  }).addTo(map);

  map.fitBounds(serviceCircle.getBounds());
}
document.addEventListener('DOMContentLoaded', initServiceMap);

// ============ Quote form -> mailto ============
const quoteForm = document.getElementById('quote-form');
const toast = document.getElementById('toast');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = quoteForm.name.value.trim();
    const phone = quoteForm.phone.value.trim();
    const email = quoteForm.email.value.trim();
    const address = quoteForm.address.value.trim();
    const contactMethod = quoteForm.querySelector('input[name="contact-method"]:checked');
    const message = quoteForm.message.value.trim();
    const services = Array.from(quoteForm.querySelectorAll('input[name="service"]:checked')).map(i => i.value);

    if (!name || !phone || !email) {
      showToast('Please fill in your name, phone, and email.');
      return;
    }

    const lines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Property Address / City: ${address || 'N/A'}`,
      `Services Requested: ${services.length ? services.join(', ') : 'Not specified'}`,
      `Preferred Contact Method: ${contactMethod ? contactMethod.value : 'No preference'}`,
      '',
      'Project Details:',
      message || '(none provided)'
    ];

    const subject = encodeURIComponent(`Quote Request — ${name}`);
    const body = encodeURIComponent(lines.join('\n'));
    const mailtoAddress = 'marinojuarez1984@gmail.com';

    window.location.href = `mailto:${mailtoAddress}?subject=${subject}&body=${body}`;
    showToast('Opening your email client to send the request…');
  });
}

// ============ Footer year ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
