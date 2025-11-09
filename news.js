/* ===========================
   news.js — injection auto d’articles (FR/EN) avec RSS
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

  // --------- Articles locaux ----------
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

  // --------- Helpers ----------
  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    return "fr";
  };
  const formatDate = (iso, lang) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year:"numeric", month:"long", day:"numeric" });
    } catch { return iso; }
  };

  function ensureNoUnderlineStyle() {
    if (document.getElementById("news-card-style")) return;
    const style = document.createElement("style");
    style.id = "news-card-style";
    style.textContent = `
      .news-card { text-decoration: none; color: inherit; display: block; margin-bottom: 24px; }
      .news-card:hover .news-title { text-decoration: underline; }
      .news-card .news-title { font-size: 1.2em; font-weight: bold; margin-bottom: 8px; }
      .news-card .news-desc { margin-bottom: 8px; }
      .news-card .news-image img { max-width: 100%; height: auto; display: block; margin-bottom: 8px; }
      .news-card .read-more { color: blue; text-decoration: underline; font-weight: bold; }
    `;
    document.head.appendChild(style);
  }

  const createCard = (a) => {
    const pageLang = getLang();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" target="_blank" rel="noopener noreferrer">
        ${a.img ? `<div class="news-image"><img src="${a.img}" alt="${a.title}"></div>` : ""}
        <h3 class="news-title">${a.title}</h3>
        <p class="news-desc">${a.description ? a.description.slice(0,300) : ""} <span class="read-more">Lire la suite</span></p>
        <div class="news-meta">${formatDate(a.date, pageLang)} — ${SITE_BRAND}</div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  const clearAndInject = (container, items) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(createCard(a)));
  };

  const findPreviewContainers = () => {
    const sel = "#latest-news,#latest-news-en,#news,#news-en,.news-grid";
    const found = Array.from(document.querySelectorAll(sel)).filter(Boolean);
    if (found.length) return found;
    const section = document.createElement("section");
    section.className = "news-section";
    section.id = "latest-news";
    const grid = document.createElement("div");
    grid.className = "news-grid";
    section.appendChild(grid);
    (document.querySelector("main") || document.body).appendChild(section);
    return [grid];
  };

  // --------- RSS ----------
  const getRSSUrls = () => {
    const urls = [];
    if (RSS_URL_OVERRIDE_1) urls.push({ url: RSS_URL_OVERRIDE_1 });
    if (RSS_URL_OVERRIDE_2) urls.push({ url: RSS_URL_OVERRIDE_2 });
    return urls;
  };

  const parseRSS = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      if (xml.querySelector("parsererror")) return [];
      const items = Array.from(xml.querySelectorAll("item"));
      return items.map(it => {
        const title = it.querySelector("title")?.textContent?.trim() || "Sans titre";
        const descRaw = it.querySelector("description")?.textContent?.trim() || "";
        const link = it.querySelector("link")?.textContent?.trim() || "#";
        const pubDate = it.querySelector("pubDate")?.textContent?.trim();
        const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0,10) : "1970-01-01";
        // extraire image si présente
        const mediaContent = it.querySelector("media\\:content, enclosure, content")?.getAttribute("url");
        return { title, description: descRaw, link, date: dateISO, img: mediaContent || "" };
      });
    } catch {
      return [];
    }
  };

  // --------- Injection principale ----------
  const inject = async () => {
    ensureNoUnderlineStyle();
    const containers = findPreviewContainers();
    const lang = getLang();
    const localArticles = STATIC_ARTICLES.filter(a => a.lang === lang).sort((a,b) => b.date.localeCompare(a.date));
    let allArticles = [...localArticles];

    const rssUrls = getRSSUrls();
    if (rssUrls.length) {
      try {
        const rssArrays = await Promise.all(rssUrls.map(cfg => parseRSS(cfg.url)));
        const rssArticles = rssArrays.flat();
        allArticles = [...allArticles, ...rssArticles].sort((a,b) => b.date.localeCompare(a.date));
      } catch {}
    }

    clearAndInject(containers[0], allArticles);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
