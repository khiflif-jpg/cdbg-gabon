// ================================
// ARTICLES STATIQUES
// ================================
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html#article1",
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières. Conscient des enjeux environnementaux et économiques, le gouvernement gabonais, sous l’impulsion du Ministère des Eaux et Forêts, intensifie sa lutte contre l’exploitation illégale du bois et la déforestation.</p>
      <p>Depuis le début de l’année, plusieurs initiatives concrètes ont été mises en œuvre pour renforcer le contrôle sur le terrain, notamment la surveillance accrue des concessions forestières et la répression des activités illégales. Le Ministère des Eaux et Forêts coordonne inspections régulières, patrouilles fluviales et collaborations avec des ONG spécialisées pour garantir la légalité de la filière bois et protéger la biodiversité.</p>
      <p>📌 Certification PAFC et FSC et traçabilité numérique<br>
      Toutes les concessions forestières visent désormais une certification durable selon les normes PAFC (Programme de Certification Forestière Pan-Africaine) et FSC (Forest Stewardship Council). Ces certifications garantissent la traçabilité, la légalité et la durabilité du bois produit, valorisant la filière gabonaise sur les marchés internationaux. Parallèlement, la traçabilité numérique est assurée par le Système National de Traçabilité du Bois (SNTBG), permettant de suivre chaque grume depuis l’exploitation jusqu’à l’exportation, et de détecter toute irrégularité avec une transparence totale.</p>
      <p>🤝 Partenariats avec les ONG et acteurs internationaux<br>
      Le succès de ces initiatives repose également sur la collaboration avec des ONG de renom. Parmi elles, Brainforest, The Nature Conservancy (TNC) et WWF Gabon jouent un rôle clé dans la formation, la surveillance environnementale et la promotion des pratiques durables. Ces organisations apportent leur expertise technique et leur notoriété internationale, renforçant ainsi l’image du Gabon comme acteur responsable dans la protection des forêts équatoriales.</p>
      <p>🌍 Valorisation internationale et engagements récents<br>
      Le Gabon a récemment accueilli plusieurs rencontres internationales, notamment des séminaires en Europe sur la lutte contre la déforestation illégale et la valorisation de sa chaîne de bois légale. Ces événements ont permis de consolider des partenariats avec des acteurs publics et privés, et de promouvoir les bois certifiés PAFC et FSC sur les marchés mondiaux.</p>
      <p>📌 En conclusion<br>
      Une filière bois moderne, légale et durable est en marche au Gabon. Grâce aux certifications PAFC/FSC, à la traçabilité numérique SNTBG et au renforcement du contrôle par le Ministère des Eaux et Forêts, le pays se positionne comme un modèle africain de gestion forestière responsable. La CDBG adhère pleinement à cette politique gouvernementale, contribuant ainsi à la crédibilité et à la valorisation de la filière bois gabonaise sur les marchés internationaux.</p>
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
      <p>Gabon, with forests covering 88% of its territory, is establishing itself as a continental leader in sustainable forest management. Aware of environmental and economic challenges, the Gabonese government, under the guidance of the Ministry of Water and Forests, is intensifying its fight against illegal logging and deforestation.</p>
      <p>Since the beginning of the year, concrete measures have been implemented to strengthen on-site monitoring, including increased surveillance of forest concessions and repression of illegal activities. The Ministry coordinates regular inspections, river patrols, and collaborations with specialized NGOs to ensure legality in the timber sector and protect biodiversity.</p>
      <p>📌 PAFC and FSC Certification and Digital Traceability<br>
      All forest concessions now aim for sustainable certification according to PAFC (Pan-African Forest Certification Program) and FSC (Forest Stewardship Council) standards. These certifications guarantee traceability, legality, and sustainability of the wood, enhancing Gabon's timber sector internationally. In parallel, digital traceability is ensured by the National Timber Traceability System (SNTBG), tracking every log from harvest to export, with full transparency and irregularity detection.</p>
      <p>🤝 Partnerships with NGOs and International Actors<br>
      The success of these initiatives also relies on collaboration with renowned NGOs. Brainforest, The Nature Conservancy (TNC), and WWF Gabon play key roles in training, environmental monitoring, and promoting sustainable practices, reinforcing Gabon's image as a responsible actor in equatorial forest protection.</p>
      <p>🌍 International Recognition and Recent Commitments<br>
      Gabon recently hosted several international meetings, including seminars in Europe on combating illegal deforestation and promoting its legal timber chain. These events consolidated partnerships with public and private actors and promoted PAFC and FSC certified wood on global markets.</p>
      <p>📌 Conclusion<br>
      A modern, legal, and sustainable timber sector is underway in Gabon. Thanks to PAFC/FSC certifications, the SNTBG digital traceability system, and strengthened oversight by the Ministry of Water and Forests, the country positions itself as an African model of responsible forest management. CDBG fully supports this government policy, contributing to credibility and valorization of Gabonese timber on international markets.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// ================================
// INJECTION DES ARTICLES STATIQUES EN HAUT
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
// CHARGEMENT RSS + INJECTION DES STATIQUES
// ================================
function loadNews({ xmlUrl, containerId, loadMoreBtnId = null, batch = 5, lang = "fr" }) {
  const container = document.getElementById(containerId);
  const loadMoreBtn = loadMoreBtnId ? document.getElementById(loadMoreBtnId) : null;
  let items = [];
  let currentIndex = 0;

  if (!document.getElementById("news-style")) {
    const style = document.createElement("style");
    style.id = "news-style";
    style.textContent = `
      .news-container, .news-grid { display: grid; gap: 20px; grid-template-columns: repeat(1, 1fr); }
      @media(min-width:600px) { .news-container, .news-grid { grid-template-columns: repeat(3,1fr); } }
      @media(min-width:1024px){ .news-container, .news-grid { grid-template-columns: repeat(4,1fr); } }
      .news-card { display:flex; flex-direction:column; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08); transition: transform 0.2s ease, box-shadow 0.2s ease; text-decoration:none; color:inherit; }
      .news-card:hover { transform:translateY(-4px); box-shadow:0 6px 16px rgba(0,0,0,0.12); }
      .news-image { width:100%; height:180px; overflow:hidden; background:#f0f0f0; }
      .news-image img { width:100%; height:100%; object-fit:cover; display:block; }
      .news-placeholder { width:100%; height:180px; background:#3D6B35; color:#fff; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px; }
      .news-placeholder h3 { font-size:1rem; margin:0; line-height:1.4em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      .news-content { padding:15px; display:flex; flex-direction:column; flex-grow:1; }
      .news-title { font-size:1rem; font-weight:bold; margin:0 0 8px; line-height:1.4em; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
      .news-desc { font-size:0.9rem; color:#666; margin:0 0 10px; line-height:1.4em; }
      .news-meta { font-size:0.8rem; color:#999; margin-top:auto; }
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

function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
