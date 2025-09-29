async function loadNews({ xmlUrl, containerId, loadMoreBtnId, batch = 10, lang = "fr" }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(xmlUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        if (items.length === 0) {
            container.innerHTML = lang === "fr"
                ? "<p>Aucun article disponible pour le moment.</p>"
                : "<p>No articles available at the moment.</p>";
            return;
        }

        let index = 0;
        function renderBatch() {
            for (let i = 0; i < batch && index < items.length; i++, index++) {
                const item = items[i];
                const title = item.querySelector("title")?.textContent || (lang === "fr" ? "Pas de titre" : "No title");
                const link = item.querySelector("link")?.textContent || "#";
                const date = item.querySelector("pubDate")?.textContent || "";

                // ✅ On essaie de récupérer une image
                let imageUrl = "";
                const mediaContent = item.querySelector("media\\:content, content\\:encoded, enclosure");
                if (mediaContent) {
                    imageUrl = mediaContent.getAttribute("url") || "";
                }

                const formattedDate = date
                    ? new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      })
                    : "";

                // ✅ Carte cliquable
                const card = document.createElement("a");
                card.className = "actus-card";
                card.href = link;
                card.target = "_blank";
                card.rel = "noopener noreferrer";

                card.innerHTML = `
                    <div class="actus-card-content">
                        ${imageUrl ? `<div class="news-img"><img src="${imageUrl}" alt="Aperçu de l'article"></div>` : ""}
                        <h3>${title}</h3>
                        <p class="date">${formattedDate}</p>
                        <p class="source">${lang === "fr"
                            ? "Source: Partenariat pour les forêts du bassin du Congo"
                            : "Source: Congo Basin Forest Partnership"}</p>
                    </div>
                `;
                container.appendChild(card);
            }

            if (index >= items.length && loadMoreBtnId) {
                document.getElementById(loadMoreBtnId).style.display = "none";
            }
        }

        renderBatch();

        if (loadMoreBtnId) {
            const btn = document.getElementById(loadMoreBtnId);
            btn.addEventListener("click", renderBatch);
        }
    } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
        container.innerHTML = lang === "fr"
            ? "<p>Impossible de charger les articles. Veuillez réessayer plus tard.</p>"
            : "<p>Error loading the articles. Please try again later.</p>";
    }
}
