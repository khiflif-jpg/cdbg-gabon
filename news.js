/* ==========================================================
   news.js – Gestion des actualités RSS + article statique unique
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

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent);
      const enclosure = item.querySelector("enclosure");
      const imageUrl = enclosure?.getAttribute("url") || "article1.avif";

      const source = "PFBC Partenariat pour les Forêts du Gabon";

      // ✅ Création d'une carte d'article RSS
      const card = document.createElement("a");
      card.href = link;
      card.target = "_blank";
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-image">
          <img src="${imageUrl}" alt="${title}">
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

function injectStaticArticle(lang = "fr", container) {
  if (!container) return;

  // ✅ Supprimer tout doublon existant
  container.innerHTML = "";

  const source = "PFBC Partenariat pour les Forêts du Gabon";

  // ✅ Article fixe (unique)
  const article = lang === "fr"
    ? {
        title: "Le Gabon renforce sa politique forestière",
        desc:
          "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières et la lutte contre l’exploitation illégale.",
        img: "article1.avif",
        link: "article-full-fr.html",
        date: "2025-09-12",
      }
    : {
        title:
          "Gabon strengthens its forest policy: fighting illegal logging, certification, and traceability",
        desc:
          "Gabon, rich in its equatorial forests covering 88% of its territory, is emerging as an African leader in sustainable forest management, certification, and the fight against illegal logging.",
        img: "article1.avif",
        link: "article-full-en.html",
        date: "2025-09-12",
      };

  const dateObj = new Date(article.date);
  const formattedDate = dateObj.toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ✅ Créer la carte de l’article principal
  const card = document.createElement("a");
  card.href = article.link;
  card.className = "news-card";
  card.innerHTML = `
    <div class="news-image">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="news-content">
      <h3 class="news-title">${article.title}</h3>
      <p class="news-desc">${article.desc}</p>
      <div class="news-meta">${formattedDate} – ${source}</div>
    </div>
  `;

  container.appendChild(card);
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container =
    document.getElementById("news-container") ||
    document.getElementById("news-fr");

  if (!container) return;

  // ✅ Injecter ton article fixe unique
  injectStaticArticle(lang, container);

  // ✅ Charger ensuite le flux RSS
  loadNews({
    xmlUrl: "https://rss.app/feeds/hbFiIhcY4o5oFSa5.xml",
    containerId: container.id,
    batch: 8,
    lang: lang,
  });
});
