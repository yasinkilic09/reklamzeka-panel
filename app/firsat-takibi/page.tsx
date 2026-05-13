"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";
import { LeadPipelineBoard } from "@/components/lead-pipeline-board";

type CustomerLead = {
  id: string;
  created_at: string;
  updated_at: string | null;
  business_name: string;
  sector: string | null;
  city: string | null;
  channel: string | null;
  message_type: string | null;
  customer_name: string | null;
  customer_contact: string | null;
  customer_message: string | null;
  lead_status: string;
  lead_temperature: string;
  lead_score: number;
  next_action: string | null;
  notes: string | null;
  generated_reply: string | null;
};

const leadStatuses = [
  "Yeni",
  "İletişime Geçildi",
  "Teklif Gönderildi",
  "Randevu Alındı",
  "Kazandı",
  "Kaybedildi",
];

export default function OpportunityTrackingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("Tümü");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
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
      .from("customer_leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Fırsatlar yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    setLeads(data || []);
    setIsLoading(false);
  }

  const filteredLeads = useMemo(() => {
    if (activeStatus === "Tümü") return leads;
    return leads.filter((lead) => lead.lead_status === activeStatus);
  }, [leads, activeStatus]);

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((lead) => lead.lead_status === "Kazandı").length;
    const active = leads.filter(
      (lead) =>
        lead.lead_status !== "Kazandı" && lead.lead_status !== "Kaybedildi"
    ).length;
    const hot = leads.filter((lead) => lead.lead_temperature === "Sıcak").length;

    return { total, won, active, hot };
  }, [leads]);

  async function updateLeadStatus(id: string, status: string) {
    const { error } = await supabase
      .from("customer_leads")
      .update({
        lead_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Durum güncellenemedi.");
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, lead_status: status, updated_at: new Date().toISOString() }
          : lead
      )
    );
  }

  async function deleteLead(id: string) {
    const confirmed = confirm("Bu müşteri adayını silmek istiyor musun?");
    if (!confirmed) return;

    const { error } = await supabase.from("customer_leads").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Müşteri adayı silinemedi.");
      return;
    }

    setLeads((current) => current.filter((lead) => lead.id !== id));
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
              >
                ← Dashboard'a dön
              </Link>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Reklamdan Gelen Potansiyeli Takip Et
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight lg:text-5xl">
                Fırsat Takibi
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Mesajdan Müşteriye özelliğiyle oluşan potansiyel müşterileri
                takip et. Yeni gelen fırsatları, randevuya dönüşenleri ve
                kazanılan müşterileri tek ekranda yönet.
              </p>
            </div>

            <Link
              href="/mesajdan-musteriye"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-center text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
            >
              Yeni Fırsat Oluştur
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Toplam Fırsat" value={stats.total} />
          <StatCard label="Aktif Takip" value={stats.active} />
          <StatCard label="Sıcak Fırsat" value={stats.hot} />
          <StatCard label="Kazanılan" value={stats.won} />
        </section>

        <LeadPipelineBoard leads={leads} />

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-wrap gap-3">
            {["Tümü", ...leadStatuses].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  activeStatus === status
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Fırsatlar yükleniyor...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-3xl">
              🎯
            </div>

            <h2 className="text-2xl font-black">Henüz fırsat yok</h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Mesajdan Müşteriye sayfasında cevap paketi oluşturduktan sonra
              müşteri adayını Fırsat Takibi’ne kaydedebilirsin.
            </p>

            <Link
              href="/mesajdan-musteriye"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-sm font-black shadow-lg shadow-blue-600/30"
            >
              Mesajdan Müşteriye Git
            </Link>
          </div>
        ) : (
          <section className="grid gap-5">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge text={lead.lead_temperature} />
                      <Badge text={`${lead.lead_score}/100`} />
                      {lead.channel && <Badge text={lead.channel} />}
                      {lead.message_type && <Badge text={lead.message_type} />}
                    </div>

                    <h2 className="mt-4 text-2xl font-black">
                      {lead.customer_name || "İsimsiz müşteri adayı"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      {lead.business_name}
                      {lead.city ? ` · ${lead.city}` : ""}
                      {lead.sector ? ` · ${lead.sector}` : ""}
                    </p>

                    {lead.customer_contact && (
                      <p className="mt-2 text-sm text-cyan-200">
                        İletişim: {lead.customer_contact}
                      </p>
                    )}

                    {lead.customer_message && (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Müşteri Mesajı
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                          {lead.customer_message}
                        </p>
                      </div>
                    )}

                    {lead.next_action && (
                      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                          Sonraki Aksiyon
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {lead.next_action}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3 xl:w-72">
                    <select
                      value={lead.lead_status}
                      onChange={(event) =>
                        updateLeadStatus(lead.id, event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 focus:ring-4"
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {lead.generated_reply && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            lead.generated_reply || ""
                          );
                          alert("Cevap paketi kopyalandı.");
                        }}
                        className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                      >
                        Cevabı Kopyala
                      </button>
                    )}

                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
      {text}
    </span>
  );
}