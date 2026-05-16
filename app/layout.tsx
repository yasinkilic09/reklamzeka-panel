import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050712",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://admind-ai-gold.vercel.app"),
  title: "AdMind-Ai",
  description:
    "KOBİ’ler için yapay zekâ destekli reklam yönetim, müşteri dönüşüm ve sektör zekâsı platformu.",
  applicationName: "AdMind-Ai",
  appleWebApp: {
    capable: true,
    title: "AdMind-Ai",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
  <PWARegister />
  {children}
  <PWAInstallPrompt />
  <MobileBottomNav />
</body>
    </html>
  );
}