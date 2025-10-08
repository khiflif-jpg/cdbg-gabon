/* =========================================================
   menu.js – CDBG mobile menu (robuste & hypersensible)
   ========================================================= */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const navbar   = document.querySelector(".navbar");
    const burger   = document.getElementById("burger") || document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    if (!navbar || !burger || !navLinks) return;

    // Accessibilité + z-index de sécurité
    if (!burger.hasAttribute("role")) burger.setAttribute("role", "button");
    burger.setAttribute("aria-label", "Menu");
    burger.setAttribute("aria-controls", "nav-menu");
    if (!navLinks.id) navLinks.id = "nav-menu";
    navbar.style.zIndex = "10000";
    burger.style.zIndex = "10002";
    burger.style.pointerEvents = "auto";

    // Overlay unique
    let overlay = document.querySelector(".menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "menu-overlay";
      document.body.appendChild(overlay);
    }
    // supprime les overlays en double si existants
    document.querySelectorAll(".menu-overlay").forEach((el, i) => { if (i > 0) el.remove(); });

    // État sain au chargement
    function reset() {
      navLinks.classList.remove("active", "open");
      overlay.classList.remove("active");
      overlay.style.pointerEvents = "none";
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    reset();

    const isOpen = () => navLinks.classList.contains("active");

    function openMenu() {
      navLinks.classList.add("active");
      overlay.classList.add("active");
      overlay.style.pointerEvents = "all";     // fonctionne même si le CSS manque
      burger.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      if (!isOpen()) return;
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
      overlay.style.pointerEvents = "none";
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      try { burger.focus(); } catch (_) {}
    }

    // Toggle : capte click/tap sur le burger ET ses enfants (hitbox fiable)
    function handleToggle(e) {
      if (burger.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();   // évite fermeture immédiate par le handler global
        isOpen() ? closeMenu() : openMenu();
      }
    }
    ["pointerup", "touchend", "click"].forEach(evt => {
      navbar.addEventListener(evt, handleToggle, { passive: false });
    });

    // Fermeture hypersensible : overlay + n’importe où hors menu/burger
    ["pointerup", "touchend", "click"].forEach(evt => {
      overlay.addEventListener(evt, closeMenu, { passive: true });
      document.addEventListener(evt, (e) => {
        if (!isOpen()) return;
        if (navLinks.contains(e.target) || burger.contains(e.target)) return;
        closeMenu();
      }, { passive: true });
    });

    // Fermer quand on clique un lien du menu
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeMenu();
    });

    // Échap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Repassage desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) reset();
    });
  });
})();
