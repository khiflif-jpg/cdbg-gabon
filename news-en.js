// === Chargement des actualités forestières en anglais ===
async function loadForestNewsEN() {
const container = document.getElementById("actus-cards-en");
if (!container) return;

try {
const rssUrl = "https://www.cdbg.com/flux-fusionne.xml";
const response = await fetch(rssUrl);
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

// Traduction FR -> EN via Google Translate API (endpoint non officiel)
const translate = async (text) => {
const res = await fetch(
"https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=" + encodeURIComponent(text)
);
const data = await res.json();
return data[0][0][0]; // Résultat traduit
};

const translatedTitle = await translate(title);
const translatedDescription = await translate(description.substring(0, 120));

// Création de la carte
const card = document.createElement("a");
card.className = "actus-card";
card.href = link;
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
