/* ==========================================================
   news.js – Gestion des articles statiques (FR + EN)
   ========================================================== */

function injectStaticArticles(lang = "fr", container, limit = false) {
  if (!container) return;

  const articles = [
    {
      lang: "fr",
      title: "Le Gabon renforce sa politique forestière",
      description: "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières. Conscient des enjeux environnementaux et économiques, le gouvernement gabonais intensifie sa lutte contre l’exploitation illégale du bois et la déforestation.",
      img: "article1.avif",
      link: "article-full-fr.html",
      date: "2025-10-06"
    },
    {
      lang: "en",
      title: "Gabon strengthens its forest policy",
      description: "With nearly 88% of its territory covered by equatorial forests, Gabon is emerging as a leading African country in sustainable forest resource management. The government is stepping up efforts to combat illegal logging and deforestation.",
      img: "article1.avif",
      link: "article-full-en.html",
      date: "2025-10-06"
    }
  ];

  const filtered = articles.filter(a => a.lang === lang);
  const toDisplay = limit ? filtered.slice(0, limit) : filtered;
  container.innerHTML = "";

  toDisplay.forEach(article => {
    const card = document.createElement("a");
    card.href = article.link;
    card.className = "news-card";
    const dateObj = new Date(article.date);
    const formattedDate = dateObj.toLocaleDateString(lang, {
      year: "numeric", month: "long", day: "numeric"
    });

    card.innerHTML = `
      <div class="news-image">
        <picture>
          <source type="image/avif" srcset="${article.img}">
          <img src="${article.img}" alt="${article.title}">
        </picture>
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <p class="news-desc">${article.description}</p>
        <div class="news-meta">${formattedDate}</div>
      </div>
    `;
    container.appendChild(card);
  });

  if (!toDisplay.length) {
    container.innerHTML = `<p style="text-align:center;color:#666;">${lang === "fr" ? "Aucun article pour le moment." : "No articles available yet."}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container = document.getElementById("news-fr") || document.getElementById("news-container");

  if (lang === "fr") injectStaticArticles("fr", container);
  if (lang === "en") injectStaticArticles("en", container);
});
