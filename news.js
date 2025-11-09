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

  // ✅ Flux RSS à jour (fonctionnels)
  const RSS_URL_OVERRIDE_1 = "https://rss.app/feeds/StEwzwMzjxl2nHIc.xml";  // PFBC (nouveau flux valide)
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

    { lang:"fr", title:"Code forestier de la République du Gabon (édition 2025 – CDBG) | Version PDF",
      description:"Version PDF du Code forestier de la République du Gabon (édition 2025 – CDBG).",
      img:"code-forestier-pdf.avif", link:"article-full5-fr.html", date:"2025-11-08" },
    { lang:"en", title:"Forest Code of the Republic of Gabon (2025 Edition – CDBG) | PDF Version",
      description:"PDF version of the Forest Code of the Republic of Gabon (2025 Edition – CDBG).",
      img:"code-forestier-pdf.avif", link:"article-full5-en.html", date:"2025-11-08" }
  ];

  // --------- Helpers : langue & page ----------
  const getLang = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    if (htmlLang.startsWith("fr")) return "fr";
    const href = (location.href || "").toLowerCase();
    if (href.includes("-en") || href.endsWith("/en.html") || href.includes("/en.html")) return "en";
    return "fr";
  };

  const formatDate = (iso, lang) => {
    try {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year:"numeric", month:"long", day:"numeric" });
    } catch { return iso; }
  };

  // --------- Génération carte ----------
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

  // --------- RSS ----------
  const getRSSUrls = () => [
    { url: RSS_URL_OVERRIDE_1, tag: "PFBC" },
    { url: RSS_URL_OVERRIDE_2, tag: "ATIBT" }
  ];

  const parseRSS = async (url, tag) => {
    const res = await fetch(url).catch(() => null);
    if (!res || !res.ok) return [];
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const decodeEntities = (s) => { const t = document.createElement("textarea"); t.innerHTML = s; return t.value; };

    return Array.from(xml.querySelectorAll("item")).map(it => ({
      title: it.querySelector("title")?.textContent?.trim() || "",
      description: decodeEntities(it.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "").trim().slice(0, 300),
      link: it.querySelector("link")?.textContent?.trim() || "#",
      date: new Date(it.querySelector("pubDate")?.textContent || "").toISOString().slice(0, 10),
      _isRSS: true,
      _sourceTag: tag
    }));
  };

  // --------- Injection ----------
  const inject = async () => {
    const lang = getLang();
    const containers = document.querySelectorAll(".news-grid, #latest-news, #news, #news-en");
    const localByLang = STATIC_ARTICLES.filter(a => a.lang === lang);

    const rssUrls = getRSSUrls();
    const rssArrays = await Promise.all(rssUrls.map(cfg => parseRSS(cfg.url, cfg.tag).catch(() => [])));
    const rssItems = rssArrays.flat();

    const all = [...localByLang, ...rssItems].sort((a,b) => (a.date < b.date ? 1 : -1));

    containers.forEach(c => {
      c.innerHTML = "";
      all.forEach(a => c.appendChild(createCardSafe(a)));
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
