import { useState, useEffect } from "react";

export default function useActiveSection (sectionIds = []) {
    const [activeSection, setActiveSection] = useState(sectionIds[0] || "");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, {passive: true});
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect (() => {
        const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
        if(!els.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                    if(visible[0]) setActiveSection(visible[0].target.id);
            },
            {rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5, 0.75, 1]}
        );

        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sectionIds.join(",")])

    return {activeSection, scrolled};
}