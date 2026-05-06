"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
};

export function MemberMenu() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          id: user.id,
          email: user.email || "Kullanıcı",
          full_name: null,
          role: "user",
        });
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const displayName = profile?.full_name || "AdMind-Ai Üyesi";
  const email = profile?.email || "Oturum yükleniyor...";
  const role = profile?.role || "user";

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-sm font-black text-white shadow-lg shadow-cyan-500/20">
          {initials || "AM"}
        </div>

        <div className="hidden max-w-[180px] sm:block">
          <p className="truncate text-sm font-semibold text-white">
            {displayName}
          </p>
          <p className="truncate text-xs text-slate-400">{email}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[9999] mt-3 w-80 rounded-3xl border border-white/10 bg-[#0B1220]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-base font-black text-white shadow-lg shadow-cyan-500/20">
              {initials || "AM"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-white">
                {displayName}
              </p>
              <p className="mt-1 truncate text-xs text-slate-400">{email}</p>

              <span className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200">
                {role}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <a
              href="/hesap"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Hesap Merkezi
            </a>

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-200 transition hover:bg-red-500/20"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}