"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const hiddenRoutes = [
  "/tanitim",
  "/auth/login",
  "/auth/sign-up",
  "/auth/confirm",
];

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const shouldHide = useMemo(() => {
    return hiddenRoutes.some((route) => pathname.startsWith(route));
  }, [pathname]);

  useEffect(() => {
    const dismissed = localStorage.getItem("admind_pwa_prompt_dismissed");
    if (dismissed === "true") return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

    setIsIOS(isAppleDevice);

    if (isStandalone) return;

    if (isAppleDevice) {
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 1200);

      return () => window.clearTimeout(timer);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (shouldHide || !isVisible) {
    return null;
  }

  async function handleInstall() {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setIsVisible(false);
      localStorage.setItem("admind_pwa_prompt_dismissed", "true");
    }
  }

  function handleDismiss() {
    setIsVisible(false);
    localStorage.setItem("admind_pwa_prompt_dismissed", "true");
  }

  return (
    <div className="fixed inset-x-3 bottom-28 z-[90] mx-auto max-w-md rounded-[1.5rem] border border-cyan-300/15 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl md:hidden">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-lg shadow-lg shadow-cyan-950/40">
          📱
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-white">
            AdMind-Ai’yi telefonuna ekle
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Paneli uygulama gibi açmak için ana ekrana ekleyebilirsin.
          </p>

          {isIOS ? (
            <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] leading-5 text-slate-300">
              iPhone’da: Paylaş butonu → <b>Ana Ekrana Ekle</b>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleInstall}
              disabled={!installEvent}
              className="mt-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-600/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Uygulama gibi yükle
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-black text-slate-300"
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;