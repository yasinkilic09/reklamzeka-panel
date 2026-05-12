"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardActionCenter } from "@/components/dashboard-action-center";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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
};

type SupabaseCampaign = {
  id: string;
  created_at: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  goal: string | null;
  budget: string | null;
  platform: string | null;
  output: string;
};

type SupabaseBusinessProfile = {
  id: string;
  created_at: string;
  business_name: string;
  sector: string | null;
  city: string | null;
};

const menuItems = [
  { title: "Dashboard", href: "/", active: true, icon: "◆" },
  {
    title: "Kampanya Oluştur",
    href: "/kampanya-olustur",
    active: false,
    icon: "✦",
  },
  {
    title: "İşletme Profilleri",
    href: "/isletme-profilleri",
    active: false,
    icon: "●",
  },
  {
    title: "Geçmiş Kampanyalar",
    href: "/gecmis-kampanyalar",
    active: false,
    icon: "◈",
  },
  {
  title: "Arşivlenen Kampanyalar",
  href: "/arsivlenen-kampanyalar",
  active: false,
  icon: "▣",
  },
  {
    title: "Hesap Merkezi",
    href: "/hesap",
    active: false,
    icon: "◌",
  },
  {
  title: "Reklam Paketi",
  href: "/reklam-paketi",
  active: false,
  icon: "✺",
  },
  {
  title: "Mesajdan Müşteriye",
  href: "/mesajdan-musteriye",
  active: false,
  icon: "💬",
},
{
  title: "Fırsat Takibi",
  href: "/firsat-takibi",
  active: false,
  icon: "🎯",
},
{
  title: "Kampanya Karnesi",
  href: "/kampanya-karnesi",
  active: false,
  icon: "📊",
},
];

function mapCampaign(row: SupabaseCampaign): SavedCampaign {
  return {
    id: row.id,
    createdAt: row.created_at,
    businessName: row.business_name,
    sector: row.sector || "",
    city: row.city || "",
    goal: row.goal || "",
    budget: row.budget || "",
    platform: row.platform || "",
    output: row.output,
  };
}

function mapBusinessProfile(row: SupabaseBusinessProfile): BusinessProfile {
  return {
    id: row.id,
    createdAt: row.created_at,
    businessName: row.business_name,
    sector: row.sector || "",
    city: row.city || "",
  };
}

export default function Home() {
  const router = useRouter();

  async function handleLogout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/tanitim");
  router.refresh();
}

  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  async function loadDashboardData() {
    setIsLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
  router.push("/tanitim");
  return;
}

    const [campaignsResponse, profilesResponse] = await Promise.all([
      supabase
        .from("campaigns")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false }),
      supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (campaignsResponse.error) {
      console.error(campaignsResponse.error);
      alert("Kampanya verileri yüklenirken hata oluştu.");
    } else {
      setCampaigns((campaignsResponse.data || []).map(mapCampaign));
    }

    if (profilesResponse.error) {
      console.error(profilesResponse.error);
      alert("İşletme verileri yüklenirken hata oluştu.");
    } else {
      setBusinessProfiles(
        (profilesResponse.data || []).map(mapBusinessProfile)
      );
    }

    setIsLoading(false);
  }

  loadDashboardData();
}, [router]);

  const stats = [
    {
      title: "Aktif Kampanya",
      value: isLoading ? "..." : campaigns.length.toString(),
      description: "Supabase campaigns tablosundaki aktif kayıtlar",
      badge: "Canlı veri",
    },
    {
      title: "AI Strateji Çıktısı",
      value: isLoading ? "..." : campaigns.length.toString(),
      description: "Üretilen ve kaydedilen reklam planı",
      badge: "Supabase",
    },
    {
      title: "Ortalama Skor",
      value: campaigns.length > 0 ? "%82" : "%0",
      description: "Demo tahmini başarı puanı",
      badge: "Analiz hazır",
    },
    {
      title: "Aktif İşletme",
      value: isLoading ? "..." : businessProfiles.length.toString(),
      description: "Supabase business_profiles kayıtları",
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
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-blue-600/30">
  <Image
    src="/logo.png"
    alt="AdMind AI Logo"
    width={56}
    height={56}
    className="h-full w-full object-cover"
  />
</div>

              <div>
  <div className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-2xl font-black tracking-tight text-transparent">
    AdMind AI
  </div>
  <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
    AI MARKETING PANEL
  </p>
</div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-sm font-medium text-slate-200">
                Teknokent MVP
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                KOBİ’ler için yapay zekâ destekli reklam stratejisi ve kampanya
                üretim sistemi.
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
                    item.active
                      ? "bg-white/20"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                </span>
                {item.title}
              </a>
            ))}
          </nav>

          <button
  onClick={handleLogout}
  className="mt-4 w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-200 transition hover:bg-red-500/20"
>
  Çıkış Yap
</button>

          <div className="mt-10 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
            <p className="text-sm font-semibold text-blue-100">
              Supabase aktif
            </p>
            <p className="mt-2 text-xs leading-5 text-blue-100/70">
              İşletme profilleri, kampanyalar ve geçmiş kayıtlar artık gerçek
              veritabanından okunuyor.
            </p>
          </div>
        </aside>

        <section className="flex-1 px-5 py-6 lg:px-10 lg:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                Supabase bağlantılı canlı MVP
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-5xl">
                Reklam kararlarını veriye ve yapay zekâya taşı.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                İşletme profilini kaydet, kampanya amacını belirle ve yapay zekâ
                destekli reklam stratejisi, hedef kitle önerisi, bütçe dağılımı
                ve içerik fikri oluştur.
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

                  <DashboardActionCenter />

                  <h2 className="text-2xl font-bold">Son Kampanyalar</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Supabase’den gelen en güncel aktif kampanyalar
                  </p>
                </div>

                <a
                  href="/gecmis-kampanyalar"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Tümünü Gör
                </a>
              </div>

              {isLoading ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-10 text-center">
                  <p className="text-slate-300">Dashboard verileri yükleniyor...</p>
                </div>
              ) : recentCampaigns.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-10 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl">
                    ✦
                  </div>
                  <p className="text-lg font-semibold text-slate-100">
                    Henüz aktif kampanya yok.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    İlk kampanyanı oluşturduğunda burada Supabase’den okunarak
                    listelenecek.
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
                              {campaign.city || "Şehir yok"}
                            </div>
                          </td>

                          <td className="px-5 py-5 text-slate-300">
                            {campaign.sector || "Sektör yok"}
                          </td>

                          <td className="max-w-[260px] px-5 py-5 text-slate-300">
                            {campaign.goal || "Hedef belirtilmedi"}
                          </td>

                          <td className="px-5 py-5 text-slate-300">
                            {campaign.budget || "Bütçe yok"}
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
                  Demo motor aktif. Kampanyalar artık Supabase veritabanına
                  kaydediliyor. Sonraki aşamada gerçek OpenAI API bağlantısı
                  yapılacak.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Tamamlananlar</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Dashboard, işletme profilleri, kampanya oluşturma, geçmiş
                      kayıtlar, arşivleme ve Supabase bağlantısı.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Yaklaşan özellik</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Gerçek OpenAI API entegrasyonu, kullanıcı hesabı ve PDF
                      kampanya raporu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-bold">MVP Akışı</h3>

                <div className="mt-5 space-y-4">
                  {[
                    "İşletme profilini Supabase’e kaydet",
                    "Kampanya bilgilerini gir",
                    "AI strateji çıktısı üret",
                    "Geçmiş kampanyalarda arşivle",
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