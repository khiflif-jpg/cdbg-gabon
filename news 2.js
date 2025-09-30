
document.addEventListener("DOMContentLoaded", function () {
  const feeds = {
    fr: "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e",
    en: "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e"
  };

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
  }

  function fetchNews(lang, containerId) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feeds[lang]}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        data.items.slice(0, 5).forEach(item => {
          // Supprimer carte si pas de titre
          if (!item.title) return;

          let imageBlock = "";
          if (item.enclosure && item.enclosure.link) {
            // Carte avec image réelle
            imageBlock = `<div class="news-image">
                            <img src="${item.enclosure.link}" alt="${item.title}" />
                          </div>`;
          } else {
            // Carte verte placeholder
            imageBlock = `<div class="news-image no-image">
                            <a href="${item.link}" target="_blank"><h3>${item.title}</h3></a>
                          </div>`;
          }

          // Nettoyer et tronquer la description
          const description = item.description
            ? truncateText(item.description.replace(/<[^>]+>/g, ""), 300)
            : "";

          // Construire la carte
          const card = document.createElement("div");
          card.className = "news-card";
          card.innerHTML = `
            ${imageBlock}
            <div class="news-content">
              ${item.enclosure && item.enclosure.link ? `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3>` : ""}
              <p class="excerpt">${description}</p>
              <p class="source">Partenariat pour les Forêts du Bassin du Congo</p>
              <a href="${item.link}" target="_blank" class="read-more">Lire plus</a>
            </div>
          `;
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Erreur chargement RSS:", err));
  }

  if (document.getElementById("news-fr")) {
    fetchNews("fr", "news-fr");
  }
  if (document.getElementById("news-en")) {
    fetchNews("en", "news-en");
  }
});
