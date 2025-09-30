
document.addEventListener("DOMContentLoaded", function () {
  const rssUrl = "https://forestsnews.cifor.org/feed"; // flux unique FR/EN
  const containerFr = document.getElementById("news-fr");
  const containerEn = document.getElementById("news-en");

  fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl))
    .then((res) => res.json())
    .then((data) => {
      const items = data.items.slice(0, 5); // limiter à 5 articles
      renderNews(items, containerFr);
      renderNews(items, containerEn);
    })
    .catch((err) => console.error("Erreur RSS:", err));

  function renderNews(items, container) {
    if (!container) return;
    container.innerHTML = "";

    items.forEach((item) => {
      // Supprimer si pas de titre
      if (!item.title || item.title.trim() === "") return;

      const card = document.createElement("div");
      card.classList.add("news-card");

      // Image ou placeholder
      let image = item.thumbnail && item.thumbnail !== "" ? item.thumbnail : null;
      if (image) {
        card.innerHTML += `
          <img src="${image}" alt="${item.title}" class="news-image" loading="lazy"/>
        `;
      } else {
        card.classList.add("placeholder");
      }

      // Titre cliquable
      card.innerHTML += `
        <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
      `;

      // Description tronquée + Lire plus
      if (item.description) {
        let text = item.description.replace(/<[^>]*>?/gm, "").trim();
        if (text.length > 200) text = text.substring(0, 200) + "...";
        card.innerHTML += `<p>${text} <a href="${item.link}" target="_blank" rel="noopener">Lire plus</a></p>`;
      }

      // Source fixe
      card.innerHTML += `<div class="source">Partenariat pour les Forêts du Bassin du Congo (PFBC)</div>`;

      container.appendChild(card);
    });
  }
});
