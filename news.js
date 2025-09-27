async function loadForestNewsFR() {
  const container = document.getElementById("news-fr");
  if (!container) return;

  try {
    const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS français
    const response = await fetch(rssUrl);
    
    if (!response.ok) {
      console.error("Erreur lors du chargement du flux RSS français", response.status);
      return;
    }

    const text = await response.text();
    console.log("Flux RSS récupéré : ", text); // Vérification du contenu du flux

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");

    if (items.length === 0) {
      console.log("Aucun article trouvé dans le flux RSS.");
      container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
      return;
    }

    for (let i = 0; i < Math.min(5, items.length); i++) {
      const item = items[i];
      
      // Extraire les informations
      const title = item.querySelector("title")?.textContent || "Pas de titre";
      const link = item.querySelector("link")?.textContent || "#";
      const date = item.querySelector("pubDate")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const image = item.querySelector("enclosure")?.getAttribute("url") || "foret.webp";

      // Créer une carte d'article
      const card = document.createElement("a");
      card.className = "news-card";
      card.href = link;
      card.target = "_blank";

      card.innerHTML = `
        <img src="${image}" alt="${title}">
        <div class="news-card-content">
          <h3>${title}</h3>
          <p>${description.substring(0, 120)}...</p>
          <p class="source">${new Date(date).toLocaleDateString("fr-FR")}</p>
        </div>
      `;

      container.appendChild(card);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des actualités françaises :", error);
  }
}

document.addEventListener("DOMContentLoaded", loadForestNewsFR);
