import Link from "next/link";

const flowItems = [
  {
    step: "01",
    title: "Reklam Paketi",
    href: "/reklam-paketi",
    icon: "✨",
    description:
      "İşletmeye uygun reklam metni, başlık, CTA ve paylaşım planı oluştur.",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  {
    step: "02",
    title: "Görsel Stüdyosu",
    href: "/gorsel-studyosu",
    icon: "🖼️",
    description:
      "Oluşturulan kampanyaya göre görsel brief ve AI görsel promptu üret.",
    accent: "from-purple-500/20 to-fuchsia-500/10",
  },
  {
    step: "03",
    title: "Mesajdan Müşteriye",
    href: "/mesajdan-musteriye",
    icon: "💬",
    description:
      "Gelen müşteri mesajlarına satış ve güven odaklı cevap akışları hazırla.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    step: "04",
    title: "Fırsat Takibi",
    href: "/firsat-takibi",
    icon: "🎯",
    description:
      "İlgilenen müşterileri fırsata çevir, sıcaklık ve takip durumunu yönet.",
    accent: "from-orange-500/20 to-yellow-500/10",
  },
  {
    step: "05",
    title: "Kampanya Karnesi",
    href: "/kampanya-karnesi",
    icon: "📊",
    description:
      "Reklam performansını ölç, maliyetleri ve dönüşüm kalitesini analiz et.",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
];

export function ProductFlowMap() {
  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:p-6">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Ana Ürün Döngüsü
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white lg:text-3xl">
            Reklam üretiminden müşteri kazanımına kadar tüm süreci yönet
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            AdMind-Ai, KOBİ’lerin reklam içeriği üretmesini, kampanyaya uygun
            görsel brief oluşturmasını, gelen mesajları müşteriye
            dönüştürmesini, fırsatları takip etmesini ve kampanya performansını
            ölçmesini tek bir akışta toplar.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 lg:min-w-[320px]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Çalışma Mantığı
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-white">
            Üret → Görselleştir → Cevapla → Takip Et → Ölç
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {flowItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative min-h-[190px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900/80"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80 transition group-hover:opacity-100`}
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-slate-200">
                  {item.step}
                </span>

                <span className="text-2xl">{item.icon}</span>
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-black leading-tight text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto pt-5">
                <span className="text-xs font-bold text-cyan-200 transition group-hover:text-white">
                  Aç →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-purple-400/20 bg-purple-400/10 p-5">
        <p className="text-sm leading-7 text-slate-300">
          <span className="font-black text-purple-200">
            Teknokent değer önerisi:
          </span>{" "}
          Bu akış sayesinde AdMind-Ai yalnızca reklam metni üreten bir araç
          değil; reklam içeriği, görsel üretim hazırlığı, müşteri iletişimi,
          fırsat takibi ve performans ölçümünü birleştiren uçtan uca reklam
          yönetim platformu olarak konumlanır.
        </p>
      </div>
    </section>
  );
}

export default ProductFlowMap;