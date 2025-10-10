/*! news.js — PFBC RSS loader (CDBG) */
(function(){
  'use strict';
  var FEED = 'https://rss.app/feeds/RuxW0ZqEY4lYzC5a.xml';
  var PFBC = 'https://pfbc-cbfp.org/';
  var SELECTORS = ['#news-feed','[data-news-container]','#news','.news-list','.news'];
  var MAX_ITEMS = 12;

  function findContainer(){
    for (var i=0;i<SELECTORS.length;i++){
      var el = document.querySelector(SELECTORS[i]);
      if (el) return el;
    }
    return null;
  }
  function parseImage(html){
    if(!html) return null;
    var div = document.createElement('div');
    div.innerHTML = html;
    var im = div.querySelector('img');
    return im ? im.getAttribute('src') : null;
  }
  function strip(html){
    var div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || '').trim();
  }
  function fmtDate(dstr){
    try{
      var d=new Date(dstr);
      return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric'});
    }catch(e){ return ''; }
  }

  function render(items, cont){
    cont.setAttribute('role','list');
    items.forEach(function(item){
      var title = item.querySelector('title') ? item.querySelector('title').textContent.trim() : '';
      var link  = item.querySelector('link') ? item.querySelector('link').textContent.trim() : PFBC;
      var pub   = item.querySelector('pubDate') ? item.querySelector('pubDate').textContent.trim() : '';
      var desc  = item.querySelector('description') ? item.querySelector('description').textContent : '';
      var img   = parseImage(desc);

      var art = document.createElement('article');
      art.className = 'news-card';
      art.setAttribute('role','listitem');

      var html = '';
      if (img){
        html += '<img src="' + img + '" alt="' + title.replace(/"/g,'&quot;') + '" loading="lazy" decoding="async">';
      }
      html += '<h4>' + title + '</h4>';
      html += '<p class="meta">Source : <a href="' + PFBC + '" target="_blank" rel="noopener noreferrer">PFBC</a>' + (pub ? ' — Publié le ' + fmtDate(pub) : '') + '</p>';
      html += '<p>' + strip(desc).slice(0,200) + '…</p>';
      html += '<p><a class="btn" href="' + link + '" target="_blank" rel="noopener">Lire la suite</a></p>';

      art.innerHTML = html;
      cont.appendChild(art);
    });
  }

  function loadFeed(){
    var cont = findContainer();
    if (!cont) return;
    fetch(FEED, {mode:'cors'}).then(function(res){ return res.text(); }).then(function(txt){
      var doc = new window.DOMParser().parseFromString(txt,'text/xml');
      var items = Array.prototype.slice.call(doc.querySelectorAll('item')).slice(0, MAX_ITEMS);
      render(items, cont);
    }).catch(function(err){ console.error('[news] RSS load error', err); });
  }

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', loadFeed); }
  else { loadFeed(); }
})();