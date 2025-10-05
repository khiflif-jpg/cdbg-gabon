// ARTICLES STATIQUES
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html", // lien vers page complète
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...</p>
      <p>Le 19 août 2025, deux embarcations ont été remises au ministère des Eaux et Forêts, grâce à l’ONG The Nature Conservancy dans le cadre du programme CAFI...</p>
      <p><strong>🤝 La CDBG, un acteur pleinement engagé</strong><br>
      Déjà certifiée PAFC, la Compagnie des Bois du Gabon adhère pleinement à la politique nationale de traçabilité (SNTBG), garantissant la légalité et la durabilité de ses produits bois.</p>
      <p><strong>📌 En conclusion</strong><br>
      Une filière bois moderne et durable est en marche, soutenue par la CDBG en harmonie avec les réformes nationales.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const staticArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html", // lien vers page complète
    description: `
      <p>Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...</p>
      <p>On August 19, 2025, two patrol boats were donated to the Ministry of Water and Forests via TNC and the CAFI program, to enhance river surveillance against illegal logging.</p>
      <p><strong>🤝 CDBG, a Committed Partner</strong><br>
      Already PAFC certified, Compagnie des Bois du Gabon (CDBG) fully supports the national traceability system (SNTBG), ensuring legality and sustainability.</p>
      <p><strong>📌 Conclusion</strong><br>
      A modern, transparent timber sector is emerging—CDBG is at its core, aligned with national reforms.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// INJECTION DES ARTICLES STATIQUES DANS LE CONTENEUR
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;

  articles.forEach(article => {
    const card = document.createElement("a");
    card.className = "article-card";
    card.href = article.link; // lien vers page complète
    card.innerHTML = `
      <div class="article-image">
        <img src="${article.image}" alt="${article.title}" />
      </div>
      <div class="article-content">
        <h3 class="article-title">${article.title}</h3>
        <div class="article-text">
          ${article.description}  <!-- texte complet affiché -->
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
