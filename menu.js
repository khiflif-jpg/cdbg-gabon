/* =========================================================
   menu.js – Failsafe v3 (tap garanti sur mobile)
   ========================================================= */
(function () {
  function insideRect(x, y, el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const navbar   = document.querySelector(".navbar");
    const burger   = document.getElementById("burger") || document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");
    if (!navbar || !burger || !navLinks) return;

    // --- Sécurisation z-index / clics ---
    navbar.style.zIndex = "2147483000";
    burger.style.zIndex = "2147483647";
    burger.style.pointerEvents = "auto";
    burger.style.position = burger.style.position || "relative";

    // --- Overlay unique ---
    let overlay = document.querySelector(".menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "menu-overlay";
      document.body.appendChild(overlay);
    }
    // supprime d’éventuels doublons
    document.querySelectorAll(".menu-overlay").forEach((n, i) => { if (i) n.remove(); });

    // --- Reset initial ---
    function reset() {
      navLinks.classList.remove("active","open");
      overlay.classList.remove("active");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded","false");
      document.body.style.overflow = "";
    }
    reset();

    const isOpen = () => navLinks.classList.contains("active");

    function openMenu() {
      navLinks.classList.add("active");
      overlay.classList.add("active");
      burger.classList.add("open");
      burger.setAttribute("aria-expanded","true");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded","false");
      document.body.style.overflow = "";
    }
    function toggleMenu() { isOpen() ? closeMenu() : openMenu(); }

    // --- Clic direct sur le burger (et ses enfants)
    function onBurgerClick(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    }
    burger.addEventListener("click", onBurgerClick, { passive:false });
    burger.addEventListener("pointerup", onBurgerClick, { passive:false });
    burger.addEventListener("touchend", onBurgerClick, { passive:false });

    // --- MODE ULTRA-SENSIBLE : capture globale
    function globalHitToggle(e) {
      // récupère les coords du premier contact
      const pt = e.touches ? e.touches[0] || e.changedTouches?.[0] : e;
      if (!pt) return;
      if (insideRect(pt.clientX, pt.clientY, burger)) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      }
    }
    // phase de capture = on passe AVANT un éventuel calque bloquant
    document.addEventListener("pointerdown", globalHitToggle, true);
    document.addEventListener("touchstart",  globalHitToggle, { capture:true, passive:false });

    // --- Fermer si on clique/tape ailleurs
    function closeIfOutside(e) {
      if (!isOpen()) return;
      if (e.target.closest(".nav-links") || e.target.closest("#burger") || e.target.closest(".burger")) return;
      closeMenu();
    }
    overlay.addEventListener("click", closeMenu, { passive:true });
    document.addEventListener("click", closeIfOutside, true);

    // --- Fermer sur clic d’un lien du menu
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });

    // --- Échap
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    // --- Reset quand on repasse en desktop
    window.addEventListener("resize", () => { if (window.innerWidth > 768) reset(); });
  });
})();
