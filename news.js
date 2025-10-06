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
    // ❌ on ne vide plus le container, pour garder les articles statiques
    // container.innerHTML = "";

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent);
      const source = item.querySelector("source")?.textContent || "RSS Source";
      const enclosure = item.querySelector("enclosure");
      const imageUrl = enclosure?.getAttribute("url") || "";

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

  const articles = [
    // ✅ Ton article principal
    {
      lang: "fr",
      title: "Le Gabon renforce sa politique forestière",
      description:
        "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières…",
      img: "foret.webp",          // Desktop
      imgSmall: "foret_small.webp", // Mobile
      link: "https://www.cdbg-gabon.com/article-full-fr.html",
      date: "2025-09-12"
    },
    // ✅ Les autres articles
    {
      lang: "fr",
      title: "Le développement durable au cœur de la gestion forestière",
      description:
        "Découvrez comment la CDBG met en œuvre une gestion durable des forêts gabonaises, conciliant économie et écologie.",
      img: "foret_durable.webp",
      imgSmall: "foret_durable.webp",
      link: "article-full-fr.html",
      date: "2025-09-22"
    },
    {
      lang: "fr",
      title: "Les essences tropicales du Gabon",
      description:
        "Un voyage au cœur des bois précieux du Gabon : Okoumé, Kevazingo, Padouk et bien d’autres espèces remarquables.",
      img: "bois_tropicaux.webp",
      imgSmall: "bois_tropicaux.webp",
      link: "article-full-fr.html#essences",
      date: "2025-09-25"
    }
  ];

  const filtered = articles.filter(a => a.lang === lang);
  const toDisplay = limit ? filtered.slice(0, limit) : filtered;

  // ❌ Ne pas vider le container
  // container.innerHTML = "";

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

    card.innerHTML = `
      <div class="news-image">
        <picture>
          <source media="(max-width: 768px)" srcset="${article.imgSmall}">
          <img src="${article.img}" alt="${article.title}">
        </picture>
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <p class="news-desc">${article.description}</p>
        <div class="news-meta">${formattedDate}</div>
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

  if (lang === "fr") injectStaticArticles("fr", container);
  if (lang === "en") injectStaticArticles("en", container);

  // ✅ Ensuite, charge le flux RSS
  loadNews({
    xmlUrl: "https://rss.app/feeds/hbFiIhcY4o5oFSa5.xml",
    containerId: "news-fr",
    batch: 5,
    lang: lang
  });
});
