"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

type Campaign = {
  id: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  goal: string | null;
  platform: string | null;
  output: string | null;
  created_at: string;
};

type SavedVisual = {
  id: string;
  created_at: string;
  business_name: string;
  visual_type: string;
  visual_style: string;
  headline: string | null;
  cta: string | null;
};

const visualTypes = [
  "Instagram Post (1080x1350)",
  "Kare Post (1080x1080)",
  "Story (1080x1920)",
  "Reels Kapağı",
  "Reklam Afişi",
];

const visualStyles = [
  "Modern",
  "Premium",
  "Samimi",
  "Minimal",
  "Dikkat çekici",
  "Kurumsal",
];

const colorModes = [
  "Marka renkleri",
  "Sıcak tonlar",
  "Koyu premium",
  "Canlı kampanya renkleri",
  "Doğal ve soft",
];

export default function VisualStudioPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [savedVisuals, setSavedVisuals] = useState<SavedVisual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [platform, setPlatform] = useState("");
  const [campaignOutput, setCampaignOutput] = useState("");

  const [visualType, setVisualType] = useState("Instagram Post (1080x1350)");
  const [visualStyle, setVisualStyle] = useState("Modern");
  const [colorMode, setColorMode] = useState("Marka renkleri");
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("Detaylı bilgi için hemen mesaj gönder.");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
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

    const { data: campaignData, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, business_name, sector, city, goal, platform, output, created_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (campaignError) {
      console.error(campaignError);
      alert("Kampanyalar yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    const { data: visualData, error: visualError } = await supabase
      .from("campaign_visuals")
      .select("id, created_at, business_name, visual_type, visual_style, headline, cta")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    if (visualError) {
      console.error(visualError);
      alert("Kaydedilen görseller yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    setCampaigns(campaignData || []);
    setSavedVisuals(visualData || []);
    setIsLoading(false);
  }

  function selectCampaign(campaignId: string) {
    setSelectedCampaignId(campaignId);

    const campaign = campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;

    setBusinessName(campaign.business_name || "");
    setSector(campaign.sector || "");
    setCity(campaign.city || "");
    setCampaignGoal(campaign.goal || "");
    setPlatform(campaign.platform || "");
    setCampaignOutput(campaign.output || "");

    if (!headline.trim()) {
      setHeadline(generateHeadline(campaign.business_name || "", campaign.goal || ""));
    }
  }

  const visualBrief = useMemo(() => {
    const safeBusiness = businessName || "İşletme";
    const safeSector = sector || "genel işletme";
    const safeCity = city || "yerel bölge";
    const safeGoal = campaignGoal || "müşteri ilgisi oluşturma";
    const safePlatform = platform || "sosyal medya";
    const safeHeadline = headline || `${safeBusiness} için dikkat çekici kampanya görseli`;
    const safeSubheadline =
      subheadline ||
      `${safeBusiness} için ${safeGoal} odaklı, dikkat çekici ve dönüşüm amaçlı bir sosyal medya görseli.`;
    const safeCta = cta || "Detaylı bilgi için hemen mesaj gönder.";
    const safeCampaignOutput =
      campaignOutput ||
      "Kampanya çıktısı belirtilmedi. İşletme değer önerisine uygun yaratıcı yapı kurulmalı.";
    const safeNotes = notes || "Ek not belirtilmedi.";

    const brief = `# ${safeBusiness} — Görsel Brief

İşletme: ${safeBusiness}
Sektör: ${safeSector}
Şehir: ${safeCity}
Kampanya Hedefi: ${safeGoal}
Platform: ${safePlatform}

Görsel Tipi: ${visualType}
Görsel Stili: ${visualStyle}
Renk Kullanımı: ${colorMode}

Ana Başlık:
${safeHeadline}

Alt Başlık:
${safeSubheadline}

CTA:
${safeCta}

Kampanya Çıktısından Alınan İçgörü:
${safeCampaignOutput}

Ek Not:
${safeNotes}

Beklenen Sonuç:
Bu görsel, kullanıcının dikkatini hızlıca çekmeli, kampanyanın ana mesajını sade biçimde vermeli ve kullanıcıyı mesaj atma / bilgi alma / rezervasyon aksiyonuna yönlendirmelidir.`;

    return brief;
  }, [
    businessName,
    sector,
    city,
    campaignGoal,
    platform,
    visualType,
    visualStyle,
    colorMode,
    headline,
    subheadline,
    cta,
    campaignOutput,
    notes,
  ]);

  const generatedPrompt = useMemo(() => {
    const safeBusiness = businessName || "İşletme";
    const safeSector = sector || "genel işletme";
    const safeCity = city || "yerel bölge";
    const safeGoal = campaignGoal || "müşteri ilgisi oluşturma";
    const safePlatform = platform || "sosyal medya";
    const safeHeadline = headline || `${safeBusiness} için dikkat çekici kampanya görseli`;
    const safeSubheadline =
      subheadline ||
      `${safeBusiness} için ${safeGoal} odaklı sosyal medya tanıtım görseli`;
    const safeCta = cta || "Detaylı bilgi için hemen mesaj gönder.";
    const safeCampaignOutput = summarizeOutput(campaignOutput);

    return `Profesyonel bir sosyal medya grafik tasarımcısı gibi davran. ${safeBusiness} adlı işletme için ${visualType} formatında reklam görseli tasarla. Stil: ${visualStyle}. Renk yaklaşımı: ${colorMode}. Sektör: ${safeSector}. Şehir/Bölge: ${safeCity}. Kampanya hedefi: ${safeGoal}. Platform: ${safePlatform}. Görselde ana mesaj güçlü ve okunaklı olmalı. Başlık: "${safeHeadline}" Alt başlık: "${safeSubheadline}" CTA: "${safeCta}" Görsel; temiz kompozisyonlu, reklam odaklı, dikkat çekici, profesyonel ve modern olmalı. Kampanya içeriği şu unsurları vurgulasın: ${safeCampaignOutput}. Görselde marka hissi güçlü olmalı, dönüşüm odaklı bir tasarım dili kullanılmalı.`;
  }, [
    businessName,
    sector,
    city,
    campaignGoal,
    platform,
    visualType,
    visualStyle,
    colorMode,
    headline,
    subheadline,
    cta,
    campaignOutput,
  ]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      alert("AI görsel promptu kopyalandı.");
    } catch {
      alert("Prompt kopyalanamadı.");
    }
  }

  async function saveVisual() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    if (!businessName.trim()) {
      alert("Kaydetmek için işletme adı gerekli.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("campaign_visuals").insert({
      user_id: userId,
      campaign_id: selectedCampaignId || null,
      business_name: businessName,
      sector,
      city,
      campaign_goal: campaignGoal,
      platform,
      visual_type: visualType,
      visual_style: visualStyle,
      color_mode: colorMode,
      headline,
      subheadline,
      cta,
      prompt: generatedPrompt,
      visual_brief: visualBrief,
      notes,
    });

    if (error) {
      console.error(error);
      alert("Görsel brief kaydedilemedi.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    alert("Görsel brief kaydedildi.");
    loadPageData();
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
          <Link
            href="/"
            className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
          >
            ← Dashboard'a dön
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Kampanyaya Uygun Yapay Zekâ Görsel Briefi
              </p>

              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                Görsel Stüdyosu
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Oluşturduğun reklam kampanyasına göre sosyal medya görsel briefi
                ve AI promptu üret. Bu yapı, ileride gerçek görsel üretim
                entegrasyonu için hazır altyapı sağlar.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                MVP Modu
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Brief + Prompt Üretimi
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Görsel stüdyosu hazırlanıyor...</p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="text-2xl font-black">Görsel Ayarları</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Kampanyanı seç, görsel tipini ve stilini belirle. Sistem sana
                otomatik görsel briefi ve AI promptu oluştursun.
              </p>

              <div className="mt-6 grid gap-5">
                {campaigns.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Kampanya Seç
                    </label>

                    <select
                      value={selectedCampaignId}
                      onChange={(event) => selectCampaign(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 focus:ring-4"
                    >
                      <option value="">Manuel bilgi gir</option>

                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.business_name} — {campaign.goal || "Kampanya"}
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
                    placeholder="Örn: Restoran / Kafe"
                  />

                  <InputField
                    label="Şehir / Bölge"
                    value={city}
                    onChange={setCity}
                    placeholder="Örn: Aydın / Efeler"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Kampanya Hedefi"
                    value={campaignGoal}
                    onChange={setCampaignGoal}
                    placeholder="Örn: Rezervasyon / mesaj alma"
                  />

                  <InputField
                    label="Platform"
                    value={platform}
                    onChange={setPlatform}
                    placeholder="Örn: Instagram"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Görsel Tipi"
                    value={visualType}
                    onChange={setVisualType}
                    options={visualTypes}
                  />

                  <SelectField
                    label="Görsel Stili"
                    value={visualStyle}
                    onChange={setVisualStyle}
                    options={visualStyles}
                  />
                </div>

                <SelectField
                  label="Renk Kullanımı"
                  value={colorMode}
                  onChange={setColorMode}
                  options={colorModes}
                />

                <InputField
                  label="Ana Başlık"
                  value={headline}
                  onChange={setHeadline}
                  placeholder="Örn: Hafta içi rotanı belirle"
                />

                <InputField
                  label="Alt Başlık"
                  value={subheadline}
                  onChange={setSubheadline}
                  placeholder="Örn: Doğa içinde keyifli kahvaltı ve huzurlu ortam"
                />

                <InputField
                  label="CTA"
                  value={cta}
                  onChange={setCta}
                  placeholder="Örn: Hemen mesaj gönder"
                />

                <TextAreaField
                  label="Kampanya Çıktısı / İçerik Özeti"
                  value={campaignOutput}
                  onChange={setCampaignOutput}
                  placeholder="Reklam paketi çıktısından önemli mesajları buraya yazabilir veya kampanya seçince otomatik dolmasını kullanabilirsin."
                />

                <TextAreaField
                  label="Ek Not"
                  value={notes}
                  onChange={setNotes}
                  placeholder="Örn: Görselde doğa hissi olsun, aile dostu atmosfer vurgulansın."
                />

                <button
                  onClick={saveVisual}
                  disabled={isSaving}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Kaydediliyor..." : "Görsel Briefini Kaydet"}
                </button>
              </div>
            </section>

            <section className="grid gap-8">
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                      Otomatik Görsel Briefi
                    </p>
                    <h2 className="mt-2 text-2xl font-black">Kampanya Görsel Özeti</h2>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    {visualBrief}
                  </div>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-purple-300">
                      AI Görsel Promptu
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Yapay Zekâya Hazır Prompt
                    </h2>
                  </div>

                  <button
                    onClick={copyPrompt}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    Promptu Kopyala
                  </button>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    {generatedPrompt}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-sm font-black text-emerald-200">
                    Sonraki Aşama
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Bu prompt altyapısı hazırlandıktan sonra gerçek AI görsel
                    üretim entegrasyonu bağlanabilir. Böylece kullanıcı doğrudan
                    panel içinde görsel de üretebilir.
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Son Kayıtlar
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Kaydedilen Görsel Briefleri</h2>
                </div>

                {savedVisuals.length === 0 ? (
                  <p className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                    Henüz kayıtlı görsel briefi yok.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedVisuals.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-black text-white">
                              {item.business_name}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDate(item.created_at)}
                            </p>
                          </div>

                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                            {item.visual_style}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-400">
                          {item.visual_type}
                        </p>

                        {item.headline && (
                          <p className="mt-3 text-sm font-semibold text-slate-200">
                            {item.headline}
                          </p>
                        )}

                        {item.cta && (
                          <p className="mt-2 text-xs text-emerald-300">
                            CTA: {item.cta}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
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

function TextAreaField({
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
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

function summarizeOutput(value: string) {
  if (!value?.trim()) return "kampanya ana mesajına uygun modern ve dönüşüm odaklı tasarım";
  return value.length > 500 ? `${value.slice(0, 500)}...` : value;
}

function generateHeadline(businessName: string, goal: string) {
  if (!businessName && !goal) return "";
  if (!goal) return `${businessName} için dikkat çekici kampanya görseli`;
  return `${businessName} — ${goal}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}