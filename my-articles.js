// ARTICLES STATIQUES
const myArticlesFR = [
  {
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...</p>
      <p>Le 19 août 2025, deux embarcations ont été remises au ministère des Eaux et Forêts, grâce à l’ONG The Nature Conservancy dans le cadre du programme CAFI...</p>
      <p><strong>🤝 La CDBG, un acteur pleinement engagé</strong><br>
      Déjà certifiée PAFC, la Compagnie des Bois du Gabon adhère pleinement à la politique nationale de traçabilité (SNTBG), garantissant la légalité et la durabilité de ses produits bois.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const myArticlesEN = [
  {
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html",
    description: `
      <p>Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...</p>
      <p>On August 19, 2025, two patrol boats were donated to the Ministry of Water and Forests via TNC and the CAFI program, to enhance river surveillance against illegal logging.</p>
      <p><strong>🤝 CDBG, a Committed Partner</strong><br>
      Already PAFC certified, Compagnie des Bois du Gabon (CDBG) fully supports the national traceability system (SNTBG), ensuring legality and sustainability.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// FONCTION D’INJECTION DES ARTICLES
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;

  articles.forEach(article => {
    const card = document.createElement("a");
    card.href = article.link;
    card.className = "news-card";
    card.style.textDecoration = "none"; // pour désactiver le soulignement
    card.style.color = "inherit"; // pour hériter de la couleur du texte
    card.innerHTML = `
      <div class="news-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <div class="news-desc">${article.description}</div>
        <div class="news-meta">${new Date(article.pubDate).toLocaleDateString(
          lang === "fr" ? "fr-FR" : "en-US",
          { year: "numeric", month: "short", day: "numeric" }
        )}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// STYLE MINIMAL POUR LES ARTICLES
if (!document.getElementById("my-articles-style")) {
  const style = document.createElement("style");
  style.id = "my-articles-style";
  style.textContent = `
    .news-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      margin-bottom: 20px;
    }
    .news-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    }
    .news-image {
      width: 100%;
      height: 250px;
      overflow: hidden;
    }
    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .news-content {
      padding: 15px;
      display: flex;
      flex-direction: column;
    }
    .news-title {
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0 0 10px;
    }
    .news-desc {
      font-size: 0.95rem;
      color: #555;
    }
    .news-meta {
      font-size: 0.8rem;
      color: #999;
      margin-top: auto;
    }
  `;
  document.head.appendChild(style);
}
