import { useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import appLogo from "../../assets/appLogo.png"

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Explore", id: "hero-3d" },
  { label: "Gallery", id: "gallery" },
  { label: "Transformations", id: "transformations" },
  { label: "Reviews", id: "reviews" },
];

export default function Navbar({ activeSection, scrolled, onNavigate}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const handleClick = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[#14140f]/85 backdrop-blur-md border-b border-[#e8e4d6]/8"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleClick("home")}
          className="cursor-pointer flex items-center"
          aria-label="Home"
        >
          <img src={appLogo} alt="Logo" className="h-8 w-auto" />
        </button>

        {/* Desktop: linkovi + Prijava */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleClick(link.id)}
              className={`relative text-sm py-1 transition-colors cursor-pointer ${
                activeSection === link.id
                  ? "text-[#e8e4d6]"
                  : "text-[#e8e4d6]/60 hover:text-[#e8e4d6]"
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-[#7a8248]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}

          {/* Prijava dugme */}
          <Link
            to="/login"
            className="ml-2 px-5 py-2 rounded-full bg-[#7a8248] cursor-pointer hover:bg-[#8a9358] text-[#14140f] text-sm font-medium transition-colors cursor-pointer"
          >
            Prijava
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-[#e8e4d6]/80 hover:text-[#e8e4d6] transition-colors cursor-pointer"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Scroll progress linija */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[#7a8248]/50"
        aria-hidden="true"
      />

      {/* Mobile meni */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-[#14140f]/95 backdrop-blur-md border-b border-[#e8e4d6]/10"
          >
            <div className="px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleClick(link.id)}
                  className={`text-left py-3 text-sm transition-colors cursor-pointer ${
                    activeSection === link.id
                      ? "text-[#e8e4d6] font-medium"
                      : "text-[#e8e4d6]/60"
                  }`}
                >
                  {link.label}
                </button>
              ))}

              
              <Link
                to="/login"
                onClick={() => { setMenuOpen(false)}}
                className="mt-3 px-5 py-3 rounded-full bg-[#7a8248] hover:bg-[#8a9358] text-[#14140f] text-sm font-medium transition-colors cursor-pointer text-center"
              >
                Prijava
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}