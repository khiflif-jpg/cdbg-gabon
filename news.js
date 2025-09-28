async function loadNews({ xmlUrl, containerId, batch, lang }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Récupérer le contenu du flux RSS
        const response = await fetch(xmlUrl);
        const text = await response.text();

        console.log("Flux RSS chargé :", text); // Affiche le contenu brut du flux RSS

        // Parser le flux RSS
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        console.log("Articles trouvés :", items.length); // Affiche le nombre d'articles trouvés dans le flux

        // Si aucun article n'est trouvé
        if (items.length === 0) {
            console.log("Aucun article trouvé.");
            container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
            return;
        }

        // Vider le container avant de charger les articles
        container.innerHTML = "";

        // Parcourir les articles et les afficher
        for (let i = 0; i < Math.min(batch, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "Pas de titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";

            // Convertir la date en format lisible
            const formattedDate = new Date(date).toLocaleDateString(lang || 'fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Créer la carte pour l'article
            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#";
            card.target = "_blank";

            // Remplir la carte avec le titre, la date et la source fixe
            card.innerHTML = `
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p class="source">${formattedDate} — Partenariat pour les forêts du bassin du Congo</p>
                </div>
            `;

            // Ajouter la carte dans le container
            container.appendChild(card);
        }
    } catch (error) {
        // Gérer les erreurs lors du chargement du flux
        console.error("Erreur lors du chargement des actualités:", error);
        container.innerHTML = "<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>";
    }
}
