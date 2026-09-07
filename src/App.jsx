import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./components/layout/SplashScreen";
import LandingHeroSection from "./sections/LandingHeroSection";
import Hero3D from "./sections/Hero3D";
import GallerySection from "./sections/GallerySection";
import TransformationSection from "./sections/TransformationSection";

function App () {
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer);
  },[]);

  const testSlides = [
  { id: 1, src: "https://picsum.photos/id/1015/1400/900", quote: "Discipline is choosing what you want most over what you want now.", tag: "Strength" },
  { id: 2, src: "https://picsum.photos/id/1016/1400/900", quote: "The body achieves what the mind believes.", tag: "Focus" },
  { id: 3, src: "https://picsum.photos/id/1018/1400/900", quote: "Sweat is just fat crying.", tag: "Conditioning" },
  { id: 4, src: "https://picsum.photos/id/1024/1400/900", quote: "You don't find willpower. You build it.", tag: "Mindset" },
  { id: 5, src: "https://picsum.photos/id/1033/1400/900", quote: "One more rep is where growth lives.", tag: "Grind" },
];

const testTransforms = [
  { id:1, before:"https://picsum.photos/id/1062/600/800", after:"https://picsum.photos/id/1074/600/800", name:"Marko", period:"8mj", result:"-14 kg" },
  { id:2, before:"https://picsum.photos/id/1025/600/800", after:"https://picsum.photos/id/1039/600/800", name:"Ivana", period:"1god", result:"-18 kg" },
  { id:3, before:"https://picsum.photos/id/1084/600/800", after:"https://picsum.photos/id/1080/600/800", name:"Luka", period:"6mj", result:"+8 kg" },
];

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <div key="app">
            <LandingHeroSection />
            <Hero3D />
            <GallerySection slides={testSlides} isAdmin={true} />
            <TransformationSection items={testTransforms} isAdmin={true} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App;