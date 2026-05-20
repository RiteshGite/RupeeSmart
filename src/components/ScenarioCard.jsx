import { motion, AnimatePresence } from "framer-motion";

export default function ScenarioCard({
  scenario,
  stepNumber,
  total,
  onChoice,
  chosenIndex,
  feedback,
}) {
  const chosen = chosenIndex !== null && chosenIndex !== undefined;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
          style={{
            background: "rgba(247,183,49,0.1)",
            border: "1px solid rgba(247,183,49,0.25)",
            color: "#F7B731",
          }}
        >
          📍 {stepNumber} / {total}
        </span>
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{ height: "4px", background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            initial={{ width: `${((stepNumber - 1) / total) * 100}%` }}
            animate={{ width: `${(stepNumber / total) * 100}%` }}
            transition={{ duration: 0.6 }}
            style={{
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #F7B731, #E09A15)",
              boxShadow: "0 0 8px rgba(247,183,49,0.5)",
            }}
          />
        </div>
        <span className="text-xs text-white/30 flex-shrink-0 tabular-nums">
          {Math.round((stepNumber / total) * 100)}%
        </span>
      </div>

      {/* Scenario Card */}
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Scenario
        </p>
        <h2 className="font-sora font-bold text-xl text-white mb-3 leading-snug">
          {scenario.title}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {scenario.description}
        </p>
      </motion.div>

      {/* Choices */}
      <div className="flex flex-col gap-3">
        {scenario.choices.map((choice, idx) => {
          const isSelected = chosenIndex === idx;
          const isOther = chosen && !isSelected;

          return (
            <motion.button
              key={idx}
              id={`choice-${idx}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              disabled={chosen}
              onClick={() => onChoice(idx)}
              className="text-left w-full rounded-2xl p-4 transition-all duration-300 cursor-pointer"
              style={{
                background: isSelected
                  ? "rgba(0,196,140,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  isSelected ? "rgba(0,196,140,0.4)" : "rgba(255,255,255,0.08)"
                }`,
                opacity: isOther ? 0.35 : 1,
                boxShadow: isSelected
                  ? "0 0 24px rgba(0,196,140,0.12)"
                  : "none",
                transform: isSelected ? "scale(1.01)" : "scale(1)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">
                  {choice.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{
                      color: isSelected ? "#fff" : "rgba(255,255,255,0.75)",
                    }}
                  >
                    {choice.text}
                  </p>

                  {/* Impact chips */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {Object.entries(choice.impact).map(([stat, val]) => {
                        if (val === 0) return null;
                        const statEmoji = {
                          savings: "💰",
                          debt: "💳",
                          happiness: "😊",
                          future: "🔮",
                        }[stat];
                        const isPos = val > 0;
                        return (
                          <span
                            key={stat}
                            className="text-xs px-2.5 py-1 rounded-full font-bold tabular-nums"
                            style={{
                              background: isPos
                                ? "rgba(0,196,140,0.15)"
                                : "rgba(255,107,107,0.15)",
                              color: isPos ? "#00C48C" : "#FF6B6B",
                              border: `1px solid ${isPos ? "rgba(0,196,140,0.35)" : "rgba(255,107,107,0.35)"}`,
                            }}
                          >
                            {statEmoji} {isPos ? "+" : ""}
                            {val}
                          </span>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {isSelected && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#00C48C", color: "#0F0F1A" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(247,183,49,0.07)",
              border: "1px solid rgba(247,183,49,0.2)",
            }}
          >
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p
                className="text-xs font-bold tracking-wider uppercase mb-1"
                style={{ color: "rgba(247,183,49,0.5)" }}
              >
                Feedback
              </p>
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: "#F7B731" }}
              >
                {feedback}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
