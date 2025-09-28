import feedparser
import json
from datetime import datetime, timezone
from feedgen.feed import FeedGenerator

# URL du flux RSS source (Feedfry)
RSS_FEED = "https://feedfry.com/rss/11f09c60ca0751419b73c43573c94c6e"

def parse_date(date_str):
    """Convertit une date en datetime UTC, avec fallback si format inconnu."""
    formats = [
        "%a, %d %b %Y %H:%M:%S %Z",
        "%a, %d %b %Y %H:%M:%S %z",
        "%Y-%m-%dT%H:%M:%SZ"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except Exception:
            continue
    return datetime.now(timezone.utc)  # fallback

def traiter_flux():
    articles = []

    try:
        feed = feedparser.parse(RSS_FEED)
    except Exception as e:
        print(f"❌ Erreur lors de la récupération du flux RSS : {e}")
        return

    for entry in feed.entries:
        titre = entry.get("title", "").strip()
        lien = entry.get("link", "").strip()
        date_str = entry.get("published", "")

        # Si pas de date → fallback à maintenant
        parsed_date = parse_date(date_str) if date_str else datetime.now(timezone.utc)

        articles.append({
            "titre": titre,
            "lien": lien,
            "date": parsed_date.isoformat(),
            "source": "Partenariat pour les forêts du bassin du Congo"
        })

    # Trier les articles par date décroissante
    articles.sort(key=lambda x: x["date"], reverse=True)

    # ✅ Sauvegarde JSON (optionnel, utile si tu veux réutiliser côté JS)
    with open("merged_feed.json", "w", encoding="utf-8") as f:
        json.dump({
            "derniere_mise_a_jour": datetime.now(timezone.utc).isoformat(),
            "articles": articles
        }, f, ensure_ascii=False, indent=2)

    # ✅ Sauvegarde XML
    fg = FeedGenerator()
    fg.title("Actualités CDBG")
    fg.link(href="https://www.cdbg-gabon.com/", rel="alternate")
    fg.description("Flux RSS du Partenariat pour les forêts du bassin du Congo")
    fg.language("fr")

    for article in articles[:20]:  # max 20 articles
        fe = fg.add_entry()
        fe.title(article["titre"])
        if article["lien"]:
            fe.link(href=article["lien"])
        fe.description(article["source"])
        fe.pubDate(datetime.fromisoformat(article["date"]))

    fg.rss_file("actualites.xml")

if __name__ == "__main__":
    traiter_flux()
    print("✅ Flux généré avec succès : actualites.xml + merged_feed.json")
