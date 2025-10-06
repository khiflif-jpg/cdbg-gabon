// ============================================================
//  NEWS.JS — version finale CDBG multilingue + proxy AllOrigins
// ============================================================

// === Tronque le contenu HTML à une longueur max ===
function truncateHTML(html, maxLength) {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length > maxLength) text = text.substring(0, maxLength).trim() + "…";
  return text;
}

// === Détection automatique de la langue ===
function detectLang() {
  const htmlLang = document.documentElement.lang || "fr";
  return htmlLang.toLowerCase().startsWith("en") ? "en" : "fr";
}

// === Articles internes CDBG ===
const staticArticlesFR = [
  {
    id: "article1",
    title: "CDBG : Une gestion forestière durable au Gabon",
    description: "Découvrez comment la Compagnie Durable du Bois au Gabon contribue à la préservation des forêts tropicales à Bitam, dans le respect des standards internationaux FSC® et PAFC.",
    image: "images/cdbg-foret.webp",
    pubDate: "2025-02-01"
  }
];

const staticArticlesEN = [
  {
    id: "article1",
    title: "CDBG: Sustainable Forest Management in Gabon",
    description: "Learn how Compagnie Durable du Bois in Gabon promotes sustainable forestry practices in Bitam, aligning with FSC® and PAFC international standards.",
    image: "images/cdbg-forest.webp",
    pubDate: "2025-02-01"
  }
];

// === Injection de l’article interne ===
function injectFeaturedArticle(lang, container) {
  const isEN = lang === "en";
  const article = isEN ? staticArticlesEN[0] : staticArticlesFR[0];
  if (!article || !container) return;

  const link = isEN ? `article-full-en.html?id=${article.id}` : `article-full-fr.html?id=${article.id}`;
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

// === Chargement du flux RSS via AllOrigins ===
async function injectRSSArticles(container, lang) {
  const RSS_URL = lang === "en"
    ? "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml" // 🌍 flux anglais
    : "https://rss.app/feeds/hbFiIhcY4o5oFSa5.xml"; // 🇫🇷 flux français

  const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

  try {
    const res = await fetch(PROXY_URL);
    const data = await res.json();

    if (!data || !data.contents) {
      console.error("⚠️ Flux vide ou inaccessible :", RSS_URL);
      return;
    }

    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");
    const items = xml.querySelectorAll("item");

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent || Date.now());
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      const image = imgMatch ? imgMatch[1] : "images/default-thumb.webp";

      const html = `
        <article class="rss-article">
          <a href="${link}" class="rss-article-img" target="_blank" rel="noopener">
            <img src="${image}" alt="${title}" loading="lazy">
          </a>
          <div class="rss-article-content">
            <h2><a href="${link}" target="_blank" rel="noopener">${title}</a></h2>
            <p>${truncateHTML(description.replace(/<[^>]*>?/gm, ""), 200)}</p>
            <div class="rss-article-meta">
              <span>${pubDate.toLocaleDateString(
                lang === "en" ? "en-GB" : "fr-FR",
                { year: "numeric", month: "long", day: "numeric" }
              )}</span>
              <span class="rss-source">PFBC</span>
            </div>
          </div>
        </article>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.error("❌ Erreur chargement flux RSS :", err);
  }
}

// === Initialisation ===
document.addEventListener("DOMContentLoaded", async () => {
  const lang = detectLang();
  const container = document.querySelector("#news-container");
  if (!container) return;

  injectFeaturedArticle(lang, container);
  await injectRSSArticles(container, lang);
});
