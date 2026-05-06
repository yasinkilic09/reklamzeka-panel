"use client";

import { useState } from "react";

type CampaignForm = {
  businessName: string;
  sector: string;
  city: string;
  targetAudience: string;
  goal: string;
  budget: string;
  platform: string;
  tone: string;
};

type SavedCampaign = {
  id: string;
  createdAt: string;
  businessName: string;
  sector: string;
  city: string;
  goal: string;
  budget: string;
  platform: string;
  output: string;
};

const initialForm: CampaignForm = {
  businessName: "",
  sector: "",
  city: "",
  targetAudience: "",
  goal: "",
  budget: "",
  platform: "Instagram",
  tone: "Samimi ve güven veren",
};

export default function CampaignCreatePage() {
  const [form, setForm] = useState<CampaignForm>(initialForm);
  const [result, setResult] = useState<string>("");

  function updateField(field: keyof CampaignForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createDemoResult() {
  const businessName = form.businessName || "İşletme";
  const sector = form.sector || "Belirtilmeyen sektör";
  const city = form.city || "işletmenin bulunduğu bölge";
  const targetAudience = form.targetAudience || "yerel müşteriler";
  const goal = form.goal || "müşteri kazanımını artırmak";
  const budget = form.budget || "belirtilmeyen bütçe";
  const platform = form.platform;
  const tone = form.tone;

  const platformAdvice: Record<string, string> = {
    Instagram:
      "Görsel kalitesi yüksek post, reels ve hikâye reklamları birlikte kullanılmalı. İlk 3 saniyede dikkat çeken bir açılış tercih edilmeli.",
    Facebook:
      "Yerel hedefleme, kampanya duyuruları ve güven artırıcı müşteri yorumları öne çıkarılmalı.",
    TikTok:
      "Kısa, doğal, eğlenceli ve hızlı tüketilen video içerikleri kullanılmalı. Reklam dili fazla kurumsal olmamalı.",
    "Google Ads":
      "Arama niyeti yüksek kullanıcılar hedeflenmeli. Anahtar kelime, konum ve dönüşüm odaklı reklam metinleri hazırlanmalı.",
    LinkedIn:
      "Daha kurumsal, güven veren ve uzmanlık vurgusu yüksek bir reklam dili kullanılmalı.",
  };

  const toneAdvice: Record<string, string> = {
    "Samimi ve güven veren":
      "Marka dili sıcak, doğal ve ulaşılabilir olmalı. Kullanıcıya doğrudan fayda anlatılmalı.",
    "Profesyonel ve kurumsal":
      "Net, güvenilir, ölçülebilir ve ciddi bir anlatım tercih edilmeli.",
    "Genç ve dinamik":
      "Daha enerjik, kısa, dikkat çekici ve sosyal medya diline yakın ifadeler kullanılmalı.",
    "Lüks ve prestijli":
      "Az ama güçlü kelimelerle seçkinlik, kalite ve ayrıcalık hissi verilmelidir.",
    "Satış odaklı":
      "Net teklif, güçlü çağrı cümlesi ve kampanya avantajı ön planda olmalıdır.",
  };

  const output = `
${businessName} - AI Destekli Reklam Kampanyası Stratejisi

1. KAMPANYA ÖZETİ
${businessName}, ${city} bölgesinde ${sector} alanında faaliyet gösteren bir marka olarak ${targetAudience} kitlesine ulaşmayı hedeflemelidir. Kampanyanın ana amacı: ${goal}.

Bu kampanyada temel strateji; markanın güvenilirliğini, sunduğu faydayı ve kullanıcıyı harekete geçirecek net mesajı aynı reklam kurgusu içinde birleştirmektir.

2. MARKA KONUMLANDIRMA ÖNERİSİ
${businessName}, hedef kitlenin zihninde sadece bir “${sector} işletmesi” olarak değil; tercih edilebilir, güvenilir ve kolay ulaşılabilir bir çözüm olarak konumlandırılmalıdır.

Önerilen konumlandırma cümlesi:
"${city} bölgesinde ${targetAudience} için güvenilir, dikkat çekici ve ihtiyaca doğrudan cevap veren ${sector} deneyimi."

3. HEDEF KİTLE ANALİZİ
Ana hedef kitle:
${targetAudience}

Bu kitleye ulaşırken mesajda şu unsurlar vurgulanmalı:
- Güven
- Kolay ulaşılabilirlik
- Net fayda
- Yerel yakınlık
- Hızlı karar aldıran teklif

Hedefleme önerisi:
- Konum: ${city}
- İlgi alanları: ${sector}, yerel işletmeler, kampanyalar, sosyal medya etkileşimi
- Davranış: Son 30 gün içinde benzer işletmelerle ilgilenmiş kullanıcılar
- Öncelikli yaş aralığı: 18-45
- Reklam amacı: ${goal}

4. PLATFORM STRATEJİSİ
Seçilen platform: ${platform}

${platformAdvice[platform] || "Platforma uygun reklam dili ve içerik formatı seçilmelidir."}

Bu platformda tek bir reklam yerine en az 3 farklı kreatif test edilmelidir:
- Duygusal fayda odaklı reklam
- Kampanya / teklif odaklı reklam
- Güven ve sosyal kanıt odaklı reklam

5. REKLAM METNİ ÖNERİLERİ

Reklam Metni 1 - Güven Odaklı:
${city} bölgesinde ${sector} arıyorsanız, ${businessName} size güven veren bir deneyim sunar. ${goal} hedefiniz için şimdi doğru zamanı yakalayın.

Çağrı butonu:
Hemen Bilgi Al

Reklam Metni 2 - Satış Odaklı:
${businessName} ile ${sector} deneyimini keşfedin. ${targetAudience} için özel hazırlanan fırsatları kaçırmayın.

Çağrı butonu:
Teklifi Gör

Reklam Metni 3 - Yerel Yakınlık Odaklı:
${city}'de kaliteli ve güvenilir bir seçenek arayanlar için ${businessName} şimdi daha yakın. Size özel avantajları inceleyin.

Çağrı butonu:
Bize Ulaş

6. BAŞLIK ÖNERİLERİ
- ${businessName} ile ${city}'de fark yaratın
- ${sector} deneyimini yeniden keşfedin
- ${targetAudience} için özel reklam fırsatı
- ${city}'de güvenilir tercih: ${businessName}
- Şimdi keşfet, avantajı kaçırma

7. GÖRSEL / VİDEO FİKRİ
Ana kreatif fikir:
Markanın en güçlü yönünü gösteren sade, profesyonel ve güven veren bir görsel kullanılmalı. Görselde fazla yazı olmamalı; ana mesaj kısa ve net verilmelidir.

Önerilen görsel metni:
"${businessName} ile şimdi daha görünür olun"

Video fikri:
0-3 saniye:
Dikkat çekici açılış cümlesi: "${city}'de ${sector} arayanlara özel"

3-8 saniye:
Markanın sunduğu fayda gösterilir.

8-12 saniye:
Kampanya çağrısı yapılır.

12-15 saniye:
Logo, iletişim ve çağrı butonu gösterilir.

8. BÜTÇE KULLANIM ÖNERİSİ
Belirtilen bütçe: ${budget}

Önerilen dağılım:
- %50 ana hedef kitle reklamı
- %25 yeniden hedefleme reklamı
- %15 kreatif test reklamları
- %10 acil kampanya / fırsat duyurusu

Eğer bütçe sınırlıysa ilk aşamada tek hedefe odaklanılmalı:
"${goal}"

9. MARKA TONU ÖNERİSİ
Seçilen ton: ${tone}

${toneAdvice[tone] || "Marka dili hedef kitleye uygun, açık ve güven veren bir yapıda olmalıdır."}

Bu tona göre reklam dili fazla karmaşık olmamalı. Kullanıcının ilk bakışta anlayacağı kısa, net ve fayda odaklı cümleler tercih edilmelidir.

10. TAHMİNİ PERFORMANS DEĞERLENDİRMESİ
Bu kampanya, doğru görsel ve hedefleme ile orta-yüksek performans potansiyeline sahiptir.

Tahmini başarı skoru:
%78 - %86

Güçlü yönler:
- Yerel hedefleme yapılabilir
- Platform seçimi kampanya amacına uygun
- Hedef kitle netleştirilebilir
- Reklam metni farklı açılardan test edilebilir

Riskler:
- Görsel kalitesi düşük olursa performans düşer
- Hedef kitle çok geniş seçilirse bütçe boşa harcanabilir
- Tek reklam metniyle çıkılırsa test imkânı azalır

11. SONUÇ
${businessName} için en doğru reklam yaklaşımı; ${city} bölgesinde ${targetAudience} kitlesine güven veren, sade, net ve aksiyon odaklı bir kampanya yapısı kurmaktır.

Bu kampanya, ${platform} üzerinde test edilerek başlatılmalı; ilk 3-5 gün içinde tıklama oranı, mesaj dönüşü ve etkileşim maliyeti analiz edilerek optimize edilmelidir.
`;

const finalOutput = output.trim();

const newCampaign: SavedCampaign = {
  id: Date.now().toString(),
  createdAt: new Date().toISOString(),
  businessName,
  sector,
  city,
  goal,
  budget,
  platform,
  output: finalOutput,
};

const savedCampaigns = JSON.parse(
  localStorage.getItem("reklamzeka_campaigns") || "[]"
) as SavedCampaign[];

localStorage.setItem(
  "reklamzeka_campaigns",
  JSON.stringify([newCampaign, ...savedCampaigns])
);

setResult(finalOutput);
}

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            ← Dashboard'a dön
          </a>

          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Kampanya Oluştur
          </h1>

          <p className="mt-3 max-w-3xl text-slate-300">
            İşletme bilgilerini girerek yapay zekâ destekli reklam kampanyası
            önerisi oluştur. Bu ekran şu anda demo mantığıyla çalışıyor; sonraki
            aşamada OpenAI API ile gerçek üretim motoruna bağlanacak.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">İşletme ve kampanya bilgileri</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  İşletme adı
                </label>
                <input
                  value={form.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  placeholder="Örn: Atlıbahçem"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Sektör
                  </label>
                  <input
                    value={form.sector}
                    onChange={(event) =>
                      updateField("sector", event.target.value)
                    }
                    placeholder="Örn: Restoran / Cafe"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Şehir
                  </label>
                  <input
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Örn: Aydın"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Hedef kitle
                </label>
                <input
                  value={form.targetAudience}
                  onChange={(event) =>
                    updateField("targetAudience", event.target.value)
                  }
                  placeholder="Örn: Aydın'da yaşayan 18-35 yaş arası gençler"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Reklam amacı
                </label>
                <input
                  value={form.goal}
                  onChange={(event) => updateField("goal", event.target.value)}
                  placeholder="Örn: Instagram üzerinden rezervasyon artırmak"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Bütçe
                  </label>
                  <input
                    value={form.budget}
                    onChange={(event) =>
                      updateField("budget", event.target.value)
                    }
                    placeholder="Örn: 10.000 TL"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Platform
                  </label>
                  <select
                    value={form.platform}
                    onChange={(event) =>
                      updateField("platform", event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>TikTok</option>
                    <option>Google Ads</option>
                    <option>LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Marka tonu
                  </label>
                  <select
                    value={form.tone}
                    onChange={(event) => updateField("tone", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    <option>Samimi ve güven veren</option>
                    <option>Profesyonel ve kurumsal</option>
                    <option>Genç ve dinamik</option>
                    <option>Lüks ve prestijli</option>
                    <option>Satış odaklı</option>
                  </select>
                </div>
              </div>

              <button
                onClick={createDemoResult}
                className="mt-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                AI Kampanya Önerisi Oluştur ve Kaydet
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">AI Reklam Çıktısı</h2>

            {result ? (
              <pre className="mt-6 min-h-[500px] whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-900 p-5 text-sm leading-7 text-slate-200">
                {result}
              </pre>
            ) : (
              <div className="mt-6 flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center">
                <div>
                  <p className="text-lg font-medium text-slate-200">
                    Henüz kampanya çıktısı oluşturulmadı.
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Sol taraftaki formu doldurup butona bastığında demo reklam
                    önerisi burada görünecek.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}