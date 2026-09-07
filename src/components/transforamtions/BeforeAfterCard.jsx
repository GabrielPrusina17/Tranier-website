import { useState, useRef, useEffect, useCallback } from "react";

export default function BeforeAfterCard({
  before, after, name, period, result,
  autoPlay = false, onAutoDone = () => {},
  isAdmin = false, onDelete = () => {},
}) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef(null);
  const dragging = useRef(false);
  const rafRef = useRef(null);
  const userTook = useRef(false);

  const setFromX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPos(p);
  }, []);

  const startDrag = (clientX) => {
    dragging.current = true;
    userTook.current = true;
    cancelAnimationFrame(rafRef.current);
    setFromX(clientX);
  };
  const moveDrag = (clientX) => { if (dragging.current) setFromX(clientX); };
  const endDrag = () => { dragging.current = false; };

  useEffect(() => {
    if (!autoPlay || userTook.current) return;

    let start = null;
    const DUR = 1600;
    const ease = (x) => 1 - Math.pow(1 - x, 3);

    const tick = (ts) => {
      if (userTook.current) return;
      if (start === null) start = ts;
      const t = Math.min((ts - start) / DUR, 1);

      let p;
      if (t < 0.25) {
        p = 50 + (0 - 50) * ease(t / 0.25);
      } else if (t < 0.7) {
        p = 0 + (100 - 0) * ease((t - 0.25) / 0.45);
      } else {
        p = 100 + (50 - 100) * ease((t - 0.7) / 0.3);
      }
      setPos(p);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPos(50);
        onAutoDone();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoPlay, onAutoDone]);

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-[#1c1c15]"
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
      >
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <span className="absolute right-3 bottom-3 bg-[#c9a24b]/90 text-[#14140f] text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide z-10">AFTER</span>

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img
            src={before}
            alt="Before"
            className="absolute inset-0 h-full object-cover max-w-none"
            style={{ width: wrapRef.current ? `${wrapRef.current.getBoundingClientRect().width}px` : "100%" }}
            draggable={false}
          />
          <span className="absolute left-3 bottom-3 bg-[#7a8248]/90 text-[#14140f] text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">BEFORE</span>
        </div>

        <div className="absolute top-0 bottom-0 w-0.5 bg-[#e8e4d6] pointer-events-none z-10" style={{ left: `${pos}%`, transform: "translateX(-1px)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#e8e4d6] flex items-center justify-center shadow-lg">
            <span className="text-[#14140f] text-sm">⇄</span>
          </div>
        </div>

        {isAdmin && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-red-700/80 text-white flex items-center justify-center transition-colors" aria-label="Delete">×</button>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[#e8e4d6] text-sm" style={{ fontFamily: "'Fraunces', serif" }}>
          {name}{period ? ` · ${period}` : ""}
        </span>
        {result && (
          <span className="text-[#c9a24b] text-base" style={{ fontFamily: "'Fraunces', serif" }}>{result}</span>
        )}
      </div>
    </div>
  );
}