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
  phone: string | null;
  notes: string | null;
};

const messageTypes = [
  "Fiyat sorusu",
  "Konum sorusu",
  "Randevu / rezervasyon isteği",
  "Kararsız müşteri",
  "Ürün / hizmet detayı sorusu",
  "WhatsApp’a yönlendirme",
  "Olumsuz yorum / şikayet",
  "Genel bilgi talebi",
];

const channels = [
  "Instagram DM",
  "Instagram Yorum",
  "WhatsApp",
  "Facebook Mesaj",
  "TikTok Yorum",
  "Genel Mesaj",
];

const responseTones = [
  "Samimi ve güven veren",
  "Kısa ve net",
  "Premium ve profesyonel",
  "Satış odaklı",
  "Sakin ve çözüm odaklı",
];

export default function MessageToCustomerPage() {
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
  const [phone, setPhone] = useState("");

  const [channel, setChannel] = useState("Instagram DM");
  const [messageType, setMessageType] = useState("Fiyat sorusu");
  const [responseTone, setResponseTone] = useState("Samimi ve güven veren");
  const [customerMessage, setCustomerMessage] = useState("");
  const [offer, setOffer] = useState("");
  const [contactAction, setContactAction] = useState("DM’den bilgi al");

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserAndProfiles();
  }, []);

  const whatsappLink = useMemo(() => {
    if (!phone.trim() || !generatedOutput) return "";

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone) return "";

    const message = encodeURIComponent(
      `Merhaba, ${businessName} hakkında bilgi almak istiyorum.`
    );

    return `https://wa.me/${cleanPhone}?text=${message}`;
  }, [phone, generatedOutput, businessName]);

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
        "id, business_name, sector, city, target_audience, brand_tone, instagram, phone, notes"
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
    setPhone(selectedProfile.phone || "");
  }

  function generateReplyPackage() {
    if (!businessName.trim()) {
      alert("Lütfen işletme adını gir.");
      return;
    }

    const context = {
      businessName: businessName.trim(),
      sector: sector.trim() || "yerel işletme",
      city: city.trim() || "bulunduğunuz bölge",
      targetAudience: targetAudience.trim() || "potansiyel müşteriler",
      brandTone: brandTone.trim() || responseTone,
      channel,
      messageType,
      responseTone,
      customerMessage:
        customerMessage.trim() ||
        "Müşteri bilgi almak istiyor ancak net detay vermemiş.",
      offer: offer.trim() || "öne çıkan ürün / hizmet",
      contactAction: contactAction.trim() || "detaylı bilgi için mesaj gönder",
      phone: phone.trim() || "belirtilmedi",
    };

    const playbook = getMessagePlaybook(context.messageType);

    const output = `# ${context.businessName} — Mesajdan Müşteriye Cevap Paketi

## 1. Mesaj Analizi

İşletme: ${context.businessName}
Sektör: ${context.sector}
Şehir / Bölge: ${context.city}
Kanal: ${context.channel}
Mesaj Türü: ${context.messageType}
Cevap Tonu: ${context.responseTone}
Hedef Kitle: ${context.targetAudience}
Marka Tonu: ${context.brandTone}
Öne Çıkan Ürün / Hizmet: ${context.offer}
İletişim Çağrısı: ${context.contactAction}

Müşterinin yazdığı mesaj:
"${context.customerMessage}"

Bu mesajda amaç:
${playbook.goal}

Dikkat edilmesi gereken nokta:
${playbook.warning}

---

## 2. Ana Cevap

Merhaba, ilginiz için teşekkür ederiz. ${context.businessName} olarak ${context.city} bölgesinde ${context.offer} konusunda size yardımcı olmaktan memnuniyet duyarız.

${playbook.mainAnswer}

Size en doğru bilgiyi verebilmemiz için birkaç kısa detay paylaşabilir misiniz?

${playbook.infoRequest}

${context.contactAction} üzerinden hemen yardımcı olabiliriz.

---

## 3. Kısa ve Hızlı Cevap

Merhaba, tabii ki yardımcı olalım. ${playbook.shortAnswer} Detaylı bilgi için bize mesaj bırakabilirsiniz.

---

## 4. Daha Samimi Cevap

Merhaba 😊 İlginiz için çok teşekkür ederiz. ${context.businessName} olarak ${context.offer} konusunda size en uygun seçeneği önermek isteriz.

${playbook.warmAnswer}

İsterseniz bize birkaç detay yazın, size hemen yardımcı olalım.

---

## 5. Satış / Randevuya Yönlendiren Cevap

Merhaba, ${context.offer} hakkında bilgi almak istediğinizi gördük. Size en uygun seçeneği hızlıca iletebilmemiz için ${playbook.infoRequest.toLowerCase()}

Uygunsa şimdi yardımcı olabiliriz. ${context.contactAction}.

---

## 6. Kararsız Müşteri Takip Mesajı

Merhaba, daha önce ${context.businessName} hakkında bilgi almak istemiştiniz. Size yardımcı olabileceğimiz bir konu var mı?

${context.offer} hakkında güncel bilgi, uygun saat veya detay paylaşmamızı isterseniz hemen yardımcı olabiliriz.

---

## 7. Yorum Cevabı

Merhaba, ilginiz için teşekkür ederiz. Detaylı bilgi verebilmemiz için bize DM üzerinden ulaşabilirsiniz. ${context.businessName} olarak yardımcı olmaktan memnuniyet duyarız.

---

## 8. WhatsApp Yönlendirme Metni

Merhaba, daha hızlı yardımcı olabilmemiz için bize WhatsApp üzerinden yazabilirsiniz.

WhatsApp mesaj önerisi:
"Merhaba, ${context.businessName} hakkında bilgi almak istiyorum. ${context.offer} ile ilgili detay paylaşabilir misiniz?"

Telefon / WhatsApp:
${context.phone}

---

## 9. Olumsuz Yorum veya Şikayet İçin Güvenli Cevap

Merhaba, yaşadığınız durum için üzgünüz. Konuyu daha net anlayıp size doğru şekilde yardımcı olabilmemiz için bize özel mesaj üzerinden ulaşabilir misiniz?

${context.businessName} olarak memnuniyetinizi önemsiyoruz ve çözüm için yardımcı olmak isteriz.

---

## 10. İşletme Sahibine Not

Bu cevaplar otomatik gönderimden önce kontrol edilmelidir. Özellikle fiyat, şikayet, iade, iptal, sağlık, hukuki veya hassas konularda işletme sahibinin onayı olmadan otomatik cevap verilmemelidir.

Önerilen kullanım:
1. Uygun cevabı seç.
2. Müşterinin mesajına göre küçük düzenleme yap.
3. Kopyala ve ilgili kanala yapıştır.
4. Kararsız müşterilere 24 saat sonra takip mesajı gönder.`;

    setGeneratedOutput(output);
  }

  function getMessagePlaybook(type: string) {
    if (type === "Fiyat sorusu") {
      return {
        goal: "Müşteriye fiyat bilgisini doğrudan vermeden önce ihtiyacı netleştirmek ve konuşmayı satışa çevirmek.",
        warning:
          "Tek fiyat yazıp konuşmayı bitirmek yerine kişi sayısı, tarih, hizmet türü veya ürün seçeneği sorulmalı.",
        mainAnswer:
          "Fiyat bilgisi tercih edilen ürün, hizmet, kişi sayısı veya tarih gibi detaylara göre değişebilir.",
        shortAnswer:
          "Fiyat bilgisi için birkaç kısa detay almamız yeterli.",
        warmAnswer:
          "Size yanlış bilgi vermemek için ihtiyacınıza göre en doğru seçeneği birlikte belirleyelim.",
        infoRequest:
          "Kişi sayısı, istediğiniz hizmet/ürün ve tercih ettiğiniz tarih/saat bilgisini paylaşabilir misiniz?",
      };
    }

    if (type === "Konum sorusu") {
      return {
        goal: "Müşteriye konumu net anlatmak ve işletmeye ziyaret ya da iletişim aksiyonu aldırmak.",
        warning:
          "Sadece adres yazmak yerine konum tarifi, ulaşım kolaylığı ve iletişim çağrısı eklenmeli.",
        mainAnswer:
          "Konum bilgimizi sizinle paylaşabiliriz. Gelmeden önce uygunluk veya detay almak isterseniz mesaj üzerinden yardımcı olabiliriz.",
        shortAnswer:
          "Konum bilgimizi hemen paylaşabiliriz.",
        warmAnswer:
          "Bizi kolayca bulabilmeniz için konum ve kısa tarif konusunda yardımcı olalım.",
        infoRequest:
          "Hangi bölgeden geleceğinizi yazarsanız size daha kolay tarif edebiliriz.",
      };
    }

    if (type === "Randevu / rezervasyon isteği") {
      return {
        goal: "Müşteriden tarih, saat ve kişi/hizmet bilgisi alarak randevu veya rezervasyon sürecini başlatmak.",
        warning:
          "Net uygunluk kontrolü yapmadan kesin onay verilmemeli.",
        mainAnswer:
          "Randevu veya rezervasyon için size yardımcı olabiliriz. Uygunluğu kontrol edebilmemiz için birkaç bilgiye ihtiyacımız var.",
        shortAnswer:
          "Randevu/rezervasyon için tarih ve saat bilgisini paylaşmanız yeterli.",
        warmAnswer:
          "Memnuniyetle yardımcı oluruz. Size en uygun saati birlikte belirleyebiliriz.",
        infoRequest:
          "Gelmek istediğiniz gün, saat ve kişi sayısını/hizmet türünü paylaşabilir misiniz?",
      };
    }

    if (type === "Kararsız müşteri") {
      return {
        goal: "Kararsız müşterinin güvenini artırmak ve karar vermesini kolaylaştırmak.",
        warning:
          "Baskıcı satış dili yerine güven veren, seçenek sunan ve yardımcı olan bir dil kullanılmalı.",
        mainAnswer:
          "Karar vermenizi kolaylaştırmak için size en uygun seçenekleri kısaca özetleyebiliriz.",
        shortAnswer:
          "Size en uygun seçeneği birlikte belirleyebiliriz.",
        warmAnswer:
          "Hiç sorun değil, karar vermeden önce merak ettiğiniz tüm detayları açıklayabiliriz.",
        infoRequest:
          "Önceliğiniz fiyat, kalite, zaman, konum veya hizmet detayı mı?",
      };
    }

    if (type === "Olumsuz yorum / şikayet") {
      return {
        goal: "Müşteriyi sakinleştirmek, konuyu özel mesaja almak ve çözüm odaklı yaklaşmak.",
        warning:
          "Savunmacı, suçlayıcı veya tartışmaya açık bir dil kullanılmamalı.",
        mainAnswer:
          "Yaşadığınız durum için üzgünüz. Konuyu daha net anlayıp çözüm sunabilmemiz için sizinle özelden iletişime geçmek isteriz.",
        shortAnswer:
          "Üzgünüz, konuyu çözmek için size özelden yardımcı olmak isteriz.",
        warmAnswer:
          "Geri bildiriminiz bizim için değerli. Size daha iyi yardımcı olabilmemiz için durumu detaylıca dinlemek isteriz.",
        infoRequest:
          "Sipariş/hizmet tarihi ve yaşadığınız durumu kısaca özel mesajdan paylaşabilir misiniz?",
      };
    }

    if (type === "WhatsApp’a yönlendirme") {
      return {
        goal: "Müşteriyi daha hızlı iletişim kurulabilecek WhatsApp kanalına yönlendirmek.",
        warning:
          "WhatsApp’a yönlendirirken müşteriye neden daha hızlı yardımcı olunacağı açıklanmalı.",
        mainAnswer:
          "Size daha hızlı ve detaylı yardımcı olabilmemiz için WhatsApp üzerinden iletişime geçebilirsiniz.",
        shortAnswer:
          "WhatsApp üzerinden daha hızlı yardımcı olabiliriz.",
        warmAnswer:
          "Dilerseniz WhatsApp üzerinden yazın, size daha hızlı dönüş sağlayalım.",
        infoRequest:
          "WhatsApp’tan yazarken hangi ürün/hizmet için bilgi istediğinizi belirtmeniz yeterli.",
      };
    }

    return {
      goal: "Müşterinin ilgisini kaybetmeden net bilgi vermek ve konuşmayı aksiyona dönüştürmek.",
      warning:
        "Cevap kısa, anlaşılır, güven veren ve aksiyona yönlendiren yapıda olmalı.",
      mainAnswer:
        "Merak ettiğiniz konuda size yardımcı olabiliriz. İhtiyacınıza göre en doğru bilgiyi paylaşalım.",
      shortAnswer:
        "Detaylı bilgi için size hemen yardımcı olabiliriz.",
      warmAnswer:
        "İlginiz için teşekkür ederiz. Merak ettiğiniz tüm detaylarda yardımcı olmaktan memnuniyet duyarız.",
      infoRequest:
        "Hangi ürün/hizmet hakkında bilgi almak istediğinizi paylaşabilir misiniz?",
    };
  }

  async function copyOutput() {
    if (!generatedOutput) {
      alert("Önce cevap paketi oluşturmalısın.");
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedOutput);
      alert("Cevap paketi kopyalandı.");
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
      alert("Önce cevap paketi oluşturmalısın.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("campaigns").insert({
      business_name: businessName,
      sector,
      city,
      goal: "Mesajdan Müşteriye cevap akışı",
      budget: "",
      platform: channel,
      output: generatedOutput,
      user_id: userId,
      is_archived: false,
      archived_at: null,
    });

    if (error) {
      console.error(error);
      alert("Cevap paketi kaydedilemedi.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    alert("Cevap paketi geçmiş kampanyalara kaydedildi.");
    router.push("/gecmis-kampanyalar");
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
                Reklamdan Gelen İlgiyi Müşteriye Çevir
              </p>

              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                Mesajdan Müşteriye
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Instagram DM, WhatsApp, yorum ve fiyat sorularına verilecek
                profesyonel cevap akışlarını oluştur. Şimdilik kopyala-kullan
                mantığıyla çalışır; ileride resmi sosyal medya entegrasyonuna
                hazırdır.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                MVP Modu
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Onaylı Cevap Asistanı
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
              <h2 className="text-2xl font-bold">Mesaj Bilgileri</h2>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                İşletme ve müşteri mesajı ne kadar net girilirse cevap akışı o
                kadar kullanışlı olur.
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
                    placeholder="Örn: Restoran, güzellik merkezi, butik"
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
                  placeholder="Örn: Aileler, gençler, yerel müşteriler"
                />

                <InputField
                  label="Marka Tonu"
                  value={brandTone}
                  onChange={setBrandTone}
                  placeholder="Örn: Samimi, güven veren, premium"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Mesaj Kanalı"
                    value={channel}
                    onChange={setChannel}
                    options={channels}
                  />

                  <SelectField
                    label="Mesaj Türü"
                    value={messageType}
                    onChange={setMessageType}
                    options={messageTypes}
                  />
                </div>

                <SelectField
                  label="Cevap Tonu"
                  value={responseTone}
                  onChange={setResponseTone}
                  options={responseTones}
                />

                <TextareaField
                  label="Müşterinin Yazdığı Mesaj"
                  value={customerMessage}
                  onChange={setCustomerMessage}
                  placeholder="Örn: Fiyat alabilir miyim? Yeriniz nerede? Rezervasyon gerekiyor mu?"
                />

                <InputField
                  label="Öne Çıkan Ürün / Hizmet"
                  value={offer}
                  onChange={setOffer}
                  placeholder="Örn: Serpme kahvaltı, cilt bakımı, yeni sezon ürünler"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Telefon / WhatsApp"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Örn: 905xxxxxxxxx"
                  />

                  <InputField
                    label="İletişim Çağrısı"
                    value={contactAction}
                    onChange={setContactAction}
                    placeholder="Örn: DM’den bilgi al, WhatsApp’tan yaz"
                  />
                </div>

                <button
                  onClick={generateReplyPackage}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
                >
                  Cevap Paketi Oluştur
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Hazır Cevap Akışı
                  </p>

                  <h2 className="mt-3 text-2xl font-black">
                    Oluşturulan Cevap Paketi
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyOutput}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    Kopyala
                  </button>

                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
                    >
                      WhatsApp Aç
                    </a>
                  )}

                  <button
                    onClick={saveAsCampaign}
                    disabled={isSaving}
                    className="rounded-2xl border border-purple-400/20 bg-purple-400/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Kaydediliyor..." : "Geçmişe Kaydet"}
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
                    💬
                  </div>

                  <h3 className="text-2xl font-bold">
                    Henüz cevap paketi oluşturulmadı
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                    Müşteri mesajını ve işletme bilgilerini gir. AdMind-Ai sana
                    DM, yorum, WhatsApp ve takip mesajları için hazır cevap
                    akışı oluştursun.
                  </p>

                  <div className="mt-6 grid w-full max-w-md gap-3 text-left">
                    <Hint text="Fiyat soran müşteriyi direkt kaybetmeden detay almaya yönlendirir." />
                    <Hint text="Kararsız müşteriye baskı kurmadan güven veren takip mesajı üretir." />
                    <Hint text="Olumsuz yorumlarda tartışmaya girmeden çözüm odaklı cevap verir." />
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

function TextareaField({
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

function Hint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-6 text-slate-400">
      {text}
    </div>
  );
}