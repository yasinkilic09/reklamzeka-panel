import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Reklam Paketi Oluşturucu",
    description:
      "Post açıklaması, story metni, reels senaryosu, CTA, hashtag ve 7 günlük paylaşım planı üretir.",
    icon: "✺",
  },
  {
    title: "İşletme Profilleri",
    description:
      "Her işletmenin sektör, şehir, hedef kitle ve marka tonu bilgilerini düzenli şekilde saklar.",
    icon: "●",
  },
  {
    title: "Kampanya Arşivi",
    description:
      "Üretilen reklam çıktıları silinmeden saklanır, kopyalanır ve tekrar kullanılabilir.",
    icon: "◈",
  },
  {
    title: "Akıllı Aksiyon Merkezi",
    description:
      "Kullanıcıya sıradaki en mantıklı adımı göstererek panel kullanımını kolaylaştırır.",
    icon: "◆",
  },
];

const steps = [
  "İşletme profilini oluştur",
  "Kampanya hedefini seç",
  "Reklam paketini üret",
  "Çıktıyı kopyala veya kaydet",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[520px] w-[520px] rounded-full bg-blue-600/25 blur-[140px]" />
        <div className="absolute right-[-8%] top-[18%] h-[520px] w-[520px] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="absolute bottom-[-18%] left-[35%] h-[480px] w-[480px] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.055] px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
          <Link href="/tanitim" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-500/20">
              <Image
                src="/logo.png"
                alt="AdMind-Ai Logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <p className="text-base font-black tracking-tight">AdMind-Ai</p>
              <p className="text-xs text-slate-400">AI Marketing Panel</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Giriş Yap
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              Hesap Oluştur
            </Link>
          </nav>
        </header>

        <section className="grid min-h-[620px] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Teknokent MVP
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                Yapay zekâ destekli reklam yönetimi
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl xl:text-7xl">
              Yerel işletmeler için akıllı reklam üretim paneli.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              AdMind-Ai; işletmelerin sosyal medya reklam metinlerini,
              kampanya planlarını ve içerik fikirlerini tek panelden daha hızlı,
              daha düzenli ve daha stratejik şekilde üretmesini sağlar.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/sign-up"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
              >
                Ücretsiz Başla
              </Link>

              <Link
                href="/auth/login"
                className="rounded-2xl border border-white/10 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Panele Giriş Yap
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <Metric value="7 Gün" label="Paylaşım planı" />
              <Metric value="10+" label="Hazır içerik çıktısı" />
              <Metric value="MVP" label="Teknokent sunumuna uygun" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.065] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Reklam Paketi
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Kullanıma hazır çıktı
                  </h2>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Hazır
                </span>
              </div>

              <div className="space-y-4 text-sm leading-7 text-slate-300">
                <PreviewBlock title="Instagram Post Açıklaması" />
                <PreviewBlock title="Story Metinleri" />
                <PreviewBlock title="15 Saniyelik Reels Senaryosu" />
                <PreviewBlock title="CTA ve Hashtag Önerileri" />
                <PreviewBlock title="7 Günlük Paylaşım Planı" />
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Kullanıcı değeri
                </p>
                <p className="mt-3 text-2xl font-black">Hızlı üretim</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sosyal medya içerikleri dakikalar içinde hazırlanır.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Panel mantığı
                </p>
                <p className="mt-3 text-2xl font-black">Düzenli arşiv</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Kampanyalar kaybolmaz, tekrar kullanılabilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">
              Problem
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Küçük işletmeler reklam üretirken zaman, fikir ve strateji
              problemi yaşıyor.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
              Yerel işletmeler çoğu zaman sosyal medya için ne paylaşacağını,
              hangi metni kullanacağını veya kampanyasını nasıl anlatacağını
              bilemiyor. AdMind-Ai bu süreci daha sistemli hale getirir.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-xl ring-1 ring-white/10">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-black">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Nasıl çalışır?
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Dört adımda reklam içeriği üret.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Panel, kullanıcının işletme bilgilerini temel alarak doğrudan
              kullanılabilir reklam paketleri üretir ve geçmiş kampanyaları
              düzenli şekilde saklar.
            </p>

            <div className="mt-7 grid gap-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950">
                    {index + 1}
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-500/10 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-purple-200">
              Teknokent değeri
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Reklamcılık süreçlerine yazılım tabanlı yeni bir yaklaşım.
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">
              AdMind-Ai, reklam metni üretimini sadece tek seferlik bir içerik
              oluşturma süreci olarak değil; işletme verisi, kampanya geçmişi,
              arşivleme ve aksiyon önerileriyle bütünleşik bir reklam yönetim
              sistemi olarak ele alır.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Benefit title="KOBİ odaklı" text="Yerel işletmelerin hızlı içerik ihtiyacına odaklanır." />
              <Benefit title="Tek panel" text="İşletme, kampanya ve arşiv yönetimini birleştirir." />
              <Benefit title="Ölçeklenebilir" text="OpenAI API entegrasyonu için hazır altyapı sunar." />
              <Benefit title="Sunuma uygun" text="Teknokent MVP demosu için güçlü ürün algısı oluşturur." />
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.065] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Başlamaya hazır
          </p>

          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
            AdMind-Ai ile reklam üretim sürecini daha düzenli hale getir.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            İşletmeni ekle, reklam paketini oluştur, kampanyanı kaydet ve tüm
            çıktıları tek panelden yönet.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              Hesap Oluştur
            </Link>

            <Link
              href="/auth/login"
              className="rounded-2xl border border-white/10 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Giriş Yap
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function PreviewBlock({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <p className="font-bold text-white">{title}</p>
      <div className="mt-3 space-y-2">
        <div className="h-2 w-full rounded-full bg-white/10" />
        <div className="h-2 w-4/5 rounded-full bg-white/10" />
        <div className="h-2 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
      <p className="font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}