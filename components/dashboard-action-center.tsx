"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type DashboardSnapshot = {
  businessCount: number;
  activeCampaignCount: number;
  archivedCampaignCount: number;
  latestBusinessName: string | null;
  latestCampaignName: string | null;
};

const emptySnapshot: DashboardSnapshot = {
  businessCount: 0,
  activeCampaignCount: 0,
  archivedCampaignCount: 0,
  latestBusinessName: null,
  latestCampaignName: null,
};

export function DashboardActionCenter() {
  const supabase = createClient();

  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardSnapshot();
  }, []);

  async function loadDashboardSnapshot() {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    const [
      businessCountResponse,
      activeCampaignCountResponse,
      archivedCampaignCountResponse,
      latestBusinessResponse,
      latestCampaignResponse,
    ] = await Promise.all([
      supabase
        .from("business_profiles")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", false),

      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_archived", true),

      supabase
        .from("business_profiles")
        .select("business_name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),

      supabase
        .from("campaigns")
        .select("business_name")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    setSnapshot({
      businessCount: businessCountResponse.count || 0,
      activeCampaignCount: activeCampaignCountResponse.count || 0,
      archivedCampaignCount: archivedCampaignCountResponse.count || 0,
      latestBusinessName:
        latestBusinessResponse.data?.[0]?.business_name || null,
      latestCampaignName:
        latestCampaignResponse.data?.[0]?.business_name || null,
    });

    setIsLoading(false);
  }

  const recommendation = useMemo(() => {
    if (snapshot.businessCount === 0) {
      return {
        badge: "İlk adım",
        title: "Önce işletme profilini oluştur",
        description:
          "İşletme profili olmadan sistem hedef kitle, sektör ve marka tonu üzerinden güçlü reklam çıktısı üretemez.",
        href: "/isletme-profilleri",
        buttonText: "İşletme Profili Ekle",
      };
    }

    if (snapshot.activeCampaignCount === 0) {
      return {
        badge: "Önerilen işlem",
        title: "İlk reklam paketini oluştur",
        description:
          "Kayıtlı işletme bilgilerini kullanarak post açıklaması, story metni, reels senaryosu ve 7 günlük paylaşım planı oluştur.",
        href: "/reklam-paketi",
        buttonText: "Reklam Paketi Oluştur",
      };
    }

    return {
      badge: "Devam et",
      title: "Yeni kampanya paketi üret",
      description:
        "Mevcut işletme verilerini kullanarak farklı hedefler için yeni reklam paketleri oluşturabilir ve geçmiş kampanyalarını karşılaştırabilirsin.",
      href: "/reklam-paketi",
      buttonText: "Yeni Paket Oluştur",
    };
  }, [snapshot]);

  const completedSteps = [
    snapshot.businessCount > 0,
    snapshot.activeCampaignCount > 0,
    snapshot.archivedCampaignCount > 0,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedSteps / 3) * 100);

  return (
    <section className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-cyan-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-64 w-64 rounded-full bg-purple-500/20 blur-[90px]" />

        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              {recommendation.badge}
            </span>

            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
              Akıllı Aksiyon Merkezi
            </span>
          </div>

          <h2 className="max-w-2xl text-3xl font-black tracking-tight lg:text-4xl">
            {recommendation.title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
            {recommendation.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={recommendation.href}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              {recommendation.buttonText}
            </Link>

            <Link
              href="/gecmis-kampanyalar"
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Kampanyaları Gör
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MiniMetric
              label="İşletme"
              value={isLoading ? "..." : snapshot.businessCount.toString()}
              detail={
                snapshot.latestBusinessName
                  ? `Son eklenen: ${snapshot.latestBusinessName}`
                  : "Henüz işletme yok"
              }
            />

            <MiniMetric
              label="Aktif Kampanya"
              value={
                isLoading ? "..." : snapshot.activeCampaignCount.toString()
              }
              detail={
                snapshot.latestCampaignName
                  ? `Son kampanya: ${snapshot.latestCampaignName}`
                  : "Henüz aktif kampanya yok"
              }
            />

            <MiniMetric
              label="Arşiv"
              value={
                isLoading ? "..." : snapshot.archivedCampaignCount.toString()
              }
              detail="Arşivlenen kampanyalar"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300">
            Kurulum İlerlemesi
          </p>

          <h3 className="mt-3 text-2xl font-black">
            Panel kullanım hazırlığı
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Bu adımlar tamamlandıkça AdMind-Ai daha verimli reklam önerileri
            üretmeye hazır hale gelir.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Tamamlanma</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <ChecklistItem
            done={snapshot.businessCount > 0}
            title="İşletme profili oluşturuldu"
            description="Sektör, şehir, hedef kitle ve marka tonu tanımlandı."
          />

          <ChecklistItem
            done={snapshot.activeCampaignCount > 0}
            title="İlk reklam paketi üretildi"
            description="Kullanıma hazır sosyal medya içerikleri oluşturuldu."
          />

          <ChecklistItem
            done={snapshot.archivedCampaignCount > 0}
            title="Kampanya arşivi kullanılmaya başlandı"
            description="Eski kampanyalar silinmeden düzenli şekilde saklanıyor."
          />
        </div>
      </div>

      <div className="xl:col-span-2 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          title="Reklam Paketi"
          description="Post, story, reels, CTA, hashtag ve 7 günlük plan üret."
          href="/reklam-paketi"
          icon="✺"
          tag="En faydalı"
        />

        <ActionCard
          title="Mesajdan Müşteriye"
          description="DM, yorum ve WhatsApp mesajları için cevap akışı oluştur."
          href="/mesajdan-musteriye"
          icon="💬"
          tag="Yeni"
/>

        <ActionCard
          title="İşletme Profilleri"
          description="Marka bilgilerini düzenle, kampanya çıktısını güçlendir."
          href="/isletme-profilleri"
          icon="●"
          tag="Veri merkezi"
        />

        <ActionCard
          title="Geçmiş Kampanyalar"
          description="Kaydedilen kampanyaları incele, kopyala veya arşivle."
          href="/gecmis-kampanyalar"
          icon="◈"
          tag="Kayıtlar"
        />

        <ActionCard
          title="Hesap Merkezi"
          description="Profil bilgilerini, kullanım özetini ve oturumu yönet."
          href="/hesap"
          icon="◌"
          tag="Üyelik"
        />
      </div>
    </section>
  );
}

function MiniMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function ChecklistItem({
  done,
  title,
  description,
}: {
  done: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        done
          ? "border-emerald-400/20 bg-emerald-400/10"
          : "border-white/10 bg-slate-950/60"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
            done
              ? "bg-emerald-400 text-slate-950"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {done ? "✓" : "•"}
        </div>

        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  tag,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-xl text-cyan-100 ring-1 ring-white/10">
          {icon}
        </div>

        <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-400">
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>

      <p className="mt-5 text-sm font-bold text-cyan-200 transition group-hover:translate-x-1">
        Aç →
      </p>
    </Link>
  );
}