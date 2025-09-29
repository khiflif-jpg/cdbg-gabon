// news.js

// --- Injection du CSS directement ---
const style = document.createElement("style");
style.innerHTML = `
/* Grille responsive */
.news-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .news-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .news-container {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Cas sans image → bloc vert */
.news-placeholder {
  background: #3D6B35;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  height: 180px;
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

.news-meta {
  font-size: 0.8rem;
  color: #999;
  margin-top: auto;
}
`;
document.head.appendChild(style);

// --- Injection dynamique des news ---
async function loadNews() {
  const container = document.getElementById("news-fr");
  if (!container) return;

  try {
    const response = await fetch("https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e");
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    const items = xml.querySelectorAll("item");
    container.innerHTML = "";

    items.forEach((item, index) => {
      if (index >= 9) return; // ⚡ Limite à 9 articles pour garder 3 lignes x 3 colonnes en desktop

      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent || "").toLocaleDateString("fr-FR");
      const source = item.querySelector("source")?.textContent || "Source inconnue";

      // Cherche une image éventuelle
      const media = item.querySelector("media\\:content, enclosure[url]");
      const imageUrl = media?.getAttribute("url") || "";

      // Carte
      const card = document.createElement("a");
      card.href = link;
      card.target = "_blank";
      card.className = "news-card";

      // Image ou placeholder
      if (imageUrl) {
        card.innerHTML = `
          <div class="news-image">
            <img src="${imageUrl}" alt="${title}">
          </div>
          <div class="news-content">
            <h3 class="news-title">${title}</h3>
            <p class="news-desc">${description}</p>
            <div class="news-meta">${pubDate} · ${source}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="news-placeholder">
            ${title}
          </div>
          <div class="news-content">
            <p class="news-desc">${description}</p>
            <div class="news-meta">${pubDate} · ${source}</div>
          </div>
        `;
      }

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des actualités :", error);
    container.innerHTML = "<p>Impossible de charger les actualités.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
