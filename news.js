// ✅ Injection du style directement depuis news.js
(function() {
  const style = document.createElement("style");
  style.innerHTML = `
    /* Grille des news */
    .news-container, .news-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    @media (min-width: 768px) {
      .news-container, .news-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .news-container, .news-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Cartes */
    .news-card {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      text-decoration: none;
      color: inherit;
    }

    .news-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    }

    /* Image */
    .news-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
      background: #f0f0f0;
      position: relative;
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Cas sans image */
    .news-image.no-image {
      background: #3D6B35;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px;
    }

    .news-image.no-image h3 {
      color: #fff;
      font-size: 1rem;
      line-height: 1.3em;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    /* Contenu */
    .news-content {
      padding: 15px;
    }

    .news-title {
      font-size: 1rem;
      font-weight: bold;
      margin: 0 0 8px;
      line-height: 1.4em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .news-desc {
      font-size: 0.9rem;
      color: #666;
      margin: 0 0 8px;
      line-height: 1.4em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .date, .source {
      font-size: 0.8rem;
      color: #999;
      margin: 0;
    }
  `;
  document.head.appendChild(style);
})();

// ✅ Script principal
async function loadNews({ xmlUrl, containerId, loadMoreBtnId, batch = 10, lang = "fr" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(xmlUrl);
    const text = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");

    if (items.length === 0) {
      container.innerHTML = lang === "fr"
        ? "<p>Aucun article disponible pour le moment.</p>"
        : "<p>No articles available at the moment.</p>";
      return;
    }

    let index = 0;
    function renderBatch() {
      for (let i = 0; i < batch && index < items.length; i++, index++) {
        const item = items[index];
        const title = item.querySelector("title")?.textContent || (lang === "fr" ? "Pas de titre" : "No title");
        const link = item.querySelector("link")?.textContent || "#";
        const date = item.querySelector("pubDate")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";

        // ✅ Extraire image
        let imageUrl = item.querySelector("enclosure")?.getAttribute("url")
          || item.querySelector("media\\:content")?.getAttribute("url")
          || null;

        const formattedDate = date
          ? new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";

        // ✅ Carte
        const card = document.createElement("a");
        card.className = "news-card";
        card.href = link;
        card.target = "_blank"; 
        card.rel = "noopener noreferrer";

        if (imageUrl) {
          // ✅ Cas avec image
          card.innerHTML = `
            <div class="news-image">
              <img src="${imageUrl}" alt="${title}" loading="lazy"
                   onerror="this.onerror=null; this.src='placeholder.webp';">
            </div>
            <div class="news-content">
              <h3 class="news-title">${title}</h3>
              <p class="news-desc">${description}</p>
              <p class="date">${formattedDate}</p>
              <p class="source">${lang === "fr"
                ? "Source: Partenariat pour les forêts du bassin du Congo"
                : "Source: Congo Basin Forest Partnership"}</p>
            </div>
          `;
        } else {
          // ✅ Cas sans image
          card.innerHTML = `
            <div class="news-image no-image">
              <h3>${title}</h3>
            </div>
            <div class="news-content">
              <p class="news-desc">${description}</p>
              <p class="date">${formattedDate}</p>
              <p class="source">${lang === "fr"
                ? "Source: Partenariat pour les forêts du bassin du Congo"
                : "Source: Congo Basin Forest Partnership"}</p>
            </div>
          `;
        }

        container.appendChild(card);
      }

      if (index >= items.length && loadMoreBtnId) {
        document.getElementById(loadMoreBtnId).style.display = "none";
      }
    }

    // ✅ Premier lot
    renderBatch();

    if (loadMoreBtnId) {
      const btn = document.getElementById(loadMoreBtnId);
      btn.addEventListener("click", renderBatch);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des actualités :", error);
    container.innerHTML = lang === "fr"
      ? "<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>"
      : "<p>Error loading the articles. Please try again later.</p>";
  }
}
