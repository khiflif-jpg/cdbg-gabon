// menu.js — CDBG, version durcie (mobile-safe)
(() => {
  if (window.__cdbgMenuInit) return; // éviter doublons si script inclus 2x
  window.__cdbgMenuInit = true;

  document.addEventListener('DOMContentLoaded', () => {
    const navbar  = document.querySelector('.navbar');
    const burger  = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');
    if (!navbar || !burger || !navLinks) return;

    // Overlay (une seule fois)
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      document.body.appendChild(overlay);
    }

    // S’assurer que les 3 lignes existent
    if (!burger.querySelector('.line')) {
      burger.innerHTML = '<span class="line"></span><span class="line"></span><span class="line"></span>';
    }

    const isOpen = () => navLinks.classList.contains('active');

    const openMenu = () => {
      navLinks.classList.add('active');
      overlay.classList.add('active');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    };

    const toggleFromBurger = (e) => {
      e.stopPropagation();
      isOpen() ? closeMenu() : openMenu();
    };

    // Clic + touch (iOS)
    burger.addEventListener('click', toggleFromBurger);
    burger.addEventListener('touchstart', toggleFromBurger, { passive: true });

    // Fermer au clic dehors / overlay
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('click', (e) => {
      if (isOpen() && !navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    // Fermer sur clic d’un lien
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
      e.stopPropagation();
    });

    // Échap + resize
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
  });
})();
