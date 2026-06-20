/**
 * OriPlast — Landing Page Interactions
 */

(function () {
  'use strict';

  /* ── Smooth Kinetic Scroll Enhancement ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      });
    });
  }

  /* ── Navbar Scroll State ── */
  function initNavbar() {
    const navbar = document.querySelector('.glass-nav');
    let ticking = false;

    function updateNavbar() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Mobile Menu ── */
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menu.classList.toggle('hidden', !isOpen);
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
    });
  }

  function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    menu.classList.remove('open');
    menu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-up');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ── Counter Animation ── */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const animated = new Set();

    function animateCounter(el) {
      if (animated.has(el)) return;
      animated.add(el);

      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 2000;
      const start = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = easeOutQuart(progress) * target;

        el.textContent = decimals > 0
          ? value.toFixed(decimals) + suffix
          : Math.floor(value) + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = decimals > 0
            ? target.toFixed(decimals) + suffix
            : Math.floor(target) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('counter')) {
              animateCounter(entry.target);
            } else {
              entry.target.querySelectorAll('.counter').forEach(animateCounter);
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ── Testimonial Slider ── */
  function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!slides.length) return;

    let current = 0;
    let intervalId;

    function goTo(index) {
      current = index;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.slide, 10));
        clearInterval(intervalId);
        intervalId = setInterval(next, 6000);
      });
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      intervalId = setInterval(next, 6000);
    }
  }

  /* ── 3D Tilt Effect on Cards ── */
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || window.matchMedia('(max-width: 768px)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;

        const glow = card.querySelector('.bento-glow');
        if (glow) {
          glow.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          glow.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  /* ── Magnetic Button Effect ── */
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || window.matchMedia('(max-width: 768px)').matches) return;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ── Contact Form ── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('.btn-text');
      const originalText = btnText.textContent;

      btnText.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btnText.textContent = originalText;
        btn.disabled = false;
        successMsg.classList.remove('hidden');
        form.reset();

        setTimeout(() => {
          successMsg.classList.add('hidden');
        }, 5000);
      }, 1200);
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initTiltCards();
    initMagneticButtons();
    initTestimonialSlider();
    initContactForm();
  });
})();
