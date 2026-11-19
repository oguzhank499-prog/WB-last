/* WB 5.0: local-first navigation, unified search and bilingual shell. No network calls. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const nav={tr:['🏠 Ana Sayfa','⚛ Tablo','🔎 Keşfet','🎮 Oyunlar','👤 Profil'],en:['🏠 Home','⚛ Table','🔎 Explore','🎮 Games','👤 Profile']};
const lang=()=>{try{return JSON.parse(localStorage.getItem('wb-prefs')||'{}').lang==='en'?'en':'tr'}catch{return 'tr'}};
const dictionary={tr:{search:'🔎 Tüm WB içinde ara: element, formül, bileşik veya oyun',empty:'Eşleşme bulunamadı.',title:'WB · Üniversite Kimyası',home:'Kimya yolculuğun',library:'Kimya kütüphanesi',periodic:'Periyodik tablo',games:'Oyunlar',assistant:'WB Asistan'},en:{search:'🔎 Search WB: element, formula, compound or game',empty:'No results.',title:'WB · University Chemistry',home:'Your chemistry journey',library:'Chemistry library',periodic:'Periodic table',games:'Games',assistant:'WB Assistant'}};
const header=$('#home .hero');const search=document.createElement('div');search.id='wb5-search';search.className='panel';search.innerHTML='<label for="wb5-query">🔎 WB</label><input id="wb5-query" type="search" autocomplete="off"/><div id="wb5-results" aria-live="polite"></div>';
header.parentNode.insertBefore(search,header);
const input=$('#wb5-query'), results=$('#wb5-results');
const norm=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[₀-₉]/g,c=>String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))).replace(/\s/g,'');
const els=typeof db!=='undefined'?db:[];
const names=window.wbElementNamesEN||[];
const refs=window.WBTEST?.reference||[];
function go(pageName){const b=document.querySelector('nav button[data-page="'+pageName+'"]');if(b)b.click();else if(typeof page==='function')page(pageName)}
function runSearch(){const q=norm(input.value);results.replaceChildren();if(q.length<2)return;const matches=[];
 els.forEach((e,i)=>{const en=e.group==='element'?names[i]:'';if(norm([e.formula,e.name,en].join(' ')).includes(q))matches.push({title:e.formula+' · '+e.name,subtitle:en||e.group,page:e.group==='element'?'periodic':'dictionary'})});
 refs.forEach(r=>{if(norm(r.slice(0,3).join(' ')).includes(q)&&!matches.some(m=>norm(m.title).includes(norm(r[0]))))matches.push({title:r[0]+' · '+(lang()==='en'?r[2]:r[1]),subtitle:r[3],page:'explore'})});
 const unique=matches.slice(0,20);if(!unique.length){results.textContent=dictionary[lang()].empty;return}
 unique.forEach(m=>{const b=document.createElement('button');b.className='wb5-result';const title=document.createElement('strong');title.textContent=m.title;const subtitle=document.createElement('span');subtitle.className='wb5-bilingual';subtitle.textContent=m.subtitle;b.append(title,subtitle);b.onclick=()=>{go(m.page);if(m.page==='dictionary'){const searchBox=$('#search');if(searchBox){searchBox.value=m.title.split(' · ')[0];searchBox.dispatchEvent(new Event('input',{bubbles:true}))}}if(m.page==='periodic'){const eSearch=$('#element-search');if(eSearch){eSearch.value=m.title.split(' · ')[0];eSearch.dispatchEvent(new Event('input',{bubbles:true}))}}};results.appendChild(b)})}
 input.addEventListener('input',runSearch);
 [['home-periodic','periodic'],['home-explore','explore'],['home-games','games'],['home-ai','wb-assistant']].forEach(([id,target])=>{$('#'+id).onclick=()=>go(target)});
 function translate(){const l=lang(),t=dictionary[l];document.documentElement.lang=l;input.placeholder=t.search;document.querySelectorAll('nav button').forEach((b,i)=>b.textContent=nav[l][i]);$('#home-periodic').textContent='⚛ '+t.periodic;$('#home-explore').textContent='📚 '+t.library;$('#home-games').textContent='🎮 '+t.games;$('#home-ai').textContent='✨ '+t.assistant;runSearch()}
 $('#wb-lang').addEventListener('change',()=>setTimeout(translate,0));translate();
 // Check current active SW cache instead of a stale, hard-coded version.
 async function status(){const el=$('#offline-status');if(!el||!('serviceWorker'in navigator)||!('caches'in window))return;try{const controller=navigator.serviceWorker.controller;const keys=await caches.keys();const key=keys.find(k=>k==='wb-pwa-v12');if(!controller||!key){el.textContent='⏳ Çevrimdışı hazırlık sürüyor. Uygulamayı bir kez yeniden aç.';return}const cache=await caches.open(key);const required=['index.html','app.js','wb3.js','wbplus.js','wbnext.js','wb4.js','wb41.js','wb42-core.js','wb42.js','wb5.js'];const ok=await Promise.all(required.map(f=>cache.match(new URL(f,location.href))));el.textContent=ok.every(Boolean)?'✓ Temel dosyalar çevrimdışı önbellekte.':'⚠ Bazı dosyalar önbellekte eksik.'}catch{el.textContent='⚠ Çevrimdışı durum kontrol edilemedi.'}}
 window.addEventListener('load',()=>setTimeout(status,1600));window.addEventListener('online',status);
})();
