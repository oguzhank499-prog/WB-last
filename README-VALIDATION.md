# WB 5.1 — Kimyasal doğruluk denetimi (ilk aşama)

Bu paket WB 5.0 üzerine kuruludur. `node audit-chemistry.js`, `node verify.js`, `node verify5.js` komutlarıyla kontrol edilebilir.

## Bu turda gerçekten kontrol edilenler
- 118 element kaydı ve element sembollerinin benzersizliği.
- 948 formül/ad kaydının boş olmaması ve formül anahtarlarının benzersizliği.
- Otomatik üretilen 708 iyonik formülün, girilmiş katyon/anyon yüklerine göre **elektriksel olarak nötr** ve en küçük tam sayı oranında olması.
- 241 kavramsal sorunun 4 farklı şık içermesi, işaretli cevabın tam bir kez bulunması ve açıklama alanının boş olmaması.
- Dokuz seçilmiş bileşik için beklenen formül/ad eşleşmeleri.
- Daha önceki 27 otomatik kontrol.

## Düzeltilenler
- `CH₃COOH` iki ayrı adla tekrar ediyordu. İkinci kaydı `CH₃CH₂COOH / Propanoik asit` olarak değiştirerek çift kayıt giderildi. Toplam kayıt sayısı korunur.
- Yük dengelemesiyle **otomatik türetilen** bileşiklerin kararlı/izole edilebilir veya çözünür olduğu izlenimini önlemek için açıklama ve sözlük uyarıları eklendi.
- PWA önbelleği v13'e yükseltildi.

## Bilimsel kapsam sınırı — önemli
Bu 5.477 denetim **5.477 bağımsız kimya doğrulaması değildir**. Çoğu şema/elektriksel yük ve şık bütünlüğü kontrolüdür. Bir formülün nötr olması onun gerçek, kararlı veya izole edilebilir bileşik olduğunu kanıtlamaz. Tüm 948 adın bağımsız IUPAC incelemesi, 241 sorunun açıklamalarının uzman denetimi, termodinamik geçerlilik, deneysel veri ve cihaz üstünde uçtan uca test henüz tamamlanmadı. Bu sürüm hâlâ beta; mevcut telefon uygulamasını yedeklemeden değiştirmeyin.
