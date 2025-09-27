async function loadForestNewsEN() {
    const container = document.getElementById("actus-cards-en");
    if (!container) return;

    try {
        console.log("Chargement du flux RSS...");
        const rssUrl = "https://www.cdbg-gabon.com/flux-fusionne.xml"; // Flux RSS avec votre domaine
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
            container.innerHTML = "<p>No articles available at the moment.</p>";
            return;
        }

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "No title";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const source = item.querySelector("source")?.textContent || "Unknown source";
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "foret.webp";

            const translate = async (text) => {
                const res = await fetch(
                    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=" + encodeURIComponent(text)
                );
                const data = await res.json();
                return data[0][0][0]; // Résultat traduit
            };

            const translatedTitle = await translate(title);
            const translatedDescription = await translate(description.substring(0, 120));

            console.log("Article chargé:", translatedTitle);

            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#";
            card.target = "_blank";

            card.innerHTML = `
                <img src="${image}" alt="${translatedTitle}">
                <div class="actus-card-content">
                    <h3>${translatedTitle}</h3>
                    <p>${translatedDescription}...</p>
                    <p class="source">${new Date(date).toLocaleDateString("en-GB")} — ${source}</p>
                </div>
            `;

            container.appendChild(card);
        }
    } catch (error) {
        console.error("Error loading English news:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadForestNewsEN);
