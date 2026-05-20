/* eslint-disable react-hooks/purity */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ── Floating Particles ── */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 2 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: `rgba(0, 196, 140, ${p.opacity})`,
            animation: `floatParticle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 6,
        size: 2 + Math.random() * 3,
      })).map((p) => (
        <div
          key={`g${p.id}`}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: `rgba(247, 183, 49, 0.3)`,
            animation: `floatParticle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated Count-up Number ── */
function CountUp({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const startTime = Date.now();
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(end * eased));
            if (progress >= 1) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="font-mono-nums">
      {count}
      {suffix}
    </span>
  );
}

/* ── Main Landing Page ── */
export default function Landing() {
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const featureCards = [
    {
      emoji: "🃏",
      title: "Concept Cards",
      desc: "Bite-sized explanations of SIP, FD, compound interest and more. Flip to reveal!",
      cta: "Start Learning",
      link: "/learn",
      color: "#00C48C",
      id: "feature-learn",
    },
    {
      emoji: "🧠",
      title: "Test Yourself",
      desc: "3 difficulty levels. 10 questions each. Beat the timer and earn your grade!",
      cta: "Take Quiz",
      link: "/quiz",
      color: "#F7B731",
      id: "feature-quiz",
    },
    {
      emoji: "🎮",
      title: "Life Simulator",
      desc: "You have ₹25,000 salary. 8 real-life money decisions. What's your future?",
      cta: "Play Now",
      link: "/simulator",
      color: "#818cf8",
      id: "feature-simulator",
    },
  ];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-[#0A0A10]"
    >
      <Particles />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(0,196,140,0.12) 0%, transparent 65%)",
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full flex flex-col items-center text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold mb-10 tracking-wide"
            style={{
              background: "rgba(0,196,140,0.1)",
              border: "1px solid rgba(0,196,140,0.25)",
              color: "#00C48C",
            }}
          >
            🇮🇳 India's #1 Financial Literacy Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-sora font-extrabold mb-8 leading-[1.15] w-full text-center"
            style={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}
          >
            <span className="gradient-text">Paisa Samjho,</span>
            <br />
            <span className="text-white">Life Badlo </span>
            <span className="inline-block ml-2 animate-bounce">💸</span>
          </motion.h1>

          {/* Tagline Container - Added inline style for custom bottom spacing */}
          <motion.div
            variants={itemVariants}
            className="text-text-secondary text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed text-center space-y-3"
            style={{ marginBottom: "40px" }}
          >
            <p>India ka sabse fun financial literacy platform.</p>
            <p className="text-white font-medium text-xl md:text-3xl tracking-tight">
              Learn. Play. Invest smarter.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full mb-8"
          >
            <Link
              to="/learn"
              id="hero-cta-learn"
              className="btn-primary text-lg px-10 py-5 rounded-2xl shadow-lg shadow-[#00C48C]/20 hover:shadow-[#00C48C]/40 transition-all duration-300 inline-flex items-center justify-center gap-3"
            >
              Start Learning <span>→</span>
            </Link>
            <Link
              to="/simulator"
              id="hero-cta-simulator"
              className="btn-secondary text-lg px-10 py-5 rounded-2xl hover:bg-white/5 transition-all duration-300 inline-flex items-center justify-center gap-3 border border-white/10"
            >
              Try Simulator <span>🎮</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Global Wrapper for Main Components */}
      <div className="flex flex-col gap-32 md:gap-44 w-full pb-32">
        {/* ── Stats Bar ── */}
        <section className="px-6 w-full relative z-10 flex justify-center">
          <div className="max-w-5xl w-full mx-auto">
            <div className="glass rounded-3xl p-10 md:p-14 border border-white/5 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {[
                  {
                    end: 12,
                    suffix: "+",
                    label: "Concepts",
                    sub: "to explore",
                    emoji: "📚",
                  },
                  {
                    end: 30,
                    suffix: "+",
                    label: "Quizzes",
                    sub: "to test you",
                    emoji: "🧠",
                  },
                  {
                    end: 8,
                    suffix: "",
                    label: "Scenarios",
                    sub: "to simulate",
                    emoji: "🎮",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center flex flex-col items-center pt-8 sm:pt-0 first:pt-0"
                  >
                    <div className="text-4xl mb-4">{stat.emoji}</div>
                    <div className="font-sora font-extrabold text-5xl md:text-6xl gradient-text mb-2">
                      <CountUp end={stat.end} suffix={stat.suffix} />
                    </div>
                    <div className="font-bold text-white text-lg tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-text-secondary text-sm mt-1">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section className="px-6 w-full relative z-10 flex justify-center">
          <div className="max-w-6xl w-full mx-auto">
            {/* Header bottom spacing using inline style */}
            <div className="text-center" style={{ marginBottom: "80px" }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-sora font-extrabold text-4xl md:text-5xl text-white mb-6"
              >
                Everything You Need
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-text-secondary text-lg md:text-xl"
              >
                Three powerful tools to master your finances
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {featureCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  id={card.id}
                  className="glass-card rounded-3xl flex flex-col items-center text-center gap-6 group hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-white/5 hover:bg-white/[0.02]"
                  /* Content padding using inline style to ensure layout breathing room */
                  style={{
                    paddingTop: "75px",
                    paddingBottom: "75px",
                    paddingLeft: "35px",
                    paddingRight: "35px",
                    boxShadow: `0 4px 30px ${card.color}05`,
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    {card.emoji}
                  </div>
                  <h3 className="font-sora font-bold text-2xl text-white">
                    {card.title}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed flex-1">
                    {card.desc}
                  </p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center justify-center gap-2 text-base font-bold mt-4 transition-all duration-300 group-hover:gap-4"
                    style={{ color: card.color }}
                  >
                    {card.cta} <span>→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial / Quote ── */}
        <section className="px-6 w-full relative z-10 flex justify-center">
          <div className="max-w-4xl w-full mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass rounded-3xl border border-white/10 relative overflow-hidden"
              /* Padding configured through inline style variables */
              style={{
                paddingTop: "90px",
                paddingBottom: "90px",
                paddingLeft: "50px",
                paddingRight: "50px",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#F7B731]/5 to-transparent pointer-events-none" />

              <div className="text-6xl mb-8">💡</div>
              <p className="font-sora text-2xl md:text-3xl text-white font-medium italic mb-8 leading-snug">
                "The best time to start investing was yesterday.{" "}
                <br className="hidden md:block" />
                The second best time is today."
              </p>
              <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#F7B731] text-sm md:text-base font-semibold tracking-wider uppercase">
                — Every successful Indian investor
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ── Redesigned Pro Footer ── */}
      <footer
        className="w-full relative z-10 border-t bg-black/40 backdrop-blur-md"
        /* Pro layout settings ensuring safe padding from browser viewport margins */
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          paddingTop: "90px",
          paddingBottom: "40px",
          paddingLeft: "8%",
          paddingRight: "8%",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center md:items-start text-center md:text-left">
            {/* Left: Brand */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #F7B731, #E09A15)",
                    color: "#0F0F1A",
                  }}
                >
                  ₹
                </div>
                <span className="font-sora font-extrabold text-2xl">
                  <span className="gradient-text-gold">Rupee</span>
                  <span className="text-white">Smart</span>
                </span>
              </div>
              <p className="text-text-secondary text-sm max-w-xs mt-2 leading-relaxed">
                Empowering every Indian with the financial knowledge they need
                to build wealth, step-by-step.
              </p>
            </div>

            {/* Middle: Quick Links */}
            <div className="flex flex-col items-center gap-4">
              <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-2">
                Platform
              </h4>
              <nav className="flex flex-col gap-3">
                <Link
                  to="/learn"
                  className="text-text-secondary hover:text-[#00C48C] transition-colors text-sm"
                >
                  Concept Library
                </Link>
                <Link
                  to="/quiz"
                  className="text-text-secondary hover:text-[#F7B731] transition-colors text-sm"
                >
                  Knowledge Quizzes
                </Link>
                <Link
                  to="/simulator"
                  className="text-text-secondary hover:text-[#818cf8] transition-colors text-sm"
                >
                  Life Simulator
                </Link>
              </nav>
            </div>

            {/* Right: Hackathon / Credits */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-2">
                Project
              </h4>
              <p className="text-text-secondary text-sm">
                Built for{" "}
                <span className="text-white font-semibold">
                  NextGenHacks 2026
                </span>
              </p>
              <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm text-text-secondary">Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span className="text-sm text-text-secondary">in India</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div
            className="border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary"
            style={{ marginTop: "70px", paddingTop: "30px" }}
          >
            <p>© 2026 RupeeSmart. All rights reserved.</p>
            <p>Paisa Samjho, Life Badlo.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
