import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/learn', label: 'Learn', emoji: '🃏' },
  { path: '/quiz', label: 'Quiz', emoji: '🧠' },
  { path: '/simulator', label: 'Simulator', emoji: '🎮' },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
             w-[95%] max-w-7xl px-6 md:px-10 py-4 rounded-2xl"
        style={{
          background: "rgba(15,15,26,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                background: "linear-gradient(135deg, #F7B731, #E09A15)",
                color: "#0F0F1A",
              }}
            >
              ₹
            </div>
            <span className="font-sora font-bold text-lg">
              <span className="gradient-text-gold">Rupee</span>
              <span className="text-white">Smart</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-15">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-${link.label.toLowerCase()}`}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 relative
                    ${isActive ? "text-primary bg-primary/10" : "text-text-secondary hover:text-white hover:bg-white/5"}`}
                >
                  <span>{link.emoji}</span>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to="/simulator"
              id="nav-cta"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Play Simulator 🎮
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="nav-hamburger"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="block w-6 h-0.5 bg-white rounded-full"
              style={{ transformOrigin: "center" }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-6 h-0.5 bg-white rounded-full"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="block w-6 h-0.5 bg-white rounded-full"
              style={{ transformOrigin: "center" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 z-50 md:hidden p-6 flex flex-col"
              style={{
                background: "#1A1A2E",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-sora font-bold text-lg">
                  <span className="gradient-text-gold">Rupee</span>
                  <span className="text-white">Smart</span>
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-text-secondary hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-2 flex-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={link.path}
                        id={`mobile-nav-${link.label.toLowerCase()}`}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all
                          ${isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-text-secondary hover:text-white hover:bg-white/5"}`}
                      >
                        <span className="text-xl">{link.emoji}</span>
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <Link
                to="/simulator"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-center mt-4 block"
              >
                Play Simulator 🎮
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
