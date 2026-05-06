"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Kampanya Oluştur",
    href: "/kampanya-olustur",
  },
  {
    title: "İşletme Profilleri",
    href: "/isletme-profilleri",
  },
  {
    title: "Geçmiş Kampanyalar",
    href: "/gecmis-kampanyalar",
  },
];

export function AppTopNav() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <a href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-blue-600/20">
  <Image
    src="/logo.png"
    alt="AdMind AI Logo"
    width={40}
    height={40}
    className="h-full w-full object-cover"
  />
</div>

          <div>
           <p className="text-sm font-bold text-white">AdMind-Ai</p>
<p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
  AI Marketing Panel
</p>
          </div>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}