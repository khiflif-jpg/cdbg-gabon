// ✅ Injecter style spécifique aux images d'actus
(function() {
  const style = document.createElement("style");
  style.innerHTML = `
    .news-img {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .news-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .actus-card:hover .news-img img {
      transform: scale(1.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
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

        // ✅ Extraire image depuis media:content
        const media = item.getElementsByTagName("media:content")[0];
        let imageUrl = media ? media.getAttribute("url") : "placeholder.webp";

        const formattedDate = date
          ? new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";

        // ✅ Carte cliquable
        const card = document.createElement("a");
        card.className = "actus-card";
        card.href = link;
        card.target = "_blank"; 
        card.rel = "noopener noreferrer";

        // ✅ Construction du contenu
        card.innerHTML = `
          <div class="news-img">
            <img src="${imageUrl}" alt="${title}" loading="lazy"
                 onerror="this.onerror=null; this.src='placeholder.webp';">
          </div>
          <div class="actus-card-content">
            <h3>${title}</h3>
            <p class="date">${formattedDate}</p>
            <p class="source">${lang === "fr"
              ? "Source : Partenariat pour les forêts du bassin du Congo"
              : "Source : Congo Basin Forest Partnership"}</p>
          </div>
        `;

        container.appendChild(card);
      }

      // ✅ Cacher le bouton si plus rien à charger
      if (index >= items.length && loadMoreBtnId) {
        const btn = document.getElementById(loadMoreBtnId);
        if (btn) btn.style.display = "none";
      }
    }

    // ✅ Premier lot
    renderBatch();

    // ✅ Gérer le bouton "Voir plus" / "Load more"
    if (loadMoreBtnId) {
      const btn = document.getElementById(loadMoreBtnId);
      if (btn) btn.addEventListener("click", renderBatch);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des actualités :", error);
    container.innerHTML = lang === "fr"
      ? "<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>"
      : "<p>Error loading the articles. Please try again later.</p>";
  }
}
