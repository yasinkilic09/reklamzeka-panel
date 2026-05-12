export function AIOrb() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%)]" />

      <div className="pointer-events-none absolute left-0 top-0 h-px w-full animate-pulse bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200">
            AI CORE
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Akıllı reklam motoru aktif
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          ACTIVE
        </div>
      </div>

      <div className="relative flex items-center justify-center py-4">
        <div className="relative h-48 w-48 sm:h-56 sm:w-56">
          {/* dış glow */}
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />

          {/* dönen dış halka */}
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-cyan-300/20">
            <div className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.95)]" />
          </div>

          {/* ters dönen orta halka */}
          <div className="absolute inset-5 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-purple-300/20">
            <div className="absolute bottom-[-4px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-purple-300 shadow-[0_0_20px_rgba(216,180,254,0.95)]" />
          </div>

          {/* hızlı iç halka */}
          <div className="absolute inset-11 animate-[spin_8s_linear_infinite] rounded-full border border-blue-300/25">
            <div className="absolute right-[-4px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(147,197,253,0.95)]" />
          </div>

          {/* yatay veri çizgileri */}
          <div className="absolute left-[8%] top-[32%] h-px w-[84%] animate-pulse bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
          <div className="absolute left-[15%] top-[58%] h-px w-[70%] animate-pulse bg-gradient-to-r from-transparent via-purple-300/35 to-transparent" />

          {/* çekirdek */}
          <div className="absolute inset-[31%] animate-pulse rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-500 shadow-[0_0_60px_rgba(59,130,246,0.55)]" />

          {/* iç çekirdek */}
          <div className="absolute inset-[39%] rounded-full border border-white/25 bg-white/10 backdrop-blur-xl shadow-[inset_0_0_22px_rgba(255,255,255,0.12)]" />

          {/* merkez nokta */}
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_28px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            MODE
          </p>
          <p className="mt-2 text-sm font-black text-cyan-200">Vision</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            FLOW
          </p>
          <p className="mt-2 text-sm font-black text-purple-200">Creative</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            STATUS
          </p>
          <p className="mt-2 text-sm font-black text-emerald-200">Ready</p>
        </div>
      </div>
    </div>
  );
}

export default AIOrb;