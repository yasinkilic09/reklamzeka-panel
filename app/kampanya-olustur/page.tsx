"use client";

import { useEffect, useState } from "react";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

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

type BusinessProfile = {
  id: string;
  createdAt: string;
  businessName: string;
  sector: string;
  city: string;
  address: string;
  targetAudience: string;
  brandTone: string;
  instagram: string;
  phone: string;
  notes: string;
};

type SupabaseBusinessProfile = {
  id: string;
  created_at: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  address: string | null;
  target_audience: string | null;
  brand_tone: string | null;
  instagram: string | null;
  phone: string | null;
  notes: string | null;
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

const platforms = ["Instagram", "Facebook", "TikTok", "Google Ads", "LinkedIn"];

const tones = [
  "Samimi ve güven veren",
  "Profesyonel ve kurumsal",
  "Genç ve dinamik",
  "Lüks ve prestijli",
  "Satış odaklı",
];

function mapBusinessProfile(row: SupabaseBusinessProfile): BusinessProfile {
  return {
    id: row.id,
    createdAt: row.created_at,
    businessName: row.business_name,
    sector: row.sector || "",
    city: row.city || "",
    address: row.address || "",
    targetAudience: row.target_audience || "",
    brandTone: row.brand_tone || "Samimi ve güven veren",
    instagram: row.instagram || "",
    phone: row.phone || "",
    notes: row.notes || "",
  };
}

export default function CampaignCreatePage() {
  const supabase = createClient();

  const [form, setForm] = useState<CampaignForm>(initialForm);
  const [result, setResult] = useState<string>("");
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>(
    []
  );
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isSavingCampaign, setIsSavingCampaign] = useState(false);

  useEffect(() => {
    loadBusinessProfiles();
  }, []);

  async function loadBusinessProfiles() {
    setIsLoadingProfiles(true);

    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("İşletme profilleri yüklenirken hata oluştu.");
      setIsLoadingProfiles(false);
      return;
    }

    setBusinessProfiles((data || []).map(mapBusinessProfile));
    setIsLoadingProfiles(false);
  }

  function updateField(field: keyof CampaignForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function selectBusinessProfile(profileId: string) {
    setSelectedBusinessId(profileId);

    const selectedProfile = businessProfiles.find(
      (profile) => profile.id === profileId
    );

    if (!selectedProfile) return;

    setForm((current) => ({
      ...current,
      businessName: selectedProfile.businessName,
      sector: selectedProfile.sector,
      city: selectedProfile.city,
      targetAudience: selectedProfile.targetAudience,
      tone: selectedProfile.brandTone,
    }));
  }

  async function createDemoResult() {
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
`;

    const finalOutput = output.trim();

    setIsSavingCampaign(true);

    const { error } = await supabase.from("campaigns").insert({
      business_name: businessName,
      sector,
      city,
      goal,
      budget,
      platform,
      output: finalOutput,
    });

    if (error) {
      console.error(error);
      alert("Kampanya Supabase'e kaydedilirken hata oluştu.");
      setIsSavingCampaign(false);
      return;
    }

    setResult(finalOutput);
    setIsSavingCampaign(false);
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert("AI kampanya çıktısı kopyalandı.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <AppTopNav />

        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex-row lg:items-center">
          <div>
            <a
              href="/"
              className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
            >
              ← Dashboard'a dön
            </a>

            <h1 className="mt-5 text-3xl font-black tracking-tight lg:text-5xl">
              Kampanya Oluştur
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
              Supabase’den işletme profili seç, kampanya hedefini gir ve reklam
              stratejisini gerçek veritabanına kaydet.
            </p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3 lg:w-[420px]">
            {["Profil seç", "Bilgi gir", "Supabase'e kaydet"].map(
              (step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-200">
                    {index + 1}
                  </div>
                  <p className="font-medium text-slate-200">{step}</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Kampanya Bilgileri</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Girdi kalitesi arttıkça reklam stratejisi de güçlenir.
                </p>
              </div>

              <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                Supabase aktif
              </span>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Kayıtlı işletme seç
                </label>

                <select
                  value={selectedBusinessId}
                  onChange={(event) => selectBusinessProfile(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                >
                  <option value="">
                    {isLoadingProfiles
                      ? "İşletmeler yükleniyor..."
                      : "Manuel giriş yap"}
                  </option>

                  {businessProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.businessName} - {profile.sector} / {profile.city}
                    </option>
                  ))}
                </select>

                {!isLoadingProfiles && businessProfiles.length === 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Henüz kayıtlı işletme yok. Önce İşletme Profilleri
                    sayfasından işletme ekleyebilirsin.
                  </p>
                )}
              </div>

              <InputField
                label="İşletme adı"
                value={form.businessName}
                onChange={(value) => updateField("businessName", value)}
                placeholder="Örn: Atlıbahçem"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Sektör"
                  value={form.sector}
                  onChange={(value) => updateField("sector", value)}
                  placeholder="Örn: Restoran / Cafe"
                />

                <InputField
                  label="Şehir"
                  value={form.city}
                  onChange={(value) => updateField("city", value)}
                  placeholder="Örn: Aydın"
                />
              </div>

              <InputField
                label="Hedef kitle"
                value={form.targetAudience}
                onChange={(value) => updateField("targetAudience", value)}
                placeholder="Örn: Aydın'da yaşayan aileler ve gençler"
              />

              <InputField
                label="Reklam amacı"
                value={form.goal}
                onChange={(value) => updateField("goal", value)}
                placeholder="Örn: Hafta sonu rezervasyonlarını artırmak"
              />

              <div className="grid gap-5 md:grid-cols-3">
                <InputField
                  label="Bütçe"
                  value={form.budget}
                  onChange={(value) => updateField("budget", value)}
                  placeholder="Örn: 10.000 TL"
                />

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Platform
                  </label>
                  <select
                    value={form.platform}
                    onChange={(event) =>
                      updateField("platform", event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    {platforms.map((platform) => (
                      <option key={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Marka tonu
                  </label>
                  <select
                    value={form.tone}
                    onChange={(event) => updateField("tone", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    {tones.map((tone) => (
                      <option key={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={createDemoResult}
                disabled={isSavingCampaign}
                className="mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingCampaign
                  ? "Kaydediliyor..."
                  : "AI Kampanya Önerisi Oluştur ve Supabase'e Kaydet"}
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-bold">AI Reklam Çıktısı</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Kampanya stratejisi, metin önerileri ve bütçe dağılımı.
                </p>
              </div>

              {result && (
                <button
                  onClick={copyResult}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Çıktıyı Kopyala
                </button>
              )}
            </div>

            {result ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-200">
                    {form.platform}
                  </span>
                  <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs text-purple-200">
                    {form.tone}
                  </span>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-200">
                    Supabase'e kaydedildi
                  </span>
                </div>

                <pre className="max-h-[760px] overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="flex min-h-[650px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/15 text-3xl">
                    ✦
                  </div>
                  <p className="text-xl font-bold text-slate-100">
                    Henüz çıktı oluşturulmadı.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Sol taraftaki kampanya bilgilerini doldurup butona bastığında
                    AI reklam stratejisi burada görünecek ve Supabase’e
                    kaydedilecek.
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

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
      />
    </div>
  );
}