/* ===========================
   news.js — injection auto d’articles (FR/EN)
   =========================== */

(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  // ✅ Tes 2 flux RSS
  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  // PFBC
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // ATIBT

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
      img:"nkok.avif", link:"article-full3-en.html", date:"2025-10-26" },

    { lang:"fr", title:"L’économie du bois au Gabon en 2025 : de la coupe au produit fini",
      description:"Analyse complète de la filière bois gabonaise : exploitation, transformation locale, exportations et durabilité.",
      img:"article4.avif", link:"article-full4-fr.html", date:"2025-11-04" },
    { lang:"en", title:"Gabon’s Wood Economy in 2025: From Harvest to Finished Products",
      description:"Comprehensive analysis of Gabon's wood sector: forestry, local processing, exports and sustainability.",
      img:"article4.avif", link:"article-full4-en.html", date:"2025-11-04" },

    { lang:"fr",
      title:"Code forestier de la République du Gabon (édition 2025 – CDBG) | Version PDF",
      description:"Version PDF du Code forestier de la République du Gabon (édition 2025 – CDBG).",
      img:"code-forestier-pdf.avif",
      link:"article-full5-fr.html",
      date:"2025-11-08"
    },
    { lang:"en",
      title:"Forest Code of the Republic of Gabon (2025 Edition – CDBG) | PDF Version",
      description:"PDF version of the Forest Code of the Republic of Gabon (2025 Edition – CDBG).",
      img:"code-forestier-pdf.avif",
      link:"article-full5-en.html",
      date:"2025-11-08"
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
    return p === "/" || /(?:^|\/)(index|en)\.html$/.test(p);
  };

  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);

  const formatDate = (iso, lang) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year:"numeric", month:"long", day:"numeric" });
    } catch { return iso; }
  };

  // --------- Styles ----------
  function ensureNoUnderlineStyle() {
    if (document.getElementById("news-card-style")) return;
    const style = document.createElement("style");
    style.id = "news-card-style";
    style.textContent = `
      .news-card { text-decoration: none !important; color: inherit !important; font-weight: 300 !important; }
      .news-card:hover, .news-card:focus { text-decoration: none !important; }
      .news-card .news-title, .news-card h3.news-title a { text-decoration: none !important; color: #28a745 !important; font-weight: 300 !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .news-card .news-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: 300 !important; }
      .news-card .news-meta { font-weight: 300 !important; }
      .news-card .read-more { display: block; color: #28a745; font-weight: 300 !important; text-decoration: underline; margin-top: 0.3em; }
    `;
    document.head.appendChild(style);
  }

  // --------- Helpers : rendu ----------
  const createCard = (a) => {
    const pageLang = getLang();
    let meta;
    if (a._isRSS && a._sourceTag === "ATIBT") {
      meta = `${formatDate(a.date, pageLang)} - ATIBT - ${SITE_BRAND}`;
    } else if (a._isRSS) {
      meta = `${formatDate(a.date, pageLang)} - PFBC - ${SITE_BRAND}`;
    } else {
      meta = `${formatDate(a.date, a.lang)} — ${SITE_BRAND}`;
    }

    const descText = a.description ? a.description.trim().slice(0, 200) : "";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          ${a.img ? `<img src="${a.img}" alt="${a.title}">` : ""}
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${descText}</p>
          <span class="read-more">Lire la suite</span>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  const createCardSafe = (a) => {
    const el = createCard(a);
    const imgBlock = el.querySelector(".news-image");
    if (a.img && imgBlock) {
      const img = imgBlock.querySelector("img");
      if (img) img.src = a.img;
    } else if (imgBlock) imgBlock.remove();
    return el;
  };

  const clearAndInject = (container, items) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(createCardSafe(a)));
  };
  const clearAndInjectMultiple = (containers, items) => {
    containers.forEach(ctn => clearAndInject(ctn, items));
  };

  // --------- Grille responsive ----------
  function enforceGridColumns(containerList) {
    const apply = () => {
      const ww = window.innerWidth || 1280;
      const cols = ww >= 1280 ? 4 : ww >= 900 ? 3 : ww >= 640 ? 2 : 1;
      containerList.forEach(ctn => {
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

  // --------- RSS multi-flux ----------
  const getRSSUrls = () => {
    const urls = [];
    if (RSS_URL_OVERRIDE_1) urls.push({ url: RSS_URL_OVERRIDE_1, tag: "PFBC" });
    if (RSS_URL_OVERRIDE_2) urls.push({ url: RSS_URL_OVERRIDE_2, tag: "ATIBT" });
    return urls;
  };

  const parseRSS = async (url, tag = "PFBC") => {
    const absUrl = new URL(url, location.href).toString();
    const res = await fetch(absUrl).catch(() => null);
    if (!res || !res.ok) return [];

    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    if (xml.querySelector("parsererror")) return [];

    const channelLink = xml.querySelector("channel > link")?.textContent?.trim() || absUrl;
    const decodeEntities = s => { if (!s) return s; const ta = document.createElement("textarea"); ta.innerHTML = s; return ta.value; };
    const toAbsolute = (raw, base) => {
      if (!raw) return null;
      if (/^https?:\/\//i.test(raw)) return raw.trim();
      if (/^\/\//.test(raw)) return ("https:" + raw).trim();
      try { return new URL(raw, base).toString(); } catch { return null; }
    };
    const firstAttrFrom = (html, attr) => {
      if (!html) return null;
      const rx = new RegExp(attr + '\\s*=\\s*"(.*?)"', "i");
      const m = html.match(rx);
      return m ? m[1] : null;
    };

    const pickImage = (it, base) => {
      const mediaContent = it.querySelector("media\\:content, content")?.getAttribute?.("url");
      const mediaThumb   = it.querySelector("media\\:thumbnail, thumbnail")?.getAttribute?.("url");
      const enclosure    = (() => {
        const enc = it.querySelector("enclosure");
        if (!enc) return null;
        const type = (enc.getAttribute("type") || "").toLowerCase();
        const url  = enc.getAttribute("url");
        return /^image\//.test(type) ? url : null;
      })();
      const contentEncoded = it.getElementsByTagName("content:encoded")?.[0]?.textContent || "";
      const desc = it.querySelector("description")?.textContent || "";
      const imgInContent = firstAttrFrom(contentEncoded, "src") || firstAttrFrom(desc, "src");

      const candidates = [mediaContent, mediaThumb, enclosure, imgInContent].filter(Boolean);
      for (const c of candidates) {
        const abs = toAbsolute(decodeEntities(c), base);
        if (abs) return abs;
      }
      return "";
    };

    const items = Array.from(xml.querySelectorAll("item"));
    return items.map(it => {
      const title = it.querySelector("title")?.textContent?.trim() || "";
      const linkRaw = it.querySelector("link")?.textContent?.trim() || "#";
      const descRaw = it.querySelector("description")?.textContent || "";
      const img = pickImage(it, channelLink);
      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "1970-01-01";

      return {
        title,
        description: decodeEntities(descRaw).replace(/<[^>]+>/g, "").trim(),
        img,
        link: linkRaw,
        date: dateISO,
        _isRSS: true,
        _sourceTag: tag
      };
    });
  };

  // --------- Injection principale ----------
  const inject = async () => {
    ensureNoUnderlineStyle();
    const lang = getLang();

    const previewTargets = findPreviewContainers();
    const magazineTargets = findMagazineContainers();
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    const localByLang = STATIC_ARTICLES.filter(a => a.lang === lang).sort((a, b) => (a.date < b.date ? 1 : -1));
    const localsForPage = isNewsListingPage()
      ? localByLang.slice(0, NEWS_LOCAL_LIMIT)
      : localByLang.slice(0, HOME_LOCAL_LIMIT);

    clearAndInjectMultiple(previewTargets, localsForPage);
    clearAndInjectMultiple(magazineTargets, localByLang);

    const rssConfigs = getRSSUrls();
    if (rssConfigs.length) {
      try {
        const allRssArrays = await Promise.all(rssConfigs.map(cfg => parseRSS(cfg.url, cfg.tag).catch(() => [])));
        const rssItems = allRssArrays.flat();
        const rssForPage = isNewsListingPage()
          ? rssItems.slice(0, NEWS_RSS_LIMIT)
          : rssItems.slice(0, HOME_RSS_LIMIT);
        const mergedForPreview = [...rssForPage, ...localsForPage]
          .sort((a, b) => (a.date < b.date ? 1 : -1));
        clearAndInjectMultiple(previewTargets, mergedForPreview);
      } catch { /* fallback : rien à faire */ }
    }
  };

  function findPreviewContainers() {
    const selectors = [
      "#latest-news-en","#latest-news","#news-en","#news",
      'section[id*="news" i] .news-grid','section[id*="latest" i] .news-grid',
      ".latest-news .news-grid",".news-section .news-grid",".news-grid"
    ];
    const found = selectors.map(sel => document.querySelector(sel)).filter(Boolean);
    if (found.length) return found;
    const section = document.createElement("section");
    section.className = "news-section";
    section.id = "latest-news";
    const grid = document.createElement("div");
    grid.className = "news-grid";
    section.appendChild(grid);
    (document.querySelector("main") || document.body).appendChild(section);
    return [grid];
  }

  function findMagazineContainers() {
    const selectors = [".articles-container", "#magazine .news-grid", "#articles .news-grid"];
    return selectors.map(sel => document.querySelector(sel)).filter(Boolean);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
