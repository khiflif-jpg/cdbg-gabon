// ================================
// ARTICLES STATIQUES
// ================================
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html#article1",
    description: `...long texte HTML...`,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const staticArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html#article1",
    description: `...long texte HTML...`,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// ================================
// UTILITAIRES
// ================================
function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// ================================
// INJECTION LISTE D'ARTICLES
// ================================
function injectStaticArticles(lang, container) {
  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;
  articles.forEach(article => {
    const card = document.createElement("a");
    card.className = "news-card";
    card.href = article.link;
    card.innerHTML = `
      <div class="news-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <div class="news-desc">${article.description.replace(/<[^>]*>?/gm,"").substring(0,150)}...</div>
        <div class="news-meta">${formatDate(article.pubDate, lang)}</div>
      </div>
    `;
    container.prepend(card); // Toujours en premier
  });
}

// ================================
// INJECTION ARTICLE DÉTAILLÉ
// ================================
function injectArticleDetail(lang, container) {
  const articleId = window.location.hash.substring(1);
  if (!articleId) return;

  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;
  const article = articles.find(a => a.id === articleId);
  if (!article) return;

  container.innerHTML = `
    <h1>${article.title}</h1>
    <img src="${article.image}" alt="${article.title}" style="max-width:100%; margin:20px 0;">
    <div>${article.description}</div>
    <p><em>Publié le: ${formatDate(article.pubDate, lang)}</em></p>
  `;
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const containerListFR = document.getElementById("my-articles-fr");
  const containerListEN = document.getElementById("my-articles-en");
  const containerDetail = document.getElementById("article-detail");

  if (containerListFR) injectStaticArticles("fr", containerListFR);
  if (containerListEN) injectStaticArticles("en", containerListEN);
  if (containerDetail) {
    const lang = document.documentElement.lang === "fr" ? "fr" : "en";
    injectArticleDetail(lang, containerDetail);
  }
});
