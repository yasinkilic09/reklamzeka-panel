# AdMind AI — Yapay Zekâ Destekli Reklam Yönetim Paneli

AdMind AI, KOBİ’ler ve yerel işletmeler için geliştirilen yapay zekâ destekli reklam stratejisi ve kampanya üretim panelidir. Sistem; işletme bilgileri, hedef kitle, reklam amacı, bütçe ve platform seçimine göre reklam stratejisi, kampanya metni, hedefleme önerisi ve içerik fikri üretmeyi amaçlar.

Bu proje, Teknokent başvurusu ve MVP sunumu için geliştirilmiş çalışan bir web panel prototipidir.

## Canlı Demo

https://admind-ai-gold.vercel.app/

## Proje Amacı

AdMind AI’ın temel amacı, reklam bilgisi sınırlı olan küçük ve orta ölçekli işletmelerin daha profesyonel reklam kampanyaları oluşturmasını kolaylaştırmaktır.

Platform şu problemleri çözmeyi hedefler:

- İşletmelerin reklam stratejisi oluşturmakta zorlanması
- Hedef kitle ve bütçe planlamasının bilinçsiz yapılması
- Reklam metni ve kampanya fikri üretiminin zaman alması
- Yerel işletmelerin dijital reklam süreçlerinde uzman desteğine ihtiyaç duyması
- Reklam kampanyalarının düzenli şekilde arşivlenmemesi

## Mevcut Özellikler

- Modern SaaS tarzı dashboard arayüzü
- İşletme profili oluşturma
- İşletme profillerini Supabase veritabanına kaydetme
- Kayıtlı işletmeler üzerinden kampanya oluşturma
- Kampanya amacı, bütçe, platform ve marka tonu belirleme
- Demo AI reklam stratejisi çıktısı üretme
- Kampanyaları Supabase veritabanına kaydetme
- Geçmiş kampanyaları listeleme
- Kampanya çıktısını kopyalama
- Kampanyaları kalıcı olarak silmeden arşivleme
- Dashboard üzerinde gerçek Supabase verilerine bağlı istatistikler
- Vercel üzerinde canlı yayın

## Teknolojiler

Bu projede kullanılan temel teknolojiler:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- GitHub

## Sayfalar

| Sayfa | Açıklama |
|---|---|
| Dashboard | Genel istatistikler, son kampanyalar ve MVP akışı |
| İşletme Profilleri | İşletme/müşteri bilgilerini kaydetme ve yönetme |
| Kampanya Oluştur | Kayıtlı işletme seçerek reklam kampanyası üretme |
| Geçmiş Kampanyalar | Oluşturulan kampanyaları görüntüleme, kopyalama ve arşivleme |

## Veri Yapısı

Proje Supabase üzerinde iki ana tablo kullanır:

### business_profiles

İşletme profillerini saklar.

Temel alanlar:

- id
- created_at
- business_name
- sector
- city
- address
- target_audience
- brand_tone
- instagram
- phone
- notes

### campaigns

Oluşturulan reklam kampanyalarını saklar.

Temel alanlar:

- id
- created_at
- business_name
- sector
- city
- goal
- budget
- platform
- output
- is_archived
- archived_at

## Arşivleme Mantığı

Kampanyalar doğrudan veritabanından silinmez. Bunun yerine:

```text
is_archived = true
archived_at = arşivlenme tarihi