import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./components/layout/SplashScreen";
import LandingHeroSection from "./sections/LandingHeroSection";

function App () {
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer);
  },[]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <div key="app">
            <LandingHeroSection />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App;