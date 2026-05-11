"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Lütfen e-posta ve şifre alanlarını doldur.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      alert("Giriş yapılamadı. E-posta veya şifre hatalı olabilir.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[460px] w-[460px] rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="absolute right-[-8%] top-[18%] h-[460px] w-[460px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[440px] w-[440px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="hidden lg:block">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-cyan-500/20">
              <Image
                src="/logo.png"
                alt="AdMind-Ai Logo"
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                AdMind-Ai
              </h1>
              <p className="text-sm text-slate-400">
                AI Marketing Intelligence
              </p>
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Reklam yönetimini akıllandır
            </p>

            <h2 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              İşletmeler için daha hızlı, daha düzenli reklam üretimi.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              AdMind-Ai; işletme profilleri, reklam paketleri, kampanya arşivi
              ve akıllı aksiyon merkeziyle sosyal medya içerik üretimini tek
              panelde toplar.
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4 md:grid-cols-3">
            <FeatureCard
              title="Reklam Paketi"
              description="Post, story, reels ve CTA üret."
            />
            <FeatureCard
              title="Kampanya Arşivi"
              description="Çıktıları kaydet, kopyala ve yönet."
            />
            <FeatureCard
              title="Akıllı Panel"
              description="Sıradaki en doğru adımı gör."
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-4 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl shadow-cyan-500/20">
              <Image
                src="/logo.png"
                alt="AdMind-Ai Logo"
                width={56}
                height={56}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-xl font-black">AdMind-Ai</h1>
              <p className="text-xs text-slate-400">AI Marketing Panel</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.065] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <div className="mb-8">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Üye Girişi
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight">
                Hesabına giriş yap
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Reklam paketlerini, işletme profillerini ve kampanya geçmişini
                yönetmek için devam et.
              </p>
            </div>

            <form onSubmit={handleLogin} className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  E-posta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
              Hesabın yok mu?{" "}
              <Link
                href="/auth/sign-up"
                className="font-bold text-cyan-200 hover:text-cyan-100"
              >
                Yeni hesap oluştur
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-500">
            AdMind-Ai Teknokent MVP Paneli · Güvenli Supabase oturum altyapısı
          </p>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}