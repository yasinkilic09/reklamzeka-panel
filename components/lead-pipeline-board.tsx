type LeadItem = {
  id: string;
  created_at?: string;
  business_name?: string | null;
  customer_name?: string | null;
  customer_contact?: string | null;
  customer_message?: string | null;
  lead_status?: string | null;
  lead_temperature?: string | null;
  lead_score?: number | null;
  channel?: string | null;
  message_type?: string | null;
};

type LeadPipelineBoardProps = {
  leads: LeadItem[];
};

const pipelineStages = [
  "Yeni",
  "İletişime Geçildi",
  "Teklif Gönderildi",
  "Randevu Alındı",
  "Kazandı",
];

export function LeadPipelineBoard({ leads }: LeadPipelineBoardProps) {
  const hotLeads = leads.filter((lead) => {
    const temperature = lead.lead_temperature?.toLowerCase() || "";
    const score = lead.lead_score || 0;

    return temperature.includes("sıcak") || score >= 80;
  });

  const riskLeads = leads.filter((lead) => {
    const temperature = lead.lead_temperature?.toLowerCase() || "";
    const status = lead.lead_status?.toLowerCase() || "";

    return temperature.includes("risk") || status.includes("kaybedildi");
  });

  const averageScore =
    leads.length > 0
      ? Math.round(
          leads.reduce((total, lead) => total + (lead.lead_score || 0), 0) /
            leads.length
        )
      : 0;

  const strongestLead = [...leads].sort(
    (a, b) => (b.lead_score || 0) - (a.lead_score || 0)
  )[0];

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-cyan-300/10 bg-white/[0.045] p-5 shadow-2xl shadow-cyan-950/25 backdrop-blur-2xl lg:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
            Fırsat Zekâ Paneli
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white lg:text-3xl">
            Müşteri adaylarını satış akışına göre analiz et
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            AdMind Core; sıcak fırsatları, riskli müşteri adaylarını ve satış
            sürecindeki aşamaları görsel olarak takip etmene yardımcı olur.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          LEAD INTELLIGENCE
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <IntelligenceCard
          label="Ortalama Skor"
          value={leads.length > 0 ? `${averageScore}/100` : "0/100"}
          description="Genel fırsat kalitesi"
          tone="cyan"
        />

        <IntelligenceCard
          label="Sıcak Fırsatlar"
          value={String(hotLeads.length)}
          description="Satışa yakın müşteri adayları"
          tone="emerald"
        />

        <IntelligenceCard
          label="Riskli Fırsatlar"
          value={String(riskLeads.length)}
          description="Dikkat gerektiren kayıtlar"
          tone="orange"
        />

        <IntelligenceCard
          label="En Güçlü Sinyal"
          value={
            strongestLead
              ? strongestLead.customer_name || strongestLead.business_name || "Fırsat var"
              : "Bekleniyor"
          }
          description={
            strongestLead
              ? `${strongestLead.lead_score || 0}/100 dönüşüm skoru`
              : "Henüz müşteri adayı yok"
          }
          tone="purple"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        {pipelineStages.map((stage) => {
          const stageLeads = leads.filter(
            (lead) => (lead.lead_status || "Yeni") === stage
          );

          return (
            <div
              key={stage}
              className="min-h-[190px] rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">{stage}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {stageLeads.length} fırsat
                  </p>
                </div>

                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-black text-cyan-200">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageLeads.slice(0, 2).map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {lead.customer_name || "İsimsiz müşteri"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {lead.business_name || "İşletme bilgisi yok"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-purple-300/20 bg-purple-300/10 px-2 py-1 text-[10px] font-black text-purple-200">
                        {lead.lead_score || 0}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
                        style={{
                          width: `${Math.min(Math.max(lead.lead_score || 0, 0), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-4 text-center">
                    <p className="text-xs leading-5 text-slate-500">
                      Bu aşamada henüz fırsat yok.
                    </p>
                  </div>
                )}

                {stageLeads.length > 2 && (
                  <p className="text-center text-xs font-semibold text-cyan-200">
                    +{stageLeads.length - 2} fırsat daha
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function IntelligenceCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  tone: "cyan" | "emerald" | "orange" | "purple";
}) {
  const toneClass = {
    cyan: "border-cyan-300/15 bg-cyan-300/[0.055] text-cyan-200",
    emerald: "border-emerald-300/15 bg-emerald-300/[0.055] text-emerald-200",
    orange: "border-orange-300/15 bg-orange-300/[0.055] text-orange-200",
    purple: "border-purple-300/15 bg-purple-300/[0.055] text-purple-200",
  }[tone];

  return (
    <div className={`rounded-[1.5rem] border p-5 ${toneClass}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 truncate text-2xl font-black text-white">{value}</p>

      <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

export default LeadPipelineBoard;