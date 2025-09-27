async function loadForestNewsEN() {
    const container = document.getElementById("actus-cards-en");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Le flux RSS français actualisé
        const response = await fetch(rssUrl);
        if (!response.ok) {
            console.error("Erreur lors du chargement du flux RSS");
            return;
        }
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        for (let i = 0; i < Math.min(5, items.length); i++) {
            const item = items[i];
            const title = item.querySelector("title")?.textContent || "No title";
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const source = item.querySelector("source")?.textContent || "Unknown source";
            const description = item.querySelector("description")?.textContent || "";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "foret.webp";

            // Traduction FR -> EN via l'API DeepL
            const translate = async (text) => {
                const apiKey = '198OD6Uy1QaRs2i9f'; // Votre clé API Deepl
                const url = `https://api-free.deepl.com/v2/translate?auth_key=${apiKey}&text=${encodeURIComponent(text)}&target_lang=EN`;

                try {
                    const res = await fetch(url, { method: 'POST' });
                    const data = await res.json();
                    return data.translations[0].text; // Retourne la traduction
                } catch (error) {
                    console.error("Erreur de traduction DeepL", error);
                    return text; // Retourne le texte original en cas d'erreur
                }
            };

            const translatedTitle = await translate(title);
            const translatedDescription = await translate(description.substring(0, 120));

            // Création de la carte d'article
            const card = document.createElement("a");
            card.className = "actus-card";
            card.href = link && link !== "#" ? link : "#"; // Si le lien est invalide, on redirige vers la même page.
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
