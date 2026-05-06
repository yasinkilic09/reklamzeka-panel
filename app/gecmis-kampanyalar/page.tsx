"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
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

export default function CampaignHistoryPage() {
  const supabase = createClient();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<SavedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
  setIsLoading(true);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    router.push("/auth/login");
    return;
  }

  setCurrentUserId(user.id);

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Kampanyalar yüklenirken hata oluştu.");
    setIsLoading(false);
    return;
  }

  const mappedCampaigns = (data || []).map(mapCampaign);

  setCampaigns(mappedCampaigns);
  setSelectedCampaign(mappedCampaigns[0] || null);
  setIsLoading(false);
}

  async function archiveCampaign(id: string) {
  const isConfirmed = confirm(
    "Bu kampanyayı arşivlemek istediğine emin misin? Kayıt Supabase'den silinmeyecek, sadece listeden kaldırılacak."
  );

  if (!isConfirmed) return;

  if (!currentUserId) {
  alert("Oturum bulunamadı. Lütfen tekrar giriş yap.");
  router.push("/auth/login");
  return;
}

const { error } = await supabase
  .from("campaigns")
  .update({
    is_archived: true,
    archived_at: new Date().toISOString(),
  })
  .eq("id", id)
  .eq("user_id", currentUserId);

  if (error) {
    console.error(error);
    alert("Kampanya arşivlenirken hata oluştu.");
    return;
  }

  const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== id);

  setCampaigns(updatedCampaigns);

  if (selectedCampaign?.id === id) {
    setSelectedCampaign(updatedCampaigns[0] || null);
  }
}

  function copyOutput() {
    if (!selectedCampaign) return;

    navigator.clipboard.writeText(selectedCampaign.output);
    alert("Kampanya çıktısı kopyalandı.");
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  const totalCampaigns = campaigns.length;
  const instagramCampaigns = campaigns.filter(
    (campaign) => campaign.platform === "Instagram"
  ).length;
  const latestCampaign = campaigns[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <AppTopNav />

        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex-row lg:items-center">
          <div>
            <a
              href="/"
              className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
            >
              ← Dashboard'a dön
            </a>

            <h1 className="mt-5 text-3xl font-black tracking-tight lg:text-5xl">
              Geçmiş Kampanyalar
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
              Supabase veritabanına kaydedilen reklam stratejilerini görüntüle,
              detaylarını incele, çıktıyı kopyala veya kampanyayı sil.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            <StatBox title="Toplam" value={totalCampaigns.toString()} />
            <StatBox title="Instagram" value={instagramCampaigns.toString()} />
            <a
              href="/kampanya-olustur"
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              Yeni Kampanya
            </a>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Kampanyalar yükleniyor...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/15 text-3xl">
              ◈
            </div>

            <h2 className="text-2xl font-black">Henüz kampanya yok</h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              İlk AI reklam kampanyanı oluşturduğunda burada Supabase’den
              okunarak listelenecek.
            </p>

            <a
              href="/kampanya-olustur"
              className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              İlk Kampanyayı Oluştur
            </a>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Kampanya Listesi</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Veriler Supabase campaigns tablosundan okunuyor.
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {campaigns.length} kayıt
                </span>
              </div>

              <div className="max-h-[780px] space-y-3 overflow-auto pr-1">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedCampaign?.id === campaign.id
                        ? "border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-600/10"
                        : "border-white/10 bg-slate-950/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-black">
                        {campaign.businessName.slice(0, 2).toUpperCase()}
                      </div>

                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-[11px] text-blue-200">
                        {campaign.platform || "Platform yok"}
                      </span>
                    </div>

                    <h3 className="font-bold text-white">
                      {campaign.businessName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {campaign.sector || "Sektör yok"} •{" "}
                      {campaign.city || "Şehir yok"}
                    </p>

                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                      {campaign.goal || "Hedef belirtilmedi"}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {campaign.budget || "Bütçe yok"}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatDate(campaign.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {selectedCampaign ? (
                <>
                  <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-base font-black shadow-lg shadow-blue-600/20">
                        {selectedCampaign.businessName
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-2xl font-black">
                          {selectedCampaign.businessName}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          {selectedCampaign.sector || "Sektör yok"} •{" "}
                          {selectedCampaign.city || "Şehir yok"}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {formatDate(selectedCampaign.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={copyOutput}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                      >
                        Çıktıyı Kopyala
                      </button>

                      <button
  onClick={() => archiveCampaign(selectedCampaign.id)}
  className="rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
>
  Arşivle
</button>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <InfoCard
                      title="Sektör"
                      value={selectedCampaign.sector || "Belirtilmedi"}
                    />
                    <InfoCard
                      title="Şehir"
                      value={selectedCampaign.city || "Belirtilmedi"}
                    />
                    <InfoCard
                      title="Bütçe"
                      value={selectedCampaign.budget || "Belirtilmedi"}
                    />
                    <InfoCard
                      title="Platform"
                      value={selectedCampaign.platform || "Belirtilmedi"}
                    />
                  </div>

                  <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Kampanya hedefi
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {selectedCampaign.goal || "Hedef belirtilmedi"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-200">
                        AI Strateji Çıktısı
                      </span>

                      <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs text-purple-200">
                        Supabase kaydı
                      </span>

                      {latestCampaign?.id === selectedCampaign.id && (
                        <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-200">
                          En güncel
                        </span>
                      )}
                    </div>

                    <pre className="max-h-[700px] overflow-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">
                      {selectedCampaign.output}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[620px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                  <div>
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/15 text-3xl">
                      ◈
                    </div>

                    <p className="text-xl font-bold text-slate-100">
                      Görüntülenecek kampanya seçilmedi.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}