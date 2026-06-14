"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ClosingSequence.module.css";

const lines = [
  "You have seen two hundred years of human struggle.",
  "From darkness to light. From ignorance to knowledge.",
  "The story is not over.",
];

const CHAR_DELAY = 0.05;

function StaggeredLine({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const revealTime = text.length * CHAR_DELAY + 0.5;

  useEffect(() => {
    const t = setTimeout(() => {
      onComplete?.();
    }, revealTime * 1000);
    return () => clearTimeout(t);
  }, [revealTime, onComplete]);

  return (
    <p className={styles.line}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={styles.char}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: i * CHAR_DELAY }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}

interface CounterProps {
  from: number;
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  label: string;
}

function AnimatedCounter({
  from,
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2000,
  delay = 0,
  label,
}: CounterProps) {
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(current);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [started, from, to, duration]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value);

  return (
    <div className={styles.counter}>
      <p className={styles.counterValue}>
        {prefix}{display}{suffix}
      </p>
      <p className={styles.counterLabel}>{label}</p>
    </div>
  );
}

interface ClosingSequenceProps {
  onEnd: () => void;
}

export default function ClosingSequence({ onEnd }: ClosingSequenceProps) {
  const [lineIdx, setLineIdx] = useState(-1);
  const [showCounters, setShowCounters] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLineIdx(0), 1000);
    return () => clearTimeout(t);
  }, []);

  const onLineComplete = useCallback(() => {
    const next = lineIdx + 1;
    if (next < lines.length) {
      setTimeout(() => setLineIdx(next), 2000);
    } else {
      setTimeout(() => setShowCounters(true), 2500);
    }
  }, [lineIdx]);

  const handleCountersComplete = useCallback(() => {
    setTimeout(() => setShowTitle(true), 1500);
  }, []);

  const handleClick = useCallback(() => {
    onEnd();
  }, [onEnd]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!showCounters && !showTitle && lineIdx >= 0 && lineIdx < lines.length && (
          <motion.div
            key={`line-${lineIdx}`}
            className={styles.lineBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <StaggeredLine text={lines[lineIdx]} onComplete={onLineComplete} />
          </motion.div>
        )}

        {showCounters && !showTitle && (
          <motion.div
            key="counters"
            className={styles.countersBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.0 }}
            onAnimationComplete={handleCountersComplete}
          >
            <p className={styles.countersLabel}>WHAT CHANGED</p>
            <div className={styles.countersGrid}>
              <AnimatedCounter from={89} to={8.5} suffix="%" label="poverty" delay={500} duration={2500} decimals={1} />
              <AnimatedCounter from={460} to={37} label="child deaths per 1,000" delay={1000} duration={2500} />
              <AnimatedCounter from={12} to={87} suffix="%" label="literacy" delay={1500} duration={2500} />
              <AnimatedCounter from={29} to={73} suffix=" yr" label="life expectancy" delay={2000} duration={2500} />
            </div>
          </motion.div>
        )}

        {showTitle && (
          <motion.div
            key="title"
            className={styles.titleBlock}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.5 }}
          >
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              CHRONICLE
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.8 }}
            >
              A history of human progress.
            </motion.p>
            <motion.p
              className={styles.closing}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 2.0 }}
            >
              The future is not written. What happens next is up to you.
            </motion.p>
            <motion.p
              className={styles.prompt}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.0,
                delay: 3.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={handleClick}
            >
              CLICK TO BEGIN AGAIN
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
