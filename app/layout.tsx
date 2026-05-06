import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdMind AI | ReklamZekâ Panel",
  description:
    "KOBİ'ler için yapay zekâ destekli reklam stratejisi ve kampanya üretim paneli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}