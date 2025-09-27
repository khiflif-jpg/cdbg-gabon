async function loadRSSFeeds() {
  const urls = [
    'https://forestsnews.cifor.org/feed/',
    'https://comifac.org/feed/'
  ];

  const container = document.getElementById('news-container');
  if (!container) return;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const xml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'application/xml');
      const items = doc.querySelectorAll('item');

      items.forEach(item => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const pubDate = item.querySelector('pubDate').textContent;
        const description = item.querySelector('description').textContent;

        const article = document.createElement('div');
        article.classList.add('news-article');
        article.innerHTML = `
          <h3><a href="${link}" target="_blank">${title}</a></h3>
          <p><strong>${new Date(pubDate).toLocaleDateString()}</strong></p>
          <p>${description}</p>
        `;
        container.appendChild(article);
      });
    } catch (error) {
      console.error(`Erreur lors du chargement du flux RSS de ${url}:`, error);
    }
  }
}

document.addEventListener('DOMContentLoaded', loadRSSFeeds);
