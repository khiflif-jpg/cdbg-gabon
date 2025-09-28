async function loadForestNewsEN() {
    const container = document.getElementById("news-en");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/flux-fusionne-fr.xml"; // Flux RSS
        const response = await fetch(rssUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        if (items.length === 0) {
            container.innerHTML = "<p>No articles available at the moment.</p>";
            return;
        }

        container.innerHTML = "";

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "No title";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";

            const formattedDate = new Date(date).toLocaleDateString("en-GB", {
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
        console.error("Error loading English news:", error);
        container.innerHTML = "<p>Error loading the articles. Please try again later.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsEN);
