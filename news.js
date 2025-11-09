(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  // ✅ Flux RSS
  const RSS_URL_OVERRIDE_1 = "https://www.cdbg-gabon.com/get-rss-pfbc.php";  // PFBC via proxy PHP
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  // ATIBT

  // --------- Articles locaux ----------
  const STATIC_ARTICLES = [
    /* ... tes articles existants ... */
  ];

  // --------- Helpers langue & page ----------
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

  // --------- Styles anti-soulignement ----------
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

  // --------- Création carte ----------
  const createCard = (a) => {
    const pageLang = getLang();
    let meta;
    if (a._isRSS && a._sourceTag === "ATIBT") meta = `${formatDate(a.date, pageLang)} - ATIBT - ${SITE_BRAND}`;
    else if (a._isRSS) meta = `${formatDate(a.date, pageLang)} - PFBC - ${SITE_BRAND}`;
    else meta = `${formatDate(a.date, a.lang)} — ${SITE_BRAND}`;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
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

  // --------- Sticky PDF ----------
  function addStickyPDF(lang) {
    if (!isNewsListingPage()) return;
    const data = (lang === "fr")
      ? { lang:"fr", title:"Code forestier de la République gabonaise : Textes législatifs et réglementaires 2001-2025", description:"Le Code forestier de la République gabonaise, avec l’ensemble des textes législatifs, décrets, arrêtés et ordonnances publiés entre 2001 et 2025.", img:"https://www.cdbg-gabon.com/code-forestier-gabon.avif", link:"https://www.cdbg-gabon.com/code-forestier-gabon.pdf", date:"2025-11-08" }
      : { lang:"en", title:"Forestry Code of the Gabonese Republic: Legislative and Regulatory Texts 2001-2025.", description:"The Forestry Code of the Gabonese Republic, with all legislative texts, decrees, orders and ordinances published between 2001 and 2025.", img:"https://www.cdbg-gabon.com/code-forestier-gabon.avif", link:"https://www.cdbg-gabon.com/code-forestier-gabon.pdf", date:"2025-11-08" };
    
    const containers = findPreviewContainers();
    containers.forEach((ctn) => {
      if (!ctn || ctn.querySelector('[data-sticky-pdf="1"]')) return;
      const card = createCardSafe(data);
      card.setAttribute("target","_blank");
      card.setAttribute("rel","noopener");
      card.setAttribute("data-sticky-pdf","1");
      ctn.prepend(card);
    });
  }

  // --------- Injection articles ----------
  const clearAndInject = (container, items, safe=false) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(safe ? createCardSafe(a) : createCard(a)));
  };
  const clearAndInjectMultiple = (containers, items, safe=false) => {
    containers.forEach(ctn => clearAndInject(ctn, items, safe));
  };

  // --------- Grille responsive ----------
  function enforceGridColumns(containerList) {
    const apply = () => {
      const ww = window.innerWidth || 1280;
      const cols = ww>=1280?4:ww>=900?3:ww>=640?2:1;
      containerList.forEach(ctn => {
        if (!ctn) return;
        ctn.style.display="grid";
        ctn.style.gridTemplateColumns=`repeat(${cols}, minmax(0,1fr))`;
        if (!getComputedStyle(ctn).gap || getComputedStyle(ctn).gap==="0px") ctn.style.gap="24px";
      });
    };
    apply();
    window.addEventListener("resize", apply);
  }

  // --------- RSS multi-flux ----------
  const getRSSUrls = () => {
    const urls=[];
    if(RSS_URL_OVERRIDE_1) urls.push({url:RSS_URL_OVERRIDE_1, tag:"PFBC"});
    if(RSS_URL_OVERRIDE_2) urls.push({url:RSS_URL_OVERRIDE_2, tag:"ATIBT"});
    return urls;
  };

  const parseRSS = async (url, tag="PFBC") => {
    const absUrl = new URL(url, location.href).toString();
    const res = await fetch(absUrl).catch(()=>null);
    if(!res||!res.ok) return [];
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text,"text/xml");
    if(xml.querySelector("parsererror")) return [];

    const channelLink = xml.querySelector("channel > link")?.textContent?.trim() || absUrl;
    const decodeEntities = s=>{ if(!s) return s; const ta=document.createElement("textarea"); ta.innerHTML=s; return ta.value; };
    const toAbsolute = (raw,base)=>{ if(!raw) return null; if(/^https?:\/\//i.test(raw)) return raw.trim(); if(/^\/\//.test(raw)) return ("https:"+raw).trim(); try{ return new URL(raw,base).toString(); } catch{return null;} };
    const firstAttrFrom=(html,attr)=>{ if(!html) return null; const rx=new RegExp(attr+'\\s*=\\s*"(.*?)"',"i"); const m=html.match(rx); return m?m[1]:null; };
    
    const pickImage = (it,base)=>{
      const mediaContent = it.querySelector("media\\:content, content")?.getAttribute?.("url");
      const mediaThumb   = it.querySelector("media\\:thumbnail, thumbnail")?.getAttribute?.("url");
      const enclosure = (()=>{ const enc=it.querySelector("enclosure"); if(!enc) return null; const type=(enc.getAttribute("type")||"").toLowerCase(); const url=enc.getAttribute("url"); return /^image\\//.test(type)?url:null; })();
      const contentEncoded = it.getElementsByTagName("content:encoded")?.[0]?.textContent || "";
      const desc = it.querySelector("description")?.textContent || "";
      const imgInContent = firstAttrFrom(contentEncoded,"src") || firstAttrFrom(desc,"src");
      const candidates = [mediaContent, mediaThumb, enclosure, imgInContent].filter(Boolean);
      for(const c of candidates){ const abs=toAbsolute(decodeEntities(c),base); if(abs) return abs; }
      return "";
    };

    const items = Array.from(xml.querySelectorAll("item"));
    return items.map(it=>{
      const title = it.querySelector("title")?.textContent?.trim()||"";
      const linkRaw = it.querySelector("link")?.textContent?.trim()||"#";
      const descRaw = it.querySelector("description")?.textContent||"";
      const img = pickImage(it,channelLink);
      const pubDate = it.querySelector("pubDate")?.textContent?.trim()||"";
      const dateISO = pubDate?new Date(pubDate).toISOString().slice(0,10):"1970-01-01";
      return { title, description:decodeEntities(descRaw).replace(/<[^>]+>/g,"").trim().slice(0,300), img, link:linkRaw, date:dateISO, _isRSS:true, _sourceTag:tag };
    });
  };

  // --------- Injection principale ----------
  const inject = async () => {
    ensureNoUnderlineStyle();
    const lang = getLang();

    const previewTargets = findPreviewContainers();
    const magazineTargets = findMagazineContainers();
    enforceGridColumns([...previewTargets,...magazineTargets]);

    const localByLang = STATIC_ARTICLES.filter(a=>a.lang===lang).sort((a,b)=>(a.date<b.date?1:-1));
    const localsForPage = isNewsListingPage()?localByLang.slice(0,NEWS_LOCAL_LIMIT):localByLang.slice(0,HOME_LOCAL_LIMIT);

    clearAndInjectMultiple(previewTargets,localsForPage,false);
    clearAndInjectMultiple(magazineTargets,localByLang,false);

    addStickyPDF(lang);

    const rssConfigs = getRSSUrls();
    if(rssConfigs.length){
      try{
        const allRssArrays = await Promise.all(rssConfigs.map(cfg=>parseRSS(cfg.url,cfg.tag).catch(()=>[])));
        let rssItems = allRssArrays.flat();
        const rssForPage = isNewsListingPage()?rssItems.slice(0,NEWS_RSS_LIMIT):rssItems.slice(0,HOME_RSS_LIMIT);
        const mergedForPreview = [...rssForPage,...localsForPage].sort((a,b)=>(a.date<b.date?1:-1));
        clearAndInjectMultiple(previewTargets,mergedForPreview,true);
        addStickyPDF(lang);
      }catch{
        // en cas d’erreur RSS, on affiche quand même les locaux
        clearAndInjectMultiple(previewTargets,localsForPage,false);
        addStickyPDF(lang);
      }
    }
  };

  // --------- Détection conteneurs ----------
  function findPreviewContainers(){
    const selectors = ["#latest-news-en","#latest-news","#news-en","#news",'section[id*="news" i] .news-grid','section[id*="latest" i] .news-grid',".latest-news .news-grid",".news-section .news-grid",".news-grid"];
    const found = selectors.map(sel=>document.querySelector(sel)).filter(Boolean);
    if(found.length) return found;
    const section=document.createElement("section");
    section.className="news-section";
    section.id="latest-news";
    const grid=document.createElement("div");
    grid.className="news-grid";
    section.appendChild(grid);
    (document.querySelector("main")||document.body).appendChild(section);
    return [grid];
  }
  function findMagazineContainers(){
    const selectors=[".articles-container","#magazine .news-grid","#articles .news-grid"];
    return selectors.map(sel=>document.querySelector(sel)).filter(Boolean);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",inject);
  else inject();

})();
