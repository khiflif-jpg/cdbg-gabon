async function loadForestNewsFR() {
    const container = document.getElementById("news-fr");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS en français
        const response = await fetch(rssUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        // Boucle pour traiter les articles du flux RSS
        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const source = item.querySelector("source")?.textContent || "Source inconnue";
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "default-image.jpg"; // Image par défaut si non trouvée

            // Limiter la description pour en faire un résumé
            const summary = description.length > 200 ? description.substring(0, 200) + "..." : description;

            // Créer la carte de l'article
            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link;
            card.target = "_blank";

            // Remplir le contenu de la carte avec les informations extraites
            card.innerHTML = `
                <img src="${image}" alt="${title}" class="article-image">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p class="date">${new Date(date).toLocaleDateString("fr-FR")}</p>
                    <p class="excerpt">${summary}</p> <!-- Résumé de l'article -->
                    <p class="source">Source: ${source}</p>
                    <p class="read-more"><a href="${link}" target="_blank">Lire l'article complet</a></p> <!-- Lien pour lire l'article complet -->
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités françaises :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsFR);
