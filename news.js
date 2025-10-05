// ARTICLES STATIQUES
const staticArticlesFR = [
  {
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "#",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain en matière de gestion durable des ressources forestières...</p>
      <p>Le 19 août 2025, deux embarcations ont été remises au ministère des Eaux et Forêts, grâce à l’ONG The Nature Conservancy dans le cadre du programme CAFI...</p>
      <p><strong>🤝 La CDBG, un acteur pleinement engagé</strong><br>
      Déjà certifiée PAFC, la Compagnie des Bois du Gabon adhère pleinement à la politique nationale de traçabilité (SNTBG), garantissant la légalité et la durabilité de ses produits bois.</p>
      <p><strong>📌 En conclusion</strong><br>
      Une filière bois moderne et durable est en marche, soutenue par la CDBG en harmonie avec les réformes nationales.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const staticArticlesEN = [
  {
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "#",
    description: `
      <p>Gabon, with forests covering 88% of its land, has become a continental leader in sustainable forestry...</p>
      <p>On August 19, 2025, two patrol boats were donated to the Ministry of Water and Forests via TNC and the CAFI program, to enhance river surveillance against illegal logging.</p>
      <p><strong>🤝 CDBG, a Committed Partner</strong><br>
      Already PAFC certified, Compagnie des Bois du Gabon (CDBG) fully supports the national traceability system (SNTBG), ensuring legality and sustainability.</p>
      <p><strong>📌 Conclusion</strong><br>
      A modern, transparent timber sector is emerging—CDBG is at its core, aligned with national reforms.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// INJECTE LES ARTICLES STATIQUES
function injectStaticArticles(lang, container) {
  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;
  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <div class="news-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <div class="news-desc">${article.description}</div>
        <div class="news-meta">${new Date(article.pubDate).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
      </div>
    `;
    container.prepend(card);
  });
}

// CHARGE LES ARTICLES RSS + INJECTION DES STATIQUES
function loadNews({ xmlUrl, containerId, loadMoreBtnId = null, batch = 5, lang = "fr" }) {
  const container = document.getElementById(containerId);
  const loadMoreBtn = loadMoreBtnId ? document.getElementById(loadMoreBtnId) : null;
  let items = [];
  let currentIndex = 0;

  if (!document.getElementById("news-style")) {
    const style = document.createElement("style");
    style.id = "news-style";
    style.textContent = `
      .news-container, .news-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(1, 1fr);
      }
      @media(min-width: 600px) {
        .news-container, .news-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media(min-width: 1024px) {
        .news-container, .news-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }
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
      .news-image {
        width: 100%;
        height: 180px;
        overflow: hidden;
        background: #f0f0f0;
      }
      .news-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .news-placeholder {
        width: 100%;
        height: 180px;
        background: #3D6B35;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px;
      }
      .news-placeholder h3 {
        font-size: 1rem;
        margin: 0;
        line-height: 1.4em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
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
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .news-desc {
        font-size: 0.9rem;
        color: #666;
        margin: 0 0 10px;
        line-height: 1.4em;
      }
      .news-meta {
        font-size: 0.8rem;
        color: #999;
        margin-top: auto;
      }
    `;
    document.head.appendChild(style);
  }

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
        if (enclosure) {
          image = enclosure.getAttribute("url");
        } else {
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
          <div class="news-image">
            <img src="${article.image}" alt="">
          </div>
          <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-desc">${article.description.replace(/<[^>]*>?/gm, "").substring(0, 150)}...</p>
            <div class="news-meta">
              ${formatDate(article.pubDate, lang)} ${article.source ? " – " + article.source : ""}
            </div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="news-placeholder">
            <h3>${article.title}</h3>
          </div>
          <div class="news-content">
            <p class="news-desc">${article.description.replace(/<[^>]*>?/gm, "").substring(0, 150)}...</p>
            <div class="news-meta">
              ${formatDate(article.pubDate, lang)} ${article.source ? " – " + article.source : ""}
            </div>
          </div>
        `;
      }

      container.appendChild(card);
    });

    currentIndex += batch;
    if (currentIndex >= items.length && loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
  }

  // Injecte l’article statique en haut de page
  injectStaticArticles(lang, container);
}

function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
