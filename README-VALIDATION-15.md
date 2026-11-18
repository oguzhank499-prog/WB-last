# WB 1.5 — Bilimsel doğruluk: kanıtlanabilen kapsam

Kaynak: WB 1.4 kodu. WB 1.5 sürümünde mevcut kayıt anahtarları (`kimyalab-state`) ve oyun modları korunmuştur.

## Değişiklikler

- **Sözlükte 708 otomatik üretilen yük-dengeleme formülü varsayılan olarak gizli.** Kullanıcı açıkça onay verirse bunları teorik formül alıştırması olarak görebilir. Bu kayıtların kararlı, izole edilebilir veya bilinen bileşik olduğu iddia edilmez.
- Teorik formüllerin, doğrulanmış/elle girilmiş bileşik sorularına yanlış çeldirici olarak karışma olasılığı azaltıldı.
- RDKit'in element sembol listesiyle **240 elle tanımlanmış kaydın formül sözdizimi** (parantez, alt indis, element sembolü, hidrat ayırıcı) denetlendi: **240/240 geçti**. İyon yükleri formül sözdizimi incelemesinde ayrı tutulur.
- Önceki 5.465 yapısal/yük dengeleme kontrolü, 18 pH testi, 17 hesaplama testi ve 10 arayüz/veri testi yeniden çalıştırıldı.
- Tüm JavaScript dosyalarının sözdizimi denetlendi.

## Açık bilimsel sınırlamalar

**Formül sözdizimi doğrulaması kimyasal varlık, adlandırma veya bilimsel doğruluk doğrulaması değildir.** 240 kaydın adları bağımsız kaynaklarla tek tek karşılaştırılmadı. 708 teorik formül için gerçek bileşik varlığı doğrulanmadı. 239 kavramsal sorunun açıklamaları bağımsız akademik kaynaklarla tek tek karşılaştırılmadı. Telefon/tarayıcı çevrimdışı testi yapılmadı. Bu sürüm beta olarak kalır.

Komutlar: `python audit-formulas-15.py`, `node audit-chemistry.js`, `node audit-science-12.js`, `node audit-manual-13.js`, `node audit-ph-14.js`, `node verify.js`, `node verify5.js`.
