"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardActionCenter } from "@/components/dashboard-action-center";
import Image from "next/image";
import { ProductFlowMap } from "@/components/product-flow-map";
import { AIBackground } from "@/components/ai-background";
import { createClient } from "@/lib/supabase/client";
import { AIOrb } from "@/components/ai-orb";
import { Dancing_Script } from "next/font/google";

const handwritingFont = Dancing_Script({
  subsets: ["latin-ext"],
  weight: ["700"],
});

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
  title: "Görsel Stüdyo",
  href: "/gorsel-studyosu",
  active: false,
  icon: "🖼️",
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
    <main className="relative min-h-screen overflow-hidden bg-[#050712] text-white">
  <AIBackground />

       <div className="relative z-10 flex min-h-screen w-full max-w-full overflow-x-hidden">
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

        <section className="flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-10 lg:py-8">
          <div className="sticky top-3 z-40 mb-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:hidden">
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-lg shadow-cyan-950/40">
        AM
      </div>

      <div>
        <p className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-base font-black text-transparent">
          AdMind-Ai
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/60">
          AI Panel
        </p>
      </div>
    </div>

    <a
      href="/hesap"
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200"
    >
      Hesap
    </a>
  </div>

  <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <a href="/reklam-paketi" className="shrink-0 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100">
      Reklam Paketi
    </a>
    <a href="/gorsel-studyosu" className="shrink-0 rounded-xl border border-purple-300/20 bg-purple-300/10 px-3 py-2 text-xs font-bold text-purple-100">
      Görsel
    </a>
    <a href="/mesajdan-musteriye" className="shrink-0 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100">
      Mesaj
    </a>
    <a href="/firsat-takibi" className="shrink-0 rounded-xl border border-orange-300/20 bg-orange-300/10 px-3 py-2 text-xs font-bold text-orange-100">
      Fırsat
    </a>
    <a href="/kampanya-karnesi" className="shrink-0 rounded-xl border border-blue-300/20 bg-blue-300/10 px-3 py-2 text-xs font-bold text-blue-100">
      Karne
    </a>
  </nav>
</div>
<header className="mb-6 rounded-[1.5rem] border border-cyan-300/10 bg-white/[0.06] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl md:hidden">
  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
    </span>
    AdMind Core Aktif
  </div>

  <h1 className="text-[2rem] font-black leading-[1.05] tracking-tight text-white">
    Reklamdan müşteriye giden süreci{" "}
    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
      yapay zekâ ile yönet
    </span>
  </h1>

  <p className="mt-4 text-sm leading-7 text-slate-300">
    Reklam paketi, görsel brief, müşteri mesajı, fırsat takibi ve kampanya
    karnesini tek mobil panelde yönet.
  </p>

  <div className="mt-5 grid gap-3">
    <a
      href="/reklam-paketi"
      className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-center text-sm font-black text-white shadow-lg shadow-cyan-600/25"
    >
      Reklam Paketi Oluştur
    </a>

    <div className="grid grid-cols-2 gap-3">
      <a
        href="/gorsel-studyosu"
        className="rounded-2xl border border-purple-300/20 bg-purple-500/10 px-4 py-3 text-center text-xs font-bold text-purple-100"
      >
        Görsel Stüdyo
      </a>

      <a
        href="/mesajdan-musteriye"
        className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-center text-xs font-bold text-emerald-100"
      >
        Mesaj → Müşteri
      </a>
    </div>
  </div>

  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
          Öğrenen AI
        </p>
        <p className="mt-1 text-sm font-black text-white">AdMind Core</p>
      </div>

      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black text-cyan-200">
        LEARNING
      </span>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-cyan-300/10 bg-cyan-300/[0.055] p-2 text-center">
        <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
          Hafıza
        </p>
        <p className="mt-1 text-[11px] font-black text-cyan-200">Büyüyor</p>
      </div>

      <div className="rounded-xl border border-purple-300/10 bg-purple-300/[0.055] p-2 text-center">
        <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
          Analiz
        </p>
        <p className="mt-1 text-[11px] font-black text-purple-200">Aktif</p>
      </div>

      <div className="rounded-xl border border-emerald-300/10 bg-emerald-300/[0.055] p-2 text-center">
        <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
          Öneri
        </p>
        <p className="mt-1 text-[11px] font-black text-emerald-200">Hazır</p>
      </div>
    </div>
  </div>
</header>

          <header className="mb-8 hidden overflow-hidden rounded-[2rem] border border-cyan-300/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl md:block lg:p-8">
  <div className="relative">
    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />
    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-[90px]" />

    <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
          AI Marketing Intelligence Aktif
        </div>

        <h1 className="max-w-6xl text-[2.1rem] font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
  <span className="block">
    Reklamdan müşteriye giden süreci
  </span>

  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-4 sm:gap-x-4">
    <span
      className={`${handwritingFont.className} inline-block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text pb-2 pt-1 text-[2.9rem] leading-[1.18] tracking-normal text-transparent drop-shadow-[0_0_24px_rgba(103,232,249,0.32)] sm:text-5xl lg:text-7xl`}
    >
      yapay zekâ
    </span>

    <span className="inline-block pb-2 text-[2.1rem] font-black leading-[1.05] text-white sm:text-5xl lg:text-6xl">
      ile yönet
    </span>
  </span>
</h1>

<p className="mt-4 max-w-5xl text-sm leading-7 text-slate-300 sm:mt-5 lg:text-base">
  AdMind-Ai; reklam paketi üretimi, kampanyaya uygun görsel brief hazırlama,
  müşteri mesajlarını satış fırsatına dönüştürme, fırsat takibi ve kampanya
  performans analizini tek bir akıllı panelde birleştirir.
</p>

        <div className="mt-6 flex max-w-5xl flex-wrap gap-3 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Reklam Üretimi
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Görsel Stüdyosu
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Müşteri Dönüşümü
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
            Performans Analizi
          </span>
        </div>
      </div>

      

      <div className="flex w-full flex-col gap-3 sm:gap-4 lg:w-[380px] lg:shrink-0">
  <AIOrb />

  <a
    href="/reklam-paketi"
    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-cyan-600/25 transition hover:scale-[1.02]"
  >
    Reklam Paketi Oluştur
  </a>

  <a
    href="/gorsel-studyosu"
    className="rounded-2xl border border-purple-300/20 bg-purple-500/10 px-6 py-4 text-center text-sm font-bold text-purple-100 transition hover:bg-purple-500/20"
  >
    Görsel Stüdyosuna Git
  </a>

  <a
    href="/isletme-profilleri"
    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/10"
  >
    İşletme Ekle
  </a>
</div>
    </div>
  </div>
</header>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.085] hover:shadow-cyan-950/30"
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

          <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-8 xl:grid-cols-[1.35fr_0.75fr]">
  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
    <div className="mb-5 flex flex-col justify-between gap-4 sm:mb-6 sm:flex-row sm:items-center">
      <div>

                  <DashboardActionCenter />

                  <ProductFlowMap />

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