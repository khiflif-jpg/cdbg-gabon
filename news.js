async function loadForestNewsFR() {
    const container = document.getElementById("news-fr");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS en français
        const response = await fetch(rssUrl);
        if (!response.ok) {
            console.error("Erreur lors du chargement du flux RSS");
            return;
        }
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        if (items.length === 0) {
            console.log("Aucun article trouvé.");
            container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
            return;
        }

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const source = item.querySelector("source")?.textContent || "Source inconnue";
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "foret.webp";

            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#";
            card.target = "_blank";

            card.innerHTML = `
                <img src="${image}" alt="${title}">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p>${description.substring(0, 120)}...</p>
                    <p class="source">${new Date(date).toLocaleDateString("fr-FR")} — ${source}</p>
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités françaises :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsFR);
