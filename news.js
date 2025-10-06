// ============================================================
// ACTUALITES.JS — version finale CDBG (multi-langue + proxy RSS)
// ============================================================

// Tronque le contenu
function truncateHTML(html, maxLength) {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  if (text.length > maxLength) text = text.substring(0, maxLength).trim() + "…";
  return text;
}

// Détecte la langue
function detectLang() {
  const htmlLang = document.documentElement.lang || "fr";
  return htmlLang.toLowerCase().startsWith("en") ? "en" : "fr";
}

// Charge le flux RSS via proxy CORS
async function injectRSSArticles(container, lang) {
  const RSS_URL = "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml"; // ✅ Flux payant
  const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

  try {
    const res = await fetch(PROXY_URL);
    if (!res.ok) throw new Error("Erreur réseau RSS");
    const data = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");
    const items = xml.querySelectorAll("item");

    if (!items.length) {
      container.innerHTML = `<p style="text-align:center;color:#555;">Aucun article disponible pour le moment.</p>`;
      return;
    }

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
            <p>${truncateHTML(description.replace(/<[^>]*>?/gm, ""), 180)}</p>
            <div class="rss-article-meta">
              <span>${pubDate.toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
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
    container.innerHTML = `<p style="text-align:center;color:red;">Impossible de charger les actualités pour le moment.</p>`;
  }
}

// Initialisation universelle
document.addEventListener("DOMContentLoaded", async () => {
  const lang = detectLang();

  const container =
    document.querySelector('[id^="actualites"]') || // ✅ cherche un ID qui commence par "actualites"
    document.querySelector("#actualites-container");

  if (!container) {
    console.warn("⚠️ Aucun conteneur d’actualités trouvé.");
    return;
  }

  container.innerHTML = `<p style="text-align:center;">Chargement des actualités...</p>`;
  await injectRSSArticles(container, lang);
});
