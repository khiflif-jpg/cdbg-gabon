// === MENU BURGER INTERACTIF (CDBG) ===
// Compatible desktop, mobile, tablettes et autres scripts async.

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links li a");

  if (!burger || !navLinks) {
    console.warn("⚠️ Burger ou navigation introuvable dans le DOM");
    return;
  }

  // Ouverture / fermeture du menu mobile
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    burger.classList.toggle("active");
    navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  // Ferme le menu quand on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
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

  // Accessibilité clavier : ESC pour fermer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      burger.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  // Sécurité visuelle : empêche les overlays ou autres scripts de bloquer le clic
  burger.style.cursor = "pointer";
  burger.style.zIndex = "9999";

  console.info("✅ Menu burger initialisé avec succès");
});
