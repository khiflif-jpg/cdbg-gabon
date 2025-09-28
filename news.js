async function loadNews({ xmlUrl, containerId, batch, lang }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(xmlUrl);
        const text = await response.text();

        console.log("Flux RSS chargé :", text); // Affiche le contenu brut du flux RSS

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        console.log("Articles trouvés :", items.length); // Affiche le nombre d'articles trouvés dans le flux

        if (items.length === 0) {
            console.log("Aucun article trouvé.");
            container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
            return;
        }

        for (let i = 0; i < Math.min(batch, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "default-image.jpg";

            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#";
            card.target = "_blank";

            card.innerHTML = `
                <img src="${image}" alt="${title}">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p>${description.substring(0, 120)}...</p>
                    <p class="source">${new Date(date).toLocaleDateString(lang)} — ${item.querySelector("source") ? item.querySelector("source").textContent : "Source inconnue"}</p>
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités:", error);
    }
}
