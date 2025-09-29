async function loadNews({ xmlUrl, containerId, loadMoreBtnId, batch = 5, lang = "fr" }) {
  const container = document.getElementById(containerId);
  const loadMoreBtn = loadMoreBtnId ? document.getElementById(loadMoreBtnId) : null;

  let articles = [];
  let currentIndex = 0;

  try {
    const response = await fetch(xmlUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = xml.querySelectorAll("item");

    articles = Array.from(items).map(item => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      let image = "";

      // Extraction d'image depuis <media:content> ou <enclosure>
      const media = item.querySelector("media\\:content, enclosure, image");
      if (media) {
        image = media.getAttribute("url") || media.textContent;
      } else {
        // fallback : chercher une image dans la description
        const match = description.match(/<img[^>]+src="([^">]+)"/i);
        if (match) {
          image = match[1];
        }
      }

      return { title, link, description, image };
    });

    function renderBatch() {
      const slice = articles.slice(currentIndex, currentIndex + batch);
      slice.forEach(article => {
        const card = document.createElement("a");
        card.href = article.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.className = "news-card";

        card.innerHTML = `
          <div class="news-image">
            <img src="${article.image || "placeholder.webp"}" alt="">
          </div>
          <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <!--
            <p class="news-desc">${article.description}</p>
            -->
          </div>
        `;
        container.appendChild(card);
      });

      currentIndex += slice.length;

      if (loadMoreBtn && currentIndex >= articles.length) {
        loadMoreBtn.style.display = "none";
      }
    }

    renderBatch();

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", renderBatch);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du flux RSS :", error);
    container.innerHTML = lang === "fr" 
      ? "<p>Impossible de charger les actualités pour le moment.</p>" 
      : "<p>Unable to load news at the moment.</p>";
  }
}
