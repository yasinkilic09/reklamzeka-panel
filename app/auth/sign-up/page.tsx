"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Lütfen tüm alanları doldur.");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı.");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      console.error(error);
      alert("Kayıt oluşturulamadı. Bu e-posta daha önce kullanılmış olabilir.");
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "user",
        updated_at: new Date().toISOString(),
      });
    }

    alert(
      "Hesap oluşturuldu. Supabase e-posta doğrulaması açıksa lütfen mail kutunu kontrol et."
    );

    router.push("/auth/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[460px] w-[460px] rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="absolute right-[-8%] top-[18%] h-[460px] w-[460px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[440px] w-[440px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
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
              <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-purple-200">
                Yeni Üyelik
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight">
                AdMind-Ai hesabını oluştur
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                İşletme profillerini kaydet, reklam paketi oluştur ve
                kampanyalarını tek panelden yönet.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Ad Soyad / Görünen İsim
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Örn: Muhammet Yasin Kılıç"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

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
                  placeholder="En az 6 karakter"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
              Zaten hesabın var mı?{" "}

              <div className="mt-4 text-center text-sm">
  <Link href="/tanitim" className="font-semibold text-slate-400 hover:text-cyan-200">
    Tanıtım sayfasına dön
  </Link>
</div>

              <Link
                href="/auth/login"
                className="font-bold text-cyan-200 hover:text-cyan-100"
              >
                Giriş yap
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-500">
            AdMind-Ai Teknokent MVP Paneli · Kullanıcı bazlı güvenli veri
            yönetimi
          </p>
        </div>

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
              Teknokent MVP Paneli
            </p>

            <h2 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Reklam üretim sürecini tek panelde başlat.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Kayıt olduktan sonra işletmeni ekleyebilir, reklam paketi
              oluşturabilir, kampanya çıktını kaydedebilir ve geçmiş
              kampanyalarını arşivleyebilirsin.
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-sm font-bold text-white">
              Başlangıç akışı
            </p>

            <div className="mt-5 grid gap-4">
              <StepItem number="1" text="Hesabını oluştur" />
              <StepItem number="2" text="İşletme profilini ekle" />
              <StepItem number="3" text="Reklam paketini oluştur" />
              <StepItem number="4" text="Kampanyanı kaydet ve yönet" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950">
        {number}
      </div>

      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}