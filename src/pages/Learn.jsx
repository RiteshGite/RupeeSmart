import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConceptCard from "../components/ConceptCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import concepts from "../data/concepts.json";

const CATEGORIES = ["All", "Basics", "Investing", "Saving", "Debt"];

const categoryColors = {
  All: "#A0A0B8",
  Basics: "#F7B731",
  Investing: "#00C48C",
  Saving: "#60a5fa",
  Debt: "#FF6B6B",
};

export default function Learn() {
  const [readIds, setReadIds] = useLocalStorage("rupeesmart_read_cards", []);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? concepts
      : concepts.filter((c) => c.category === activeCategory);

  const markRead = (id) => {
    if (!readIds.includes(id)) setReadIds([...readIds, id]);
  };

  const readCount = readIds.length;
  const totalCount = concepts.length;
  const progress = totalCount > 0 ? (readCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{
        paddingTop: "120px",
        paddingBottom: "100px",
        paddingLeft: "6%",
        paddingRight: "6%",
        boxSizing: "border-box",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* ── Header Container ── */}
        <div style={{ marginBottom: "48px" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
              style={{ marginBottom: "32px" }}
            >
              <div>
                <h1 className="font-sora font-extrabold text-4xl text-white mb-2 tracking-tight">
                  Financial <span className="gradient-text">Concepts</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-base">
                  {totalCount} cards to master • Flip each card to learn!
                </p>
              </div>

              {/* Progress Panel */}
              <div className="flex-shrink-0 glass rounded-2xl p-5 min-w-[240px] border border-white/5 shadow-xl">
                <div className="flex justify-between text-sm mb-2.5">
                  <span className="text-text-secondary font-medium">
                    Progress
                  </span>
                  <span className="font-mono-nums font-bold text-white bg-white/10 px-2 py-0.5 rounded-md text-xs">
                    {readCount} / {totalCount}
                  </span>
                </div>
                <div className="progress-bar mb-2 bg-white/10 rounded-full h-2 overflow-hidden relative">
                  <motion.div
                    className="progress-fill h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #00C48C, #60a5fa)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-text-secondary font-medium">
                  {readCount === totalCount
                    ? "🎉 All concepts mastered!"
                    : `${totalCount - readCount} cards remaining`}
                </p>
              </div>
            </div>

            {/* Filter Navigation Tabs */}
            <div className="flex flex-wrap gap-4" role="tablist">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`filter-${cat.toLowerCase()}`}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-8 py-3.5 rounded-2xl text-base font-bold transition-colors duration-300 outline-none tracking-wide
                      ${isSelected ? "text-[#0F0F1A]" : "text-text-secondary hover:text-white glass border border-white/5"}`}
                  >
                    {/* Sliding Background Pill */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-2xl z-0"
                        style={{
                          background: categoryColors[cat],
                          boxShadow: `0 6px 24px ${categoryColors[cat]}50`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center justify-center gap-1">
                      {cat}
                      {cat !== "All" && (
                        <span
                          className={`ml-2 text-xs font-extrabold ${isSelected ? "text-[#0F0F1A]/80" : "text-text-secondary/80"}`}
                        >
                          ({concepts.filter((c) => c.category === cat).length})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Card Layout Grid Wrapper ── */}
        <div className="w-full flex justify-center">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
            style={{
              justifyItems: "center",
              alignItems: "center",
              maxWidth: "100%",
            }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((concept) => (
                <motion.div
                  key={concept.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex justify-center"
                >
                  <ConceptCard
                    concept={concept}
                    isRead={readIds.includes(concept.id)}
                    onMarkRead={markRead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Fallback Empty State ── */}
        {filtered.length === 0 && (
          <div className="text-center py-24 glass rounded-3xl border border-white/5 border-dashed">
            <div className="text-5xl mb-4 animate-pulse">🔍</div>
            <p className="text-text-secondary text-lg font-medium">
              No financial concepts found in this module.
            </p>
          </div>
        )}

        {/* ── Configuration Reset Trigger ── */}
        {readCount > 0 && (
          <div className="text-center" style={{ marginTop: "56px" }}>
            <button
              id="reset-progress"
              onClick={() => setReadIds([])}
              className="text-xs text-text-secondary hover:text-red-400 font-medium transition-colors duration-200 underline underline-offset-4"
            >
              Reset progress tracking data
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
