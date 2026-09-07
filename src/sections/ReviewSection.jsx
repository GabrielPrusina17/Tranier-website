import { useRef, useEffect, useState } from "react";
import ReviewCard from "../components/reviews/ReviewCard";

const PER_ROW_DESKTOP = 3;

export default function ReviewsStackSection({
  reviews = [],
  isAdmin = false,
  onAddClick = () => {},
  onDelete = () => {},
  onLeaveReview = () => {},
}) {
  const rowRefs = useRef([]);
  const [perRow, setPerRow] = useState(PER_ROW_DESKTOP);

  useEffect(() => {
    const check = () => setPerRow(window.innerWidth >= 768 ? PER_ROW_DESKTOP : 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rows = [];
  for (let i = 0; i < reviews.length; i += perRow) {
    rows.push(reviews.slice(i, i + perRow));
  }

  useEffect(() => {
    const onScroll = () => {
      const els = rowRefs.current.filter(Boolean);
      els.forEach((r, i) => {
        const next = els[i + 1];
        if (!next) {
          r.style.transform = "scale(1)";
          r.style.opacity = "1";
          return;
        }
        const nr = next.getBoundingClientRect();
        const trigger = window.innerHeight * 0.12 + 140;
        const ov = Math.max(0, Math.min(1, (trigger - nr.top) / 220));
        r.style.transform = `scale(${1 - ov * 0.05})`;
        r.style.opacity = `${1 - ov * 0.3}`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reviews, perRow]);

  const hasReviews = reviews.length > 0;

  return (
    <section className="relative w-full bg-[#14140f] py-20 md:py-28 px-[6vw]">
      <div className="max-w-[1200px] mx-auto">
        {/* Naslov + dugme */}
        <div className="flex items-center gap-3.5 mb-4">
          <span className="w-10 h-px bg-[#7a8248]" />
          <span className="text-[#7a8248] text-[11px] tracking-[0.1em] font-medium">Reviews</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-14">
          <h2 className="text-[#e8e4d6] font-normal leading-none" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
            In their own <span className="italic text-[#8a8770]">words</span>
          </h2>
          <button onClick={onLeaveReview} className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#7a8248] hover:bg-[#8a9358] text-[#14140f] text-sm font-medium transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Leave a review
          </button>
        </div>

        {/* Redovi */}
        {!hasReviews ? (
          isAdmin ? (
            <button onClick={onAddClick} className="w-full flex flex-col items-center gap-3 py-16 border border-dashed border-[#7a8248]/50 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-2xl text-[#7a8248] transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              <span className="text-sm" style={{ fontFamily: "'Fraunces', serif" }}>Add first review</span>
            </button>
          ) : (
            <p className="text-[#8a8770]/50 text-sm text-center py-12">Reviews coming soon.</p>
          )
        ) : (
          <div className="pb-[30vh]">
            {rows.map((row, rowIdx) => {
              const isLastRow = rowIdx === rows.length - 1;
              return (
                <div
                  key={rowIdx}
                  ref={(el) => (rowRefs.current[rowIdx] = el)}
                  className="reviews-row sticky grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6"
                  style={{ top: `${12 + rowIdx * 3}vh`, zIndex: rowIdx + 1 }}
                >
                  {row.map((r) => (
                    <ReviewCard key={r.id} review={r} isAdmin={isAdmin} onDelete={onDelete} />
                  ))}
                  {isAdmin && isLastRow && row.length < perRow && (
                    <button onClick={onAddClick} className="min-h-[220px] flex flex-col items-center justify-center gap-3 border border-dashed border-[#7a8248]/40 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-2xl text-[#7a8248] transition-colors">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      <span className="text-xs tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>Add</span>
                    </button>
                  )}
                </div>
              );
            })}

            {isAdmin && reviews.length % perRow === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-2">
                <button onClick={onAddClick} className="min-h-[120px] flex flex-col items-center justify-center gap-2 border border-dashed border-[#7a8248]/40 hover:border-[#7a8248] hover:bg-[#7a8248]/5 rounded-2xl text-[#7a8248] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  <span className="text-xs tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>Add</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .reviews-row { transition: transform 0.12s ease, opacity 0.12s ease; will-change: transform, opacity; }
      `}</style>
    </section>
  );
}