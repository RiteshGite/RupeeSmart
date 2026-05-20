import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScenarioCard from "../components/ScenarioCard";
import StatBar from "../components/StatBar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import scenarios from "../data/scenarios.json";

const SALARY_OPTIONS = [
  { label: "₹15,000", sub: "Fresher", value: 15000, emoji: "🌱" },
  { label: "₹25,000", sub: "Junior", value: 25000, emoji: "🚀" },
  { label: "₹50,000", sub: "Mid-level", value: 50000, emoji: "💎" },
];

const CITY_OPTIONS = [
  { label: "Tier 1", sub: "Mumbai / Delhi", expense: 1.3, emoji: "🏙️" },
  { label: "Tier 2", sub: "Pune / Jaipur", expense: 1.0, emoji: "🌆" },
  { label: "Tier 3", sub: "Nashik / Nagpur", expense: 0.75, emoji: "🏡" },
];

const INITIAL_STATS = { savings: 50, debt: 20, happiness: 50, future: 30 };

function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

export default function Simulator() {
  const navigate = useNavigate();
  const [bestScore, setBestScore] = useLocalStorage("rupeesmart_sim_best", 0);
  const [phase, setPhase] = useState("setup");
  const [profile, setProfile] = useState({ name: "", salary: 1, city: 1 });
  const [stats, setStats] = useState(INITIAL_STATS);
  const [prevStats, setPrevStats] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [chosenIndex, setChosenIndex] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [choiceHistory, setChoiceHistory] = useState([]);

  const startSim = () => {
    setStats(INITIAL_STATS);
    setPrevStats(null);
    setCurrentStep(0);
    setChosenIndex(null);
    setFeedback("");
    setShowNext(false);
    setChoiceHistory([]);
    setPhase("playing");
  };

  const handleChoice = useCallback(
    (idx) => {
      const scenario = scenarios[currentStep];
      const choice = scenario.choices[idx];
      const newStats = {
        savings: clamp(stats.savings + choice.impact.savings),
        debt: clamp(stats.debt + choice.impact.debt),
        happiness: clamp(stats.happiness + choice.impact.happiness),
        future: clamp(stats.future + choice.impact.future),
      };
      setPrevStats({ ...stats });
      setStats(newStats);
      setChosenIndex(idx);
      setFeedback(choice.feedback);
      setShowNext(true);
      setChoiceHistory((h) => [
        ...h,
        { scenarioId: scenario.id, choiceIdx: idx, impact: choice.impact },
      ]);
    },
    [stats, currentStep],
  );

  const handleNext = () => {
    if (currentStep < scenarios.length - 1) {
      setCurrentStep((s) => s + 1);
      setChosenIndex(null);
      setFeedback("");
      setShowNext(false);
      setPrevStats(null);
    } else {
      const finalScore = Math.round(
        stats.savings * 0.35 +
          (100 - stats.debt) * 0.25 +
          stats.happiness * 0.15 +
          stats.future * 0.25,
      );
      if (finalScore > bestScore) setBestScore(finalScore);
      navigate("/result", {
        state: { type: "simulator", stats, finalScore, profile, choiceHistory },
      });
    }
  };

  const projectedScore = Math.round(
    stats.savings * 0.35 +
      (100 - stats.debt) * 0.25 +
      stats.happiness * 0.15 +
      stats.future * 0.25,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{
        paddingTop: "160px",
        paddingBottom: "80px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {/* ───── Setup Screen ───── */}
          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
              style={{ gap: "48px" }}
            >
              {/* Header */}
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1
                    className="font-sora font-extrabold text-white"
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.25rem)",
                      lineHeight: 1.15,
                      marginBottom: "16px",
                    }}
                  >
                    Life <span className="gradient-text">Simulator</span> 🎮
                  </h1>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "1rem",
                      maxWidth: "420px",
                      margin: "0 auto",
                    }}
                  >
                    Set up your financial profile and navigate real-life money
                    decisions
                  </p>
                </motion.div>

                {bestScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "20px",
                      padding: "8px 18px",
                      borderRadius: "12px",
                      background: "rgba(247,183,49,0.1)",
                      border: "1px solid rgba(247,183,49,0.25)",
                      color: "#F7B731",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    🏆 Best Score: {bestScore}/100
                  </motion.div>
                )}
              </div>

              {/* Setup Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  borderRadius: "28px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
                }}
              >
                {/* Card Title */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(247,183,49,0.12)",
                      border: "1px solid rgba(247,183,49,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                  >
                    👤
                  </div>
                  <h2
                    className="font-sora font-bold text-white"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Your Financial Profile
                  </h2>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.06)",
                    margin: "-8px 0",
                  }}
                />

                {/* Name */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor="sim-name"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    id="sim-name"
                    type="text"
                    placeholder="e.g. Rahul, Priya..."
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(247,183,49,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
                  />
                </div>

                {/* Salary */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Monthly Salary
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {SALARY_OPTIONS.map((opt, i) => {
                      const active = profile.salary === i;
                      return (
                        <button
                          key={i}
                          id={`salary-${i}`}
                          onClick={() =>
                            setProfile((p) => ({ ...p, salary: i }))
                          }
                          style={{
                            padding: "16px 8px",
                            borderRadius: "16px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.25s",
                            background: active
                              ? "rgba(247,183,49,0.12)"
                              : "rgba(255,255,255,0.03)",
                            border: `1px solid ${active ? "rgba(247,183,49,0.45)" : "rgba(255,255,255,0.08)"}`,
                            transform: active ? "scale(1.04)" : "scale(1)",
                            boxShadow: active
                              ? "0 4px 20px rgba(247,183,49,0.15)"
                              : "none",
                          }}
                        >
                          <div
                            style={{ fontSize: "1.4rem", marginBottom: "6px" }}
                          >
                            {opt.emoji}
                          </div>
                          <div
                            style={{
                              fontFamily: "Sora, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: active ? "#F7B731" : "white",
                              marginBottom: "3px",
                            }}
                          >
                            {opt.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {opt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* City */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    City Tier
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "10px",
                    }}
                  >
                    {CITY_OPTIONS.map((opt, i) => {
                      const active = profile.city === i;
                      return (
                        <button
                          key={i}
                          id={`city-${i}`}
                          onClick={() => setProfile((p) => ({ ...p, city: i }))}
                          style={{
                            padding: "16px 8px",
                            borderRadius: "16px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.25s",
                            background: active
                              ? "rgba(0,196,140,0.1)"
                              : "rgba(255,255,255,0.03)",
                            border: `1px solid ${active ? "rgba(0,196,140,0.45)" : "rgba(255,255,255,0.08)"}`,
                            transform: active ? "scale(1.04)" : "scale(1)",
                            boxShadow: active
                              ? "0 4px 20px rgba(0,196,140,0.12)"
                              : "none",
                          }}
                        >
                          <div
                            style={{ fontSize: "1.4rem", marginBottom: "6px" }}
                          >
                            {opt.emoji}
                          </div>
                          <div
                            style={{
                              fontFamily: "Sora, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: active ? "#00C48C" : "white",
                              marginBottom: "3px",
                            }}
                          >
                            {opt.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {opt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  id="start-simulator"
                  onClick={startSim}
                  style={{
                    width: "100%",
                    padding: "18px",
                    borderRadius: "16px",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #F7B731, #E09A15)",
                    color: "#0F0F1A",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(247,183,49,0.35)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    marginTop: "4px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow =
                      "0 12px 40px rgba(247,183,49,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow =
                      "0 8px 32px rgba(247,183,49,0.35)";
                  }}
                >
                  Start My Journey →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ───── Playing Screen ───── */}
          {phase === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
              style={{ gap: "32px" }}
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="font-sora font-bold text-2xl text-white">
                  {profile.name
                    ? `${profile.name}'s Journey`
                    : "Your Financial Journey"}
                </h1>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.875rem",
                    marginTop: "6px",
                  }}
                >
                  {SALARY_OPTIONS[profile.salary].label} •{" "}
                  {CITY_OPTIONS[profile.city].label} City
                </p>
              </div>

              <div
                className="grid grid-cols-1 lg:grid-cols-5 items-start"
                style={{ gap: "24px" }}
              >
                {/* Left: Stats Panel */}
                <div className="lg:col-span-2">
                  <div
                    className="sticky"
                    style={{
                      top: "100px",
                      borderRadius: "24px",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {/* Panel Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#00C48C",
                          boxShadow: "0 0 8px #00C48C",
                          display: "inline-block",
                          animation: "pulse 2s infinite",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        Live Stats
                      </span>
                    </div>

                    {/* Stat Bars */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {Object.keys(stats).map((key) => (
                        <StatBar
                          key={key}
                          statKey={key}
                          value={stats[key]}
                          previousValue={
                            prevStats ? prevStats[key] : stats[key]
                          }
                          showDelta={prevStats !== null}
                        />
                      ))}
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    />

                    {/* Projected Score */}
                    <div
                      style={{
                        borderRadius: "16px",
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(247,183,49,0.07)",
                        border: "1px solid rgba(247,183,49,0.15)",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(247,183,49,0.6)",
                            marginBottom: "4px",
                          }}
                        >
                          Projected Score
                        </p>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          Based on current stats
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "2.25rem",
                          fontFamily: "Sora, sans-serif",
                          fontWeight: 800,
                          color: "#F7B731",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {projectedScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Scenario Card */}
                <div
                  className="lg:col-span-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -32 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ScenarioCard
                        scenario={scenarios[currentStep]}
                        stepNumber={currentStep + 1}
                        total={scenarios.length}
                        onChoice={handleChoice}
                        chosenIndex={chosenIndex}
                        feedback={feedback}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Next Button */}
                  <AnimatePresence>
                    {showNext && (
                      <motion.button
                        id="scenario-next"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        onClick={handleNext}
                        style={{
                          width: "100%",
                          padding: "18px",
                          borderRadius: "16px",
                          fontFamily: "Sora, sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          background:
                            "linear-gradient(135deg, #F7B731, #E09A15)",
                          color: "#0F0F1A",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 8px 28px rgba(247,183,49,0.25)",
                          transition: "transform 0.2s",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentStep === scenarios.length - 1
                          ? "See My Results 🏆"
                          : "Next Scenario →"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
