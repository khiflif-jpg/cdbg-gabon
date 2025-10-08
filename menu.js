/* =========================================================
   menu.js – CDBG version unifiée
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");

  if (!navbar || !burger || !navLinks) return;

  // Crée un overlay flouté si absent
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  // --- Ouvrir / fermer menu ---
  function openMenu() {
    navLinks.classList.add("active");
    overlay.classList.add("active");
    burger.classList.add("open");
    burger.textContent = "✖";
    document.body.style.overflow = "hidden"; // empêche le scroll
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
    burger.classList.remove("open");
    burger.textContent = "☰";
    document.body.style.overflow = ""; // réactive le scroll
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.contains("active") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  // Ferme le menu au clic sur un lien
  navLinks.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  // Ferme au clavier (Échap)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Ferme automatiquement si on repasse en mode desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});
