import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizQuestion({
  question,
  questionNumber,
  total,
  onAnswer,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const TIMER_MAX = 30;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (timeLeft / TIMER_MAX) * circumference;

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setTimeLeft(30);
  }, [question]);

  useEffect(() => {
    if (answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question, answered]);

  const handleTimeout = () => {
    if (!answered) {
      setAnswered(true);
      setSelected(-1);
      onAnswer(false);
    }
  };

  const handleSelect = (idx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
    onAnswer(idx === question.correct);
  };

  const optionLabels = ["A", "B", "C", "D"];
  const timerColor =
    timeLeft > 15 ? "#00C48C" : timeLeft > 7 ? "#F7B731" : "#FF6B6B";

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      {/* Header: progress + timer */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 mr-6">
          <div className="flex justify-between text-xs text-text-secondary mb-3 font-medium">
            <span>
              Question {questionNumber} of {total}
            </span>
          </div>
          <div className="progress-bar h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="progress-fill h-full bg-primary"
              initial={{ width: `${((questionNumber - 1) / total) * 100}%` }}
              animate={{ width: `${(questionNumber / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Circular Timer */}
        <div className="relative flex-shrink-0">
          <svg width="70" height="70" className="timer-svg">
            <circle
              cx="35"
              cy="35"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
            />
            <motion.circle
              cx="35"
              cy="35"
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transformOrigin: "35px 35px",
                transform: "rotate(-90deg)",
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-mono-nums font-bold text-sm"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Question Card (With internal padding & vertical margin gap before options) */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 mb-8"
      >
        <p className="font-sora font-semibold text-lg md:text-xl text-white leading-relaxed">
          {question.question}
        </p>
      </motion.div>

      {/* Options Grid (With gap between 4th option and bottom sections) */}
      <div className="grid gap-4 mb-8 mt-4">
        {question.options.map((option, idx) => {
          let optionClass = "quiz-option";
          if (answered) {
            if (idx === question.correct) optionClass += " correct";
            else if (idx === selected && idx !== question.correct)
              optionClass += " wrong";
            else optionClass += " disabled";
          }
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${optionClass} p-4 rounded-xl`}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background:
                      answered && idx === question.correct
                        ? "rgba(0,196,140,0.2)"
                        : answered &&
                          idx === selected &&
                          idx !== question.correct
                        ? "rgba(255,107,107,0.2)"
                        : "rgba(255,255,255,0.05)",
                    color:
                      answered && idx === question.correct
                        ? "#00C48C"
                        : answered &&
                          idx === selected &&
                          idx !== question.correct
                        ? "#FF6B6B"
                        : "#A0A0B8",
                  }}
                >
                  {optionLabels[idx]}
                </span>
                <span className="text-sm font-medium text-white text-left">
                  {option}
                </span>
                {answered && idx === question.correct && (
                  <span className="ml-auto text-primary text-xl flex-shrink-0">
                    ✓
                  </span>
                )}
                {answered && idx === selected && idx !== question.correct && (
                  <span className="ml-auto text-danger text-xl flex-shrink-0">
                    ✗
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback, Explanation & Actions Container */}
      <div className="flex flex-col gap-6">
        {/* Centered & Padded Timeout Alert */}
        {answered && selected === -1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 bg-danger/10 border-danger/20 flex items-center justify-center text-center"
          >
            <p className="text-danger text-sm font-semibold">
              ⏰ Time's up! Let's check the right answer.
            </p>
          </motion.div>
        )}

        {/* Padded Explanation Card */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 md:p-8 bg-primary/5 border border-primary/20 shadow-inner"
            >
              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3">
                💡 Explanation
              </p>
              <p className="text-sm text-white/90 leading-relaxed">
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Isolated Next Button */}
        <AnimatePresence>
          {answered && (
            <motion.button
              id="btn-next-question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 mt-4"
              onClick={onNext}
            >
              {questionNumber === total ? "See Results 🏆" : "Next Question →"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}