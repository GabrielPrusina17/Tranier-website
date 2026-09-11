import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQ_ITEMS = [
  {
    q: "Do I need any experience to start?",
    a: "Not at all. Every plan is built around your current level, whether you've never trained or you're returning after a break. We start where you are and progress from there.",
  },
  {
    q: "How are the training sessions structured?",
    a: "Each session has a clear purpose, warm-up, main work, and cooldown, tailored to your goal. No wasted time, no guesswork. You'll always know what you're doing and why.",
  },
  {
    q: "Do you provide a nutrition plan?",
    a: "Yes. Training is only half the equation. You'll get guidance on eating that fits your lifestyle, not a rigid diet you can't sustain.",
  },
  {
    q: "How often should I train?",
    a: "It depends on your goal and schedule, typically 3 to 4 sessions per week. We'll find a rhythm that's realistic and effective for you.",
  },
  {
    q: "Can I train online or does it have to be in person?",
    a: "Both options are available. In-person sessions offer hands-on coaching, while online plans give you flexibility with full support and check-ins.",
  },
  {
    q: "What if I have an injury or health condition?",
    a: "Let me know upfront. Training is adapted around any limitations, and we work closely to keep you safe while still making progress.",
  },
];

function FaqSection () {

    const [openIndex, setOpenIndex] = useState(0);
    const toggle = (i) => {
        setOpenIndex((prev) => (prev === i ? null : i));
    };

    return (
        <section id="faq" className="relative w-full bg-[#14140f] py-20 md:py-28 px-[6vw]">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center gap-3.5 mb-4">
                    <span className="w-10 h-px bg-[#7a8248]" />
                    <span className="text-[#7a8248] text-[11px] tracking-[0.1em] font-medium">FAQ</span>
                </div>

                <h2
                    className="text-[#e8e4d6] font-normal leading-none mb-10 md:mb-14"
                    style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
                >
                    Questions, <span className="italic text-[#8a8770]">answered</span>
                </h2>

                <div className="divide-y divide-[#e8e4d6]/10 border-t border-b border-[#e8e4d6]/10">
                    {FAQ_ITEMS.map((item, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div key={i}>
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
                                    aria-expanded={isOpen} 
                                >
                                    <span
                                        className={`transition-colors ${isOpen ? "text-[#e8e4d6]" : "text-[#e8e4d6]/80 group-hover:text-[#e8e4d6]"}`}
                                        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.05rem, 2vw, 1.4rem)" }}
                                    >
                                        {item.q}
                                    </span>
                                    <span className="shrink-0 mt-1">
                                        <motion.svg
                                            width="20" height="20" viewBox="0 0 24 24" fill="none"
                                            animate={{ rotate: isOpen ? 45 : 0}}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <path 
                                                d="M12 5v14M5 12h14"
                                                stroke={isOpen ? "#7a8248" : "#8a8770"}
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                            />
                                        </motion.svg>
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0}}
                                            animate={{height: "auto", opacity: 1}}
                                            exit={{ height: 0, opacity: 0}}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[#cfcbba]/80 leading-relaxed pb-6 pr-8 max-w-[68ch]"
                                                style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
                                            >
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FaqSection;