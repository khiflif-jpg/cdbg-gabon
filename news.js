/* ==========================================================
   news.js – Gestion des actualités RSS + articles statiques
   ========================================================== */

async function loadNews({ xmlUrl, containerId, batch = 8, lang = "fr" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(xmlUrl);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    const items = [...xml.querySelectorAll("item")].slice(0, batch);
    // ❌ On ne vide plus le container, pour garder les articles statiques

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent);
      const enclosure = item.querySelector("enclosure");
      const imageUrl = enclosure?.getAttribute("url") || "";

      // ✅ Source fixe
      const source = "PFBC Partenariat pour les Forêts du Gabon";

      const card = document.createElement("a");
      card.href = link;
      card.target = "_blank";
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-image">
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}">` : ""}
        </div>
        <div class="news-content">
          <h3 class="news-title">${title}</h3>
          <p class="news-desc">${description}</p>
          <div class="news-meta">${pubDate.toLocaleDateString(lang)} – ${source}</div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur lors du chargement du flux RSS :", err);
    container.innerHTML = `<p style="text-align:center;color:#666;">${
      lang === "fr" ? "Aucune actualité disponible." : "No news available."
    }</p>`;
  }
}

function injectStaticArticles(lang = "fr", container, limit = false) {
  if (!container) return;

  // ✅ Articles fixes pour FR et EN
  const articles = [
    {
      lang: "fr",
      title: "Le Gabon renforce sa politique forestière",
      description:
        "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières…",
      img: "article1.avif",
      link: "article-full-fr.html",
      date: "2025-09-12"
    },
    {
      lang: "en",
      title: "Gabon strengthens its forest policy",
      description:
        "Gabon, rich in its equatorial forests, stands as a leader in sustainable forest management and biodiversity preservation.",
      img: "article1.avif",
      link: "article-full-en.html",
      date: "2025-09-12"
    }
  ];

  const filtered = articles.filter(a => a.lang === lang);
  const toDisplay = limit ? filtered.slice(0, limit) : filtered;

  // ✅ On ajoute les articles statiques avant le RSS
  toDisplay.forEach(article => {
    const card = document.createElement("a");
    card.href = article.link;
    card.className = "news-card";
    const dateObj = new Date(article.date);
    const formattedDate = dateObj.toLocaleDateString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const source = "PFBC Partenariat pour les Forêts du Gabon";

    card.innerHTML = `
      <div class="news-image">
        <img src="${article.img}" alt="${article.title}">
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <p class="news-desc">${article.description}</p>
        <div class="news-meta">${formattedDate} – ${source}</div>
      </div>
    `;
    container.appendChild(card);
  });

  if (!toDisplay.length) {
    container.innerHTML = `<p style="text-align:center;color:#666;">${
      lang === "fr" ? "Aucun article pour le moment." : "No articles available yet."
    }</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container =
    document.getElementById("news-fr") ||
    document.getElementById("news-container");

  // ✅ Injecte d’abord ton article fixe
  injectStaticArticles(lang, container);

  // ✅ Puis charge le flux RSS
  loadNews({
    xmlUrl: "https://rss.app/feeds/hbFiIhcY4o5oFSa5.xml",
    containerId: container.id,
    batch: 8,
    lang: lang
  });
});
