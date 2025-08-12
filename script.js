// ====== Mobile menu ======
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const isOpen = navMenu.classList.contains('mobile-open');
    mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'A') {
      navMenu.classList.remove('mobile-open');
      mobileMenuBtn.textContent = '☰';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ====== Smooth scroll with fixed-header offset ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const hash = this.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
});

// ====== Header shadow on scroll & progress bar ======
const header = document.querySelector('.header');
const progress = document.getElementById('scrollProgress');
const onScroll = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  if (progress) {
    const h = document.documentElement;
    const s = h.scrollTop || document.body.scrollTop;
    const d = h.scrollHeight - h.clientHeight;
    const p = d > 0 ? (s / d) * 100 : 0;
    progress.style.width = `${p}%`;
  }
};
window.addEventListener('scroll', onScroll);
onScroll();

// ====== Services accordion ======
window.toggleService = function (headerBtn) {
  const item = headerBtn.closest('.service-item');
  const toggle = headerBtn.querySelector('.service-toggle');

  document.querySelectorAll('.service-item').forEach(other => {
    if (other !== item && other.classList.contains('active')) {
      other.classList.remove('active');
      const btn = other.querySelector('.service-header');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  const isActive = item.classList.toggle('active');
  headerBtn.setAttribute('aria-expanded', String(isActive));
};

// ====== Reveal on scroll ======
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ====== Decorative parallax (desktop only) ======
const decor = document.querySelectorAll('.decor [data-depth]');
const parallax = (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  const x = (e.clientX - w / 2) / (w / 2);
  const y = (e.clientY - h / 2) / (h / 2);
  decor.forEach(el => {
    const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
    el.style.transform = `translate(${x * depth * 16}px, ${y * depth * 12}px)`;
  });
};
const enableParallax = () => {
  if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', parallax);
  }
};
enableParallax();

// ====== Tilt effect hint (lightweight) ======
document.querySelectorAll('.tilt').forEach(card => {
  if (!window.matchMedia('(hover: hover)').matches) return;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const rx = (e.clientY - r.top - r.height / 2) / r.height;
    const ry = (e.clientX - r.left - r.width / 2) / r.width;
    card.style.transform = `rotateX(${(-rx * 4).toFixed(2)}deg) rotateY(${(ry * 6).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ====== Booking modal ======
const modal = document.getElementById('bookingModal');
function openBookingModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modal.setAttribute('aria-hidden', 'false');
}
function closeBookingModal() {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  modal.setAttribute('aria-hidden', 'true');
}
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;

if (modal) {
  modal.addEventListener('click', (e) => { if (e.target.id === 'bookingModal') closeBookingModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBookingModal(); });
}

// ====== Contact form (demo only) ======
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (document.getElementById('honey').value) return; // spam honeypot

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Thank you! Your message has been sent. We'll get back to you within 24 hours.");
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1200);
  });

  // field UX
  document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('invalid', function (e) {
      e.preventDefault();
      this.style.borderColor = '#D1D9E6';
      if (this.validity.valueMissing) this.setCustomValidity('This field is required.');
      else if (this.validity.typeMismatch && this.type === 'email') this.setCustomValidity('Please enter a valid email address.');
      else this.setCustomValidity('');
    });
    field.addEventListener('input', function () {
      this.setCustomValidity('');
      this.style.borderColor = 'var(--stroke)';
    });
  });
}
