import { useState } from "react";
import { motion } from "framer-motion";

const categoryColors = {
  Investing: "badge-investing",
  Saving: "badge-saving",
  Basics: "badge-basics",
  Debt: "badge-debt",
};

export default function ConceptCard({ concept, isRead, onMarkRead }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);

  const handleMarkRead = (e) => {
    e.stopPropagation();
    onMarkRead(concept.id);
  };

  return (
    <div
      id={`card-${concept.id}`}
      className="flip-card transition-transform duration-300 hover:scale-[1.02]"
      style={{
        width: "340px",
        maxWidth: "100%",
        height: "280px",
        margin: "0 auto",
      }}
      onClick={handleFlip}
    >
      {/* Inner — this is what rotates */}
      <div className={`flip-card-inner${flipped ? " flipped" : ""}`}>
        {/* ── Front Face ── */}
        <div
          className="flip-card-front glass-card flex flex-col items-center justify-center text-center p-6 relative"
          style={{
            border: isRead
              ? "1px solid rgba(0,196,140,0.35)"
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Read tick */}
          {isRead && (
            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#00C48C", color: "#0F0F1A" }}
            >
              ✓
            </div>
          )}

          {/* Subtle glow blob */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-28 h-28 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,196,140,0.12), transparent 70%)",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-5xl leading-none">{concept.emoji}</span>
            <h3 className="font-sora font-bold text-2xl text-white leading-tight">
              {concept.term}
            </h3>
            <p className="text-text-secondary text-xs">{concept.fullForm}</p>
            <span
              className={`badge ${categoryColors[concept.category] || "badge-basics"}`}
            >
              {concept.category}
            </span>
            <p className="text-text-secondary text-xs mt-1 animate-pulse">
              Tap to flip 👆
            </p>
          </div>
        </div>

        {/* ── Back Face ── */}
        <div
          className="flip-card-back flex flex-col justify-between relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,196,140,0.12), rgba(30,30,48,0.96))",
            border: "1px solid rgba(0,196,140,0.25)",
            /* KEY INLINE FIXES: Forced explicit internal spacing values that 
              override global stylesheet sheets and layout behavior rules.
            */
            padding: "24px 28px",
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top info wrapper */}
          <div
            className="flex flex-col gap-4 w-full"
            style={{ boxSizing: "border-box" }}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="text-2xl">{concept.emoji}</span>
              <span className="font-sora font-bold text-white text-base leading-tight">
                {concept.term}
              </span>
              <span
                className={`badge ${categoryColors[concept.category] || "badge-basics"} ml-auto`}
              >
                {concept.category}
              </span>
            </div>

            <p className="text-white text-sm leading-relaxed text-left tracking-wide opacity-95">
              {concept.explanation}
            </p>

            {/* Example Block Container */}
            <div
              className="rounded-xl p-3 text-left w-full"
              style={{
                background: "rgba(247,183,49,0.08)",
                border: "1px solid rgba(247,183,49,0.2)",
                boxSizing: "border-box",
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "#A0A0B8" }}
              >
                💡 Real Example
              </p>
              <p
                className="text-sm font-semibold font-mono-nums"
                style={{ color: "#F7B731" }}
              >
                {concept.example}
              </p>
            </div>
          </div>

          {/* Got it button */}
          <button
            id={`mark-read-${concept.id}`}
            onClick={handleMarkRead}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 mt-3 cursor-pointer ${
              isRead ? "" : "btn-primary"
            }`}
            style={
              isRead
                ? {
                    background: "rgba(0,196,140,0.15)",
                    color: "#00C48C",
                    border: "1px solid rgba(0,196,140,0.3)",
                    cursor: "default",
                  }
                : {}
            }
          >
            {isRead ? "✓ Got it!" : "Got it ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
