"use client";

import { useEffect, useState } from "react";

type SavedCampaign = {
  id: string;
  createdAt: string;
  businessName: string;
  sector: string;
  city: string;
  goal: string;
  budget: string;
  platform: string;
  output: string;
};

type BusinessProfile = {
  id: string;
  createdAt: string;
  businessName: string;
  sector: string;
  city: string;
  address: string;
  targetAudience: string;
  brandTone: string;
  instagram: string;
  phone: string;
  notes: string;
};

const menuItems = [
  { title: "Dashboard", href: "/", active: true, icon: "◆" },
  { title: "Kampanya Oluştur", href: "/kampanya-olustur", active: false, icon: "✦" },
  { title: "İşletme Profilleri", href: "/isletme-profilleri", active: false, icon: "●" },
  { title: "Geçmiş Kampanyalar", href: "/gecmis-kampanyalar", active: false, icon: "◈" },
  { title: "AI Motoru", href: "#", active: false, icon: "✺" },
  { title: "Ayarlar", href: "#", active: false, icon: "⚙" },
];

export default function Home() {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);

  useEffect(() => {
    const savedCampaigns = JSON.parse(
      localStorage.getItem("reklamzeka_campaigns") || "[]"
    ) as SavedCampaign[];

    const savedBusinessProfiles = JSON.parse(
      localStorage.getItem("reklamzeka_business_profiles") || "[]"
    ) as BusinessProfile[];

    setCampaigns(savedCampaigns);
    setBusinessProfiles(savedBusinessProfiles);
  }, []);

  const stats = [
    {
      title: "Toplam Kampanya",
      value: campaigns.length.toString(),
      description: "Kayıtlı reklam kampanyası",
      badge: "+ MVP aktif",
    },
    {
      title: "AI Strateji Çıktısı",
      value: campaigns.length.toString(),
      description: "Oluşturulan reklam planı",
      badge: "Demo motor",
    },
    {
      title: "Ortalama Skor",
      value: campaigns.length > 0 ? "%82" : "%0",
      description: "Tahmini başarı puanı",
      badge: "Analiz hazır",
    },
    {
      title: "Aktif İşletme",
      value: businessProfiles.length.toString(),
      description: "Kayıtlı işletme profili",
      badge: "CRM lite",
    },
  ];

  const recentCampaigns = campaigns.slice(0, 4);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-80 border-r border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl lg:block">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-600/30">
                <span className="text-lg font-black">RZ</span>
              </div>

              <div>
                <div className="text-2xl font-bold tracking-tight">
                  ReklamZekâ
                </div>
                <p className="text-xs uppercase tracking-[0.28em] text-blue-200/70">
                  AI Panel
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-sm font-medium text-slate-200">
                Teknokent MVP
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                KOBİ’ler için yapay zekâ destekli reklam stratejisi ve kampanya üretim sistemi.
              </p>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  item.active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    item.active ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                </span>
                {item.title}
              </a>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
            <p className="text-sm font-semibold text-blue-100">
              Sıradaki aşama
            </p>
            <p className="mt-2 text-xs leading-5 text-blue-100/70">
              Vercel canlı demo, Supabase veritabanı ve gerçek OpenAI API entegrasyonu.
            </p>
          </div>
        </aside>

        <section className="flex-1 px-5 py-6 lg:px-10 lg:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                AI destekli reklam yönetim paneli
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-5xl">
                Reklam kararlarını veriye ve yapay zekâya taşı.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                İşletme profilini kaydet, kampanya amacını belirle ve yapay zekâ destekli reklam stratejisi, hedef kitle önerisi, bütçe dağılımı ve içerik fikri oluştur.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/isletme-profilleri"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                İşletme Ekle
              </a>

              <a
                href="/kampanya-olustur"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-center text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
              >
                Yeni Kampanya Oluştur
              </a>
            </div>
          </header>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.075]"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
                    {item.badge}
                  </span>
                </div>

                <div className="text-5xl font-black tracking-tight">
                  {item.value}
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_0.75fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Son Kampanyalar</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Oluşturduğun en güncel reklam stratejileri
                  </p>
                </div>

                <a
                  href="/gecmis-kampanyalar"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Tümünü Gör
                </a>
              </div>

              {recentCampaigns.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-10 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl">
                    ✦
                  </div>
                  <p className="text-lg font-semibold text-slate-100">
                    Henüz kampanya oluşturulmadı.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    İlk kampanyanı oluşturduğunda burada otomatik olarak listelenecek.
                  </p>

                  <a
                    href="/kampanya-olustur"
                    className="mt-6 inline-block rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    İlk Kampanyayı Oluştur
                  </a>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.07] text-slate-300">
                      <tr>
                        <th className="px-5 py-4 font-medium">İşletme</th>
                        <th className="px-5 py-4 font-medium">Sektör</th>
                        <th className="px-5 py-4 font-medium">Hedef</th>
                        <th className="px-5 py-4 font-medium">Bütçe</th>
                        <th className="px-5 py-4 font-medium">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCampaigns.map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="border-t border-white/10 transition hover:bg-white/[0.035]"
                        >
                          <td className="px-5 py-5">
                            <div className="font-semibold text-white">
                              {campaign.businessName}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {campaign.city}
                            </div>
                          </td>

                          <td className="px-5 py-5 text-slate-300">
                            {campaign.sector}
                          </td>

                          <td className="max-w-[260px] px-5 py-5 text-slate-300">
                            {campaign.goal}
                          </td>

                          <td className="px-5 py-5 text-slate-300">
                            {campaign.budget}
                          </td>

                          <td className="px-5 py-5">
                            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                              {formatDate(campaign.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/25 via-purple-600/20 to-cyan-500/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  ✺
                </div>

                <h2 className="text-2xl font-bold">AI Reklam Motoru</h2>
                <p className="mt-3 text-sm leading-7 text-slate-200/80">
                  Demo motor aktif. Sonraki aşamada gerçek OpenAI API bağlantısı ile kampanya çıktıları işletmeye özel ve değişken hale getirilecek.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Tamamlananlar</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Dashboard, işletme profilleri, kampanya oluşturma, geçmiş kayıtlar ve kopyalama sistemi.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Yaklaşan özellik</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Canlı demo, Supabase veritabanı, kullanıcı girişi ve gerçek AI entegrasyonu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold">MVP Akışı</h3>

                <div className="mt-5 space-y-4">
                  {[
                    "İşletme profili oluştur",
                    "Kampanya bilgilerini gir",
                    "AI strateji çıktısı üret",
                    "Geçmiş kampanyalarda sakla",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-200">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}