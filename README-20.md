# WB 2.0 — Kimyasal adlandırma ve iyon yükü denetimi

WB 1.9 üzerine geliştirilmiştir. Yeni otomatik doğruluk denetimi: `node audit-nomenclature-20.js`.

- 36 elle belirtilmiş bileşik formülü ve Türkçe ad eşleşmesi kontrol edilir.
- 23 yaygın iyonun yük bilgisi ayrı beklenen değerlerle kontrol edilir.
- 708 teorik yük-dengeleme kombinasyonu doğrulanmış bileşik sayılmaz.
- Önceki 1.9 işlevleri ve ilerleme anahtarı korunur.
- Önbellek sürümü v23.

**Bilimsel sınırlama:** Bu denetim otomatik olarak dış kaynaklara başvurmaz. Bütün bileşiklerin varlığını, standart adlandırmayı, faz/çözünürlük özelliklerini veya soru açıklamalarını doğrulamaz. Android cihaz testi ve gerçek WB AI bağlantısı yapılmamıştır.
