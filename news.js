async function loadForestNewsFR() {
    const container = document.getElementById("news-fr"); // Conteneur des articles en français
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/flux-fusionne-fr.xml"; // Flux RSS en français
        const response = await fetch(rssUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        if (items.length === 0) {
            container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
            return;
        }

        container.innerHTML = "";

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";

            const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link;
            card.target = "_blank";

            card.innerHTML = `
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p class="date">${formattedDate}</p>
                    <p class="source">Source: Partenariat pour les forêts du bassin du Congo</p>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
        container.innerHTML = "<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsFR);
