"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

type SupabaseBusinessProfile = {
  id: string;
  created_at: string;
  business_name: string;
  sector: string | null;
  city: string | null;
  address: string | null;
  target_audience: string | null;
  brand_tone: string | null;
  instagram: string | null;
  phone: string | null;
  notes: string | null;
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

function mapBusinessProfile(row: SupabaseBusinessProfile): BusinessProfile {
  return {
    id: row.id,
    createdAt: row.created_at,
    businessName: row.business_name,
    sector: row.sector || "",
    city: row.city || "",
    address: row.address || "",
    targetAudience: row.target_audience || "",
    brandTone: row.brand_tone || "Samimi ve güven veren",
    instagram: row.instagram || "",
    phone: row.phone || "",
    notes: row.notes || "",
  };
}

export default function BusinessProfilesPage() {
  const supabase = createClient();

  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [form, setForm] = useState<BusinessForm>(initialForm);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("İşletme profilleri yüklenirken hata oluştu.");
      setIsLoading(false);
      return;
    }

    const mappedProfiles = (data || []).map(mapBusinessProfile);

    setProfiles(mappedProfiles);
    setSelectedProfile(mappedProfiles[0] || null);
    setIsLoading(false);
  }

  function updateField(field: keyof BusinessForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile() {
    if (!form.businessName.trim()) {
      alert("Lütfen işletme adını gir.");
      return;
    }

    setIsSaving(true);

    const { data, error } = await supabase
      .from("business_profiles")
      .insert({
        business_name: form.businessName,
        sector: form.sector,
        city: form.city,
        address: form.address,
        target_audience: form.targetAudience,
        brand_tone: form.brandTone,
        instagram: form.instagram,
        phone: form.phone,
        notes: form.notes,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("İşletme profili kaydedilirken hata oluştu.");
      setIsSaving(false);
      return;
    }

    const newProfile = mapBusinessProfile(data as SupabaseBusinessProfile);
    const updatedProfiles = [newProfile, ...profiles];

    setProfiles(updatedProfiles);
    setSelectedProfile(newProfile);
    setForm(initialForm);
    setIsSaving(false);
  }

  async function deleteProfile(id: string) {
    const isConfirmed = confirm("Bu işletme profilini silmek istediğine emin misin?");
    if (!isConfirmed) return;

    const { error } = await supabase
      .from("business_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("İşletme profili silinirken hata oluştu.");
      return;
    }

    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
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
              Supabase veritabanına kaydet.
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
                  Bu bilgiler artık Supabase veritabanına kaydedilecek.
                </p>
              </div>

              <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                Supabase aktif
              </span>
            </div>

            <div className="grid gap-5">
              <InputField
                label="İşletme adı"
                value={form.businessName}
                onChange={(value) => updateField("businessName", value)}
                placeholder="Örn: Atlıbahçem"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Sektör"
                  value={form.sector}
                  onChange={(value) => updateField("sector", value)}
                  placeholder="Örn: Restoran / Cafe"
                />

                <InputField
                  label="Şehir"
                  value={form.city}
                  onChange={(value) => updateField("city", value)}
                  placeholder="Örn: Aydın"
                />
              </div>

              <InputField
                label="Adres"
                value={form.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Örn: Hayvan Pazarı yanı, Efeler / Aydın"
              />

              <InputField
                label="Hedef kitle"
                value={form.targetAudience}
                onChange={(value) => updateField("targetAudience", value)}
                placeholder="Örn: Aydın'da yaşayan aileler ve gençler"
              />

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

                <InputField
                  label="Instagram"
                  value={form.instagram}
                  onChange={(value) => updateField("instagram", value)}
                  placeholder="Örn: @atlibahcem"
                />
              </div>

              <InputField
                label="Telefon"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="Örn: 05xx xxx xx xx"
              />

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
                disabled={isSaving}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Kaydediliyor..." : "İşletme Profilini Kaydet"}
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-bold">Kayıtlı İşletmeler</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Veriler Supabase tablosundan okunuyor.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {profiles.length} profil
              </span>
            </div>

            {isLoading ? (
              <div className="flex min-h-[620px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <p className="text-slate-300">İşletmeler yükleniyor...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="flex min-h-[620px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/15 text-3xl">
                    ●
                  </div>
                  <p className="text-xl font-bold text-slate-100">
                    Henüz işletme profili yok.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                    İlk işletmeyi eklediğinde burada listelenecek.
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

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-blue-500/30 placeholder:text-slate-600 focus:ring-4"
      />
    </div>
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