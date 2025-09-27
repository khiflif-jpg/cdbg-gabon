import feedparser
import json
from datetime import datetime
from feedgen.feed import FeedGenerator

# Liste des flux RSS à fusionner (modifiée avec les bonnes sources)
RSS_FEEDS = [
    "https://https://www.gabonreview.com/feed",
    "https://forestsnews.cifor.org/feed",
    "https://comifac.org/feed/"
]

def fusionner_flux():
    articles = []

    for url in RSS_FEEDS:
        feed = feedparser.parse(url)
        for entry in feed.entries:
            articles.append({
                "titre": entry.get("title", ""),
                "lien": entry.get("link", ""),
                "date": entry.get("published", ""),
                "source": feed.feed.get("title", "")
            })

    # Trier par date si possible
    articles.sort(key=lambda x: x["date"] or "", reverse=True)

    # --- Sauvegarde JSON ---
    with open("merged_feed.json", "w", encoding="utf-8") as f:
        json.dump({
            "derniere_mise_a_jour": datetime.utcnow().isoformat() + "Z",
            "articles": articles
        }, f, ensure_ascii=False, indent=2)

    # --- Sauvegarde RSS XML ---
    fg = FeedGenerator()
    fg.title("Actualités CDBG")
    fg.link(href="https://www.cdbg-gabon.com/", rel="alternate")
    fg.description("Flux RSS fusionné CDBG")
    fg.language("fr")

    for article in articles[:20]:  # Limité à 20 articles
        fe = fg.add_entry()
        fe.title(article["titre"])
        fe.link(href=article["lien"])
        fe.description(article["source"])
        if article["date"]:
            fe.pubDate(article["date"])

    fg.rss_file("actualites.xml")

if __name__ == "__main__":
    fusionner_flux()
    print("✅ Fichiers merged_feed.json et actualites.xml générés avec succès")
