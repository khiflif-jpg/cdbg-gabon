import feedparser
import json
from datetime import datetime
from feedgen.feed import FeedGenerator

# Liste des flux RSS à fusionner (modifiée avec les bonnes sources)
RSS_FEEDS = [
    "https://www.gabonreview.com/feed",  # URL corrigée
    "https://forestsnews.cifor.org/feed",  # Flux RSS CIFOR
    "https://comifac.org/feed/"  # Flux RSS COMIFAC
]

def fusionner_flux():
    articles = []

    # Parcours de chaque flux RSS
    for url in RSS_FEEDS:
        feed = feedparser.parse(url)
        for entry in feed.entries:
            # Ajout de l'article au tableau
            articles.append({
                "titre": entry.get("title", ""),
                "lien": entry.get("link", ""),
                "date": entry.get("published", ""),
                "source": feed.feed.get("title", "")
            })

    # Trier les articles par date (si la date est présente)
    articles.sort(key=lambda x: x["date"] or "", reverse=True)

    # Sauvegarde du flux RSS fusionné en JSON
    with open("merged_feed.json", "w", encoding="utf-8") as f:
        json.dump({
            "derniere_mise_a_jour": datetime.utcnow().isoformat() + "Z",
            "articles": articles
        }, f, ensure_ascii=False, indent=2)

    # Sauvegarde du flux RSS fusionné en XML
    fg = FeedGenerator()
    fg.title("Actualités CDBG")
    fg.link(href="https://www.cdbg-gabon.com/", rel="alternate")
    fg.description("Flux RSS fusionné CDBG")
    fg.language("fr")

    # Ajout des articles (limitée à 20)
    for article in articles[:20]:
        fe = fg.add_entry()
        fe.title(article["titre"])
        fe.link(href=article["lien"])
        fe.description(article["source"])
        if article["date"]:
            try:
                # Conversion de la date en format RFC822 pour RSS
                pub_date = datetime.strptime(article["date"], "%a, %d %b %Y %H:%M:%S %z")
                fe.pubDate(pub_date)
            except ValueError:
                print(f"Date format issue for article: {article['titre']}")
                fe.pubDate(datetime.utcnow())

    fg.rss_file("actualites.xml")

if __name__ == "__main__":
    fusionner_flux()
    print("✅ Fichiers merged_feed.json et actualites.xml générés avec succès")
