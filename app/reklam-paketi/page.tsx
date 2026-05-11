"use client";

import { useEffect, useMemo, useState } from "react";
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

type SectorTemplateKey =
  | "restaurant_cafe"
  | "boutique"
  | "beauty"
  | "real_estate"
  | "education"
  | "local_service"
  | "general";

const sectorTemplates = [
  { value: "restaurant_cafe", label: "Restoran / Kafe" },
  { value: "boutique", label: "Butik / Mağaza" },
  { value: "beauty", label: "Güzellik / Bakım Merkezi" },
  { value: "real_estate", label: "Emlak / Gayrimenkul" },
  { value: "education", label: "Eğitim / Kurs" },
  { value: "local_service", label: "Yerel Hizmet İşletmesi" },
  { value: "general", label: "Genel Şablon" },
];

const packageLevels = [
  "Hızlı Paket",
  "Standart Paket",
  "Güçlü Paket",
];

const contentTones = [
  "Samimi ve güven veren",
  "Premium ve prestijli",
  "Genç, dinamik ve trend",
  "Kurumsal ve net",
  "Duygusal ve içten",
  "Satış odaklı",
];

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
  const [sectorTemplate, setSectorTemplate] =
    useState<SectorTemplateKey>("restaurant_cafe");
  const [packageLevel, setPackageLevel] = useState("Güçlü Paket");
  const [contentTone, setContentTone] = useState("Samimi ve güven veren");
  const [mainProduct, setMainProduct] = useState("");
  const [customerProblem, setCustomerProblem] = useState("");
  const [contactAction, setContactAction] = useState("DM’den bilgi al");

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserAndProfiles();
  }, []);

  const selectedSectorLabel = useMemo(() => {
    return (
      sectorTemplates.find((template) => template.value === sectorTemplate)
        ?.label || "Genel Şablon"
    );
  }, [sectorTemplate]);

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

    const context = buildCampaignContext();
    const playbook = getSectorPlaybook(sectorTemplate, context);
    const hashtags = generateHashtags(
      sectorTemplate,
      context.city,
      context.businessName,
      context.sector
    );

    const output = buildOutput(context, playbook, hashtags);

    setGeneratedOutput(output);
  }

  function buildCampaignContext() {
    return {
      businessName: businessName.trim(),
      sector: sector.trim() || selectedSectorLabel,
      city: city.trim() || "yerel bölge",
      targetAudience: targetAudience.trim() || "yerel müşteriler",
      brandTone: brandTone.trim() || contentTone,
      platform,
      campaignGoal,
      campaignType,
      offer: offer.trim() || "öne çıkan ürün veya hizmet",
      budget: budget.trim() || "belirtilmeyen bütçe",
      packageLevel,
      contentTone,
      mainProduct: mainProduct.trim() || "öne çıkarılacak ürün / hizmet",
      customerProblem:
        customerProblem.trim() ||
        "müşterinin ihtiyaç duyduğu çözümü hızlı ve güvenilir şekilde bulamaması",
      contactAction: contactAction.trim() || "DM’den bilgi al",
      sectorTemplateLabel: selectedSectorLabel,
    };
  }

  function getSectorPlaybook(
    template: SectorTemplateKey,
    context: ReturnType<typeof buildCampaignContext>
  ) {
    const common = {
      trustLine:
        "Güven veren, net ve kullanıcıyı harekete geçiren bir anlatım kullanılmalı.",
      proofIdea:
        "Gerçek işletme görüntüleri, müşteri deneyimi, ürün/hizmet detayları ve konum vurgusu kullanılmalı.",
    };

    const playbooks = {
      restaurant_cafe: {
        angle:
          "Lezzet, ortam deneyimi, aile/arkadaş buluşması ve mekân atmosferi ön plana çıkarılmalı.",
        hook: `${context.city} bölgesinde keyifli bir lezzet deneyimi arayanlar için güçlü bir davet oluştur.`,
        visual:
          "Mekân atmosferi, masa detayları, ürün yakın planları, servis anı ve konum tabelası.",
        urgency:
          "Hafta sonu planı, akşam yemeği, kahve molası veya özel gün buluşması üzerinden çağrı yapılmalı.",
        objection:
          "Kullanıcının “Nereye gitsek?” kararsızlığını çözmeye odaklan.",
        cta: "Rezervasyon / bilgi için mesaj gönder.",
        ...common,
      },
      boutique: {
        angle:
          "Stil, yeni sezon, kombin önerisi, sınırlı ürün algısı ve kişisel tarz vurgulanmalı.",
        hook: `${context.targetAudience} için yeni sezon stil önerisi oluştur.`,
        visual:
          "Ürün detayları, kombin geçişleri, kumaş/yakın plan, ayna karşısı kullanım ve mağaza rafları.",
        urgency:
          "Yeni sezon, sınırlı stok, kombin fırsatı ve bugün keşfet çağrısı kullanılmalı.",
        objection:
          "Kullanıcının “Bana yakışır mı?” veya “Nasıl kombinlerim?” sorusunu çöz.",
        cta: "Ürün bilgisi ve stok durumu için DM gönder.",
        ...common,
      },
      beauty: {
        angle:
          "Bakım, özgüven, profesyonel uygulama, hijyen ve dönüşüm hissi vurgulanmalı.",
        hook: `${context.targetAudience} için daha bakımlı ve özgüvenli bir görünüm vaadi oluştur.`,
        visual:
          "Temiz uygulama alanı, işlem öncesi hazırlık, ekipman detayı, sakin atmosfer ve sonuç odaklı kadraj.",
        urgency:
          "Randevu planlama, özel gün hazırlığı ve bakım rutini üzerinden çağrı yapılmalı.",
        objection:
          "Kullanıcının güven, hijyen ve sonuç beklentisi konusundaki tereddüdünü azalt.",
        cta: "Randevu ve detaylı bilgi için mesaj gönder.",
        ...common,
      },
      real_estate: {
        angle:
          "Güven, lokasyon, yatırım değeri, doğru danışmanlık ve hızlı bilgi alma ön plana çıkarılmalı.",
        hook: `${context.city} bölgesinde doğru gayrimenkul kararını kolaylaştıran bir mesaj oluştur.`,
        visual:
          "Dış cephe, iç mekân, lokasyon çevresi, oda detayları ve danışmanlık süreci.",
        urgency:
          "Fırsat portföyü, sınırlı ilan, doğru zamanlama ve hızlı iletişim vurgulanmalı.",
        objection:
          "Kullanıcının güvenilir ilan ve doğru fiyat konusundaki şüphesini azalt.",
        cta: "Detaylı portföy ve bilgi için iletişime geç.",
        ...common,
      },
      education: {
        angle:
          "Gelişim, başarı, güvenilir eğitim süreci, öğrenci takibi ve gelecek hedefi vurgulanmalı.",
        hook: `${context.targetAudience} için daha planlı ve güçlü bir öğrenme süreci vaadi oluştur.`,
        visual:
          "Sınıf ortamı, materyaller, eğitmen-öğrenci etkileşimi ve başarı odaklı detaylar.",
        urgency:
          "Yeni dönem kayıtları, kontenjan, deneme dersi veya bilgi görüşmesi üzerinden çağrı yapılmalı.",
        objection:
          "Velinin veya öğrencinin “Doğru eğitim kurumu mu?” sorusunu güvenle cevapla.",
        cta: "Kayıt ve bilgi almak için mesaj gönder.",
        ...common,
      },
      local_service: {
        angle:
          "Hızlı çözüm, güvenilir hizmet, yerel yakınlık, ulaşılabilirlik ve profesyonel süreç vurgulanmalı.",
        hook: `${context.city} bölgesinde hızlı ve güvenilir hizmet arayanlara seslen.`,
        visual:
          "Hizmet süreci, ekip/ekipman detayı, öncesi-sonrası, işletme dış görünüşü ve müşteri iletişimi.",
        urgency:
          "Bugün bilgi al, hızlı dönüş, yerel hizmet avantajı ve kolay iletişim vurgulanmalı.",
        objection:
          "Kullanıcının kalite, fiyat ve güvenilirlik konusundaki tereddüdünü azalt.",
        cta: "Hizmet detayı ve teklif için mesaj gönder.",
        ...common,
      },
      general: {
        angle:
          "Marka bilinirliği, güven, ihtiyaç çözümü, yerel görünürlük ve net iletişim vurgulanmalı.",
        hook: `${context.businessName} için hedef kitleye net bir değer önerisi oluştur.`,
        visual:
          "İşletme ortamı, ürün/hizmet detayı, ekip, müşteri deneyimi ve marka logosu.",
        urgency:
          "Bugün bilgi al, fırsatı kaçırma, hemen iletişime geç ve markayı keşfet çağrısı yapılmalı.",
        objection:
          "Kullanıcının karar verme sürecindeki güven ve bilgi eksikliğini azalt.",
        cta: "Detaylı bilgi için mesaj gönder.",
        ...common,
      },
    };

    return playbooks[template];
  }

  function buildOutput(
    context: ReturnType<typeof buildCampaignContext>,
    playbook: ReturnType<typeof getSectorPlaybook>,
    hashtags: string[]
  ) {
    const isStrongPackage = context.packageLevel === "Güçlü Paket";
    const isStandardPackage =
      context.packageLevel === "Standart Paket" ||
      context.packageLevel === "Güçlü Paket";

    return `# ${context.businessName} — Profesyonel Reklam Paketi

## 1. Kampanya Strateji Özeti

İşletme: ${context.businessName}
Sektör: ${context.sector}
Şablon: ${context.sectorTemplateLabel}
Şehir / Bölge: ${context.city}
Platform: ${context.platform}
Kampanya Türü: ${context.campaignType}
Kampanya Hedefi: ${context.campaignGoal}
Paket Seviyesi: ${context.packageLevel}
Hedef Kitle: ${context.targetAudience}
İçerik Tonu: ${context.contentTone}
Marka Tonu: ${context.brandTone}
Öne Çıkan Ürün / Hizmet: ${context.mainProduct}
Teklif / Mesaj: ${context.offer}
Müşteri Problemi: ${context.customerProblem}
Tahmini Bütçe: ${context.budget}

Stratejik yaklaşım:
${playbook.angle}

Ana reklam fikri:
${playbook.hook}

Kullanıcının karar engeli:
${playbook.objection}

---

## 2. Ana Reklam Mesajı

${context.businessName}, ${context.city} bölgesinde ${context.targetAudience} için ${context.mainProduct} odağında güven veren bir deneyim sunar.

Bu kampanyada temel amaç, kullanıcının "${context.customerProblem}" problemini doğrudan yakalayıp ${context.offer} mesajıyla hızlı aksiyon almasını sağlamaktır.

Ana vaat:
${context.businessName} ile ihtiyacına daha net, daha güvenilir ve daha kolay ulaş.

---

## 3. Reklam Başlığı Alternatifleri

1. ${context.businessName} ile ${context.city} bölgesinde farkı keşfet.
2. ${context.mainProduct} arayanlar için doğru adres: ${context.businessName}.
3. ${context.targetAudience} için özel hazırlanan deneyimi şimdi keşfet.
4. ${context.offer} fırsatını kaçırma.
5. ${context.businessName}: Güven veren hizmet, net iletişim, güçlü deneyim.
${isStandardPackage ? `6. ${context.city} bölgesinde ${context.sector} ihtiyacına profesyonel çözüm.
7. Bugün karar ver, ${context.businessName} ayrıcalığını yaşa.` : ""}

---

## 4. Instagram Post Açıklaması

${context.city} bölgesinde ${context.mainProduct} arıyorsan, ${context.businessName} seni bekliyor.

${context.targetAudience} için hazırladığımız hizmet anlayışında önceliğimiz; güven, kalite ve doğru deneyimi bir araya getirmek.

${context.offer}

${playbook.urgency}

Detaylı bilgi almak, randevu oluşturmak veya merak ettiklerini sormak için bizimle hemen iletişime geçebilirsin.

📍 ${context.city}
💬 ${context.contactAction}
✨ ${context.businessName} ile şimdi tanış.

---

## 5. Daha Kısa Reklam Metni

${context.businessName}, ${context.city} bölgesinde ${context.targetAudience} için ${context.mainProduct} odağında güvenilir ve dikkat çekici bir deneyim sunar. ${context.offer} hakkında bilgi almak için hemen mesaj gönder.

---

## 6. Story Akışı

Story 1:
${context.businessName} ile tanıştın mı?

Story 2:
${context.city} bölgesinde ${context.mainProduct} arayanlar için özel bir deneyim sunuyoruz.

Story 3:
${context.offer}

Story 4:
Merak ettiklerin için bize hemen mesaj gönder.

${isStandardPackage ? `Story 5:
Bugün planını yap. ${context.businessName} seni bekliyor.` : ""}

---

## 7. 15 Saniyelik Reels Senaryosu

0-3 saniye:
Görüntü: ${playbook.visual}
Ekran metni: "${context.city} bölgesinde ${context.businessName}"

3-7 saniye:
Görüntü: Ürün/hizmet detayları ve dikkat çekici yakın planlar.
Ekran metni: "${context.mainProduct} için doğru yerdesin."

7-11 saniye:
Görüntü: İşletmenin güven veren, gerçek ve doğal kullanım anları.
Ekran metni: "${context.offer}"

11-15 saniye:
Görüntü: Logo, konum, iletişim veya işletme dış görünüşü.
Ekran metni: "${context.contactAction}"

Reels notu:
${playbook.proofIdea}

---

## 8. Harekete Geçirici Mesajlar

- ${context.contactAction}
- Detaylı bilgi için hemen mesaj gönder.
- ${context.offer} hakkında bilgi almak için bize ulaş.
- Bugün karar ver, ${context.businessName} deneyimini keşfet.
- Sana en uygun seçeneği birlikte belirleyelim.

---

## 9. Nokta Atışı Hashtag Önerileri

${hashtags.join(" ")}

Not:
Hashtag sayısını düşük ve alakalı tutmak daha temiz bir içerik görünümü sağlar. Bu nedenle burada en fazla 5 adet hedefli hashtag önerildi.

---

## 10. 7 Günlük Paylaşım Planı

1. Gün — Tanıtım Postu:
${context.businessName} kimdir, hangi hizmeti sunar ve neden tercih edilmelidir? Net bir marka tanıtımı yap.

2. Gün — Story Soru-Cevap:
Hedef kitlenin en çok merak edeceği soruları story formatında cevapla.

3. Gün — Reels:
${context.mainProduct} odağında 15 saniyelik dinamik bir video paylaş.

4. Gün — Güven İçeriği:
Hizmet süreci, işletme ortamı, ekip, ürün detayları veya müşteri deneyimi üzerinden güven oluştur.

5. Gün — Teklif / Kampanya:
${context.offer} mesajını net şekilde öne çıkar.

6. Gün — Perde Arkası:
İşletmenin gerçek, samimi ve profesyonel tarafını göster.

7. Gün — Hatırlatma ve CTA:
Kullanıcıyı mesaj atmaya, randevu almaya veya işletmeyi ziyaret etmeye yönlendir.

${
  isStrongPackage
    ? `
---

## 11. Görsel Tasarım Yönlendirmesi

Ana görsel hissi:
Profesyonel, temiz, gerçek işletme görüntülerine dayalı ve yapay zekâ hissi vermeyen bir tasarım tercih edilmeli.

Önerilen post düzeni:
- Üst bölümde kısa güçlü başlık
- Orta bölümde ürün/hizmet veya mekân görseli
- Alt bölümde konum, iletişim ve CTA
- Marka renkleriyle uyumlu sade tipografi
- Fazla kalabalık olmayan, okunabilir metin yapısı

Önerilen Reels çekim dili:
- İlk 2 saniyede dikkat çekici detay
- Orta bölümde hizmet/ürün deneyimi
- Son bölümde logo, konum ve mesaj çağrısı

---

## 12. Reklam Yayınlama Notu

Düşük bütçeli başlangıç için:
- Önce 3-5 gün test reklamı yayınla.
- En çok mesaj, kayıt veya ziyaret getiren metni belirle.
- Sonraki reklamda kazanan metni ve görsel dili güçlendir.
- Aynı anda çok fazla hedef kullanmak yerine tek ana hedefe odaklan.

Önerilen hedef:
${context.campaignGoal}

Önerilen CTA:
${playbook.cta}
`
    : ""
}

---

## 13. Kullanım Notu

Bu reklam paketi doğrudan sosyal medya paylaşımı, story akışı, reels çekimi ve reklam metni hazırlığı için kullanılabilir. Paylaşım öncesinde fiyat, tarih, kampanya koşulları ve iletişim bilgileri işletmenin güncel durumuna göre kontrol edilmelidir.`;
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
    template: SectorTemplateKey,
    cityValue: string,
    businessValue: string,
    sectorValue: string
  ) {
    const cityTag = toHashtag(cityValue);
    const businessTag = toHashtag(businessValue);
    const sectorTag = toHashtag(sectorValue);

    const templateTags: Record<SectorTemplateKey, string[]> = {
      restaurant_cafe: ["#lezzet", "#restoran", "#kafe"],
      boutique: ["#butik", "#yenisezon", "#kombin"],
      beauty: ["#guzellik", "#bakim", "#randevu"],
      real_estate: ["#emlak", "#gayrimenkul", "#yatirim"],
      education: ["#egitim", "#kurs", "#basari"],
      local_service: ["#yerelhizmet", "#guvenilirhizmet", "#hizmet"],
      general: ["#yerelisletme", "#sosyalmedya", "#kampanya"],
    };

    return [
      businessTag,
      cityTag,
      sectorTag,
      ...templateTags[template],
    ]
      .filter(Boolean)
      .filter((tag, index, array) => array.indexOf(tag) === index)
      .slice(0, 5);
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

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Sektöre Göre Akıllı İçerik Paketi
              </p>

              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                Reklam Paketi Oluşturucu
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                İşletme bilgilerine göre post açıklaması, story akışı, reels
                senaryosu, CTA, hashtag ve 7 günlük paylaşım planı üret.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Aktif Şablon
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {selectedSectorLabel}
              </p>
            </div>
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
                Daha net bilgi girdiğinde sistem daha kullanışlı ve sektöre
                uygun reklam paketi üretir.
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

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Sektör Şablonu"
                    value={sectorTemplate}
                    onChange={(value) =>
                      setSectorTemplate(value as SectorTemplateKey)
                    }
                    options={sectorTemplates.map((template) => template.value)}
                    optionLabels={Object.fromEntries(
                      sectorTemplates.map((template) => [
                        template.value,
                        template.label,
                      ])
                    )}
                  />

                  <SelectField
                    label="Paket Seviyesi"
                    value={packageLevel}
                    onChange={setPackageLevel}
                    options={packageLevels}
                  />
                </div>

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

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="İçerik Tonu"
                    value={contentTone}
                    onChange={setContentTone}
                    options={contentTones}
                  />

                  <InputField
                    label="Marka Tonu"
                    value={brandTone}
                    onChange={setBrandTone}
                    placeholder="Örn: Samimi, premium, eğlenceli"
                  />
                </div>

                <InputField
                  label="Öne Çıkan Ürün / Hizmet"
                  value={mainProduct}
                  onChange={setMainProduct}
                  placeholder="Örn: Serpme kahvaltı, yeni sezon elbise, cilt bakımı"
                />

                <InputField
                  label="Müşterinin Problemi"
                  value={customerProblem}
                  onChange={setCustomerProblem}
                  placeholder="Örn: Hafta sonu gidecek kaliteli bir mekân bulamamak"
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
                  placeholder="Örn: Hafta sonuna özel serpme kahvaltı"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Bütçe"
                    value={budget}
                    onChange={setBudget}
                    placeholder="Örn: 1.500 TL / 7 gün"
                  />

                  <InputField
                    label="İletişim Çağrısı"
                    value={contactAction}
                    onChange={setContactAction}
                    placeholder="Örn: DM’den bilgi al, rezervasyon için ara"
                  />
                </div>

                <button
                  onClick={generatePackage}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
                >
                  Profesyonel Reklam Paketi Oluştur
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
                  <div className="max-h-[820px] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-slate-200">
                    {generatedOutput}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[560px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-2xl">
                    ✺
                  </div>

                  <h3 className="text-2xl font-bold">
                    Henüz reklam paketi oluşturulmadı
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                    Sektör şablonunu seç, işletme bilgilerini doldur ve
                    profesyonel reklam paketini oluştur.
                  </p>

                  <div className="mt-6 grid w-full max-w-md gap-3 text-left">
                    <Hint text="Restoran/kafe için lezzet ve mekân deneyimi öne çıkarılır." />
                    <Hint text="Butik için kombin, stil ve yeni sezon dili kullanılır." />
                    <Hint text="Güzellik merkezi için bakım, güven ve randevu odağı kurulur." />
                  </div>
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
  optionLabels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
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
            {optionLabels?.[option] || option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-400">
      {text}
    </div>
  );
}