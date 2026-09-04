export default function VideoCard({ zone, onClose, isAdmin = false }) {
  if (!zone) return null;

  return (
    <div
      className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 z-30 w-72 md:w-80 bg-black/85 backdrop-blur-md border border-[#c9a24b]/30 rounded-2xl p-4 shadow-2xl"
      style={{ animation: "cardIn 0.4s ease-out" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a24b]" />
          <h3 className="text-[#e8e4d6] text-sm font-medium tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>
            {zone.label}
          </h3>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-lg leading-none" aria-label="Close">×</button>
      </div>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/30">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] tracking-wide uppercase">
            {isAdmin ? "Add video" : "Video soon"}
          </span>
        </div>
      </div>

      <p className="text-white/40 text-xs mt-3 leading-relaxed">
        Exercise demonstration for {zone.label.toLowerCase()}.
      </p>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translate(20px, -50%); }
          to   { opacity: 1; transform: translate(0, -50%); }
        }
      `}</style>
    </div>
  );
}