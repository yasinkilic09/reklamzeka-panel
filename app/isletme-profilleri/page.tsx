"use client";

import { useEffect, useState } from "react";

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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <a
              href="/"
              className="text-sm font-medium text-blue-300 hover:text-blue-200"
            >
              ← Dashboard'a dön
            </a>

            <h1 className="mt-6 text-4xl font-bold tracking-tight">
              İşletme Profilleri
            </h1>

            <p className="mt-3 max-w-3xl text-slate-300">
              Reklam kampanyası oluşturacağın işletmeleri kaydet. Daha sonra bu
              profilleri kampanya oluşturma ekranına bağlayacağız.
            </p>
          </div>

          <a
            href="/kampanya-olustur"
            className="rounded-2xl bg-blue-600 px-6 py-4 text-center text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
          >
            Kampanya Oluştur
          </a>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Yeni işletme ekle</h2>

            <div className="mt-6 grid gap-5">
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
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 focus:ring-4"
                  >
                    <option>Samimi ve güven veren</option>
                    <option>Profesyonel ve kurumsal</option>
                    <option>Genç ve dinamik</option>
                    <option>Lüks ve prestijli</option>
                    <option>Satış odaklı</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Instagram kullanıcı adı
                  </label>
                  <input
                    value={form.instagram}
                    onChange={(event) =>
                      updateField("instagram", event.target.value)
                    }
                    placeholder="Örn: @atlibahcem"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
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
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Notlar
                </label>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Örn: Hafta sonları yoğun, ailelere hitap ediyor, bahçeli mekan..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-500 focus:ring-4"
                />
              </div>

              <button
                onClick={saveProfile}
                className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                İşletme Profilini Kaydet
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Kayıtlı işletmeler</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Toplam {profiles.length} işletme profili
                </p>
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center">
                <div>
                  <p className="text-lg font-medium text-slate-200">
                    Henüz işletme profili yok.
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    İlk işletmeyi eklediğinde burada görünecek.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-3">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedProfile?.id === profile.id
                          ? "border-blue-500 bg-blue-500/15"
                          : "border-white/10 bg-slate-900 hover:bg-white/10"
                      }`}
                    >
                      <h3 className="font-semibold">{profile.businessName}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {profile.sector || "Sektör yok"} •{" "}
                        {profile.city || "Şehir yok"}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatDate(profile.createdAt)}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                  {selectedProfile ? (
                    <>
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold">
                            {selectedProfile.businessName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {selectedProfile.sector} • {selectedProfile.city}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteProfile(selectedProfile.id)}
                          className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-slate-500">Adres</p>
                          <p className="mt-1 text-slate-200">
                            {selectedProfile.address || "Belirtilmedi"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Hedef kitle</p>
                          <p className="mt-1 text-slate-200">
                            {selectedProfile.targetAudience || "Belirtilmedi"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Marka tonu</p>
                          <p className="mt-1 text-slate-200">
                            {selectedProfile.brandTone}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Instagram</p>
                          <p className="mt-1 text-slate-200">
                            {selectedProfile.instagram || "Belirtilmedi"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Telefon</p>
                          <p className="mt-1 text-slate-200">
                            {selectedProfile.phone || "Belirtilmedi"}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Notlar</p>
                          <p className="mt-1 whitespace-pre-wrap text-slate-200">
                            {selectedProfile.notes || "Not yok"}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex min-h-[400px] items-center justify-center text-center text-slate-400">
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