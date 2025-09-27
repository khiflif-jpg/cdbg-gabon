async function loadNews({ xmlUrl, containerId, loadMoreBtnId, batch = 5, lang = "fr" }) {
const container = document.getElementById(containerId);
const loadMoreBtn = document.getElementById(loadMoreBtnId);

try {
const res = await fetch(xmlUrl + "?t=" + Date.now()); // éviter cache
if (!res.ok) throw new Error("Erreur réseau");
const text = await res.text();
const xml = new DOMParser().parseFromString(text, "application/xml");
const items = Array.from(xml.querySelectorAll("item"));

let shown = 0;

function extractImage(desc) {
const match = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
return match ? match[1] : null;
}

function renderNext() {
const slice = items.slice(shown, shown + batch);

slice.forEach(it => {
const title = it.querySelector("title")?.textContent || "";
const link = it.querySelector("link")?.textContent || "#";
const date = it.querySelector("pubDate")?.textContent || "";
const desc = it.querySelector("description")?.textContent || "";
const sourceMatch = desc.match(/<em>Source: (.*?)<\/em>/i);
const source = sourceMatch ? sourceMatch[1] : "Source inconnue";
const imgUrl = extractImage(desc);

const cleanDesc = desc
.replace(/<[^>]*>/g, "") // enlever balises HTML
.replace(/Source:.*/i, "")
.trim();

const card = document.createElement("article");
card.className = "news-card";
card.innerHTML = `
${imgUrl ? `<div class="news-img"><img src="${imgUrl}" alt=""></div>` : ""}
<div class="news-content">
<h3><a href="${link}" target="_blank" rel="noopener">${title}</a></h3>
<p class="date">${date ? new Date(date).toLocaleDateString() : ""}</p>
<p class="excerpt">${cleanDesc}</p>
<p class="source"><em>${source}</em></p>
</div>
`;
container.appendChild(card);
});

shown += slice.length;
if (shown >= items.length) loadMoreBtn.style.display = "none";
}
