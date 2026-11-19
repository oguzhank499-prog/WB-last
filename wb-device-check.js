(()=>{'use strict';
const host=document.getElementById('wb-mastery')||document.querySelector('main')||document.body;
const section=document.createElement('section');section.className='panel wb-device-check';
section.innerHTML='<h3>WB · Cihaz Testi</h3><p class="muted">Poco F5 dahil Android cihazlarda ilk test için. Kontroller yalnızca bu cihazda çalışır; rapor otomatik gönderilmez.</p><button type="button" id="wb-device-run">Teknik kontrolleri çalıştır</button><pre id="wb-device-report" aria-live="polite" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre><button type="button" id="wb-device-copy" hidden>Raporu kopyala</button><div id="wb-manual-tests"></div><button type="button" id="wb-device-export">Test raporunu JSON indir</button><button type="button" id="wb-device-reset">Elle testleri sıfırla</button><p class="muted">Rapor yalnızca senin cihazında hazırlanır; otomatik olarak gönderilmez.</p>';
host.append(section);
const cases=[['periodic','Periyodik tablo açılıyor ve element ayrıntısı görünüyor'],['draw','Mekanizma editöründe atom ve bağ çizilebiliyor'],['preview','Elektron hareketi önizlenip uygulanabiliyor'],['history','Reaksiyon geçmişi kaydedilip yeniden yüklenebiliyor'],['json','Reaksiyon geçmişi JSON içe/dışa aktarılıyor'],['offline','Uygulama internet kapalıyken yeniden açılıyor']];
const testBox=section.querySelector('#wb-manual-tests');
const manual={};
for(const [id,label] of cases){const row=document.createElement('label');row.style.display='block';row.style.margin='8px 0';const cb=document.createElement('input');cb.type='checkbox';cb.dataset.test=id;cb.checked=false;row.append(cb,document.createTextNode(' '+label));testBox.append(row);manual[id]=cb;}
const exportBtn=section.querySelector('#wb-device-export');
const resetBtn=section.querySelector('#wb-device-reset');
function collect(){return {schema:'wb-device-report-v1',appVersion:'5.4',createdAt:new Date().toISOString(),technicalReport:report.textContent||'Henüz çalıştırılmadı',manualChecks:cases.map(([id,label])=>({id,label,passed:manual[id].checked}))};}
exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(collect(),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='WB-5.4-cihaz-test-raporu.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
resetBtn.onclick=()=>{for(const cb of Object.values(manual))cb.checked=false;};
const report=section.querySelector('#wb-device-report'),copy=section.querySelector('#wb-device-copy');
section.querySelector('#wb-device-run').onclick=async()=>{
const lines=['WB 5.4 cihaz kontrolü',`Zaman: ${new Date().toISOString()}`,`Tarayıcı: ${navigator.userAgent.slice(0,220)}`];
const check=(name,ok,detail='')=>lines.push(`${ok?'OK':'UYARI'} | ${name}${detail?' | '+detail:''}`);
check('Güvenli bağlam',window.isSecureContext,'PWA kurulumu HTTPS veya localhost gerektirir');
check('Service Worker desteği','serviceWorker'in navigator);
if('serviceWorker'in navigator){try{const reg=await navigator.serviceWorker.getRegistration();check('Service Worker kaydı',!!reg,reg?'kayıt var':'henüz kayıt yok');}catch(e){check('Service Worker kaydı',false,String(e.message||e))}}
try{const key='wb-device-test-v54';localStorage.setItem(key,'ok');const ok=localStorage.getItem(key)==='ok';localStorage.removeItem(key);check('Yerel veri kaydı',ok)}catch(e){check('Yerel veri kaydı',false,String(e.message||e))}
check('Dosya indirme desteği',typeof Blob==='function'&&typeof URL.createObjectURL==='function');
check('Mekanizma hesaplama modülü',!!window.WBElectronStep);
try{const response=await fetch('./index.html',{cache:'no-store'});check('Uygulama dosyası erişimi',response.ok,`HTTP ${response.status}`)}catch(e){check('Uygulama dosyası erişimi',false,String(e.message||e))}
if('caches'in window){try{const names=await caches.keys();check('PWA önbelleği',names.includes('wb-pwa-personal-54'),names.join(', ')||'önbellek yok')}catch(e){check('PWA önbelleği',false,String(e.message||e))}}
lines.push('Not: Bu rapor kimyasal doğruluğu, gerçek AI bağlantısını veya tam çevrimdışı testi kanıtlamaz.');report.textContent=lines.join('\n');copy.hidden=false;
};
copy.onclick=async()=>{const value=report.textContent;try{await navigator.clipboard.writeText(value);copy.textContent='Kopyalandı'}catch{copy.textContent='Raporu seçip kopyalayabilirsin'}};
})();
