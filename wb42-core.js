/* WB 4.2 pure, offline calculation functions. No network or browser dependency. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.WB42Core=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function positive(n,label){n=Number(n);if(!Number.isFinite(n)||n<=0)throw Error(label+' sıfırdan büyük olmalı.');return n}
function nonnegative(n,label){n=Number(n);if(!Number.isFinite(n)||n<0)throw Error(label+' negatif olamaz.');return n}
function integer(n,label){n=positive(n,label);if(!Number.isSafeInteger(n))throw Error(label+' tam sayı olmalı.');return n}
function limitingReagent(aMoles,aCoeff,bMoles,bCoeff,productCoeff){aMoles=nonnegative(aMoles,'A mol');bMoles=nonnegative(bMoles,'B mol');aCoeff=integer(aCoeff,'A katsayısı');bCoeff=integer(bCoeff,'B katsayısı');productCoeff=integer(productCoeff,'Ürün katsayısı');const extent=Math.min(aMoles/aCoeff,bMoles/bCoeff);const eps=1e-10*Math.max(1,aMoles/aCoeff,bMoles/bCoeff);return {productMoles:extent*productCoeff,remainingA:Math.max(0,aMoles-extent*aCoeff),remainingB:Math.max(0,bMoles-extent*bCoeff),limiting:Math.abs(aMoles/aCoeff-bMoles/bCoeff)<=eps?'both':aMoles/aCoeff<bMoles/bCoeff?'A':'B'};}
function dilution(c1,v1,v2){c1=nonnegative(c1,'İlk derişim');v1=positive(v1,'İlk hacim');v2=positive(v2,'Son hacim');return c1*v1/v2}
function phStrongAcid(concentration){concentration=positive(concentration,'Asit derişimi');if(concentration<1e-6)throw Error('Çok seyreltik çözeltilerde suyun otoiyonizasyonu hesaba katılmalı.');return -Math.log10(concentration)}
function phStrongBase(concentration){concentration=positive(concentration,'Baz derişimi');if(concentration<1e-6)throw Error('Çok seyreltik çözeltilerde suyun otoiyonizasyonu hesaba katılmalı.');return 14+Math.log10(concentration)}
// Exact ideal-concentration solution including water autoionization at 25 C (Kw=1e-14).
// Monoprotic fully dissociated acid or monohydroxide fully dissociated base only.
function phStrongWithWater(concentration,type){
 concentration=nonnegative(concentration,'Derişim');
 if(type!=='acid'&&type!=='base')throw Error('Asit veya baz seç.');
 const kw=1e-14;
 const root=Math.hypot(concentration,2*Math.sqrt(kw));
 // Rationalized root prevents catastrophic cancellation at high base concentrations.
 const h=type==='acid'?(concentration+root)/2:(2*kw)/(concentration+root);
 return -Math.log10(h);
}
function electronGeometry(domains,lonePairs){domains=integer(domains,'Elektron bölgesi');lonePairs=nonnegative(lonePairs,'Yalnız çift');if(!Number.isInteger(lonePairs)||lonePairs>=domains||domains<2||domains>6)throw Error('2–6 elektron bölgesi ve uygun yalnız çift sayısı gir.');const names={2:['Doğrusal'],3:['Üçgen düzlem','Açısal'],4:['Dörtyüzlü','Üçgen piramit','Açısal'],5:['Üçgen çift piramit','Tahterevalli','T-şekilli','Doğrusal'],6:['Sekizyüzlü','Kare piramit','Kare düzlem','T-şekilli','Doğrusal']};const geometry=names[domains][lonePairs];if(!geometry)throw Error('Bu VSEPR düzeni için doğrulanmış ad bulunmuyor.');return {electronGeometry:({2:'Doğrusal',3:'Üçgen düzlem',4:'Dörtyüzlü',5:'Üçgen çift piramit',6:'Sekizyüzlü'})[domains],molecularGeometry:geometry,bondingDomains:domains-lonePairs};}
return Object.freeze({limitingReagent,dilution,phStrongAcid,phStrongBase,phStrongWithWater,electronGeometry});});
