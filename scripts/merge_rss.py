import feedparser
import json
from datetime import datetime

# Liste des flux RSS à fusionner
RSS_FEEDS = [
"https://www.france24.com/fr/rss",
"https://www.rfi.fr/fr/rss"
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

# Trier les articles par date si possible
articles.sort(key=lambda x: x["date"], reverse=True)

# Sauvegarder en JSON
with open("merged_feed.json", "w", encoding="utf-8") as f:
json.dump({
"derniere_mise_a_jour": datetime.utcnow().isoformat() + "Z",
"articles": articles
}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
fusionner_flux()
print("✅ Fichier merged_feed.json généré avec succès")
