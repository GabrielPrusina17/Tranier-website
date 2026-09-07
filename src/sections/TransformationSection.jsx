import { useEffect, useState } from "react";
import useInView from "../hooks/useInView";
import BeforeAfterCard from "../components/transforamtions/BeforeAfterCard";

function TransformationSection ({
    items = [],
    isAdmin = false,
    onAddClick = () => {},
    onDelete = () => {},
}) {
    const [ref, inView] = useInView({threshold: 0.3, once: true});
    const [activeAuto, setActiveAuto] = useState(-1);

    useEffect(() => {
        if (inView && activeAuto === -1 && items.length > 0) {
            setActiveAuto(0);
        }
    },[inView, items.length, activeAuto]);

    const handleAutoDone = (index) => {
        if (index === activeAuto) setActiveAuto((prev) => prev + 1);
    };

    return (
    <section ref={ref} className="relative w-full bg-[#14140f] py-20 md:py-28 px-[6vw]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3.5 mb-4">
          <span className="w-10 h-px bg-[#7a8248]" />
          <span className="text-[#7a8248] text-[11px] tracking-[0.1em] font-medium">Transformations</span>
        </div>
        <h2 className="text-[#e8e4d6] font-normal leading-none mb-10 md:mb-14" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
          The proof is <span className="italic text-[#8a8770]">visible</span>
        </h2>

        {items.length === 0 ? (
          isAdmin ? (
            <button onClick={onAddClick} className="w-full max-w-sm mx-auto aspect-[3/4] flex flex-col items-center justify-center gap-3 border border-dashed border-[#7a8248]/50 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-2xl text-[#7a8248] transition-colors">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              <span className="text-sm" style={{ fontFamily: "'Fraunces', serif" }}>Add transformation</span>
            </button>
          ) : (
            <p className="text-[#8a8770]/50 text-sm text-center py-12">Transformations coming soon.</p>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((it, i) => (
              <BeforeAfterCard
                key={it.id ?? i}
                before={it.before}
                after={it.after}
                name={it.name}
                period={it.period}
                result={it.result}
                autoPlay={activeAuto === i}
                onAutoDone={() => handleAutoDone(i)}
                isAdmin={isAdmin}
                onDelete={() => onDelete(it.id)}
              />
            ))}
            {isAdmin && (
              <button onClick={onAddClick} className="aspect-[3/4] flex flex-col items-center justify-center gap-3 border border-dashed border-[#7a8248]/40 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-2xl text-[#7a8248] transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                <span className="text-xs tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>Add</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TransformationSection;