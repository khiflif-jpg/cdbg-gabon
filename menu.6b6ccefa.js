// === CDBG MENU BURGER (corrigé sans modifier le rendu) ===
// Restaure la fonctionnalité du bouton des 3 barres

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (!burger || !navLinks) {
    console.warn("⚠️ Éléments du menu introuvables");
    return;
  }

  // Sécurise la zone cliquable
  burger.style.cursor = "pointer";
  burger.style.pointerEvents = "auto";
  burger.style.zIndex = "9999";
  navLinks.style.zIndex = "9998";

  // Ouvre/ferme le menu mobile
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    burger.classList.toggle("active");
    navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  // Ferme le menu en cliquant ailleurs
  document.addEventListener("click", (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      burger.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  // Ferme le menu quand on clique sur un lien
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  // Accessibilité clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      burger.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  console.info("✅ Menu CDBG initialisé avec succès");
});
