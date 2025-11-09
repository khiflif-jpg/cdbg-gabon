/* ===========================
   news.js — version optimisée (titres & descriptions tronqués + style vert)
   =========================== */

(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  // ✅ Flux RSS
  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  // PFBC
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // ATIBT

  // --------- Données locales ----------
  const STATIC_ARTICLES = [
    { lang:"fr", title:"Le Gabon renforce sa politique forestière",
      description:"Le Gabon, riche de ses forêts équatoriales, s’impose comme un leader africain dans la gestion durable des ressources forestières.",
      img:"article1.avif", link:"article-full-fr.html", date:"2025-09-12" },
    { lang:"en", title:"Gabon strengthens its forest policy",
      description:"Gabon, rich in its equatorial forests, is becoming a leader in sustainable forest management and biodiversity preservation.",
      img:"article1.avif", link:"article-full-en.html", date:"2025-09-12" },
    { lang:"fr", title:"Le secteur du bois au Gabon : pilier de diversification, d’emploi et de compétitivité durable",
      description:"Panorama des atouts économiques du secteur bois au Gabon, entre transformation locale, emplois et durabilité.",
      img:"article2.avif", link:"article-full2-fr.html", date:"2025-09-20" },
    { lang:"en", title:"Gabon’s wood sector: a pillar for diversification, jobs and sustainable competitiveness",
      description:"Overview of Gabon’s wood industry: local processing, job creation and long-term sustainability.",
      img:"article2.avif", link:"article-full2-en.html", date:"2025-09-20" },
    { lang:"fr", title:"Nkok : vitrine du développement industriel durable du Gabon",
      description:"La Zone Économique Spéciale de Nkok illustre la réussite du modèle gabonais alliant industrialisation, durabilité et emploi local.",
      img:"nkok.avif", link:"article-full3-fr.html", date:"2025-10-26" },
    { lang:"en", title:"Nkok: showcase of Gabon’s sustainable industrial development",
      description:"The Nkok Special Economic Zone highlights Gabon’s success in combining industrial growth, sustainability, and local employment.",
      img:"nkok.avif", link:"article-full3-en.html", date:"2025-10-26" },
    { lang:"fr", title:"L’économie du bois au Gabon en 2025 : de la coupe au produit fini",
      description:"Analyse complète de la filière bois gabonaise : exploitation, transformation locale, exportations et durabilité.",
      img:"article4.avif", link:"article-full4-fr.html", date:"2025-11-04" },
    { lang:"en", title:"Gabon’s Wood Economy in 2025: From Harvest to Finished Products",
      description:"Comprehensive analysis of Gabon's wood sector: forestry, local processing, exports and sustainability.",
      img:"article4.avif", link:"article-full4-en.html", date:"2025-11-04" },
    { lang:"fr", title:"Code forestier de la République du Gabon (édition 2025 – CDBG) | Version PDF",
      description:"Version PDF du Code forestier de la République du Gabon (édition 2025 – CDBG).",
      img:"code-forestier-pdf.avif", link:"article-full5-fr.html", date:"2025-11-08" },
    { lang:"en", title:"Forest Code of the Republic of Gabon (2025 Edition – CDBG) | PDF Version",
      description:"PDF version of the Forest Code of the Republic of Gabon (2025 Edition – CDBG).",
      img:"code-forestier-pdf.avif", link:"article-full5-en.html", date:"2025-11-08" }
  ];

  // --------- Helpers langue ----------
  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    return "fr";
  };

  const isHomePage = () => {
    const p = (location.pathname || "").toLowerCase();
    return p === "/" || /(?:^|\/)(index|en)\.html$/.test(p);
  };

  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);

  const formatDate = (iso, lang) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year:"numeric", month:"long", day:"numeric" });
    } catch { return iso; }
  };

  // --------- Carte news ----------
  const createCardSafe = (a) => {
    const pageLang = getLang();
    const meta = a._isRSS
      ? `${formatDate(a.date, pageLang)} — ${a._sourceTag} — ${SITE_BRAND}`
      : `${formatDate(a.date, pageLang)} — ${SITE_BRAND}`;
    const desc = (a.description || "").trim();
    const safeDesc = desc
      ? `${desc.slice(0, 200)}... <a href="${a.link}" target="_blank" class="read-more">Lire la suite</a>`
      : `<a href="${a.link}" target="_blank" class="read-more">Lire la suite</a>`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank"' : ""}>
        <div class="news-image">
          <img src="${a.img || ""}" alt="${a.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${safeDesc}</p>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  // --------- Récupération RSS ----------
  const getRSSUrls = () => [
    { url: RSS_URL_OVERRIDE_1, tag: "PFBC" },
    { url: RSS_URL_OVERRIDE_2, tag: "ATIBT" }
  ];

  const parseRSS = async (url, tag = "RSS") => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const items = Array.from(xml.querySelectorAll("item"));
      return items.map(it => ({
        title: it.querySelector("title")?.textContent?.trim() || "",
        description: it.querySelector("description")?.textContent?.trim() || "",
        link: it.querySelector("link")?.textContent?.trim() || "#",
        img: "",
        date: new Date(it.querySelector("pubDate")?.textContent || "").toISOString().slice(0, 10),
        _isRSS: true,
        _sourceTag: tag
      }));
    } catch { return []; }
  };

  // --------- Injection ----------
  const inject = async () => {
    const lang = getLang();
    const previewContainers = document.querySelectorAll(".news-grid, #latest-news, #news, #news-en");
    const localArticles = STATIC_ARTICLES.filter(a => a.lang === lang);
    const rssData = (await Promise.all(getRSSUrls().map(r => parseRSS(r.url, r.tag)))).flat();
    const allItems = [...localArticles, ...rssData].sort((a, b) => b.date.localeCompare(a.date));

    previewContainers.forEach(c => {
      c.innerHTML = "";
      allItems.forEach(a => c.appendChild(createCardSafe(a)));
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();

  /* --- Styles titre/description + lire la suite --- */
  const styleExtra = document.createElement("style");
  styleExtra.textContent = `
    .news-title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .news-desc {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .read-more {
      color: #007a3d !important;
      text-decoration: none !important;
      display: inline-block;
      margin-top: 4px;
    }
    .read-more:hover {
      text-decoration: underline !important;
    }
  `;
  document.head.appendChild(styleExtra);
})();
