import { useEffect, useRef, useState } from "react";

function useInView ({threshold = 0.3, once = true}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if(!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting){
                    setInView(true);
                    if(once) io.unobserve(el);
                }else if (!once) {
                    setInView(false)
                }
            },
            {threshold}
        );
        io.observe(el);
        return () => io.disconnect()
    },[threshold, once]);
    
    return [ref, inView];
}

export default useInView;