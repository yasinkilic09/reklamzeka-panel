"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

type Campaign = {
  id: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  goal: string | null;
  platform: string | null;
  created_at: string;
};

type CampaignReport = {
  id: string;
  created_at: string;
  business_name: string;
  campaign_goal: string | null;
  platform: string | null;
  budget_spent: number;
  messages: number;
  leads: number;
  customers_won: number;
  estimated_revenue: number;
  roas: number;
  performance_score: number;
  performance_label: string | null;
};

export default function CampaignScorecardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reports, setReports] = useState<CampaignReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [platform, setPlatform] = useState("");

  const [budgetSpent, setBudgetSpent] = useState("");
  const [impressions, setImpressions] = useState("");
  const [reach, setReach] = useState("");
  const [clicks, setClicks] = useState("");
  const [messages, setMessages] = useState("");
  const [leads, setLeads] = useState("");
  const [customersWon, setCustomersWon] = useState("");
  const [estimatedRevenue, setEstimatedRevenue] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/auth/login");
      return;
    }

    setUserId(user.id);

    const { data: campaignData, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, business_name, sector, city, goal, platform, created_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });

    if (campaignError) {
      console.error(campaignError);
      alert("Kampanyalar yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    const { data: reportData, error: reportError } = await supabase
      .from("campaign_reports")
      .select(
        "id, created_at, business_name, campaign_goal, platform, budget_spent, messages, leads, customers_won, estimated_revenue, roas, performance_score, performance_label"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6);

    if (reportError) {
      console.error(reportError);
      alert("Kampanya karneleri yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    setCampaigns(campaignData || []);
    setReports(reportData || []);
    setIsLoading(false);
  }

  function selectCampaign(campaignId: string) {
    setSelectedCampaignId(campaignId);

    const campaign = campaigns.find((item) => item.id === campaignId);
    if (!campaign) return;

    setBusinessName(campaign.business_name || "");
    setCampaignGoal(campaign.goal || "");
    setPlatform(campaign.platform || "");
  }

  const scorecard = useMemo(() => {
    const budget = parseMetric(budgetSpent);
    const impressionCount = parseMetric(impressions);
    const reachCount = parseMetric(reach);
    const clickCount = parseMetric(clicks);
    const messageCount = parseMetric(messages);
    const leadCount = parseMetric(leads);
    const wonCount = parseMetric(customersWon);
    const revenue = parseMetric(estimatedRevenue);

    const ctr = percentage(clickCount, impressionCount);
    const cpm = impressionCount > 0 ? (budget / impressionCount) * 1000 : 0;
    const cpc = safeDivide(budget, clickCount);
    const costPerMessage = safeDivide(budget, messageCount);
    const costPerLead = safeDivide(budget, leadCount);
    const customerAcquisitionCost = safeDivide(budget, wonCount);
    const leadConversionRate = percentage(leadCount, messageCount);
    const customerConversionRate = percentage(wonCount, leadCount);
    const roas = safeDivide(revenue, budget);

    const score = calculatePerformanceScore({
      roas,
      leadConversionRate,
      customerConversionRate,
      costPerLead,
      budget,
      leadCount,
      wonCount,
      messageCount,
      ctr,
    });

    const label = getPerformanceLabel(score);
    const diagnosis = getDiagnosis({
      score,
      messageCount,
      leadCount,
      wonCount,
      roas,
      ctr,
      leadConversionRate,
      customerConversionRate,
    });

    const recommendation = getRecommendation({
      score,
      messageCount,
      leadCount,
      wonCount,
      roas,
      ctr,
      leadConversionRate,
      customerConversionRate,
    });

    return {
      budget,
      impressionCount,
      reachCount,
      clickCount,
      messageCount,
      leadCount,
      wonCount,
      revenue,
      ctr,
      cpm,
      cpc,
      costPerMessage,
      costPerLead,
      customerAcquisitionCost,
      leadConversionRate,
      customerConversionRate,
      roas,
      score,
      label,
      diagnosis,
      recommendation,
    };
  }, [
    budgetSpent,
    impressions,
    reach,
    clicks,
    messages,
    leads,
    customersWon,
    estimatedRevenue,
  ]);

  async function saveReport() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }

    if (!businessName.trim()) {
      alert("Karnenin kaydedilmesi için işletme adı gerekli.");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("campaign_reports").insert({
      user_id: userId,
      campaign_id: selectedCampaignId || null,

      business_name: businessName,
      campaign_goal: campaignGoal,
      platform,

      budget_spent: scorecard.budget,
      impressions: scorecard.impressionCount,
      reach: scorecard.reachCount,
      clicks: scorecard.clickCount,
      messages: scorecard.messageCount,
      leads: scorecard.leadCount,
      customers_won: scorecard.wonCount,
      estimated_revenue: scorecard.revenue,

      ctr: scorecard.ctr,
      cpm: scorecard.cpm,
      cpc: scorecard.cpc,
      cost_per_message: scorecard.costPerMessage,
      cost_per_lead: scorecard.costPerLead,
      customer_acquisition_cost: scorecard.customerAcquisitionCost,
      lead_conversion_rate: scorecard.leadConversionRate,
      customer_conversion_rate: scorecard.customerConversionRate,
      roas: scorecard.roas,

      performance_score: scorecard.score,
      performance_label: scorecard.label,
      diagnosis: scorecard.diagnosis,
      recommendation: scorecard.recommendation,
      notes,
    });

    if (error) {
      console.error(error);
      alert("Kampanya karnesi kaydedilemedi.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    alert("Kampanya karnesi kaydedildi.");
    loadPageData();
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
          <Link
            href="/"
            className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
          >
            ← Dashboard'a dön
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                Reklam Sonucunu Ölç
              </p>

              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                Kampanya Karnesi
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                Reklam bütçesi, tıklama, mesaj, fırsat ve müşteri kazanım
                verilerini gir. AdMind-Ai kampanyanın performans skorunu,
                dönüşüm oranlarını ve sonraki aksiyon önerisini hesaplasın.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                Analiz Modu
              </p>
              <p className="mt-2 text-lg font-black text-white">
                Reklam → Mesaj → Fırsat → Müşteri
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Kampanya karnesi hazırlanıyor...</p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="text-2xl font-black">Kampanya Verileri</h2>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                Veriler manuel girilir. Daha sonra Meta/Instagram API
                entegrasyonu geldiğinde bu alanlar otomatik çekilebilir.
              </p>

              <div className="mt-6 grid gap-5">
                {campaigns.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Kampanya Seç
                    </label>

                    <select
                      value={selectedCampaignId}
                      onChange={(event) => selectCampaign(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 focus:ring-4"
                    >
                      <option value="">Manuel kampanya gir</option>

                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.business_name} —{" "}
                          {campaign.goal || "Kampanya"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <InputField
                  label="İşletme Adı"
                  value={businessName}
                  onChange={setBusinessName}
                  placeholder="Örn: Atlıbahçem"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Kampanya Hedefi"
                    value={campaignGoal}
                    onChange={setCampaignGoal}
                    placeholder="Örn: Mesaj alma, rezervasyon, satış"
                  />

                  <InputField
                    label="Platform"
                    value={platform}
                    onChange={setPlatform}
                    placeholder="Örn: Instagram, Meta Ads"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Harcanan Bütçe ₺"
                    value={budgetSpent}
                    onChange={setBudgetSpent}
                    placeholder="Örn: 1500"
                    inputMode="decimal"
                  />

                  <InputField
                    label="Tahmini Gelir ₺"
                    value={estimatedRevenue}
                    onChange={setEstimatedRevenue}
                    placeholder="Örn: 6500"
                    inputMode="decimal"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <InputField
                    label="Gösterim"
                    value={impressions}
                    onChange={setImpressions}
                    placeholder="Örn: 25000"
                    inputMode="numeric"
                  />

                  <InputField
                    label="Erişim"
                    value={reach}
                    onChange={setReach}
                    placeholder="Örn: 12000"
                    inputMode="numeric"
                  />

                  <InputField
                    label="Tıklama"
                    value={clicks}
                    onChange={setClicks}
                    placeholder="Örn: 420"
                    inputMode="numeric"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <InputField
                    label="Gelen Mesaj"
                    value={messages}
                    onChange={setMessages}
                    placeholder="Örn: 36"
                    inputMode="numeric"
                  />

                  <InputField
                    label="Oluşan Fırsat"
                    value={leads}
                    onChange={setLeads}
                    placeholder="Örn: 14"
                    inputMode="numeric"
                  />

                  <InputField
                    label="Kazanılan Müşteri"
                    value={customersWon}
                    onChange={setCustomersWon}
                    placeholder="Örn: 5"
                    inputMode="numeric"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Notlar
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Örn: Bu kampanyada story paylaşımı daha iyi dönüş aldı."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                  />
                </div>

                <button
                  onClick={saveReport}
                  disabled={isSaving}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Kaydediliyor..." : "Kampanya Karnesini Kaydet"}
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Performans Analizi
                  </p>

                  <h2 className="mt-3 text-2xl font-black">
                    Reklam Sonuç Karnesi
                  </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Skor
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {scorecard.score}
                    <span className="text-lg text-slate-500">/100</span>
                  </p>
                  <p className="mt-1 text-sm font-bold text-cyan-200">
                    {scorecard.label}
                  </p>
                </div>
              </div>

              <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${scorecard.score}%` }}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard label="CTR" value={`${formatNumber(scorecard.ctr)}%`} />
                <MetricCard label="CPM" value={`${formatCurrency(scorecard.cpm)}`} />
                <MetricCard label="CPC" value={`${formatCurrency(scorecard.cpc)}`} />
                <MetricCard
                  label="Mesaj Başı Maliyet"
                  value={`${formatCurrency(scorecard.costPerMessage)}`}
                />
                <MetricCard
                  label="Fırsat Başı Maliyet"
                  value={`${formatCurrency(scorecard.costPerLead)}`}
                />
                <MetricCard
                  label="Müşteri Kazanım Maliyeti"
                  value={`${formatCurrency(scorecard.customerAcquisitionCost)}`}
                />
                <MetricCard
                  label="Mesajdan Fırsata Dönüşüm"
                  value={`${formatNumber(scorecard.leadConversionRate)}%`}
                />
                <MetricCard
                  label="Fırsattan Müşteriye Dönüşüm"
                  value={`${formatNumber(scorecard.customerConversionRate)}%`}
                />
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  ROAS / Geri Dönüş
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {formatNumber(scorecard.roas)}x
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Harcanan her 1 TL için yaklaşık {formatNumber(scorecard.roas)} TL gelir.
                </p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm font-black text-white">Teşhis</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {scorecard.diagnosis}
                </p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm font-black text-cyan-200">
                  Sonraki Aksiyon Önerisi
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {scorecard.recommendation}
                </p>
              </div>
            </section>

            <section className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-purple-300">
                    Kayıtlı Analizler
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Son Kampanya Karneleri
                  </h2>
                </div>
              </div>

              {reports.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
                  Henüz kayıtlı kampanya karnesi yok.
                </p>
              ) : (
                <div className="grid gap-5 lg:grid-cols-3">
                  {reports.map((report) => (
                    <article
                      key={report.id}
                      className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-black text-white">
                            {report.business_name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(report.created_at)}
                          </p>
                        </div>

                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                          {report.performance_score}/100
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-400">
                        {report.campaign_goal || "Kampanya analizi"}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm">
                        <SmallLine
                          label="Bütçe"
                          value={formatCurrency(report.budget_spent)}
                        />
                        <SmallLine
                          label="Mesaj"
                          value={String(report.messages)}
                        />
                        <SmallLine
                          label="Fırsat"
                          value={String(report.leads)}
                        />
                        <SmallLine
                          label="Müşteri"
                          value={String(report.customers_won)}
                        />
                        <SmallLine
                          label="ROAS"
                          value={`${formatNumber(report.roas)}x`}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  inputMode = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "text" | "numeric" | "decimal";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function SmallLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-200">{value}</span>
    </div>
  );
}

function parseMetric(value: string) {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeDivide(value: number, divider: number) {
  if (!divider || divider <= 0) return 0;
  return value / divider;
}

function percentage(value: number, total: number) {
  if (!total || total <= 0) return 0;
  return (value / total) * 100;
}

function calculatePerformanceScore({
  roas,
  leadConversionRate,
  customerConversionRate,
  costPerLead,
  budget,
  leadCount,
  wonCount,
  messageCount,
  ctr,
}: {
  roas: number;
  leadConversionRate: number;
  customerConversionRate: number;
  costPerLead: number;
  budget: number;
  leadCount: number;
  wonCount: number;
  messageCount: number;
  ctr: number;
}) {
  let score = 20;

  if (ctr >= 1.5) score += 12;
  else if (ctr >= 0.8) score += 8;
  else if (ctr > 0) score += 4;

  if (messageCount >= 30) score += 12;
  else if (messageCount >= 10) score += 8;
  else if (messageCount > 0) score += 4;

  if (leadConversionRate >= 40) score += 14;
  else if (leadConversionRate >= 20) score += 9;
  else if (leadConversionRate > 0) score += 5;

  if (customerConversionRate >= 35) score += 16;
  else if (customerConversionRate >= 15) score += 10;
  else if (customerConversionRate > 0) score += 5;

  if (roas >= 4) score += 18;
  else if (roas >= 2) score += 12;
  else if (roas >= 1) score += 7;
  else if (roas > 0) score += 3;

  if (budget > 0 && leadCount > 0 && costPerLead <= budget * 0.1) {
    score += 8;
  }

  if (wonCount > 0) score += 10;

  return Math.min(100, Math.round(score));
}

function getPerformanceLabel(score: number) {
  if (score >= 85) return "Çok Güçlü";
  if (score >= 70) return "Başarılı";
  if (score >= 50) return "Geliştirilebilir";
  if (score >= 30) return "Zayıf";
  return "Veri Eksik";
}

function getDiagnosis({
  score,
  messageCount,
  leadCount,
  wonCount,
  roas,
  ctr,
  leadConversionRate,
  customerConversionRate,
}: {
  score: number;
  messageCount: number;
  leadCount: number;
  wonCount: number;
  roas: number;
  ctr: number;
  leadConversionRate: number;
  customerConversionRate: number;
}) {
  if (score < 30) {
    return "Bu kampanyada yeterli veri oluşmamış veya sonuçlar zayıf görünüyor. Önce reklam içeriği, hedef kitle ve mesaj çağrısı gözden geçirilmeli.";
  }

  if (messageCount > 0 && leadCount === 0) {
    return "Kampanya mesaj almış fakat bu mesajlar fırsata dönüşmemiş. Sorun reklamda değil, cevap ve takip sürecinde olabilir.";
  }

  if (leadCount > 0 && wonCount === 0) {
    return "Kampanya fırsat üretmiş ancak müşteri kazanımına dönüşmemiş. Fiyat, takip mesajı veya randevu sürecinde iyileştirme gerekebilir.";
  }

  if (roas >= 3 && customerConversionRate >= 20) {
    return "Kampanya hem gelir hem müşteri kazanımı açısından güçlü görünüyor. Benzer hedef kitle ve mesaj yapısıyla tekrar ölçeklenebilir.";
  }

  if (ctr < 0.8 && messageCount < 10) {
    return "Tıklama ve mesaj oranı düşük. Görsel, başlık, teklif veya hedef kitle daha dikkat çekici hale getirilmeli.";
  }

  if (leadConversionRate >= 30 && customerConversionRate < 15) {
    return "Mesajdan fırsata geçiş iyi; fakat fırsattan müşteriye dönüşüm zayıf. Satış kapatma ve takip akışı güçlendirilmeli.";
  }

  return "Kampanya orta düzeyde performans gösteriyor. Daha net teklif, güçlü çağrı metni ve düzenli takip ile sonuçlar artırılabilir.";
}

function getRecommendation({
  score,
  messageCount,
  leadCount,
  wonCount,
  roas,
  ctr,
  leadConversionRate,
  customerConversionRate,
}: {
  score: number;
  messageCount: number;
  leadCount: number;
  wonCount: number;
  roas: number;
  ctr: number;
  leadConversionRate: number;
  customerConversionRate: number;
}) {
  if (score >= 85) {
    return "Bu kampanya ölçeklenebilir. Aynı kreatif yaklaşım korunarak bütçe kademeli artırılabilir ve yeni reklam varyasyonları test edilebilir.";
  }

  if (messageCount > 0 && leadCount === 0) {
    return "Mesajdan Müşteriye sayfasında bu kampanya için daha güçlü cevap akışları oluştur. Gelen mesajları Fırsat Takibi’ne kaydet.";
  }

  if (leadCount > 0 && wonCount === 0) {
    return "Fırsat Takibi ekranında sıcak fırsatlara tekrar dönüş yap. WhatsApp takip mesajı ve randevu çağrısı kullan.";
  }

  if (ctr < 0.8) {
    return "Reklam başlığını ve ilk görseli değiştir. Daha net teklif, daha kısa metin ve daha güçlü CTA ile yeni reklam paketi üret.";
  }

  if (roas < 1 && score < 60) {
    return "Bu kampanya aynı haliyle devam ettirilmemeli. Hedef kitle, teklif ve görsel içerik yeniden hazırlanmalı.";
  }

  if (customerConversionRate < 15 && leadConversionRate > 20) {
    return "Sorun reklamdan çok satış kapatma sürecinde olabilir. Kararsız müşteri takip mesajı ve teklif kapanış metni kullan.";
  }

  return "Kampanyayı küçük optimizasyonlarla sürdür. Daha net hedef kitle, farklı başlık varyasyonları ve düzenli müşteri takibiyle skor yükseltilebilir.";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}