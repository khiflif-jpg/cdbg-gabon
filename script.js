// Sélection des éléments
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Fonction pour ouvrir/fermer le menu
function toggleMenu() {
  hamburger.classList.toggle('active');  // Animation du hamburger
  navMenu.classList.toggle('active');    // Affiche/masque le menu
}

// Événement sur le clic du hamburger
hamburger.addEventListener('click', toggleMenu);

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
