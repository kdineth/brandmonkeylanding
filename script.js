document.addEventListener('DOMContentLoaded', () => {

  // --- Header shadow on scroll ---
  const header = document.getElementById('pageHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Scroll progress bar ---
  const scrollProgress = document.getElementById('scrollProgress');
  const body = document.body;
  const html = document.documentElement;
  window.addEventListener('scroll', () => {
    const totalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - window.innerHeight;
    const scrollPercentage = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = `${scrollPercentage}%`;
  });
  
  // --- Mobile menu toggle ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const isExpanded = navMenu.classList.contains('mobile-open');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
  });

  // --- Services accordion ---
  const serviceHeaders = document.querySelectorAll('.service-header');
  serviceHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const serviceItem = header.parentElement;
      const wasActive = serviceItem.classList.contains('active');
      
      // Optional: close all others when one is opened
      document.querySelectorAll('.service-item').forEach(item => item.classList.remove('active'));
      
      if (!wasActive) {
        serviceItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      } else {
         header.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Booking Modal Logic ---
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookBtns = [
      document.getElementById('navBookBtn'),
      document.getElementById('heroBookBtn'),
      document.getElementById('ctaBookBtn'),
      document.getElementById('footerBookBtn')
  ];

  const openBookingModal = () => {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeBookingModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  bookBtns.forEach(btn => {
    if(btn) btn.addEventListener('click', (e) => {
      // If it's a link, prevent default jump and open modal
      if (btn.tagName === 'A') {
          e.preventDefault();
      }
      openBookingModal();
    });
  });
  
  if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  
  // Close modal by clicking outside of it
  bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
          closeBookingModal();
      }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
          closeBookingModal();
      }
  });


  // --- NEW: Intersection Observer for scroll animations ---
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null, // observes intersections relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    observer.observe(el);
  });

});
