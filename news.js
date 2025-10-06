// ============================================================
//  NEWS.JS — version finale CDBG (flux RSS en direct)
// ============================================================

// === Fonctions utilitaires ===

// Tronque le contenu HTML à un nombre de caractères max (préserve les balises basiques)
function truncateHTML(html, maxLength) {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + "…";
  }
  return text;
}

// Détecte la langue de la page
function detectLang() {
  const htmlLang = document.documentElement.lang || "fr";
  return htmlLang.toLowerCase().startsWith("en") ? "en" : "fr";
}

// === Injection de l’article interne CDBG ===
function injectFeaturedArticle(lang, container) {
  const isEN = lang === "en";
  const article = isEN ? staticArticlesEN?.[0] : staticArticlesFR?.[0];
  if (!article || !container) return;

  const link = isEN
    ? `article-full-en.html?id=${article.id}`
    : `article-full-fr.html?id=${article.id}`;

  const html = `
    <article class="rss-article cdbg-featured">
      <a href="${link}" class="rss-article-img">
        <img src="${article.image}" alt="${article.title}" loading="lazy">
      </a>
      <div class="rss-article-content">
        <h2><a href="${link}">${article.title}</a></h2>
        <p>${truncateHTML(article.description, 220)}</p>
        <div class="rss-article-meta">
          <span>${new Date(article.pubDate).toLocaleDateString(
            isEN ? "en-GB" : "fr-FR",
            { year: "numeric", month: "long", day: "numeric" }
          )}</span>
          <span class="rss-source">CDBG</span>
        </div>
      </div>
    </article>
  `;
  container.insertAdjacentHTML("afterbegin", html);
}

// === Chargement du flux RSS en direct ===
async function injectRSSArticles(container, lang) {
  const RSS_URL = "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml";

  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.error("Aucun article RSS trouvé.");
      return;
    }

    for (const item of data.items) {
      const link = item.link || "#";
      const title = item.title || "";
      const date = new Date(item.pubDate).toLocaleDateString(
        lang === "en" ? "en-GB" : "fr-FR",
        { year: "numeric", month: "long", day: "numeric" }
      );
      const source = "Partenariat pour les Forêts du Bassin du Congo";

      const html = `
        <article class="rss-article">
          <a href="${link}" class="rss-article-img" target="_blank" rel="noopener">
            <img src="${item.enclosure?.link || "images/default-thumb.webp"}" alt="${title}" loading="lazy">
          </a>
          <div class="rss-article-content">
            <h2><a href="${link}" target="_blank" rel="noopener">${title}</a></h2>
            <p>${truncateHTML(item.description || "", 200)}</p>
            <div class="rss-article-meta">
              <span>${date}</span>
              <span class="rss-source">${source}</span>
            </div>
          </div>
        </article>
      `;
      container.insertAdjacentHTML("beforeend", html);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du flux RSS :", error);
  }
}

// === Initialisation principale ===
document.addEventListener("DOMContentLoaded", async function () {
  const lang = detectLang();
  const container = document.querySelector("#news-container");

  if (!container) return;

  // Injecte l’article CDBG en premier
  injectFeaturedArticle(lang, container);

  // Puis injecte les articles RSS en direct
  await injectRSSArticles(container, lang);
});
