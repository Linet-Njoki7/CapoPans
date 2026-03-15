/**
 * Capo Pans — script.js
 * Interactive JS: nav, marquee gallery, lightbox, form, scroll reveals
 */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════
  // 1. YEAR
  // ══════════════════════════════════
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ══════════════════════════════════
  // 2. FLOATING NAV — scroll + active
  // ══════════════════════════════════
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    revealOnScroll();
    setActiveLink();
  }, { passive: true });

  // ══════════════════════════════════
  // 3. MOBILE NAV
  // ══════════════════════════════════
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  const navItems   = document.querySelectorAll('.nav-link');

  function openNav() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger) hamburger.addEventListener('click', () =>
  navLinks.classList.contains('open') ? closeNav() : openNav()
);
if (navOverlay) navOverlay.addEventListener('click', closeNav);
navItems.forEach(a => a.addEventListener('click', closeNav));

// Close drawer when clicking outside
document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeNav();
  }
});

  // ══════════════════════════════════
  // 4. SMOOTH SCROLL
  // ══════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    });
  });

  // ══════════════════════════════════
  // 5. ACTIVE NAV LINK
  // ══════════════════════════════════
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY + 110 >= s.offsetTop) current = s.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  // ══════════════════════════════════
  // 6. SCROLL REVEAL
  // ══════════════════════════════════
  function revealOnScroll() {
    const thresh = window.innerHeight * 0.88;
    document.querySelectorAll('.reveal:not(.active)').forEach(el => {
      if (el.getBoundingClientRect().top < thresh) el.classList.add('active');
    });
  }

  // Trigger hero reveals immediately
  setTimeout(() => {
    document.querySelectorAll('.reveal-hero').forEach(el => el.classList.add('in'));
  }, 120);

  revealOnScroll();

  // ══════════════════════════════════
  // 7. GALLERY MARQUEE BUILD + LIGHTBOX
  // ══════════════════════════════════
  const galleryItems = [
    { src: 'images/event_catering.png', alt: 'Capo Pans live kookstation bij een evenement', caption: 'Live kookstation' },
    { src: 'images/hero_pancakes.png',  alt: 'Verse goudbruine mini pannenkoekjes op een bord', caption: 'Verse mini pannenkoekjes' },
    { src: 'images/event_catering.png', alt: 'Gasten genieten van pannenkoekjes op een feest', caption: 'Gasten genieten' },
    { src: 'images/hero_pancakes.png',  alt: 'Mini pannenkoekjes met Nutella en hazelnoten', caption: 'Nutella Dream' },
    { src: 'images/event_catering.png', alt: 'Elegante Capo Pans opstelling op een bruiloft', caption: 'Bruiloft opstelling' },
    { src: 'images/hero_pancakes.png',  alt: 'Mini pannenkoekjes met verse aardbeien en slagroom', caption: 'Aardbei & Room' },
    { src: 'images/event_catering.png', alt: 'Capo Pans pancake bar op een bedrijfsevenement', caption: 'Bedrijfsevenement' },
    { src: 'images/hero_pancakes.png',  alt: 'Mini pannenkoekjes met Biscoff spread', caption: 'Biscoff Caramel' },
  ];

  const track = document.getElementById('marqueeTrack');
  if (track) {
    // Render two sets for seamless infinite loop
    [...galleryItems, ...galleryItems].forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'gal-btn';
      btn.setAttribute('aria-label', `Foto bekijken: ${item.caption}`);
      btn.dataset.src = item.src;
      btn.dataset.caption = item.caption;

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gal-btn-overlay';
      overlay.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';

      btn.appendChild(img);
      btn.appendChild(overlay);
      track.appendChild(btn);
    });

    // Lightbox on click
    track.addEventListener('click', e => {
      const btn = e.target.closest('.gal-btn');
      if (!btn) return;
      openLightbox(btn.dataset.src, btn.dataset.caption, btn.querySelector('img').alt);
    });

    // Pause marquee on hover
    const wrap = track.parentElement;
    if (wrap) {
      wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
      wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }

    // Touch drag to scroll
    let isDragging = false, startX = 0, scrollLeft = 0;
    const marqueeWrap = track.parentElement;

    if (marqueeWrap) {
      marqueeWrap.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.pageX - marqueeWrap.offsetLeft;
        scrollLeft = marqueeWrap.scrollLeft;
        track.style.animationPlayState = 'paused';
      });
      marqueeWrap.addEventListener('mouseleave', () => { isDragging = false; });
      marqueeWrap.addEventListener('mouseup', () => { isDragging = false; });
      marqueeWrap.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - marqueeWrap.offsetLeft;
        marqueeWrap.scrollLeft = scrollLeft - (x - startX);
      });
    }
  }

  // ══════════════════════════════════
  // 8. LIGHTBOX
  // ══════════════════════════════════
  const lightbox   = document.getElementById('lightbox');
  const lbBackdrop = document.getElementById('lbBackdrop');
  const lbClose    = document.getElementById('lbClose');
  const lbImg      = document.getElementById('lbImg');
  const lbCaption  = document.getElementById('lbCaption');

  function openLightbox(src, caption, alt) {
    if (!lightbox) return;
    lbImg.src = src;
    lbImg.alt = alt || caption;
    lbCaption.textContent = caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  if (lbClose)    lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  // ══════════════════════════════════
  // 9. BOOKING FORM
  // ══════════════════════════════════
  const form       = document.getElementById('enquiryForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    // Set min date to today
    const dateInput = document.getElementById('datum');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm()) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      formStatus.className = 'form-feedback';
      formStatus.style.display = 'none';

      // Replace with real API call
      await new Promise(r => setTimeout(r, 1800));

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      formStatus.textContent = '🎉 Bedankt! We nemen binnen 24 uur contact met u op.';
      formStatus.className = 'form-feedback success';
      form.reset();

      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form-feedback';
      }, 7000);
    });
  }

  function validateForm() {
    const fields = ['naam', 'femail', 'eventType', 'datum'];
    let ok = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) {
        el.classList.add('error');
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
        ok = false;
      }
    });
    if (!ok) {
      formStatus.textContent = 'Vul alle verplichte velden in.';
      formStatus.className = 'form-feedback error';
    }
    return ok;
  }

  // ══════════════════════════════════
  // 10. CRAFT CARD SUBTLE TILT
  // ══════════════════════════════════
  document.querySelectorAll('.craft-card, .t-card, .ev-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - .5;
      const y  = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-6px) perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ══════════════════════════════════
  // 11. LOGO EASTER EGG 🥞
  // ══════════════════════════════════
  const logoEl = document.querySelector('.logo');
  if (logoEl) logoEl.addEventListener('click', sprinkle);

  function sprinkle() {
    const emojis = ['🥞','🍫','🍓','⭐','🧇','🍌'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      Object.assign(el.style, {
        position: 'fixed',
        left: `${Math.random() * 100}vw`,
        top: '-2rem',
        fontSize: `${1.2 + Math.random() * 1.4}rem`,
        pointerEvents: 'none',
        zIndex: '9999',
        animation: `pancakeFall ${1.5 + Math.random() * .8}s ease-in forwards`,
        animationDelay: `${Math.random() * .4}s`,
      });
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  if (!document.getElementById('sprinkleKF')) {
    const s = document.createElement('style');
    s.id = 'sprinkleKF';
    s.textContent = `@keyframes pancakeFall {
      0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
      100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
    }`;
    document.head.appendChild(s);
  }

  // ══════════════════════════════════
  // 13. WHY-US CHECKLIST INTERACTION
  // ══════════════════════════════════
  document.querySelectorAll('.why-item').forEach(item => {
    // Click toggles active (expand description)
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all others
      document.querySelectorAll('.why-item').forEach(i => i.classList.remove('active'));
      // Toggle this one
      if (!isActive) item.classList.add('active');
    });
    // Keyboard: Enter/Space to toggle
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // ══════════════════════════════════
  // 14. INITIAL LOAD TRIGGER
  // ══════════════════════════════════
  revealOnScroll();
  setActiveLink();

});
