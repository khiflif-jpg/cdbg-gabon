async function translateText(text) {
  const apiKey = '310347c5-d45a-492a-bfae-65f6bd19c98f:fx';  // Ta clé API Deepl
  const url = `https://api-free.deepl.com/v2/translate?auth_key=${apiKey}&text=${encodeURIComponent(text)}&target_lang=EN`;

  try {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    if (data.translations && data.translations[0]) {
      return data.translations[0].text;  // Retourne le texte traduit
    } else {
      console.error("Erreur de traduction", data);
      return text;
    }
  } catch (error) {
    console.error("Erreur avec l'API Deepl", error);
    return text;  // Retourne le texte original en cas d'erreur
  }
}

async function loadForestNewsEN() {
    const container = document.getElementById("news-en");
    if (!container) return;

    try {
        const rssUrl = "https://www.cdbg-gabon.com/actualites.xml"; // Flux RSS en anglais
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
            const title = await translateText(item.querySelector("title")?.textContent || "No title");
            const link = item.querySelector("link")?.textContent || "#";
            const date = item.querySelector("pubDate")?.textContent || "";
            const source = item.querySelector("source")?.textContent || "Unknown source";
            const description = await translateText(item.querySelector("description")?.textContent || "");
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
