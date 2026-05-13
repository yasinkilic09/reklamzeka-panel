export function AIOrb() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/10 bg-white/[0.045] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:rounded-[2rem] sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full animate-pulse bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
            AdMind Core
          </p>

          <h3 className="mt-1 text-xl font-black tracking-tight text-white">
            Öğrenen AI Reklam Asistanı
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Her kampanya, görsel brief, müşteri mesajı ve performans verisiyle
            karar hafızasını güçlendirir.
          </p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          LEARNING
        </div>
      </div>

      <div className="relative flex items-center justify-center py-4">
        <div className="relative h-36 w-36 sm:h-48 sm:w-48 lg:h-52 lg:w-52">
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />

          <div className="absolute inset-0 animate-[spin_20s_linear_infinite] rounded-full border border-cyan-300/20">
            <div className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.95)]" />
          </div>

          <div className="absolute inset-5 animate-[spin_14s_linear_infinite_reverse] rounded-full border border-purple-300/20">
            <div className="absolute bottom-[-4px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-purple-300 shadow-[0_0_20px_rgba(216,180,254,0.95)]" />
          </div>

          <div className="absolute inset-11 animate-[spin_8s_linear_infinite] rounded-full border border-blue-300/25">
            <div className="absolute right-[-4px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(147,197,253,0.95)]" />
          </div>

          <div className="absolute left-[8%] top-[32%] h-px w-[84%] animate-pulse bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
          <div className="absolute left-[15%] top-[58%] h-px w-[70%] animate-pulse bg-gradient-to-r from-transparent via-purple-300/35 to-transparent" />
          <div className="absolute left-[28%] top-[18%] h-[64%] w-px animate-pulse bg-gradient-to-b from-transparent via-blue-300/25 to-transparent" />
          <div className="absolute right-[28%] top-[18%] h-[64%] w-px animate-pulse bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent" />

          <div className="absolute left-[18%] top-[24%] h-2 w-2 animate-ping rounded-full bg-cyan-300/80" />
          <div className="absolute right-[20%] top-[34%] h-2 w-2 animate-ping rounded-full bg-blue-300/80 [animation-delay:700ms]" />
          <div className="absolute bottom-[24%] left-[26%] h-2 w-2 animate-ping rounded-full bg-purple-300/80 [animation-delay:1200ms]" />
          <div className="absolute bottom-[28%] right-[26%] h-2 w-2 animate-ping rounded-full bg-emerald-300/80 [animation-delay:1600ms]" />

          <div className="absolute inset-[31%] animate-pulse rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-500 shadow-[0_0_60px_rgba(59,130,246,0.55)]" />
          <div className="absolute inset-[39%] rounded-full border border-white/25 bg-white/10 backdrop-blur-xl shadow-[inset_0_0_22px_rgba(255,255,255,0.12)]" />
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_28px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-slate-950/45 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-200">
            Zekâ Gelişim Döngüsü
          </p>

          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-black text-cyan-200">
            + DATA
          </span>
        </div>

        <div className="space-y-3">
          <LearningBar label="Kampanya Hafızası" value="72%" width="w-[72%]" />
          <LearningBar label="Müşteri Niyeti Analizi" value="64%" width="w-[64%]" />
          <LearningBar label="Performans Öğrenimi" value="58%" width="w-[58%]" />
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Kullanım arttıkça AdMind Core; sektör, hedef, mesaj ve sonuç verilerini
          daha güçlü bir karar akışında birleştirir.
        </p>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.055] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Hafıza
          </p>
          <p className="mt-2 text-sm font-black text-cyan-200">Büyüyor</p>
        </div>

        <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.055] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Analiz
          </p>
          <p className="mt-2 text-sm font-black text-purple-200">Derinleşiyor</p>
        </div>

        <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.055] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Öneri
          </p>
          <p className="mt-2 text-sm font-black text-emerald-200">Gelişiyor</p>
        </div>
      </div>
    </div>
  );
}

function LearningBar({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-cyan-200">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`${width} relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]`}
        >
          <div className="absolute inset-0 animate-[pulse_1.6s_ease-in-out_infinite] bg-white/25" />
        </div>
      </div>
    </div>
  );
}

export default AIOrb;