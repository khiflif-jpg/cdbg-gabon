// --- Inject CSS styles ---
const style = document.createElement("style");
style.textContent = `
  .news-container {
    display: grid;
    grid-template-columns: 1fr; /* 📱 mobile : 1 colonne */
    gap: 20px;
    transition: all 0.3s ease; /* ✅ animation fluide */
  }

  /* 💻 Tablettes et desktops moyens : 2 colonnes */
  @media (min-width: 768px) {
    .news-container {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* 🖥️ Grands écrans : 3 colonnes */
  @media (min-width: 1200px) {
    .news-container {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .news-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .news-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  .news-card img {
    width: 100%;
    aspect-ratio: 16/9;       /* ✅ ratio constant */
    object-fit: cover;        /* ✅ pas de déformation */
    display: block;
  }

  .news-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .news-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;  /* ✅ coupe après 2 lignes */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .news-desc {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;  /* ✅ coupe après 3 lignes */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
document.head.appendChild(style);
