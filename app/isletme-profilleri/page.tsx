"use client";

import { useEffect, useState } from "react";
import { AppTopNav } from "@/components/app-top-nav";

type BusinessProfile = {
  id: string;
  createdAt: string;
  businessName: string;
  sector: string;
  city: string;
  address: string;
  targetAudience: string;
  brandTone: string;
  instagram: string;
  phone: string;
  notes: string;
};

type BusinessForm = {
  businessName: string;
  sector: string;
  city: string;
  address: string;
  targetAudience: string;
  brandTone: string;
  instagram: string;
  phone: string;
  notes: string;
};

const initialForm: BusinessForm = {
  businessName: "",
  sector: "",
  city: "",
  address: "",
  targetAudience: "",
  brandTone: "Samimi ve güven veren",
  instagram: "",
  phone: "",
  notes: "",
};

const brandTones = [
  "Samimi ve güven veren",
  "Profesyonel ve kurumsal",
  "Genç ve dinamik",
  "Lüks ve prestijli",
  "Satış odaklı",
];

export default function BusinessProfilesPage() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [form, setForm] = useState<BusinessForm>(initialForm);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(
    null
  );

  useEffect(() => {
    const savedProfiles = JSON.parse(
      localStorage.getItem("reklamzeka_business_profiles") || "[]"
    ) as BusinessProfile[];

    setProfiles(savedProfiles);
    setSelectedProfile(savedProfiles[0] || null);
  }, []);

  function updateField(field: keyof BusinessForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveProfile() {
    if (!form.businessName.trim()) {
      alert("Lütfen işletme adını gir.");
      return;
    }

    const newProfile: BusinessProfile = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...form,
    };

    const updatedProfiles = [newProfile, ...profiles];

    localStorage.setItem(
      "reklamzeka_business_profiles",
      JSON.stringify(updatedProfiles)
    );

    setProfiles(updatedProfiles);
    setSelectedProfile(newProfile);
    setForm(initialForm);
  }

  function deleteProfile(id: string) {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);

    localStorage.setItem(
      "reklamzeka_business_profiles",
      JSON.stringify(updatedProfiles)
    );

    setProfiles(updatedProfiles);

    if (selectedProfile?.id === id) {
      setSelectedProfile(updatedProfiles[0] || null);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute right-[-8%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <AppTopNav />
        
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:flex-row lg:items-center">
          <div>
            <a
              href="/"
              className="inline-flex rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200 hover:bg-blue-500/20"
            >
              ← Dashboard'a dön
            </a>

            <h1 className="mt-5 text-3xl font-black tracking-tight lg:text-5xl">
              İşletme Profilleri
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
              Reklam kampanyası oluşturacağın markaları ve müşteri bilgilerini
              kaydet. Kampanya oluşturma ekranında bu profilleri seçerek formu
              otomatik doldurabilirsin.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Toplam işletme</p>
              <p className="mt-2 text-3xl font-black">{profiles.length}</p>
            </div>

            <a
              href="/kampanya-olustur"
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              Kampanya Oluştur
            </a>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Yeni İşletme Ekle</h2>
                <p className="mt-2 text-sm text-slate-400">
                  İşletme bilgileri kampanya üretiminde otomatik kullanılacak.
                </p>
              </div>

              <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                CRM Lite
              </span>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  İşletme adı
                </label>
                <input
                  value={form.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                  placeholder="Örn: Atlıbahçem"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Sektör
                  </label>
                  <input
                    value={form.sector}
                    onChange={(event) =>
                      updateField("sector", event.target.value)
                    }
                    placeholder="Örn: Restoran / Cafe"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Şehir
                  </label>
                  <input
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Örn: Aydın"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Adres
                </label>
                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Örn: Hayvan Pazarı yanı, Efeler / Aydın"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Hedef kitle
                </label>
                <input
                  value={form.targetAudience}
                  onChange={(event) =>
                    updateField("targetAudience", event.target.value)
                  }
                  placeholder="Örn: Aydın'da yaşayan aileler ve gençler"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Marka tonu
                  </label>
                  <select
                    value={form.brandTone}
                    onChange={(event) =>
                      updateField("brandTone", event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    {brandTones.map((tone) => (
                      <option key={tone}>{tone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Instagram
                  </label>
                  <input
                    value={form.instagram}
                    onChange={(event) =>
                      updateField("instagram", event.target.value)
                    }
                    placeholder="Örn: @atlibahcem"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Telefon
                </label>
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Örn: 05xx xxx xx xx"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Notlar
                </label>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Örn: Bahçeli, ailelere uygun, doğal ortam vurgusu yapılabilir."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
                />
              </div>

              <button
                onClick={saveProfile}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
              >
                İşletme Profilini Kaydet
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-bold">Kayıtlı İşletmeler</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Eklenen işletmeleri görüntüle ve kampanya akışında kullan.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {profiles.length} profil
              </span>
            </div>

            {profiles.length === 0 ? (
              <div className="flex min-h-[620px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/15 text-3xl">
                    ●
                  </div>
                  <p className="text-xl font-bold text-slate-100">
                    Henüz işletme profili yok.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    İlk işletmeyi eklediğinde burada listelenecek. Sonra kampanya
                    oluşturma ekranında bu işletmeyi seçebileceksin.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="max-h-[720px] space-y-3 overflow-auto pr-1">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedProfile?.id === profile.id
                          ? "border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-600/10"
                          : "border-white/10 bg-slate-950/70 hover:bg-white/10"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-black">
                          {profile.businessName.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-[11px] text-blue-200">
                          {profile.city || "Şehir yok"}
                        </span>
                      </div>

                      <h3 className="font-bold text-white">
                        {profile.businessName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {profile.sector || "Sektör yok"}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {formatDate(profile.createdAt)}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  {selectedProfile ? (
                    <>
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-base font-black shadow-lg shadow-blue-600/20">
                            {selectedProfile.businessName
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="text-2xl font-black">
                              {selectedProfile.businessName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                              {selectedProfile.sector || "Sektör yok"} •{" "}
                              {selectedProfile.city || "Şehir yok"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteProfile(selectedProfile.id)}
                          className="rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="grid gap-4 text-sm">
                        <InfoCard
                          title="Adres"
                          value={selectedProfile.address || "Belirtilmedi"}
                        />

                        <InfoCard
                          title="Hedef kitle"
                          value={
                            selectedProfile.targetAudience || "Belirtilmedi"
                          }
                        />

                        <InfoCard
                          title="Marka tonu"
                          value={selectedProfile.brandTone}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <InfoCard
                            title="Instagram"
                            value={selectedProfile.instagram || "Belirtilmedi"}
                          />

                          <InfoCard
                            title="Telefon"
                            value={selectedProfile.phone || "Belirtilmedi"}
                          />
                        </div>

                        <InfoCard
                          title="Notlar"
                          value={selectedProfile.notes || "Not yok"}
                        />
                      </div>

                      <a
                        href="/kampanya-olustur"
                        className="mt-6 block rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-center text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01]"
                      >
                        Bu İşletme İçin Kampanya Oluştur
                      </a>
                    </>
                  ) : (
                    <div className="flex min-h-[500px] items-center justify-center text-center text-slate-400">
                      Görüntülenecek işletme seçilmedi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap leading-6 text-slate-200">
        {value}
      </p>
    </div>
  );
}