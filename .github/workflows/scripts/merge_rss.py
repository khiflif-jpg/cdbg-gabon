import feedparser
from feedgen.feed import FeedGenerator
import pytz
from datetime import datetime

# --- Flux RSS officiels à fusionner ---
FEEDS = [
    "https://brainforest-gabon.org/feed/",
    "https://forestsnews.cifor.org/feed",
    "https://comifac.org/fr/rss/actualites"  # à vérifier si dispo en RSS
]

# --- Créer le flux fusionné ---
fg = FeedGenerator()
fg.title("Actualités Forêts Gabon - CDBG")
fg.link(href="https://www.cdbg-gabon.com", rel="alternate")
fg.description("Flux fusionné des actualités forestières (Brainforest, CIFOR, COMIFAC)")
fg.language("fr")

# --- Extraire les articles ---
for url in FEEDS:
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:  # limite à 10 articles par source
            fe = fg.add_entry()
            fe.title(entry.title)
            fe.link(href=entry.link)
            fe.description(getattr(entry, "summary", ""))
            if hasattr(entry, "published_parsed"):
                fe.pubDate(datetime(*entry.published_parsed[:6], tzinfo=pytz.UTC))
    except Exception as e:
        print(f"Erreur avec {url}: {e}")

# --- Générer le fichier XML ---
fg.rss_file("actualites.xml")
print("✅ Flux fusionné généré : actualites.xml")
