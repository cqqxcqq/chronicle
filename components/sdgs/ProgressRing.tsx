"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import styles from "./ProgressRing.module.css";

interface ProgressRingProps {
  progress: number;
  color: string;
}

export default function ProgressRing({ progress, color }: ProgressRingProps) {
  const size = 90;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const gradientId = `progress-grad-${color.replace("#", "")}`;

  return (
    <div className={styles.container}>
      <svg width={size} height={size} className={styles.ring}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {progress >= 60 ? (
              <>
                <stop offset="0%" stopColor="var(--color-sage)" />
                <stop offset="100%" stopColor="var(--color-sage-glow)" />
              </>
            ) : progress >= 30 ? (
              <>
                <stop offset="0%" stopColor="var(--color-amber)" />
                <stop offset="100%" stopColor="var(--color-gold)" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="var(--color-blood)" />
                <stop offset="100%" stopColor="var(--color-crimson)" />
              </>
            )}
          </linearGradient>
          <filter id={`glow-${gradientId}`}>
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor={color}
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            rotate: "-90deg",
            transformOrigin: "center",
            filter: `url(#glow-${gradientId})`,
          }}
        />
      </svg>
      <div className={styles.label}>
        <AnimatedNumber value={progress} decimals={0} suffix="%" />
      </div>
    </div>
  );
}
