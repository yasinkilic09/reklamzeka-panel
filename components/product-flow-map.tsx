import Link from "next/link";

const flowSteps = [
  {
    number: "01",
    title: "Reklam Paketi",
    description:
      "İşletme profiline göre reklam metni, story, reels senaryosu ve paylaşım planı oluştur.",
    href: "/reklam-paketi",
    icon: "✨",
    tag: "Üret",
  },
  {
    number: "02",
    title: "Mesajdan Müşteriye",
    description:
      "DM, yorum ve WhatsApp mesajları için satışa yönlendiren cevap akışları hazırla.",
    href: "/mesajdan-musteriye",
    icon: "💬",
    tag: "Cevapla",
  },
  {
    number: "03",
    title: "Fırsat Takibi",
    description:
      "Potansiyel müşterileri kaydet, durumlarını güncelle ve satış sürecini takip et.",
    href: "/firsat-takibi",
    icon: "🎯",
    tag: "Takip et",
  },
  {
    number: "04",
    title: "Kampanya Karnesi",
    description:
      "Bütçe, mesaj, fırsat ve müşteri verileriyle kampanyanın performansını ölç.",
    href: "/kampanya-karnesi",
    icon: "📊",
    tag: "Ölç",
  },
];

export function ProductFlowMap() {
  return (
    <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl lg:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] xl:items-stretch">
        <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
              Ana Ürün Döngüsü
            </p>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-white lg:text-3xl">
              Reklamdan müşteriye giden süreci tek panelde yönet
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              AdMind-Ai yalnızca reklam metni üretmez. Reklam fikrinden müşteri
              iletişimine, fırsat takibinden performans ölçümüne kadar tüm
              süreci birbirine bağlar.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
              Çalışma Mantığı
            </p>
            <p className="mt-2 text-lg font-black text-white">
              Üret → Cevapla → Takip Et → Ölç
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Bu yapı, ürünü basit bir içerik üreticiden reklam yönetim
              asistanına dönüştürür.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {flowSteps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-950/90"
            >
              <div className="pointer-events-none absolute right-[-45px] top-[-45px] h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-purple-400/20" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
                    {step.icon}
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-400">
                    {step.number}
                  </span>
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                  {step.tag}
                </span>

                <h3 className="mt-4 text-lg font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-bold text-slate-300">
                    Aç
                  </span>
                  <span className="text-lg text-cyan-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-purple-400/20 bg-purple-400/10 p-4">
        <p className="text-sm font-black text-purple-200">
          Teknokent Değer Önerisi
        </p>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Bu akış sayesinde AdMind-Ai, KOBİ’lere reklam üretimi, müşteri
          iletişimi, fırsat takibi ve performans ölçümünü tek bir bütün olarak
          sunar.
        </p>
      </div>
    </section>
  );
}