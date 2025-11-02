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

  // ✅ Tes 2 flux RSS
  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml";  // flux 1
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // flux 2 (payant)

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

  // --------- Styles anti-soulignement (injectés une seule fois) ----------
  function ensureNoUnderlineStyle() {
    if (document.getElementById("news-card-style")) return;
    const style = document.createElement("style");
    style.id = "news-card-style";
    style.textContent = `
      .news-card { text-decoration: none !important; color: inherit !important; }
      .news-card:hover, .news-card:focus { text-decoration: none !important; }
      .news-card .news-title, .news-card h3.news-title a { text-decoration: none !important; color: inherit !important; }
    `;
    document.head.appendChild(style);
  }

  // --------- Helpers : rendu ----------
  const createCard = (a) => {
    const isRSS = a._isRSS === true;
    const pageLang = getLang();
    const meta = isRSS
      ? `${formatDate(a.date, pageLang)} - PFBC - ${SITE_BRAND}`
      : `${formatDate(a.date, a.lang)} — ${SITE_BRAND}`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          <img src="${a.img || ""}" alt="${a.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${a.description}</p>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  // garde l'image si on en a une, sinon supprime proprement le bloc image
  const createCardSafe = (a) => {
    const el = createCard(a);
    const hasImg = a.img && String(a.img).trim().length > 0;
    const imgBlock = el.querySelector(".news-image");
    if (!hasImg && imgBlock) imgBlock.remove();
    else if (hasImg) {
      const img = imgBlock?.querySelector("img");
      if (img) img.src = a.img;
    }
    return el;
  };

  const clearAndInject = (container, items, safe = false) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach((a) => container.appendChild(safe ? createCardSafe(a) : createCard(a)));
  };
  const clearAndInjectMultiple = (containers, items, safe = false) => {
    containers.forEach(ctn => clearAndInject(ctn, items, safe));
  };

  // --------- Grille : 4/3/2/1 colonnes ----------
  function enforceGridColumns(containerList) {
    const apply = () => {
      const ww = window.innerWidth || 1280;
      const cols = ww >= 1280 ? 4 : ww >= 900 ? 3 : ww >= 640 ? 2 : 1;
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
  // ➜ renvoie un tableau de flux (1 ou 2 ou plus)
  const getRSSUrls = () => {
    const urls = [];
    if (RSS_URL_OVERRIDE_1) urls.push(RSS_URL_OVERRIDE_1);
    if (RSS_URL_OVERRIDE_2) urls.push(RSS_URL_OVERRIDE_2);

    // éventuellement depuis le HTML
    const link = document.querySelector('link[rel="alternate"][type="application/rss+xml"]');
    if (link) urls.push(link.getAttribute("href"));
    return urls;
  };

  // parseRSS — récupère un flux et renvoie un tableau d’articles
  const parseRSS = async (url) => {
    const absUrl = new URL(url, location.href).toString();
    const res = await fetch(absUrl).catch(() => null);
    if (!res || !res.ok) return [];

    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    if (xml.querySelector("parsererror")) return [];

    const channelLink = xml.querySelector("channel > link")?.textContent?.trim() || absUrl;

    const decodeEntities = (s) => { if (!s) return s; const ta = document.createElement("textarea"); ta.innerHTML = s; return ta.value; };
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
    return items.map((it) => {
      const title = it.querySelector("title")?.textContent?.trim() || "";
      const linkRaw = it.querySelector("link")?.textContent?.trim() || "";
      const guidNode = it.querySelector("guid");
      const guidText = guidNode?.textContent?.trim() || "";
      const guidIsPermalink = (guidNode?.getAttribute("isPermaLink") || "").toLowerCase() === "true";
      const contentEncoded = it.getElementsByTagName("content:encoded")?.[0]?.textContent || "";
      const descRaw = it.querySelector("description")?.textContent || "";

      let finalLink = linkRaw && /^https?:\/\//i.test(linkRaw) ? linkRaw.trim() : null;
      if (!finalLink) {
        const hrefContent = firstAttrFrom(contentEncoded, "href");
        const hrefDesc    = firstAttrFrom(descRaw, "href");
        const linkCandidates = [
          (guidIsPermalink || /^https?:\/\//i.test(guidText)) ? guidText : null,
          hrefContent,
          hrefDesc
        ].filter(Boolean);

        for (const c of linkCandidates) {
          const abs = toAbsolute(decodeEntities(c), channelLink);
          if (abs) { finalLink = abs; break; }
        }
      }
      if (!finalLink) finalLink = "#";

      const img = pickImage(it, channelLink);

      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "1970-01-01";

      return {
        title,
        description: decodeEntities(descRaw).replace(/<[^>]+>/g, "").trim().slice(0, 300),
        img,
        link: finalLink,
        date: dateISO,
        _isRSS: true
      };
    });
  };

  // ---- Correctif hôtes connus (PFBC) ----
  function fixKnownHosts(u) {
    try {
      const url = new URL(u);
      if (url.hostname.endsWith("pfbc-cbfp.org")) {
        if (/^\/fr\/actualites\/detail\//.test(url.pathname)) {
          url.pathname = url.pathname.replace(
            "/fr/actualites/detail/",
            "/fr/actualites/actualites-des-partenaires/detail/"
          );
          return url.toString();
        }
      }
      return u;
    } catch { return u; }
  }

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

    // Fallback : créer un conteneur propre si aucun trouvé
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
    const candidates = [".articles-container", "#magazine .news-grid", "#articles .news-grid"];
    return Array.from(new Set(
      candidates.map(sel => document.querySelector(sel)).filter(Boolean)
    ));
  }

  // --------- Injection principale ----------
  const inject = async () => {
    ensureNoUnderlineStyle();

    const lang = getLang();

    // Conteneurs
    const previewTargets = findPreviewContainers();   // Accueils + Actualités
    const magazineTargets = findMagazineContainers(); // Magazine

    // Colonnes (4/3/2/1)
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    // 1) Tes articles (par langue)
    const localByLang = STATIC_ARTICLES
      .filter(a => a.lang === lang)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    const localForHome = localByLang.slice(0, HOME_LOCAL_LIMIT);
    const localForNews = localByLang.slice(0, NEWS_LOCAL_LIMIT);
    const localsForPage = isNewsListingPage() ? localForNews : localForHome;

    // Injection immédiate : preview & magazine
    clearAndInjectMultiple(previewTargets, localsForPage, false);
    clearAndInjectMultiple(magazineTargets, localByLang, false);

    // 2) RSS : charge et fusionne
    const rssURLs = getRSSUrls();
    if (rssURLs.length) {
      try {
        // on charge tous les flux en parallèle (si l’un échoue → [])
        const allRssArrays = await Promise.all(
          rssURLs.map(url => parseRSS(url).catch(() => []))
        );

        // on aplatit
        let rssItems = allRssArrays.flat().map(it => ({ ...it, link: fixKnownHosts(it.link) }));

        const rssForHome = rssItems.slice(0, HOME_RSS_LIMIT);
        const rssForNews = rssItems.slice(0, NEWS_RSS_LIMIT);
        const rssForPage = isNewsListingPage() ? rssForNews : rssForHome;

        // fusion
        const mergedForPreview = [...rssForPage, ...localsForPage]
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        clearAndInjectMultiple(previewTargets, mergedForPreview, true);
      } catch {
        // on garde tes articles statiques
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
