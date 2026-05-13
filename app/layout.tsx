import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdMind-Ai | AI Marketing Panel",
  description:
    "KOBİ'ler için yapay zekâ destekli reklam stratejisi ve kampanya üretim paneli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}