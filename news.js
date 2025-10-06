// ================================
// ARTICLES STATIQUES
// ================================
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    linkPreview: "articles.html#article1",
    linkFull: "articles-francais.html#article1",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières.</p>
      <h3>Certification PAFC et FSC et traçabilité numérique</h3>
      <p>Toutes les concessions forestières visent désormais une certification durable selon les normes PAFC et FSC...</p>
      <h3>Partenariats avec les ONG</h3>
      <p>Brainforest, TNC et WWF Gabon jouent un rôle clé dans la formation et la surveillance environnementale.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

const staticArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Its Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    linkPreview: "articles-en.html#article1",
    linkFull: "articles-anglais.html#article1",
    description: `
      <p>Gabon, with forests covering 88% of its territory, is establishing itself as a continental leader in sustainable forest management.</p>
      <h3>PAFC and FSC Certification and Digital Traceability</h3>
      <p>All forest concessions now aim for sustainable certification according to PAFC and FSC standards...</p>
      <h3>Partnerships with NGOs</h3>
      <p>Brainforest, TNC, and WWF Gabon play key roles in training and environmental monitoring.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// ================================
// INJECTION DES ARTICLES
// ================================
/**
 * lang: "fr" ou "en"
 * container: element DOM
 * full: boolean, true si page article complet
 */
function injectStaticArticles(lang, container, full = false) {
  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;
  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";

    const descContent = full ? article.description : article.description.replace(/<[^>]*>?/gm,"").substring(0,150) + "...";

    const link = full ? article.linkFull : article.linkPreview;

    card.innerHTML = `
      <div class="news-image">
        <a href="${link}"><img src="${article.image}" alt="${article.title}"></a>
      </div>
      <h1 class="news-title"><a href="${link}" style="text-decoration:none;color:inherit;">${article.title}</a></h1>
      <div class="news-desc">${descContent}</div>
      <div class="news-meta">${formatDate(article.pubDate, lang)}</div>
      <div class="news-source">Source : CDBG – Compagnie Durable du Bois au Gabon</div>
    `;

    container.appendChild(card);
  });
}

function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang==="fr"?"fr-FR":"en-US",{year:"numeric",month:"short",day:"numeric"});
}

// ================================
// FONCTION RSS (optionnelle)
// ================================
function loadNews({ xmlUrl, containerId, loadMoreBtnId = null, batch = 5, lang = "fr" }) {
  const container = document.getElementById(containerId);
  const loadMoreBtn = loadMoreBtnId ? document.getElementById(loadMoreBtnId) : null;
  let items = [];
  let currentIndex = 0;

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

      const descPreview = article.description.replace(/<[^>]*>?/gm,"").substring(0,150) + "...";

      if (article.image) {
        card.innerHTML = `
          <div class="news-image"><img src="${article.image}" alt="${article.title}"></div>
          <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-desc">${descPreview}</p>
            <div class="news-meta">${formatDate(article.pubDate, lang)}${article.source ? " – "+article.source : ""}</div>
            <div class="news-source">Source : CDBG – Compagnie Durable du Bois au Gabon</div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="news-placeholder"><h3>${article.title}</h3></div>
          <div class="news-content">
            <p class="news-desc">${descPreview}</p>
            <div class="news-meta">${formatDate(article.pubDate, lang)}${article.source ? " – "+article.source : ""}</div>
            <div class="news-source">Source : CDBG – Compagnie Durable du Bois au Gabon</div>
          </div>
        `;
      }

      container.appendChild(card);
    });
    currentIndex += batch;
    if (currentIndex >= items.length && loadMoreBtn) loadMoreBtn.style.display = "none";
  }
}
