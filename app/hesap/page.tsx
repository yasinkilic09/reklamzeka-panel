"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTopNav } from "@/components/app-top-nav";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [businessCount, setBusinessCount] = useState(0);
  const [activeCampaignCount, setActiveCampaignCount] = useState(0);
  const [archivedCampaignCount, setArchivedCampaignCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAccountData();
  }, []);

  async function loadAccountData() {
    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/auth/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .eq("id", user.id)
      .single();

    const currentProfile: Profile = profileData || {
      id: user.id,
      email: user.email || "E-posta bulunamadı",
      full_name: null,
      role: "user",
    };

    setProfile(currentProfile);
    setFullName(currentProfile.full_name || "");

    const [
      businessResponse,
      activeCampaignResponse,
      archivedCampaignResponse,
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
    ]);

    setBusinessCount(businessResponse.count || 0);
    setActiveCampaignCount(activeCampaignResponse.count || 0);
    setArchivedCampaignCount(archivedCampaignResponse.count || 0);

    setIsLoading(false);
  }

  async function updateProfile() {
    if (!profile) return;

    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      console.error(error);
      alert("Profil güncellenirken hata oluştu.");
      setIsSaving(false);
      return;
    }

    setProfile({
      ...profile,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    setIsSaving(false);
    alert("Profil bilgileri güncellendi.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const displayName = profile?.full_name || "AdMind-Ai Üyesi";
  const email = profile?.email || "Yükleniyor...";
  const role = profile?.role || "user";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <AppTopNav />

        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <a
            href="/"
            className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
          >
            ← Dashboard'a dön
          </a>

          <h1 className="mt-5 text-3xl font-black tracking-tight lg:text-5xl">
            Hesap Merkezi
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
            AdMind-Ai hesabına ait profil bilgilerini, üyelik durumunu ve
            kullanım özetini buradan görüntüleyebilirsin.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-300">Hesap bilgileri yükleniyor...</p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                  {initials || "AM"}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-black">
                    {displayName}
                  </h2>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {email}
                  </p>

                  <span className="mt-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200">
                    {role}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    E-posta
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{email}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Üyelik tipi
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {role === "admin" ? "Yönetici" : "Standart kullanıcı"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                  Çıkış Yap
                </button>
              </div>
            </section>

            <section className="space-y-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Profil Bilgileri</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Görünen adını buradan güncelleyebilirsin.
                  </p>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Ad Soyad / Görünen İsim
                    </label>
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Örn: Muhammet Yasin Kılıç"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                    />
                  </div>

                  <button
                    onClick={updateProfile}
                    disabled={isSaving}
                    className="w-fit rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Kaydediliyor..." : "Profili Güncelle"}
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Kullanım Özeti</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Hesabına bağlı işletme ve kampanya verileri.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <StatCard
                    title="İşletme Profili"
                    value={businessCount.toString()}
                    description="Kayıtlı işletme sayısı"
                  />

                  <StatCard
                    title="Aktif Kampanya"
                    value={activeCampaignCount.toString()}
                    description="Arşivlenmemiş kampanyalar"
                  />

                  <StatCard
                    title="Arşivlenen"
                    value={archivedCampaignCount.toString()}
                    description="Arşive alınan kampanyalar"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </div>
  );
}