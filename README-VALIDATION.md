# WB 1.4 — Kimyasal doğruluk ve hesaplama düzeltmesi

WB 1.3 kodu ve kayıt anahtarları korunarak geliştirildi. Sürüm numarası WB 1.4; PWA önbelleği v17.

## Düzeltme

Önceki kuvvetli asit/baz pH aracı 10⁻⁶ M altındaki çözeltileri reddediyordu. Yeni araç, **25 °C'de ideal çözelti** ve **tam ayrışan tek protonlu asit / tek OH⁻ veren baz** varsayımıyla suyun otoiyonlaşmasını da dahil eder. [H⁺][OH⁻]=10⁻¹⁴ ve elektriksel yük dengesi birlikte çözülür. Özellikle 10⁻⁸ M gibi seyreltik çözeltilerde pH'ı yanlışlıkla 8 veya 6 göstermemek için bu önemlidir.

Eski `phStrongAcid` ve `phStrongBase` yaklaşık fonksiyonları geriye dönük uyumluluk için tutuldu; uygulamanın pH aracı yeni `phStrongWithWater` fonksiyonunu kullanır.

## Denetimler

- `node audit-ph-14.js`: 18 derişim/tür birleşiminde yük dengesi, suyun iyon çarpımı, seyreltik ve normal derişim sınırları kontrol edildi.
- `node verify.js`: 17/17 önceki test geçti.
- `node verify5.js`: 10/10 önceki test geçti.
- `node audit-chemistry.js`, `node audit-science-12.js`, `node audit-manual-13.js`: önceki veri/soru testleri geçti.

## Sınırlar

Bu testler aktivite katsayılarını, yüksek iyonik gücü, çok protonlu asitleri, zayıf asit/baz dengelerini veya 25 °C dışını kapsamaz. 708 otomatik iyonik formülün gerçek bileşik olarak varlığı, 948 kayıt adının akademik kaynak karşılaştırması ve bütün soru açıklamalarının bağımsız bilimsel incelemesi tamamlanmış değildir. Gerçek Android/PWA testleri de yapılmadı.
