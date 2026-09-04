import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function GallerySection({
  slides = [],
  isAdmin = false,
  onAddClick = () => {},
  onDelete = () => {},
}) {
  const [cur, setCur] = useState(0);
  const lock = useRef(false);
  const stageRef = useRef(null);

  const count = slides.length;
  const safeCur = count ? cur % count : 0;

  const go = useCallback(
    (i) => {
      if (!count) return;
      setCur(((i % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (lock.current) return;
      lock.current = true;
      go(safeCur + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => (lock.current = false), 700);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [safeCur, go]);

  if (!count) {
    return (
      <section className="relative w-full h-[70vh] bg-[#0a0a0a] flex items-center justify-center">
        {isAdmin ? (
          <button
            onClick={onAddClick}
            className="flex flex-col items-center gap-3 px-8 py-6 border border-dashed border-[#7a8248]/50 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-xl text-[#7a8248] transition-colors"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="text-sm" style={{ fontFamily: "'Fraunces', serif" }}>
              Add first slide
            </span>
          </button>
        ) : (
          <p className="text-[#8a8770]/50 text-sm">Gallery coming soon.</p>
        )}
      </section>
    );
  }

  const active = slides[safeCur];

  return (
    <section
      ref={stageRef}
      className="relative w-full h-[100svh] overflow-hidden bg-[#0a0a0a] select-none"
    >
      {slides.map((s, i) => (
        <div
          key={s.id ?? i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.src})`,
            opacity: i === safeCur ? 1 : 0,
            transform: i === safeCur ? "scale(1.05)" : "scale(1.15)",
            transitionProperty: "opacity, transform",
            transitionDuration: i === safeCur ? "1000ms, 6000ms" : "1000ms, 1000ms",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

        <div className="absolute left-[6%] z-20 max-w-[85%] sm:max-w-[46%] top-1/2 -translate-y-1/2">        
        <div className="w-8 sm:w-10 h-0.5 bg-[#7a8248] mb-4 sm:mb-5" />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active.id ?? safeCur}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#e8e4d6] font-normal leading-[1.12] tracking-[-0.01em]"
            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.3rem, 3.4vw, 3rem)" }}
          >
            "{active.quote}"
            {active.tag && (
              <span className="block mt-4 text-[#8a8770] text-[0.7rem] sm:text-xs tracking-[0.15em] uppercase font-sans">
                {active.tag}
              </span>
            )}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="absolute right-0 bottom-[13%] sm:bottom-[16%] z-20 overflow-hidden pl-4 w-full sm:w-auto">
        <div
          className="flex gap-3 sm:gap-4 transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${-Math.max(0, safeCur - 1) * (cardWidth() + gapWidth())}px)` }}
        >
          {slides.map((s, i) => (
            <button
              key={s.id ?? i}
              onClick={() => go(i)}
              className={`relative shrink-0 rounded-xl overflow-hidden shadow-2xl transition-transform duration-400 w-[110px] h-[150px] sm:w-[140px] sm:h-[190px] ${i === safeCur ? "-translate-y-2.5" : ""}`}
            >
              <img src={s.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {s.tag && (
                <span className="absolute left-3 bottom-3 text-white text-xs leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                  {s.tag}
                </span>
              )}
              {i === safeCur && (
                <span className="absolute inset-0 border-2 border-[#c9a24b] rounded-xl pointer-events-none" />
              )}
              {isAdmin && i === safeCur && (
                <span
                  onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-700/80 text-white flex items-center justify-center z-10"
                  aria-label="Delete slide"
                >×</span>
              )}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={onAddClick}
              className="shrink-0 w-[110px] h-[150px] sm:w-[140px] sm:h-[190px] rounded-xl border border-dashed border-[#7a8248]/50 hover:border-[#7a8248] hover:bg-[#7a8248]/5 flex items-center justify-center text-[#7a8248] transition-colors"
              aria-label="Add slide"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="absolute left-[6%] right-[6%] bottom-6 sm:bottom-8 z-30 flex items-center gap-4 sm:gap-5">
        <button onClick={() => go(safeCur - 1)} className="nav-btn" aria-label="Previous">‹</button>
        <button onClick={() => go(safeCur + 1)} className="nav-btn" aria-label="Next">›</button>
        <div className="flex-1 h-0.5 bg-white/15 rounded relative">
          <div
            className="absolute left-0 top-0 h-full bg-[#c9a24b] rounded transition-all duration-600"
            style={{ width: `${((safeCur + 1) / count) * 100}%` }}
          />
        </div>
        <div className="text-[#e8e4d6] text-xl sm:text-2xl min-w-[40px] text-right" style={{ fontFamily: "'Fraunces', serif" }}>
          {String(safeCur + 1).padStart(2, "0")}
        </div>
      </div>

      <style>{`
        .nav-btn {
          width: 40px; height: 40px; border-radius: 9999px;
          border: 1px solid rgba(232,228,214,.3); background: transparent;
          color: #e8e4d6; font-size: 20px; line-height: 1; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .3s; flex: 0 0 auto;
        }
        @media (min-width: 640px) { .nav-btn { width: 46px; height: 46px; } }
        .nav-btn:hover { border-color: #7a8248; background: rgba(122,130,72,.12); }
      `}</style>
    </section>
  );
}

function cardWidth() {
  if (typeof window === "undefined") return 140;
  return window.matchMedia("(min-width:640px)").matches ? 140 : 110;
}

function gapWidth() {
  if (typeof window === "undefined") return 16;
  return window.matchMedia("(min-width:640px)").matches ? 16 : 12;
}