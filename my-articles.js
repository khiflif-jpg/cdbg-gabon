// ARTICLES STATIQUES
const myArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    image: "article1.avif",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...</p>
      <p>Le 19 août 2025, deux embarcations ont été remises au ministère des Eaux et Forêts, grâce à l’ONG The Nature Conservancy dans le cadre du programme CAFI...</p>
      <p><strong>🤝 La CDBG, un acteur pleinement engagé</strong><br>
      Déjà certifiée PAFC, la Compagnie des Bois du Gabon adhère pleinement à la politique nationale de traçabilité (SNTBG), garantissant la légalité et la durabilité de ses produits bois.</p>
      <p><strong>📌 En conclusion</strong><br>
      Une filière bois moderne et durable est en marche, soutenue par la CDBG en harmonie avec les réformes nationales.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z"
  }
];

const myArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    image: "article1.avif",
    description: `
      <p>Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...</p>
      <p>On August 19, 2025, two patrol boats were donated to the Ministry of Water and Forests via TNC and the CAFI program, to enhance river surveillance against illegal logging.</p>
      <p><strong>🤝 CDBG, a Committed Partner</strong><br>
      Already PAFC certified, Compagnie des Bois du Gabon (CDBG) fully supports the national traceability system (SNTBG), ensuring legality and sustainability.</p>
      <p><strong>📌 Conclusion</strong><br>
      A modern, transparent timber sector is emerging—CDBG is at its core, aligned with national reforms.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z"
  }
];

// INJECTION DES ARTICLES DANS LES PAGES "articles.html" / "articles-en.html"
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;

  articles.forEach(article => {
    const card = document.createElement("a");
    card.href = lang === "fr" ? `articles-francais.html#${article.id}` : `articles-anglais.html#${article.id}`;
    card.className = "article-card";
    card.style.display = "block";
    card.style.textDecoration = "none";
    card.style.color = "inherit";
    card.style.marginBottom = "40px";
    card.innerHTML = `
      <img src="${article.image}" alt="${article.title}" style="width:100%; max-height:400px; object-fit:cover; margin-bottom:15px;"/>
      <h2 style="margin-bottom:10px;">${article.title}</h2>
      <p style="color:#555;">${stripHtml(article.description).substring(0, 200)}...</p>
      <p style="font-size:0.8rem; color:#999;">${formatDate(article.pubDate, lang)}</p>
    `;
    container.appendChild(card);
  });
}

// UTILITY FUNCTIONS
function stripHtml(html){
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function formatDate(dateStr, lang){
  if(!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// INJECTION DU CONTENU COMPLET DANS LES PAGES DÉDIÉES (articles-français.html / articles-anglais.html)
function injectFullArticle(lang, articleId, containerSelector) {
  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;
  const article = articles.find(a => a.id === articleId);
  const container = document.querySelector(containerSelector);
  if (!article || !container) return;

  container.innerHTML = `
    <img src="${article.image}" alt="${article.title}" style="width:100%; max-height:400px; object-fit:cover; margin-bottom:20px;"/>
    <h1>${article.title}</h1>
    <article>${article.description}</article>
  `;
}
