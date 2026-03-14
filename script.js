/**
 * Capo Pans — Website JS
 * Dutch pancake catering website
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. YEAR ───────────────────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── 2. SCROLL-BASED HEADER ────────────────────────────────────────────
    const header = document.getElementById('header');

    const onScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        revealElements();
        setActiveNavLink();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 3. MOBILE NAV ─────────────────────────────────────────────────────
    const hamburger   = document.querySelector('.hamburger');
    const navLinks    = document.querySelector('.nav-links');
    const navCta      = document.querySelector('.nav-cta');
    const overlay     = document.getElementById('mobileOverlay');
    const navItems    = document.querySelectorAll('.nav-links a');

    function openMenu() {
        navLinks.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    if (overlay) overlay.addEventListener('click', closeMenu);

    navItems.forEach(item => item.addEventListener('click', closeMenu));

    // ── 4. SMOOTH SCROLL ──────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ── 5. REVEAL ON SCROLL ───────────────────────────────────────────────
    function revealElements() {
        const elements = document.querySelectorAll('.reveal:not(.active), .reveal-fade:not(.in)');
        const trigger  = window.innerHeight * 0.88;

        elements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < trigger) {
                if (el.classList.contains('reveal'))      el.classList.add('active');
                if (el.classList.contains('reveal-fade')) el.classList.add('in');
            }
        });
    }

    // Run on load
    revealElements();

    // ── 6. ACTIVE NAV LINK ────────────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');

    function setActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY + 120 >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            const href = a.getAttribute('href').replace('#', '');
            if (href === current) a.classList.add('active');
        });
    }

    // ── 7. FORM SUBMISSION ────────────────────────────────────────────────
    const form       = document.getElementById('enquiryForm');
    const submitBtn  = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        // Set min date to today
        const dateInput = document.getElementById('datum');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            // Simulate API call (replace with real endpoint)
            await new Promise(resolve => setTimeout(resolve, 1800));

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Success
            formStatus.textContent = '🎉 Bedankt! Uw aanvraag is ontvangen. We nemen binnen 24 uur contact met u op.';
            formStatus.className = 'form-status success';

            form.reset();

            // Hide after 6s
            setTimeout(() => {
                formStatus.style.display = 'none';
                formStatus.className = 'form-status';
            }, 6000);
        });
    }

    function validateForm() {
        const naam    = document.getElementById('naam');
        const email   = document.getElementById('email');
        const type    = document.getElementById('eventType');
        const datum   = document.getElementById('datum');

        let valid = true;

        [naam, email, type, datum].forEach(field => {
            if (!field) return;
            if (!field.value || field.value === '') {
                field.style.borderColor = '#e63946';
                field.addEventListener('input', () => field.style.borderColor = '', { once: true });
                valid = false;
            }
        });

        if (!valid) {
            formStatus.textContent = 'Vul alle verplichte velden in.';
            formStatus.className = 'form-status error';
        }

        return valid;
    }

    // ── 8. GALLERY LIGHTBOX ───────────────────────────────────────────────
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galItems      = document.querySelectorAll('.gal-item');

    galItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Fade in
            lightbox.style.opacity = '0';
            requestAnimationFrame(() => {
                lightbox.style.transition = 'opacity 0.25s ease';
                lightbox.style.opacity = '1';
            });
        });
    });

    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 250);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox)      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') closeLightbox();
    });

    // ── 9. TOPPING CARD HOVER TILT ────────────────────────────────────────
    const toppingCards = document.querySelectorAll('.topping-card, .feature-card');

    toppingCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── 10. HERO PARALLAX (subtle) ────────────────────────────────────────
    const heroBubbles = document.querySelector('.bubble-bg');
    if (heroBubbles) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBubbles.style.transform = `translateY(${y * 0.25}px)`;
            }
        }, { passive: true });
    }

    // ── 11. PANCAKE EMOJI SPRINKLE (Easter egg on logo click) ─────────────
    const logoEl = document.querySelector('.logo');
    if (logoEl) {
        logoEl.addEventListener('click', sprinklePancakes);
    }

    function sprinklePancakes() {
        const emojis = ['🥞', '🧇', '🍫', '🍓', '⭐'];
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('span');
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}vw;
                top: -2rem;
                font-size: ${1.2 + Math.random() * 1.5}rem;
                pointer-events: none;
                z-index: 9999;
                animation: fall ${1.5 + Math.random()}s ease-in forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    // Inject fall keyframes once
    if (!document.getElementById('fallKeyframes')) {
        const style = document.createElement('style');
        style.id = 'fallKeyframes';
        style.textContent = `
            @keyframes fall {
                0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

});