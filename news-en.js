async function loadForestNewsEN() {
    const container = document.getElementById("news-en");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS en français (pour la version anglaise aussi)
        const response = await fetch(rssUrl);
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        if (items.length === 0) {
            container.innerHTML = "<p>No articles available at the moment.</p>";
            return;
        }

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "No title";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const description = item.querySelector("description")?.textContent || "";
            const imageUrl = item.querySelector("enclosure")?.getAttribute("url") || "default-image.jpg";

            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link;
            card.target = "_blank";

            card.innerHTML = `
                <img src="${imageUrl}" alt="${title}">
                <div class="actus-card-content">
                    <h3>${title}</h3>
                    <p class="date">${new Date(date).toLocaleDateString("en-GB")}</p>
                    <p class="excerpt">${description.substring(0, 120)}...</p>
                    <p class="source">Source: ${item.querySelector("source") ? item.querySelector("source").textContent : "Unknown"}</p>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error("Error loading English news:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsEN);
