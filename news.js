/*! news.js — PFBC RSS loader (CDBG - version proxy AllOrigins) */
(function(){
  'use strict';
  // Flux RSS PFBC via proxy CORS (AllOrigins)
  const FEED = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml');
  const PFBC = 'https://pfbc-cbfp.org/';
  const SELECTORS = ['#news-feed','[data-news-container]','#news','.news-list','.news'];
  const MAX_ITEMS = 12;

  // Trouve le conteneur où injecter les actualités
  function findContainer(){
    for (const sel of SELECTORS){
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // Récupère une image du contenu HTML (description)
  function parseImage(html){
    if(!html) return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    const im = div.querySelector('img');
    return im ? im.getAttribute('src') : null;
  }

  // Supprime les balises HTML d'une chaîne
  function strip(html){
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || '').trim();
  }

  // Formatte la date (ex : 15 septembre 2025)
  function fmtDate(dstr){
    try {
      const d = new Date(dstr);
      return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    } catch(e){ return ''; }
  }

  // Injecte les articles dans le DOM
  function render(items, cont){
    cont.setAttribute('role','list');
    items.forEach(item => {
      const title = item.querySelector('title') ? item.querySelector('title').textContent.trim() : '';
      const link  = item.querySelector('link') ? item.querySelector('link').textContent.trim() : PFBC;
      const pub   = item.querySelector('pubDate') ? item.querySelector('pubDate').textContent.trim() : '';
      const desc  = item.querySelector('description') ? item.querySelector('description').textContent : '';
      const img   = parseImage(desc);

      const art = document.createElement('article');
      art.className = 'news-card';
      art.setAttribute('role','listitem');

      let html = '';
      if (img) {
        html += `<img src="${img}" alt="${title.replace(/"/g,'&quot;')}" loading="lazy" decoding="async">`;
      }
      html += `<h4>${title}</h4>`;
      html += `<p class="meta">Source : <a href="${PFBC}" target="_blank" rel="noopener noreferrer">PFBC</a>`;
      if (pub) html += ` — Publié le ${fmtDate(pub)}`;
      html += `</p>`;
      html += `<p>${strip(desc).slice(0,200)}…</p>`;
      html += `<p><a class="btn" href="${link}" target="_blank" rel="noopener">Lire la suite</a></p>`;

      art.innerHTML = html;
      cont.appendChild(art);
    });
  }

  // Charge et parse le flux RSS
  function loadFeed(){
    const cont = findContainer();
    if (!cont) {
      console.warn('[news] Aucun conteneur trouvé pour les articles PFBC.');
      return;
    }
    fetch(FEED)
      .then(res => res.json())
      .then(data => {
        const xmlText = data.contents;
        const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
        const items = Array.from(doc.querySelectorAll('item')).slice(0, MAX_ITEMS);
        render(items, cont);
      })
      .catch(err => console.error('[news] Erreur de chargement RSS PFBC :', err));
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', loadFeed);
  else
    loadFeed();
})();
