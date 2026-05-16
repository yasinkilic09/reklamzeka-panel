"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  {
    label: "Panel",
    href: "/",
    icon: "🏠",
  },
  {
    label: "Reklam",
    href: "/reklam-paketi",
    icon: "✨",
  },
  {
    label: "Mesaj",
    href: "/mesajdan-musteriye",
    icon: "💬",
  },
  {
    label: "Fırsat",
    href: "/firsat-takibi",
    icon: "🎯",
  },
  {
    label: "Karne",
    href: "/kampanya-karnesi",
    icon: "📊",
  },
];

const hiddenRoutes = [
  "/tanitim",
  "/auth/login",
  "/auth/sign-up",
  "/auth/confirm",
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHide) {
    return null;
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <div className="h-24 md:hidden" aria-hidden="true" />

      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-slate-950/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-1.5">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition ${
                  active
                    ? "bg-cyan-300/15 text-cyan-100 shadow-lg shadow-cyan-950/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;