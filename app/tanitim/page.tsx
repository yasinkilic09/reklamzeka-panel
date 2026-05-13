import Image from "next/image";
import Link from "next/link";

const productFlow = [
  {
    step: "01",
    title: "Reklam Paketi",
    text: "İşletme bilgilerine göre başlık, açıklama, CTA, hashtag ve paylaşım planı üretir.",
    icon: "✨",
  },
  {
    step: "02",
    title: "Görsel Stüdyosu",
    text: "Oluşturulan kampanyaya uygun görsel brief ve AI görsel promptu hazırlar.",
    icon: "🖼️",
  },
  {
    step: "03",
    title: "Mesajdan Müşteriye",
    text: "Gelen mesajları satışa yönlendiren güven veren cevap akışlarına dönüştürür.",
    icon: "💬",
  },
  {
    step: "04",
    title: "Fırsat Takibi",
    text: "Müşteri adaylarını sıcaklık, skor ve satış aşamasına göre takip eder.",
    icon: "🎯",
  },
  {
    step: "05",
    title: "Kampanya Karnesi",
    text: "Reklam performansını ölçer, maliyet ve dönüşüm kalitesini analiz eder.",
    icon: "📊",
  },
];

const featureCards = [
  {
    title: "AI Reklam Asistanı",
    text: "AdMind Core, kampanya üretiminden müşteri dönüşümüne kadar tüm süreci tek zekâ altında toplar.",
  },
  {
    title: "KOBİ Odaklı Akış",
    text: "Restoran, butik, güzellik merkezi, eğitim kurumu ve yerel işletmeler için pratik kullanım sunar.",
  },
  {
    title: "Tek Panelden Yönetim",
    text: "Reklam içeriği, görsel brief, müşteri cevabı, fırsat takibi ve performans karnesi aynı sistemde birleşir.",
  },
];

export default function TanitimPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] opacity-35" />
        <div className="absolute left-1/2 top-[-180px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[460px] w-[460px] rounded-full bg-purple-600/20 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <nav className="mb-10 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <Link href="/tanitim" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-cyan-300/20 bg-white/5 shadow-lg shadow-cyan-950/40">
              <Image
                src="/logo.png"
                alt="AdMind-Ai Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-lg font-black tracking-tight text-transparent">
                AdMind-Ai
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-200/60">
                AI Marketing Platform
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Giriş Yap
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-600/25 transition hover:scale-[1.02]"
            >
              Ücretsiz Başla
            </Link>
          </div>

          <Link
            href="/auth/login"
            className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100 md:hidden"
          >
            Giriş
          </Link>
        </nav>

        <section className="grid min-h-[720px] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              AdMind Core Aktif
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
              KOBİ’ler için{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                yapay zekâ destekli
              </span>{" "}
              reklam yönetim platformu.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 lg:text-lg">
              AdMind-Ai; reklam paketi üretimi, kampanyaya uygun görsel brief,
              müşteri mesajı analizi, fırsat takibi ve kampanya performans
              ölçümünü tek bir akıllı panelde birleştirir.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-cyan-600/25 transition hover:scale-[1.02]"
              >
                Paneli Denemeye Başla
              </Link>

              <Link
                href="/auth/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-center text-sm font-bold text-slate-200 transition hover:bg-white/10"
              >
                Hesabım Var
              </Link>
            </div>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <MiniStat label="Ürün Akışı" value="5 Aşama" />
              <MiniStat label="Odak" value="KOBİ" />
              <MiniStat label="Motor" value="AdMind Core" />
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/10 bg-white/[0.055] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_36%)]" />

              <div className="relative mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
                    AdMind Core
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Öğrenen Reklam Zekâsı
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Reklam, müşteri ve performans verilerini tek karar akışında
                    birleştiren AI asistan kimliği.
                  </p>
                </div>

                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
                  LEARNING
                </span>
              </div>

              <div className="relative mx-auto my-6 flex h-72 w-72 items-center justify-center">
                <div className="absolute inset-0 animate-[spin_22s_linear_infinite] rounded-full border border-cyan-300/20" />
                <div className="absolute inset-8 animate-[spin_14s_linear_infinite_reverse] rounded-full border border-purple-300/20" />
                <div className="absolute inset-16 animate-[spin_9s_linear_infinite] rounded-full border border-blue-300/20" />

                <div className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.95)]" />
                <div className="absolute bottom-10 right-14 h-3 w-3 rounded-full bg-purple-300 shadow-[0_0_24px_rgba(216,180,254,0.95)]" />
                <div className="absolute left-14 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_24px_rgba(147,197,253,0.95)]" />

                <div className="absolute h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-500 shadow-[0_0_70px_rgba(59,130,246,0.55)]" />
                <div className="absolute h-16 w-16 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl" />
              </div>

              <div className="relative grid gap-3 sm:grid-cols-3">
                <SignalBox label="Hafıza" value="Büyüyor" />
                <SignalBox label="Analiz" value="Derinleşiyor" />
                <SignalBox label="Öneri" value="Gelişiyor" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Uçtan Uca Reklam Akışı
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-5xl">
              Reklamdan müşteriye giden süreci tek panelde topla.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {productFlow.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                    {item.step}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-10 lg:grid-cols-3">
          {featureCards.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 backdrop-blur-2xl"
            >
              <h3 className="text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section className="my-10 overflow-hidden rounded-[2.2rem] border border-purple-300/15 bg-purple-400/[0.06] p-6 text-center shadow-2xl shadow-purple-950/20 backdrop-blur-2xl lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-200">
            Teknokent MVP Değer Önerisi
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black tracking-tight text-white lg:text-5xl">
            Sadece reklam metni değil, reklamdan müşteriye uzanan akıllı yönetim sistemi.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
            AdMind-Ai, yerel işletmelerin dijital reklam sürecini daha hızlı,
            ölçülebilir ve dönüşüm odaklı yönetebilmesi için geliştirilen yapay
            zekâ destekli bir reklam yönetim panelidir.
          </p>

          <div className="mt-8">
            <Link
              href="/auth/sign-up"
              className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-cyan-600/25 transition hover:scale-[1.02]"
            >
              AdMind-Ai Paneline Başla
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function SignalBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-cyan-200">{value}</p>
    </div>
  );
}