// ✅ Injecter styles spécifiques aux news
(function() {
  const style = document.createElement("style");
  style.innerHTML = `
    /* Grille responsive */
    .news-container, .news-grid {
      display: grid;
      grid-template-columns: 1fr; /* mobile par défaut */
      gap: 20px;
    }

    @media (min-width: 768px) {
      .news-container, .news-grid {
        grid-template-columns: repeat(2, 1fr); /* tablette */
      }
    }

    @media (min-width: 1024px) {
      .news-container, .news-grid {
        grid-template-columns: repeat(3, 1fr); /* desktop */
      }
    }

    /* Carte */
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
      opacity: 0;
      transform: translateY(20px);
    }

    .news-card.visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .news-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.15);
      border-left: 4px solid #2e7d32; /* liseré vert forêt */
    }

    /* Image */
    .news-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* ✅ évite les bandes étirées */
      display: block;
      transition: transform 0.3s ease;
    }

    .news-card:hover .news-image img {
      transform: scale(1.05);
    }

    /* Contenu */
    .news-content {
      padding: 15px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .news-title {
      font-size: 1rem;
      font-weight: bold;
      margin: 0 0 8px;
      line-height: 1.4em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* ✅ tronque à 2 lignes */
      -webkit-box-orient: vertical;
    }

    .news-desc {
      font-size: 0.9rem;
      color: #666;
      margin: 0 0 10px;
      line-height: 1.4em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* ✅ tronque à 3 lignes */
      -webkit-box-orient: vertical;
      flex-grow: 1;
    }

    .date {
      font-size: 0.8rem;
      color: #999;
      margin-top: auto;
    }

    /* Bouton voir plus */
    .btn {
      display: inline-block;
      margin: 20px auto;
      padding: 10px 20px;
      background: #2e7d32;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }

    .btn:hover {
      background: #256428;
      transform: scale(1.05);
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

        // ✅ Extraire image depuis enclosure ou media:content
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

        // ✅ Carte cliquable
        const card = document.createElement("a");
        card.className = "news-card";
        card.href = link;
        card.target = "_blank"; 
        card.rel = "noopener noreferrer";

        // ✅ Contenu
        card.innerHTML = `
          <div class="news-image">
            <img src="${imageUrl || "placeholder.webp"}" alt="${title}" loading="lazy"
                 onerror="this.onerror=null; this.src='placeholder.webp';">
          </div>
          <div class="news-content">
            <h3 class="news-title">${title}</h3>
            <p class="news-desc">${description}</p>
            <p class="date">${formattedDate}</p>
          </div>
        `;

        container.appendChild(card);

        // ✅ Animation fade-in progressive
        setTimeout(() => card.classList.add("visible"), 100 * i);
      }

      // ✅ Cacher le bouton si plus rien
      if (index >= items.length && loadMoreBtnId) {
        document.getElementById(loadMoreBtnId).style.display = "none";
      }
    }

    // Premier lot
    renderBatch();

    // ✅ Bouton "Voir plus"
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
