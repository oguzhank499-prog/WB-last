/* WB 3.0: offline chemistry reference and validated calculators. No external requests. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const reference=[
 ['H₂O','Su','Water','Moleküler bileşik','Polar molekül; yaklaşık 104,5° bağ açısı.'],
 ['H₂SO₄','Sülfürik asit','Sulfuric acid','Asit','Yaygın Lewis gösterimi HO–S(=O)₂–OH.'],
 ['HNO₃','Nitrik asit','Nitric acid','Asit','Kuvvetli asit; nitrat iyonunun eşlenik asidi.'],
 ['HCl','Hidroklorik asit (sulu)','Hydrochloric acid (aqueous)','Asit','HCl(g): hidrojen klorür; HCl(aq): hidroklorik asit.'],
 ['CH₃COOH','Asetik asit','Acetic acid','Asit','Zayıf asit; asetatın eşlenik asidi.'],
 ['NaOH','Sodyum hidroksit','Sodium hydroxide','Baz','Suda güçlü baz olarak davranır.'],
 ['NH₃','Amonyak','Ammonia','Baz','Suda zayıf baz; trigonal piramidal geometri.'],
 ['NaCl','Sodyum klorür','Sodium chloride','Tuz','Na⁺ ve Cl⁻ iyonlarından oluşur.'],
 ['CaCO₃','Kalsiyum karbonat','Calcium carbonate','Tuz','Suda az çözünür.'],
 ['CuSO₄','Bakır(II) sülfat','Copper(II) sulfate','Tuz','Cu²⁺ ve SO₄²⁻ içerir.'],
 ['Fe₂(SO₄)₃','Demir(III) sülfat','Iron(III) sulfate','Tuz','2 Fe³⁺ ve 3 SO₄²⁻ içerir.'],
 ['CO₂','Karbon dioksit','Carbon dioxide','Moleküler bileşik','Doğrusal geometri; O=C=O.'],
 ['SO₄²⁻','Sülfat','Sulfate','Çok atomlu iyon','Yükü −2.'],
 ['SO₃²⁻','Sülfit','Sulfite','Çok atomlu iyon','Yükü −2; sülfattan bir O daha az.'],
 ['NO₃⁻','Nitrat','Nitrate','Çok atomlu iyon','Yükü −1.'],
 ['NO₂⁻','Nitrit','Nitrite','Çok atomlu iyon','Yükü −1.'],
 ['NH₄⁺','Amonyum','Ammonium','Çok atomlu iyon','Yükü +1.'],
 ['OH⁻','Hidroksit','Hydroxide','Çok atomlu iyon','Yükü −1.'],
 ['PO₄³⁻','Fosfat','Phosphate','Çok atomlu iyon','Yükü −3.'],
 ['CO₃²⁻','Karbonat','Carbonate','Çok atomlu iyon','Yükü −2.'],
 ['HCO₃⁻','Hidrojen karbonat','Hydrogen carbonate','Çok atomlu iyon','Yükü −1.'],
 ['MnO₄⁻','Permanganat','Permanganate','Çok atomlu iyon','Yükü −1.'],
 ['Cr₂O₇²⁻','Dikromat','Dichromate','Çok atomlu iyon','Yükü −2.'],
 ['CH₄','Metan','Methane','Organik','Dört sigma bağı; tetrahedral.'],
 ['C₂H₆','Etan','Ethane','Organik','Doymuş hidrokarbon.'],
 ['C₂H₄','Eten','Ethene','Organik','Karbon-karbon çift bağı içerir.'],
 ['C₂H₂','Etin','Ethyne','Organik','Karbon-karbon üçlü bağı içerir.'],
 ['C₆H₆','Benzen','Benzene','Organik','Aromatik halka.']
];
const topics=[
 ['Çözünürlük – kısa kurallar','Alkali metal ve NH₄⁺ tuzları genellikle çözünür. Nitratlar genellikle çözünür. Cl⁻/Br⁻/I⁻ tuzlarında Ag⁺, Pb²⁺ ve Hg₂²⁺ gibi istisnalar vardır. Karbonat ve fosfatların çoğu, alkali metal ve NH₄⁺ tuzları hariç, az çözünür.','Bu kurallar genellemedir; sıcaklık ve ortam önemlidir.'],
 ['Asit–baz','25 °C’de saf suda Kᵥ = [H₃O⁺][OH⁻] ≈ 1,0×10⁻¹⁴. pH = −log₁₀ a(H₃O⁺); seyreltik ideal çözeltilerde derişim yaklaşımı kullanılabilir.','Kuvvetli asit veya bazın çok seyreltik çözeltilerinde suyun otoiyonlaşması önemlidir.'],
 ['Yaygın fonksiyonel gruplar','Alkol R–OH; aldehit R–CHO; keton R–CO–R′; karboksilik asit R–COOH; ester R–COOR′; amin R–NH₂ (primer örnek).','Fonksiyonel grup isimlendirmede konum ve öncelik kurallarına dikkat edilir.'],
 ['Temel sabitler','Avogadro sabiti Nₐ = 6,02214076×10²³ mol⁻¹ (tam tanımlı). Gaz sabiti R ≈ 8,314462618 J mol⁻¹ K⁻¹.','Değerler SI birimleriyle verilmiştir.']
];
const storeKey='wbplus-v1';let user={};try{user=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{};
user.favorites=Array.isArray(user.favorites)?user.favorites:[];user.recent=Array.isArray(user.recent)?user.recent:[];
const persist=()=>{try{localStorage.setItem(storeKey,JSON.stringify(user))}catch{}};
const norm=s=>String(s).toLocaleLowerCase('tr-TR').replace(/[₀-₉]/g,c=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/\s/g,'');
const lang=()=>{try{return JSON.parse(localStorage.getItem('wb-prefs')||'{}').lang==='en'?'en':'tr'}catch{return 'tr'}};
const tr=()=>lang()==='tr';
const section=$('#wbplus-search');const tools=$('#wbplus-tools');
section.innerHTML='<div class="panel"><h3 id="wb-search-title">🔎 Kimya araması</h3><p class="muted" id="wb-search-hint">Formül, bileşik veya element ara.</p><input type="search" id="wb-global-search" placeholder="Örn. Fe₂(SO₄)₃, Oxygen, Nitrat"><div id="wb-search-results"></div><details><summary id="wb-recent-title">Favoriler ve son baktıklarım</summary><div id="wb-recents"></div></details></div>';
const results=$('#wb-search-results');
function favorite(id){user.favorites=user.favorites.includes(id)?user.favorites.filter(x=>x!==id):[...user.favorites,id];persist();search();renderRecent()}
function visit(id){user.recent=[id,...user.recent.filter(x=>x!==id)].slice(0,12);persist();renderRecent()}
function card(entry){const id=entry[0],el=document.createElement('div');el.className='wb-entry';const btn=document.createElement('button');btn.className='wb-fav';btn.textContent=user.favorites.includes(id)?'★':'☆';btn.setAttribute('aria-label',tr()?'Favori değiştir':'Toggle favorite');btn.onclick=()=>favorite(id);const heading=document.createElement('strong');heading.textContent=id+' · '+(tr()?entry[1]:entry[2]);const sub=document.createElement('small');sub.className='muted';sub.textContent=(tr()?entry[2]:entry[1])+' · '+entry[3];const note=document.createElement('p');note.textContent=entry[4];el.append(btn,heading,sub,note);el.onclick=()=>visit(id);return el}
function renderRecent(){const root=$('#wb-recents');root.innerHTML='';let ids=[...new Set([...user.favorites,...user.recent])];if(!ids.length){root.textContent=tr()?'Henüz kayıt yok.':'Nothing saved yet.';return}ids.forEach(id=>{const e=reference.find(x=>x[0]===id);if(e)root.append(card(e))})}
function search(){let q=norm($('#wb-global-search').value);results.innerHTML='';if(!q){renderRecent();return}const found=reference.filter(x=>x.some(y=>norm(y).includes(q))).slice(0,16);const elems=db.filter(x=>x.group==='element').slice(0,118).filter((x,i)=>norm(x.name).includes(q)||norm(x.formula).includes(q)||norm(window.wbElementNamesEN?.[i]||'').includes(q)).slice(0,8);elems.forEach(e=>{let b=document.createElement('button');b.className='wb-chip';b.textContent=e.formula+' '+e.name;b.onclick=()=>{page('periodic');document.querySelector('.element[data-num="'+(e.id+1)+'"]')?.click()};results.append(b)});found.forEach(e=>results.append(card(e)));if(!found.length&&!elems.length)results.textContent=tr()?'Yerel kütüphanede sonuç yok.':'No result in the offline library.'}
$('#wb-global-search').addEventListener('input',search);
const refPanel=document.createElement('div');refPanel.className='panel';refPanel.innerHTML='<h3 id="wb-library-title">📚 Kimya kütüphanesi</h3><div id="wb-topics"></div>';tools.append(refPanel);
topics.forEach(([title,body,caution])=>{const d=document.createElement('details');d.className='wb-tool';const s=document.createElement('summary');s.textContent=title;const p=document.createElement('p');p.textContent=body;const c=document.createElement('p');c.className='wb-mini';c.textContent=caution;d.append(s,p,c);$('#wb-topics').append(d)});
const calc=document.createElement('div');calc.className='panel';calc.innerHTML=`<h3 id="wb-calcs-title">🧮 Ek hesaplayıcılar</h3><details class="wb-tool"><summary>Molar kütle / Molar mass</summary><p class="wb-mini">Nötr formüller ve parantezli gruplar. Örn. Ca(OH)₂, Fe₂(SO₄)₃.</p><input id="wb-mass-formula" placeholder="Fe₂(SO₄)₃"><button id="wb-mass-run">Hesapla</button><div id="wb-mass-result" class="wb-result" aria-live="polite"></div></details><details class="wb-tool"><summary>Seyreltme / Dilution</summary><p class="wb-mini">C₁V₁ = C₂V₂ (reaksiyonsuz seyreltme)</p><div class="wb-grid"><label>C₁ (mol/L)<input id="wb-c1" inputmode="decimal"></label><label>V₁ (mL)<input id="wb-v1" inputmode="decimal"></label><label>C₂ (mol/L)<input id="wb-c2" inputmode="decimal"></label></div><button id="wb-dilute-run">V₂ hesapla</button><div id="wb-dilute-result" class="wb-result" aria-live="polite"></div></details><details class="wb-tool"><summary>pH (ideal seyreltik çözelti)</summary><p class="wb-mini">[H₃O⁺] gir (mol/L). Aktivite katsayısı ≈ 1 varsayılır.</p><input id="wb-h" inputmode="decimal" placeholder="0,001"><button id="wb-ph-run">pH hesapla</button><div id="wb-ph-result" class="wb-result" aria-live="polite"></div></details>`;tools.append(calc);
const number=id=>{let v=$(id).value.trim().replace(',','.');return v===''?NaN:Number(v)};
const fmt=n=>Number(n).toLocaleString(tr()?'tr-TR':'en-US',{maximumSignificantDigits:9});
const subscript=s=>s.replace(/[₀-₉]/g,c=>String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
const table=ChemistryTable();
function ChemistryTable(){let result={};const symbols=db.filter(x=>x.group==='element').slice(0,118);symbols.forEach((e,i)=>{result[e.formula]=window.wbElementMasses[i]});return result}
function parseFormula(s){s=subscript(s.trim());if(!s||s.length>160||!/^[A-Za-z0-9()\[\]]+$/.test(s))throw Error('Geçersiz formül / Invalid formula');let i=0;const readCount=()=>{let st=i;while(/[0-9]/.test(s[i]||''))i++;let n=st===i?1:Number(s.slice(st,i));if(!Number.isSafeInteger(n)||n<1||n>100000)throw Error('Geçersiz atom sayısı');return n};const read=(closing)=>{let sum=0,found=false;while(i<s.length&&s[i]!==closing){let c=s[i],weight;if(c==='('||c==='['){i++;weight=read(c==='('?')':']');if(s[i]!== (c==='('?')':']'))throw Error('Kapanmayan parantez');i++}else if(/[A-Z]/.test(c)){let sym=s[i++];if(/[a-z]/.test(s[i]||''))sym+=s[i++];if(!(sym in table))throw Error('Bilinmeyen element: '+sym);weight=table[sym]}else throw Error('Geçersiz formül konumu');sum+=weight*readCount();found=true}if(!found)throw Error('Boş grup');return sum};const mass=read('');if(i!==s.length)throw Error('Eşleşmeyen parantez');return mass}
$('#wb-mass-run').onclick=()=>{try{$('#wb-mass-result').textContent=fmt(parseFormula($('#wb-mass-formula').value))+' g/mol (yaklaşık atom kütleleriyle)'}catch(e){$('#wb-mass-result').textContent=e.message}};
$('#wb-dilute-run').onclick=()=>{let c1=number('#wb-c1'),v1=number('#wb-v1'),c2=number('#wb-c2');$('#wb-dilute-result').textContent=([c1,v1,c2].every(Number.isFinite)&&c1>0&&v1>0&&c2>0)?'V₂ = '+fmt(c1*v1/c2)+' mL':'Pozitif C₁, V₁ ve C₂ gir.'};
$('#wb-ph-run').onclick=()=>{let h=number('#wb-h');$('#wb-ph-result').textContent=Number.isFinite(h)&&h>0?'pH ≈ '+fmt(-Math.log10(h))+(h<1e-6?' · Çok seyreltik çözeltilerde suyun katkısını ihmal etmeyin.':''):'Pozitif [H₃O⁺] gir.'};
window.wbRefreshLanguage=()=>{$('#wb-search-title').textContent=tr()?'🔎 Kimya araması':'🔎 Chemistry search';$('#wb-search-hint').textContent=tr()?'Formül, bileşik veya element ara.':'Search formulas, compounds or elements.';$('#wb-recent-title').textContent=tr()?'Favoriler ve son baktıklarım':'Favorites and recent';$('#wb-library-title').textContent=tr()?'📚 Kimya kütüphanesi':'📚 Chemistry library';$('#wb-calcs-title').textContent=tr()?'🧮 Ek hesaplayıcılar':'🧮 More calculators';search();renderRecent()};
window.wbRefreshLanguage();
window.WBTEST={parseFormula,reference,topics};
})();
