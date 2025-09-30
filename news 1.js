
document.addEventListener("DOMContentLoaded", function () {
  const feeds = {
    fr: "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e",
    en: "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e"
  };

  function fetchNews(lang, containerId) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feeds[lang]}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        data.items.slice(0, 5).forEach(item => {
          let image = "";
          if (item.enclosure && item.enclosure.link) {
            image = `<img src="${item.enclosure.link}" alt="${item.title}" />`;
          } else {
            image = `<div class="news-image no-image">
                       <h3>${item.title}</h3>
                     </div>`;
          }

          const description = item.description
            ? item.description.replace(/<[^>]+>/g, "").substring(0, 300)
            : "";

          const card = document.createElement("div");
          card.className = "news-card";
          card.innerHTML = `
            <div class="news-image">
              ${image}
            </div>
            <div class="news-content">
              <h3>${item.title}</h3>
              <p class="excerpt">${description}</p>
              <p class="source">Partenariat pour les forêts du Bassin du Congo</p>
              <a href="${item.link}" target="_blank">Lire plus</a>
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
