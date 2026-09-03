import { useEffect, useState } from "react";
import landingHero from "../assets/landingHero.jpeg"

function LandingHeroSection () {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true)
    },[]);

    const scrollToNext = () => {
        const next = document.getElementById("hero-3d");
        next?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            className="relative w-full h-screen overflow-hidden bg-black"
        >
            <img 
                src={landingHero}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "20% center"}}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />

            <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-24 md:px-16 md:pb-32 max-w-2xl">

                <div
                    className={`flex items-center gap-3 mb-6 transition-all duration-700 delay-100 ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
                >
                    <span className="w-8 h-px bg-[#9aa87e]" />
                    <span className="text-[#9aa87e] text-xs tracking-[0.25em] uppercase font-medium">
                        Elite Performance training
                    </span>
                </div>

                <h1
                    className="text-[#e9e6da] leading-[0.95] mb-6"
                    style={{ fontFamily: "'Fraunces', serif"}}
                >
                    <span
                        className={`block text-4xl sm:text-6xl 2xl:text-8xl font-medium transition-all duration-700 delay-200 ${
                            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    >
                        Train with
                    </span>
                    <span className={`block text-4xl sm:text-6xl 2xl:text-8xl font-medium transition-all duration-700 delay-200 ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}>
                        Purpose
                    </span>
                </h1>

                <p
                    className={`text-white/55 text-xs md:text-sm xl:text-base md:text-lg max-w-md mb-10 leading-relaxed transition-all duration-700 delay-500 ${
                        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
                >
                    Precision coaching, structural strength, and personalized training built for real results.
                </p>

                <button
          onClick={scrollToNext}
          className={`group flex items-center gap-3 w-fit border border-[#9aa87e] rounded-full cursor-pointer pl-6 pr-5 py-3 bg-transparent hover:bg-[#9aa87e] transition-all duration-500 delay-100 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="text-[#9aa87e] font-medium group-hover:text-white text-xs tracking-[0.2em] uppercase transition-colors duration-500">
            Explore
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-500 group-hover:rotate-90"
          >
            <path
              d="M1 8h13M8 1l6 7-6 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#9aa87e] group-hover:text-white transition-colors duration-500"
            />
          </svg>
        </button>
            </div>
        </section>
    )
}

export default LandingHeroSection;