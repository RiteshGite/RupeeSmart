import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import ProgressRing from "../components/ProgressRing";
import StatBar from "../components/StatBar";

const AVATARS = [
  {
    minScore: 90,
    emoji: "🦈",
    name: "Shark Tank Chacha",
    message:
      "Aree waah! Tera financial IQ dekh ke Shark Tank wale bhi bolenge — ‘Isko equity de do bhai!’ 💸",
  },

  {
    minScore: 80,
    emoji: "👑",
    name: "Fin-fluencer Pro",
    message:
      "Utha le re baba! Utha le! Itna financial gyaan kaha se laaya? Raju bhi tips lene aa raha hai 😂",
  },

  {
    minScore: 75,
    emoji: "💹",
    name: "Wolf of Dalal Street",
    message:
      "Market gir raha ho ya uth raha ho… tu toh aise invest kar raha jaise Babu Bhaiya ka hidden locker mil gaya 😎",
  },

  {
    minScore: 65,
    emoji: "📈",
    name: "SIP Samrat",
    message:
      "Babu Bhaiya bolte — ‘Beta paisa invest karo… mattress ke niche mat chupao!’ 📊",
  },

  {
    minScore: 55,
    emoji: "🧠",
    name: "Mutual Fund Mahatma",
    message:
      "Risk hai toh ishq hai 😭 Lekin tu thoda smart nikla… pura Anurag level ka nahi hai.",
  },

  {
    minScore: 45,
    emoji: "💳",
    name: "Credit Card Yoddha",
    message:
      "Cashback ke chakkar me ₹2000 ka burger order kar diya kya? Control Uday control 🍔💀",
  },

  {
    minScore: 35,
    emoji: "💸",
    name: "EMI Engineer",
    message:
      "Salary aate hi account bolta hai — ‘Ye toh shuru hote hi khatam ho gaya!’ EMI ne khoon choos liya 😭",
  },

  {
    minScore: 25,
    emoji: "📉",
    name: "Loss Ka Badshah",
    message:
      "Tu invest kam aur donation zyada kar raha hai market ko 💀 Sensex tujhe dekh ke hasta hoga.",
  },

  {
    minScore: 15,
    emoji: "🪙",
    name: "Crypto Ka Fakir",
    message:
      "‘Bhai ye coin 100x jayega!’ — aur agle din founder Maldives bhaag gaya 😂",
  },

  {
    minScore: 0,
    emoji: "😂",
    name: "25 Din Me Paisa Double",
    message:
      "Tu pakka Laxmi Chit Fund ka premium member hai 💀 Raju: ‘Paisa hi paisa hoga!’ Reality: ‘Kidhar hai paisa?’",
  },
];

const TIPS = [
  {
    trigger: "debt",
    tip: "💳 Credit card interest at 36-42% annually can seriously impact long-term wealth. Always try to pay the full bill on time.",
    threshold: 50,
  },

  {
    trigger: "savings",
    tip: "💰 Build an emergency fund covering at least 3–6 months of expenses before investing aggressively.",
    threshold: 40,
    low: true,
  },

  {
    trigger: "future",
    tip: "🔮 Starting early matters more than investing large amounts later. Consistency beats timing.",
    threshold: 50,
    low: true,
  },

  {
    trigger: "happiness",
    tip: "😊 A sustainable budget should include some room for enjoyment and personal spending.",
    threshold: 30,
    low: true,
  },

  {
    trigger: "investment",
    tip: "📈 Diversification reduces risk. Avoid putting all your money into a single stock or asset.",
    threshold: 60,
  },

  {
    trigger: "budget",
    tip: "📊 Tracking expenses regularly is one of the fastest ways to improve financial habits.",
    threshold: 35,
    low: true,
  },

  {
    trigger: "salary",
    tip: "💵 Try following the ‘Pay Yourself First’ rule — invest or save before spending.",
    threshold: 40,
    low: true,
  },

  {
    trigger: "retirement",
    tip: "🏖️ Retirement planning becomes much easier when started in your 20s, even with small SIPs.",
    threshold: 50,
    low: true,
  },

  {
    trigger: "emi",
    tip: "🏦 Keep total EMIs within a manageable percentage of your monthly income to avoid financial stress.",
    threshold: 60,
  },

  {
    trigger: "insurance",
    tip: "🛡️ Health insurance and term insurance are essential foundations of financial planning.",
    threshold: 45,
    low: true,
  },

  {
    trigger: "tax",
    tip: "🧾 Smart tax planning can help you legally save more and improve investment efficiency.",
    threshold: 50,
  },

  {
    trigger: "goals",
    tip: "🎯 Set clear financial goals — short-term, medium-term, and long-term — for better planning.",
    threshold: 30,
    low: true,
  },

  {
    trigger: "inflation",
    tip: "📉 Inflation silently reduces purchasing power. Investments should aim to beat inflation over time.",
    threshold: 55,
  },

  {
    trigger: "risk",
    tip: "⚖️ Higher returns usually come with higher risk. Choose investments based on your risk tolerance.",
    threshold: 65,
  },
];

function getAvatar(score) {
  return (
    AVATARS.find((a) => score >= a.minScore) || AVATARS[AVATARS.length - 1]
  );
}

function getPersonalizedTips(stats, choiceHistory) {
  const tips = [];
  if (stats.debt > 50) tips.push(TIPS[0]);
  if (stats.savings < 40) tips.push(TIPS[1]);
  if (stats.future < 50) tips.push(TIPS[2]);
  if (stats.happiness < 30) tips.push(TIPS[3]);
  const extras = [
    "📈 SIP (Systematic Investment Plan) is the most powerful wealth-building tool for young Indians.",
    "🛡️ PPF gives tax-free 7.1% returns — open one today if you have a 15-year horizon.",
    "📊 Index funds beat 80% of actively managed funds over 10+ years. Keep costs low!",
    "🏦 Fixed Deposits are safe but inflation-adjusted returns are often negative. Diversify!",
  ];
  let ei = 0;
  while (tips.length < 3 && ei < extras.length) {
    tips.push({ tip: extras[ei] });
    ei++;
  }
  return tips.slice(0, 3);
}

function getScoreColor(s) {
  if (s >= 80) return "#00C48C";
  if (s >= 60) return "#F7B731";
  if (s >= 40) return "#818cf8";
  return "#FF6B6B";
}

function getScoreGrade(s) {
  if (s >= 80) return "A+";
  if (s >= 60) return "A";
  if (s >= 40) return "B";
  return "C";
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareRef = useRef(null);
  const state = location.state;

  if (!state) {
    return (
      <div
        style={{
          minHeight: "100vh",
          paddingTop: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🤔</div>
          <h2
            className="font-sora font-bold text-2xl text-white"
            style={{ marginBottom: "8px" }}
          >
            Kuch toh gadbad hai!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
            Please complete the simulator or quiz first.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { type, stats, finalScore, profile, choiceHistory } = state;
  const score = finalScore || 0;
  const avatar = getAvatar(score);
  const tips = getPersonalizedTips(stats || {}, choiceHistory || []);
  const scoreColor = getScoreColor(score);

  const handleShare = () => {
    const text = `🎮 I scored ${score}/100 on RupeeSmart Life Simulator!\nMy avatar: ${avatar.emoji} ${avatar.name}\n"${avatar.message}"\n\nTest your financial IQ at RupeeSmart! 💰`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Score copied to clipboard! Share it with your friends 🚀");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        paddingTop: "88px",
        paddingBottom: "40px",
        paddingLeft: "24px",
        paddingRight: "24px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── TOP ROW: Hero + Stats side by side ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* LEFT — Hero Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            style={{
              borderRadius: "24px",
              padding: "32px 24px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${scoreColor}30`,
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `radial-gradient(ellipse at 50% 20%, ${scoreColor}20 0%, transparent 65%)`,
              }}
            />

            {/* Avatar emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{
                fontSize: "3.5rem",
                lineHeight: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              {avatar.emoji}
            </motion.div>

            {/* Grade badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: `${scoreColor}20`,
                border: `1px solid ${scoreColor}50`,
                color: scoreColor,
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              {getScoreGrade(score)}
            </div>

            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: scoreColor,
                position: "relative",
                zIndex: 1,
                margin: 0,
              }}
            >
              {avatar.name}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.8rem",
                position: "relative",
                zIndex: 1,
                margin: 0,
              }}
            >
              {avatar.message}
            </p>

            {/* Score Ring */}
            <div style={{ position: "relative", zIndex: 1, margin: "8px 0" }}>
              <ProgressRing
                score={score}
                size={150}
                label="Final Score"
                animate={true}
              />
            </div>

            {profile?.name && (
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Results for{" "}
                <span style={{ color: "white", fontWeight: 600 }}>
                  {profile.name}
                </span>
              </p>
            )}
          </motion.div>

          {/* RIGHT — Stat Breakdown */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                borderRadius: "24px",
                padding: "28px 32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "white",
                    margin: 0,
                  }}
                >
                  Score Breakdown
                </h3>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  Final: {score}/100
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  flex: 1,
                }}
              >
                {Object.keys(stats).map((key) => (
                  <StatBar
                    key={key}
                    statKey={key}
                    value={stats[key]}
                    showDelta={false}
                  />
                ))}
              </div>

              {/* Weight pills */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {[
                  ["💰", "Savings", "35%", "#00C48C"],
                  ["💳", "Debt Free", "25%", "#FF6B6B"],
                  ["🔮", "Future", "25%", "#818cf8"],
                  ["😊", "Happiness", "15%", "#F7B731"],
                ].map(([emoji, label, weight, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      fontSize: "0.72rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span>{emoji}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                      {label}
                    </span>
                    <span style={{ color, fontWeight: 700 }}>{weight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── BOTTOM ROW: Tips + Share + Buttons ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "20px",
          }}
        >
          {/* LEFT — Tips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              borderRadius: "24px",
              padding: "28px 32px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <h3
              style={{
                fontFamily: "Sora, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "white",
                margin: 0,
              }}
            >
              💡 Personalized Tips For You
            </h3>

            {tips.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: "rgba(0,196,140,0.06)",
                  border: "1px solid rgba(0,196,140,0.15)",
                }}
              >
                <span
                  style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}
                >
                  🎯
                </span>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {t.tip}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT — Share Card + Buttons stacked */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Share Card */}
            <motion.div
              ref={shareRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                borderRadius: "24px",
                padding: "24px",
                textAlign: "center",
                flex: 1,
                background: `linear-gradient(135deg, ${scoreColor}12, rgba(20,20,40,0.95))`,
                border: `1px solid ${scoreColor}30`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <div style={{ fontSize: "2.5rem" }}>{avatar.emoji}</div>
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "white",
                  margin: 0,
                }}
              >
                I scored{" "}
                <span style={{ color: scoreColor, fontSize: "1.3rem" }}>
                  {score}
                </span>
                <span
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}
                >
                  /100
                </span>
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.75rem",
                  margin: 0,
                }}
              >
                {avatar.name} — {avatar.message}
              </p>
              <div
                style={{
                  marginTop: "6px",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.65rem",
                    margin: 0,
                  }}
                >
                  RupeeSmart | Financial Literacy for Every Indian 🇮🇳
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                id="result-play-again"
                onClick={() => navigate("/simulator")}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, #F7B731, #E09A15)",
                  color: "#0F0F1A",
                  boxShadow: "0 6px 24px rgba(247,183,49,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 8px 28px rgba(247,183,49,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 6px 24px rgba(247,183,49,0.3)";
                }}
              >
                Play Again 🔄
              </button>

              <Link
                to="/learn"
                id="result-learn"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                  transition: "background 0.2s, border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.09)";
                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Learn Concepts 📚
              </Link>

              <button
                id="result-share"
                onClick={handleShare}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: `1px solid ${scoreColor}40`,
                  cursor: "pointer",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  background: `${scoreColor}12`,
                  color: scoreColor,
                  transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${scoreColor}20`;
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = `${scoreColor}12`;
                  e.target.style.transform = "scale(1)";
                }}
              >
                Share Score 📤
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
