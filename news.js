// ================================
// ARTICLES STATIQUES
// ================================
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html#article1",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire...</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const staticArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html#article1",
    description: `
      <p>Gabon, with forests covering 88% of its territory...</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// ================================
// FONCTION D'INJECTION STATIQUE
// ================================
function injectStaticArticles(lang, container) {
  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;
  articles.forEach(article => {
    const card = document.createElement("a");
    card.className = "news-card";
    card.href = article.link;
    card.innerHTML = `
      <div class="news-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <div class="news-desc">${article.description}</div>
        <div class="news-meta">${new Date(article.pubDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
          year: "numeric", month: "short", day: "numeric"
        })}</div>
      </div>
    `;
    container.prepend(card); // Toujours en premier
  });
}

// ================================
// FONCTION LOAD RSS
// ================================
function loadNews({ xmlUrl, containerId, loadMoreBtnId = null, batch = 5, lang = "fr" }) {
  const container = document.getElementById(containerId);
  const loadMoreBtn = loadMoreBtnId ? document.getElementById(loadMoreBtnId) : null;
  let items = [];
  let currentIndex = 0;

  // Style unique pour toutes les cartes
  if (!document.getElementById("news-style")) {
    const style = document.createElement("style");
    style.id = "news-style";
    style.textContent = `
      .news-card { display:flex; flex-direction:column; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); text-decoration:none; color:inherit; transition: transform 0.2s, box-shadow 0.2s; }
      .news-card:hover { transform:translateY(-4px); box-shadow:0 6px 16px rgba(0,0,0,0.12); }
      .news-image { width:100%; height:180px; overflow:hidden; background:#f0f0f0; }
      .news-image img { width:100%; height:100%; object-fit:cover; display:block; }
      .news-placeholder { width:100%; height:180px; background:#3D6B35; color:#fff; display:flex; align-items:center; justify-content:center; padding:10px; text-align:center; }
      .news-placeholder h3 { font-size:1rem; margin:0; line-height:1.4em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      .news-content { padding:15px; display:flex; flex-direction:column; flex-grow:1; }
      .news-title { font-size:1rem; font-weight:bold; margin:0 0 8px; line-height:1.4em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      .news-desc { font-size:0.9rem; color:#666; margin:0 0 10px; line-height:1.4em; }
      .news-meta { font-size:0.8rem; color:#999; margin-top:auto; }
    `;
    document.head.appendChild(style);
  }

  // Récupération du flux RSS
  fetch(xmlUrl)
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      items = Array.from(data.querySelectorAll("item")).map(item => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const description = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const source = item.querySelector("source")?.textContent || "";
        let image = null;
        const enclosure = item.querySelector("enclosure[url]");
        if (enclosure) image = enclosure.getAttribute("url");
        else {
          const imgMatch = description.match(/<img.*?src="(.*?)"/);
          if (imgMatch) image = imgMatch[1];
        }
        return { title, link, description, pubDate, source, image };
      });

      renderBatch();
      if (loadMoreBtn) {
        loadMoreBtn.style.display = "block";
        loadMoreBtn.addEventListener("click", renderBatch);
      }
    });

  function renderBatch() {
    const slice = items.slice(currentIndex, currentIndex + batch);
    slice.forEach(article => {
      const card = document.createElement("a");
      card.href = article.link;
      card.target = "_blank";
      card.className = "news-card";

      if (article.image) {
        card.innerHTML = `
          <div class="news-image"><img src="${article.image}" alt="${article.title}"></div>
          <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-desc">${article.description.replace(/<[^>]*>?/gm,"").substring(0,150)}...</p>
            <div class="news-meta">${formatDate(article.pubDate, lang)}${article.source ? " – "+article.source : ""}</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="news-placeholder"><h3>${article.title}</h3></div>
          <div class="news-content">
            <p class="news-desc">${article.description.replace(/<[^>]*>?/gm,"").substring(0,150)}...</p>
            <div class="news-meta">${formatDate(article.pubDate, lang)}${article.source ? " – "+article.source : ""}</div>
          </div>
        `;
      }

      container.appendChild(card);
    });

    currentIndex += batch;
    if (currentIndex >= items.length && loadMoreBtn) loadMoreBtn.style.display = "none";
  }
}

// ================================
// FORMATAGE DATE
// ================================
function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
