// =================== MENU HAMBURGER ===================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// =================== HEADER SCROLL ===================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if(window.scrollY > 100) {
    header.style.background = 'rgba(249, 249, 249, 0.98)';
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.background = 'rgba(249, 249, 249, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// =================== ANIMATIONS AU SCROLL ===================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// =================== FONDU AU CHARGEMENT ===================
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
});
