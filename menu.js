// ============================================================
//  MENU.JS — version fluide et accessible CDBG
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  let menuOpen = false;

  // === Fonction d'ouverture / fermeture du menu ===
  const toggleMenu = () => {
    menuOpen = !menuOpen;
    navLinks.classList.toggle("active", menuOpen);
    burger.textContent = menuOpen ? "✖" : "☰";
    burger.setAttribute("aria-expanded", menuOpen);
  };

  // === Clique sur le burger ===
  if (burger && navLinks) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // === Fermer le menu si clic en dehors ===
  document.addEventListener("click", (e) => {
    if (
      menuOpen &&
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      e.target !== burger
    ) {
      toggleMenu();
    }
  });

  // === Fermer le menu après clic sur un lien ===
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuOpen) toggleMenu();
    });
  });

  // === Accessibilité clavier ===
  burger.setAttribute("role", "button");
  burger.setAttribute("tabindex", "0");
  burger.setAttribute("aria-label", "Menu principal");
  burger.setAttribute("aria-expanded", "false");

  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // === Animation fluide ===
  navLinks.style.transition = "all 0.3s ease-in-out";
});
