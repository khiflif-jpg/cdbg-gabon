// ============================================================
//  NEWS.JS — version unifiée CDBG (même flux FR sur toutes les pages)
// ============================================================

// Tronque le contenu HTML à un nombre de caractères max
function truncateHTML(html, maxLength) {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length > maxLength) text = text.substring(0, maxLength).trim() + "…";
  return text;
}

// Article interne CDBG
function injectFeaturedArticle(container) {
  if (!container || !window.staticArticlesFR?.length) return;
  const article = staticArticlesFR[0];
  const link = "article-full-fr.html";
  const html = `
    <article class="rss-article cdbg-featured">
      <a href="${link}" class="rss-article-img">
        <img src="${article.image}" alt="${article.title}" loading="lazy">
      </a>
      <div class="rss-article-content">
        <h2><a href="${link}">${article.title}</a></h2>
        <p>${truncateHTML(article.description, 220)}</p>
        <div class="rss-article-meta">
          <span>${new Date(article.pubDate).toLocaleDateString("fr-FR", {
            year: "numeric", month: "long", day: "numeric"
          })}</span>
          <span class="rss-source">CDBG</span>
        </div>
      </div>
    </article>
  `;
  container.insertAdjacentHTML("afterbegin", html);
}

// Chargement RSS via proxy AllOrigins
async function injectRSSArticles(container) {
  const RSS_URL = "https://rss.app/feeds/hbFiIhcY4o5oFSa5.xml"; // 🌍 Flux unique FR
  const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

  try {
    const res = await fetch(PROXY_URL);
    const data = await res.json();
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
              <span>${pubDate.toLocaleDateString("fr-FR", {
                year: "numeric", month: "long", day: "numeric"
              })}</span>
              <span class="rss-source">PFBC</span>
            </div>
          </div>
        </article>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.error("Erreur flux RSS :", err);
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#news-container");
  if (!container) return;

  injectFeaturedArticle(container);
  await injectRSSArticles(container);
});
