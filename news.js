/* ===========================
   news.js — injection auto d’articles (FR/EN) — titres complets, description 300c max, Lire la suite bleu souligné
   =========================== */

(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  // ✅ Tes flux RSS
  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  // PFBC
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // ATIBT

  // --------- Articles statiques ----------
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

  // --------- Helpers ----------
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
      .news-card { text-decoration: none !important; color: inherit !important; display:block; margin-bottom:20px; }
      .news-card:hover, .news-card:focus { text-decoration: none !important; }
      .news-card .news-title { font-weight:bold; margin-bottom:8px; }
      .news-card .news-desc { margin-bottom:6px; }
      .news-card .read-more { color: blue; text-decoration: underline; font-weight:bold; }
    `;
    document.head.appendChild(style);
  }

  // --------- Rendu article ----------
  const createCard = (a) => {
    const pageLang = getLang();
    const meta = a._isRSS
      ? `${formatDate(a.date, pageLang)} - ${a._sourceTag} - ${SITE_BRAND}`
      : `${formatDate(a.date, a.lang)} — ${SITE_BRAND}`;

    const wrapper = document.createElement("div");

    // description limitée à 300 caractères si elle existe
    let desc = a.description || "";
    desc = desc.trim().slice(0, 300);

    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          ${a.img ? `<img src="${a.img}" alt="${a.title}">` : ""}
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${desc} <span class="read-more">Lire la suite</span></p>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  // --------- Grid & injection ----------
  const clearAndInject = (container, items) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(createCard(a)));
  };
  const clearAndInjectMultiple = (containers, items) => {
    containers.forEach(ctn => clearAndInject(ctn, items));
  };

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

  // --------- RSS fetch ----------
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
    const toAbsolute = (raw, base) => { if (!raw) return null; try { return new URL(raw, base).toString(); } catch { return null; } };

    const pickDescription = (it) => {
      const cEncoded = it.getElementsByTagName("content:encoded")?.[0]?.textContent || "";
      const descTag = it.querySelector("description")?.textContent || "";
      return decodeEntities(cEncoded || descTag || "").replace(/<[^>]+>/g, "").trim();
    };

    const pickImage = (it) => {
      const mediaContent = it.querySelector("media\\:content, content")?.getAttribute?.("url");
      const mediaThumb = it.querySelector("media\\:thumbnail, thumbnail")?.getAttribute?.("url");
      const enclosure = (() => { const enc = it.querySelector("enclosure"); if (!enc) return null; const type = (enc.getAttribute("type") || "").toLowerCase(); return /^image\//.test(type) ? enc.getAttribute("url") : null; })();
      return mediaContent || mediaThumb || enclosure || "";
    };

    const items = Array.from(xml.querySelectorAll("item"));
    return items.map(it => {
      const title = it.querySelector("title")?.textContent?.trim() || "Sans titre";
      const linkRaw = it.querySelector("link")?.textContent?.trim() || "#";
      const description = pickDescription(it).slice(0, 300);
      const img = pickImage(it);
      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "1970-01-01";

      return { title, description, img, link: linkRaw, date: dateISO, _isRSS: true, _sourceTag: tag };
    });
  };

  // --------- Injection principale ----------
  const inject = async () => {
    ensureNoUnderlineStyle();
    const lang = getLang();

    const previewTargets = findPreviewContainers();
    const magazineTargets = findMagazineContainers();
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    const localByLang = STATIC_ARTICLES.filter(a => a.lang === lang).sort((a,b) => b.date.localeCompare(a.date));
    const localsForPage = isNewsListingPage() ? localByLang.slice(0, NEWS_LOCAL_LIMIT) : localByLang.slice(0, HOME_LOCAL_LIMIT);

    clearAndInjectMultiple(previewTargets, localsForPage);
    clearAndInjectMultiple(magazineTargets, localByLang);

    // Charger RSS
    const rssConfigs = getRSSUrls();
    if(rssConfigs.length){
      try{
        const allRss = await Promise.all(rssConfigs.map(cfg => parseRSS(cfg.url, cfg.tag).catch(()=>[])));
        const rssItems = allRss.flat();
        const rssForPage = isNewsListingPage() ? rssItems.slice(0, NEWS_RSS_LIMIT) : rssItems.slice(0, HOME_RSS_LIMIT);

        const merged = [...rssForPage, ...localsForPage].sort((a,b) => b.date.localeCompare(a.date));
        clearAndInjectMultiple(previewTargets, merged);

      }catch{}
    }
  };

  // --------- Conteneurs ----------
  function findPreviewContainers(){
    const selectors = ["#latest-news-en","#latest-news","#news-en","#news",'section[id*="news" i] .news-grid','section[id*="latest" i] .news-grid',".latest-news .news-grid",".news-section .news-grid",".news-grid"];
    const found = selectors.map(s => document.querySelector(s)).filter(Boolean);
    if(found.length) return found;
    const section = document.createElement("section");
    section.className="news-section"; section.id="latest-news";
    const grid = document.createElement("div"); grid.className="news-grid";
    section.appendChild(grid); (document.querySelector("main")||document.body).appendChild(section);
    return [grid];
  }

  function findMagazineContainers(){
    const selectors = [".articles-container","#magazine .news-grid","#articles .news-grid"];
    return selectors.map(s=>document.querySelector(s)).filter(Boolean);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",inject);
  else inject();
})();
