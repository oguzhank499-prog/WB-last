# WB 5.0 — Doğrulama sürümü (beta)

WB 4.2 üzerine geliştirilmiştir. Mevcut oyun verisi ve localStorage anahtarları korunur.

## Yeni
- İstenen beş alt sekme: Ana Sayfa, Tablo, Keşfet, Oyunlar, Profil.
- Ana sayfada hızlı araç bağlantıları.
- Element ve bileşikler için birleşik yerel arama.
- Alt gezinme, ana araç bağlantıları ve arama alanında Türkçe/İngilizce. (Tam iki dilli içerik **değildir**.)
- Önceki sürümde eski cache sürümüne bakarak yanlış sonuç verebilen çevrimdışı durum denetimi düzeltildi.
- Service worker cache sürümü v12, wb5.js önbelleğe dahil.
- verify5.js: veri şeması, 118 element, sözdizimi, dosyalar, navigasyon ve temel kimya denetimleri.

## Test
`node verify.js && node verify5.js`

## Sınırlar
- Bu sürüm beta; bütün soruların bilimsel denetimi ve Poco F5 cihaz testi yapılmış değildir.
- 3D modeller sınırlı, İngilizce içerik kısmi, çevrimiçi WB AI bağlı değildir.
- GitHub Pages statik sunucu olduğundan AI API anahtarını buraya koymayın.
- İlk yüklemeden önce mevcut uygulama kayıtlarını yedekleyin.


WB 4.9: Rezonans yapısal ön kontrolü eklendi. Ayrıntılar CHANGELOG-49.md.


WB 5.0: Elektron mekanizması editöründe 30 adıma kadar oturum içi reaksiyon geçmişi, yük karşılaştırması ve önceki adıma dönüş.
