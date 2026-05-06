const stats = [
  {
    title: "Toplam Kampanya",
    value: "12",
    description: "Bu ay oluşturulan reklam kampanyaları",
  },
  {
    title: "AI Reklam Metni",
    value: "48",
    description: "Yapay zekâ ile üretilen metinler",
  },
  {
    title: "Tahmini Performans",
    value: "%82",
    description: "Ortalama kampanya başarı skoru",
  },
  {
    title: "Aktif İşletme",
    value: "4",
    description: "Panele eklenen işletme profilleri",
  },
];

const campaigns = [
  {
    business: "Atlıbahçem",
    sector: "Restoran / Cafe",
    goal: "Instagram müşteri kazanımı",
    budget: "10.000 TL",
    status: "Analiz hazır",
  },
  {
    business: "Nodus Medya",
    sector: "Reklam Ajansı",
    goal: "Marka bilinirliği",
    budget: "15.000 TL",
    status: "Taslak",
  },
  {
    business: "GÖKTUĞ Motor",
    sector: "Motosiklet Servisi",
    goal: "Yerel müşteri kazanımı",
    budget: "7.500 TL",
    status: "Yayına uygun",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-900/70 p-6 lg:block">
          <div className="mb-10">
            <div className="text-2xl font-bold tracking-tight">
              ReklamZekâ AI
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Yapay zekâ destekli reklam yönetim paneli
            </p>
          </div>

          <nav className="space-y-2 text-sm">
            <a className="block rounded-xl bg-blue-600 px-4 py-3 font-medium">
              Dashboard
            </a>
            <a
  href="/kampanya-olustur"
  className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10"
>
  Kampanya Oluştur
</a>
            <a
  href="/isletme-profilleri"
  className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10"
>
  İşletme Profilleri
</a>
            <a className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10">
              AI Sonuçları
            </a>
           <a
  href="/gecmis-kampanyalar"
  className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10"
>
  Geçmiş Kampanyalar
</a>
            <a className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-white/10">
              Ayarlar
            </a>
          </nav>
        </aside>

        <section className="flex-1 p-6 lg:p-10">
          <header className="mb-10 flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-blue-950/30 lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-300">
                Teknokent MVP Paneli
              </p>
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
                Reklam kampanyalarını AI ile planla.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                İşletme bilgilerini gir, hedef kitleyi belirle ve yapay zekâdan
                reklam metni, bütçe önerisi, içerik fikri ve performans tahmini
                al.
              </p>
            </div>

            <a
  href="/kampanya-olustur"
  className="rounded-2xl bg-blue-600 px-6 py-4 text-center text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
>
  Yeni Kampanya Oluştur
</a>
          </header>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm text-slate-400">{item.title}</p>
                <div className="mt-4 text-4xl font-bold">{item.value}</div>
                <p className="mt-3 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Son Kampanyalar</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Oluşturulan örnek reklam planları
                  </p>
                </div>
                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                  Tümünü Gör
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.06] text-slate-300">
                    <tr>
                      <th className="px-4 py-3 font-medium">İşletme</th>
                      <th className="px-4 py-3 font-medium">Sektör</th>
                      <th className="px-4 py-3 font-medium">Hedef</th>
                      <th className="px-4 py-3 font-medium">Bütçe</th>
                      <th className="px-4 py-3 font-medium">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr
                        key={campaign.business}
                        className="border-t border-white/10"
                      >
                        <td className="px-4 py-4 font-medium">
                          {campaign.business}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {campaign.sector}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {campaign.goal}
                        </td>
                        <td className="px-4 py-4 text-slate-300">
                          {campaign.budget}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6">
              <h2 className="text-xl font-semibold">AI Reklam Motoru</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Bir sonraki aşamada bu alana sektör, hedef kitle, bütçe ve
                kampanya amacı girilecek. Sistem otomatik olarak reklam metni,
                hedefleme önerisi ve içerik planı üretecek.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-medium">Örnek çıktı</p>
                  <p className="mt-2 text-sm text-slate-300">
                    “Aydın’daki restoranlar için hafta sonu rezervasyonlarını
                    artırmaya yönelik Instagram reklam kampanyası.”
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-medium">Yaklaşan özellik</p>
                  <p className="mt-2 text-sm text-slate-300">
                    OpenAI API bağlantısı, Supabase kayıt sistemi ve kampanya
                    geçmişi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}