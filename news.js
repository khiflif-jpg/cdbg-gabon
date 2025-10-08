/* ==========================================================
   news.js – Gestion des actualités RSS + article statique
   ========================================================== */

async function loadNews({ xmlUrl, containerId = "news-container", batch = 10, lang = "fr" }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`[news.js] Conteneur introuvable : #${containerId}`);
    return;
  }

  try {
    const res = await fetch(xmlUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xmlText = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("Flux RSS invalide");

    const items = [...xml.querySelectorAll("item")].slice(0, batch);
    if (!items.length) throw new Error("Aucun article RSS trouvé");

    const existingTitles = new Set(
      Array.from(container.querySelectorAll(".news-title")).map(el => el.textContent.trim())
    );

    for (const item of items) {
      const title = item.querySelector("title")?.textContent?.trim() || "Sans titre";
      if (existingTitles.has(title)) continue;

      const link = item.querySelector("link")?.textContent?.trim() || "#";
      let descriptionRaw = item.querySelector("description")?.textContent || "";
      const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
      const pubDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
      const source = "PFBC – Partenariat pour les Forêts du Bassin du Congo";

      // === Recherche de l'image ===
      let imageUrl = "";
      const media = item.querySelector("media\\:content, content");
      if (media?.getAttribute("url")) {
        imageUrl = media.getAttribute("url");
      } else {
        const imgMatch = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch?.[1]) imageUrl = imgMatch[1];
      }

      // Nettoyage description (suppression HTML et liens)
      const description = descriptionRaw
        .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
        .replace(/<[^>]*>/g, "")
        .trim();

      // --- Création carte ---
      const card = document.createElement("article");
      card.className = "news-card";
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.addEventListener("click", () => window.open(link, "_blank"));

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
    }

    // Grille responsive uniforme
    Object.assign(container.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "24px",
      alignItems: "stretch",
      justifyContent: "center",
    });

  } catch (err) {
    console.error("[news.js] Erreur lors du chargement RSS :", err);
    container.innerHTML = `
      <p style="text-align:center;color:#666;margin-top:40px;">
        ${lang === "fr" ? "Aucune actualité disponible pour le moment." : "No news available at the moment."}
      </p>
    `;
  }
}

/* ----------------------------------------------------------
   Injection de l’article statique CDBG
---------------------------------------------------------- */
function injectStaticArticles(lang = "fr", container) {
  if (!container) return;

  const article = {
    fr: {
      title: "Le Gabon renforce sa politique forestière",
      description:
        "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières…",
      img: "article1.avif",
      link: "article-full-fr.html",
      date: "2025-09-12",
      source: "CDBG Magazine",
    },
    en: {
      title: "Gabon strengthens its forest policy",
      description:
        "Gabon, rich in its equatorial forests, stands as a leader in sustainable forest management and biodiversity preservation.",
      img: "article1.avif",
      link: "article-full-en.html",
      date: "2025-09-12",
      source: "CDBG Magazine",
    },
  }[lang];

  if (!article) return;

  const formattedDate = new Date(article.date).toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const card = document.createElement("article");
  card.className = "news-card";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.addEventListener("click", () => window.open(article.link, "_blank"));

  card.innerHTML = `
    <div class="news-image">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="news-content">
      <h3 class="news-title">${article.title}</h3>
      <p class="news-desc">${article.description}</p>
      <div class="news-meta">${formattedDate} – ${article.source}</div>
    </div>
  `;

  container.prepend(card);
}

/* ----------------------------------------------------------
   Initialisation automatique
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container =
    document.getElementById("news-container") ||
    document.getElementById("news-fr") ||
    document.getElementById("news-en");

  if (!container) {
    console.warn("[news.js] Aucun conteneur d’actualités trouvé.");
    return;
  }

  injectStaticArticles(lang, container);
  loadNews({
    xmlUrl: "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml",
    containerId: container.id,
    batch: 10,
    lang,
  });
});
