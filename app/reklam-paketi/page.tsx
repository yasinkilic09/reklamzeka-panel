"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

type BusinessProfile = {
  id: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  target_audience: string | null;
  brand_tone: string | null;
  instagram: string | null;
  notes: string | null;
};

export default function AdPackagePage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>(
    []
  );

  const [businessName, setBusinessName] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [campaignGoal, setCampaignGoal] = useState("Satış artırma");
  const [campaignType, setCampaignType] = useState("Tanıtım kampanyası");
  const [offer, setOffer] = useState("");
  const [budget, setBudget] = useState("");

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserAndProfiles();
  }, []);

  async function loadUserAndProfiles() {
    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/auth/login");
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("business_profiles")
      .select(
        "id, business_name, sector, city, target_audience, brand_tone, instagram, notes"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("İşletme profilleri yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    setBusinessProfiles(data || []);
    setIsLoading(false);
  }

  function selectBusinessProfile(profileId: string) {
    const selectedProfile = businessProfiles.find(
      (profile) => profile.id === profileId
    );

    if (!selectedProfile) return;

    setBusinessName(selectedProfile.business_name || "");
    setSector(selectedProfile.sector || "");
    setCity(selectedProfile.city || "");
    setTargetAudience(selectedProfile.target_audience || "");
    setBrandTone(selectedProfile.brand_tone || "");
  }

  function generatePackage() {
    if (!businessName.trim()) {
      alert("Lütfen işletme adını gir.");
      return;
    }

    const finalSector = sector || "hizmet sektörü";
    const finalCity = city || "yerel bölge";
    const finalAudience = targetAudience || "yerel müşteriler";
    const finalTone = brandTone || "samimi, güven veren ve profesyonel";
    const finalOffer = offer || "öne çıkan ürün veya hizmet";
    const finalBudget = budget || "belirtilmeyen bütçe";

    const hashtags = generateHashtags(finalSector, finalCity, businessName);

    const output = `# ${businessName} Reklam Paketi

## 1. Kampanya Özeti

İşletme: ${businessName}
Sektör: ${finalSector}
Şehir / Bölge: ${finalCity}
Platform: ${platform}
Kampanya Türü: ${campaignType}
Kampanya Hedefi: ${campaignGoal}
Hedef Kitle: ${finalAudience}
Marka Tonu: ${finalTone}
Teklif / Öne Çıkan Mesaj: ${finalOffer}
Tahmini Bütçe: ${finalBudget}

Bu kampanyanın ana amacı, ${businessName} markasını ${finalAudience} için daha görünür hale getirmek ve ${campaignGoal.toLowerCase()} hedefini desteklemektir.

---

## 2. Reklam Başlığı Alternatifleri

1. ${businessName} ile ${finalCity} bölgesinde farkı keşfet.
2. ${finalSector} alanında güvenilir ve dikkat çeken bir deneyim seni bekliyor.
3. ${finalOffer} için doğru zaman şimdi.
4. ${businessName}: ${finalAudience} için özel bir deneyim.
5. Kaliteli hizmet, güçlü iletişim, doğru marka algısı.

---

## 3. Instagram Post Açıklaması

${businessName} olarak ${finalCity} bölgesinde ${finalAudience} için özenle hazırlanmış hizmetler sunuyoruz.

${finalTone} bir yaklaşımla, ihtiyacına en uygun çözümü sunmayı ve sana daha iyi bir deneyim yaşatmayı hedefliyoruz.

${finalOffer} hakkında detaylı bilgi almak için bizimle iletişime geçebilirsin.

📍 ${finalCity}
💬 Detaylı bilgi için mesaj atabilirsin.
✨ ${businessName} ile şimdi tanış.

---

## 4. Kısa Reklam Metni

${businessName} ile ${finalCity} bölgesinde kaliteli, güvenilir ve dikkat çekici bir deneyim seni bekliyor. ${finalOffer} hakkında bilgi almak için hemen iletişime geç.

---

## 5. Story Metinleri

Story 1:
${businessName} ile tanıştın mı?

Story 2:
${finalCity} bölgesinde ${finalSector} alanında kaliteli hizmet arıyorsan doğru yerdesin.

Story 3:
${finalOffer} hakkında bilgi almak için bize mesaj gönder.

Story 4:
Bugün harekete geç. Detaylar için DM’den ulaş.

---

## 6. 15 Saniyelik Reels Senaryosu

Süre: 0-3 saniye
Görüntü: İşletmenin dış görünüşü veya dikkat çeken bir detay.
Metin: "${businessName} ile tanışın."

Süre: 3-7 saniye
Görüntü: Ürün, hizmet veya ortam detayları.
Metin: "${finalAudience} için özel bir deneyim."

Süre: 7-11 saniye
Görüntü: İşletmenin sunduğu hizmetlerden yakın plan görüntüler.
Metin: "${finalOffer}"

Süre: 11-15 saniye
Görüntü: Logo, iletişim veya konum bilgisi.
Metin: "Detaylı bilgi için bize mesaj gönder."

---

## 7. Harekete Geçirici Mesajlar

- Detaylı bilgi için hemen mesaj gönder.
- Randevu ve bilgi almak için DM’den ulaş.
- ${finalOffer} fırsatını kaçırma.
- Bize ulaş, sana en uygun seçeneği birlikte belirleyelim.
- ${businessName} deneyimini şimdi keşfet.

---

## 8. Hashtag Önerileri

${hashtags.join(" ")}

---

## 9. 7 Günlük Paylaşım Planı

1. Gün:
Tanıtım postu paylaş. Markanın kim olduğunu ve ne sunduğunu anlat.

2. Gün:
Story üzerinden kısa bir soru-cevap yap. Kullanıcıların merak ettiği konuları cevapla.

3. Gün:
Reels videosu paylaş. Hizmet veya ürünün en dikkat çekici yönünü göster.

4. Gün:
Müşteri güvenini artıracak bir paylaşım yap. Yorum, deneyim veya hizmet sürecini anlat.

5. Gün:
Kampanya veya teklif paylaş. ${finalOffer} mesajını öne çıkar.

6. Gün:
Perde arkası içerik paylaş. İşletmenin samimi ve gerçek tarafını göster.

7. Gün:
Hatırlatma postu paylaş. Kullanıcıları mesaj atmaya veya işletmeyi ziyaret etmeye yönlendir.

---

## 10. Kullanım Notu

Bu paket doğrudan sosyal medya paylaşımı, reklam metni hazırlığı ve müşteri iletişimi için kullanılabilir. Metinler paylaşılmadan önce kampanyanın güncel fiyat, tarih ve iletişim bilgilerine göre küçük düzenlemelerle daha güçlü hale getirilebilir.`;

    setGeneratedOutput(output);
  }

  async function copyOutput() {
    if (!generatedOutput) {
      alert("Önce reklam paketi oluşturmalısın.");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedOutput);
      alert("Reklam paketi kopyalandı.");
    } catch {
      alert("Kopyalama işlemi başarısız oldu.");
    }
  }

  async function saveAsCampaign() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    if (!generatedOutput) {
      alert("Önce reklam paketi oluşturmalısın.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("campaigns").insert({
      business_name: businessName,
      sector,
      city,
      goal: campaignGoal,
      budget,
      platform,
      output: generatedOutput,
      user_id: userId,
      is_archived: false,
      archived_at: null,
    });

    if (error) {
      console.error(error);
      alert("Reklam paketi kampanya olarak kaydedilemedi.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    alert("Reklam paketi kampanya olarak kaydedildi.");
    router.push("/gecmis-kampanyalar");
  }

  function generateHashtags(
    sectorValue: string,
    cityValue: string,
    businessValue: string
  ) {
    const sectorTag = toHashtag(sectorValue);
    const cityTag = toHashtag(cityValue);
    const businessTag = toHashtag(businessValue);

    return [
      businessTag,
      cityTag,
      sectorTag,
      "#yerelisletme",
      "#reklam",
      "#sosyalmedya",
      "#kampanya",
      "#kesfet",
    ].filter(Boolean);
  }

  function toHashtag(value: string) {
    const normalized = value
      .toLowerCase()
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ı", "i")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .join("");

    return normalized ? `#${normalized}` : "";
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

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <a
            href="/"
            className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
          >
            ← Dashboard'a dön
          </a>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Kullanıma Hazır Reklam İçeriği
            </p>

            <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
              Reklam Paketi Oluşturucu
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
              İşletme bilgilerine göre sosyal medyada doğrudan kullanılabilecek
              reklam metinleri, story içerikleri, reels senaryosu, CTA ve
              paylaşım planı oluştur.
            </p>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Sayfa hazırlanıyor...</p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="text-2xl font-bold">Kampanya Bilgileri</h2>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                Ne kadar net bilgi girersen oluşturulan reklam paketi o kadar
                kullanışlı olur.
              </p>

              <div className="mt-6 grid gap-5">
                {businessProfiles.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Kayıtlı İşletmeden Doldur
                    </label>

                    <select
                      onChange={(event) =>
                        selectBusinessProfile(event.target.value)
                      }
                      defaultValue=""
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 focus:ring-4"
                    >
                      <option value="" disabled>
                        İşletme seç
                      </option>

                      {businessProfiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.business_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <InputField
                  label="İşletme Adı"
                  value={businessName}
                  onChange={setBusinessName}
                  placeholder="Örn: Atlıbahçem"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Sektör"
                    value={sector}
                    onChange={setSector}
                    placeholder="Örn: Restoran, kafe, butik"
                  />

                  <InputField
                    label="Şehir / Bölge"
                    value={city}
                    onChange={setCity}
                    placeholder="Örn: Aydın / Efeler"
                  />
                </div>

                <InputField
                  label="Hedef Kitle"
                  value={targetAudience}
                  onChange={setTargetAudience}
                  placeholder="Örn: Aileler, gençler, üniversite öğrencileri"
                />

                <InputField
                  label="Marka Tonu"
                  value={brandTone}
                  onChange={setBrandTone}
                  placeholder="Örn: Samimi, güven veren, premium, eğlenceli"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Platform"
                    value={platform}
                    onChange={setPlatform}
                    options={[
                      "Instagram",
                      "Facebook",
                      "TikTok",
                      "Google Ads",
                      "Genel Sosyal Medya",
                    ]}
                  />

                  <SelectField
                    label="Kampanya Hedefi"
                    value={campaignGoal}
                    onChange={setCampaignGoal}
                    options={[
                      "Satış artırma",
                      "Marka bilinirliği",
                      "Mesaj alma",
                      "Randevu alma",
                      "Mekâna ziyaret artırma",
                      "Takipçi artırma",
                    ]}
                  />
                </div>

                <SelectField
                  label="Kampanya Türü"
                  value={campaignType}
                  onChange={setCampaignType}
                  options={[
                    "Tanıtım kampanyası",
                    "Duyuru kampanyası",
                    "İndirim kampanyası",
                    "Lansman kampanyası",
                    "Anneler Günü / özel gün kampanyası",
                    "Yerel işletme bilinirlik kampanyası",
                  ]}
                />

                <InputField
                  label="Teklif / Öne Çıkan Mesaj"
                  value={offer}
                  onChange={setOffer}
                  placeholder="Örn: Hafta sonuna özel serpme kahvaltı, yeni sezon ürünleri"
                />

                <InputField
                  label="Bütçe"
                  value={budget}
                  onChange={setBudget}
                  placeholder="Örn: 1.500 TL / 7 gün"
                />

                <button
                  onClick={generatePackage}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
                >
                  Reklam Paketi Oluştur
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Hazır Çıktı
                  </p>

                  <h2 className="mt-3 text-2xl font-black">
                    Oluşturulan Reklam Paketi
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyOutput}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    Kopyala
                  </button>

                  <button
                    onClick={saveAsCampaign}
                    disabled={isSaving}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Kaydediliyor..." : "Kampanya Olarak Kaydet"}
                  </button>
                </div>
              </div>

              {generatedOutput ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="max-h-[760px] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-slate-200">
                    {generatedOutput}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-2xl">
                    ✦
                  </div>

                  <h3 className="text-2xl font-bold">
                    Henüz reklam paketi oluşturulmadı
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                    Sol taraftaki bilgileri doldurup “Reklam Paketi Oluştur”
                    butonuna bastığında kullanıcıya hazır içerik paketi burada
                    görünecek.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
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
        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 focus:ring-4"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}