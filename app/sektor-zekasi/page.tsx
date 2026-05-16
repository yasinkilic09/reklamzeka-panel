"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const sectors = [
  "Restoran / Kafe",
  "Butik / Mağaza",
  "Güzellik / Bakım Merkezi",
  "Emlak / Gayrimenkul",
  "Eğitim / Kurs",
  "Yerel Hizmet İşletmesi",
];

const platforms = ["Instagram", "TikTok", "Facebook", "Google", "WhatsApp"];

type SectorProfile = {
  language: string;
  strongestCtas: string[];
  visualStrategy: string;
  messageStrategy: string;
  riskWarnings: string[];
  benchmark: {
    conversionSignal: number;
    messagePotential: number;
    creativeDemand: number;
  };
  learningNote: string;
  adAngles: string[];
};

const sectorProfiles: Record<string, SectorProfile> = {
  "Restoran / Kafe": {
    language:
      "Lezzet, ortam, tazelik, aile/arkadaş buluşması ve sınırlı zaman vurgusu güçlü çalışır.",
    strongestCtas: [
      "Rezervasyon için hemen yaz",
      "Bugünkü menüyü görmek için DM at",
      "Konum almak için mesaj gönder",
    ],
    visualStrategy:
      "Yakın plan ürün görüntüleri, masa atmosferi, sıcak ışık, gerçek müşteri deneyimi ve kısa Reels kesitleri öne çıkarılmalı.",
    messageStrategy:
      "Fiyat sorularında sadece ücret değil, deneyim ve içerik değeri vurgulanmalı. Rezervasyon mesajları hızlı ve net cevaplanmalı.",
    riskWarnings: [
      "Aşırı abartılı lezzet iddiaları güveni düşürebilir.",
      "Net fiyat/kişi bilgisi verilmezse mesaj dönüşümü zayıflar.",
      "Stokta veya menüde olmayan ürün görselleri kullanılmamalı.",
    ],
    benchmark: {
      conversionSignal: 86,
      messagePotential: 91,
      creativeDemand: 78,
    },
    learningNote:
      "Restoran/kafe sektöründe kahvaltı, serpme menü, sınırsız çay, rezervasyon ve konum CTA kombinasyonu yüksek mesaj potansiyeli taşır.",
    adAngles: [
      "Hafta içi sakin kahvaltı rotası",
      "Aile ve arkadaş grupları için masa deneyimi",
      "Doğal ortam + yerel lezzet vurgusu",
    ],
  },
  "Butik / Mağaza": {
    language:
      "Yeni sezon, sınırlı stok, kombin önerisi, tarz ve kişisel stil vurgusu etkili olur.",
    strongestCtas: [
      "Stok sormak için DM at",
      "Kombin önerisi için yaz",
      "Yeni ürünleri görmek için takip et",
    ],
    visualStrategy:
      "Model üzerinde ürün, yakın detay çekimleri, 4:5 post ve kısa ürün geçiş videoları kullanılmalı.",
    messageStrategy:
      "Müşteri kararsızsa ürünün kullanım alanı, kombin kolaylığı ve sınırlı stok bilgisiyle karar desteklenmeli.",
    riskWarnings: [
      "Aşırı filtreli ürün görselleri iade/güven sorununa neden olabilir.",
      "Stok bilgisi güncel tutulmalı.",
      "Net beden/renk bilgisi verilmezse DM süreci uzar.",
    ],
    benchmark: {
      conversionSignal: 74,
      messagePotential: 82,
      creativeDemand: 88,
    },
    learningNote:
      "Butik sektöründe stok sınırlılığı, kombin önerisi ve DM üzerinden hızlı cevap akışı satın alma sinyalini güçlendirir.",
    adAngles: [
      "Yeni sezon kombin önerisi",
      "Sınırlı stok / hızlı tükenen ürün",
      "Günlük kullanım için pratik stil",
    ],
  },
  "Güzellik / Bakım Merkezi": {
    language:
      "Güven, hijyen, uzmanlık, sonuç, randevu kolaylığı ve müşteri memnuniyeti vurgusu güçlüdür.",
    strongestCtas: [
      "Randevu almak için yaz",
      "Uygun işlem önerisi için DM at",
      "Detaylı bilgi için WhatsApp’tan ulaş",
    ],
    visualStrategy:
      "Temiz klinik/merkez görüntüsü, işlem öncesi-sonrası mantığı, ekipman, hijyen ve profesyonel ortam vurgulanmalı.",
    messageStrategy:
      "Fiyat sorularında önce ihtiyacı anlama, sonra işlem seçeneği ve randevu yönlendirmesi yapılmalı.",
    riskWarnings: [
      "Kesin sonuç vaatlerinden kaçınılmalı.",
      "Sağlık iddiası taşıyan ifadeler dikkatli kullanılmalı.",
      "Öncesi-sonrası görsellerinde gerçeklik ve izin önemli.",
    ],
    benchmark: {
      conversionSignal: 88,
      messagePotential: 84,
      creativeDemand: 81,
    },
    learningNote:
      "Güzellik sektöründe güven veren dil, uzmanlık vurgusu ve randevu CTA’sı dönüşüm kalitesini artırır.",
    adAngles: [
      "Güvenli ve profesyonel bakım deneyimi",
      "Randevuya özel danışmanlık",
      "Kendine zaman ayırma teması",
    ],
  },
  "Emlak / Gayrimenkul": {
    language:
      "Lokasyon, yatırım değeri, güven, fırsat, ulaşım avantajı ve detaylı bilgi vurgusu önemlidir.",
    strongestCtas: [
      "Detaylı bilgi için arayın",
      "Konum ve fiyat bilgisi için yaz",
      "Portföyü görmek için iletişime geç",
    ],
    visualStrategy:
      "Dış cephe, iç mekan turu, lokasyon avantajları, harita ve kısa video tur içerikleri kullanılmalı.",
    messageStrategy:
      "İlk mesajda bütçe, lokasyon ve ihtiyaç bilgisi alınarak müşteri doğru portföye yönlendirilmeli.",
    riskWarnings: [
      "Yanıltıcı fiyat ve m² bilgisi güven kaybı oluşturur.",
      "Gerçek olmayan lokasyon vurgularından kaçınılmalı.",
      "Yatırım getirisi kesin vaat gibi sunulmamalı.",
    ],
    benchmark: {
      conversionSignal: 79,
      messagePotential: 76,
      creativeDemand: 73,
    },
    learningNote:
      "Emlak sektöründe net bilgi, lokasyon avantajı ve hızlı geri dönüş müşteri güvenini artırır.",
    adAngles: [
      "Lokasyon avantajlı portföy",
      "Yatırım fırsatı",
      "Aile yaşamına uygun alan",
    ],
  },
  "Eğitim / Kurs": {
    language:
      "Başarı, gelişim, güven, uzman eğitmen, kayıt dönemi ve sınırlı kontenjan vurgusu etkilidir.",
    strongestCtas: [
      "Ücretsiz bilgi almak için yaz",
      "Kayıt detayları için DM at",
      "Kontenjan bilgisi için iletişime geç",
    ],
    visualStrategy:
      "Sınıf ortamı, öğrenci deneyimi, eğitmen güveni, başarı hikayeleri ve bilgilendirici carousel kullanılmalı.",
    messageStrategy:
      "Veliler/öğrenciler için güven veren, açıklayıcı ve kayıt sürecini kolaylaştıran cevap akışı oluşturulmalı.",
    riskWarnings: [
      "Garanti başarı vaatlerinden kaçınılmalı.",
      "Eğitim içeriği belirsiz bırakılmamalı.",
      "Fiyat ve program bilgisi net sunulmalı.",
    ],
    benchmark: {
      conversionSignal: 81,
      messagePotential: 79,
      creativeDemand: 69,
    },
    learningNote:
      "Eğitim sektöründe güven, program netliği ve kontenjan CTA’sı kayıt mesajlarını güçlendirir.",
    adAngles: [
      "Yeni dönem kayıt fırsatı",
      "Uzman eğitmen kadrosu",
      "Hedefe yönelik eğitim planı",
    ],
  },
  "Yerel Hizmet İşletmesi": {
    language:
      "Hızlı çözüm, güvenilir hizmet, yakın lokasyon, uygun fiyat ve müşteri memnuniyeti vurgusu öne çıkar.",
    strongestCtas: [
      "Hızlı teklif almak için yaz",
      "Hizmet bölgenizi öğrenmek için DM at",
      "Randevu oluşturmak için iletişime geç",
    ],
    visualStrategy:
      "Gerçek iş süreci, ekip, hizmet öncesi/sonrası, araç-ekipman ve müşteri yorumu içerikleri kullanılmalı.",
    messageStrategy:
      "Müşterinin problemini hızlı anlayıp net çözüm, tahmini süre ve iletişim çağrısı verilmelidir.",
    riskWarnings: [
      "Belirsiz fiyatlandırma müşteriyi kaçırabilir.",
      "Aşırı genel reklam dili güven oluşturmaz.",
      "Hizmet bölgesi net yazılmalı.",
    ],
    benchmark: {
      conversionSignal: 84,
      messagePotential: 86,
      creativeDemand: 71,
    },
    learningNote:
      "Yerel hizmetlerde problem-çözüm dili, hızlı teklif ve WhatsApp yönlendirmesi güçlü dönüşüm sinyali üretir.",
    adAngles: [
      "Acil çözüm / hızlı hizmet",
      "Yakın bölge avantajı",
      "Öncesi-sonrası güven kanıtı",
    ],
  },
};

export default function SectorIntelligencePage() {
  const [selectedSector, setSelectedSector] = useState(sectors[0]);
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);

  const profile = useMemo(() => {
    return sectorProfiles[selectedSector];
  }, [selectedSector]);

  const platformAdvice = useMemo(() => {
    return getPlatformAdvice(selectedPlatform);
  }, [selectedPlatform]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_34%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] opacity-30" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:flex-row sm:items-center">
          <div>
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-5xl">
              Sektör Zekâsı
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              AdMind Core; sektör, platform, kampanya dili, CTA, görsel yön ve
              müşteri dönüşüm sinyallerini analiz ederek reklam önerilerini
              güçlendirir.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            GLOBAL LEARNING MODE
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
              Analiz Ayarları
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Sektör
                </label>
                <select
                  value={selectedSector}
                  onChange={(event) => setSelectedSector(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/40"
                >
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Platform
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(event) => setSelectedPlatform(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/40"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.055] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                AdMind Core Notu
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {profile.learningNote}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-purple-300/10 bg-purple-300/[0.055] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">
                Platform Stratejisi
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {platformAdvice}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                  Sektör Reklam Profili
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {selectedSector}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Seçilen sektöre göre reklam dili, CTA, kreatif yön ve müşteri
                  cevap stratejisi.
                </p>
              </div>

              <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                {selectedPlatform}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ScoreCard
                label="Dönüşüm Sinyali"
                value={profile.benchmark.conversionSignal}
              />
              <ScoreCard
                label="Mesaj Potansiyeli"
                value={profile.benchmark.messagePotential}
              />
              <ScoreCard
                label="Kreatif İhtiyaç"
                value={profile.benchmark.creativeDemand}
              />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <InsightBox title="Reklam Dili" text={profile.language} />
              <InsightBox title="Görsel Strateji" text={profile.visualStrategy} />
              <InsightBox
                title="Mesajlaşma Stratejisi"
                text={profile.messageStrategy}
              />
              <ListBox title="Güçlü CTA Önerileri" items={profile.strongestCtas} />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              Reklam Açısı Önerileri
            </p>

            <div className="mt-4 grid gap-3">
              {profile.adAngles.map((angle, index) => (
                <div
                  key={angle}
                  className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.045] p-4"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                    Açı {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                    {angle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-orange-300/10 bg-orange-300/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
              Riskli Dil Uyarıları
            </p>

            <div className="mt-4 grid gap-3">
              {profile.riskWarnings.map((warning) => (
                <div
                  key={warning}
                  className="rounded-2xl border border-orange-300/10 bg-slate-950/35 p-4"
                >
                  <p className="text-sm leading-6 text-slate-300">• {warning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-purple-300/10 bg-purple-300/[0.055] p-5 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">
                Öğrenen Sistem Yol Haritası
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Sektör verisi zamanla AdMind Core hafızasına dönüşür.
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                İlk sürümde sektör içgörüleri hazır veriyle çalışır. Sonraki
                aşamada Kampanya Karnesi, Fırsat Takibi ve Mesajdan Müşteriye
                kayıtlarından anonim performans sinyalleri üretilerek sektör
                benchmark sistemi oluşturulur.
              </p>
            </div>

            <Link
              href="/reklam-paketi"
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-cyan-600/25"
            >
              Bu İçgörüyle Reklam Üret
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.045] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InsightBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function ListBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-slate-300">
            • {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function getPlatformAdvice(platform: string) {
  if (platform === "Instagram") {
    return "Instagram’da 4:5 post, Reels, story akışı ve DM çağrısı birlikte kullanılmalı. Görsel kalite ve hızlı mesaj cevabı dönüşümü artırır.";
  }

  if (platform === "TikTok") {
    return "TikTok’ta doğal görünen kısa video, ilk 3 saniyede güçlü giriş ve trend uyumlu ama marka güvenini bozmayan anlatım tercih edilmeli.";
  }

  if (platform === "Facebook") {
    return "Facebook’ta yerel hedefleme, açıklayıcı metin, güven unsuru ve yorum/mesaj dönüşümü daha önemli hale gelir.";
  }

  if (platform === "Google") {
    return "Google tarafında niyet odaklı arama dili, net başlık, lokasyon, fiyat/teklif netliği ve hızlı iletişim çağrısı öne çıkar.";
  }

  return "WhatsApp’ta kısa, güven veren, hızlı cevaplanan ve müşteriyi karar aşamasına taşıyan mesaj akışı en kritik noktadır.";
}