/* ===========================
   news.js — injection auto d’articles (FR/EN)
   =========================== */

(() => {
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  // PFBC
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // ATIBT

  const STATIC_ARTICLES = [
    { lang:"fr", title:"Le Gabon renforce sa politique forestière",
      description:"Le Gabon, riche de ses forêts équatoriales, s’impose comme un leader africain dans la gestion durable des ressources forestières.",
      img:"article1.avif", link:"article-full-fr.html", date:"2025-09-12" },
    { lang:"en", title:"Gabon strengthens its forest policy",
      description:"Gabon, rich in its equatorial forests, is becoming a leader in sustainable forest management and biodiversity preservation.",
      img:"article1.avif", link:"article-full-en.html", date:"2025-09-12" },
    // … autres articles statiques …
  ];

  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    if (htmlLang.startsWith("fr")) return "fr";
    const href = (location.href || "").toLowerCase();
    if (href.includes("-en") || href.endsWith("/en.html") || href.includes("/en.html")) return "en";
    return "fr";
  };

  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);

  function ensureStyles() {
    if (document.getElementById("news-card-style")) return;
    const style = document.createElement("style");
    style.id = "news-card-style";
    style.textContent = `
      .news-card { text-decoration: none !important; color: inherit !important; display: flex; flex-direction: column; }
      .news-card:hover, .news-card:focus { text-decoration: none !important; }
      .news-card .news-title { 
        overflow: hidden; 
        text-overflow: ellipsis; 
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical; 
      }
      .news-card .news-title a { text-decoration: none !important; color: inherit !important; }
      .news-card .news-desc a { color: blue; text-decoration: underline; }
    `;
    document.head.appendChild(style);
  }

  const createCard = (a) => {
    const pageLang = getLang();
    let meta = a._isRSS ? `${a.date} - ${a._sourceTag} - ${SITE_BRAND}` : `${a.date} — ${SITE_BRAND}`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          <img src="${a.img || ""}" alt="${a.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc"></p>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim();
    return wrapper.firstElementChild;
  };

  const createCardSafe = (a) => {
    const el = createCard(a);
    const descEl = el.querySelector(".news-desc");
    let desc = a.description || "";
    if(desc.length > 200) desc = desc.slice(0, 200); // description 200 caractères max
    desc += ` <a href="${a.link}" target="_blank" rel="noopener">Lire la suite</a>`;
    if(descEl) descEl.innerHTML = desc;
    return el;
  };

  const clearAndInject = (container, items) => {
    if(!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(createCardSafe(a)));
  };
  const clearAndInjectMultiple = (containers, items) => containers.forEach(ctn => clearAndInject(ctn, items));

  const findPreviewContainers = () => {
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
  };

  const findMagazineContainers = () => {
    const selectors = [".articles-container", "#magazine .news-grid", "#articles .news-grid"];
    return selectors.map(sel => document.querySelector(sel)).filter(Boolean);
  };

  const enforceGridColumns = (containerList) => {
    const apply = () => {
      const ww = window.innerWidth || 1280;
      const cols = ww >= 1280 ? 4 : ww >= 900 ? 3 : ww >= 640 ? 2 : 1;
      containerList.forEach(ctn => {
        if(!ctn) return;
        ctn.style.display = "grid";
        ctn.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        const style = getComputedStyle(ctn);
        if(!style.gap || style.gap === "0px") ctn.style.gap = "24px";
      });
    };
    apply();
    window.addEventListener("resize", apply);
  };

  const getRSSUrls = () => {
    const urls = [];
    if(RSS_URL_OVERRIDE_1) urls.push({url: RSS_URL_OVERRIDE_1, tag: "PFBC"});
    if(RSS_URL_OVERRIDE_2) urls.push({url: RSS_URL_OVERRIDE_2, tag: "ATIBT"});
    return urls;
  };

  const parseRSS = async (url, tag = "PFBC") => {
    const res = await fetch(url).catch(() => null);
    if(!res || !res.ok) return [];
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    if(xml.querySelector("parsererror")) return [];
    const items = Array.from(xml.querySelectorAll("item"));
    return items.map(it => {
      const title = it.querySelector("title")?.textContent?.trim() || "";
      const linkRaw = it.querySelector("link")?.textContent?.trim() || "#";
      const descRaw = it.querySelector("description")?.textContent || "";
      const pubDate = it.querySelector("pubDate")?.textContent?.trim() || "";
      const dateISO = pubDate ? new Date(pubDate).toISOString().slice(0,10) : "1970-01-01";
      const decodeEntities = s => { if(!s) return s; const ta = document.createElement("textarea"); ta.innerHTML = s; return ta.value; };
      const description = decodeEntities(descRaw).replace(/<[^>]+>/g,"").trim();
      const img = it.querySelector("media\\:content, content, enclosure")?.getAttribute("url") || "";
      return {title, description, img, link: linkRaw, date: dateISO, _isRSS:true, _sourceTag:tag};
    });
  };

  const inject = async () => {
    ensureStyles();
    const lang = getLang();
    const previewTargets = findPreviewContainers();
    const magazineTargets = findMagazineContainers();
    enforceGridColumns([...previewTargets, ...magazineTargets]);

    const localByLang = STATIC_ARTICLES.filter(a=>a.lang===lang).sort((a,b)=>b.date.localeCompare(a.date));
    const localsForPage = isNewsListingPage() ? localByLang.slice(0,NEWS_LOCAL_LIMIT) : localByLang.slice(0,HOME_LOCAL_LIMIT);
    clearAndInjectMultiple(previewTargets, localsForPage);
    clearAndInjectMultiple(magazineTargets, localByLang);

    const rssConfigs = getRSSUrls();
    if(rssConfigs.length){
      try {
        const allRss = await Promise.all(rssConfigs.map(cfg=>parseRSS(cfg.url,cfg.tag).catch(()=>[])));
        let rssItems = allRss.flat();
        const rssForPage = isNewsListingPage() ? rssItems.slice(0,NEWS_RSS_LIMIT) : rssItems.slice(0,HOME_RSS_LIMIT);
        const merged = [...rssForPage,...localsForPage].sort((a,b)=>b.date.localeCompare(a.date));
        clearAndInjectMultiple(previewTargets, merged);
      } catch(e){}
    }
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  } else { inject(); }
})();
