import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ score = 0, size = 160, label = 'Score', animate = true }) {
  const [displayScore, setDisplayScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return ['#00C48C', '#00E5A6'];
    if (s >= 60) return ['#F7B731', '#FFD700'];
    if (s >= 40) return ['#818cf8', '#a5b4fc'];
    return ['#FF6B6B', '#FF9A9A'];
  };

  const [c1, c2] = getColor(score);

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    const start = 0;
    const end = score;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score, animate]);

  const gradientId = `ringGrad-${label.replace(/\s/g, '')}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          {/* Progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transformOrigin: `${size / 2}px ${size / 2}px`, transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sora font-bold text-4xl" style={{ color: c1 }}>
            {displayScore}
          </span>
          <span className="text-text-secondary text-xs">{label}</span>
        </div>
      </div>
    </div>
  );
}
