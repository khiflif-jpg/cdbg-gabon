/* ===========================
   news.js — injection auto d’articles (FR/EN)
   =========================== */

(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;        // nb d’articles "maison" sur ACCUEILS
  const HOME_RSS_LIMIT   = Infinity;  // nb d’articles RSS sur ACCUEILS
  const NEWS_LOCAL_LIMIT = Infinity;  // nb d’articles "maison" sur ACTUALITÉS
  const NEWS_RSS_LIMIT   = Infinity;  // nb d’articles RSS sur ACTUALITÉS
  const SITE_BRAND = "CDBG Magazine";

  // Ton flux RSS (prioritaire)
  const RSS_URL_OVERRIDE = "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml";

  // --------- Données statiques centralisées ----------
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
      img:"nkok.avif", link:"article-full3-en.html", date:"2025-10-26" }
  ];

  // --------- Helpers : page & langue ----------
  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    if (htmlLang.startsWith("fr")) return "fr";
    const href = (location.href || "").toLowerCase();
    if (href.includes("-en") || href.endsWith("/en.html") || href.includes("/en.html")) return "en";
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

  // --------- Helpers : rendu ----------
  const createCard = (a) => {
    const isRSS = a._isRSS === true;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          <img src="${a.img}" alt="${a.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${a.description}</p>
          <div class="news-meta">${formatDate(a.date, a.lang)} — ${SITE_BRAND}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  const createCardSafe = (a) => {
    const el = createCard(a);
    if (!a.img) {
      const imgBlock = el.querySelector(".news-image");
      if (imgBlock) imgBlock.remove();
    }
    return el;
  };

  const clearAndInject = (container, items, safe = false) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach((a) => container.appendChild(safe ? createCardSafe(a) : createCard(a)));
  };

  function clearAndInjectMultiple(containers, items, safe = false) {
    containers.forEach(ctn => clearAndInject(ctn, items, safe));
  }

  // --------- Grille : colonnes 3/2/1 ----------
  function enforceGridColumns(containerList) {
    const apply = () => {
      const ww = window.innerWidth || 1024;
      const cols = ww >= 1024 ? 3 : ww >= 640 ? 2 : 1;
      containerList.forEach((ctn) => {
        if (!ctn) return;
        ctn.style.display = "grid";
        ctn.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        const style = getComputedStyle(ctn);
        if (!style.gap || style.gap === "0px") ctn.style.gap = "24px";
      });
    };
    apply();
    window.addEventListener("resize", apply);
  }

  // --------- RSS ----------
  const getRSSUrl = () => {
    if (RSS_URL_OVERRIDE) return RSS_URL_OVERRIDE;
    const link = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    return link ? link.getAttribute("href") : null;
  };

  const parseRSS = async (url) => {
    const absUrl = new URL(url, location.href).toString();
    const res = await fetch(absUrl).catch(() => null);
    if (!res || !res.ok) return [];
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    if (xml.querySelector("parsererror")) return [];

    const channelLink = xml.querySelector("channel > link")?.textContent?.trim() || absUrl;
    const items = Array.from(xml.querySelectorAll("item"));

    return items.map((it) => {
      const title = it.querySelector("title")?.textContent?.trim() || "";
      const rawLink = it.querySelector("link")?.textContent?.trim() || "#";
      let link;
      try { link = new URL(rawLink, channelLink).toString(); }
      catch { link = rawLink; }
      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const description = it.querySelector("description")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "1970-01-01";
      return { title, description, img:"", link, date:dateISO, _isRSS:true };
    });
  };

  // --------- Conteneurs : détection robuste + fallback création ----------
  function findPreviewContainers() {
    const candidates = [
      "#latest-news-en",
      "#latest-news",
      "#news-en",
      "#news",
      'section[id*="news" i] .news-grid',
      'section[id*="latest" i] .news-grid',
      ".latest-news .news-grid",
      ".news-section .news-grid",
      ".news-grid"
    ];
    const found = Array.from(new Set(
      candidates.map(sel => document.querySelector(sel)).filter(Boolean)
    ));
    if (found.length > 0) return found;

    // 🔧 Fallback : créer un conteneur propre si aucun trouvé (utile pour en.html)
    const section = document.createElement("section");
    section.className = "news-section";
    section.id = "latest-news"; // neutre
    const grid = document.createElement("div");
    grid.className = "news-grid";
    section.appendChild(grid);

    // essaie d'insérer dans <main>, sinon avant la fin du <body>
    const main = document.querySelector("main") || document.body;
    main.appendChild(section);
    return [grid];
  }

  function findMagazineContainers() {
    const candidates = [".articles-container", "#magazine .news-grid", "#articles .news-grid"];
    return Array.from(new Set(
      candidates.map(sel => document.querySelector(sel)).filter(Boolean)
    ));
  }

  // --------- Injection principale ----------
  const inject = async () => {
    const lang = getLang();

    // Conteneurs
    const previewTargets = findPreviewContainers();   // Accueils + Actualités
    const magazineTargets = findMagazineContainers(); // Magazine

    // Colonnes sur toutes les grilles identifiées
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    // 1) Tes articles (par langue)
    const localByLang = STATIC_ARTICLES
      .filter(a => a.lang === lang)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    // Limites locales selon la page
    const localForHome = localByLang.slice(0, HOME_LOCAL_LIMIT);
    const localForNews = localByLang.slice(0, NEWS_LOCAL_LIMIT);
    const localsForPage = isNewsListingPage() ? localForNews : localForHome;

    // Injection immédiate : preview & magazine
    clearAndInjectMultiple(previewTargets, localsForPage, false);
    clearAndInjectMultiple(magazineTargets, localByLang, false); // magazine = tes articles uniquement

    // 2) RSS : charge et fusionne
    const rssURL = getRSSUrl();
    if (rssURL) {
      try {
        const rssItems = await parseRSS(rssURL); // pas de filtre de langue
        const rssForHome = rssItems.slice(0, HOME_RSS_LIMIT);
        const rssForNews = rssItems.slice(0, NEWS_RSS_LIMIT);
        const rssForPage = isNewsListingPage() ? rssForNews : rssForHome;

        const mergedForPreview = [...rssForPage, ...localsForPage]
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        clearAndInjectMultiple(previewTargets, mergedForPreview, true); // réinjection safe (ouvre les liens RSS en _blank)
      } catch {
        // on garde les locales déjà injectées
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
