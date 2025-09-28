import feedparser
import json
from datetime import datetime
from feedgen.feed import FeedGenerator

# URL du flux RSS unique
RSS_FEED = "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e"  # Flux RSS du Partenariat pour les Forêts du Bassin du Congo

def parse_date(date_str):
    """Essaie plusieurs formats de date avant de renvoyer une date valide."""
    formats = [
        "%a, %d %b %Y %H:%M:%S GMT",  # Format courant
        "%Y-%m-%dT%H:%M:%SZ",         # Format ISO 8601
        "%a, %d %b %Y %H:%M:%S %z"    # Format avec décalage horaire
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    # Retourne la date courante si aucun format ne correspond
    return datetime.utcnow()

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
        
        # Si la date est vide, on la remplace par la date courante
        if not date:
            date = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")

        # Utilisation de la source fixe
        source = "Partenariat pour les forêts du bassin du Congo"  # Source fixe

        # Parse de la date avec gestion des erreurs
        parsed_date = parse_date(date)

        articles.append({
            "titre": titre,
            "lien": lien,
            "date": parsed_date.strftime("%a, %d %b %Y %H:%M:%S GMT"),  # Format RFC822
            "source": source  # Source fixe
        })

    # Trier les articles par date (si la date est présente)
    articles.sort(key=lambda x: x["date"], reverse=True)

    # Sauvegarde du flux RSS unique en JSON
    with open("merged_feed.json", "w", encoding="utf-8") as f:
        json.dump({
            "derniere_mise_a_jour": datetime.utcnow().isoformat() + "Z",
            "articles": articles
        }, f, ensure_ascii=False, indent=2)

    # Sauvegarde du flux RSS unique en XML
    fg = FeedGenerator()
    fg.title("Actualités CDBG")
    fg.link(href="https://www.cdbg-gabon.com/", rel="alternate")
    fg.description("Flux RSS du Partenariat pour les forêts du bassin du Congo")
    fg.language("fr")

    # Ajout des articles (limitée à 20)
    for article in articles[:20]:
        fe = fg.add_entry()
        fe.title(article["titre"])
        fe.link(href=article["lien"])
        fe.description(article["source"])
        
        # Conversion de la date en format RFC822 pour RSS
        pub_date = datetime.strptime(article["date"], "%a, %d %b %Y %H:%M:%S GMT")
        fe.pubDate(pub_date)

    fg.rss_file("actualites.xml")

if __name__ == "__main__":
    traiter_flux()
    print("✅ Fichiers merged_feed.json et actualites.xml générés avec succès")
