(() => {
  // --------- Config ----------
  const HOME_LOCAL_LIMIT = 20;
  const HOME_RSS_LIMIT = Infinity;
  const NEWS_LOCAL_LIMIT = Infinity;
  const NEWS_RSS_LIMIT = Infinity;
  const SITE_BRAND = "CDBG Magazine";

  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml"; // PFBC
  const RSS_URL_OVERRIDE_2 = "https://rss.app/feeds/NbpOTwjyYzdutyWP.xml"; // ATIBT

  const STATIC_ARTICLES = [
    { lang:"fr", title:"Le Gabon renforce sa politique forestière", description:"Le Gabon, riche de ses forêts équatoriales, s’impose comme un leader africain dans la gestion durable des ressources forestières.", img:"article1.avif", link:"article-full-fr.html", date:"2025-09-12" },
    { lang:"en", title:"Gabon strengthens its forest policy", description:"Gabon, rich in its equatorial forests, is becoming a leader in sustainable forest management and biodiversity preservation.", img:"article1.avif", link:"article-full-en.html", date:"2025-09-12" },
    { lang:"fr", title:"Le secteur du bois au Gabon : pilier de diversification, d’emploi et de compétitivité durable", description:"Panorama des atouts économiques du secteur bois au Gabon, entre transformation locale, emplois et durabilité.", img:"article2.avif", link:"article-full2-fr.html", date:"2025-09-20" },
    { lang:"en", title:"Gabon’s wood sector: a pillar for diversification, jobs and sustainable competitiveness", description:"Overview of Gabon’s wood industry: local processing, job creation and long-term sustainability.", img:"article2.avif", link:"article-full2-en.html", date:"2025-09-20" },
    { lang:"fr", title:"Nkok : vitrine du développement industriel durable du Gabon", description:"La Zone Économique Spéciale de Nkok illustre la réussite du modèle gabonais alliant industrialisation, durabilité et emploi local.", img:"nkok.avif", link:"article-full3-fr.html", date:"2025-10-26" },
    { lang:"en", title:"Nkok: showcase of Gabon’s sustainable industrial development", description:"The Nkok Special Economic Zone highlights Gabon’s success in combining industrial growth, sustainability, and local employment.", img:"nkok.avif", link:"article-full3-en.html", date:"2025-10-26" },
  ];

  // --------- Helpers ----------
  const getLang = () => (document.documentElement.lang || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  const isNewsListingPage = () => /actualites(-en)?\.html$/i.test(location.pathname);
  const formatDate = (iso, lang) => new Date(iso + "T00:00:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year:"numeric", month:"long", day:"numeric" });

  // --------- Styles dynamiques ----------
  function ensureStyles() {
    if (document.getElementById("news-style")) return;
    const style = document.createElement("style");
    style.id = "news-style";
    style.textContent = `
      .news-card { text-decoration:none !important; color:inherit !important; display:block; overflow:hidden; }
      .news-card .news-title {
        font-weight:600;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; /* limite à 2 lignes */
        line-height:1.4em;
        max-height:2.8em;
        margin-bottom:8px;
      }
      .news-card .news-desc {
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3; /* limite à 3 lignes */
        line-height:1.5em;
        max-height:4.5em;
        margin-bottom:6px;
      }
      .news-card .read-more {
        color:#007a3d; /* vert CDBG */
        font-weight:500;
        text-decoration:none;
        display:inline-block;
        margin-top:4px;
      }
      .news-card .read-more:hover {
        text-decoration:underline;
      }
    `;
    document.head.appendChild(style);
  }

  // --------- Construction cartes ----------
  const createCard = (a) => {
    const desc = a.description && a.description.trim() !== "" 
      ? a.description.trim() 
      : "";
    const hasDesc = desc.length > 0;
    const readMore = `<a class="read-more" href="${a.link}" target="${a._isRSS ? '_blank' : '_self'}" rel="noopener">Lire la suite</a>`;
    const descBlock = `<p class="news-desc">${desc}</p>${readMore}`;

    const html = `
      <a href="${a.link}" class="news-card" ${a._isRSS ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        ${a.img ? `<div class="news-image"><img src="${a.img}" alt="${a.title}"></div>` : ""}
        <div class="news-content">
          <h3 class="news-title">${a.title}</h3>
          ${descBlock}
        </div>
      </a>
    `.trim();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  };

  // --------- Parsing RSS ----------
  async function parseRSS(url, tag="PFBC") {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const text = await res.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      return Array.from(xml.querySelectorAll("item")).map(it => {
        const title = it.querySelector("title")?.textContent.trim() || "";
        const desc = it.querySelector("description")?.textContent || "";
        const link = it.querySelector("link")?.textContent.trim() || "#";
        const pub = it.querySelector("pubDate")?.textContent.trim() || "1970-01-01";
        const dateISO = new Date(pub).toISOString().slice(0,10);
        const imgTag = it.querySelector("enclosure[url]")?.getAttribute("url") || "";
        return { title, description: desc.replace(/<[^>]+>/g,"").trim(), img: imgTag, link, date: dateISO, _isRSS:true, _sourceTag:tag };
      });
    } catch(e) { return []; }
  }

  // --------- Injection ----------
  async function inject() {
    ensureStyles();
    const lang = getLang();
    const local = STATIC_ARTICLES.filter(a=>a.lang===lang);
    const rss1 = await parseRSS(RSS_URL_OVERRIDE_1, "PFBC");
    const rss2 = await parseRSS(RSS_URL_OVERRIDE_2, "ATIBT");
    const all = [...local, ...rss1, ...rss2].sort((a,b)=>a.date<b.date?1:-1);
    const containers = document.querySelectorAll(".news-grid, #latest-news, #news");
    containers.forEach(c=>{
      c.innerHTML="";
      all.forEach(a=>c.appendChild(createCard(a)));
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
