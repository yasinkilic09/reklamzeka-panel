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

type AutomationProfile = {
  status: string;
  mode: string;
  riskLabel: string;
  score: number;
  summary: string;
  recommendation: string;
  autoAllowed: boolean;
  approvalRequired: boolean;
  badgeClass: string;
  progressClass: string;
  checklist: {
    title: string;
    description: string;
    ok: boolean;
  }[];
};

function getAutomationProfile(
  messageType: string,
  channel: string
): AutomationProfile {
  const isComplaint = messageType === "Olumsuz yorum / şikayet";
  const isUndecided = messageType === "Kararsız müşteri";
  const isPublicComment =
    channel === "Instagram Yorum" || channel === "TikTok Yorum";

  if (isComplaint) {
    return {
      status: "İnsan Onayı Gerekli",
      mode: "Manuel kontrol + önerilen cevap",
      riskLabel: "Yüksek dikkat",
      score: 35,
      summary:
        "Şikayet ve olumsuz yorumlarda otomatik cevap verilmemeli. Sistem yalnızca güvenli cevap önerisi üretmeli.",
      recommendation:
        "Bu mesaj türü için işletme sahibi cevabı kontrol etmeli, gerekirse müşteriyi özel mesaja yönlendirmeli.",
      autoAllowed: false,
      approvalRequired: true,
      badgeClass:
        "border-red-400/20 bg-red-400/10 text-red-200",
      progressClass: "bg-gradient-to-r from-red-500 to-orange-500",
      checklist: [
        {
          title: "Otomatik gönderim kapalı olmalı",
          description: "Kriz, şikayet veya memnuniyetsizlik içeren mesajlarda güvenli yaklaşım gerekir.",
          ok: true,
        },
        {
          title: "İşletme sahibi onayı gerekir",
          description: "Yanlış veya savunmacı bir cevap marka algısına zarar verebilir.",
          ok: true,
        },
        {
          title: "Özel mesaja yönlendirme önerilir",
          description: "Sorun kamuya açık alanda tartışılmadan çözüm sürecine alınır.",
          ok: true,
        },
      ],
    };
  }

  if (isUndecided || isPublicComment) {
    return {
      status: "Yarı Otomatik Uygun",
      mode: "Cevap önerisi + tek tık onay",
      riskLabel: "Orta risk",
      score: 68,
      summary:
        "Bu mesajlarda otomatik taslak üretilebilir fakat gönderim öncesi kullanıcı onayı daha güvenlidir.",
      recommendation:
        "Sistem cevabı hazırlasın, işletme sahibi onayladıktan sonra gönderim yapılsın.",
      autoAllowed: false,
      approvalRequired: true,
      badgeClass:
        "border-yellow-400/20 bg-yellow-400/10 text-yellow-200",
      progressClass: "bg-gradient-to-r from-yellow-400 to-orange-500",
      checklist: [
        {
          title: "Cevap taslağı otomatik üretilebilir",
          description: "Kullanıcıya hızlı öneri sunulur.",
          ok: true,
        },
        {
          title: "Gönderim öncesi onay önerilir",
          description: "Kararsız müşteri veya herkese açık yorumlarda ton kontrolü önemlidir.",
          ok: true,
        },
        {
          title: "DM / WhatsApp yönlendirmesi kullanılabilir",
          description: "Konuşma daha satış odaklı özel kanala taşınabilir.",
          ok: true,
        },
      ],
    };
  }

  return {
    status: "Otomasyona Uygun",
    mode: "Kurala bağlı otomatik cevap adayı",
    riskLabel: "Düşük risk",
    score: 88,
    summary:
      "Fiyat, konum, randevu ve genel bilgi gibi düşük riskli mesajlarda kontrollü otomatik cevap akışı kullanılabilir.",
    recommendation:
      "İlk cevap otomatik gönderilebilir; detay, fiyat, rezervasyon veya özel durumlarda kullanıcı onayına geçilebilir.",
    autoAllowed: true,
    approvalRequired: false,
    badgeClass:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    progressClass: "bg-gradient-to-r from-emerald-400 to-cyan-500",
    checklist: [
      {
        title: "Otomatik ilk cevap uygun",
        description: "Müşteri bekletilmeden hızlı karşılama mesajı alabilir.",
        ok: true,
      },
      {
        title: "Detay sorusu ile konuşma ilerletilebilir",
        description: "Kişi sayısı, tarih, hizmet türü veya ihtiyaç bilgisi alınabilir.",
        ok: true,
      },
      {
        title: "Satış / randevu akışına bağlanabilir",
        description: "Müşteri DM veya WhatsApp üzerinden aksiyona yönlendirilir.",
        ok: true,
      },
    ],
  };
}

function getLeadProfile(messageType: string) {
  if (messageType === "Randevu / rezervasyon isteği") {
    return {
      temperature: "Sıcak",
      score: 92,
      nextAction:
        "Randevu/rezervasyon uygunluğu kontrol edilip hızlı dönüş yapılmalı.",
    };
  }

  if (
    messageType === "Fiyat sorusu" ||
    messageType === "WhatsApp’a yönlendirme"
  ) {
    return {
      temperature: "Sıcak",
      score: 82,
      nextAction:
        "Fiyat veya detay bilgisi için müşteriyle hızlıca iletişime geçilmeli.",
    };
  }

  if (messageType === "Ürün / hizmet detayı sorusu") {
    return {
      temperature: "Ilık",
      score: 68,
      nextAction:
        "Müşteriye ürün/hizmet detayı verilip karar süreci desteklenmeli.",
    };
  }

  if (messageType === "Kararsız müşteri") {
    return {
      temperature: "Ilık",
      score: 58,
      nextAction:
        "Güven veren takip mesajı ile müşteri yeniden iletişime çekilmeli.",
    };
  }

  if (messageType === "Olumsuz yorum / şikayet") {
    return {
      temperature: "Riskli",
      score: 35,
      nextAction:
        "İşletme sahibi manuel kontrol ederek çözüm odaklı dönüş yapmalı.",
    };
  }

  return {
    temperature: "Ilık",
    score: 55,
    nextAction:
      "Müşteriye kısa ve net bilgi verilip sonraki aksiyon sorulmalı.",
  };
}

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
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [isLeadSaving, setIsLeadSaving] = useState(false);
  const [contactAction, setContactAction] = useState("DM’den bilgi al");

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserAndProfiles();
  }, []);

  const customerWhatsappLink = useMemo(() => {
  if (!customerContact.trim() || !generatedOutput) return "";

  const cleanContact = normalizeWhatsAppNumber(customerContact);
  if (!cleanContact || cleanContact.length < 10) return "";

  const message = encodeURIComponent(
    `Merhaba${customerName ? ` ${customerName}` : ""}, ${businessName} olarak mesajınızla ilgili size yardımcı olmak istiyoruz.`
  );

  return `https://wa.me/${cleanContact}?text=${message}`;
}, [customerContact, generatedOutput, customerName, businessName]);

const automationProfile = useMemo(() => {
  return getAutomationProfile(messageType, channel);
}, [messageType, channel]);

const leadProfile = useMemo(() => {
  return getLeadProfile(messageType);
}, [messageType]);

function normalizeWhatsAppNumber(value: string) {
  const clean = value.replace(/[^0-9]/g, "");

  if (clean.startsWith("90") && clean.length === 12) {
    return clean;
  }

  if (clean.startsWith("0") && clean.length === 11) {
    return `9${clean}`;
  }

  if (clean.startsWith("5") && clean.length === 10) {
    return `90${clean}`;
  }

  return clean;
}

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

async function saveAsLead() {
  if (!userId) {
    router.push("/auth/login");
    return;
  }

  if (!businessName.trim()) {
    alert("Müşteri adayı kaydetmek için işletme adını gir.");
    return;
  }

  if (!customerMessage.trim() && !generatedOutput) {
    alert("Müşteri adayı kaydetmek için müşteri mesajı veya cevap paketi olmalı.");
    return;
  }

  setIsLeadSaving(true);

  const { error } = await supabase.from("customer_leads").insert({
    user_id: userId,
    business_name: businessName,
    sector,
    city,
    channel,
    message_type: messageType,
    customer_name: customerName || null,
    customer_contact: customerContact || null,
    customer_message: customerMessage || null,
    lead_status: "Yeni",
    lead_temperature: leadProfile.temperature,
    lead_score: leadProfile.score,
    next_action: leadProfile.nextAction,
    notes: "",
    generated_reply: generatedOutput || null,
  });

  if (error) {
    console.error(error);
    alert("Müşteri adayı kaydedilemedi.");
    setIsLeadSaving(false);
    return;
  }

  setIsLeadSaving(false);
  alert("Müşteri adayı Fırsat Takibi’ne kaydedildi.");
  router.push("/firsat-takibi");
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

<div className="grid gap-5 md:grid-cols-2">
  <InputField
    label="Müşteri Adı"
    value={customerName}
    onChange={setCustomerName}
    placeholder="Örn: Ayşe Hanım"
  />

  <InputField
    label="Müşteri İletişim Bilgisi"
    value={customerContact}
    onChange={setCustomerContact}
    placeholder="Örn: Instagram kullanıcı adı, telefon veya WhatsApp"
  />
</div>

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

                  {customerWhatsappLink && (
  <a
    href={customerWhatsappLink}
    target="_blank"
    rel="noreferrer"
    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
  >
    Müşteriye WhatsApp’tan Yaz
  </a>
)}

                  <button
                    onClick={saveAsCampaign}
                    disabled={isSaving}
                    className="rounded-2xl border border-purple-400/20 bg-purple-400/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Kaydediliyor..." : "Geçmişe Kaydet"}
                  </button>
                  <button
  onClick={saveAsLead}
  disabled={isLeadSaving}
  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isLeadSaving ? "Kaydediliyor..." : "Fırsat Olarak Kaydet"}
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

            <AutomationPreparationPanel
  profile={automationProfile}
  channel={channel}
  messageType={messageType}
/>
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

function AutomationPreparationPanel({
  profile,
  channel,
  messageType,
}: {
  profile: AutomationProfile;
  channel: string;
  messageType: string;
}) {
  return (
    <section className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">
            Otomasyon Hazırlık Paneli
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Bu mesaj otomatik cevaplanabilir mi?
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            Bu alan gerçek sosyal medya entegrasyonu öncesi karar motoru gibi
            çalışır. Mesaj türüne ve kanala göre otomatik cevap, onaylı gönderim
            veya insan kontrolü önerir.
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${profile.badgeClass}`}
        >
          {profile.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Otomasyon Uygunluk Skoru
          </p>

          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-5xl font-black text-white">
              {profile.score}
              <span className="text-xl text-slate-500">/100</span>
            </p>

            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {profile.riskLabel}
            </p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-900">
            <div
              className={`h-full rounded-full ${profile.progressClass}`}
              style={{ width: `${profile.score}%` }}
            />
          </div>

          <div className="mt-6 grid gap-4">
            <InfoBox label="Kanal" value={channel} />
            <InfoBox label="Mesaj Türü" value={messageType} />
            <InfoBox label="Önerilen Mod" value={profile.mode} />
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
            <h3 className="text-xl font-black text-white">Sistem Kararı</h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {profile.summary}
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm font-bold text-cyan-200">Öneri</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {profile.recommendation}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {profile.checklist.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AutomationStep
          number="1"
          title="Mesajı Al"
          description="Instagram, WhatsApp veya yorum kanalı mesajı sisteme düşer."
        />

        <AutomationStep
          number="2"
          title="Sınıflandır"
          description="Mesaj fiyat, konum, randevu, şikayet veya genel bilgi olarak ayrılır."
        />

        <AutomationStep
          number="3"
          title="Cevap Üret"
          description="İşletme profiline göre uygun cevap akışı hazırlanır."
        />

        <AutomationStep
          number="4"
          title={
            profile.autoAllowed
              ? "Otomatik / Onaylı Gönder"
              : "Onayla ve Gönder"
          }
          description={
            profile.autoAllowed
              ? "Düşük riskli mesajlarda otomatik cevap, diğerlerinde onaylı gönderim uygulanır."
              : "Riskli mesajlarda işletme sahibinin kontrolü olmadan gönderim yapılmaz."
          }
        />
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-purple-400/20 bg-purple-400/10 p-5">
        <p className="text-sm font-black text-purple-200">
          Gelecek Entegrasyon Notu
        </p>

        <p className="mt-3 text-sm leading-7 text-slate-300">
          Bu panel şu an otomatik gönderim yapmaz. İleride resmi Instagram /
          WhatsApp entegrasyonu eklendiğinde bu karar mantığı; otomatik cevap,
          onaylı cevap ve insan müdahalesi gerektiren mesajları ayırmak için
          kullanılabilir.
        </p>
      </div>
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}

function AutomationStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-sm font-black text-white">
        {number}
      </div>

      <h3 className="text-base font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}