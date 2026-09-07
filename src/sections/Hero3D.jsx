import { useState } from "react";
import Scene from "../components/hero3D/Scene";
import TrainerModel from "../components/hero3D/TrainerModel";
import MuscleHotspots from "../components/hero3D/MuscleHotspots";
import VideoCard from "../components/hero3D/VideoCard";
import GymBackground from "../components/hero3D/GymBackground";

export default function Hero3D({ isAdmin = false }) {
  const [activeZone, setActiveZone] = useState(null);

  return (
    <section id="hero-3d" className="relative w-full h-[100svh] bg-[#0a0a0a] overflow-hidden">
      {/* Pozadina teretane (blur za fokus na model) */}
      <GymBackground focused={true} />

      {/* 3D scena preko pozadine */}
      <div className="absolute inset-0 z-10">
        <Scene controlsEnabled={!activeZone}>
          <TrainerModel />
          <MuscleHotspots activeZone={activeZone} onSelect={setActiveZone} />
        </Scene>
      </div>

      {/* Naslov / uputa */}
      <div className="absolute top-10 left-[6%] z-20 pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-px bg-[#c9a24b]" />
          <span className="text-[#c9a24b] text-[11px] tracking-[0.25em] uppercase">
            Explore the body
          </span>
        </div>
        <p className="text-[#e8e4d6]/60 text-sm max-w-xs">
          Drag to rotate. Tap a highlighted muscle to see the exercise.
        </p>
      </div>

      {/* Video kartica (HTML overlay) */}
      <VideoCard
        zone={activeZone}
        onClose={() => setActiveZone(null)}
        isAdmin={isAdmin}
      />
    </section>
  );

}