// ===============================
//  MENU BURGER – CDBG GABON
// ===============================
// Gère l’ouverture/fermeture du menu burger (accessible & fluide)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.querySelector(".nav-links");
  if (!burger || !nav) return;

  function openNav() {
    nav.classList.add("active");
    document.body.classList.add("nav-open");
    burger.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    nav.classList.remove("active");
    document.body.classList.remove("nav-open");
    burger.setAttribute("aria-expanded", "false");
  }
  function toggleNav() {
    if (nav.classList.contains("active")) {
      closeNav();
      burger.textContent = "☰";
    } else {
      openNav();
      burger.textContent = "✖";
    }
  }

  // Click bouton
  burger.addEventListener("click", toggleNav);

  // Fermer au clic sur un lien
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

  // Fermer avec Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Accessibilité
  burger.setAttribute("tabindex", "0");
  burger.setAttribute("aria-label", "Menu principal");
  burger.setAttribute("aria-expanded", "false");
  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleNav();
    }
  });
});
