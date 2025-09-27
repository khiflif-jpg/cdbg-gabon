async function loadForestNewsFR() {
    console.log("Chargement du flux RSS en français...");  // Ajoutez ici le message pour vérifier que la fonction est bien appelée

    const container = document.getElementById("news-fr");  // Assurez-vous que l'ID du conteneur est correct
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS français
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
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "default-image.jpg"; // Image par défaut

            // Créer une carte pour chaque article
            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#";
            card.target = "_blank";

            card.innerHTML = `
                <img src="${image}" alt="${title}">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p>${description.substring(0, 120)}...</p>
                    <p class="date">${new Date(date).toLocaleDateString("fr-FR")}</p>
                    <p class="source">${item.querySelector("source") ? item.querySelector("source").textContent : "Source inconnue"}</p>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités françaises :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsFR);
