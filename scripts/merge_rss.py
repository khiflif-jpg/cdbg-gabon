import feedparser
import datetime
import json

# Liste des flux RSS à fusionner
rss_feeds = [
    "https://www.france24.com/fr/rss",
    "https://www.rfi.fr/fr/rss"
]

def parse_date(entry):
    try:
        return datetime.datetime(*entry.published_parsed[:6])
    except:
        return datetime.datetime.min

all_entries = []

# Parcours des flux RSS
for url in rss_feeds:
    feed = feedparser.parse(url)
    for entry in feed.entries:
        all_entries.append({
            "title": entry.get("title", "Sans titre"),
            "link": entry.get("link", ""),
            "published": str(parse_date(entry)),
            "source": feed.feed.get("title", url)
        })

# Trier par date décroissante
all_entries.sort(key=lambda x: x["published"], reverse=True)

# Sauvegarder en JSON
with open("merged_feed.json", "w", encoding="utf-8") as f:
    json.dump(all_entries, f, ensure_ascii=False, indent=2)

print("✅ Flux RSS fusionnés → merged_feed.json")
