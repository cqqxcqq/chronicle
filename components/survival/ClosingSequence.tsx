"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ClosingSequence.module.css";

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
  decimals?: number;
  duration?: number;
  delay?: number;
  label: string;
}

function AnimatedCounter({
  from,
  to,
  suffix = "",
  decimals = 0,
  duration = 3500,
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
        {display}{suffix}
      </p>
      <p className={styles.counterLabel}>{label}</p>
    </div>
  );
}

interface ClosingSequenceProps {
  onEnd: () => void;
  totalDeaths?: number;
  diedAtRound?: number;
  diedAtAge?: number;
}

export default function ClosingSequence({ onEnd, totalDeaths = 0, diedAtRound, diedAtAge }: ClosingSequenceProps) {
  const didDie = diedAtRound !== undefined && diedAtAge !== undefined;

  const lines = didDie
    ? [
        `You died at age ${diedAtAge} in the year ${1800 + diedAtRound * 25}.`,
        "You did not live to see what came next.",
        "But billions did. This is their story.",
      ]
    : [
        "You have seen two hundred years of human struggle.",
        "From darkness to light. From ignorance to knowledge.",
        "The story is not over.",
      ];

  const [lineIdx, setLineIdx] = useState(-1);
  const [showYear, setShowYear] = useState(false);
  const [showCounters, setShowCounters] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const [year, setYear] = useState(1800);
  const yearRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setLineIdx(0), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const onLineComplete = useCallback(() => {
    const next = lineIdx + 1;
    if (next < lines.length) {
      setTimeout(() => setLineIdx(next), 1200);
    } else {
      setTimeout(() => setShowYear(true), 1500);
    }
  }, [lineIdx, lines.length]);

  useEffect(() => {
    if (!showYear) return;
    const YEAR_DURATION = 6000;
    const HOLD_AFTER = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / YEAR_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setYear(Math.round(1800 + (2026 - 1800) * eased));
      if (progress < 1) {
        yearRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setShowCounters(true), HOLD_AFTER);
      }
    };

    yearRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(yearRef.current);
  }, [showYear]);

  useEffect(() => {
    if (!showCounters) return;
    const t = setTimeout(() => setShowTitle(true), 7000);
    return () => clearTimeout(t);
  }, [showCounters]);

  const handleClick = useCallback(() => {
    onEnd();
  }, [onEnd]);

  const handleSkip = useCallback(() => {
    setShowTitle(true);
    setShowYear(false);
    setShowCounters(false);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && showTitle) {
        onEnd();
      } else if (e.key === "Escape" && !showTitle) {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showTitle, onEnd, handleSkip]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!showYear && !showCounters && !showTitle && lineIdx >= 0 && lineIdx < lines.length && (
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

        {showYear && !showCounters && !showTitle && (
          <motion.div
            key="year"
            className={styles.yearScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className={styles.yearValue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
            >
              {year}
            </motion.p>
            <motion.p
              className={styles.yearLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.5 }}
            >
              1800 — 2026
            </motion.p>
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
          >
            <p className={styles.countersLabel}>WHAT CHANGED</p>
            <div className={styles.countersGrid}>
              <AnimatedCounter from={89} to={8.5} suffix="%" label="SDG 1 · poverty" delay={500} duration={3000} decimals={1} />
              <AnimatedCounter from={460} to={37} label="SDG 3 · child deaths" delay={1000} duration={3000} />
              <AnimatedCounter from={12} to={87} suffix="%" label="SDG 4 · literacy" delay={1500} duration={3000} />
              <AnimatedCounter from={29} to={73} suffix=" yr" label="SDG 3 · life expectancy" delay={2000} duration={3000} />
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
            {didDie && totalDeaths > 0 && (
              <motion.p
                className={styles.deathNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 1.2 }}
              >
                You died {totalDeaths} time{totalDeaths !== 1 ? "s" : ""}. Most people born in 1800 did not survive.
              </motion.p>
            )}
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

      {showSkip && !showTitle && (
        <motion.button
          className={styles.skipBtn}
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 0.8 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}
