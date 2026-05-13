type CustomerConversionRadarProps = {
  messageType: string;
  channel: string;
  customerName?: string;
  customerContact?: string;
  customerMessage?: string;
};

type RadarProfile = {
  intent: string;
  temperature: string;
  score: number;
  risk: string;
  strategy: string;
  nextAction: string;
  signalLabel: string;
};

export function CustomerConversionRadar({
  messageType,
  channel,
  customerName,
  customerContact,
  customerMessage,
}: CustomerConversionRadarProps) {
  const profile = getRadarProfile(messageType, customerMessage);
  const scoreWidth = `${profile.score}%`;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/10 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/25 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%)]" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
            Müşteri Dönüşüm Radarı
          </p>

          <h3 className="mt-1 text-xl font-black tracking-tight text-white">
            Müşteri Niyeti Analizi
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Gelen mesajın satın alma sinyalini, fırsat sıcaklığını ve önerilen
            cevap stratejisini analiz eder.
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          LIVE
        </div>
      </div>

      <div className="relative grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-48">
            <div className="absolute inset-0 rounded-full border border-cyan-300/15" />
            <div className="absolute inset-5 rounded-full border border-cyan-300/10" />
            <div className="absolute inset-10 rounded-full border border-purple-300/10" />

            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-300/10" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-300/10" />

            <div className="absolute inset-0 animate-[spin_5s_linear_infinite] rounded-full">
              <div className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-cyan-300/80 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
            </div>

            <div className="absolute left-[65%] top-[28%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.95)]">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300 opacity-60" />
            </div>

            <div className="absolute bottom-[27%] left-[30%] h-2.5 w-2.5 rounded-full bg-purple-300 shadow-[0_0_18px_rgba(216,180,254,0.9)]">
              <span className="absolute inset-0 animate-ping rounded-full bg-purple-300 opacity-50 [animation-delay:700ms]" />
            </div>

            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-500 shadow-[0_0_45px_rgba(59,130,246,0.55)]">
              <div className="h-8 w-8 rounded-full border border-white/30 bg-white/15 backdrop-blur-xl" />
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-bold text-cyan-200">
              {profile.signalLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Dönüşüm Skoru
              </p>
              <p className="text-sm font-black text-cyan-200">
                {profile.score}/100
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                style={{ width: scoreWidth }}
              >
                <div className="absolute inset-0 animate-pulse bg-white/25" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBox label="Niyet" value={profile.intent} tone="cyan" />
            <InfoBox label="Sıcaklık" value={profile.temperature} tone="purple" />
            <InfoBox label="Risk" value={profile.risk} tone="orange" />
            <InfoBox label="Kanal" value={channel || "Genel"} tone="blue" />
          </div>

          <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.055] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">
              Önerilen Cevap Stratejisi
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {profile.strategy}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.055] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              Sonraki Aksiyon
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {profile.nextAction}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
        <MiniSignal
          label="Müşteri"
          value={customerName?.trim() ? customerName : "Henüz girilmedi"}
        />
        <MiniSignal
          label="İletişim"
          value={customerContact?.trim() ? "Bağlantı var" : "Bekleniyor"}
        />
        <MiniSignal
          label="Mesaj Tipi"
          value={messageType || "Genel"}
        />
      </div>
    </section>
  );
}

function InfoBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "purple" | "orange" | "blue";
}) {
  const toneClass = {
    cyan: "border-cyan-300/10 bg-cyan-300/[0.055] text-cyan-200",
    purple: "border-purple-300/10 bg-purple-300/[0.055] text-purple-200",
    orange: "border-orange-300/10 bg-orange-300/[0.055] text-orange-200",
    blue: "border-blue-300/10 bg-blue-300/[0.055] text-blue-200",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-black">{value}</p>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 truncate text-xs font-bold text-slate-200">{value}</p>
    </div>
  );
}

function getRadarProfile(messageType: string, customerMessage?: string): RadarProfile {
  const normalized = `${messageType} ${customerMessage || ""}`.toLowerCase();

  if (
    normalized.includes("randevu") ||
    normalized.includes("rezervasyon") ||
    normalized.includes("yer var") ||
    normalized.includes("müsait")
  ) {
    return {
      intent: "Rezervasyon / Randevu",
      temperature: "Çok Sıcak",
      score: 92,
      risk: "Düşük",
      strategy:
        "Net bilgi ver, güven oluştur ve müşteriyi hızlıca rezervasyon veya WhatsApp aksiyonuna yönlendir.",
      nextAction: "Müşteriye kısa ve net bir takip mesajı gönder.",
      signalLabel: "HIGH INTENT",
    };
  }

  if (
    normalized.includes("fiyat") ||
    normalized.includes("ücret") ||
    normalized.includes("kaç tl") ||
    normalized.includes("ne kadar")
  ) {
    return {
      intent: "Fiyat Araştırması",
      temperature: "Sıcak",
      score: 82,
      risk: "Orta",
      strategy:
        "Fiyat bilgisini verirken değeri de anlat. Sadece fiyat söylemek yerine avantajı ve güven unsurunu vurgula.",
      nextAction: "Fiyat bilgisinden sonra WhatsApp veya rezervasyon çağrısı yap.",
      signalLabel: "PRICE SIGNAL",
    };
  }

  if (
    normalized.includes("şikayet") ||
    normalized.includes("memnun") ||
    normalized.includes("kötü") ||
    normalized.includes("sorun") ||
    normalized.includes("olumsuz")
  ) {
    return {
      intent: "Şikayet / Risk",
      temperature: "Riskli",
      score: 35,
      risk: "Yüksek",
      strategy:
        "Savunmaya geçmeden sakin, çözüm odaklı ve insan onaylı bir cevap hazırlanmalı.",
      nextAction: "Cevabı göndermeden önce işletme sahibi kontrol etmeli.",
      signalLabel: "RISK MODE",
    };
  }

  if (
    normalized.includes("kararsız") ||
    normalized.includes("bakarım") ||
    normalized.includes("düşüneyim") ||
    normalized.includes("emin değil")
  ) {
    return {
      intent: "Kararsız Müşteri",
      temperature: "Ilık",
      score: 58,
      risk: "Orta",
      strategy:
        "Müşteriye baskı yapmadan güven veren, seçenekleri sadeleştiren ve karar vermesini kolaylaştıran bir cevap sun.",
      nextAction: "Kısa bir güven mesajı ve düşük baskılı takip önerisi hazırla.",
      signalLabel: "NURTURE",
    };
  }

  if (
    normalized.includes("konum") ||
    normalized.includes("adres") ||
    normalized.includes("nerede") ||
    normalized.includes("yol")
  ) {
    return {
      intent: "Konum Bilgisi",
      temperature: "Ilık",
      score: 66,
      risk: "Düşük",
      strategy:
        "Konumu net ver, ulaşımı kolaylaştır ve mesajın sonunda müşteriyi ziyaret veya rezervasyona yönlendir.",
      nextAction: "Adres bilgisini kısa CTA ile destekle.",
      signalLabel: "LOCATION",
    };
  }

  return {
    intent: "Genel Bilgi Talebi",
    temperature: "Ilık",
    score: 62,
    risk: "Düşük",
    strategy:
      "Müşterinin sorusunu net cevapla, işletmenin avantajını ekle ve mesajı aksiyon çağrısıyla bitir.",
    nextAction: "Cevabı kopyalayıp müşteriye gönder veya fırsat olarak kaydet.",
    signalLabel: "LIVE SIGNAL",
  };
}

export default CustomerConversionRadar;