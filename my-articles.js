// ================================
// ARTICLES STATIQUES
// ================================
const myArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...</p>
      <p>Le 19 août 2025, deux embarcations ont été remises au ministère des Eaux et Forêts, grâce à l’ONG The Nature Conservancy dans le cadre du programme CAFI...</p>
      <p><strong>🤝 La CDBG, un acteur pleinement engagé</strong><br>
      Déjà certifiée PAFC, la Compagnie des Bois du Gabon adhère pleinement à la politique nationale de traçabilité (SNTBG), garantissant la légalité et la durabilité de ses produits bois.</p>
      <p><strong>📌 En conclusion</strong><br>
      Une filière bois moderne et durable est en marche, soutenue par la CDBG en harmonie avec les réformes nationales.</p>
    `,
    image: "article1.avif",
    pubDate: "2025-10-05T10:00:00Z"
  }
];

const myArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    description: `
      <p>Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...</p>
      <p>On August 19, 2025, two patrol boats were donated to the Ministry of Water and Forests via TNC and the CAFI program, to enhance river surveillance against illegal logging.</p>
      <p><strong>🤝 CDBG, a Committed Partner</strong><br>
      Already PAFC certified, Compagnie des Bois du Gabon (CDBG) fully supports the national traceability system (SNTBG), ensuring legality and sustainability.</p>
      <p><strong>📌 Conclusion</strong><br>
      A modern, transparent timber sector is emerging—CDBG is at its core, aligned with national reforms.</p>
    `,
    image: "article1.avif",
    pubDate: "2025-10-05T10:00:00Z"
  }
];

// ================================
// INJECTION DE LA LISTE DES ARTICLES
// ================================
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;

  if (!container) return;

  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "news-card";

    const fullLink = lang === "fr" ? `articles-français.html#${article.id}` : `articles-anglais.html#${article.id}`;

    card.innerHTML = `
      <a href="${fullLink}" class="news-link">
        <div class="news-image">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${article.title}</h3>
          <div class="news-desc">${article.description}</div>
          <div class="news-meta">${new Date(article.pubDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
            year: "numeric", month: "short", day: "numeric"
          })}</div>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
}

// ================================
// INJECTION DU CONTENU COMPLET
// ================================
function injectFullArticle(lang) {
  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;
  const container = document.querySelector(".article-container");

  if (!container) return;

  const hash = window.location.hash.replace("#", "");
  const article = articles.find(a => a.id === hash) || articles[0];

  container.innerHTML = `
    <img src="${article.image}" alt="${article.title}" style="width:100%; height:auto; margin-bottom:20px;" />
    <h1>${article.title}</h1>
    ${article.description}
  `;
}
