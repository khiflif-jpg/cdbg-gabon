// ARTICLES STATIQUES
const myArticlesFR = [
  {
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html",
    description: `Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...`,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const myArticlesEN = [
  {
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html",
    description: `Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...`,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// INJECTION DES ARTICLES
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  const articles = lang === "fr" ? myArticlesFR : myArticlesEN;

  // Ajouter le style une seule fois
  if (!document.getElementById("my-articles-style")) {
    const style = document.createElement("style");
    style.id = "my-articles-style";
    style.textContent = `
      .my-articles-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr;
      }
      @media(min-width: 600px) {
        .my-articles-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media(min-width: 1024px) {
        .my-articles-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .my-article-card {
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        text-decoration: none;
        color: inherit;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .my-article-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.12);
      }
      .my-article-image {
        width: 100%;
        height: 180px;
        overflow: hidden;
      }
      .my-article-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .my-article-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      .my-article-title {
        font-size: 1rem;
        font-weight: bold;
        margin: 0 0 8px;
      }
      .my-article-desc {
        font-size: 0.9rem;
        color: #666;
        margin: 0 0 10px;
        line-height: 1.4em;
        flex-grow: 1;
      }
      .my-article-meta {
        font-size: 0.8rem;
        color: #999;
      }
    `;
    document.head.appendChild(style);
  }

  const grid = document.createElement("div");
  grid.className = "my-articles-grid";

  articles.forEach(article => {
    const card = document.createElement("a");
    card.href = article.link;
    card.className = "my-article-card";

    card.innerHTML = `
      <div class="my-article-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="my-article-content">
        <h3 class="my-article-title">${article.title}</h3>
        <p class="my-article-desc">${article.description}</p>
        <div class="my-article-meta">${new Date(article.pubDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}
