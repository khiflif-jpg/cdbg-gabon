/* ===========================
   news.js — injection auto d’articles (FR/EN) — Version Pro
   =========================== */

(() => {
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT   = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT   = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml";

  const STATIC_ARTICLES = [
    { lang:"fr", title:"Le Gabon renforce sa politique forestière",
      description:"Le Gabon, riche de ses forêts équatoriales, s’impose comme un leader africain dans la gestion durable des ressources forestières.",
      img:"article1.avif", link:"article-full-fr.html", date:"2025-09-12" },
    { lang:"en", title:"Gabon strengthens its forest policy",
      description:"Gabon, rich in its equatorial forests, is becoming a leader in sustainable forest management and biodiversity preservation.",
      img:"article1.avif", link:"article-full-en.html", date:"2025-09-12" }
    // … autres articles statiques
  ];

  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if(htmlLang.startsWith("en")) return "en";
    if(htmlLang.startsWith("fr")) return "fr";
    const href = (location.href||"").toLowerCase();
    if(href.includes("-en") || href.endsWith("/en.html") || href.includes("/en.html")) return "en";
    return "fr";
  };

  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);
  const formatDate = (iso, lang) => {
    try { return new Date(iso + "T00:00:00").toLocaleDateString(lang==="fr"?"fr-FR":"en-US",{year:"numeric",month:"long",day:"numeric"}); }
    catch{ return iso; }
  };

  function ensureNoUnderlineStyle(){
    if(document.getElementById("news-card-style")) return;
    const style=document.createElement("style"); style.id="news-card-style";
    style.textContent=`
      .news-card{ text-decoration:none !important; color:inherit !important; display:block; margin-bottom:20px; }
      .news-card:hover,.news-card:focus{ text-decoration:none !important; }
      .news-card .news-title{ font-weight:bold; margin-bottom:8px; }
      .news-card .news-desc{ margin-bottom:6px; }
      .news-card .read-more{ color:blue; text-decoration:underline; font-weight:bold; }
    `;
    document.head.appendChild(style);
  }

  const createCard = (a) => {
    const pageLang=getLang();
    const meta=a._isRSS?`${formatDate(a.date,pageLang)} - ${a._sourceTag} - ${SITE_BRAND}`:`${formatDate(a.date,a.lang)} — ${SITE_BRAND}`;
    let desc=(a.description||"").trim().slice(0,200);
    return Object.assign(document.createElement("div"), {innerHTML:`
      <a href="${a.link}" class="news-card" ${a._isRSS?'target="_blank" rel="noopener noreferrer"':""}>
        <div class="news-image">${a.img?`<img src="${a.img}" alt="${a.title}">`:''}</div>
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          <p class="news-desc">${desc} <span class="read-more">Lire la suite</span></p>
          <div class="news-meta">${meta}</div>
        </div>
      </a>
    `.trim()}).firstElementChild;
  };

  const clearAndInject = (container, items)=>{
    if(!container) return;
    container.innerHTML="";
    items.forEach(a=>container.appendChild(createCard(a)));
  };
  const clearAndInjectMultiple=(containers,items)=>containers.forEach(c=>clearAndInject(c,items));

  function enforceGridColumns(containers){
    const apply=()=>{
      const ww=window.innerWidth||1280;
      const cols=ww>=1280?4:ww>=900?3:ww>=640?2:1;
      containers.forEach(c=>{if(!c)return;c.style.display="grid";c.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;const s=getComputedStyle(c);if(!s.gap||s.gap==="0px")c.style.gap="24px";});
    };
    apply();
    window.addEventListener("resize",apply);
  }

  const getRSSUrls=()=>{const urls=[];if(RSS_URL_OVERRIDE_1)urls.push({url:RSS_URL_OVERRIDE_1,tag:"PFBC"});if(RSS_URL_OVERRIDE_2)urls.push({url:RSS_URL_OVERRIDE_2,tag:"ATIBT"});return urls;};

  const parseRSS=async(url,tag="PFBC")=>{
    const absUrl=new URL(url,location.href).toString();
    const res=await fetch(absUrl).catch(()=>null); if(!res||!res.ok)return[];
    const text=await res.text();
    const parser=new DOMParser();
    const xml=parser.parseFromString(text,"text/xml"); if(xml.querySelector("parsererror")) return [];
    const decode=s=>{if(!s)return"";const t=document.createElement("textarea");t.innerHTML=s;return t.value;};
    const items=Array.from(xml.querySelectorAll("item"));
    return items.map(it=>{
      const title=it.querySelector("title")?.textContent?.trim()||"Sans titre";
      const link=it.querySelector("link")?.textContent?.trim()||"#";

      // --- Texte brut complet pour description (version pro) ---
      let desc = "";
      if(it.getElementsByTagName("content:encoded")[0]) desc=it.getElementsByTagName("content:encoded")[0].textContent;
      else if(it.querySelector("description")) desc=it.querySelector("description").textContent;
      else {
        // tout texte enfant du item
        desc=Array.from(it.childNodes).map(n=>n.textContent||"").join(" ");
      }
      desc=decode(desc).replace(/<[^>]+>/g,"").trim().slice(0,200); // max 200 chars

      const img=it.querySelector("media\\:content, content")?.getAttribute?.("url")||it.querySelector("media\\:thumbnail, thumbnail")?.getAttribute?.("url")||it.querySelector("enclosure")?.getAttribute("url")||"";
      const pubDate=it.querySelector("pubDate")?.textContent?.trim()||"1970-01-01";
      const dateISO=new Date(pubDate).toISOString().slice(0,10);

      return {title,description:desc,img,link,date:dateISO,_isRSS:true,_sourceTag:tag};
    });
  };

  const findPreviewContainers=()=>{const selectors=["#latest-news-en","#latest-news","#news-en","#news",'section[id*="news" i] .news-grid','section[id*="latest" i] .news-grid',".latest-news .news-grid",".news-section .news-grid",".news-grid"];const found=selectors.map(s=>document.querySelector(s)).filter(Boolean);if(found.length)return found;const section=document.createElement("section");section.className="news-section";section.id="latest-news";const grid=document.createElement("div");grid.className="news-grid";section.appendChild(grid);(document.querySelector("main")||document.body).appendChild(section);return [grid];};
  const findMagazineContainers=()=>{const selectors=[".articles-container","#magazine .news-grid","#articles .news-grid"];return selectors.map(s=>document.querySelector(s)).filter(Boolean);};

  const inject=async()=>{
    ensureNoUnderlineStyle();
    const lang=getLang();
    const previewTargets=findPreviewContainers();
    const magazineTargets=findMagazineContainers();
    enforceGridColumns([...previewTargets,...magazineTargets]);

    const localByLang=STATIC_ARTICLES.filter(a=>a.lang===lang).sort((a,b)=>b.date.localeCompare(a.date));
    const localsForPage=isNewsListingPage()?localByLang.slice(0,NEWS_LOCAL_LIMIT):localByLang.slice(0,HOME_LOCAL_LIMIT);

    clearAndInjectMultiple(previewTargets,localsForPage);
    clearAndInjectMultiple(magazineTargets,localByLang);

    const rssConfigs=getRSSUrls();
    if(rssConfigs.length){
      try{
        const allRss=await Promise.all(rssConfigs.map(cfg=>parseRSS(cfg.url,cfg.tag).catch(()=>[])));
        const rssItems=allRss.flat();
        const rssForPage=isNewsListingPage()?rssItems.slice(0,NEWS_RSS_LIMIT):rssItems.slice(0,HOME_RSS_LIMIT);
        const merged=[...rssForPage,...localsForPage].sort((a,b)=>b.date.localeCompare(a.date));
        clearAndInjectMultiple(previewTargets,merged);
      }catch{}
    }
  };

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject);
  else inject();
})();
