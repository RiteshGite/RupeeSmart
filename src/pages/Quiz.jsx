import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuizQuestion from "../components/QuizQuestion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import allQuestions from "../data/questions.json";

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    desc: "Basic financial terms",
    color: "#00C48C",
    bg: "rgba(0,196,140,0.1)",
    border: "rgba(0,196,140,0.25)",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "🔥",
    desc: "Real-life scenarios",
    color: "#F7B731",
    bg: "rgba(247,183,49,0.1)",
    border: "rgba(247,183,49,0.25)",
  },
  {
    id: "pro",
    label: "Pro",
    emoji: "💎",
    desc: "Advanced calculations",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.25)",
  },
];

function getGrade(score, total) {
  const pct = (score / total) * 100;
  if (pct === 100)
    return { grade: "A+", message: "Crorepati mindset! 🚀", color: "#00C48C" };
  if (pct >= 80)
    return { grade: "A", message: "Ekdum first class! 🎯", color: "#00C48C" };
  if (pct >= 60)
    return {
      grade: "B",
      message: "Not bad! Thoda aur practice karo 💪",
      color: "#F7B731",
    };
  if (pct >= 40)
    return {
      grade: "C",
      message: "Average performance. Learn more! 📚",
      color: "#F7B731",
    };
  if (pct >= 20)
    return {
      grade: "D",
      message: "Concepts section dekho zaroor 😄",
      color: "#FF6B6B",
    };
  return {
    grade: "F",
    message: "Concepts section dekho pehle 😅",
    color: "#FF6B6B",
  };
}

export default function Quiz() {
  const navigate = useNavigate();
  const [highScores, setHighScores] = useLocalStorage(
    "rupeesmart_quiz_scores",
    {},
  );
  const [phase, setPhase] = useState("select");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startQuiz = (level) => {
    const qs = allQuestions.filter((q) => q.level === level.id);
    setQuestions(qs);
    setSelectedLevel(level);
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
    setPhase("playing");
  };

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => [...a, isCorrect]);
  }, []);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const prev = highScores[selectedLevel.id] || 0;
      if (score > prev) {
        setHighScores({ ...highScores, [selectedLevel.id]: score });
      }
      setPhase("result");
    }
  };

  const { grade, message, color } = selectedLevel
    ? getGrade(score, questions.length)
    : { grade: "", message: "", color: "" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-16 px-4 flex justify-center items-center"
    >
      <div className="max-w-3xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {/* ───── Level Select ───── */}
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full flex flex-col"
            >
              <div className="text-center" style={{ marginBottom: "50px" }}>
                <h1 className="font-sora font-extrabold text-4xl text-white mb-3">
                  Test Your <span className="gradient-text">Knowledge</span>
                </h1>
                <p className="text-text-secondary">
                  10 questions per level • 30 seconds each
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {LEVELS.map((level, i) => {
                  const best = highScores[level.id];
                  return (
                    <motion.div
                      key={level.id}
                      id={`level-${level.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      onClick={() => startQuiz(level)}
                      className="glass-card rounded-2xl flex flex-col items-center text-center cursor-pointer hover:translate-y-[-6px] transition-all duration-300 w-full"
                      style={{
                        borderColor: level.border,
                        padding: "32px 24px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          background: level.bg,
                          border: `1px solid ${level.border}`,
                          marginBottom: "16px",
                        }}
                      >
                        {level.emoji}
                      </div>

                      <h3
                        className="font-sora font-bold text-xl"
                        style={{ color: level.color, marginBottom: "4px" }}
                      >
                        {level.label}
                      </h3>
                      <p
                        className="text-text-secondary text-sm"
                        style={{ marginBottom: "4px" }}
                      >
                        10 questions
                      </p>
                      <p className="text-text-secondary text-xs">
                        {level.desc}
                      </p>

                      <div className="flex-grow" />

                      {best !== undefined ? (
                        <div
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{
                            background: level.bg,
                            color: level.color,
                            border: `1px solid ${level.border}`,
                            marginTop: "24px",
                            marginBottom: "24px",
                            display: "inline-block",
                          }}
                        >
                          Best: {best}/10
                        </div>
                      ) : (
                        <div
                          style={{
                            height: "24px",
                            marginTop: "24px",
                            marginBottom: "24px",
                          }}
                          aria-hidden="true"
                        />
                      )}

                      <button
                        className="btn-primary w-full text-sm py-2.5 rounded-xl font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${level.color}, ${level.color}CC)`,
                          boxShadow: `0 4px 20px ${level.color}40`,
                        }}
                      >
                        Start →
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ───── Playing ───── */}
          {phase === "playing" && questions.length > 0 && (
            <motion.div
              key={`playing-${currentIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-stretch"
            >
              <div className="flex items-center justify-between mb-6 w-full">
                <span
                  className="px-3 py-1.5 rounded-lg font-bold text-sm"
                  style={{
                    background: selectedLevel.bg,
                    color: selectedLevel.color,
                    border: `1px solid ${selectedLevel.border}`,
                  }}
                >
                  {selectedLevel.emoji} {selectedLevel.label}
                </span>
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 border border-white/5">
                  <span className="text-text-secondary text-xs font-medium">
                    Score
                  </span>
                  <span className="font-bold text-white">
                    {score}/{currentIdx}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <QuizQuestion
                  key={currentIdx}
                  question={questions[currentIdx]}
                  questionNumber={currentIdx + 1}
                  total={questions.length}
                  onAnswer={handleAnswer}
                  onNext={handleNext}
                />
              </div>
            </motion.div>
          )}

          {/* ───── Results ───── */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center text-center gap-8"
            >
              {/* Grade Circle + Score */}
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="inline-flex items-center justify-center w-28 h-28 rounded-full text-5xl font-sora font-extrabold shadow-lg"
                  style={{
                    background: `${color}20`,
                    border: `3px solid ${color}`,
                    color,
                  }}
                >
                  {grade}
                </motion.div>

                <div>
                  <h2 className="font-sora font-bold text-3xl text-white mb-2">
                    {score} / {questions.length} Correct
                  </h2>
                  <p className="text-text-secondary text-lg max-w-md">
                    {message}
                  </p>
                </div>
              </div>

              {/* Answer Breakdown */}
              <div
                className="glass-card rounded-2xl p-6 w-full max-w-xl"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h3 className="font-bold text-white mb-5 text-sm tracking-widest uppercase opacity-60">
                  Answer Breakdown
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {answers.map((correct, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        background: correct
                          ? "rgba(0,196,140,0.12)"
                          : "rgba(255,107,107,0.12)",
                        color: correct ? "#00C48C" : "#FF6B6B",
                        border: `1px solid ${correct ? "rgba(0,196,140,0.3)" : "rgba(255,107,107,0.3)"}`,
                      }}
                    >
                      {i + 1}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
                <button
                  id="quiz-try-again"
                  onClick={() => startQuiz(selectedLevel)}
                  className="btn-primary flex-1 py-3.5 rounded-xl font-bold"
                >
                  Try Again 🔄
                </button>
                <button
                  id="quiz-change-level"
                  onClick={() => setPhase("select")}
                  className="btn-secondary flex-1 py-3.5 rounded-xl font-bold"
                >
                  Change Level
                </button>
                <button
                  id="quiz-go-learn"
                  onClick={() => navigate("/learn")}
                  className="btn-secondary flex-1 py-3.5 rounded-xl font-bold"
                >
                  Learn Concepts 📚
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
