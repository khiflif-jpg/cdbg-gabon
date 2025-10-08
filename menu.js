/* =========================================================
   menu.js – Version premium CDBG (vert + or)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");

  if (!navbar || !burger || !navLinks) return;

  // === Crée un overlay vert semi-transparent si absent ===
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  // === Ouvrir / fermer le menu ===
  function openMenu() {
    navLinks.classList.add("active");
    overlay.classList.add("active");
    burger.classList.add("open");
    document.body.style.overflow = "hidden"; // bloque le scroll
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
    burger.classList.remove("open");
    document.body.style.overflow = ""; // réactive le scroll
  }

  // === Clic sur le burger ===
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains("active")) closeMenu();
    else openMenu();
  });

  // === Ferme dès qu’on clique ailleurs (hypersensible) ===
  document.addEventListener("click", (e) => {
    const clickInsideMenu = navLinks.contains(e.target);
    const clickOnBurger = burger.contains(e.target);
    const clickOnOverlay = overlay.contains(e.target);
    const menuOpen = navLinks.classList.contains("active");

    if (menuOpen && !clickInsideMenu && !clickOnBurger && !clickOnOverlay) {
      closeMenu();
    }
  });

  // === Ferme le menu quand on clique sur un lien ===
  navLinks.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  // === Ferme avec la touche Échap ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // === Réinitialise si on repasse en desktop ===
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
});
