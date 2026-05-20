import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const statConfig = {
  savings: {
    label: "Savings",
    emoji: "💰",
    color: "#00C48C",
    gradient: "linear-gradient(90deg, #00C48C, #00E5A6)",
    bg: "rgba(0,196,140,0.06)",
  },
  debt: {
    label: "Debt",
    emoji: "💳",
    color: "#FF6B6B",
    gradient: "linear-gradient(90deg, #FF6B6B, #FF9A9A)",
    bg: "rgba(255,107,107,0.06)",
  },
  happiness: {
    label: "Happiness",
    emoji: "😊",
    color: "#F7B731",
    gradient: "linear-gradient(90deg, #F7B731, #FFD700)",
    bg: "rgba(247,183,49,0.06)",
  },
  future: {
    label: "Future Score",
    emoji: "🔮",
    color: "#818cf8",
    gradient: "linear-gradient(90deg, #818cf8, #a5b4fc)",
    bg: "rgba(129,140,248,0.06)",
  },
};

export default function StatBar({
  statKey,
  value,
  previousValue,
  showDelta = false,
}) {
  const config = statConfig[statKey];
  const [displayValue, setDisplayValue] = useState(previousValue ?? value);
  const clamped = Math.max(0, Math.min(100, value));
  const delta =
    showDelta && previousValue !== undefined ? value - previousValue : null;

  useEffect(() => {
    const start = previousValue ?? 0;
    const end = value;
    const duration = 900;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300"
      style={{ background: config.bg, border: `1px solid ${config.color}18` }}
    >
      {/* Emoji */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: `${config.color}15`,
          border: `1px solid ${config.color}30`,
        }}
      >
        {config.emoji}
      </div>

      {/* Bar + Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold tracking-wide"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {config.label.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            {delta !== null && delta !== 0 && (
              <motion.span
                initial={{ opacity: 0, y: -6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: delta > 0 ? "#00C48C" : "#FF6B6B",
                  background:
                    delta > 0
                      ? "rgba(0,196,140,0.12)"
                      : "rgba(255,107,107,0.12)",
                  border: `1px solid ${delta > 0 ? "rgba(0,196,140,0.25)" : "rgba(255,107,107,0.25)"}`,
                }}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </motion.span>
            )}
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: config.color }}
            >
              {displayValue}%
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: "6px", background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            initial={{
              width: `${Math.max(0, Math.min(100, previousValue ?? 0))}%`,
            }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              height: "100%",
              borderRadius: "999px",
              background: config.gradient,
              boxShadow: `0 0 10px ${config.color}60`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
