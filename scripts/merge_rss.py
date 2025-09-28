import feedparser
import json
from datetime import datetime, timezone
from feedgen.feed import FeedGenerator

# URL du flux RSS unique
RSS_FEED = "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e"  # Flux RSS PFBC

def parse_date(date_str):
    """Essaie plusieurs formats de date et ajoute toujours un fuseau horaire UTC."""
    formats = [
        "%a, %d %b %Y %H:%M:%S GMT",  # RFC822 classique
        "%Y-%m-%dT%H:%M:%SZ",         # ISO 8601
        "%a, %d %b %Y %H:%M:%S %z"    # RFC822 avec décalage horaire
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:  # Si datetime naïf → forcer UTC
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    # Si aucun format ne marche → renvoyer maintenant en UTC
    return datetime.now(timezone.utc)

def traiter_flux():
    articles = []
    
    try:
        # Récupération du flux RSS
        feed = feedparser.parse(RSS_FEED)
    except Exception as e:
        print(f"Erreur lors de la récupération du flux RSS : {e}")
        return

    for entry in feed.entries:
        # Extraction des informations de chaque article
        titre = entry.get("title", "")
        lien = entry.get("link", "")
        date = entry.get("published", "")

        if not date:
            date = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")

        source = "Partenariat pour les forêts du bassin du Congo"

        parsed_date = parse_date(date)

        articles.append({
            "titre": titre,
            "lien": lien,
            "date": parsed_date.strftime("%a, %d %b %Y %H:%M:%S GMT"),
            "source": source
        })

    # Trier les articles par date
    articles.sort(key=lambda x: x["date"], reverse=True)

    # Sauvegarde en JSON
    with open("merged_feed.json", "w", encoding="utf-8") as f:
        json.dump({
            "derniere_mise_a_jour": datetime.now(timezone.utc).isoformat(),
            "articles": articles
        }, f, ensure_ascii=False, indent=2)

    # Sauvegarde en XML
    fg = FeedGenerator()
    fg.title("Actualités CDBG")
    fg.link(href="https://www.cdbg-gabon.com/", rel="alternate")
    fg.description("Flux RSS du Partenariat pour les forêts du bassin du Congo")
    fg.language("fr")

    for article in articles[:20]:
        fe = fg.add_entry()
        fe.title(article["titre"])
        fe.link(href=article["lien"])
        fe.description(article["source"])

        pub_date = datetime.strptime(article["date"], "%a, %d %b %Y %H:%M:%S GMT")
        pub_date = pub_date.replace(tzinfo=timezone.utc)  # Forcer UTC
        fe.pubDate(pub_date)

    fg.rss_file("actualites.xml")

if __name__ == "__main__":
    traiter_flux()
    print("✅ Fichiers merged_feed.json et actualites.xml générés avec succès")
