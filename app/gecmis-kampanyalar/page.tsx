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

export default function CampaignHistoryPage() {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] =
    useState<SavedCampaign | null>(null);

  useEffect(() => {
    const savedCampaigns = JSON.parse(
      localStorage.getItem("reklamzeka_campaigns") || "[]"
    ) as SavedCampaign[];

    setCampaigns(savedCampaigns);
    setSelectedCampaign(savedCampaigns[0] || null);
  }, []);

  function deleteCampaign(id: string) {
    const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== id);

    localStorage.setItem(
      "reklamzeka_campaigns",
      JSON.stringify(updatedCampaigns)
    );

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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <a
              href="/"
              className="text-sm font-medium text-blue-300 hover:text-blue-200"
            >
              ← Dashboard'a dön
            </a>

            <h1 className="mt-6 text-4xl font-bold tracking-tight">
              Geçmiş Kampanyalar
            </h1>

            <p className="mt-3 max-w-3xl text-slate-300">
              Daha önce oluşturulan reklam kampanyalarını görüntüle, çıktılarını
              kopyala veya gereksiz kayıtları sil.
            </p>
          </div>

          <a
            href="/kampanya-olustur"
            className="rounded-2xl bg-blue-600 px-6 py-4 text-center text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
          >
            Yeni Kampanya Oluştur
          </a>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-2xl font-semibold">Henüz kampanya yok</h2>
            <p className="mt-3 text-slate-400">
              İlk kampanyanı oluşturduğunda burada listelenecek.
            </p>

            <a
              href="/kampanya-olustur"
              className="mt-6 inline-block rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold hover:bg-blue-500"
            >
              İlk Kampanyayı Oluştur
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="mb-5 text-xl font-semibold">Kampanya Listesi</h2>

              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedCampaign?.id === campaign.id
                        ? "border-blue-500 bg-blue-500/15"
                        : "border-white/10 bg-slate-900 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">
                          {campaign.businessName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {campaign.sector} • {campaign.city}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                        {campaign.platform}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              {selectedCampaign ? (
                <>
                  <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {selectedCampaign.businessName}
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">
                        {selectedCampaign.goal}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatDate(selectedCampaign.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={copyOutput}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                      >
                        Çıktıyı Kopyala
                      </button>

                      <button
                        onClick={() => deleteCampaign(selectedCampaign.id)}
                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="mb-5 grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">Sektör</p>
                      <p className="mt-1 text-sm">{selectedCampaign.sector}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">Şehir</p>
                      <p className="mt-1 text-sm">{selectedCampaign.city}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">Bütçe</p>
                      <p className="mt-1 text-sm">{selectedCampaign.budget}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">Platform</p>
                      <p className="mt-1 text-sm">{selectedCampaign.platform}</p>
                    </div>
                  </div>

                  <pre className="max-h-[650px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-900 p-5 text-sm leading-7 text-slate-200">
                    {selectedCampaign.output}
                  </pre>
                </>
              ) : (
                <div className="flex min-h-[500px] items-center justify-center text-center text-slate-400">
                  Görüntülenecek kampanya seçilmedi.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}