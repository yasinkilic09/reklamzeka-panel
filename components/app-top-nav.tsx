"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MemberMenu } from "@/components/member-menu";

const navItems = [
  { title: "Dashboard", href: "/" },
  { title: "Kampanya Oluştur", href: "/kampanya-olustur" },
  { title: "Reklam Paketi", href: "/reklam-paketi" },
  { title: "Mesaj → Müşteri", href: "/mesajdan-musteriye" },
  { title: "Fırsat Takibi", href: "/firsat-takibi" },
  { title: "İşletme Profilleri", href: "/isletme-profilleri" },
  { title: "Geçmiş Kampanyalar", href: "/gecmis-kampanyalar" },
  { title: "Arşiv", href: "/arsivlenen-kampanyalar" },
];

export function AppTopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="relative z-[100] mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-500/20">
            <Image
              src="/logo.png"
              alt="AdMind-Ai Logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-tight text-white">
              AdMind-Ai
            </p>
            <p className="truncate text-xs text-slate-400">
              AI Marketing Panel
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 xl:flex">
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <MemberMenu />
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            aria-label="Menüyü aç"
          >
            {isMobileMenuOpen ? "Kapat" : "Menü"}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl xl:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                      : "bg-white/[0.035] text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}

            <Link
              href="/hesap"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive("/hesap")
                  ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20"
                  : "bg-white/[0.035] text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Hesap Merkezi
            </Link>
          </nav>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <MemberMenu />
          </div>
        </div>
      )}
    </div>
  );
}