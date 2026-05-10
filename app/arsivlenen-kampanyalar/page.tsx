"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

type Campaign = {
  id: string;
  created_at: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  goal: string | null;
  budget: string | null;
  platform: string | null;
  output: string;
  is_archived: boolean;
  archived_at: string | null;
};

export default function ArchivedCampaignsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  useEffect(() => {
    loadArchivedCampaigns();
  }, []);

  async function loadArchivedCampaigns() {
    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select(
        "id, created_at, business_name, sector, city, goal, budget, platform, output, is_archived, archived_at"
      )
      .eq("user_id", user.id)
      .eq("is_archived", true)
      .order("archived_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Arşivlenen kampanyalar yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    setCampaigns(data || []);
    setIsLoading(false);
  }

  async function restoreCampaign(campaignId: string) {
    const confirmRestore = window.confirm(
      "Bu kampanyayı arşivden çıkarmak istiyor musun?"
    );

    if (!confirmRestore) return;

    setIsRestoring(campaignId);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase
      .from("campaigns")
      .update({
        is_archived: false,
        archived_at: null,
      })
      .eq("id", campaignId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      alert("Kampanya arşivden çıkarılırken hata oluştu.");
      setIsRestoring(null);
      return;
    }

    setCampaigns((current) =>
      current.filter((campaign) => campaign.id !== campaignId)
    );

    if (selectedCampaign?.id === campaignId) {
      setSelectedCampaign(null);
    }

    setIsRestoring(null);
    alert("Kampanya arşivden çıkarıldı.");
  }

  async function copyOutput(output: string) {
    try {
      await navigator.clipboard.writeText(output);
      alert("Kampanya çıktısı kopyalandı.");
    } catch {
      alert("Kopyalama işlemi başarısız oldu.");
    }
  }

  function formatDate(date?: string | null) {
    if (!date) return "Tarih yok";

    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <AppTopNav />

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <a
            href="/"
            className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
          >
            ← Dashboard'a dön
          </a>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Kampanya Arşivi
              </p>

              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                Arşivlenen Kampanyalar
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Daha önce arşive aldığın kampanya stratejilerini buradan
                görüntüleyebilir, çıktılarını kopyalayabilir veya tekrar aktif
                kampanyalar listesine geri alabilirsin.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Arşivdeki Kampanya
              </p>
              <p className="mt-2 text-4xl font-black">{campaigns.length}</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">
              Arşivlenen kampanyalar yükleniyor...
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-2xl">
              ◈
            </div>

            <h2 className="text-2xl font-bold">Arşivde kampanya yok</h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Şu anda arşive alınmış kampanyan bulunmuyor. Geçmiş kampanyalar
              sayfasından kampanyaları arşive aldığında burada listelenecek.
            </p>

            <a
              href="/gecmis-kampanyalar"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              Geçmiş Kampanyalara Git
            </a>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="space-y-4">
              {campaigns.map((campaign) => {
                const isSelected = selectedCampaign?.id === campaign.id;

                return (
                  <article
                    key={campaign.id}
                    className={`rounded-[1.5rem] border p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition ${
                      isSelected
                        ? "border-cyan-400/40 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.055] hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {campaign.platform || "Platform belirtilmedi"}
                        </p>

                        <h2 className="mt-2 truncate text-xl font-black">
                          {campaign.business_name}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                          {campaign.sector || "Sektör yok"} ·{" "}
                          {campaign.city || "Şehir yok"}
                        </p>
                      </div>

                      <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-200">
                        Arşiv
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-slate-400">
                      <p>
                        <span className="text-slate-500">Hedef:</span>{" "}
                        {campaign.goal || "Belirtilmedi"}
                      </p>

                      <p>
                        <span className="text-slate-500">Bütçe:</span>{" "}
                        {campaign.budget || "Belirtilmedi"}
                      </p>

                      <p>
                        <span className="text-slate-500">Arşiv tarihi:</span>{" "}
                        {formatDate(campaign.archived_at)}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        Detayı Gör
                      </button>

                      <button
                        onClick={() => copyOutput(campaign.output)}
                        className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                      >
                        Çıktıyı Kopyala
                      </button>

                      <button
                        onClick={() => restoreCampaign(campaign.id)}
                        disabled={isRestoring === campaign.id}
                        className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRestoring === campaign.id
                          ? "Geri Alınıyor..."
                          : "Arşivden Çıkar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl xl:sticky xl:top-8 xl:h-fit">
              {selectedCampaign ? (
                <>
                  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                        Kampanya Detayı
                      </p>

                      <h2 className="mt-3 text-2xl font-black">
                        {selectedCampaign.business_name}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        Oluşturulma: {formatDate(selectedCampaign.created_at)}
                      </p>
                    </div>

                    <button
                      onClick={() => copyOutput(selectedCampaign.output)}
                      className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                    >
                      Kopyala
                    </button>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <DetailBox
                      label="Sektör"
                      value={selectedCampaign.sector || "Belirtilmedi"}
                    />
                    <DetailBox
                      label="Şehir"
                      value={selectedCampaign.city || "Belirtilmedi"}
                    />
                    <DetailBox
                      label="Platform"
                      value={selectedCampaign.platform || "Belirtilmedi"}
                    />
                    <DetailBox
                      label="Bütçe"
                      value={selectedCampaign.budget || "Belirtilmedi"}
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                      AI Kampanya Çıktısı
                    </p>

                    <div className="max-h-[520px] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-slate-200">
                      {selectedCampaign.output}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-400/10 text-2xl">
                    ✦
                  </div>

                  <h2 className="text-2xl font-bold">Kampanya seç</h2>

                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                    Sol taraftan bir arşiv kaydı seçtiğinde kampanya çıktısı ve
                    detayları burada görüntülenecek.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
  );
}