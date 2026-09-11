import { useCallback, useState } from "react";
import Scene from "../components/hero3D/Scene";
import TrainerModel from "../components/hero3D/TrainerModel";
import CameraController from "../components/hero3D/CameraController";
import VideoCard from "../components/hero3D/VideoCard";
import GymBackground from "../components/hero3D/GymBackground";
import { MUSCLE_ZONES } from "../config/muscleZone";

export default function Hero3D({ isAdmin = false }) {
  const [activeZone, setActiveZone] = useState(null);
  const [focus, setFocus] = useState(null);
  const [bounds, setBounds] = useState(null);

  const handleFocus = useCallback((f) => setFocus(f), []);
  const handleReady = useCallback((b) => setBounds(b), []);
  const clear = useCallback(() => setActiveZone(null), []);

  return (
    <section id="hero-3d" className="relative w-full h-[100svh] bg-[#0a0a0a] overflow-hidden">
      {/* Pozadina se zatamni TEK kad je mišić odabran */}
      <GymBackground focused={!!activeZone} />

      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-700"
        style={{
          opacity: activeZone ? 1 : 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 75%, rgba(0,0,0,.88) 100%)",
        }}
      />

      <div className="absolute inset-0 z-10">
        <Scene>
          <TrainerModel
            activeZone={activeZone}
            onSelect={setActiveZone}
            onFocus={handleFocus}
            onReady={handleReady}
          />
          <CameraController focus={focus} bounds={bounds} enabled={!activeZone} />
        </Scene>
      </div>

      {/* ako ovo ostane zauvijek, GLB se nije učitao -> provjeri Network tab */}
      {!bounds && (
        <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
          <span className="text-[#c9a24b] text-[11px] tracking-[0.3em] uppercase">Učitavanje modela</span>
        </div>
      )}

      <div className="absolute top-24 md:top-28 left-[6%] z-30 pointer-events-none max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-[#c9a24b]" />
          <span className="text-[#c9a24b] text-[11px] tracking-[0.25em] uppercase">Explore the body</span>
        </div>
        <p className="text-[#e8e4d6]/60 text-sm">
          Klikni na mišić na modelu ili odaberi skupinu dolje. Povuci za rotaciju.
        </p>
      </div>

      {/* Chipovi — brzi odabir bez pogađanja po modelu */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-2 overflow-x-auto md:flex-wrap md:justify-center px-4 md:px-16 pb-5 pt-4 bg-gradient-to-t from-black/90 to-transparent">
        {MUSCLE_ZONES.map((z) => {
          const on = activeZone?.id === z.id;
          return (
            <button
              key={z.id}
              onClick={() => setActiveZone(on ? null : z)}
              aria-pressed={on}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                on
                  ? "bg-[#c9a24b] border-[#c9a24b] text-[#14110a] font-semibold"
                  : "bg-white/5 border-[#c9a24b]/30 text-[#e8e4d6]/75 hover:border-[#c9a24b] hover:text-[#e8e4d6]"
              }`}
            >
              {z.label}
            </button>
          );
        })}
      </div>

      <VideoCard zone={activeZone} onClose={clear} isAdmin={isAdmin} />
    </section>
  );
}