export function AIBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050712]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      <div className="absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[130px]" />
      <div className="absolute left-[-120px] top-[20%] h-[360px] w-[360px] rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[140px]" />

      <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_24px_rgba(103,232,249,0.9)]" />
      <div className="absolute right-[18%] top-[32%] h-1.5 w-1.5 rounded-full bg-blue-300/80 shadow-[0_0_20px_rgba(147,197,253,0.9)]" />
      <div className="absolute bottom-[24%] left-[28%] h-1.5 w-1.5 rounded-full bg-purple-300/80 shadow-[0_0_20px_rgba(216,180,254,0.9)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
    </div>
  );
}

export default AIBackground;