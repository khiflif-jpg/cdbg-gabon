/* =========================================================
   menu.js – CDBG version unifiée (blindée)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const navbar  = document.querySelector(".navbar");
  const burger  = document.getElementById("burger");
  const navLinks= document.querySelector(".nav-links");
  if (!navbar || !burger || !navLinks) return;

  // Overlay unique
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  // État sain au chargement (au cas où un autre script ait laissé le menu ouvert)
  document.querySelectorAll(".menu-overlay").forEach(o => o.classList.remove("active"));
  navLinks.classList.remove("active","open");
  burger.classList.remove("open");
  document.body.style.overflow = "";

  // Sécurité z-index
  navbar.style.zIndex = "10000";

  function openMenu(){
    navLinks.classList.add("active");
    overlay.classList.add("active");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded","true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded","false");
    document.body.style.overflow = "";
  }

  // Toggle
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    (navLinks.classList.contains("active") ? closeMenu : openMenu)();
  });

  // Hyper-sensible : fermer au moindre clic/touch hors menu
  ["click","touchstart"].forEach(evt => {
    overlay.addEventListener(evt, closeMenu, { passive: true });
    document.addEventListener(evt, (e) => {
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
    }, { passive: true });
  });

  // Fermer quand on clique un lien du menu
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

  // Repassage desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});
