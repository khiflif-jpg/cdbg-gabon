// ARTICLES STATIQUES – FRANÇAIS
const staticArticlesFR = [
  {
    id: "article1",
    title: "🌱 Le Gabon renforce sa politique forestière : lutte contre l’exploitation illégale, certification et traçabilité",
    link: "articles-francais.html", // lien vers page complète
    description: `
      <p>Le Gabon, riche de ses forêts équatoriales couvrant près de 88 % de son territoire, s’affirme comme un leader africain dans la gestion durable des ressources forestières. Le gouvernement, via le Ministère des Eaux et Forêts, intensifie la lutte contre l’exploitation illégale en déployant des patrouilles renforcées et des systèmes de surveillance numérique.</p>
      <p>La traçabilité est désormais certifiée par le Système National de Traçabilité des Bois du Gabon (SNTBG), assurant que chaque grume exploitée est légale et contrôlée. Cette démarche est soutenue par les certifications PAFC et FSC, gages de durabilité et de reconnaissance internationale.</p>
      <p>Les ONG comme Brainforest, The Nature Conservancy, WWF et Rainforest Foundation UK collaborent activement avec l’État gabonais pour la formation des acteurs locaux et le financement d’initiatives de reforestation et de contrôle forestier. Ces partenariats renforcent l’image du Gabon comme modèle de gestion forestière responsable.</p>
      <p>En parallèle, le pays participe à des forums internationaux sur la lutte contre la déforestation et la valorisation de la filière bois durable, notamment en Europe, promouvant ses certifications et sa politique de transparence dans le commerce du bois.</p>
      <p><strong>En conclusion</strong><br>
      Le Gabon démontre un engagement fort dans la préservation de ses forêts et la modernisation de sa filière bois, soutenu par le ministère des Eaux et Forêts, les certifications PAFC/FSC et les partenaires internationaux.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// ARTICLES STATIQUES – ANGLAIS
const staticArticlesEN = [
  {
    id: "article1",
    title: "🌱 Gabon Strengthens Forestry Policy: Combating Illegal Logging, Certification, and Traceability",
    link: "articles-anglais.html", // lien vers page complète
    description: `
      <p>Gabon, with forests covering 88% of its territory, asserts itself as a continental leader in sustainable forest management. The government, through the Ministry of Water and Forests, is intensifying the fight against illegal logging by deploying reinforced patrols and digital monitoring systems.</p>
      <p>Traceability is now certified through the Gabon National Timber Traceability System (SNTBG), ensuring that every log is legal and fully controlled. This is supported by PAFC and FSC certifications, recognized internationally for sustainable forestry.</p>
      <p>NGOs such as Brainforest, The Nature Conservancy, WWF, and Rainforest Foundation UK actively collaborate with the Gabonese government to train local stakeholders and fund reforestation and forest control initiatives. These partnerships strengthen Gabon's reputation as a model for responsible forest management.</p>
      <p>At the same time, Gabon participates in international forums on deforestation control and sustainable timber promotion, notably in Europe, highlighting its certifications and transparent wood trade policy.</p>
      <p><strong>In conclusion</strong><br>
      Gabon demonstrates a strong commitment to preserving its forests and modernizing its timber sector, supported by the Ministry of Water and Forests, PAFC/FSC certifications, and international partners.</p>
    `,
    pubDate: "2025-10-05T10:00:00Z",
    image: "article1.avif"
  }
];

// INJECTION DES ARTICLES STATIQUES DANS LE CONTENEUR
function injectMyArticles(lang, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const articles = lang === "fr" ? staticArticlesFR : staticArticlesEN;

  articles.forEach(article => {
    const card = document.createElement("a");
    card.className = "article-card";
    card.href = article.link; // lien vers page complète
    card.innerHTML = `
      <div class="article-image">
        <img src="${article.image}" alt="${article.title}" />
      </div>
      <div class="article-content">
        <h3 class="article-title">${article.title}</h3>
        <p class="article-text">
          ${article.description.replace(/<[^>]+>/g, "").substring(0, 200)}...
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}
