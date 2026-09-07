function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15"
      fill={filled ? "#c9a24b" : "none"}
      stroke={filled ? "#c9a24b" : "#55523f"} strokeWidth="1.5">
      <path d="M12 2l3 6.5 7 .8-5 4.9 1.3 7L12 17.8 5.4 21.2 6.7 14.2 1.7 9.3l7-.8z" />
    </svg>
  );
}

export default function ReviewCard({ review, isAdmin, onDelete }) {
  const initials = (review.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative bg-[#1c1c15] border border-[#e8e4d6]/10 rounded-[18px] p-6 md:p-7 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
      {isAdmin && (
        <button
          onClick={() => onDelete(review.id)}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/40 hover:bg-red-700/80 text-white flex items-center justify-center transition-colors"
          aria-label="Delete review"
        >×</button>
      )}

      <div className="flex gap-1 mb-3.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} filled={s <= (review.rating || 0)} />
        ))}
      </div>

      <p
        className="text-[#dedbcc] leading-[1.5] mb-5"
        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}
      >
        "{review.text}"
      </p>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#14140f] font-semibold text-[13px]"
          style={{ background: "linear-gradient(135deg,#7a8248,#5a6238)" }}>
          {initials}
        </div>
        <div>
          <div className="text-[#e8e4d6] text-[0.9rem] font-medium">{review.name}</div>
          {review.role && <div className="text-[#8a8770] text-[0.74rem] mt-0.5">{review.role}</div>}
        </div>
      </div>
    </div>
  );
}