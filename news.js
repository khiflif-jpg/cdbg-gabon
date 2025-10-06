async function loadNews() {
  const lang = document.documentElement.lang || "fr";
  const container = document.getElementById("news-container");
  if (!container) return;

  const xmlUrl = "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml";
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(xmlUrl)}`;

  try {
    // Charger le flux RSS via proxy
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "application/xml");
    const items = [...xml.querySelectorAll("item")].slice(0, 12);

    container.innerHTML = "";

    // --- Article interne CDBG ---
    const internalArticle = document.createElement("a");
    internalArticle.href =
      lang === "fr" ? "article-full-fr.html?id=article1" : "article-full-en.html?id=article1";
    internalArticle.className = "news-card";
    internalArticle.innerHTML = `
      <div class="news-placeholder" style="background:#3D6B35;color:#fff;padding:1.5rem;">
        ${lang === "fr"
          ? "CDBG Magazine – Découvrez nos projets forestiers au Gabon"
          : "CDBG Magazine – Discover our sustainable forestry projects in Gabon"}
      </div>
      <div class="news-content">
        <p class="news-desc">${
          lang === "fr"
            ? "Consultez notre article complet sur la gestion durable des forêts et les initiatives locales de la CDBG."
            : "Read our full feature on sustainable forest management and CDBG’s local initiatives."
        }</p>
        <div class="news-meta">CDBG • 2025</div>
      </div>
    `;
    container.appendChild(internalArticle);

    // --- Flux RSS ---
    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "Sans titre";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent);
      let imageUrl = "";

      // Cherche une image
      const enclosure = item.querySelector("enclosure");
      if (enclosure && enclosure.getAttribute("url")) {
        imageUrl = enclosure.getAttribute("url");
      } else {
        const content = item.getElementsByTagName("content:encoded")[0];
        if (content && content.textContent.match(/<img[^>]+src="([^">]+)"/)) {
          imageUrl = RegExp.$1;
        }
      }

      const card = document.createElement("a");
      card.href = link;
      card.target = "_blank";
      card.className = "news-card";

      card.innerHTML = `
        ${imageUrl
          ? `<div class="news-image"><img src="${imageUrl}" alt="${title}"></div>`
          : `<div class="news-placeholder">${title}</div>`}
        <div class="news-content">
          <h3 class="news-title">${title}</h3>
          <p class="news-desc">${description}</p>
          <div class="news-meta">${pubDate.toLocaleDateString(lang)}</div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur de chargement du flux RSS :", err);
    container.innerHTML =
      lang === "fr"
        ? "<p>Impossible de charger les actualités pour le moment.</p>"
        : "<p>Unable to load news at this time.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
