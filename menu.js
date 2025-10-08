/* =========================================================
   menu.js – version ultra-robuste (click burger garanti)
   ========================================================= */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const navbar   = document.querySelector(".navbar");
    const burger   = document.getElementById("burger") || document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    if (!navbar || !burger || !navLinks) return;

    // Overlay unique
    let overlay = document.querySelector(".menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "menu-overlay";
      document.body.appendChild(overlay);
    }
    // Nettoyage doublons overlay
    document.querySelectorAll(".menu-overlay").forEach((el, i) => { if (i > 0) el.remove(); });

    // État sain
    function reset() {
      navLinks.classList.remove("active", "open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    reset();

    // Accessibilité + styles de sécurité (au cas où le CSS soit absent/overridé)
    burger.setAttribute("role", "button");
    burger.setAttribute("aria-label", "Menu");
    burger.setAttribute("aria-controls", "nav-menu");
    if (!navLinks.id) navLinks.id = "nav-menu";
    navbar.style.zIndex = "2147483000";      // super haut
    burger.style.zIndex = "2147483647";      // TOUT en dessous
    burger.style.pointerEvents = "auto";
    burger.style.position = "relative";

    const isOpen = () => navLinks.classList.contains("active");

    function openMenu() {
      navLinks.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      burger.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }

    // === TOGGLE BURGER : on écoute directement le bouton (et ses enfants)
    function onToggle(e) {
      if (!burger.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      isOpen() ? closeMenu() : openMenu();
    }
    // iOS/Android + desktop : on couvre tous les cas
    ["pointerup","touchend","click"].forEach(evt => {
      burger.addEventListener(evt, onToggle, { passive: false });
    });

    // === Fermer si on clique/tape hors menu
    ["pointerup","touchend","click"].forEach(evt => {
      overlay.addEventListener(evt, closeMenu, { passive: true });
      document.addEventListener(evt, (e) => {
        if (!isOpen()) return;
        if (navLinks.contains(e.target) || burger.contains(e.target)) return;
        closeMenu();
      }, { passive: true });
    });

    // === Fermer après clic sur un lien du menu
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeMenu();
    });

    // Reset en desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) reset();
    });
  });
})();
