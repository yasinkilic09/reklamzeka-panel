const navItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Kampanya Oluştur",
    href: "/kampanya-olustur",
  },
  {
    title: "İşletme Profilleri",
    href: "/isletme-profilleri",
  },
  {
    title: "Geçmiş Kampanyalar",
    href: "/gecmis-kampanyalar",
  },
];

export function AppTopNav() {
  return (
    <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <a href="/" className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-black shadow-lg shadow-blue-600/20">
            RZ
          </div>

          <div>
            <p className="text-sm font-bold text-white">ReklamZekâ AI</p>
            <p className="text-xs text-slate-500">Teknokent MVP Paneli</p>
          </div>
        </a>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}