async function loadForestNewsEN() {
    const container = document.getElementById("news-en");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS en français uniquement
        const response = await fetch(rssUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";
            const imageUrl = item.querySelector("enclosure")?.getAttribute("url") || "default-image.jpg"; // Image par défaut si non trouvée

            // Créer la carte de l'article avec le contenu en français
            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link;
            card.target = "_blank";

            card.innerHTML = `
                <img src="${imageUrl}" alt="${title}">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p class="date">${new Date(date).toLocaleDateString("fr-CA")}</p>
                    <p class="excerpt">${description.substring(0, 120)}...</p>
                    <p class="source">Source: ${item.querySelector("source") ? item.querySelector("source").textContent : "Inconnue"}</p>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsEN);
