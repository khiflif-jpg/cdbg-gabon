async function loadNews({ xmlUrl, containerId, batch = 10, lang = "fr" }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cacheKey = `newsCache_${lang}`;
  const cacheTTL = 1000 * 60 * 60 * 6; // 6 heures
  const now = Date.now();

  // 1️⃣ Essaie de charger depuis le cache local
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    if (cached.data && now - cached.time < cacheTTL) {
      renderNews(cached.data, container, lang);
      console.info("🟢 News chargées depuis le cache local");
      return;
    }
  } catch (e) {
    console.warn("Cache local invalide, rechargement du flux...");
  }

  // 2️⃣ Si pas de cache, charge depuis le flux RSS
  try {
    let res = await fetch(xmlUrl);
    if (!res.ok) {
      console.warn("⚠️ Flux direct bloqué, tentative via AllOrigins");
      res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(xmlUrl)}`);
    }

    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const items = [...xml.querySelectorAll("item")].slice(0, batch);

    const data = items.map(item => ({
      title: item.querySelector("title")?.textContent?.trim() || "Sans titre",
      link: item.querySelector("link")?.textContent?.trim() || "#",
      description: (item.querySelector("description")?.textContent || "")
        .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
        .replace(/<[^>]*>/g, "")
        .trim(),
      pubDate: new Date(item.querySelector("pubDate")?.textContent || Date.now()).toLocaleDateString(lang),
      imageUrl:
        item.querySelector("media\\:content")?.getAttribute("url") ||
        (item.querySelector("description")?.textContent.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]) ||
        ""
    }));

    renderNews(data, container, lang);

    // 3️⃣ Met en cache local
    localStorage.setItem(cacheKey, JSON.stringify({ time: now, data }));
    console.info("🟢 Flux mis en cache local");
  } catch (err) {
    console.error("Erreur RSS :", err);
    container.innerHTML = `<p style="text-align:center;color:#666;">
      ${lang === "fr" ? "Aucune actualité disponible." : "No news available."}
    </p>`;
  }
}

function renderNews(data, container, lang) {
  container.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <div class="news-image">
        ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" loading="lazy">` : ""}
      </div>
      <div class="news-content">
        <h3 class="news-title">${item.title}</h3>
        <p class="news-desc">${item.description}</p>
        <div class="news-meta">${item.pubDate} – <a href="${item.link}" target="_blank" rel="noopener noreferrer">Source : PFBC</a></div>
      </div>
    `;
    container.appendChild(card);
  });

  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(260px, 1fr))";
  container.style.gap = "24px";
  container.style.alignItems = "stretch";
  container.style.justifyContent = "center";
}

function injectStaticArticles(lang = "fr", container) {
  if (!container) return;
  const articles = [
    {
      lang: "fr",
      title: "Le Gabon renforce sa politique forestière",
      description:
        "Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’impose comme un leader africain dans la gestion durable des ressources forestières…",
      img: "article1.avif",
      link: "article-full-fr.html",
      date: "2025-09-12"
    },
    {
      lang: "en",
      title: "Gabon strengthens its forest policy",
      description:
        "Gabon, rich in its equatorial forests, stands as a leader in sustainable forest management and biodiversity preservation.",
      img: "article1.avif",
      link: "article-full-en.html",
      date: "2025-09-12"
    }
  ];

  const article = articles.find(a => a.lang === lang);
  if (!article) return;
  const dateObj = new Date(article.date);
  const formattedDate = dateObj.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" });
  const source = "CDBG Magazine";

  const card = document.createElement("article");
  card.className = "news-card";
  card.innerHTML = `
    <div class="news-image">
      <img src="${article.img}" alt="${article.title}">
    </div>
    <div class="news-content">
      <h3 class="news-title">${article.title}</h3>
      <p class="news-desc">${article.description}</p>
      <div class="news-meta">${formattedDate} – ${source}</div>
    </div>
  `;
  container.prepend(card);
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "fr";
  const container =
    document.getElementById("news-fr") ||
    document.getElementById("news-en") ||
    document.getElementById("news-container");

  if (!container) return;
  injectStaticArticles(lang, container);
  loadNews({
    xmlUrl: "https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml",
    containerId: container.id,
    batch: 12,
    lang
  });
});
