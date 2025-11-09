(() => {
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";  

  const STATIC_ARTICLES = [
    // … tes articles statiques inchangés …
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
      .news-card { text-decoration: none !important; color: inherit !important; display:block; }
      .news-card:hover, .news-card:focus { text-decoration: none !important; }

      /* Titre tronqué à 2 lignes */
      .news-title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Description tronquée à 4 lignes */
      .news-desc {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Lire la suite vert et non souligné */
      .news-readmore {
        display: inline-block;
        color: green;
        text-decoration: none;
        font-weight: bold;
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  const createCard = (a) => {
    const pageLang = getLang();
    const meta = a._isRSS
      ? `${formatDate(a.date, pageLang)} - ${a._sourceTag} - ${SITE_BRAND}`
      : `${formatDate(a.date, a.lang)} — ${SITE_BRAND}`;

    const desc = a.description || "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        <div class="news-image">
          <img src="${a.img || ""}" alt="${a.title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${desc}</p>
          <a href="${a.link}" class="news-readmore" ${a._isRSS ? 'target="_blank" rel="noopener"' : ''}>Lire la suite</a>
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
    return el;
  };

  const clearAndInject = (container, items) => {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(a => container.appendChild(createCardSafe(a)));
  };
  const clearAndInjectMultiple = (containers, items) => containers.forEach(ctn => clearAndInject(ctn, items));

  const inject = async () => {
    ensureStyles();
    const lang = getLang();
    const previewTargets = findPreviewContainers();

    const localByLang = STATIC_ARTICLES.filter(a => a.lang === lang).sort((a,b)=>b.date.localeCompare(a.date));
    const localsForPage = isNewsListingPage() ? localByLang.slice(0, NEWS_LOCAL_LIMIT) : localByLang.slice(0, HOME_LOCAL_LIMIT);

    clearAndInjectMultiple(previewTargets, localsForPage);

    const rssConfigs = [
      { url: RSS_URL_OVERRIDE_1, tag:"PFBC" },
      { url: RSS_URL_OVERRIDE_2, tag:"ATIBT" }
    ];

    if(rssConfigs.length){
      try{
        const allRssArrays = await Promise.all(rssConfigs.map(cfg => parseRSS(cfg.url,cfg.tag).catch(()=>[])));
        const rssItems = allRssArrays.flat();
        const rssForPage = isNewsListingPage() ? rssItems.slice(0,NEWS_RSS_LIMIT) : rssItems.slice(0,HOME_RSS_LIMIT);
        const merged = [...rssForPage, ...localsForPage].sort((a,b)=>b.date.localeCompare(a.date));
        clearAndInjectMultiple(previewTargets, merged);
      }catch{}
    }
  };

  function findPreviewContainers() {
    const selectors = ["#latest-news","#latest-news-en","#news","#news-en",".news-grid"];
    const found = selectors.map(sel => document.querySelector(sel)).filter(Boolean);
    if(found.length) return found;
    const section = document.createElement("section");
    section.className="news-section";
    const grid = document.createElement("div");
    grid.className="news-grid";
    section.appendChild(grid);
    (document.querySelector("main")||document.body).appendChild(section);
    return [grid];
  }

  const formatDate = (iso,lang)=> {
    try { const d=new Date(iso+"T00:00:00"); return d.toLocaleDateString(lang==="fr"?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"}); }
    catch{return iso;}
  };

  const parseRSS=async(url,tag="PFBC")=>{
    const res=await fetch(url).catch(()=>null);
    if(!res||!res.ok) return [];
    const text=await res.text();
    const parser=new DOMParser();
    const xml=parser.parseFromString(text,"text/xml");
    if(xml.querySelector("parsererror")) return [];
    const channelLink=xml.querySelector("channel > link")?.textContent?.trim()||url;
    const decodeEntities=s=>{if(!s) return s; const ta=document.createElement("textarea");ta.innerHTML=s;return ta.value;};
    const toAbsolute=(raw,base)=>{if(!raw) return null;if(/^https?:\/\//i.test(raw)) return raw.trim();if(/^\/\//.test(raw)) return ("https:"+raw).trim();try{return new URL(raw,base).toString();}catch{return null;}};
    const firstAttrFrom=(html,attr)=>{if(!html) return null;const rx=new RegExp(attr+'\\s*=\\s*"(.*?)"',"i");const m=html.match(rx);return m?m[1]:null;};
    const pickImage=(it,base)=>{const mediaContent=it.querySelector("media\\:content, content")?.getAttribute?.("url");const mediaThumb=it.querySelector("media\\:thumbnail, thumbnail")?.getAttribute?.("url");const enclosure=(()=>{const enc=it.querySelector("enclosure");if(!enc)return null;const type=(enc.getAttribute("type")||"").toLowerCase();const url=enc.getAttribute("url");return /^image\\//.test(type)?url:null;})();const contentEncoded=it.getElementsByTagName("content:encoded")?.[0]?.textContent||"";const desc=it.querySelector("description")?.textContent||"";const imgInContent=firstAttrFrom(contentEncoded,"src")||firstAttrFrom(desc,"src");const candidates=[mediaContent,mediaThumb,enclosure,imgInContent].filter(Boolean);for(const c of candidates){const abs=toAbsolute(decodeEntities(c),base);if(abs)return abs;}return"";};
    const items=Array.from(xml.querySelectorAll("item"));
    return items.map(it=>{
      const title=it.querySelector("title")?.textContent?.trim()||"";
      const linkRaw=it.querySelector("link")?.textContent?.trim()||"#";
      const descRaw=it.querySelector("description")?.textContent||"";
      const img=pickImage(it,channelLink);
      const pubDate=it.querySelector("pubDate")?.textContent?.trim()||"";
      const dateISO=pubDate?new Date(pubDate).toISOString().slice(0,10):"1970-01-01";
      return {title,description:decodeEntities(descRaw).replace(/<[^>]+>/g,"").trim(),img,link:linkRaw,date:dateISO,_isRSS:true,_sourceTag:tag};
    });
  };

  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",inject);}
  else{inject();}
})();
