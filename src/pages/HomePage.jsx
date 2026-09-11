import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "../components/layout/SplashScreen";
import LandingHeroSection from "../sections/LandingHeroSection";
import Hero3D from "../sections/Hero3D";
import GallerySection from "../sections/GallerySection";
import TransformationSection from "../sections/TransformationSection";
import ReviewsStackSection from "../sections/ReviewSection";
import Navbar from "../components/layout/Navbar";
import useActiveSection from "../hooks/useActiveSection";
import FaqSection from "../sections/FaqSection";

const SECTION_IDS = ["home", "hero-3d", "gallery", "transformations", "reviews", "faq" ];

function HomePage () {
  
  const [isLoading, setIsLoading] = useState(true);
  const {activeSection, scrolled} = useActiveSection(isLoading ? [] : SECTION_IDS)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer);
  },[]);

  const handleNavigate = useCallback((id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
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

const testReviews = [
  { id:1, text:"Walked out with a completely different relationship to my body.", name:"Marko Perić", role:"8 months", rating:5 },
  { id:2, text:"Every session had a purpose. No wasted time.", name:"Ivana Kovač", role:"1 year", rating:5 },
  { id:3, text:"I eat more and weigh less. Still can't believe it.", name:"Luka Marić", role:"6 months", rating:5 },
  { id:4, text:"My back pain is gone for the first time in years.", name:"Sanja Tomić", role:"5 months", rating:4 },
  { id:5, text:"Finally understand training as a skill.", name:"Ena Babić", role:"4 months", rating:5 },
  { id:6, text:"Gained real muscle. The plan just works.", name:"Dario Vuk", role:"7 months", rating:5 },
   { id:1, text:"Walked out with a completely different relationship to my body.", name:"Marko Perić", role:"8 months", rating:5 },
  { id:2, text:"Every session had a purpose. No wasted time.", name:"Ivana Kovač", role:"1 year", rating:5 },
  { id:3, text:"I eat more and weigh less. Still can't believe it.", name:"Luka Marić", role:"6 months", rating:5 },
  { id:4, text:"My back pain is gone for the first time in years.", name:"Sanja Tomić", role:"5 months", rating:4 },
  { id:5, text:"Finally understand training as a skill.", name:"Ena Babić", role:"4 months", rating:5 },
  { id:6, text:"Gained real muscle. The plan just works.", name:"Dario Vuk", role:"7 months", rating:5 },
  

];

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <div key="app">
            <Navbar 
              activeSection={activeSection}
              scrolled={scrolled}
              onNavigate={handleNavigate}
            />
            <LandingHeroSection />
            <Hero3D />
            <GallerySection slides={testSlides} isAdmin={true} />
            <TransformationSection items={testTransforms} isAdmin={true} />
            <ReviewsStackSection
              reviews={testReviews}
              isAdmin={true}
              onLeaveReview={() => alert("Login required — forma kasnije")}
            />
            <FaqSection />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default HomePage;