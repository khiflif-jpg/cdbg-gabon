/* ===========================
   news.js — injection auto d’articles (FR/EN)
   — Pas de modif HTML nécessaire
   =========================== */

(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;    // nb d’articles "maison" sur les ACCUEILS
  const HOME_RSS_LIMIT   = Infinity; // nb d’articles RSS sur les ACCUEILS
  const NEWS_LOCAL_LIMIT = Infinity; // nb d’articles "maison" sur ACTUALITÉS
  const NEWS_RSS_LIMIT   = Infinity; // nb d’articles RSS sur ACTUALITÉS
  const SITE_BRAND = "CDBG Magazine";

  // --------- Données statiques centralisées ----------
  const STATIC_ARTICLES = [
    // Article 1
    {
      lang: "fr",
      title: "Le Gabon renforce sa politique forestière",
      description:
        "Le Gabon, riche de ses forêts équatoriales, s’impose comme un leader africain dans la gestion durable des ressources forestières.",
      img: "article1.avif",
      link: "article-full-fr.html",
      date: "2025-09-12"
    },
    {
      lang: "en",
      title: "Gabon strengthens its forest policy",
      description:
        "Gabon, rich in its equatorial forests, is becoming a leader in sustainable forest management and biodiversity preservation.",
      img: "article1.avif",
      link: "article-full-en.html",
      date: "2025-09-12"
    },

    // Article 2 (images = article2.avif)
    {
      lang: "fr",
      title:
        "Le secteur du bois au Gabon : pilier de diversification, d’emploi et de compétitivité durable",
      description:
        "Panorama des atouts économiques du secteur bois au Gabon, entre transformation locale, emplois et durabilité.",
      img: "article2.avif",
      link: "article-full2-fr.html",
      date: "2025-09-20"
    },
    {
      lang: "en",
      title:
        "Gabon’s wood sector: a pillar for diversification, jobs and sustainable competitiveness",
      description:
        "Overview of Gabon’s wood industry: local processing, job creation and long-term sustainability.",
      img: "article2.avif",
      link: "article-full2-en.html",
      date: "2025-09-20"
    },

    // Article 3 (images = nkok.avif)
    {
      lang: "fr",
      title: "Nkok : vitrine du développement industriel durable du Gabon",
      description:
        "La Zone Économique Spéciale de Nkok illustre la réussite du modèle gabonais alliant industrialisation, durabilité et emploi local.",
      img: "nkok.avif",
      link: "article-full3-fr.html",
      date: "2025-10-26"
    },
    {
      lang: "en",
      title: "Nkok: showcase of Gabon’s sustainable industrial development",
      description:
        "The Nkok Special Economic Zone highlights Gabon’s success in combining industrial growth, sustainability, and local employment.",
      img: "nkok.avif",
      link: "article-full3-en.html",
      date: "2025-10-26"
    }
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
    // index.html, en.html, ou racine "/"
    return p === "/" || /(?:^|\/)(index|en)\.html$/.test(p);
  };

  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);

  const formatDate = (iso, lang) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return iso;
    }
  };

  // --------- Helpers : rendu ----------
  const createCard = (a) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card">
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

  // pour éviter d’afficher des cartes vides côté image pour le RSS
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
    items.forEach((a) =>
      container.appendChild(safe ? createCardSafe(a) : createCard(a))
    );
  };
  function clearAndInjectMultiple(containers, items, safe = false) {
    containers.forEach(ctn => clearAndInject(ctn, items, safe));
  }

  // --------- Grille : forcer proprement les colonnes (3/2/1) ----------
  function enforceGridColumns(containerList) {
    const apply = () => {
      const ww = window.innerWidth || 1024;
      const cols = ww >= 1024 ? 3 : ww >= 640 ? 2 : 1;
      containerList.forEach((ctn) => {
        if (!ctn) return;
        const style = getComputedStyle(ctn);
        // on force une grille si ce n’est pas déjà OK
        ctn.style.display = "grid";
        ctn.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        if (!style.gap || style.gap === "0px") ctn.style.gap = "24px";
      });
    };
    apply();
    window.addEventListener("resize", apply);
  }

  // --------- RSS ----------
  const findRSSLink = () => {
    const link = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    return link ? link.getAttribute("href") : null;
  };

  const parseRSS = async (url) => {
    const res = await fetch(url).catch(() => null);
    if (!res || !res.ok) return [];
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));

    return items.map((it) => {
      const title = it.querySelector("title")?.textContent?.trim() || "";
      const link = it.querySelector("link")?.textContent?.trim() || "#";
      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const description = it.querySelector("description")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "1970-01-01";
      return {
        // ⚠️ pas de "lang" ici → le RSS doit apparaître en FR et EN
        title,
        description,
        img: "", // pas d’image fiable dans RSS générique
        link,
        date: dateISO,
        _isRSS: true
      };
    });
  };

  // --------- Injection principale ----------
  const inject = async () => {
    const lang = getLang();

    // Conteneurs "aperçu/actualités" (accueils + pages actualités)
    const previewTargets = Array.from(new Set([
      document.querySelector("#latest-news-en"),     // en.html éventuel
      document.querySelector("#latest-news"),        // index.html / actualites.html
      document.querySelector(".latest-news .news-grid"),
      document.querySelector(".news-section .news-grid"),
      document.querySelector(".news-grid")
    ].filter(Boolean)));

    // Conteneurs "magazine" (articles.html / articles-en.html)
    const magazineTargets = Array.from(new Set([
      document.querySelector(".articles-container"),
      document.querySelector("#magazine .news-grid"),
      document.querySelector("#articles .news-grid")
    ].filter(Boolean)));

    // Colonnes (3/2/1) sur toutes les grilles identifiées
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    // 1) Données locales (tes articles) par langue
    const localByLang = STATIC_ARTICLES
      .filter(a => a.lang === lang)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    // Injection immédiate des locales (preview + magazine)
    // - ACCUEILS: on limite tes articles à 20 ; RSS arrivera ensuite (infini)
    // - ACTUALITÉS: on mettra tout ensuite (infini)
    const localForHome = localByLang.slice(0, HOME_LOCAL_LIMIT);
    const localForNews = localByLang.slice(0, NEWS_LOCAL_LIMIT);

    const localsForPage = isNewsListingPage() ? localForNews : localForHome;
    clearAndInjectMultiple(previewTargets, localsForPage, false);
    clearAndInjectMultiple(magazineTargets, localByLang, false); // magazine = tes articles seulement

    // 2) Fusion avec RSS si dispo (RSS affiché dans FR et EN pour preview/actualités)
    const rssURL = findRSSLink();
    if (rssURL) {
      try {
        const rssItems = await parseRSS(rssURL); // pas de filtre de langue
        const rssForHome = rssItems.slice(0, HOME_RSS_LIMIT);
        const rssForNews = rssItems.slice(0, NEWS_RSS_LIMIT);

        const rssForPage = isNewsListingPage() ? rssForNews : rssForHome;

        // Fusion pour preview/actualités :
        // Accueils → RSS (infini) + tes 20 articles
        // Actualités → RSS (infini) + tous tes articles
        const mergedForPreview = [...rssForPage, ...localsForPage]
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        // Ré-injecte UNIQUEMENT les previewTargets en "safe"
        clearAndInjectMultiple(previewTargets, mergedForPreview, true);
        // magazineTargets : on ne touche pas (pas de RSS)
      } catch {
        // en cas d’échec RSS, on garde les locales déjà injectées
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
