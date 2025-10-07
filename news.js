/* ==========================================================
   news.js – Gestion des actualités RSS + articles statiques
   ========================================================== */

async function loadNews({ xmlUrl, containerId, batch = 10, lang = "fr" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(xmlUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("Flux RSS invalide");

    const items = [...xml.querySelectorAll("item")].slice(0, batch);

    const existingTitles = new Set(
      Array.from(container.querySelectorAll(".news-title")).map(el => el.textContent.trim())
    );

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent?.trim() || "Sans titre";
      if (existingTitles.has(title)) return;

      const link = item.querySelector("link")?.textContent?.trim() || "#";
      let descriptionRaw = item.querySelector("description")?.textContent || "";
      const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
      const pubDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
      const source = "PFBC Partenariat pour les Forêts du Gabon";

      // === Recherche de l'image ===
      let imageUrl = "";

      // 1️⃣ Balise <media:content>
      const media = item.querySelector("media\\:content, content");
      if (media && media.getAttribute("url")) {
        imageUrl = media.getAttribute("url");
      }

      // 2️⃣ Sinon image dans la description
      if (!imageUrl) {
        const imgMatch = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) imageUrl = imgMatch[1];
      }

      // Nettoyer la description pour garder un texte lisible
      const description = descriptionRaw.replace(/<[^>]*>/g, "").trim();

      const card = document.createElement("a");
      card.href = link.startsWith("http") ? link : "#";
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

    // Force la grille 4 colonnes responsive
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
    container.style.gap = "24px";
    container.style.alignItems = "stretch";
    container.style.justifyContent = "center";

  } catch (err) {
    console.error("Erreur lors du chargement du flux RSS :", err);
    container.innerHTML += `<p style="text-align:center;color:#666;">
      ${lang === "fr" ? "Aucune actualité disponible." : "No news available."}
    </p>`;
  }
}

/* ----------------------------------------------------------
   Article statique en premier
---------------------------------------------------------- */
function injectStaticArticles(lang = "fr", container) {
  if (!container) return;

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

  const article = articles.find(a => a.lang === lang);
  if (!article) return;

  const dateObj = new Date(article.date);
  const formattedDate = dateObj.toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const source = "CDBG Magazine";

  const card = document.createElement("a");
  card.href = article.link;
  card.className = "news-card";
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
  container.prepend(card);
}

/* ----------------------------------------------------------
   Initialisation
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container =
    document.getElementById("news-fr") ||
    document.getElementById("news-en") ||
    document.getElementById("news-container");

  if (!container) return;

  injectStaticArticles(lang, container);

  loadNews({
    xmlUrl: "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml",
    containerId: container.id,
    batch: 10,
    lang
  });
});
