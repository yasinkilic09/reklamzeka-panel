import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AdMind-Ai - AI Reklam Asistanı",
    short_name: "AdMind-Ai",
    description:
      "KOBİ’ler için yapay zekâ destekli reklam yönetim, müşteri dönüşüm ve sektör zekâsı platformu.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050712",
    theme_color: "#050712",
    categories: ["business", "productivity", "marketing"],
    lang: "tr",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}